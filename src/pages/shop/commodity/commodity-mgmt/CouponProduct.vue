<template>
  <biz-grid class="coupon-product">
    <biz-save-button slot="top" :operations="operations" @operate="operate"></biz-save-button>
    <el-form ref="form" label-width="130px" size="small" v-loading="loading" :model="coupon" :rules="couponRules">
      <el-form-item label="优惠券名称：" prop="name">
        <el-input placeholder="请输入名称" v-model="coupon.name" style="width: 80%;"></el-input>
      </el-form-item>
      <el-form-item label="面值：" prop="amount">
        <el-input placeholder="请输入面值" v-model="coupon.amount" style="width: 80%;"></el-input>
      </el-form-item>
      <el-form-item label="优惠券数量：" prop="quantity">
        <el-input v-model="coupon.quantity" style="width: 80%;">
          <template slot="append">张</template>
        </el-input>
      </el-form-item>
      <el-form-item label="使用门槛：">
        <el-radio v-model="coupon.hasMinimumPrice" label="false">不限制</el-radio>
        <el-radio v-model="coupon.hasMinimumPrice" label="true">限制</el-radio>
      </el-form-item>
      <el-form-item label="门槛标准：" v-show="coupon.hasMinimumPrice==='true'" prop="minimumPrice">
        <el-input v-model="coupon.minimumPrice" style="width: 80%;">
          <template slot="append">元</template>
        </el-input>
      </el-form-item>
      <el-form-item label="有效期截止" prop="endDate">
        <el-date-picker v-model="coupon.endDate" value-format="yyyy-MM-dd" type="date" placeholder="选择结束时间"></el-date-picker>
      </el-form-item>
      <el-form-item label="允许参与商品" prop="participationWay">
        <el-radio v-model="coupon.participationWay" label="0">全部</el-radio>
        <el-radio v-model="coupon.participationWay" label="3">按商品</el-radio>
        <el-radio v-model="coupon.participationWay" label="2">按品牌</el-radio>
        <el-radio v-model="coupon.participationWay" label="1">按分类</el-radio>
        <participation-way :baseInfo="baseInfo" :participationWay="coupon.participationWay" v-model="selectedItems"></participation-way>
      </el-form-item>
    </el-form>
  </biz-grid>
</template>

<script>
import http from '@/common/http';
import urls from '@/common/urls';
import { BizGrid } from '@/components/BizGrid';
import BizSaveButton from '@/components/BizSaveButton';
import ParticipationWay from '@/pages/marketing/activity-mgmt/promotion/components/ParticipationWay.vue';
import BaseInfoService from '@/service/commodity/commodity-mgmt/baseInfo';

export default {
  name: 'CouponProduct',
  components: { BizGrid, BizSaveButton, ParticipationWay },
  props: {
    id: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      baseInfo: {},
      minimumPriceError: '',
      loading: false,
      operations: [
        {
          label: '保存',
          name: 'save',
          type: 'primary',
          auth: ['admin:product.edit']
        }
      ],
      selectedItems: [],
      coupon: {
        name: '',
        amount: '',
        hasMinimumPrice: 'false',
        minimumPrice: '',
        quantity: '1',
        endDate: '',
        participationWay: '0'
      },
      couponRules: {
        name: [{ required: true, message: '请输入优惠券名称', trigger: 'change' }],
        amount: [
          { required: true, message: '请输入面值', trigger: 'change' },
          { pattern: /^[0-9]+([.]{1}[0-9]{1,2})?$/, message: '请输入数值，保留小数点后两位', trigger: 'change' }
        ],
        quantity: [
          { required: true, message: '请输入优惠券数量', trigger: 'change' },
          { pattern: /^\+?[1-9][0-9]*$/, message: '请输入正整数', trigger: 'change' }
        ],
        minimumPrice: [
          {
            required: true,
            trigger: 'change',
            validator: this.minimumPriceValidator
          }
        ],
        endDate: [{ required: true, message: '请选择结束时间', trigger: 'change' }]
      }
    };
  },
  computed: {
    handledSelectedItems() {
      switch (this.coupon.participationWay) {
        case '0':
          return {};
        case '3':
          return {
            products: this.selectedItems
          };
        case '2':
          return {
            shopBrands: this.selectedItems
          };
        case '1':
          return {
            productCategories: this.selectedItems
          };
        default:
          return {};
      }
    },
    handledBaseInfo() {
      return Object.assign({ brands: [] }, this.baseInfo);
    }
  },
  watch: {},
  created() {
    this.getBaseInfo();
  },
  methods: {
    operate(name) {
      this[name]();
    },
    save() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.update();
        } else {
          return false;
        }
      });
    },
    update() {
      let params = {
        id: this.id,
        coupon: {
          name: this.coupon.name,
          amount: this.coupon.amount,
          quantity: this.coupon.quantity,
          endDate: this.coupon.endDate,
          participationWay: this.coupon.participationWay,
          minimumPrice: this.coupon.hasMinimumPrice === 'true' ? this.coupon.minimumPrice : ''
        }
      };
      Object.assign(params.coupon, this.handledSelectedItems);
      http
        .post(urls.productmgmt.CouponProduct, params)
        .then(data => {
          this.$message.success('更新优惠券信息成功');
        })
        .catch(ErrorData => {
          this.$message.warning(ErrorData.errorMessage);
        });
    },
    getCouponInfo() {
      let params = {
        id: this.id
      };
      http.get(urls.productmgmt.CouponProduct, params).then(data => {
        data = data.data.coupon;
        this.setSelectedItems(data);
        this.coupon.name = data.name;
        this.coupon.amount = data.amount;
        this.coupon.endDate = data.endDate;
        this.coupon.quantity = data.quantity;
        this.coupon.participationWay = data.participationWay;
        this.coupon.minimumPrice = data.minimumPrice || '';
        if (this.coupon.minimumPrice) {
          this.coupon.hasMinimumPrice = 'true';
        } else {
          this.coupon.hasMinimumPrice = 'false';
        }
      });
    },
    setSelectedItems(data) {
      switch (data.participationWay) {
        case '0':
          this.selectedItems = [];
          break;
        case '3':
          this.selectedItems = data.products;
          break;
        case '2':
          this.selectedItems = data.shopBrands;
          break;
        case '1':
          this.selectedItems = data.productCategories;
          break;
        default:
          this.selectedItems = [];
          break;
      }
    },
    getBaseInfo() {
      let params = {
        id: this.id,
        shopId: window.top.SHOP_ID || ''
      };
      BaseInfoService.queryProductBasicInfo(
        params,
        data => {
          this.baseInfo = data;
          this.baseInfo.productCategories = data.productCategoryTree;
          this.getCouponInfo();
        },
        ErrorData => {
          if (ErrorData.errorMessage !== '') {
            this.$message.warning(ErrorData.errorMessage);
          }
          console.log('获取商品基本信息失败', this.id);
        }
      );
    },
    minimumPriceValidator(rule, value, callback) {
      if (this.coupon.hasMinimumPrice === 'true') {
        if (!value) {
          console.log(value);
          callback(new Error('请输入门槛标准'));
        }
        if (!/^[0-9]+([.]{1}[0-9]{1,2})?$/.test(value)) {
          this.minimumPriceError = '请输入数值，保留小数点后两位';
          callback(new Error('请输入数值，保留小数点后两位'));
        }
      }
      callback();
    }
  }
};
</script>

<style lang="scss">
.coupon-product {
  .biz-save-button {
    margin-top: 5px;
  }
}
</style>
