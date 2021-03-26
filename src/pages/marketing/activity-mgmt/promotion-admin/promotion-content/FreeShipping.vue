<template>
  <div class="promotion-content-free-shipping">
    <biz-grid>
      <biz-save-button slot="bottom" :operations="operations" @operate="operate" v-if="isEdit">
      </biz-save-button>
      <el-form :rules="rules" ref="form" :model="form" label-width="120px" size="small" v-loading="loading" :disabled="!isEdit">
        <el-form-item label="是否叠加">
          <el-radio v-model="form.isSuperposition" label="0">互斥</el-radio>
          <el-radio v-model="form.isSuperposition" label="1">叠加</el-radio>
        </el-form-item>
        <el-form-item label="包邮门槛">
          <el-radio v-model="condition" label="0">满(元)</el-radio>
          <el-radio v-model="condition" label="1">满(件)</el-radio>
        </el-form-item>
        <el-form-item prop="minimumCount" :error="errCount">
          <el-input v-model="form.minimumCount">
            <template slot="append">{{this.condition === '0' ? '元' : '件'}}</template>
          </el-input>
        </el-form-item>
        <el-form-item label="包邮范围" prop="participationWay">
          <el-radio v-model="form.participationWay" label="Store">全部</el-radio>
          <el-radio v-model="form.participationWay" label="Product">按商品</el-radio>
          <el-radio v-model="form.participationWay" label="ShopBrand">按品牌</el-radio>
          <el-radio v-model="form.participationWay" label="ProductCategory">按分类</el-radio>
          <participation-way :participationWay="form.participationWay" v-model="selectedItems" :baseInfo="baseInfo">
          </participation-way>
        </el-form-item>
        <!-- <el-form-item label="使用规则" prop="introduction">
        <el-input type="textarea"
          :rows="2"
          placeholder="请输入使用规则"
          v-model="form.introduction"
        ></el-input>
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
  name: 'PromotionContentFreeShipping',
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
      rankData: {
        memberRankList: this.memberRankList,
        publishTarget: '0',
        memberRanks: [],
        members: []
      },
      baseInfo: {
        shop: {
          name: ''
        }
      },
      // 已选中会员等级
      memberRankLists: [],
      // 已选中商品列表
      selectedItems: [],
      errCount: '',
      loading: false,
      operations: [
        {
          label: '保存',
          name: 'save',
          type: 'primary'
        }
      ],
      rules: {
        minimumCount: [
          { required: true, message: '请输入优惠条件', trigger: 'blur' },
          { pattern: /^[0-9]+\.?[0-9]*$/, message: '请输入非负数字', trigger: 'blur' }
        ],
        introduction: [{ max: 500, message: '不超过500字', trigger: 'blur' }],
        participationWay: [{ required: true, message: '请选择允许参与商品', trigger: 'blur' }]
      },
      condition: '0',
      promotionId: '',
      form: this.setOriginFormData()
    };
  },
  methods: {
    operate(name) {
      this[name]();
    },
    setOriginFormData() {
      return {
        minimumCount: '1',
        introduction: '',
        memberRanks: [],
        isSuperposition: '0',
        participationWay: ''
      };
    },
    clear() {
      this.condition = '0';
      this.form = this.setOriginFormData();
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
      this.condition = this.form.minimumPrice === '' ? '1' : '0';
      if (this.condition === '0') {
        this.form.minimumCount = this.form.minimumPrice;
      } else {
        this.form.minimumCount = this.form.minimumQuantity;
      }
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
      if (this.condition === '1') {
        let reg = new RegExp(/\.0*[1-9]/);
        if (reg.test(this.form.minimumCount)) {
          this.errCount = '请输入整数';
          return;
        } else {
          this.form.minimumCount = parseInt(this.form.minimumCount);
        }
      }
      this.errCount = '';
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
          minimumPrice: this.condition === '0' ? this.form.minimumCount : '',
          minimumQuantity: this.condition === '1' ? this.form.minimumCount : '',
          introduction: this.form.introduction,
          publishTarget: this.rankData.publishTarget,
          memberRanks: this.rankData.memberRanks,
          members: this.rankData.members
        },
        this.getSelectedItems(this.form)
      );
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
.promotion-content-free-shipping {
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
