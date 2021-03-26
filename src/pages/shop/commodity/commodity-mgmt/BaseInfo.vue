<template>
  <biz-grid class="add-product-base-info">
    <biz-save-button slot="top" :operations="operations" @operate="operate" v-if="isEdit"></biz-save-button>
    <div class="form-one" ref="form">
      <el-form ref="productDataForm" label-width="150px" size="small" v-loading="loading" :model="productDataModel"
        :rules="productDataRules" :disabled="!isEdit" :inline-message="true">
        <el-form-item label="商品分类" :required="true">
          <el-cascader v-model="productDataModel.categoryId" :options="categoryOptions" change-on-select :show-all-levels="false"
            :disabled="isCreated === false" @change="categoryChange"></el-cascader>
          <div class="tooltip" v-show="isCreated === true">商品创建后分类不可修改</div>
        </el-form-item>
        <product-category-select :initializing="initializing" :refreshSign="refreshSign" :brandId.sync="productDataModel.brandId"
          :categoryId="productDataModel.categoryId[productDataModel.categoryId.length-1]"
          :seriesId.sync="productDataModel.seriesId" :name.sync="productDataModel.name"></product-category-select>
        <el-form-item label="商品类型">
          <el-select v-model="productDataModel.productType" :disabled="isCreated === false" placeholder="请选择商品类型"
            @change="productTypeChange">
            <el-option v-for="item of productTypes" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
          <div class="tooltip" v-show="isCreated === true">商品创建后类型不可修改</div>
        </el-form-item>
        <el-form-item label="编号">
          <el-input :placeholder="productDataModel.id?'请输入编号':'创建成功后自动生成'" v-model="productDataModel.sn" :readonly="true"
            :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="商品条码" prop="barCode">
          <el-input v-model="productDataModel.barCode" placeholder="请输入条码"></el-input>
        </el-form-item>
        <el-form-item label="支付方式：" prop="paymentMethodIds"
          v-if="isNeedToShowPaymentMethod&&productDataModel.isPriceNegotiable==='false'">
          <el-checkbox-group v-model="productDataModel.paymentMethodIds">
            <el-checkbox v-for="item in payOptions" :key="item.id" :label="item.id">{{item.name}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="配送方式：" prop="shippingMethodIds"
          v-if="productDataModel.productType!=='7'&&productDataModel.isPriceNegotiable==='false'">
          <el-checkbox-group class="shipping-method" v-model="shippingMethodIds" @change="isShowWeight()">
            <el-checkbox v-for="item in shippingMethods" :key="item.shopShippingMethod.id" :label="item.shopShippingMethod.id"
              :disabled="isCarOrService&&item.shopShippingMethod.name!=='到店服务'">
              {{item.shopShippingMethod.name}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="商品重量" prop="weight" v-if="showWeight">
          <el-input placeholder="默认0" v-model="productDataModel.weight">
            <template slot="append">KG</template>
          </el-input>
        </el-form-item>
        <el-form-item label="商品重量" prop="" v-if="!showWeight">
          <el-input placeholder="默认0" v-model="productDataModel.weight">
            <template slot="append">KG</template>
          </el-input>
        </el-form-item>
        <el-form-item label="" v-if="!!id">
          <div @click="paramClick()" style="cursor:pointer">
            <img style="width:20px;height:10px" src="../../../../assets/images/commodity/param.png"/>
            <span>更多参数</span>
          </div>
        </el-form-item>
      </el-form>
    </div>
    <el-dialog :visible="previewDialogOpen" append-to-body :open="previewDialogOpen" @close="previewDialogOpen=false" width="420px">
      <iframe :src="'resources/admin/ecStatic/index.html?#/vshop/goods/'+productDataModel.id+'?shopId='+baseInfo.shopId"
        frameborder="0" scrolling="auto" width="375px" height="567px"></iframe>
    </el-dialog>
    <el-dialog :visible="paramDialogOpen" :open="paramDialogOpen" @close="paramDialogOpen=false" append-to-body width="500px">
      <Parameter :id="this.id" v-if="paramDialogOpen" :categoryId="categoryId" :isEdit="isEdit" @cancel="cancel">
      </Parameter>
    </el-dialog>
  </biz-grid>
</template>
<script>
import { BizGrid } from '@/components/BizGrid';
import BizSaveButton from '@/components/BizSaveButton';
import BaseInfoService from '@/service/commodity/commodity-mgmt/baseInfo';
import ProductCategorySelect from './components/ProductCategorySelect';
import CategoryMgmtService from '@/service/commodity/category-mgmt/categoryMgmt';
import Parameter from './Parameter';
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
        callback(new Error('请选择分类'));
      }
    };
    const isWeightValid = (rule, rules, callback) => {
      if (this.productDataModel.weight === '') {
        this.productDataModel.weight = 0;
      }
      if (Number(this.productDataModel.weight) >= 0) {
        if (
          this.productDataModel.weight &&
          this.productDataModel.weight.indexOf('.') !== -1 &&
          this.productDataModel.weight.split('.')[1].length > 2
        ) {
          callback(new Error('只允许输入到小数后两位'));
        } else {
          callback();
        }
      } else {
        callback(new Error('重量必须为数字值'));
      }
    };
    const isSelectPaymentMethod = (rule, rules, callback) => {
      if (this.productDataModel.productType === '2' || this.productDataModel.productType === '7') {
        callback();
      } else if (this.productDataModel.paymentMethodIds && this.productDataModel.paymentMethodIds.length > 0) {
        callback();
      } else {
        callback(new Error('请至少选择一种支付方式'));
      }
    };

    const isSelectShippingMethod = (rule, rules, callback) => {
      if (this.productDataModel.productType === '7' || this.shippingMethodIds.length > 0) {
        callback();
      } else {
        this.$message.warning('请至少选择一种配送方式');
        callback(new Error('请至少选择一种配送方式'));
      }
    };
    return {
      dialogVisibility: false,
      showWeight: true,
      previewDialogOpen: false,
      paramDialogOpen: false,
      operations: [
        {
          label: '保存',
          name: 'save',
          type: 'primary',
          disabled: false,
          auth: ['admin:product.edit']
        },
        {
          label: '预览',
          name: 'preview',
          type: 'primary',
          class: 'hidden'
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
        weight: [
          {
            required: true,
            trigger: 'blur',
            validator: isWeightValid
          }
        ],
        barCode: [
          {
            required: false,
            trigger: 'blur'
            // validator: isBarCodeValid
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
        ]
      },
      isCreated: 'true',
      productDataModel: this.getDefaultProductDataModel(),
      categoryOptions: [],
      productCategoryManage: [],
      productTypes: [],
      payOptions: [],
      shippingMethods: [],
      shippingMethodIds: [],
      loading: false,
      refreshSign: true,
      initializing: false
    };
  },
  components: {
    BizGrid,
    BizSaveButton,
    ProductCategorySelect,
    Parameter
  },
  props: {
    id: {
      type: String,
      default: ''
    },
    tabSelection: {
      type: String
    },
    baseInfo: {
      type: Object,
      default() {
        return { shopId: '' };
      }
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
        this.shippingMethods = [];
      } else {
        if (this.id !== '') {
          this.operations[1].class = 'show';
          this.isCreated = false;
        } else {
          this.operations[1].class = 'hidden';
          this.isCreated = true;
          this.refresh();
        }
      }
    },
    id(nVal, oVal) {
      if (nVal) {
        this.$refs.form.scrollTop = 0;
        if (this.open === true && this.tabSelection === 'baseinfo') {
          this.getProductCategoryList(this.baseInfo.shopId);
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
    operate(name) {
      this[name]();
    },
    cancel() {
      this.paramDialogOpen = false;
    },
    isShowWeight() {
      this.showWeight = false;
      this.shippingMethods.map(item => {
        if (
          this.shippingMethodIds.includes(item.shopShippingMethod.id) &&
          (item.shopShippingMethod.name === '物流配送' ||
            item.shopShippingMethod.name === '快递配送' ||
            item.shopShippingMethod.name === '零担物流')
        ) {
          this.showWeight = true;
        }
      });
    },
    paramClick() {
      this.paramDialogOpen = true;
    },
    preview() {
      this.previewDialogOpen = true;
    },
    categoryChange(val) {
      console.log(this.productDataModel.categoryId);
    },
    getDefaultProductDataModel() {
      return {
        shopId: window.top.SHOP_ID || '',
        id: '',
        sn: '',
        categoryId: [],
        brandId: '',
        seriesId: '',
        name: '',
        typeName: '',
        isPriceNegotiable: 'false',
        paymentMethodIds: [],
        productType: '0',
        weight: '0'
      };
    },
    getSaveProductDataModel() {
      let ids = [];
      if (this.productDataModel.productType === '2') {
        for (const iterator of this.payOptions) {
          ids.push(iterator.id);
        }
      } else {
        for (const iterator of this.productDataModel.paymentMethodIds) {
          ids.push(iterator);
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
            if (item.shopShippingMethod.name === '到店服务') {
              this.shippingMethodIds = [item.shopShippingMethod.id];
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
                  if (item.shopShippingMethod.name === '到店服务') {
                    this.shippingMethodIds = [item.shopShippingMethod.id];
                  }
                });
              }
            });
          }
        }
      });
      console.log(this.shippingMethodIds);
      for (const iterator of this.shippingMethods) {
        iterator.productValid = '0';
        if (this.shippingMethodIds.indexOf(iterator.shopShippingMethod.id) !== -1) {
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
        isPriceNegotiable: this.productDataModel.isPriceNegotiable,
        paymentMethodIds: ids,
        shippingMethods: this.shippingMethods,
        productType: this.productDataModel.productType,
        weight: this.productDataModel.weight,
        barCode: this.productDataModel.barCode,
        vin: this.productDataModel.vin
      };
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
    refresh() {
      this.initializing = true;
      this.loading = true;
      let params = {
        id: this.id,
        shopId: window.top.SHOP_ID || ''
      };
      BaseInfoService.queryProductBasicInfo(
        params,
        data => {
          this.productTypes = data.productTypes;
          this.payOptions = data.paymentMethods;
          this.shippingMethods = data.shippingMethods;
          this.shippingMethodIds = [];
          for (const iterator of this.shippingMethods) {
            if (iterator.productValid === '1') {
              this.shippingMethodIds.push(iterator.shopShippingMethod.id);
            }
          }
          this.refreshSign = !this.refreshSign;
          if (this.id) {
            this.productDataModel = this.convert2ProductDataModel(data.productBasicInfoData);
            this.getParentCategory(this.categoryOptions, this.productDataModel.categoryId[0]);
          } else {
            for (const iterator of this.payOptions) {
              this.productDataModel.paymentMethodIds.push(iterator.id);
            }
          }
          this.$nextTick(() => {
            this.initializing = false;
            this.loading = false;
            this.isShowWeight();
          });
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
    convert2ProductDataModel(productBasicInfoData) {
      return {
        shopId: productBasicInfoData.shopId,
        id: productBasicInfoData.id,
        sn: productBasicInfoData.sn,
        categoryId: [productBasicInfoData.categoryId],
        brandId: productBasicInfoData.brandId,
        seriesId: productBasicInfoData.seriesId,
        name: productBasicInfoData.name,
        paymentMethodIds: productBasicInfoData.paymentMethodIds,
        productType: productBasicInfoData.productType,
        isPriceNegotiable: productBasicInfoData.isPriceNegotiable,
        weight: productBasicInfoData.weight || 0,
        barCode: productBasicInfoData.barCode,
        vin: productBasicInfoData.vin
      };
    },
    async save() {
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
      let serviceName = this.productDataModel.productType === '7' ? 'creatBenefitsBasicInfo' : 'creatProductBasicInfo';
      BaseInfoService[serviceName](
        params,
        data => {
          this.$message.success('添加商品基本信息成功');
          this.id = data.id;
          this.isCreated = false;
          this.refresh();
          this.$emit('operationSuccess');
          this.$emit('createdProductSuccess', data.id, this.productDataModel.productType);
        },
        ErrorData => {
          if (ErrorData.errorMessage !== '') {
            this.$message.warning(ErrorData.errorMessage);
          }
          console.log('添加商品基本信息失败', this.id);
        }
      );
    },
    updateProduct() {
      let params = this.getSaveProductDataModel();
      BaseInfoService.updateProductBasicInfo(
        params,
        data => {
          this.refresh();
          this.$message.success('更新商品基本信息成功');
          this.$emit('operationSuccess');
        },
        ErrorData => {
          if (ErrorData.errorMessage !== '') {
            this.$message.warning(ErrorData.errorMessage);
          }
          console.log('更新商品基本信息失败', this.id);
        }
      );
    },
    productTypeChange(productType) {
      if (productType === '7') {
        this.shippingMethodIds = [];
        this.productDataModel.paymentMethodIds = [];
      } else {
        for (const iterator of this.payOptions) {
          this.productDataModel.paymentMethodIds.push(iterator.id);
        }
        for (const iterator of this.shippingMethods) {
          this.shippingMethodIds.push(iterator.shopShippingMethod.id);
        }
      }
      if (productType !== '1') {
        this.productDataModel.isPriceNegotiable = 'false';
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
  .el-icon-question:before {
    color: #ff7300;
  }
  .tooltip {
    font-size: 12px;
    color: #666666;
  }
  // 关键词
  .item-content {
    display: flex;
    flex-direction: column;
    width: 210px;
    .el-tag + .el-tag {
      margin-left: 0;
    }
    .el-tag {
      margin-right: 10px;
      margin-bottom: 5px;
      cursor: pointer;
    }
    .tag-list {
      display: flex;
      flex-wrap: wrap;
      .tag-group {
        width: calc(100% - 85px);
        padding-right: 5px;
      }
      .toggle-btn {
        display: flex;
        align-items: flex-end;
        width: 65px;
        cursor: pointer;
        user-select: none;
        .rotate-180 {
          transform: rotate(180deg);
        }
      }
      .recommend-group {
        width: 100%;
        margin: 0 10px 10px 0;
        padding: 7px 12px;
        border: 1px solid #f4f2f2;
        border-radius: 4px;
        .el-tag {
          max-width: 180px;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
    }
    .add-tag {
      width: 100%;
      display: flex;
      justify-content: space-between;
      padding-right: 10px;
      .el-input {
        margin-right: 10px;
      }
    }
  }
  .biz-save-button {
    margin-top: 5px;
    justify-content: flex-start;
  }
  .el-cascader {
    width: 262px;
  }
  .form-one {
    height: 100%;
    overflow: auto;
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
