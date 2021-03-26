<template>
  <biz-grid class="bar-basic-info">
    <!-- <biz-save-button slot="top" :operations="operations" @operate="operate" v-if="isEdit">
    </biz-save-button> -->
    <biz-header :operations="operations" @operate="operate" v-if="isEdit">
    </biz-header>
    <el-form ref="form" :model="form" label-width="120px" size="small" v-loading="loading" :rules="rules" :disabled="!isEdit">
      <el-form-item label="流程名称" prop="name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="流程描述" prop="productCategory">
        <el-cascader v-model="form.productCategory.id" :options="categoryOptions" change-on-select :show-all-levels="false"
          @change="categoryChange"></el-cascader>
      </el-form-item>
      <el-form-item label="变更时间" prop="createDate">
        <el-input v-model="form.createDate" :disabled="true"></el-input>
      </el-form-item>
    </el-form>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import { BizHeader } from '@/components/BizTable';
import http from '@/common/http';
import urls from '@/common/urls';
import CategoryMgmtService from '@/service/commodity/category-mgmt/categoryMgmt';
import { mapGetters } from 'vuex';
import date from '@/utils/date.js';
// 组合tag，两个纯函数
const getOption = function(ary) {
  let options = [];
  for (const iterator of ary) {
    let obj = {
      value: iterator.id,
      label: iterator.name
    };
    if (iterator.childrenProductCategoryDataList && iterator.childrenProductCategoryDataList.length > 0) {
      obj.children = getOption(iterator.childrenProductCategoryDataList);
    }
    if (iterator.children && iterator.children.length > 0) {
      if (!obj.hasOwnProperty('children')) {
        obj.children = [];
      }
      let childrenProductCategoryDataList = getChildrenProductCategoryDataList(iterator.childrenProductCategoryDataList);
      for (const tag of childrenProductCategoryDataList) {
        obj.children.push(tag);
      }
    }
    options.push(obj);
  }
  return options;
};
const getChildrenProductCategoryDataList = function(array) {
  let childrenProductCategoryDataList = [];
  for (const iterator of array) {
    childrenProductCategoryDataList.push({
      label: iterator.name,
      value: iterator.id
    });
  }
  return childrenProductCategoryDataList;
};
export default {
  name: 'MemberBaseInfo',
  props: {
    itemId: {
      type: String,
      default() {
        return '';
      }
    },
    open: {
      type: Boolean,
      default() {
        return false;
      }
    },
    isEdit: {
      type: Boolean,
      default() {
        return true;
      }
    }
  },
  components: {
    BizGrid,
    BizHeader
  },
  data() {
    let productCategory = (rule, value, callback) => {
      if (this.form.productCategory.id.length === 0) {
        callback(new Error('请选择商品分类'));
      } else {
        callback();
      }
    };
    let codeRule = (rule, value, callback) => {
      if (!this.form.prefix && !this.form.middleCodeType && !this.form.postfixType) {
        // callback(new Error('请输入条码规则'));
        this.$message.warning('请输入条码规则');
      } else {
        callback();
      }
    };
    return {
      loading: false,
      // 用户信息
      form: this.getDefaultForm(),
      operations: [
        {
          label: '保存',
          name: 'save',
          type: 'primary'
        }
      ],
      selectionKeys: [],
      categoryOptions: [],
      productCategoryManage: [],
      // 红字错误提示
      errorMobile: '',
      errorRole: '',
      errUserName: '',
      errName: '',
      rules: {
        codeRule: [{ validator: codeRule, trigger: 'blur' }],
        name: [{ required: true, message: '请输入规则名称', trigger: 'blur' }],
        productCategory: [
          { required: true, message: '请选择商品分类', trigger: 'blur' },
          { validator: productCategory, trigger: 'blur' }
        ]
      }
    };
  },
  watch: {
    itemId: {
      handler: function(nVal) {
        if (nVal) {
          this.$refs.form.resetFields();
          this.query();
        } else {
          this.form = this.getDefaultForm();
        }
      }
    },
    open: {
      handler: function(nVal) {
        if (nVal && !this.itemId) {
          this.form = this.getDefaultForm();
        }
      }
    }
  },
  created() {
    this.getProductCategoryList();
  },
  methods: {
    ...mapGetters(['getUser']),
    operate(name) {
      this[name]();
    },
    clear() {
      this.$refs.form.clearValidate('codeRule');
    },
    getDefaultForm() {
      return {
        id: '',
        name: '',
        productCategory: {
          id: []
        },
        prefix: '',
        middleCodeType: '',
        postfixType: '',
        createDate: date.dateTimeConverter(new Date()),
        creator: ''
      };
    },
    categoryChange(val) {
      this.$refs.form.clearValidate('productCategory');
      // this.productCategoryManage.map(item => {
      //   console.log(item.name);
      //   if (item.id === val[val.length - 1] && item.type === 'car') {
      //     this.form.middleCodeType = '1';
      //   } else {
      //     if (item.childrenProductCategoryDataList) {
      //       item.childrenProductCategoryDataList.map(child => {
      //         if (child.id === val[val.length - 1] && child.type === 'car') {
      //           this.form.middleCodeType = '1';
      //         }
      //       });
      //     }
      //   }
      // });
    },
    getProductCategoryList(shopId) {
      let params = {
        shopId: shopId || window.top.SHOP_ID || '',
        pageNumber: 1,
        pageSize: 1000
      };
      CategoryMgmtService.getProductCategoryList(
        params,
        data => {
          this.productCategoryManage = data.ProductCategoryManage;
          this.categoryOptions = getOption(data.ProductCategoryManage);
          this.loading = false;
        },
        // result_code 不是100的处理
        ErrorData => {
          console.log(ErrorData);
          this.$message.warning(ErrorData.errorMessage);
          this.loading = false;
        }
      );
    },
    // 显示消息提示
    showNotify(msg, type) {
      this.$notify({
        showClose: true,
        message: msg,
        type: type
      });
    },
    getParentCategory(ary, id) {
      this.form.productCategory.id = [];
      ary.forEach((element, index) => {
        if (element.value === id) {
          this.form.productCategory.id.unshift(element.value);
          return false;
        } else {
          element.children &&
            element.children.forEach(element1 => {
              if (element1.value === id) {
                this.form.productCategory.id.unshift(element1.value);
                this.form.productCategory.id.unshift(element.value);
                console.log(this.form.productCategory.id);
                return false;
              } else {
                element1.children &&
                  element1.children.forEach(element2 => {
                    if (element2.value === id) {
                      this.form.productCategory.id.unshift(element2.value);
                      this.form.productCategory.id.unshift(element1.value);
                      this.form.productCategory.id.unshift(element.value);
                      return false;
                    } else {
                      element2.children &&
                        element2.children.forEach(element3 => {
                          if (element3.value === id) {
                            this.form.productCategory.id.unshift(element3.value);
                            this.form.productCategory.id.unshift(element2.value);
                            this.form.productCategory.id.unshift(element1.value);
                            this.form.productCategory.id.unshift(element.value);
                            return false;
                          }
                        });
                    }
                  });
              }
            });
        }
      });
    },
    query() {
      this.loading = true;
      http
        .get(urls.invoicing.barCode.barCode, { shopId: window.top.SHOP_ID || '', id: this.itemId })
        .then(data => {
          this.loading = false;
          this.form = Object.assign(this.getDefaultForm(), data.data);
          this.form.productCategory.id = [data.data.productCategory.id];
          this.getParentCategory(this.categoryOptions, this.form.productCategory.id[0]);
        })
        .catch(errData => {
          this.loading = false;
          console.log(errData);
          console.log('code错误');
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    getSaveParams() {
      return {
        id: this.form.id,
        name: this.form.name,
        productCategory: {
          id: this.form.productCategory.id[this.form.productCategory.id.length - 1]
        },
        prefix: this.form.prefix,
        middleCodeType: this.form.middleCodeType,
        postfixType: this.form.postfixType
      };
    },
    save() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true;
          this.itemId &&
            http
              .put(urls.invoicing.barCode.barCode, this.getSaveParams())
              .then(data => {
                this.$message.success('保存成功');
                this.$emit('operationSuccess');
                this.loading = false;
              })
              .catch(error => {
                this.loading = false;
                this.$message.warning(error.errorMessage);
              })
              .finally(data => {
                this.loading = false;
              });
          !this.itemId &&
            http
              .post(urls.invoicing.barCode.barCode, this.getSaveParams())
              .then(data => {
                this.$message.success('保存成功');
                this.$emit('operationSuccess');
                this.loading = false;
              })
              .catch(error => {
                this.loading = false;
                this.$message.warning(error.errorMessage);
              })
              .finally(data => {
                this.loading = false;
              });
        }
      });
    }
  }
};
</script>

<style lang="scss">
.bar-basic-info {
  .el-form {
    overflow: auto;
    width: 100%;
    padding-right: 20px;
  }
  .el-cascader {
    width: 100%;
  }
  .el-select {
    width: 100%;
  }
  .el-form-item.isRequired .el-form-item__label:before {
    content: '*';
    color: #f56c6c;
    margin-right: 4px;
  }
  .biz-header {
    float: left;
  }
  .el-row {
    margin: 30px;
    font-size: 14px;
  }
  .el-form-item__content > :first-child {
    margin-top: 0;
  }
  .el-checkbox-group .el-checkbox {
    width: 170px;
    margin: 0;
  }
  .el-col .el-input {
    width: 80%;
  }
  .el-input--suffix .el-input__inner {
    height: 32px;
    line-height: 32px;
  }
  .grid-content {
    height: 32px;
    line-height: 32px;
  }
}
</style>
