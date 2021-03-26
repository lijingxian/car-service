<template>
  <biz-grid class="add-product-base-info">
    <biz-save-button slot="top" :operations="operations" @operate="operate" v-if="isEdit"></biz-save-button>
    <div class="form-one" ref="form">
      <el-form ref="productDataForm" label-width="150px" size="small" v-loading="loading" :model="productDataModel"
        :rules="productDataRules" :disabled="!isEdit" :inline-message="true">
        <el-form-item :label="priceLabel" prop="price" v-if="isNeedToShowPrice">
          <el-input placeholder="请输入一口价" v-model="productDataModel.price"></el-input>
        </el-form-item>
        <el-form-item label="市场指导价" prop="marketPrice">
          <el-input placeholder="请输入市场指导价" v-model="productDataModel.marketPrice"></el-input>
        </el-form-item>
        <el-form-item label="销售方式" v-if="showPriceRadio">
          <el-radio v-model="productDataModel.saleType" label="0">一口价</el-radio>
          <el-radio v-model="productDataModel.saleType" label="1">价格面议</el-radio>
          <el-radio v-model="productDataModel.saleType" label="2">定金预售</el-radio>
        </el-form-item>
        <el-form-item label="价格提示语" prop="priceDesp" v-if="productDataModel.saleType==='1'">
          <el-input placeholder="请输入价格提示语" v-model="productDataModel.priceDesp"></el-input>
        </el-form-item>
        <el-form-item label="定金金额" prop="subscription" v-if="productDataModel.saleType==='2'">
          <el-input v-model="productDataModel.subscription" placeholder="请输入不大于销售价的数字"></el-input>
          <el-checkbox style="margin-left:10px" true-label="true" false-label="false" v-model="productDataModel.isSubscriptionReturn">定金可退
          </el-checkbox>
        </el-form-item>
        <el-form-item label="成本价" prop="cost">
          <el-input placeholder="请输入成本价" v-model="productDataModel.cost"></el-input>
        </el-form-item>
        <el-form-item label="库存数量" prop="stock">
          <el-input placeholder="请输入..." v-model="productDataModel.stock"></el-input>
        </el-form-item>
        <el-form-item label="销量">
          <el-input placeholder="请输入销量" v-model="productDataModel.sales" :readonly="true" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item prop="beanPercent" v-if="isNeedToShowBeanPercent()&&productDataModel.saleType==='0'">
          <span slot="label" v-popover:code1>
            V豆折扣上限(%)
            <i class="iconfont el-icon-question" style="color: #ff7300"></i>
            <el-popover ref="code1" placement="left" width="300" trigger="hover">
              <div>购买时可以抵扣价格的比例，默认按会员卡制式中的设置比例抵扣，如本商品需特殊化可填写其对应的抵扣比例值。</div>
            </el-popover>
          </span>
          <el-input placeholder="按会员奖励设置比例" v-model="productDataModel.beanPercent"></el-input>
        </el-form-item>
        <el-form-item prop="giftPercent" v-if="productDataModel.saleType==='0'">
          <span slot="label" v-popover:code2>
            V豆赠送上限(%)
            <i class="iconfont el-icon-question" style="color: #ff7300"></i>
            <el-popover ref="code2" placement="left" width="300" trigger="hover">
              <div>购买时可以赠送等同价格比例的V豆，默认按会员卡制式中的设置赠送抵扣，如本商品需特殊化可填写其对应的赠送比例值。</div>
            </el-popover>
          </span>
          <el-input placeholder="请输入..." v-model="productDataModel.giftPercent"></el-input>
        </el-form-item>
        <el-form-item>
          <span slot="label" v-popover:codePop>
            搜索关键词
            <i class="iconfont el-icon-question" style="color: #ff7300"></i>
            <el-popover ref="codePop" placement="left" width="300" trigger="hover">
              <div>填写关键词后，客户可以根据关键词搜索到此商品。使用符合用户习惯的关键词可以有效提高商品被搜索到的概率。</div>
            </el-popover>
          </span>
          <div class="item-content">
            <div class="tag-list">
              <div class="tag-group">
                <el-tag v-for="(tag, index) in tagGroup" :key="index" closable size="mini" @close="removeTag(index)">{{ tag }}
                </el-tag>
              </div>
              <div class="toggle-btn" @click="showRecommend = !showRecommend">
                <div class="iconfont biz-icon-i-web-zd1" :class="{ 'rotate-180': showRecommend }"></div>
                    {{ toggleRecommendTxt }}
              </div>
              <div class="recommend-group" v-show="showRecommend">
                <el-tag v-for="(tag, index) in recommendTagGroup" :key="index" type="info" size="mini"
                  @click="addRecommendTag(tag)">
                  {{ tag }}
                </el-tag>
                <span v-if="recommendTagGroup&&!recommendTagGroup.length" style="color: #bbbbbb;">暂无推荐</span>
              </div>
            </div>
            <div class="add-tag">
              <el-input v-model="newTagName" :maxlength="18" placeholder="请输入自定义关键词"></el-input>
              <el-button @click="addNewTag" type="primary">添加</el-button>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="是否置顶">
          <el-radio-group v-model="productDataModel.isTop">
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
import http from '@/common/http';

