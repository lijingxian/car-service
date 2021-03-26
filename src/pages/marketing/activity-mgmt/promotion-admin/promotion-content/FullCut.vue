<template>
  <div class="promotion-content-full-cut">
    <biz-grid>
      <biz-save-button slot="bottom" :operations="operations" @operate="operate" v-if="isEdit">
      </biz-save-button>
      <el-form :rules="rules" ref="form" :model="form" label-width="120px" size="small" v-loading="loading" :disabled="!isEdit">
        <!-- <el-form-item label="会员等级">
          <rank-item :rankData="rankData" ref="rank"></rank-item>
        </el-form-item> -->
        <el-form-item label="是否叠加">
          <el-radio v-model="form.isSuperposition" label="0">互斥</el-radio>
          <el-radio v-model="form.isSuperposition" label="1">叠加</el-radio>
        </el-form-item>
        <el-form-item label="满减条件" prop="count">
          <el-radio v-model="condition" label="0">满(元)</el-radio>
          <el-radio v-model="condition" label="1">满(件)</el-radio>
          <el-input v-model="form.count">
            <template slot="append">{{this.condition === '0' ? '元' : '件'}}</template>
          </el-input>
        </el-form-item>
        <el-form-item label="满减优惠" prop="typeCount">
          <el-radio v-model="conditionType" label="0">打(折)</el-radio>
          <el-radio v-model="conditionType" label="1">减(元)</el-radio>
          <el-input v-model="form.typeCount">
            <template slot="append">{{this.conditionType === '1' ? '元' : '%'}}</template>
          </el-input>
        </el-form-item>
        <el-form-item label="满减范围" prop="participationWay">
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
  name: 'PromotionContentFullCut',
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
    // 检查优惠类型
    let checkTypeCount = (rule, value, callback) => {
      // 打x折
      if (this.conditionType === '0') {
        let reg = new RegExp(/^[1-9][0-9]?$/);
        if (value) {
          if (reg.test(value) && value < 100) {
            callback();
          } else {
            callback(new Error('请输入小于100的正整数'));
          }
        }
        callback();
      }
      // 减x元
      if (this.conditionType === '1') {
        if (String(value).split('.')[1] ? String(value).split('.')[1].length > 2 : false) {
          return callback(new Error('不得超过两位小数'));
        }
      }
      return callback();
    };
    // 检查优惠条件
    let checkCount = (rule, value, callback) => {
      // 满x元
      if (this.condition === '0') {
        if (String(value).split('.')[1] ? String(value).split('.')[1].length > 2 : false) {
          return callback(new Error('不得超过两位小数'));
        }
      }
      // 满x件
      if (this.condition === '1') {
        let reg = new RegExp(/\.0*[1-9]/);
        if (reg.test(value)) {
          return callback(new Error('请输入整数'));
        } else {
          this.form.count = parseInt(value);
        }
      }
      return callback();
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
        count: [
          { required: true, message: '请输入优惠条件', trigger: 'blur' },
          {
            pattern: /^[0-9]+\.?[0-9]*$/,
            message: '请输入非负数字',
            trigger: 'blur'
          },
          { validator: checkCount, trigger: 'blur' }
        ],
        typeCount: [
          { required: true, message: '请输入优惠类型', trigger: 'blur' },
          {
            pattern: /^[0-9]+\.?[0-9]*$/,
            message: '请输入非负数字',
            trigger: 'blur'
          },
          { validator: checkTypeCount, trigger: 'blur' }
        ],
        introduction: [{ max: 500, message: '不超过500字', trigger: 'blur' }],
        participationWay: [{ required: true, message: '请选择允许参与商品', trigger: 'blur' }]
      },
      loading: false,
      operations: [
        {
          label: '保存',
          name: 'save',
          type: 'primary'
        }
      ],
      condition: '0',
      conditionType: '0',
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
        count: '',
        typeCount: '',
        introduction: '',
        isSuperposition: '0',
        memberRanks: [],
        participationWay: ''
      };
    },
    clear() {
      this.form = this.setOriginFormData();
      this.condition = '0';
      this.conditionType = '0';
    },
    refresh(form) {
      this.form = Object.assign(this.setOriginFormData(), form);
      this.form.count = this.form.minimumPrice === '' ? this.form.minimumQuantity : this.form.minimumPrice;
      this.form.typeCount = this.form.discount === '' ? this.form.amount : this.form.discount;
      this.condition = this.form.minimumPrice === '' ? '1' : '0';
      this.conditionType = this.form.discount === '' ? '1' : '0';
      // 根据参与方式确定selecetdItems的内容
      this.setSelectedItems(this.form);
    },
    save() {
      console.log(this.selectedItems);
      if (
        this.form.participationWay &&
        this.form.participationWay !== 'Store' &&
        this.selectedItems &&
        this.selectedItems.length === 0
      ) {
        this.$message.warning('请选择允许参与商品');
        return;
      }
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
          minimumPrice: this.condition === '0' ? this.form.count : '',
          minimumQuantity: this.condition === '1' ? this.form.count : '',
          discount: this.conditionType === '0' ? this.form.typeCount : '',
          amount: this.conditionType === '1' ? this.form.typeCount : '',
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
          this.selectedItems = value.shopBrands || [];
          break;
        case 'ProductCategory':
          this.selectedItems = value.productCategories || [];
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
.promotion-content-full-cut {
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
