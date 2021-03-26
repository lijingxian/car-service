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
      <el-form-item label="商品编号">
        <el-input :placeholder="productDataModel.id?'请输入编号':'创建成功后自动生成'" v-model="productDataModel.sn" :readonly="true" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="商品条码" prop="barCode">
        <el-input v-model="productDataModel.barCode" placeholder="请输入条码"></el-input>
      </el-form-item>
      <el-form-item label="商品分类" :required="true">
        <el-cascader v-model="productDataModel.categoryId" :options="categoryOptions" change-on-select :show-all-levels="false" @change="categoryChange"></el-cascader>
      </el-form-item>
      <!-- <el-form-item label="车辆识别码：" v-if="isShowVin">
        <el-input v-model="productDataModel.vin" placeholder="请输入车辆识别码(VIN码)" style="width: 80%;"></el-input>
      </el-form-item>-->
      <el-form-item label="品牌">
        <el-select v-model="productDataModel.brandName" placeholder="请输入品牌" @change="brandChange">
          <el-option v-for="item in brandOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="系列">
        <el-select :value="productDataModel.seriesId" placeholder="请输入系列" @change="seriesChange">
          <el-option v-for="item in seriesOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="商品名称" prop="name">
        <el-input type="textarea" :rows="3" :maxlength="30" show-word-limit v-model="productDataModel.name" placeholder="请输入名称"></el-input>
      </el-form-item>
      <el-form-item label="商品类型">
        <el-select v-model="productDataModel.productType" :disabled="isCreated === false" placeholder="请选择商品类型" @change="productTypeChange">
          <el-option v-for="item of productTypes" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="零售价：" prop="price">
        <el-input placeholder="请输入销售价" v-model="productDataModel.price"></el-input>
      </el-form-item>
      <el-form-item label="一级代理商价" prop="wholesalePrice">
        <el-input placeholder="请输入一级代理商价" v-model="productDataModel.wholesalePrice"></el-input>
      </el-form-item>
      <el-form-item label="二级代理商价" prop="agent2Price">
        <el-input placeholder="请输入二级代理商价" v-model="productDataModel.agent2Price"></el-input>
      </el-form-item>
      <el-form-item label="三级代理商价" prop="agent3Price">
        <el-input placeholder="请输入三级代理商价" v-model="productDataModel.agent3Price"></el-input>
      </el-form-item>
      <el-form-item label="采购价：" prop="purchasePrice">
        <el-input placeholder="请输入采购价" v-model="productDataModel.purchasePrice" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="供应商：" prop="supplierId">
        <el-select v-model="productDataModel.supplier.id" clearable placeholder="请选择供应商" @change="supplierChange">
          <el-option v-for="item in supplierDatas" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item> -->
      <el-form-item label="最小包装数" prop="minimumPackQuantity">
        <el-input placeholder="请输入最小包装数" v-model="productDataModel.minimumPackQuantity"></el-input>
      </el-form-item>
      <el-form-item label="库存预警上限" prop="stockAlertMax">
        <el-input placeholder="请输入库存预警上限" v-model="productDataModel.stockAlertMax"></el-input>
      </el-form-item>
      <el-form-item label="库存预警下限" prop="stockAlertMin">
        <el-input placeholder="请输入存预警下限" v-model="productDataModel.stockAlertMin"></el-input>
      </el-form-item>
      <el-form-item label="支付方式" prop="paymentMethodIds" v-if="isNeedToShowPaymentMethod">
        <el-checkbox-group v-model="productDataModel.paymentMethodIds">
          <el-checkbox v-for="item in payOptions" :key="item.id" :label="item.id">{{item.name}}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="配送方式" prop="shippingMethodIds" v-show="productDataModel.productType!=='7'">
        <el-checkbox-group class="shipping-method" v-model="productDataModel.shippingMethodIds">
          <el-checkbox v-for="item in shippingMethods" :key="item.id" :label="item.id" :disabled="isCarOrService&&item.name!=='到店服务'">{{item.name}}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="" v-if="!!itemId">
        <div @click="paramClick()" style="cursor:pointer">
          <img style="width:20px;height:10px" src="../../../../assets/images/commodity/param.png"/>
          <span>更多参数</span>
        </div>
      </el-form-item>
    </el-form>
    <el-dialog :visible="paramDialogOpen" :open="paramDialogOpen" @close="paramDialogOpen=false" append-to-body width="500px">
      <Parameter :itemId="this.itemId" v-if="paramDialogOpen" :categoryId="categoryId" :isEdit="isEdit" @cancel="cancel">
      </Parameter>
    </el-dialog>
    <!-- <VueCropper :open="openV" :picUrl="picUrl" @close="close" @handelSuccess="handelSuccess"></VueCropper> -->
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import BizSaveButton from '@/components/BizSaveButton';
import BaseInfoService from '@/service/commodity/commodity-mgmt/baseInfo';
// import { BizAvatarUploaderNew } from '@/components/BizForm';
import http from '@/common/http';
import CategoryMgmtService from '@/service/commodity/category-mgmt/categoryMgmt';
import urls from '@/common/urls';
import Parameter from './Parameter';
// import { VueCropper } from '@/components/BizForm';
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
    const isPriceValid = (rule, rules, callback) => {
      if (this.productDataModel.price && Number(this.productDataModel.price) >= 0) {
        callback();
      } else {
        callback(new Error('销售价必须为数字值'));
      }
    };
    const isCostValid = (rule, rules, callback) => {
      if (Number(this.productDataModel.wholesalePrice) >= 0) {
        callback();
      } else {
        callback(new Error('一级代理商价必须为数字值'));
      }
    };
    const isAgent2Valid = (rule, rules, callback) => {
      if (Number(this.productDataModel.agent2Price) >= 0) {
        callback();
      } else {
        callback(new Error('二级代理商价必须为数字值'));
      }
    };
    const isAgent3Valid = (rule, rules, callback) => {
      if (Number(this.productDataModel.agent3Price) >= 0) {
        callback();
      } else {
        callback(new Error('三级代理商价必须为数字值'));
      }
    };
    const isSelectPaymentMethod = (rule, rules, callback) => {
      if (this.productDataModel.productType === '2' || this.productDataModel.productType === '7') {
        callback();
      } else if (this.productDataModel.paymentMethodIds.length > 0) {
        callback();
      } else {
        callback(new Error('请至少选择一种支付方式'));
      }
    };

    const isSelectShippingMethod = (rule, rules, callback) => {
      if (this.productDataModel.productType === '7' || this.productDataModel.shippingMethodIds.length > 0) {
        callback();
      } else {
        this.$message.warning('请至少选择一种配送方式');
        callback(new Error('请至少选择一种配送方式'));
      }
    };
    // const isImageValid = (rule, rules, callback) => {
    //   if (typeof this.productDataModel.image !== 'undefined') {
    //     if (this.productDataModel.image !== '') {
    //       callback();
    //     } else {
    //       callback(new Error('缩略图必须上传'));
    //     }
    //   } else {
    //     callback(new Error('缩略图必须上传'));
    //   }
    // };
    // const isBarCodeValid = (rule, value, callback) => {
    //   if (value && !/^[A-Z0-9]*$/.test(value)) {
    //     callback(new Error('条码由大写英文字符和数字字符组成'));
    //   } else {
    //     callback();
    //   }
    // };
    return {
      openV: false,
      picUrl: '',
      paramDialogOpen: false,
      operations: [
        {
          label: '保存',
          name: 'save',
          type: 'primary',
          disabled: false,
          auth: ['admin:PurchaseSaleStorage.product.edit']
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
        price: [
          {
            required: false,
            trigger: 'blur',
            validator: isPriceValid
          }
        ],
        wholesalePrice: [
          {
            required: false,
            trigger: 'blur',
            validator: isCostValid
          }
        ],
        agent2Price: [
          {
            required: false,
            trigger: 'blur',
            validator: isAgent2Valid
          }
        ],
        agent3Price: [
          {
            required: false,
            trigger: 'blur',
            validator: isAgent3Valid
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
        // image: [
        //   {
        //     required: true,
        //     trigger: 'blur',
        //     validator: isImageValid
        //   }
        // ],
        minimumPackQuantity: [
          {
            required: false,
            trigger: 'blur',
            message: '请输入最小包装数'
          },
          { pattern: /^\+?[1-9][0-9]*$/, message: '最小包装数为大于0的正整数', trigger: 'blur' }
        ],
        barCode: [
          {
            required: false,
            trigger: 'blur'
            // validator: isBarCodeValid
          }
        ],
        name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }]
      },
      isCreated: 'true',
      defaultImg: '/resources/admin/images/default/product-default.png',
      productDataModel: this.getDefaultProductDataModel(),
      categoryOptions: [],
      productTypes: [],
      supplierDatas: [],
      payOptions: [],
      shippingMethods: [],
      ProductCategoryManage: [],
      brandOptions: [],
      inputVisible: false,
      inputValue: '',
      loading: false,
      refreshSign: true,
      seriesOptions: []
    };
  },
  components: {
    BizGrid,
    BizSaveButton,
    Parameter
    // BizAvatarUploaderNew,
    // VueCropper
  },
  props: {
    itemId: {
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
    },
    categoryId: {
      type: String,
      default: ''
    }
  },
  watch: {
    open(val) {
      this.$refs.productDataForm.clearValidate();
      if (!val) {
        this.isCreated = true;
        this.productTypes = [];
        this.payOptions = [];
        this.supplierDatas = [];
        this.shippingMethods = [];
        this.seriesOptions = [];
      } else {
        if (this.itemId !== '') {
          this.isCreated = false;
        } else {
          this.isCreated = true;
          this.productDataModel = this.getDefaultProductDataModel();
          this.queryPaymentMethods();
          this.queryShippingMethods();
          this.queryProductTypes();
          this.querySupplier();
        }
      }
    },
    itemId(nVal, oVal) {
      if (nVal) {
        if (this.open === true && this.tabSelection === 'baseinfo') {
          this.getProductCategoryList(this.baseInfo.shopId);
          this.queryPaymentMethods();
          this.queryShippingMethods();
          this.queryProductTypes();
          this.querySupplier();
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
    isNeedToShowPaymentMethod() {
      if (this.productDataModel.productType !== '2' && this.productDataModel.productType !== '7') {
        return true;
      }
      return false;
    },
    isCarOrService() {
      let flag = false;
      console.log(this.productCategoryManage);
      this.productCategoryManage.map(item => {
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
    },
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
    }
  },
  methods: {
    operate(name) {
      this[name]();
    },
    cancel() {
      this.paramDialogOpen = false;
    },
    paramClick() {
      this.paramDialogOpen = true;
    },
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
    categoryChange(val) {
      console.log(this.productDataModel.categoryId);
      this.productDataModel.brandId = '';
      this.productDataModel.brandName = '';
      this.productDataModel.seriesId = '';
      // this.productDataModel.seriesName = '';
      this.seriesOptions = [];
      this.getBrands(val);
    },
    brandChange(val) {
      console.log(this.productDataModel.brandId);
      this.productDataModel.brandId = val;
      this.getSeries(val);
    },
    seriesChange(val) {
      this.productDataModel.seriesId = val;
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
        brandId: '',
        // seriesName: '',
        seriesId: '',
        fullName: '',
        name: '',
        image: this.defaultImg,
        price: '',
        purchasePrice: '',
        wholesalePrice: '',
        agent2Price: '',
        agent3Price: '',
        paymentMethodIds: [],
        shippingMethodIds: [],
        realStock: '0',
        productType: '0',
        supplier: { id: '', name: '' },
        minimumPackQuantity: '1',
        stockAlertMax: '',
        stockAlertMin: '',
        barCode: '',
        vin: ''
      };
    },
    getSaveProductDataModel() {
      let ids = [];
      if (this.productDataModel.productType === '2') {
        for (const iterator of this.payOptions) {
          ids.push({ id: iterator.id });
        }
      } else {
        for (const iterator of this.productDataModel.paymentMethodIds) {
          ids.push({ id: iterator });
        }
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
        fullName: this.productDataModel.fullName,
        name: this.productDataModel.name,
        image: this.productDataModel.image,
        realStock: this.productDataModel.realStock,
        price: this.productDataModel.price || '0',
        wholesalePrice: this.productDataModel.wholesalePrice,
        agent2Price: this.productDataModel.agent2Price,
        agent3Price: this.productDataModel.agent3Price,
        purchasePrice: this.productDataModel.purchasePrice,
        paymentMethods: ids,
        shippingMethods: this.shippingMethods,
        productType: this.productDataModel.productType,
        supplier: this.productDataModel.supplier
          ? { id: this.productDataModel.supplier.id, name: this.productDataModel.supplier.name }
          : { id: '', name: '' },
        minimumPackQuantity: this.productDataModel.minimumPackQuantity,
        stockAlertMax: this.productDataModel.stockAlertMax,
        stockAlertMin: this.productDataModel.stockAlertMin,
        barCode: this.productDataModel.barCode,
        vin: this.productDataModel.vin
      };
    },
    handleUploadSuccess(url) {
      console.log(url);
      this.productDataModel.image = url;
    },
    getBrands(categoryId) {
      if (this.productDataModel.categoryId.length === 0) {
        return false;
      }
      let params = {
        categoryId: categoryId[categoryId.length - 1]
      };
      http.get(urls.commodity.getBrands, params).then(data => {
        this.brandOptions = data.brands;
        this.getSeries(this.productDataModel.brandId);
      });
    },
    getSeries(brandId) {
      if (this.productDataModel.brandId === '') {
        return false;
      }
      let params = {
        shopBrandId: brandId
      };
      http.get(urls.commodity.getSeries, params).then(data => {
        this.seriesOptions = data.series;
      });
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
    queryProductTypes() {
      let params = {
        id: this.itemId,
        shopId: window.top.SHOP_ID || ''
      };
      BaseInfoService.queryProductBasicInfo(
        params,
        data => {
          this.productTypes = data.productTypes;
        },
        // result_code 不是100的处理
        ErrorData => {
          if (ErrorData.errorMessage !== '') {
            this.$message.warning(ErrorData.errorMessage);
          }
          console.log('获取商品基本信息失败', this.id);
        }
      );
    },
    refresh() {
      let params = {
        id: this.itemId,
        shopId: window.top.SHOP_ID || ''
      };
      http
        .get(urls.invoicing.productMgmt.basicInfo, params)
        .then(data => {
          this.refreshSign = !this.refreshSign;
          this.productDataModel = this.convert2ProductDataModel(data.data);
          this.getParentCategory(this.categoryOptions, this.productDataModel.categoryId[0]);
          this.getBrands(this.productDataModel.categoryId);
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
        fullName: productBasicInfoData.fullName,
        categoryId: [productBasicInfoData.categoryId],
        brandId: productBasicInfoData.brandId,
        brandName: productBasicInfoData.brandName,
        seriesId: productBasicInfoData.seriesId,
        // seriesName: productBasicInfoData.seriesName,
        name: productBasicInfoData.name,
        image: productBasicInfoData.image ? productBasicInfoData.image : this.defaultImg,
        price: productBasicInfoData.price || '0.00',
        wholesalePrice: productBasicInfoData.wholesalePrice,
        agent2Price: productBasicInfoData.agent2Price,
        agent3Price: productBasicInfoData.agent3Price,
        purchasePrice: productBasicInfoData.purchasePrice,
        paymentMethodIds: ids,
        shippingMethodIds: shippingIds,
        productType: productBasicInfoData.productType,
        supplier: productBasicInfoData.supplier
          ? { id: productBasicInfoData.supplier.id, name: productBasicInfoData.supplier.name }
          : { id: '', name: '' },
        minimumPackQuantity: productBasicInfoData.minimumPackQuantity,
        stockAlertMax: this.productDataModel.stockAlertMax,
        stockAlertMin: this.productDataModel.stockAlertMin,
        barCode: productBasicInfoData.barCode,
        vin: productBasicInfoData.vin
      };
    },
    querySupplier() {
      let params = {
        shopId: window.top.SHOP_ID || '',
        cooperationType: '0',
        searchValue: '',
        state: ''
      };
      http
        .get(urls.invoicing.supplierMgmt.shopSupplierList, params)
        .then(data => {
          this.loading = false;
          for (const iterator of data.dataList) {
            this.supplierDatas.push({ id: iterator.id, name: iterator.name });
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
    supplierChange(val) {
      for (const iterator of this.supplierDatas) {
        if (val === iterator.id) {
          this.productDataModel.supplier.name = iterator.name;
        }
      }
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
        .post(urls.invoicing.productMgmt.basicInfo, params)
        .then(data => {
          this.$message.success('添加商品基本信息成功');
          this.itemId = data.id;
          this.isCreated = false;
          this.refresh();
          this.$emit('operationSuccess');
          this.$emit('createdProductSuccess', data.id, this.productDataModel.productType);
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
        .put(urls.invoicing.productMgmt.basicInfo, params)
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
    productTypeChange(productType) {
      if (productType === '7') {
        this.productDataModel.shippingMethodIds = [];
        this.productDataModel.paymentMethodIds = [];
      } else {
        for (const iterator of this.payOptions) {
          this.productDataModel.paymentMethodIds.push(iterator.id);
        }
        for (const iterator of this.shippingMethods) {
          this.productDataModel.shippingMethodIds.push(iterator.id);
        }
      }
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
