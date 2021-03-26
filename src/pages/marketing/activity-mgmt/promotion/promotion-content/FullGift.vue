<template>
  <div class="promotion-content-full-gift">
    <biz-grid>
      <biz-save-button slot="bottom" :operations="operations" @operate="operate" v-if="isEdit">
      </biz-save-button>
      <el-form :rules="rules" ref="form" :model="form" label-width="120px" size="small" v-loading="loading" :disabled="!isEdit">
        <el-form-item label="是否叠加">
          <el-radio v-model="form.isSuperposition" label="0">互斥</el-radio>
          <el-radio v-model="form.isSuperposition" label="1">叠加</el-radio>
        </el-form-item>
        <el-form-item label="满减条件" prop="count" :error="errCount">
          <el-radio v-model="condition" label="0">满(元)</el-radio>
          <el-radio v-model="condition" label="1">满(件)</el-radio>
          <el-input v-model="form.count">
            <template slot="append">{{this.condition === '0' ? '元' : '件'}}</template>
          </el-input>
        </el-form-item>
        <el-form-item label="赠品" prop="giftProducts" class="isRequired">
          <el-button type="primary" @click="selectGifts">选择赠品</el-button>
          <el-table ref="brandTable" size="small" :data="selectedGiftList" stripe border highlight-current-row
            tooltip-effect="dark" style="width: 100%;">
            <el-table-column prop="name" label="商品名"></el-table-column>
            <el-table-column prop="option" label="操作" width="70">
              <template slot-scope="scope">
                <el-button size="mini" type="text" style="color: red" @click.stop="delGift(scope.row.id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item label="满送范围" prop="participationWay">
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
      <biz-dialog-selector title="选择赠品" :visibility.sync="showDialog" :tableData="giftList" :pagination="dialogPagination"
        :filters="dialogFilters" :selectionKeys="selectedGiftIds" @pageSizeChange="dialogPageSizeChange"
        @currentPageChange="dialogCurrentPageChange" @confirmed="confirmedProduct" @filterDataChange="dialogFilterDataChange">
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
        <el-table-column property="categoryName" label="分类"></el-table-column>
      </biz-dialog-selector>
    </biz-grid>
  </div>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import BizSaveButton from '@/components/BizSaveButton';
import BizDialogSelector from '@/components/BizDialogSelector';
import ParticipationWay from '../components/ParticipationWay.vue';
import service from '@/service/activity-mgmt/promotion-mgmt/PromotionContent';
import DefaultImg from '@/assets/images/commodity/pic_default_none_100.png';
export default {
  name: 'PromotionContentFullCut',
  props: {
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
      // 已选中商品列表
      selectedItems: [],
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
      // 选中赠品Id列表
      selectedGiftIds: [],
      rules: {
        count: [
          { required: true, message: '请输入优惠条件', trigger: 'blur' },
          {
            pattern: /^[0-9]+\.?[0-9]*$/,
            message: '请输入非负数字',
            trigger: 'blur'
          }
        ],
        typeCount: [{ required: true, message: '请输入优惠类型', trigger: 'blur' }],
        participationWay: [{ required: true, message: '请选择允许参与商品', trigger: 'blur' }]
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
      condition: '0',
      promotionId: '',
      form: this.setOriginFormData()
    };
  },
  methods: {
    operate(name) {
      this[name]();
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
      this.getGiftList();
    },
    confirmedProduct(val) {
      this.selectedGiftIds = val.concat();
      this.selectedGiftList = [];
      this.giftList.map(gift => {
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
        searchValue: this.dialogFilters[0].value || '',
        productType: 'normal'
      };
      service.queryGiftList(
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
        typeCount: '',
        count: '',
        introduction: '',
        isSuperposition: '0',
        memberRanks: [],
        participationWay: ''
      };
    },
    clear() {
      this.form = this.setOriginFormData();
      this.condition = '0';
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
      console.log('eidtForm' + form);
      this.form = Object.assign(this.setOriginFormData(), form);
      this.condition = this.form.minimumPrice === '' ? '1' : '0';
      this.form.count = this.form.minimumPrice === '' ? this.form.minimumQuantity : this.form.minimumPrice;
      this.$nextTick(() => {
        this.setSelectedItems(this.form);
      });
      this.selectedGiftList = [];
      if (this.form.giftProducts) {
        this.selectedGiftList = this.form.giftProducts ? this.form.giftProducts : [];
        this.selectedGiftIds = [];
        this.selectedGiftList.map(gift => {
          this.selectedGiftIds.push(gift.id);
        });
        this.memberRankLists = this.form.memberRanks.map(rank => {
          return rank.id;
        });
      }
      // 根据参与方式确定selecetdItems的内容
      this.$nextTick(() => {
        this.setSelectedItems(this.form);
      });
    },
    save() {
      if (this.selectedGiftList.length > 5) {
        this.$message.warning('赠品数不超过5个');

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
      // 满(件)
      if (this.condition === '1') {
        let reg = new RegExp(/\.0*[1-9]/);
        if (reg.test(this.form.count)) {
          this.errCount = '请输入整数';
          return;
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
          minimumPrice: this.condition === '0' ? this.form.count : '',
          minimumQuantity: this.condition === '1' ? this.form.count : '',
          giftProducts: this.selectedGiftList,
          introduction: this.form.introduction,
          publishTarget: this.rankData.publishTarget,
          memberRanks: this.rankData.memberRanks,
          members: this.rankData.members
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
          this.selectedItems = value.products;
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
      console.log('selectedItems: ', this.selectedItems);
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
    BizDialogSelector,
    ParticipationWay
  }
};
</script>

<style lang="scss">
.promotion-content-full-gift {
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
  .el-form-item__content {
    .el-radio + .el-radio {
      // margin-left: 10px;
    }
  }
  .el-form-item.isRequired .el-form-item__label:before {
    content: '*';
    color: #f56c6c;
    margin-right: 4px;
  }
}
</style>
