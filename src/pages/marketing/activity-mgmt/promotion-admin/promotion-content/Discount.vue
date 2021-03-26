<template>
  <div class="promotion-content-discount">
    <biz-grid>
      <biz-save-button slot="bottom" :operations="operations" @operate="operate" v-if="isEdit">
      </biz-save-button>
      <el-form :rules="rules" ref="form" :model="form" label-width="120px" size="small" v-loading="loading" :disabled="!isEdit">
        <el-form-item label="是否叠加">
          <el-radio v-model="form.isSuperposition" label="0">互斥</el-radio>
          <el-radio v-model="form.isSuperposition" label="1">叠加</el-radio>
        </el-form-item>
        <el-form-item label="活动折扣" prop="discount" :error="errDiscount">
          <div slot="label" style="float:right">
            活动折扣
            <el-button type="text" size="small" v-popover:onTimePop>
              <i class="iconfont el-icon-question"></i>
            </el-button>
            <el-popover ref="onTimePop" placement="bottom-start" width="320" trigger="hover">
              <p>活动折扣说明：</p>
              <p>折扣输入90%时，表示可用90%的价格购买，</p>
              <p>例，原100元得商品参与折扣为90%的活动，</p>
              <p>最终付款价格为90元。</p>
              折扣范围为1-99之间的整数。
            </el-popover>
          </div>
          <el-input v-model="form.discount" placeholder="折扣范围为1-99之间的整数">
            <template slot="append">%</template>
          </el-input>
        </el-form-item>
        <el-form-item label="限购设置" prop="maximumQuantity" :error="errQuantity">
          <el-radio v-model="condition" label="0">不限购</el-radio>
          <el-radio v-model="condition" label="1">每人限购(件)</el-radio>
          <el-input v-model.number="form.maximumQuantity" v-if="this.condition === '1'">
            <template slot="append">件</template>
          </el-input>
        </el-form-item>
        <el-form-item label="折扣范围" prop="participationWay">
          <el-radio v-model="form.participationWay" label="Store">全部</el-radio>
          <el-radio v-model="form.participationWay" label="Product">按商品</el-radio>
          <el-radio v-model="form.participationWay" label="ShopBrand">按品牌</el-radio>
          <el-radio v-model="form.participationWay" label="ProductCategory">按分类</el-radio>
          <participation-way :participationWay="form.participationWay" v-model="selectedItems" :baseInfo="baseInfo">
          </participation-way>
        </el-form-item>
        <!-- <el-form-item label="使用规则" prop="introduction">
          <el-input type="textarea" :rows="2" placeholder="请输入使用规则" v-model="form.introduction"></el-input>
        </el-form-item> -->
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
  name: 'PromotionContentDiscount',
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
    const discountValid = (rule, rules, callback) => {
      let reg = new RegExp(/^[1-9][0-9]?$/);
      if (this.form.discount) {
        if (reg.test(this.form.discount) && this.form.discount < 100) {
          callback();
        } else {
          callback(new Error('请输入小于100的正整数'));
        }
      }
      callback();
    };
    const maximumQuantityValid = (rule, rules, callback) => {
      let reg = new RegExp(/^[1-9]\d*$/);
      console.log(this.form.maximumQuantity);
      if ((this.form.maximumQuantity && this.condition === '1') || this.form.maximumQuantity === 0) {
        console.log(1111);
        if (this.condition === '1' && !reg.test(this.form.maximumQuantity)) {
          callback(new Error('请输入正整数'));
        } else {
          callback();
        }
      }
      callback();
    };
    return {
      baseInfo: {
        shop: {
          name: ''
        }
      },
      // 已选中会员等级
      memberRankLists: [],
      // 已选中商品列表
      selectedItems: [],
      rules: {
        discount: [
          { required: true, message: '请输入折扣', trigger: 'blur' },
          {
            validator: discountValid,
            trigger: 'blur'
          }
        ],
        maximumQuantity: [
          { required: false, message: '请输入限购数量', trigger: 'blur' },
          {
            validator: maximumQuantityValid,
            trigger: 'blur'
          }
        ],
        introduction: [{ max: 500, message: '不超过500字', trigger: 'blur' }],
        participationWay: [{ required: true, message: '请选择允许参与商品', trigger: 'blur' }]
      },
      errDiscount: '',
      errQuantity: '',
      loading: false,
      operations: [
        {
          label: '保存',
          name: 'save',
          type: 'primary'
        }
      ],
      condition: '0',
      promotionId: '',
      form: this.setOriginFormData()
    };
  },
  methods: {
    setOriginFormData() {
      return {
        discount: '99',
        maximumQuantity: '1',
        introduction: '',
        isSuperposition: '0',
        memberRanks: [],
        participationWay: ''
      };
    },
    operate(name) {
      this[name]();
    },
    clear() {
      this.condition = '0';
      this.$refs.form.resetFields();
    },
    refresh(form) {
      this.form = Object.assign(this.setOriginFormData(), form);
      this.form.discount = Number(this.form.discount ? this.form.discount : '99');
      this.form.maximumQuantity = Number(this.form.maximumQuantity ? this.form.maximumQuantity : '');
      console.log(this.form.maximumQuantity === '');
      this.condition = this.form ? (this.form.maximumQuantity ? '1' : '0') : '0';
      // 根据参与方式确定selecetdItems的内容
      this.setSelectedItems(this.form);
    },
    save() {
      if (
        this.form.participationWay &&
        this.form.participationWay !== 'Store' &&
        this.selectedItems &&
        this.selectedItems.length === 0
      ) {
        this.$message.warning('请选择允许参与商品');
        return;
      }
      if (String(this.form.maximumQuantity).indexOf('.') !== -1) {
        this.errQuantity = '请输入整数';
        return;
      }
      this.errDiscount = '';
      this.errQuantity = '';
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
      let params = Object.assign(
        {
          isSuperposition: this.form.isSuperposition,
          participationWay: this.form.participationWay,
          promotionId: this.promotionId,
          maximumQuantity: this.condition === '0' ? '' : this.form.maximumQuantity,
          discount: this.form.discount,
          introduction: this.form.introduction
        },
        this.getSelectedItems(this.form)
      );
      this.$emit('updated', params);
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
    // 'form.participationWay': function(newVal, oldVal) {
    //   if (oldVal) {
    //     this.selectedItems = [];
    //   }
    // },
    condition: function() {
      this.$refs.form.clearValidate();
    }
  },
  components: {
    BizGrid,
    BizSaveButton,
    ParticipationWay
  }
};
</script>

<style lang="scss">
.promotion-content-discount {
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
}
</style>
