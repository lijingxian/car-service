<template>
  <biz-grid class="add-product-base-info">
    <biz-save-button slot="top" :operations="operations" @operate="operate" v-if="isEdit"></biz-save-button>
    <div class="form-one" ref="form">
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
        <el-form-item label="商品分类：" :required="true">
          <el-cascader
            v-model="productDataModel.categoryId"
            :options="categoryOptions"
            change-on-select
            :show-all-levels="false"
            :disabled="isCreated === false"
            @change="categoryChange"
          ></el-cascader>
          <div class="tooltip" v-show="isCreated === true">商品创建后分类不可修改</div>
        </el-form-item>
        <el-form-item label="类型：">
          <el-select v-model="productDataModel.productType" :disabled="isCreated === false" placeholder="请选择商品类型" @change="productTypeChange">
            <el-option v-for="item of productTypes" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
          <div class="tooltip" v-show="isCreated === true">商品创建后类型不可修改</div>
        </el-form-item>
        <el-form-item label="编号：">
          <el-input :placeholder="productDataModel.id?'请输入编号':'创建成功后自动生成'" v-model="productDataModel.sn" :readonly="true" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="商品条码：" prop="barCode">
          <el-input v-model="productDataModel.barCode" placeholder="请输入条码"></el-input>
        </el-form-item>
        <!-- 关键词 -->
        <el-form-item>
          <span slot="label" v-popover:codePop>
            关键词
            <i class="iconfont el-icon-question" style="color: #ff7300"></i>
            <el-popover ref="codePop" placement="left" width="300" trigger="hover">
              <div>填写关键词后，客户可以根据关键词搜索到此商品。使用符合用户习惯的关键词可以有效提高商品被搜索到的概率。</div>
            </el-popover>
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
                <el-tag v-for="(tag, index) in recommendTagGroup" :key="index" type="info" size="mini" @click="addRecommendTag(tag)">
                  {{
                  tag }}
                </el-tag>
                <span v-if="recommendTagGroup&&!recommendTagGroup.length" style="color: #bbbbbb;">暂无推荐</span>
              </div>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="销售价：" v-show="showPriceRadio">
          <el-radio v-model="productDataModel.isPriceNegotiable" label="false">一口价</el-radio>
          <el-radio v-model="productDataModel.isPriceNegotiable" label="true">价格面议</el-radio>
        </el-form-item>
        <el-form-item :label="priceLabel" prop="price" v-if="isNeedToShowPrice">
          <el-input placeholder="请输入一口价" v-model="productDataModel.price"></el-input>
        </el-form-item>
        <el-form-item label="市场指导价：" prop="marketPrice">
          <el-input placeholder="请输入市场指导价" v-model="productDataModel.marketPrice"></el-input>
        </el-form-item>
        <el-form-item label="成本价：" prop="cost">
          <el-input placeholder="请输入成本价" v-model="productDataModel.cost"></el-input>
        </el-form-item>
        <el-form-item label="商品缩略图：" prop="image">
          <BizAvatarUploaderNew v-model="productDataModel.image"></BizAvatarUploaderNew>
        </el-form-item>
        <el-form-item label="库存：" prop="stock">
          <el-input placeholder="请输入..." v-model="productDataModel.stock"></el-input>
        </el-form-item>
        <el-form-item label="销量：">
          <el-input placeholder="请输入销量" v-model="productDataModel.sales" :readonly="true" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="商品重量：" prop="weight">
          <el-input placeholder="默认0" v-model="productDataModel.weight">
            <template slot="append">KG</template>
          </el-input>
        </el-form-item>
        <el-form-item label="试驾车辆" v-if="isNeedToShowTestDrive">
          <el-radio v-model="productDataModel.isSupportTestDrive" label="1">是</el-radio>
          <el-radio v-model="productDataModel.isSupportTestDrive" label="0">否</el-radio>
        </el-form-item>
        <el-form-item label="口碑：">
          <el-tag
            v-for="tag in productDataModel.reputations"
            :key="tag"
            size="small"
            closable
            :disable-transitions="true"
            @close="handleClose(tag)"
            type="warning"
          >{{tag}}</el-tag>
          <el-input
            class="input-new-tag"
            v-model="inputValue"
            ref="saveTagInput"
            size="small"
            style="width:180px"
            placeholder="请输入1-6字口碑词汇"
            v-if="inputVisible"
            @keyup.enter.native="handleInputConfirm"
            @blur="handleInputConfirm"
          ></el-input>
          <el-button v-else class="button-new-tag" size="small" @click="showInput">+添加</el-button>
        </el-form-item>
        <el-form-item>
          <span slot="label">营销标签</span>
          <div class="item-content">
            <div class="tag-list">
              <div class="tag-group">
                <el-tag v-for="(tag ,index) of tags" :key="index" closable size="mini" @close="removeMarketTag(tag.id)">{{ tag.name }}</el-tag>
              </div>
              <div class="toggle-btn" @click="showMarketRecommend = !showMarketRecommend">
                <div class="iconfont biz-icon-i-web-zd1" :class="{ 'rotate-180': showMarketRecommend }"></div>
                {{ toggleMarketRecommendTxt }}
              </div>
              <div class="recommend-group" v-show="showMarketRecommend">
                <el-tag v-for="tag of recommendMarketTags.slice(0,10)" :key="tag.id" type="info" size="mini" @click="addRecommendMarketTag(tag)">{{ tag.name }}</el-tag>
                <el-tag
                  v-show="recommendMarketTags&&recommendMarketTags.length > 10"
                  type="info"
                  size="mini"
                  @click="dialogVisibility=true"
                  style="background-color: white;border:none;"
                >
                  更多
                  <i class="el-icon-d-arrow-right"></i>
                </el-tag>
                <span v-show="recommendMarketTags&&!recommendMarketTags.length" style="color: #bbbbbb;">暂无推荐</span>
              </div>
            </div>
          </div>
        </el-form-item>
      </el-form>
      <el-form
        ref="subscriptionForm"
        label-width="120px "
        size="small"
        :model="productDataModel"
        :rules="subscriptionRules"
        v-if="isSubscriptionChecked()"
        style="width:70%"
      >
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
    </div>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import BizSaveButton from '@/components/BizSaveButton';
