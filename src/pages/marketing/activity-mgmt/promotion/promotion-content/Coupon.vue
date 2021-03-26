<template>
  <div class="promotion-content-coupon">
    <biz-grid>
      <biz-save-button slot="bottom" :operations="operations" @operate="operate" v-if="isEdit">
      </biz-save-button>
      <el-form :rules="rules" ref="form" :model="form" label-width="120px" size="small" v-loading="loading" :disabled="!isEdit">
        <!-- <el-form-item label="优惠券名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入优惠券名称"></el-input>
        </el-form-item> -->
        <el-form-item label="是否叠加">
          <el-radio v-model="form.isSuperposition" label="0">互斥</el-radio>
          <el-radio v-model="form.isSuperposition" label="1">叠加</el-radio>
        </el-form-item>
        <!-- <el-form-item label="发放总量" prop="totalCount">
          <el-input-number v-model="form.totalCount" placeholder="请输入发放总量" :min="1"></el-input-number>
        </el-form-item> -->
        <el-form-item label="面值" prop="amount">
          <el-input v-model.number="form.amount" placeholder="请输入优惠券面值">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="使用门槛" prop="minimumPrice" :error="errPrice">
          <el-radio v-model="condition" label="0">不限制</el-radio>
          <el-radio v-model="condition" label="1">满(元)可用</el-radio>
          <el-input v-model="form.minimumPrice" v-if="this.condition === '1'">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="有效截止日期" prop="endDate">
          <el-date-picker type="date" v-model="form.endDate" value-format="yyyy-MM-dd"></el-date-picker>
        </el-form-item>
        <!-- <el-form-item label="每人限领(张)" prop="limitCount">
          <el-input v-model="form.limitCount"></el-input>
        </el-form-item> -->
        <el-form-item label="适用范围" prop="participationWay" :error="errAdmit">
          <el-radio v-model="form.participationWay" label="Store">全部</el-radio>
          <el-radio v-model="form.participationWay" label="Product">按商品</el-radio>
          <el-radio v-model="form.participationWay" label="ShopBrand">按品牌</el-radio>
          <el-radio v-model="form.participationWay" label="ProductCategory">按分类</el-radio>
          <participation-way :participationWay="form.participationWay" v-model="selectedItems" :baseInfo="baseInfo">
          </participation-way>
        </el-form-item>
        <el-form-item label="使用规则" prop="introduction">
          <el-input type="textarea" :rows="2" placeholder="请输入使用规则" v-model="form.introduction"></el-input>
        </el-form-item>
      </el-form>
    </biz-grid>
  </div>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import BizSaveButton from '@/components/BizSaveButton';
import ParticipationWay from '../components/ParticipationWay.vue';
import service from '@/service/activity-mgmt/promotion-mgmt/PromotionContent';

