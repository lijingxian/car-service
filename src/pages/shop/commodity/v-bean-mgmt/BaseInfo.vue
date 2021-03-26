<template>
  <biz-grid class="add-product-base-info">
    <biz-save-button slot="top" :operations="operations" @operate="operate" v-if="isEdit">
    </biz-save-button>
    <div class="form-one">
      <el-form ref='productDataForm' label-width="130px" size="small" v-loading="loading" :model="productDataModel" :rules="productDataRules"
        :disabled="!isEdit" :inline-message="true">
        <el-form-item label="商品分类：" :required="true">
          <el-cascader v-model="productDataModel.categoryId" :options="categoryOptions" change-on-select :show-all-levels="false"
            @change="categoryChange"></el-cascader>
        </el-form-item>
        <product-category-select :initializing="initializing" :refreshSign="refreshSign" :brandId.sync=productDataModel.brandId
          :categoryId="productDataModel.categoryId[0]" :seriesId.sync=productDataModel.seriesId :name.sync=productDataModel.name>
        </product-category-select>
        <el-form-item label="类型：">
          <el-select v-model="productDataModel.productType" :disabled="isCreated === false" placeholder="请选择商品类型" style="width: 80%;"
            @change="productTypeChange">
            <el-option v-for="item of productTypes" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="编号：">
          <el-input :placeholder="productDataModel.id?'请输入编号':'创建成功后自动生成'" v-model="productDataModel.sn" :readonly="true"
            :disabled="true" style="width: 80%;"></el-input>
        </el-form-item>
        <!-- 关键词 -->
        <el-form-item>
          <span slot="label">
            关键词
            <el-tooltip placement="bottom" effect="light">
              <div slot="content" style="width: 300px;">填写关键词后，客户可以根据关键词搜索到此商品。使用符合用户习惯的关键词可以有效提高商品被搜索到的概率。</div>
              <i class="el-icon-question"></i>
            </el-tooltip>
          </span>
          <div class="item-content">
            <div class="tag-list">
              <div class="tag-group">
                <el-tag v-for="(tag, index) in tagGroup" :key="index" closable size="mini" @close="removeTag(index)">{{ tag }}</el-tag>
              </div>
              <div class="toggle-btn" @click="showRecommend = !showRecommend">
                <div class="iconfont biz-icon-i-web-zd1" :class="{ 'rotate-180': showRecommend }"></div>
                {{ toggleRecommendTxt }}
              </div>
              <div class="recommend-group" v-show="showRecommend">
                <el-tag v-for="(tag, index) in recommendTagGroup" :key="index" type="info" size="mini" @click="addRecommendTag(tag)">{{
                  tag }}</el-tag>
                <span v-if="!recommendTagGroup.length" style="color: #bbbbbb;">暂无推荐</span>
              </div>
            </div>
            <div class="add-tag">
              <el-input v-model="newTagName" :maxlength="18" placeholder="请输入自定义关键词"></el-input>
              <el-button @click="addNewTag" type="primary">添加</el-button>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="销售价：" v-show="showPriceRadio">
          <el-radio v-model="productDataModel.isPriceNegotiable" label="false">一口价</el-radio>
          <el-radio v-model="productDataModel.isPriceNegotiable" label="true">价格面议</el-radio>
        </el-form-item>
        <el-form-item :label="priceLabel" prop="price" v-if="isNeedToShowPrice">
          <el-input placeholder="请输入一口价" v-model="productDataModel.price" style="width: 80%;"></el-input>
        </el-form-item>
        <el-form-item label="市场指导价：" prop="marketPrice">
          <el-input placeholder="请输入市场指导价" v-model="productDataModel.marketPrice" style="width: 80%;"></el-input>
        </el-form-item>
        <el-form-item label="成本价：" prop="cost">
          <el-input placeholder="请输入成本价" v-model="productDataModel.cost" style="width: 80%;"></el-input>
        </el-form-item>
        <el-form-item label="商品缩略图：" prop="image">
          <BizAvatarUploaderNew v-model="productDataModel.image" @uploadSuccess="uploadSuccess">
          </BizAvatarUploaderNew>
        </el-form-item>
        <el-form-item label="库存：" prop="stock">
          <el-input placeholder="请输入..." v-model="productDataModel.stock" style="width: 80%;"></el-input>
        </el-form-item>
        <el-form-item label="销量：">
          <el-input placeholder="请输入销量" v-model="productDataModel.sales" :readonly="true" :disabled="true" style="width: 80%;"></el-input>
        </el-form-item>
        <el-form-item label="V豆折扣上限(%)：" prop="beanPercent" v-if="isNeedToShowBeanPercent()&&productDataModel.isPriceNegotiable==='false'">
          <el-input placeholder="按会员奖励设置比例" v-model="productDataModel.beanPercent" style="width: 80%;"></el-input>
        </el-form-item>
        <el-form-item label="V豆赠送上限(%)：" prop="giftPercent" v-if="productDataModel.isPriceNegotiable==='false'">
          <el-input placeholder="请输入..." v-model="productDataModel.giftPercent" style="width: 80%;"></el-input>
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
        <el-form-item label="商品重量：" prop="weight">
          <el-input placeholder="默认0" v-model="productDataModel.weight" style="width: 80%;">
            <template slot="append">KG</template>
          </el-input>
        </el-form-item>
        <el-form-item label="体验车辆" v-if="isNeedToShowTestDrive">
          <el-radio v-model="productDataModel.isSupportTestDrive" label="1">是</el-radio>
          <el-radio v-model="productDataModel.isSupportTestDrive" label="0">否</el-radio>
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
            <!-- <el-checkbox v-for="set in setOptions " :label="set" :key="set"></el-checkbox> -->
            <el-checkbox label="是否置顶"></el-checkbox>
            <el-checkbox label="是否订金支付" v-if="productDataModel.isPriceNegotiable==='false'"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
    </div>
    <el-form ref='subscriptionForm' label-width="120px " size="small" :model="productDataModel" :rules="subscriptionRules" v-if="isSubscriptionChecked()">
      <el-form-item label="订金金额：" prop="subscription">
        <el-input v-model="productDataModel.subscription" placeholder="请输入不大于销售价的数字" style="width: 80%;"></el-input>
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
import BaseInfoService from '@/service/commodity/commodity-mgmt/baseInfo';
import ProductCategorySelect from './components/ProductCategorySelect';
import { BizAvatarUploaderNew } from '@/components/BizForm';
import CategoryMgmtService from '@/service/commodity/category-mgmt/categoryMgmt';
import { VueCropper } from '@/components/BizForm';
import http from '@/common/http';
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
    const isPriceValid = (rule, rules, callback) => {
      if (this.productDataModel.price && Number(this.productDataModel.price) >= 0) {
        callback();
      } else {
        callback(new Error('销售价必须为数字值'));
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
        this.$message.warning('请至少选择一种配送方式');
        callback(new Error('请至少选择一种配送方式'));
      }
    };
    return {
      openV: false,
      picUrl: '',
      tagGroup: [],
      showRecommend: false,
      recommendTagGroup: [],
      newTagName: '',
      operations: [
        {
          label: '保存',
          name: 'save',
          type: 'primary',
          disabled: false,
          auth: ['admin:product.exchange.edit']
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
            required: true,
            trigger: 'blur',
            validator: isPriceValid
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
      productCategoryManage: [],
      productTypes: [],
      payOptions: [],
      shippingMethods: [],
      shippingMethodIds: [],
      setOptions: ['是否置顶', '是否订金支付'],
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
    ProductCategorySelect,
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
    baseInfo: {
      type: Object
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
        this.productTypes = [];
        this.payOptions = [];
        this.shippingMethods = [];
        this.checkedSet = [];
        this.recommendTagGroup = [];
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
        this.$refs.productDataForm.$el.scrollTop = 0;
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
    this.getDefaultImg();
    this.getProductCategoryList();
  },
  computed: {
    toggleRecommendTxt() {
      const { showRecommend } = this;
      if (showRecommend) {
        return '收起推荐';
      }
      return '展开推荐';
    },
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
    addRecommendTag(tag) {
      this.tagGroup = [...new Set(this.tagGroup.concat(tag))];
    },
    addNewTag() {
      if (String(this.newTagName).trim()) {
        this.tagGroup = [...new Set(this.tagGroup.concat(this.newTagName))];
      }
      this.newTagName = '';
    },
    removeTag(index) {
      this.tagGroup = this.tagGroup.slice(0, index).concat(this.tagGroup.slice(index + 1));
      console.log('tagGroup: ', index, this.tagGroup);
    },
    getRecommendTag() {
      const url = '/admin/common/keywords.jhtml';
      const { name } = this.productDataModel;
      const params = {
        content: name
      };
      http
        .get(url, params)
        .then(data => {
          this.recommendTagGroup = [...new Set(data.keywords)];
        })
        .catch(err => {
          console.log('ERR_GET_RECOMMEND_TAGS: ', err);
        });
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
    // Tag
    handleClose(tag) {
      this.productDataModel.reputations.splice(this.productDataModel.reputations.indexOf(tag), 1);
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
        categoryId: [],
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
        weight: this.productDataModel.weight,
        keyword: this.tagGroup
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
          this.tagGroup = data.productBasicInfoData ? data.productBasicInfoData.keyword : [];
          if (this.tagGroup.length) {
            this.showRecommend = false;
          } else {
            this.showRecommend = true;
          }
          // this.categoryOptions = data.productCategoryTree;
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
            this.getRecommendTag();
          } else {
            // this.productDataModel = this.getDefaultProductDataModel();
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
            this.loading = false;
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
        weight: productBasicInfoData.weight || 0
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
  // 关键词
  .item-content {
    display: flex;
    flex-direction: column;
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
        width: 85px;
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
  }
  .el-cascader {
    width: 262px;
  }
  .form-one {
    .el-form {
      height: 100%;
    }
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