import BaseInfoService from '@/service/commodity/commodity-mgmt/baseInfo';
import { BizAvatarUploaderNew } from '@/components/BizForm';
import CategoryMgmtService from '@/service/commodity/category-mgmt/categoryMgmt';
import http from '@/common/http';
import urls from '@/common/urls';
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
      let childrenProductCategoryDataList = getChildrenProductCategoryDataList(
        iterator.childrenProductCategoryDataList
      );
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
    const isBarCodeValid = (rule, value, callback) => {
      if (value && !/^[A-Z0-9]*$/.test(value)) {
        callback(new Error('条码由大写英文字符和数字字符组成'));
      } else {
        callback();
      }
    };
    return {
      dialogVisibility: false,
      newMarketTagName: '',
      // 营销标签
      tags: [],
      recommendMarketTags: [],
      showMarketRecommend: false,
      tagGroup: [],
      showRecommend: false,
      previewDialogOpen: false,
      recommendTagGroup: [],
      // 营销标签Id，用于上传
      recommendMarketTagId: '',
      newTagName: '',
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
        barCode: [
          {
            required: false,
            trigger: 'blur',
            validator: isBarCodeValid
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
    BizAvatarUploaderNew
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
      console.log(val);
      this.$refs.productDataForm.clearValidate();
      if (!val) {
        this.isCreated = true;
        this.productTypes = [];
        this.payOptions = [];
        this.shippingMethods = [];
        this.checkedSet = [];
        this.recommendTagGroup = [];
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
        // this.getProductCategoryList(this.baseInfo.shopId);
        this.$nextTick(() => {
          this.refresh();
        });
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
    toggleMarketRecommendTxt() {
      const { showMarketRecommend } = this;
      if (showMarketRecommend) {
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
        if (
          item.id === this.productDataModel.categoryId[this.productDataModel.categoryId.length - 1] &&
          item.type === 'car'
        ) {
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
    operate(name) {
      this[name]();
    },
    preview() {
      this.previewDialogOpen = true;
    },
    addRecommendTag(tag) {
      if (this.tagGroup.includes(tag)) {
        this.$message.warning('该标签已存在，请重新添加');
        return;
      }
      this.tagGroup = [...new Set(this.tagGroup.concat(tag))];
    },
    addNewTag() {
      const tag = String(this.newTagName).trim();
      if (!tag) return;
      if (this.tagGroup.includes(tag)) {
        this.$message.warning('该标签已存在，请重新添加');
      } else {
        this.tagGroup = [...new Set(this.tagGroup.concat(tag))];
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
        weight: '0',
        wholesalePrice: ''
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
        keyword: this.tagGroup,
        tags: this.tags,
        barCode: this.productDataModel.barCode,
        vin: this.productDataModel.vin,
        wholesalePrice: this.productDataModel.wholesalePrice
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
      this.getRecommendMarketTags();
      BaseInfoService.queryProductBasicInfo(
        params,
        data => {
          this.tagGroup = data.productBasicInfoData ? data.productBasicInfoData.keyword : [];
          if (data.productBasicInfoData) {
            this.tags = data.productBasicInfoData.tags || [];
          } else {
            this.tags = [];
          }
          if (this.tagGroup && this.tagGroup.length) {
            this.showRecommend = false;
          } else {
            this.showRecommend = true;
          }
          if (this.tags && this.tags.length > 0) {
            this.showMarketRecommend = false;
          } else {
            this.showMarketRecommend = true;
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
          // if (data.productBasicInfoData && data.productBasicInfoData.isSubmit === '0') {
          //   this.operations[0].disabled = true;
          // } else {
          //   this.operations[0].disabled = false;
          // }
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
    getRecommendMarketTags() {
      let params = {
        isIncludeParent: '1',
        isIncludeTag: '1',
        shopId: window.top.SHOP_ID || '',
        categoryType: '商品/商品营销'
      };
      http.get('/admin/tag/storeTagcategories.jhtml', params).then(data => {
        this.recommendMarketTags = data.content[0].tags || [];
        this.recommendMarketTagId = data.content[0].id;
      });
    },
    addRecommendMarketTag(tag) {
      if (!this.recommendMarketTagId) {
        this.$message.warning('请新建营销标签');
        return;
      }
      tag = tag.id
        ? tag
        : {
          name: this.newMarketTagName,
          id:
              'temp' +
              Math.random()
                .toString(36)
                .substr(-10)
        };
      for (const iterator of this.tags) {
        if (iterator.name === tag.name) {
          this.$message.warning('该标签已存在，请重新添加');
          return;
        }
      }
      this.tags.push(tag);
      this.newMarketTagName = '';
    },
    addRecommendMarketTagByButton(tag) {
      if (this.newMarketTagName === '') {
        this.$message.warning('请输入自定义标签');
        return;
      }
      tag = tag.id
        ? tag
        : {
          name: this.newMarketTagName,
          id:
              'temp' +
              Math.random()
                .toString(36)
                .substr(-10)
        };
      for (const iterator of this.tags) {
        if (iterator.name === tag.name) {
          this.$message.warning('该标签已存在，请重新添加');
          return;
        }
      }
      this.tags.push(tag);
      this.newMarketTagName = '';
    },
    removeMarketTag(id) {
      let index = 0;
      for (; index < this.tags.length; index++) {
        const element = this.tags[index];
        if (element.id === id) {
          break;
        }
      }
      this.tags = this.tags.slice(0, index).concat(this.tags.slice(index + 1));
    },
    saveRecommendMarketTags() {
      let newTags = this.tags.filter(tag => {
        return tag.id.indexOf('temp') !== -1;
      });
      let promiseList = [];
      for (const tag of newTags) {
        let params = {
          name: tag.name,
          type: '0',
          description: '',
          hierarchy: '1',
          shopId: window.top.SHOP_ID || '',
          tagCategory: {
            id: this.recommendMarketTagId
          }
        };
        promiseList.push(http.post(urls.shopRate.TagGroupTags_tag, params));
      }
      return Promise.all(promiseList);
    },
    selectedTag(tags) {
      this.tags = tags;
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
        weight: productBasicInfoData.weight || 0,
        barCode: productBasicInfoData.barCode,
        vin: productBasicInfoData.vin,
        wholesalePrice: productBasicInfoData.wholesalePrice
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

      let resList = await this.saveRecommendMarketTags();
      let newTags = this.tags.filter(tag => {
        return tag.id.indexOf('temp') !== -1;
      });
      for (const tag of newTags) {
        for (const res of resList) {
          if (res.data.name === tag.name) {
            tag.id = res.data.id.toString();
          }
        }
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
      // if (this.productDataModel.productType !== '7' && this.shippingMethodIds.length === 0) {
      //   this.$message.warning('请最少选择一种配送方式');
      //   return;
      // }
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
