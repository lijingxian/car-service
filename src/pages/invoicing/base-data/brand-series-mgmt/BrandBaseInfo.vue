<template>
  <biz-grid class="brand-base-info">
    <biz-save-button slot="top" :operations="operations" @operate="operate" v-if="isEdit">
    </biz-save-button>
    <el-form ref="form" :rules="rules" :model="form" label-width="100px" size="small" v-loading="loading" :disabled="!isEdit">
      <el-form-item label="品牌名称" prop="name">
        <el-autocomplete :trigger-on-focus="false" placeholder="请输入品牌首字母查找品牌" v-model="form.name" :fetch-suggestions="querySearchAsync" @select="handleSelect"></el-autocomplete>
      </el-form-item>
      <el-form-item label="Logo" prop="logo">
        <BrandSeriesUploader v-model="form.logo" @handleUploadSuccess="handleUploadSuccess">
        </BrandSeriesUploader>
      </el-form-item>
    </el-form>
  </biz-grid>
</template>

<script>
import BizSaveButton from '@/components/BizSaveButton';
import { BizGrid } from '@/components/BizGrid';
import BrandSeriesUploader from './BrandSeriesUploader';
import brandBaseInfoService from '@/service/commodity/brand-series-mgmt/baseInfo';
import urls from '@/common/urls';
import axios from 'axios';

export default {
  name: 'BrandBaseInfo',
  data() {
    return {
      isCreated: true,
      loading: false,
      list: [],
      operations: [
        {
          label: '保存',
          name: 'save',
          type: 'primary',
          auth: ['admin:PurchaseSaleStorage.brand.edit']
        }
      ],
      form: {
        id: '',
        name: '',
        logo: ''
      },
      rules: {
        name: [{ required: true, message: '请输入品牌名称', trigger: 'blur' }],
        logo: [{ required: true, message: '请输入品牌Logo', trigger: 'blur' }]
      }
    };
  },
  components: { BizSaveButton, BizGrid, BrandSeriesUploader },
  props: {
    id: {
      type: String,
      default: ''
    },
    isEdit: {
      type: Boolean,
      default () {
        return true;
      }
    },
    refreshSign: Boolean
  },
  watch: {
    id: function(id) {
      this.$refs.form.clearValidate();
      if (id === '') {
        this.isCreated = true;
        this.form.name = '';
        this.form.logo = '';
      }
    },
    refreshSign: function() {
      this.isCreated = false;
      this.refresh();
    }
  },
  created() {},
  computed: {},
  methods: {
    operate(name) {
      this[name]();
    },
    save() {
      this.$refs.form.validate(valid => {
        if (valid) {
          if (this.isCreated) {
            this.createBrand();
          } else {
            this.updateBrand();
          }
        } else {
          return false;
        }
      });
    },
    refresh() {
      let params = {
        id: this.id
      };
      brandBaseInfoService.queryByBrand(
        params,
        data => {
          this.form.name = data.brandData.name;
          this.form.logo = data.brandData.logo;
        },
        ErrorData => {
          console.log(ErrorData);
        }
      );
    },
    createBrand() {
      let params = {
        name: this.form.name,
        logo: this.form.logo,
        type: 'image'
      };
      brandBaseInfoService.createBrand(
        params,
        data => {
          this.$message.success('操作成功');
          this.$emit('created');
        },
        ErrorData => {
          this.$message.warning(ErrorData.errorMessage);
        }
      );
    },
    updateBrand() {
      let params = {
        id: this.id,
        name: this.form.name,
        logo: this.form.logo
        // type: 'image'
      };
      brandBaseInfoService.updateBrand(
        params,
        data => {
          this.$message.success('操作成功');
          this.$emit('created');
        },
        ErrorData => {
          this.$message.warning(ErrorData.errorMessage);
        }
      );
    },
    handleUploadSuccess(url) {
      this.form.logo = url;
      this.$refs.form.clearValidate(['logo']);
    },
    querySearchAsync: async function(queryString, callback) {
      let params = {
        shopId: window.top.SHOP_ID || '',
        q: queryString
      };
      try {
        let response = await axios.get(urls.commodity.queryBrand, {
          params: params
        });
        for (let i of response.data.brandNames) {
          i.value = i.brand;
        }
        this.list = response.data.brandNames;
        callback(this.list);
      } catch (error) {
        console.error(error);
      }
    },
    handleSelect(item) {
      for (let i of this.list) {
        if (i.id === item.id) {
          this.form.logo = i.logo;
        }
      }
      console.log(item);
    },
    clear() {
      this.isCreated = true;
      this.form = {
        id: '',
        name: '',
        logo: ''
      };
    }
  }
};
</script>

<style lang="scss">
.brand-base-info {
  .biz-save-button {
    margin-top: 5px;
    justify-content: flex-start;
  }
  .el-autocomplete {
    width: 80%;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
}
</style>
