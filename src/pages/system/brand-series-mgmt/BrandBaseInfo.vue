<template>
  <biz-grid class="brand-base-info">
    <biz-save-button slot="top" :operations="operations" @operate="operate">
    </biz-save-button>
    <el-form ref="form" :rules="rules" :model="form" label-width="100px" size="small" v-loading="loading">
      <el-form-item label="品牌名称" prop="name">
        <el-input placeholder="请输入品牌名称" v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item prop="parentId" label="上级品牌">
        <el-select v-model="form.parentId" filterable>
          <el-option v-for="item in parentBrandList " :key="item.id" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="Logo" prop="logo">
        <BrandSeriesUploader v-model="form.logo" @change="onChange">
        </BrandSeriesUploader>
      </el-form-item>
    </el-form>
  </biz-grid>
</template>

<script>
import BizSaveButton from '@/components/BizSaveButton';
import { BizGrid } from '@/components/BizGrid';
import BrandSeriesUploader from './BrandSeriesUploader';
import DefaultImg from '@/assets/images/commodity/brand-default.png';
import brandBaseInfoService from '@/service/system-setting/brand-series-mgmt/baseInfo';
// import urls from '@/common/urls';
// import axios from 'axios';
import http from '@/common/http';
export default {
  name: 'BrandBaseInfo',
  data() {
    const logoValid = (rule, rules, callback) => {
      if (this.form.logo) {
        callback();
      } else {
        callback(new Error('请输入品牌Logo'));
      }
    };
    return {
      isCreated: true,
      loading: false,
      list: [],
      DefaultImg: DefaultImg,
      parentBrandList: [],
      operations: [
        {
          label: '保存',
          name: 'save',
          type: 'primary'
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
        logo: [{ validator: logoValid, required: true, trigger: 'blur' }]
      }
    };
  },
  components: { BizSaveButton, BizGrid, BrandSeriesUploader },
  props: {
    id: {
      type: String,
      default: ''
    },
    refreshSign: Boolean,
    open: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    open(val) {
      this.$refs.form.clearValidate();
      if (!val) {
        this.isCreated = true;
        this.form.name = '';
        this.form.logo = DefaultImg;
      } else {
        if (this.id !== '') {
          this.isCreated = false;
        } else {
          this.form.name = '';
          this.form.logo = DefaultImg;
          this.form.parentId = '';
          this.isCreated = true;
          this.refresh();
        }
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
    operate(name) {
      this[name]();
    },
    getParentBrand() {
      let params = {};
      http
        .get('/admin/brand/json/topBrandList.jhtml', params)
        .then(data => {
          this.parentBrandList = data.brandDataList;
        })
        .catch(ErrorData => {
          this.loading = false;
          this.$message.warning(ErrorData.errorMessage || '操作出现错误');
        });
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
    onChange() {
      this.$refs.form.clearValidate();
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
          this.form.parentId = data.brandData.parentId;
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
        parentId: this.form.parentId,
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
    handleUploadSuccess(url) {
      this.form.logo = url;
    }
    // querySearchAsync: async function(queryString, callback) {
    //   let params = {
    //     // shopId: window.top.SHOP_ID || '',
    //     q: queryString
    //   };
    //   try {
    //     let response = await axios.get(urls.commodity.queryBrand, {
    //       params: params
    //     });
    //     for (let i of response.data.brandNames) {
    //       i.value = i.brand;
    //     }
    //     this.list = response.data.brandNames;
    //     callback(this.list);
    //   } catch (error) {
    //     console.error(error);
    //   }
    // },
    // handleSelect(item) {
    //   for (let i of this.list) {
    //     if (i.id === item.id) {
    //       this.form.logo = i.logo;
    //     }
    //   }
    //   console.log(item);
    // }
  }
};
</script>

<style lang="scss">
.brand-base-info {
  .biz-save-button {
    margin-top: 5px;
    justify-content: flex-start;
  }
  .el-input {
    width: 50%;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
}
</style>
