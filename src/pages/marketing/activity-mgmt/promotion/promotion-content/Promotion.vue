<template>
  <biz-grid class="promotion-promotion">
    <biz-save-button slot="bottom" :operations="operations" @operate="operate" v-if="isEdit">
    </biz-save-button>
    <el-form :rules="rules" ref="form" :model="form" label-width="120px" size="small" v-loading="loading" :disabled="!isEdit">
      <el-form-item label="是否叠加">
        <el-radio v-model="form.isSuperposition" label="0">互斥</el-radio>
        <el-radio v-model="form.isSuperposition" label="1">叠加</el-radio>
      </el-form-item>
      <el-form-item label="促销商品" prop="typeCount" class="isRequired">
        <el-button type="primary" @click="selectGifts">添加商品</el-button>
        <el-table ref="brandTable" size="small" :data="selectedGiftList" stripe border highlight-current-row tooltip-effect="dark"
          style="width: 100%;" @cell-click="cellClick">
          <el-table-column prop="name" label="商品名"></el-table-column>
          <!-- <el-table-column prop="marketPrice" label="指导价" width="60"></el-table-column> -->
          <el-table-column prop="promotionPrice" label="促销价" min-width="60">
            <template slot-scope="scope">
              <!-- <span v-show="!scope.row.editFlag">{{scope.row.promotionPrice}}</span>
              <el-input :ref="`input${scope.row.id}`" v-model="scope.row.promotionPrice" v-show="scope.row.editFlag"></el-input> -->
              <el-input :ref="`input${scope.row.id}`" v-model="scope.row.promotionPrice"></el-input>
            </template>
          </el-table-column>
          <!-- <el-table-column prop="stock" label="库存" width="60"></el-table-column> -->
          <el-table-column prop="option" label="操作" width="70">
            <template slot-scope="scope">
              <el-button size="mini" type="text" style="color: red" @click.stop="delGift(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <!-- <el-form-item label="使用规则" prop="introduction">
        <el-input type="textarea" :rows="2" placeholder="请输入使用规则" v-model="form.introduction"></el-input>
      </el-form-item> -->
    </el-form>
    <biz-dialog-selector title="选择商品" :visibility.sync="showDialog" :tableData="giftList" :pagination="dialogPagination"
      :filters="dialogFilters" :selectionKeys="selectedGiftIds" @pageSizeChange="dialogPageSizeChange"
      @currentPageChange="dialogCurrentPageChange" @confirmed="confirmedProduct" @filterDataChange="dialogFilterDataChange" @selectionChange="selectionChange">
      <el-table-column property="name" label="商品信息" width="300px">
        <template slot-scope="scope">
          <div class="dialog-column">
            <img :src="scope.row.image || DefaultImg" class="productImg">
            <div style="width:100%">
              <div>编号：{{scope.row.sn}}</div>
              <div>{{scope.row.fullName}}</div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column property="price" label="销售价"></el-table-column>
      <el-table-column property="stock" label="库存"></el-table-column>
      <el-table-column property="categoryName" label="分类"></el-table-column>
    </biz-dialog-selector>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import BizSaveButton from '@/components/BizSaveButton';
