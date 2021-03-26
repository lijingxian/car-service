<template>
  <biz-grid class="financial-base-info">
    <biz-save-button slot="top" :operations="operations" @operate="operate" v-if="isEdit">
    </biz-save-button>
    <el-form ref='productDataForm' label-width="130px" size="small" v-loading="loading" :model="productDataModel" :rules="productDataRules" :disabled="!isEdit" :inline-message="true">
      <el-form-item label="方案名称" prop="name">
        <el-input placeholder="请输入方案名称" v-model="productDataModel.name"></el-input>
      </el-form-item>
      <el-form-item label="金融机构" prop="financialInstitution">
        <el-select v-model="productDataModel.financialInstitution" placeholder="请选择金融机构">
          <el-option v-for="item of financials" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="保险分类" prop="categoryId">
        <el-select v-model="productDataModel.categoryId" placeholder="请选择保险分类">
          <el-option v-for="(item,index) of categorys" :key="index" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="编号">
        <el-input :placeholder="productDataModel.id?'请输入编号':'创建成功后自动生成'" v-model="productDataModel.sn" :readonly="true" :disabled="true"></el-input>
      </el-form-item>
      <!-- <el-form-item label="类型">
        <el-select v-model="productDataModel.productType" :disabled="isCreated === false" placeholder="请选择商品类型"
          @change="productTypeChange">
          <el-option v-for="item of productTypes" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item> -->
      <el-form-item label="投保方式" prop="method">
        <el-radio-group v-model="productDataModel.method">
          <el-radio label="0" disabled>线上投保</el-radio>
          <el-radio label="1">预约投保</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="理赔流程" prop="insuranceClaims">
        <el-input v-model="productDataModel.insuranceClaims" type="textarea" :rows="2" placeholder="请输入理赔流程">
        </el-input>
      </el-form-item>
      <!-- <el-form-item :label="priceLabel" prop="price" v-if="isNeedToShowPrice">
        <el-input placeholder="请输入一口价" v-model="productDataModel.price"></el-input>
      </el-form-item>
      <el-form-item label="市场指导价：" prop="marketPrice">
        <el-input placeholder="请输入市场指导价" v-model="productDataModel.marketPrice"></el-input>
      </el-form-item>
      <el-form-item label="成本价：" prop="cost">
        <el-input placeholder="请输入成本价" v-model="productDataModel.cost"></el-input>
      </el-form-item> -->
      <el-form-item label="商品缩略图：" prop="image">
        <BizAvatarUploaderNew v-model="productDataModel.image" @uploadSuccess="uploadSuccess">
        </BizAvatarUploaderNew>
      </el-form-item>
      <!-- <el-form-item label="库存：" prop="stock">
        <el-input placeholder="请输入..." v-model="productDataModel.stock"></el-input>
      </el-form-item> -->
      <el-form-item label="V豆折扣上限(%)：" prop="beanPercent" v-if="isNeedToShowBeanPercent()&&productDataModel.isPriceNegotiable==='false'">
        <el-input placeholder="按会员奖励设置比例" v-model="productDataModel.beanPercent"></el-input>
      </el-form-item>
      <el-form-item label="V豆赠送上限(%)：" prop="giftPercent" v-if="productDataModel.isPriceNegotiable==='false'">
        <el-input placeholder="请输入..." v-model="productDataModel.giftPercent"></el-input>
      </el-form-item>
      <el-form-item label="支付方式：" prop="paymentMethodIds" v-if="isNeedToShowPaymentMethod&&productDataModel.isPriceNegotiable==='false'">
        <el-checkbox-group v-model="productDataModel.paymentMethodIds">
          <el-checkbox v-for="item in payOptions" :key="item.id" :label="item.id">{{item.name}}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="配送方式：" prop="shippingMethodIds" v-show="productDataModel.productType!=='7'&&productDataModel.isPriceNegotiable==='false'">
        <el-checkbox-group class="shipping-method" v-model="shippingMethodIds">
          <el-checkbox v-for="item in shippingMethods" :key="item.shopShippingMethod.id" :label="item.shopShippingMethod.id">{{item.shopShippingMethod.name}}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="口碑：">
        <el-tag v-for="tag in productDataModel.reputations" :key="tag" size="small" closable :disable-transitions="true" @close="handleClose(tag)"
          type="warning">
          {{tag}}
        </el-tag>
        <el-input class="input-new-tag" v-model="inputValue" ref="saveTagInput" size="small" style="width:180px" placeholder="请输入1-6字口碑词汇"
          v-if="inputVisible" @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm">
        </el-input>
        <el-button v-else class="button-new-tag" size="small" @click="showInput">+添加</el-button>
      </el-form-item>
      <el-form-item label="设置：">
        <el-checkbox-group v-model="checkedSet">
          <el-checkbox label="是否置顶"></el-checkbox>
          <!-- <el-checkbox label="是否订金支付" v-if="productDataModel.isPriceNegotiable==='false'"></el-checkbox> -->
        </el-checkbox-group>
      </el-form-item>
    </el-form>

    <el-form ref='subscriptionForm' label-width="120px " size="small" :model="productDataModel" :rules="subscriptionRules" v-if="isSubscriptionChecked()">
      <el-form-item label="订金金额：" prop="subscription">
        <el-input v-model="productDataModel.subscription" placeholder="请输入不大于销售价的数字"></el-input>
      </el-form-item>
      <el-form-item label="订金可退：">
        <el-radio-group v-model="productDataModel.isSubscriptionReturn">
          <el-radio label="true">是</el-radio>
          <el-radio label="false">否</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <VueCropper :open="openV" :picUrl="picUrl" @close="close" @handelSuccess="handelSuccess"></VueCropper>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import BizSaveButton from '@/components/BizSaveButton';