export default {
  name: 'PromotionContentCoupon',
  props: {
    // id: {
    //   required: true,
    //   default: ''
    // }
    isEdit: {
      type: Boolean,
      default() {
        return true;
      }
    },
    memberRankList: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      // 已选中商品列表
      selectedItems: [],
      // 允许参与商品错误信息
      errAdmit: '',
      showListFlag: false,
      errPrice: '',
      rules: {
        name: [{ required: true, message: '请输入优惠券名称', trigger: 'blur' }],
        totalCount: [{ required: true, message: '请输入发放总量', trigger: 'blur' }],
        minimumPrice: [
          {
            pattern: /^[0-9]+\.?[0-9]*$/,
            message: '请输入非负数字',
            trigger: 'blur'
          }
        ],
        introduction: [{ max: 200, message: '不能超过200字', trigger: 'blur' }],
        amount: [
          { required: true, message: '请输入面值' },
          { type: 'number', max: 9999, message: '不能超过9999元' },
          { pattern: /^[1-9]+\.?[0-9]*$/, message: '请输入正数', trigger: 'blur' }
        ],
        endDate: [{ required: true, message: '请选择截止日期', trigger: 'blur' }],
        participationWay: [{ required: true, message: '请选择允许参与商品', trigger: 'blur' }]
      },
      loading: false,
      operations: [
        {
          label: '保存',
          name: 'save',
          type: 'primary',
          auth: ['admin:promotion.edit']
        }
      ],
      condition: '0',
      promotionId: '',
      form: this.setOriginFormData(),
      baseInfo: {
        shop: {
          name: ''
        }
      },
      // 已选中会员等级
      memberRankLists: []
    };
  },
  methods: {
    setOriginFormData() {
      return {
        memberRanks: [],
        amount: 0,
        couponType: 'Coupon',
        endDate: '',
        introduction: '',
        isSuperposition: '0',
        isExpiredNotice: '',
        limitCount: 1,
        participationWay: 'Store',
        minimumPrice: '',
        name: '',
        totalCount: ''
      };
    },
    operate(name) {
      this[name]();
    },
    clear() {
      this.condition = '0';
      this.form = this.setOriginFormData();
      this.$refs.form.resetFields();
    },
    refresh(form) {
      this.form = Object.assign(this.setOriginFormData(), form);
      // 根据参与方式确定selecetdItems的内容
      this.setSelectedItems(this.form);
      this.memberRankLists = this.form.memberRanks.map(rank => {
        return rank.id;
      });
      // 解决校验时'amount is not a string'
      this.form.amount = this.form.amount ? this.form.amount * 1 : 0;
      this.condition = this.form.minimumPrice === '' ? '0' : '1';
    },
    save() {
      if (this.condition === '1' && isNaN(this.form.minimumPrice)) {
        this.errPrice = '请输入使用门槛';
        return;
      }
      if (
        this.form.participationWay &&
        this.form.participationWay !== 'Store' &&
        this.selectedItems &&
        this.selectedItems.length === 0
      ) {
        this.$message.warning('请选择允许参与商品');
        return;
      }
      this.errPrice = '';
      this.$refs.form.validate(valid => {
        if (valid) {
          this.update();
        } else {
          return false;
        }
      });
    },
    update() {
      delete this.form.productCategories;
      delete this.form.products;
      delete this.form.shopBrands;
      this.form.memberRanks = this.memberRankLists.map(rank => {
        return { id: rank };
      });
      // 如果使用门槛为不限制,minimumPrice为空
      if (this.condition === '0') {
        this.form.minimumPrice = '';
      }
      let params = Object.assign(this.form, this.getSelectedItems(this.form), {
        promotionId: this.promotionId,
        endDate: `${this.form.endDate} 00:00:00`
      });
      this.$emit('updated', params);
      // service.update(
      //   params,
      //   data => {
      //     this.$message.success({ message: '更新成功' });
      //     this.$emit('updated', this.form);
      //     this.refresh(this.promotionId);
      //   },
      //   ErrorData => {
      //     console.log('ERR_UPDATE: ', ErrorData);
      //     this.$message.warning({ message: ErrorData.errorMessage });
      //   }
      // );
    },
    getBaseInfo() {
      service.queryBaseInfo(
        {},
        data => {
          this.baseInfo = data;
        },
        ErrorData => {
          console.log('ERR_GET_BASE_INFO: ', ErrorData);
          // this.$notify.warning({ message: ErrorData.errorMessage });
        }
      );
    },
    setSelectedItems(value) {
      switch (value.participationWay) {
        case 'Store':
          this.selectedItems = [];
          break;
        case 'Product':
          this.selectedItems = value.products || [];
          break;
        case 'ShopBrand':
          this.selectedItems = value.shopBrands;
          break;
        case 'ProductCategory':
          this.selectedItems = value.productCategories;
          break;
        default:
          this.selectedItems = [];
          break;
      }
    },
    getSelectedItems(value) {
      switch (value.participationWay) {
        case 'Store':
          return {};
        case 'Product':
          return {
            products: this.selectedItems
            // shopBrands: [],
            // productCategories: []
          };
        case 'ShopBrand':
          return {
            // products: [],
            shopBrands: this.selectedItems
            // productCategories: []
          };
        case 'ProductCategory':
          return {
            // products: [],
            // shopBrands: [],
            productCategories: this.selectedItems
          };
        default:
          return {};
      }
    }
  },
  mounted() {
    this.getBaseInfo();
  },
  watch: {
    condition: function() {
      this.$refs.form.clearValidate();
    }
    // 'form.participationWay': function(newVal, oldVal) {
    //   if (oldVal) {
    //     this.selectedItems = [];
    //   }
    // }
  },
  components: {
    BizGrid,
    BizSaveButton,
    ParticipationWay
  }
};
</script>

<style lang="scss">
.promotion-content-coupon {
  .checkbox-group {
    font-size: 14px;
  }
  .el-checkbox-group .el-checkbox {
    width: 160px;
    margin: 0;
    .el-checkbox__label {
      width: 140px;
      white-space: normal;
    }
  }
  .el-form {
    height: 100%;
    overflow: auto;
  }
  .el-select {
    margin-top: 18px;
  }
  .el-form-item__content > :first-child {
    margin-top: 0;
  }
  .el-form-item__content {
    .el-radio + .el-radio {
      // margin-left: 10px;
    }
  }
  // .el-textarea__inner {
  //   min-height: 31px !important;
  // }
}
</style>