export default {
  name: 'CommodityMgmtBaseInfo',
  data() {
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
    return {
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
          auth: ['admin:product.edit']
        }
      ],
      productDataRules: {
        price: [
          {
            required: true,
            trigger: 'blur',
            validator: isPriceValid
          }
        ],
        priceDesp: [
          {
            required: true,
            trigger: 'blur',
            message: '请输入价格提示语（15字以内）',
            max: 15
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
        stock: [
          {
            required: true,
            trigger: 'blur',
            validator: isStockValid
          }
        ],
        subscription: [
          {
            required: true,
            trigger: 'blur',
            validator: isSubscriptionValid
          }
        ]
      },
      productDataModel: this.getDefaultProductDataModel(),
      loading: false,
      refreshSign: true
    };
  },
  components: {
    BizGrid,
    BizSaveButton
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
    tabSelection(val) {
      if (val === 'sales') {
        if (this.id !== '') {
          this.refresh();
        }
      }
    },
    open(val) {
      if (!val) {
        this.$refs.productDataForm.clearValidate();
        this.recommendTagGroup = [];
      }
    }
  },
  created() {},
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
        this.productDataModel.saleType !== '1'
      ) {
        return true;
      }
      return false;
    },
    priceLabel() {
      if (this.productDataModel.productType === '0') {
        return '一口价';
      }
      return '销售价';
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
    getDefaultProductDataModel() {
      return {
        shopId: window.top.SHOP_ID || '',
        id: '',
        saleType: '0',
        cost: '',
        marketPrice: '',
        sales: '',
        stock: '0',
        isSupportTestDrive: '0',
        isList: 'false',
        isTop: 'false',
        priceDesp: '价格区间',
        isSubscription: 'false',
        subscription: '',
        isSubscriptionReturn: 'true',
        bean: '',
        beanPercent: '',
        giftPercent: '',
        productType: '0',
        wholesalePrice: ''
      };
    },
    getSaveProductDataModel() {
      return {
        shopId: this.productDataModel.shopId,
        id: this.id,
        price: this.productDataModel.price || '0',
        priceDesp: this.productDataModel.priceDesp,
        cost: this.productDataModel.cost,
        marketPrice: this.productDataModel.marketPrice,
        sales: this.productDataModel.sales,
        stock: this.productDataModel.stock,
        saleType: this.productDataModel.saleType,
        isTop: this.productDataModel.isTop,
        isSubscription: String(this.isSubscriptionChecked()),
        subscription: this.productDataModel.subscription,
        isSubscriptionReturn: this.productDataModel.isSubscriptionReturn,
        bean: this.productDataModel.bean,
        beanPercent: this.productDataModel.beanPercent,
        giftPercent: this.productDataModel.giftPercent,
        keyword: this.tagGroup,
        wholesalePrice: this.productDataModel.wholesalePrice
      };
    },
    isNeedToShowBeanPercent() {
      if (this.productDataModel.productType === '0' || this.productDataModel.productType === '7') {
        return true;
      }

      return false;
    },
    isSubscriptionChecked() {
      if (this.productDataModel.saleType === '2') {
        return true;
      }
      return false;
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
          if (this.tagGroup && this.tagGroup.length) {
            this.showRecommend = false;
          } else {
            this.showRecommend = true;
          }
          this.refreshSign = !this.refreshSign;
          if (this.id) {
            this.productDataModel = data.productBasicInfoData;
            this.getRecommendTag();
          } else {
          }
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
        price: productBasicInfoData.price,
        priceDesp: productBasicInfoData.priceDesp,
        cost: productBasicInfoData.cost,
        marketPrice: productBasicInfoData.marketPrice,
        sales: productBasicInfoData.sales,
        stock: productBasicInfoData.stock,
        isTop: productBasicInfoData.isTop,
        isSubscription: productBasicInfoData.isSubscription,
        subscription: productBasicInfoData.subscription,
        isSubscriptionReturn: productBasicInfoData.isSubscriptionReturn || 'true',
        bean: productBasicInfoData.bean,
        beanPercent: productBasicInfoData.beanPercent,
        giftPercent: productBasicInfoData.giftPercent,
        saleType: productBasicInfoData.saleType,
        productType: productBasicInfoData.productType,
        wholesalePrice: productBasicInfoData.wholesalePrice
      };
    },
    async save() {
      this.$refs.productDataForm.validate(valid => {
        if (valid) {
          this.updateProduct();
        } else {
          return false;
        }
      });
    },
    updateProduct() {
      let params = this.getSaveProductDataModel();
      http
        .put('/admin/shopProduct/productSaleInfo.jhtml', params)
        .then(data => {
          this.refresh();
          this.$message.success('更新成功');
          this.$emit('operationSuccess');
        })
        .catch(errData => {
          if (errData.errorMessage) {
            this.$message.warning(errData.errorMessage);
          }
        })
        .finally(() => {
          this.loading = false;
        });
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