import { BizAvatarUploaderNew } from '@/components/BizForm';
import { VueCropper } from '@/components/BizForm';
import http from '@/common/http';
export default {
  name: 'FinancialMgmtBaseInfo',
  data() {
    const isCategoryId = (rule, rules, callback) => {
      if (this.productDataModel.categoryId) {
        callback();
      } else {
        callback(new Error('请选择金融分类'));
      }
    };
    const isMarketPriceValid = (rule, rules, callback) => {
      if (this.productDataModel.marketPrice === '') {
        // this.productDataModel.marketPrice = 0;
      }
      if (Number(this.productDataModel.marketPrice) >= 0) {
        callback();
      } else {
        callback(new Error('市场指导价必须为数字值'));
      }
    };
    const isCostValid = (rule, rules, callback) => {
      if (this.productDataModel.cost === '') {
        // this.productDataModel.cost = 0;
      }
      if (Number(this.productDataModel.cost) >= 0) {
        callback();
      } else {
        callback(new Error('成本价必须为数字值'));
      }
    };
    const isLowerLimitValid = (rule, rules, callback) => {
      if (Number(this.productDataModel.lowerLimit) >= 0) {
        callback();
      } else {
        callback(new Error('额度下限必须为数字值'));
      }
    };
    const isUpperLimitValid = (rule, rules, callback) => {
      if (Number(this.productDataModel.upperLimit) >= 0) {
        callback();
      } else {
        callback(new Error('额度上限必须为数字值'));
      }
    };
    const isServiceChargeValid = (rule, rules, callback) => {
      if (Number(this.productDataModel.serviceCharge) >= 0) {
        callback();
      } else {
        callback(new Error('服务费必须为数字值'));
      }
    };
    const isPriceValid = (rule, rules, callback) => {
      if (Number(this.productDataModel.price) >= 0) {
        callback();
      } else {
        callback(new Error('一口价必须为数字值'));
      }
    };
    const isBeanPercentValid = (rule, rules, callback) => {
      if (this.productDataModel.beanPercent === '') {
        // this.productDataModel.beanPercent = 0;
      }
      if (Number(this.productDataModel.beanPercent) >= 0) {
        if (Number(this.productDataModel.beanPercent) > 100) {
          callback(new Error('V豆折扣上限(%)不能超过100'));
        }
        callback();
      } else {
        callback(new Error('V豆折扣上限(%)必须为数字值'));
      }
    };
    const isGiftPercentValid = (rule, rules, callback) => {
      if (this.productDataModel.giftPercent === '') {
        this.productDataModel.giftPercent = 0;
      }
      if (Number(this.productDataModel.giftPercent) >= 0) {
        if (Number(this.productDataModel.giftPercent) > 100) {
          callback(new Error('V豆赠送上限(%)不能超过100'));
        }
        callback();
      } else {
        callback(new Error('V豆赠送上限(%)必须为数字值'));
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
    const isImageValid = (rule, rules, callback) => {
      if (typeof this.productDataModel.image !== 'undefined') {
        console.log(this.productDataModel.image);
        if (this.productDataModel.image !== ' ') {
          callback();
        } else {
          callback(new Error('缩略图必须上传'));
        }
      } else {
        callback(new Error('缩略图必须上传'));
      }
    };

    const isStockValid = (rule, rules, callback) => {
      console.log(this.productDataModel.stock);
      if (
        this.productDataModel.stock !== '' &&
        Number(this.productDataModel.stock) >= 0 &&
        this.productDataModel.stock.indexOf('.') === -1
      ) {
        callback();
      } else {
        callback(new Error('库存必须为整数值'));
      }
    };

    const isSubscriptionValid = (rule, rules, callback) => {
      if (this.productDataModel.subscription !== '' && Number(this.productDataModel.subscription) > 0) {
        if (Number(this.productDataModel.subscription) >= Number(this.productDataModel.price)) {
          callback(new Error('请输入不大于销售价的数字'));
        }
        callback();
      } else {
        callback(new Error('订金金额必须为大于0数值'));
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
      if (this.productDataModel.productType === '7' || this.shippingMethodIds.length > 0) {
        callback();
      } else {
        callback(new Error('请至少选择一种配送方式'));
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
      openV: false,
      picUrl: '',
      productDataRules: {
        categoryId: [
          {
            required: true,
            trigger: 'blur',
            validator: isCategoryId
          }
        ],
        name: [
          {
            required: true,
            trigger: 'blur',
            message: '请输入方案名称'
          }
        ],
        financialInstitution: [
          {
            required: true,
            trigger: 'blur',
            message: '请选择金融机构'
          }
        ],
        financings: [
          {
            required: true,
            trigger: 'blur',
            message: '请选择融资附加'
          }
        ],
        marketPrice: [
          {
            required: false,
            trigger: 'blur',
            validator: isMarketPriceValid
          }
        ],
        cost: [
          {
            required: false,
            trigger: 'blur',
            validator: isCostValid
          }
        ],
        price: [
          {
            required: false,
            trigger: 'blur',
            validator: isPriceValid
          }
        ],
        beanPercent: [
          {
            required: false,
            trigger: 'blur',
            validator: isBeanPercentValid
          }
        ],
        giftPercent: [
          {
            required: false,
            trigger: 'blur',
            validator: isGiftPercentValid
          }
        ],
        weight: [
          {
            required: true,
            trigger: 'blur',
            validator: isWeightValid
          }
        ],
        image: [
          {
            required: false,
            trigger: 'blur',
            validator: isImageValid
          }
        ],
        stock: [
          {
            required: true,
            trigger: 'blur',
            validator: isStockValid
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
        method: [
          {
            required: true,
            trigger: 'blur',
            message: '请选择投保方式'
          }
        ],
        interestRate: [
          {
            required: true,
            trigger: 'blur',
            message: '请选择利息计算方式'
          }
        ],
        lowerLimit: [
          {
            required: true,
            trigger: 'blur',
            validator: isLowerLimitValid
          }
        ],
        upperLimit: [
          {
            required: true,
            trigger: 'blur',
            validator: isUpperLimitValid
          }
        ],
        serviceCharge: [
          {
            required: true,
            trigger: 'blur',
            validator: isServiceChargeValid
          }
        ]
      },
      subscriptionRules: {
        subscription: [
          {
            required: true,
            trigger: 'blur',
            validator: isSubscriptionValid
          }
        ]
      },
      isCreated: 'true',
      defaultImg: '/resources/admin/images/default/product-default.png',
      productDataModel: this.getDefaultProductDataModel(),
      categoryOptions: [],
      productTypes: [],
      financials: [],
      categorys: [],
      payOptions: [],
      shippingMethods: [],
      shippingMethodIds: [],
      setOptions: ['是否置顶', '是否订金支付'],
      financingGroup: [
        { id: '0', name: '购置税' },
        { id: '1', name: '车船税' },
        { id: '2', name: '交强险' },
        { id: '3', name: '商业保险' },
        { id: '4', name: '上牌费' },
        { id: '5', name: '服务费' }
      ],
      checkedSet: [],
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
    }
  },
  watch: {
    open(val) {
      if (!val) {
        this.isCreated = true;
        this.categorys = [];
        this.productTypes = [];
        this.payOptions = [];
        this.shippingMethods = [];
        this.checkedSet = [];
      } else {
        if (this.id !== '') {
          this.isCreated = false;
        } else {
          this.isCreated = true;
          this.refresh();
        }
      }
    },
    id(nVal, oVal) {
      if (nVal) {
        if (this.open === true && this.tabSelection === 'baseinfo') {
          this.refresh();
        }
      } else {
        this.productDataModel = this.getDefaultProductDataModel();
      }
    }
  },
  created() {
    this.getDefaultImg();
  },
  computed: {
    isNeedToShowPrice() {
      if (
        (this.productDataModel.productType === '0' ||
          this.productDataModel.productType === '1' ||
          this.productDataModel.productType === '7') &&
        this.productDataModel.isPriceNegotiable === 'false'
      ) {
        return true;
      }
      return false;
    },
    isNeedToShowPaymentMethod() {
      if (this.productDataModel.productType !== '2' && this.productDataModel.productType !== '7') {
        return true;
      }
      return false;
    },
    isNeedToShowTestDrive() {
      let flag = false;
      this.categoryOptions.map(item => {
        console.log(item.name);
        if (item.id === this.productDataModel.categoryId && item.type === 'car') {
          flag = true;
        }
      });
      return flag;
    },
    priceLabel() {
      if (this.productDataModel.productType === '0') {
        return '一口价：';
      }
      return '销售价：';
    },
    showPriceRadio() {
      if (this.productDataModel.productType === '0') {
        return true;
      }
      return false;
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
    // Tag
    handleClose(tag) {
      this.productDataModel.reputations.splice(this.productDataModel.reputations.indexOf(tag), 1);
    },
    categorySelectChange(categoryId, brandId, seriesId, name) {
      this.productDataModel.categoryId = categoryId;
      this.productDataModel.brandId = brandId;
      this.productDataModel.seriesId = seriesId;
      this.productDataModel.name = name;
    },
    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    handleInputConfirm() {
      if (this.inputValue.length > 6) {
        this.$message.warning('请输入1-6字口碑词汇');
        return false;
      }
      this.inputVisible = false;
      if (this.inputValue) {
        this.productDataModel.reputations.push(this.inputValue);
        this.inputValue = '';
      }
    },
    getDefaultProductDataModel() {
      return {
        shopId: window.top.SHOP_ID || '',
        id: '',
        sn: '',
        categoryId: '',
        brandId: '',
        seriesId: '',
        name: '',
        typeName: '',
        image: this.defaultImg,
        price: '',
        isPriceNegotiable: 'false',
        cost: '',
        marketPrice: '',
        sales: '',
        stock: '0',
        isSupportTestDrive: '0',
        isList: 'false',
        isTop: 'false',
        isSubscription: 'false',
        subscription: '',
        isSubscriptionReturn: 'true',
        reputations: [],
        paymentMethodIds: [],
        productType: '0',
        bean: '',
        beanPercent: '',
        giftPercent: '',
        weight: '0',
        financialInstitution: '',
        insuranceClaims: '',
        method: '1',
        interestRate: '0',
        upperLimit: '',
        lowerLimit: '',
        serviceCharge: '',
        financings: ['0']
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
        categoryId: this.productDataModel.categoryId,
        brandId: this.productDataModel.brandId,
        seriesId: this.productDataModel.seriesId,
        name: this.productDataModel.name,
        image: this.productDataModel.image,
        price: this.productDataModel.price || '0',
        cost: this.productDataModel.cost,
        marketPrice: this.productDataModel.marketPrice,
        sales: this.productDataModel.sales,
        stock: this.productDataModel.stock,
        isSupportTestDrive: this.productDataModel.isSupportTestDrive,
        isPriceNegotiable: this.productDataModel.isPriceNegotiable,
        isList: String(this.isListChecked()),
        isTop: String(this.isTopChecked()),
        isSubscription: String(this.isSubscriptionChecked()),
        subscription: this.productDataModel.subscription,
        isSubscriptionReturn: this.productDataModel.isSubscriptionReturn,
        reputations: this.productDataModel.reputations,
        paymentMethodIds: ids,
        shippingMethods: this.shippingMethods,
        productType: this.productDataModel.productType,
        bean: this.productDataModel.bean,
        beanPercent: this.productDataModel.beanPercent,
        giftPercent: this.productDataModel.giftPercent,
        weight: this.productDataModel.weight || '',
        keyword: this.productDataModel.keyword || [],
        tags: this.productDataModel.tags || [],
        wholesalePrice: this.productDataModel.wholesalePrice || '',
        financialInstitution: this.productDataModel.financialInstitution,
        method: this.productDataModel.method,
        insuranceClaims: this.productDataModel.insuranceClaims,
        interestRate: this.productDataModel.interestRate,
        upperLimit: this.productDataModel.upperLimit,
        lowerLimit: this.productDataModel.lowerLimit,
        serviceCharge: this.productDataModel.serviceCharge,
        financings: this.productDataModel.financings
      };
    },
    handleUploadSuccess(url) {
      console.log(url);
      this.productDataModel.image = url;
    },
    isListChecked() {
      for (const iterator of this.checkedSet) {
        if (iterator === '是否列出') {
          return true;
        }
      }
      return false;
    },
    isTopChecked() {
      for (const iterator of this.checkedSet) {
        if (iterator === '是否置顶') {
          return true;
        }
      }
      return false;
    },
    isSubscriptionChecked() {
      for (const iterator of this.checkedSet) {
        if (iterator === '是否订金支付') {
          return true;
        }
      }
      return false;
    },
    isNeedToShowBeanPercent() {
      if (this.productDataModel.productType === '0' || this.productDataModel.productType === '7') {
        return true;
      }

      return false;
    },
    refresh() {
      this.initializing = true;
      let params = {
        id: this.id,
        shopId: window.top.SHOP_ID || ''
      };
      http
        .get('/admin/insurancePlanController/insurancePlanBasicInfo.jhtml', params)
        .then(data => {
          data.productCategoryTree.map(category => {
            if (category.type !== 'finance') {
              this.categorys.push(category);
            }
          });
          this.financials = data.financialInstitutionDatas;
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
            this.productDataModel = this.convert2ProductDataModel(data.inancialProductPlanData);
          } else {
            this.productDataModel.image = this.defaultImg;
            for (const iterator of this.payOptions) {
              this.productDataModel.paymentMethodIds.push(iterator.id);
            }
          }

          let tmpCheckedSet = [];
          if (data.productBasicInfoData) {
            if (data.productBasicInfoData.isList === 'true') {
              tmpCheckedSet.push('是否列出');
            }
            if (data.productBasicInfoData.isTop === 'true') {
              tmpCheckedSet.push('是否置顶');
            }
            if (data.productBasicInfoData.isSubscription === 'true') {
              tmpCheckedSet.push('是否订金支付');
            }
          }
          this.checkedSet = tmpCheckedSet;
          this.$nextTick(() => {
            this.initializing = false;
          });
        })
        .catch(error => {
          if (error.errorMessage !== '') {
            this.$message.warning(error.errorMessage);
          }
        });
    },
    convert2ProductDataModel(productBasicInfoData) {
      return {
        shopId: productBasicInfoData.shopId,
        id: productBasicInfoData.id,
        sn: productBasicInfoData.sn,
        categoryId: productBasicInfoData.categoryId,
        brandId: productBasicInfoData.brandId,
        seriesId: productBasicInfoData.seriesId,
        name: productBasicInfoData.name,
        image: productBasicInfoData.image,
        price: productBasicInfoData.price,
        cost: productBasicInfoData.cost,
        marketPrice: productBasicInfoData.marketPrice,
        sales: productBasicInfoData.sales,
        stock: productBasicInfoData.stock,
        isSupportTestDrive: productBasicInfoData.isSupportTestDrive,
        isList: productBasicInfoData.isList,
        isTop: productBasicInfoData.isTop,
        isSubscription: productBasicInfoData.isSubscription,
        subscription: productBasicInfoData.subscription,
        isSubscriptionReturn: productBasicInfoData.isSubscriptionReturn || 'true',
        reputations: productBasicInfoData.reputations,
        paymentMethodIds: productBasicInfoData.paymentMethodIds,
        productType: productBasicInfoData.productType,
        bean: productBasicInfoData.bean,
        beanPercent: productBasicInfoData.beanPercent,
        giftPercent: productBasicInfoData.giftPercent,
        isPriceNegotiable: productBasicInfoData.isPriceNegotiable,
        weight: productBasicInfoData.weight || 0,
        financialInstitution: productBasicInfoData.financialInstitution,
        method: productBasicInfoData.method,
        insuranceClaims: productBasicInfoData.insuranceClaims,
        interestRate: productBasicInfoData.interestRate,
        upperLimit: productBasicInfoData.upperLimit,
        lowerLimit: productBasicInfoData.lowerLimit,
        serviceCharge: productBasicInfoData.serviceCharge,
        financings: productBasicInfoData.financings
      };
    },
    save() {
      this.$refs.productDataForm.validate(valid => {
        if (valid) {
          if (this.isSubscriptionChecked()) {
            this.$refs.subscriptionForm.validate(valid => {
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
          } else {
            if (this.isCreated) {
              this.createProduct();
            } else {
              this.updateProduct();
            }
          }
        } else {
          return false;
        }
      });
    },
    createProduct() {
      let params = this.getSaveProductDataModel();
      http
        .post('/admin/insurancePlanController/insurancePlanBasicInfo.jhtml', params)
        .then(data => {
          this.$message.success('添加成功');
          this.id = data.id;
          this.isCreated = false;
          this.refresh();
          this.$emit('operationSuccess');
          this.$emit('createdProductSuccess', data.id, this.productDataModel.productType);
        })
        .catch(error => {
          if (error.errorMessage !== '') {
            this.$message.warning(error.errorMessage);
          }
        });
    },
    updateProduct() {
      let params = this.getSaveProductDataModel();
      http
        .put('/admin/insurancePlanController/insurancePlanBasicInfo.jhtml', params)
        .then(data => {
          this.refresh();
          this.$message.success('更新成功');
          this.$emit('operationSuccess');
        })
        .catch(error => {
          if (error.errorMessage !== '') {
            this.$message.warning(error.errorMessage);
          }
        });
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
    }
  }
};
</script>

<style lang="scss">
.financial-base-info {
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
