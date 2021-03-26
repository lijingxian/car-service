<template>
  <biz-grid class="brand-base-info">
    <biz-save-button slot="top" :operations="operations" @operate="operate" v-if="isEdit">
    </biz-save-button>
    <el-form ref="form" :rules="rules" :model="form" label-width="100px" size="small" v-loading="loading" :disabled="!isEdit">
      <el-form-item label="品牌名称" prop="name">
        <el-autocomplete :trigger-on-focus="false" placeholder="请输入品牌名称" v-model="form.name" :fetch-suggestions="querySearchAsync" @select="handleSelect"></el-autocomplete>
      </el-form-item>
      <el-form-item prop="parentId" label="上级品牌">
        <el-select v-model="form.parentId" filterable>
          <el-option v-for="item in parentBrandList " :key="item.id" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="Logo" prop="logo">
        <BizAvatarUploaderNew v-model="form.logo" @uploadSuccess="uploadSuccess">
        </BizAvatarUploaderNew>
      </el-form-item>
    </el-form>
    <VueCropper :open="openV" :picUrl="picUrl" @close="close" @handelSuccess="handelSuccess"></VueCropper>
  </biz-grid>
</template>

<script>
import BizSaveButton from '@/components/BizSaveButton';
import { BizGrid } from '@/components/BizGrid';
import brandBaseInfoService from '@/service/commodity/brand-series-mgmt/baseInfo';
import urls from '@/common/urls';
import axios from 'axios';
import http from '@/common/http';
import DefaultImg from '@/assets/images/commodity/brand-default.png';
import { BizAvatarUploaderNew } from '@/components/BizForm';
import { VueCropper } from '@/components/BizForm';
export default {
  name: 'BrandBaseInfo',
  data() {
    return {
      openV: false,
      picUrl: '',
      isCreated: true,
      loading: false,
      list: [],
      DefaultImg: DefaultImg,
      parentBrandList: [],
      operations: [
        {
          label: '保存',
          name: 'save',
          type: 'primary',
          auth: ['admin:shopBrand.edit']
        }
      ],
      form: {
        id: '',
        name: '',
        logo: DefaultImg,
        parentId: ''
      },
      rules: {
        name: [{ required: true, message: '请输入品牌名称', trigger: 'blur' }],
        logo: [{ required: true, message: '请输入品牌Logo', trigger: 'blur' }]
      }
    };
  },
  components: { BizSaveButton, BizGrid, BizAvatarUploaderNew, VueCropper },
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
        this.form.logo = DefaultImg;
      }
    },
    refreshSign: function() {
      this.isCreated = false;
      this.refresh();
    }
  },
  created() {
    this.getParentBrand();
  },
  computed: {},
  methods: {
    close() {
      this.openV = false;
    },
    handelSuccess(url) {
      this.form.logo = url;
    },
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
    getParentBrand() {
      let params = {};
      http
        .get('/admin/shopBrand/topBrandList.jhtml', params)
        .then(data => {
          this.parentBrandList = data.Brand;
        })
        .catch(ErrorData => {
          this.loading = false;
          this.$message.warning(ErrorData.errorMessage || '操作出现错误');
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
          this.form.parentId = data.brandData.parentId;
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
        type: 'image',
        parentId: this.form.parentId
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
        logo: this.form.logo,
        parentId: this.form.parentId
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
    uploadSuccess(url) {
      console.log(url);
      this.picUrl = url;
      this.openV = true;
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
        logo: DefaultImg,
        parentId: ''
      };
    }
  }
};
</script>

<style lang="scss">
.brand-base-info {
  .biz-save-button {
    margin-top: 5px;
    float: left;
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
