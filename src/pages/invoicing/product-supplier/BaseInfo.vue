<template>
  <biz-grid class="add-product-base-info">
    <biz-save-button slot="top" :operations="operations" @operate="operate" v-if="isEdit"></biz-save-button>
    <el-form
      ref="productDataForm"
      label-width="130px"
      size="small"
      v-loading="loading"
      :model="productDataModel"
      :rules="productDataRules"
      :disabled="!isEdit"
      :inline-message="true"
    >
      <el-form-item label="商品编号：">
        <el-input :placeholder="productDataModel.id?'请输入编号':'创建成功后自动生成'" v-model="productDataModel.sn" :readonly="true" :disabled="true" style="width: 80%;"></el-input>
      </el-form-item>
      <el-form-item label="商品条码：" prop="barCode">
        <el-input v-model="productDataModel.barCode" placeholder="请输入条码" style="width: 80%;"></el-input>
      </el-form-item>
      <el-form-item label="商品分类：" :required="true">
        <el-cascader v-model="productDataModel.categoryId" :options="categoryOptions" change-on-select :show-all-levels="false" @change="categoryChange"></el-cascader>
      </el-form-item>
      <product-category-select
        :initializing="initializing"
        :refreshSign="refreshSign"
        :brandId.sync="productDataModel.brandId"
        :categoryId="productDataModel.categoryId[0]"
        :seriesId.sync="productDataModel.seriesId"
        :name.sync="productDataModel.name"
      ></product-category-select>
      <!-- <el-form-item label="商品名称：" prop="name">
        <el-input v-model="productDataModel.name" placeholder="请输入名称" style="width: 80%;"></el-input>
      </el-form-item>-->
      <!-- <el-form-item label="车辆识别码：" v-if="isShowVin">
        <el-input v-model="productDataModel.vin" placeholder="请输入车辆识别码(VIN码)" style="width: 80%;"></el-input>
      </el-form-item>-->
      <el-form-item label="批发价：" prop="purchasePrice">
        <el-input placeholder="请输入批发价" v-model="productDataModel.purchasePrice" style="width: 80%;"></el-input>
      </el-form-item>
      <el-form-item label="商品缩略图：" prop="image">
        <BizAvatarUploaderNew v-model="productDataModel.image" @uploadSuccess="uploadSuccess"></BizAvatarUploaderNew>
      </el-form-item>
      <el-form-item label="支付方式：" prop="paymentMethodIds">
        <el-checkbox-group v-model="productDataModel.paymentMethodIds">
          <el-checkbox v-for="item in payOptions" :key="item.id" :label="item.id">{{item.name}}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="配送方式：" prop="shippingMethodIds">
        <el-checkbox-group class="shipping-method" v-model="productDataModel.shippingMethodIds">
          <el-checkbox v-for="item in shippingMethods" :key="item.id" :label="item.id" :disabled="isCarOrService&&item.name!=='到店服务'">{{item.name}}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
    </el-form>
    <VueCropper :open="openV" :picUrl="picUrl" @close="close" @handelSuccess="handelSuccess"></VueCropper>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import BizSaveButton from '@/components/BizSaveButton';
