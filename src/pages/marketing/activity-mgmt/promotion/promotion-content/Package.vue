<template>
  <div class="promotion-content-package">
    <biz-grid>
      <biz-save-button slot="bottom" :operations="operations" @operate="operate" v-if="isEdit">
      </biz-save-button>
      <el-form :rules="rules" ref="form" :model="form" label-width="120px" size="small" v-loading="loading" :disabled="!isEdit">
        <!-- <el-form-item label="是否叠加">
          <el-radio v-model="form.isSuperposition" label="0">互斥</el-radio>
          <el-radio v-model="form.isSuperposition" label="1">叠加</el-radio>
        </el-form-item> -->
        <el-form-item label="套餐价格" prop="amount">
          <el-input v-model="form.amount" placeholder="请输入套餐价格"></el-input>
        </el-form-item>
        <el-form-item label="套餐商品" prop="typeCount" class="isRequired">
          <participation-way :participationWay="'Product'" v-model="selectedGiftList"></participation-way>
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
  name: 'PromotionContentPackage',
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
      console.log(1);
      if (this.selectedGiftList.length === 0) {
        return callback(new Error('请选择搭配商品'));
      } else {
        return callback();
      }
    };
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
      // 选中赠品列表
      selectedGiftList: [],
      showDialog: false,
      giftList: [],
      dialogPagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        // 总条目数
        total: 0
      },
      dialogFilters: [
        {
          type: 'input',
          placeholder: '请输入编号/商品名',
          name: 'searchbar',
          value: ''
        }
      ],
      rules: {
        amount: [{ required: true, message: '请输入一口价', trigger: 'blur' }],
        introduction: [{ max: 500, message: '不超过500字', trigger: 'blur' }],
        typeCount: [
          { required: false, message: '请选择搭配商品', trigger: 'blur' },
          { validator: checkTypeCount, trigger: 'blur' }
        ]
      },
      errCount: '',
      loading: false,
      operations: [
        {
          label: '保存',
          name: 'save',
          type: 'primary',
          auth: ['admin:promotion.edit']
        }
      ],
      promotionId: '',
      form: this.setOriginFormData()
    };
  },
  methods: {
    operate(name) {
      this[name]();
    },
    // dialogPageSizeChange(val) {
    //   this.dialogPagination.pageSize = val;
    //   this.getGiftList();
    // },
    // dialogCurrentPageChange(val) {
    //   this.dialogPagination.currentPage = val;
    //   this.getGiftList();
    // },
    // dialogFilterDataChange(val) {
    //   this.dialogFilters = val;
    //   this.getGiftList();
    // },
    // confirmedProduct(val, items) {
    //   console.log('id: ', val);
    //   console.log('items: ', items);
    //   this.selectedGiftIds = val.concat();
    //   this.selectedGiftList = [];
    //   this.giftList.map(gift => {
    //     if (this.selectedGiftIds.indexOf(gift.id) !== -1) {
    //       this.selectedGiftList.push(gift);
    //     }
    //   });
    // },
    // delGift(id) {
    //   for (let i = 0; i < this.selectedGiftList.length; i++) {
    //     if (this.selectedGiftList[i].id === id) {
    //       this.selectedGiftList.splice(i, 1);
    //     }
    //   }
    //   this.selectedGiftIds = [];
    //   this.selectedGiftList.map(gift => {
    //     this.selectedGiftIds.push(gift.id);
    //   });
    // },
    selectGifts() {
      this.showDialog = !this.showDialog;
      this.getGiftList();
    },
    getGiftList() {
      let params = {
        pageSize: this.dialogPagination.pageSize,
        pageNumber: this.dialogPagination.currentPage,
        searchValue: this.dialogFilters[0].value,
        productType: 'normal'
      };
      service.queryProductList(
        params,
        data => {
          this.giftList = data.content;
          this.dialogPagination.total = Number(data.total);
        },
        ErrorData => {
          console.log('ERR_GET_GIFT_LIST: ', ErrorData);
        }
      );
    },
    setOriginFormData() {
      return {
        amount: '',
        isSuperposition: '0',
        memberRanks: [],
        introduction: ''
      };
    },
    clear() {
      this.form = this.setOriginFormData();
      this.selectedGiftList = [];
      this.showDialog = false;
      this.giftList = [];
      this.dialogPagination = {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        // 总条目数
        total: 0
      };
    },
    refresh(form) {
      this.form = Object.assign(this.setOriginFormData(), form);
      this.selectedGiftList = [];
      if (this.form.products) {
        this.selectedGiftList = this.form.products;
        this.memberRankLists = this.form.memberRanks.map(rank => {
          return rank.id;
        });
      }
    },
    save() {
      if (this.selectedGiftList.length > 5) {
        this.$message.warning('搭配商品不得超过5件');
        return;
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
      this.form.memberRanks = this.memberRankLists.map(rank => {
        return { id: rank };
      });
      let params = Object.assign(this.form, {
        isSuperposition: this.form.isSuperposition,
        promotionId: this.promotionId,
        amount: this.form.amount,
        products: this.selectedGiftList,
        introduction: this.form.introduction,
        publishTarget: this.rankData.publishTarget,
        memberRanks: this.rankData.memberRanks,
        members: this.rankData.members
      });
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
    formatData(val) {
      let tmp = [];
      val.map(value => {
        tmp.push({ id: value.id ? value.id : value });
      });
      return tmp;
    }
  },
  mounted() {
    this.getBaseInfo();
  },
  watch: {},
  components: {
    BizGrid,
    BizSaveButton,
    ParticipationWay
  }
};
</script>

<style lang="scss">
.el-form-item.isRequired .el-form-item__label:before {
  content: '*';
  color: #f56c6c;
  margin-right: 4px;
}
.promotion-content-package {
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
  .biz-list {
    margin-top: 10px;
  }
}
</style>