import BizDialogSelector from '@/components/BizDialogSelector';
import service from '@/service/activity-mgmt/promotion-mgmt/PromotionContent';
import DefaultImg from '@/assets/images/commodity/pic_default_none_100.png';
export default {
  name: 'ProPromotion',
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
      DefaultImg: DefaultImg,
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
      selectionList: [],
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
      // 选中赠品Id列表
      selectedGiftIds: [],
      loading: false,
      rules: {
        introduction: [{ max: 500, message: '不超过500字', trigger: 'blur' }]
      },
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
  components: {
    BizGrid,
    BizSaveButton,
    BizDialogSelector
  },
  methods: {
    operate(name) {
      this[name]();
    },
    setOriginFormData() {
      return {
        isSuperposition: '0',
        memberRanks: [],
        introduction: ''
      };
    },
    dialogPageSizeChange(val) {
      this.dialogPagination.pageSize = val;
      this.getGiftList();
    },
    dialogCurrentPageChange(val) {
      this.dialogPagination.currentPage = val;
      this.getGiftList();
    },
    dialogFilterDataChange(val) {
      this.dialogFilters = val;
      this.dialogPagination.currentPage = 1;
      this.getGiftList();
    },
    selectionChange(selections) {
      this.selectionList = [];
      selections.forEach(item => {
        if (this.selectionList.indexOf(item) === -1) {
          this.selectionList.push(item);
        }
      });
    },
    confirmedProduct(innerSelectionKeys, innerSelectionRowKeys) {
      // if (innerSelectionKeys.length > 5) {
      //   this.$message({
      //     message: '最多选中5项',
      //     type: 'info',
      //     duration: 1000,
      //     showClose: true
      //   });
      //   return false;
      // }
      this.selectedGiftIds = innerSelectionKeys.concat();
      this.selectedGiftList = [];
      this.selectionList.map(gift => {
        if (this.selectedGiftIds.indexOf(gift.id) !== -1) {
          this.selectedGiftList.push(gift);
        }
      });
    },
    delGift(id) {
      for (let i = 0; i < this.selectedGiftList.length; i++) {
        if (this.selectedGiftList[i].id === id) {
          this.selectedGiftList.splice(i, 1);
        }
      }
      this.selectedGiftIds = [];
      this.selectedGiftList.map(gift => {
        this.selectedGiftIds.push(gift.id);
      });
    },
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
          this.giftList.map(gift => {
            this.$set(gift, 'editFlag', false);
            if (!gift.promotionPrice) {
              this.$set(gift, 'promotionPrice', gift.price);
            }
          });
          this.dialogPagination.total = Number(data.total);
        },
        ErrorData => {
          console.log('ERR_GET_GIFT_LIST: ', ErrorData);
        }
      );
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
      this.selectedGiftIds = [];
    },
    refresh(form) {
      this.form = Object.assign(this.setOriginFormData(), form);
      this.selectedGiftList = [];
      if (this.form.products) {
        this.selectedGiftList = this.form.products;
        this.selectedGiftList.map(gift => {
          this.$set(gift, 'editFlag', false);
          if (!gift.promotionPrice) {
            this.$set(gift, 'promotionPrice', gift.price);
          }
        });
        this.selectedGiftIds = [];
        this.selectedGiftList.map(gift => {
          this.selectedGiftIds.push(gift.id);
        });
      }
    },
    save() {
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
        promotionId: this.promotionId,
        products: this.selectedGiftList,
        publishTarget: this.rankData.publishTarget,
        memberRanks: this.rankData.memberRanks,
        members: this.rankData.members
      });
      this.$emit('updated', params);
    },
    cellClick(row, column, cell, event) {
      if (column.label !== '促销价') {
        this.selectedGiftList.map(gift => {
          gift.editFlag = false;
        });
      }
      if (column.label === '促销价') {
        this.selectedGiftList.map(gift => {
          if (gift.id !== row.id) {
            gift.editFlag = false;
          } else {
            gift.editFlag = true;
          }
        });
      }
    },
    formatData(val) {
      let tmp = [];
      val.map(value => {
        tmp.push({ id: value.id ? value.id : value, promotionPrice: value.promotionPrice });
      });
      return tmp;
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
    }
  },
  mounted() {
    this.getBaseInfo();
  },
  watch: {}
};
</script>

<style lang="scss">
.dialog-column {
  display: flex;
  align-items: center;
}
.productImg {
  display: block;
  width: 50px;
  height: 50px;
  margin-right: 5px;
}
.promotion-promotion {
  .checkbox-group {
    font-size: 14px;
  }
  .el-form-item.isRequired .el-form-item__label:before {
    content: '*';
    color: #f56c6c;
    margin-right: 4px;
  }
  .el-checkbox-group .el-checkbox {
    width: 160px;
    margin: 0;
    .el-checkbox__label {
      width: 140px;
      white-space: normal;
    }
  }
  .cell {
    .el-input.el-input--small {
      .el-input__inner {
        padding: 0 5px;
      }
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
  // .el-textarea__inner {
  //   height: 32px;
  //   min-height: 32px;
  // }
}
</style>