import { BizAvatarUploaderNew } from '@/components/BizForm';
import ProductCategorySelect from './components/ProductCategorySelect';
import http from '@/common/http';
import CategoryMgmtService from '@/service/commodity/category-mgmt/categoryMgmt';
import urls from '@/common/urls';
import { VueCropper } from '@/components/BizForm';
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
  name: 'CommodityMgmtBaseInfo',
  data() {
    const isCategoryId = (rule, rules, callback) => {
      if (this.productDataModel.categoryId && this.productDataModel.categoryId.length > 0) {
        callback();
      } else {
        callback(new Error('请选择商品分类'));
      }
    };
    const isCostValid = (rule, rules, callback) => {
      if (this.productDataModel.purchasePrice && Number(this.productDataModel.purchasePrice) >= 0) {
        callback();
      } else {
        callback(new Error('批发价必须为数字值'));
      }
    };
    const isSelectPaymentMethod = (rule, rules, callback) => {
      if (this.productDataModel.paymentMethodIds.length > 0) {
        callback();
      } else {
        callback(new Error('请至少选择一种支付方式'));
      }
    };

    const isSelectShippingMethod = (rule, rules, callback) => {
      if (this.productDataModel.shippingMethodIds.length > 0) {
        callback();
      } else {
        callback(new Error('请至少选择一种配送方式'));
      }
    };
    const isImageValid = (rule, rules, callback) => {
      if (typeof this.productDataModel.image !== 'undefined') {
        if (this.productDataModel.image !== '') {
          callback();
        } else {
          callback(new Error('缩略图必须上传'));
        }
      } else {
        callback(new Error('缩略图必须上传'));
      }
    };
    return {
      operations: [
        {
          label: '保存',
          name: 'save',
          type: 'primary',
          disabled: false
        }
      ],
      productDataRules: {
        categoryId: [
          {
            required: true,
            trigger: 'blur',
            validator: isCategoryId
          }
        ],
        purchasePrice: [
          {
            required: true,
            trigger: 'blur',
            validator: isCostValid
          }
        ],
        paymentMethodIds: [
          {
            required: true,
            trigger: 'blur',
            validator: isSelectPaymentMethod
          }
        ],
        shippingMethodIds: [
          {
            required: true,
            trigger: 'blur',
            validator: isSelectShippingMethod
          }
        ],
        image: [
          {
            required: true,
            trigger: 'blur',
            validator: isImageValid
          }
        ],
        name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }]
      },
      openV: false,
      picUrl: '',
      isCreated: 'true',
      defaultImg: '/resources/admin/images/default/product-default.png',
      productDataModel: this.getDefaultProductDataModel(),
      categoryOptions: [],
      payOptions: [],
      shippingMethods: [],
      productCategoryManage: [],
      inputVisible: false,
      inputValue: '',
      loading: false,
      refreshSign: true,
      initializing: false
    };
  },
  components: {
    BizGrid,
    BizSaveButton,
    BizAvatarUploaderNew,
    ProductCategorySelect,
    VueCropper
  },
  props: {
    id: {
      type: String,
      default: ''
    },
    tabSelection: {
      type: String
    },
    open: {
      type: Boolean
    },
    isEdit: {
      type: Boolean,
      default() {
        return true;
      }
    },
    baseInfo: {
      type: Object
    }
  },
  watch: {
    open(val) {
      if (!val) {
        this.isCreated = true;
        this.payOptions = [];
        this.shippingMethods = [];
      } else {
        if (this.id !== '') {
          this.isCreated = false;
        } else {
          this.isCreated = true;
          this.productDataModel = this.getDefaultProductDataModel();
          this.queryPaymentMethods();
          this.queryShippingMethods();
        }
      }
    },
    id(nVal, oVal) {
      if (nVal) {
        if (this.open === true && this.tabSelection === 'baseinfo') {
          this.getProductCategoryList(this.baseInfo.shopId);
          this.queryPaymentMethods();
          this.queryShippingMethods();
          this.$nextTick(() => {
            this.refresh();
          });
        }
      } else {
        this.productDataModel = this.getDefaultProductDataModel();
      }
    }
  },
  created() {
    this.getDefaultImg();
    this.getProductCategoryList();
  },
  computed: {
    isShowVin() {
      let flag = false;
      this.productCategoryManage.map(item => {
        console.log(item.name);
        if (item.id === this.productDataModel.categoryId[this.productDataModel.categoryId.length - 1] && item.type === 'car') {
          flag = true;
        } else {
          if (item.childrenProductCategoryDataList) {
            item.childrenProductCategoryDataList.map(child => {
              if (
                child.id === this.productDataModel.categoryId[this.productDataModel.categoryId.length - 1] &&
                child.type === 'car'
              ) {
                flag = true;
              }
            });
          }
        }
      });
      return flag;
    },
    isCarOrService() {
      let flag = false;
      console.log(this.productCategoryManage);
      this.productCategoryManage.map(item => {
        console.log(item.name);
        if (
          item.id === this.productDataModel.categoryId[this.productDataModel.categoryId.length - 1] &&
          (item.type === 'car' || item.type === 'carService')
        ) {
          flag = true;
        } else {
          if (item.childrenProductCategoryDataList) {
            item.childrenProductCategoryDataList.map(child => {
              if (
                child.id === this.productDataModel.categoryId[this.productDataModel.categoryId.length - 1] &&
                (child.type === 'car' || child.type === 'carService')
              ) {
                flag = true;
              }
            });
          }
        }
      });
      return flag;
    }
  },
  methods: {
    uploadSuccess(url) {
      console.log('uploadSuccess');
      this.picUrl = url;
      this.openV = true;
    },
    close() {
      this.openV = false;
    },
    handelSuccess(url) {
      this.productDataModel.image = url;
    },
    operate(name) {
      this[name]();
    },
    categoryChange(val) {
      console.log(this.productDataModel.categoryId);
    },
    getDefaultImg() {
      let params = {
        type: 'displaySetting'
      };
      http
        .get('/admin/settings/settings.jhtml', params)
        .then(data => {
          if (data.settingList.defaultThumbnailProductImage) {
            this.defaultImg = data.settingList.defaultThumbnailProductImage;
          }
        })
        .catch(errData => {
          console.log(errData);
          console.log('code错误');
          this.$message.warning(errData.errorMessage);
        });
    },
    getDefaultProductDataModel() {
      return {
        shopId: window.top.SHOP_ID || '',
        id: '',
        sn: '',
        categoryId: [],
        fullName: '',
        brandId: '',
        seriesId: '',
        name: '',
        image: this.defaultImg,
        purchasePrice: '',
        paymentMethodIds: [],
        shippingMethodIds: [],
        barCode: '',
        vin: ''
      };
    },
    getSaveProductDataModel() {
      let ids = [];
      for (const iterator of this.productDataModel.paymentMethodIds) {
        ids.push({ id: iterator });
      }

      this.productCategoryManage.map(item => {
        console.log(item.name);
        if (
          item.id === this.productDataModel.categoryId[this.productDataModel.categoryId.length - 1] &&
          (item.type === 'car' || item.type === 'carService')
        ) {
          // 整车和服务商品默认配送方式为到店服务
          this.shippingMethods.map(item => {
            if (item.name === '到店服务') {
              this.productDataModel.shippingMethodIds = [item.id];
            }
          });
        } else {
          if (item.childrenProductCategoryDataList) {
            item.childrenProductCategoryDataList.map(child => {
              if (
                child.id === this.productDataModel.categoryId[this.productDataModel.categoryId.length - 1] &&
                (child.type === 'car' || child.type === 'carService')
              ) {
                // 整车和服务商品默认配送方式为到店服务
                this.shippingMethods.map(item => {
                  if (item.name === '到店服务') {
                    this.productDataModel.shippingMethodIds = [item.id];
                  }
                });
              }
            });
          }
        }
      });
      for (const iterator of this.shippingMethods) {
        iterator.productValid = '0';
        if (this.productDataModel.shippingMethodIds.indexOf(iterator.id) !== -1) {
          iterator.productValid = '1';
        }
      }

      return {
        shopId: this.productDataModel.shopId,
        id: this.productDataModel.id,
        sn: this.productDataModel.sn,
        categoryId: this.productDataModel.categoryId[this.productDataModel.categoryId.length - 1],
        brandId: this.productDataModel.brandId,
        seriesId: this.productDataModel.seriesId,
        name: this.productDataModel.name,
        fullName: this.productDataModel.fullName,
        image: this.productDataModel.image,
        purchasePrice: this.productDataModel.purchasePrice || '0',
        paymentMethods: ids,
        shippingMethods: this.shippingMethods,
        barCode: this.productDataModel.barCode,
        vin: this.productDataModel.vin
      };
    },
    handleUploadSuccess(url) {
      console.log(url);
      this.productDataModel.image = url;
    },
    getParentCategory(ary, id) {
      this.productDataModel.categoryId = [];
      ary.forEach((element, index) => {
        if (element.value === id) {
          this.productDataModel.categoryId.unshift(element.value);
          return false;
        } else {
          element.children &&
            element.children.forEach(element1 => {
              if (element1.value === id) {
                this.productDataModel.categoryId.unshift(element1.value);
                this.productDataModel.categoryId.unshift(element.value);
                console.log(this.productDataModel.categoryId);
                return false;
              } else {
                element1.children &&
                  element1.children.forEach(element2 => {
                    if (element2.value === id) {
                      this.productDataModel.categoryId.unshift(element2.value);
                      this.productDataModel.categoryId.unshift(element1.value);
                      this.productDataModel.categoryId.unshift(element.value);
                      return false;
                    } else {
                      element2.children &&
                        element2.children.forEach(element3 => {
                          if (element3.value === id) {
                            this.productDataModel.categoryId.unshift(element3.value);
                            this.productDataModel.categoryId.unshift(element2.value);
                            this.productDataModel.categoryId.unshift(element1.value);
                            this.productDataModel.categoryId.unshift(element.value);
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
    queryPaymentMethods() {
      let params = {
        shopId: window.top.SHOP_ID || ''
      };
      http
        .get(urls.invoicing.productMgmt.shopPaymentMethods, params)
        .then(data => {
          this.payOptions = data.paymentMethods;
          this.productDataModel.paymentMethodIds = [];
          for (const iterator of this.payOptions) {
            this.productDataModel.paymentMethodIds.push(iterator.id);
          }
        })
        .catch(errData => {
          console.log(errData);
          console.log('code错误');
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    queryShippingMethods() {
      let params = {
        shopId: window.top.SHOP_ID || ''
      };
      http
        .get(urls.invoicing.productMgmt.shopShippingMethods, params)
        .then(data => {
          this.shippingMethods = data.dataList;
          this.productDataModel.shippingMethodIds = [];
          for (const iterator of this.shippingMethods) {
            this.productDataModel.shippingMethodIds.push(iterator.id);
          }
        })
        .catch(errData => {
          console.log(errData);
          console.log('code错误');
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    refresh() {
      this.initializing = true;
      this.loading = true;
      let params = {
        id: this.id,
        shopId: window.top.SHOP_ID || ''
      };
      http
        .get(urls.invoicing.productMgmt.supplierBasicInfo, params)
        .then(data => {
          this.refreshSign = !this.refreshSign;
          this.productDataModel = this.convert2ProductDataModel(data.data);
          this.getParentCategory(this.categoryOptions, this.productDataModel.categoryId[0]);
          this.$nextTick(() => {
            this.initializing = false;
            this.loading = false;
          });
        })
        .catch(errData => {
          console.log(errData);
          console.log('code错误');
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    convert2ProductDataModel(productBasicInfoData) {
      let ids = [];
      for (const item of productBasicInfoData.paymentMethods) {
        ids.push(item.id);
      }
      let shippingIds = [];
      for (const item of productBasicInfoData.shippingMethods) {
        shippingIds.push(item.id);
      }
      return {
        shopId: productBasicInfoData.shopId,
        id: productBasicInfoData.id,
        sn: productBasicInfoData.sn,
        barCode: productBasicInfoData.barCode,
        vin: productBasicInfoData.vin,
        fullName: productBasicInfoData.fullName,
        categoryId: [productBasicInfoData.categoryId],
        brandId: productBasicInfoData.brandId,
        seriesId: productBasicInfoData.seriesId,
        name: productBasicInfoData.name,
        image: productBasicInfoData.image ? productBasicInfoData.image : this.defaultImg,
        purchasePrice: productBasicInfoData.purchasePrice || '0.00',
        paymentMethodIds: ids,
        shippingMethodIds: shippingIds
      };
    },
    save() {
      if (this.productDataModel.name === '') {
        this.$message.warning('商品名称不能为空');
        return;
      }
      if (this.productDataModel.categoryId[0] === '') {
        this.$message.warning('商品分类不能为空');
        return;
      }

      this.$refs.productDataForm.validate(valid => {
        if (valid) {
          if (this.isCreated) {
            this.createProduct();
          } else {
            this.updateProduct();
          }
        } else {
          return false;
        }
      });
    },
    createProduct() {
      let params = this.getSaveProductDataModel();
      http
        .post(urls.invoicing.productMgmt.supplierBasicInfo, params)
        .then(data => {
          this.$message.success('添加商品基本信息成功');
          this.id = data.id;
          this.isCreated = false;
          this.refresh();
          this.$emit('operationSuccess');
          this.$emit('createdProductSuccess', data.id);
        })
        .catch(errData => {
          console.log(errData);
          console.log('code错误');
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    updateProduct() {
      let params = this.getSaveProductDataModel();
      http
        .put(urls.invoicing.productMgmt.supplierBasicInfo, params)
        .then(data => {
          this.refresh();
          this.$message.success('更新商品基本信息成功');
          this.$emit('operationSuccess');
        })
        .catch(errData => {
          console.log(errData);
          console.log('code错误');
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(() => {
          this.loading = false;
        });
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
    }
  }
};
</script>

<style lang="scss">
.add-product-base-info {
  .biz-save-button {
    margin-top: 5px;
    justify-content: flex-start;
  }
  .el-form-item.isRequired .el-form-item__label:before {
    content: '*';
    color: #f56c6c;
    margin-right: 4px;
  }
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
  .shipping-method {
    display: flex;
    flex-wrap: wrap;
    .el-checkbox {
      margin-left: 0px;
      width: 110px;
    }
  }
}
</style>
