<template>
  <biz-grid class="content-bkj">
    <biz-save-button slot="top" :operations="operations" @operate="operate" v-if="isEdit">
    </biz-save-button>
    <el-form :rules="rules" ref="form" :model="content" label-width="100px" size="small" :disabled="!isEdit" v-loading="loading">
      <el-form-item label="会员等级">
        <rank-item :rankData="rankData" ref="rank"></rank-item>
      </el-form-item>
      <el-form-item label="活动商品" prop="product">
        <el-input placeholder="请选择活动商品" @focus="getProductList" v-model="content.product.fullName"></el-input>
      </el-form-item>
      <el-form-item label="商品价格">
        <el-input disabled v-model="content.product.price" label=""></el-input>
      </el-form-item>
      <el-form-item label="商品数量" prop="productCount">
        <el-input-number :min="min" placeholder="请输入商品数量" v-model="content.productCount"></el-input-number>
      </el-form-item>
      <el-form-item label="活动价格" prop="activityPrice">
        <el-input-number :min="min" placeholder="请输入活动价格" v-model="content.activityPrice"></el-input-number>
      </el-form-item>
      <!-- <el-form-item label="活动人数"
                    prop="maxPersonCount">
        <el-input-number placeholder="请输入活动人数"
                         v-model="content.maxPersonCount"></el-input-number>
      </el-form-item> -->
      <el-form-item label="底价" prop="minimumPrice">
        <el-input-number :min="min" v-model="content.minimumPrice"></el-input-number>
      </el-form-item>
      <!-- <el-form-item label="最多允许多少人帮砍"
                    prop="bargainPersonCount">
        <el-input-number placeholder="请输入人数"
                         v-model="content.bargainPersonCount"></el-input-number>
      </el-form-item> -->
      <el-form-item label="砍价最小值" prop="minBargainPrice">
        <el-input-number :min="min" placeholder="请输入每次最少砍" v-model="content.minBargainPrice"></el-input-number>
      </el-form-item>
      <el-form-item label="砍价最大值" prop="maxBargainPrice">
        <el-input-number :min="min" placeholder="请输入每次最多砍" v-model="content.maxBargainPrice"></el-input-number>
      </el-form-item>
      <el-form-item label="活动规则">
        <el-input placeholder="请填写活动规则" type="textarea" :rows="2" v-model="content.desc"></el-input>
      </el-form-item>
    </el-form>
    <biz-dialog-selector class="content-nyqg-dialog" title="选择商品" :visibility.sync="dialogVisible" :tableData="tableData"
      :pagination="pagination" :selectionMode="'single'" :filters="dialogFilters" @pageSizeChange="handleSizeChange"
      @currentPageChange="handleCurrentChange" @confirmed="confirmedProduct" @filterDataChange="productFilterDataChange" :isClear="false">
      <el-table-column prop="name" label="名称">
        <template slot-scope="scope">
          <div class="dialog-column">
            <img :src="scope.row.image || DefaultImg" class="productImg">
            <div style="width:120px;">{{scope.row.fullName}}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column width="150" :formatter="getType" label="商品分类">
      </el-table-column>
      <el-table-column width="150" prop="price" label="价格">
      </el-table-column>
      <el-table-column width="80" prop="stock" label="库存">
      </el-table-column>
      <el-table-column width="80" prop="sales" label="销量">
      </el-table-column>
    </biz-dialog-selector>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import Service from '@/service/activity-mgmt/marketing/activity-content/activityContent';
import BizSaveButton from '@/components/BizSaveButton';
import BizDialogSelector from '@/components/BizDialogSelector';
import RankItem from './RankItem';
import DefaultImg from '@/assets/images/commodity/pic_default_none_100.png';
export default {
  name: 'ContentBKJ',
  data() {
    const activityPriceValid = (rule, rules, callback) => {
      if (this.content.activityPrice > 0) {
        if (!/^[0-9]+([.]{1}[0-9]{1,2})?$/.test(this.content.activityPrice)) {
          callback(new Error('只允许输入到小数后两位'));
        } else {
          callback();
        }
      } else {
        callback(new Error('请输入大于0的数'));
      }
    };
    return {
      min: 1,
      DefaultImg: DefaultImg,
      loading: false,
      dialogVisible: false,
      tableData: [],
      pagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        total: 9
      },
      activity: {},
      rankData: {
        memberRankList: this.memberRankList,
        publishTarget: '',
        memberRanks: [],
        members: []
      },
      content: {
        memberRanks: [],
        type: '',
        id: '',
        product: {
          id: '',
          fullName: '',
          price: ''
        },
        productCount: '',
        activityPrice: '',
        // maxPersonCount: '',
        minimumPrice: '',
        // bargainPersonCount: '',
        minBargainPrice: '',
        maxBargainPrice: '',
        desc: ''
      },
      operations: [
        {
          label: '保存',
          name: 'save',
          type: 'primary',
          auth: ['admin:activity.edit']
        }
      ],
      dialogFilters: [
        {
          type: 'input',
          label: '',
          placeholder: '请输入商品名称',
          name: 'searchValue',
          value: ''
        }
      ],
      rules: {
        product: [{ required: true, message: '请选择商品', trigger: 'blur' }],
        productCount: [{ required: true, message: '请输入商品数量', trigger: 'blur' }],
        activityPrice: [
          { required: true, message: '请输入活动价格', trigger: 'blur' },
          {
            validator: activityPriceValid,
            trigger: 'blur'
          }
        ],
        minimumPrice: [{ required: true, message: '请输入最低可砍到价格', trigger: 'blur' }],
        // maxPersonCount: [
        //   { required: true, message: '请输入活动人数', trigger: 'blur' }
        // ],
        // bargainPersonCount: [
        //   {
        //     required: true,
        //     message: '请输入最多允许多少人帮砍',
        //     trigger: 'blur'
        //   }
        // ],
        minBargainPrice: [{ required: true, message: '请输入每次最少砍', trigger: 'blur' }],
        maxBargainPrice: [{ required: true, message: '请输入每次最多砍', trigger: 'blur' }]
      }
    };
  },
  props: {
    memberRankList: {
      type: Array,
      default() {
        return [];
      }
    },
    isEdit: {
      type: Boolean,
      default() {
        return true;
      }
    }
  },
  created() {},
  components: {
    BizSaveButton,
    BizGrid,
    RankItem,
    BizDialogSelector
  },
  computed: {
    vipRankList() {
      let memberRankList = this.memberRankList;

      for (const memberRank of memberRankList) {
        for (const vip of memberRank.ranks) {
          vip.checked = false;
        }
      }

      for (const memberRank of memberRankList) {
        for (const vip of memberRank.ranks) {
          for (const iterator of this.content.memberRanks) {
            if (iterator.id === vip.id) {
              vip.checked = true;
            }
          }
        }
      }

      return memberRankList;
    }
  },
  methods: {
    operate(name) {
      this[name]();
    },
    vipChange(val) {
      if (val.checked) {
        this.content.memberRanks.forEach((element, index) => {
          if (element.id === val.id) {
            this.content.memberRanks.splice(index, 1);
          }
        });
      } else {
        this.content.memberRanks.push({ id: val.id });
      }
    },
    refresh(activity) {
      this.activity = activity;
      let params = {
        id: this.activity.id
      };
      Service.getActivityContent(
        params,
        data => {
          this.content.id = data.activity.id;
          this.content.type = data.activity.type;
          if (data.activity.product) {
            this.content.product.id = data.activity.product.id;
            this.content.product.fullName = data.activity.product.fullName;
            this.content.product.price = data.activity.product.price;
          } else {
            this.content.product.id = '';
            this.content.product.fullName = '';
            this.content.product.price = '';
          }
          this.content.productCount = data.activity.productCount;
          this.content.activityPrice = data.activity.activityPrice;
          // this.content.maxPersonCount = data.activity.maxPersonCount;
          this.content.minimumPrice = data.activity.minimumPrice;
          // this.content.bargainPersonCount = data.activity.bargainPersonCount;
          this.content.minBargainPrice = data.activity.minBargainPrice;
          this.content.maxBargainPrice = data.activity.maxBargainPrice;
          this.content.memberRanks = data.activity.memberRanks || [];
          this.content.desc = data.activity.desc;
          this.rankData.publishTarget = data.activity.publishTarget;
          this.rankData.memberRanks = data.activity.memberRanks ? data.activity.memberRanks : [];
          this.rankData.members = data.activity.members ? data.activity.members : [];
          if (this.rankData.publishTarget === '0') {
            this.$refs.rank.getVipCount();
          }
          if (this.rankData.memberRanks.length) {
            this.$refs.rank.memberRankHandle();
          }
        },
        ErrorData => {
          console.log(ErrorData);
        }
      );
    },
    save() {
      if (this.content.minBargainPrice > this.content.activityPrice) {
        this.$message.warning('砍价范围小于活动价格');
        return;
      }
      this.$refs.form.validate(valid => {
        if (!valid) {
          return;
        }
        this.loading = true;
        this.$refs.rank.clearData();
        let params = {
          type: this.content.type,
          id: this.content.id,
          product: this.content.product,
          productCount: String(this.content.productCount),
          activityPrice: String(this.content.activityPrice),
          // maxPersonCount: String(this.content.maxPersonCount),
          minimumPrice: String(this.content.minimumPrice),
          // bargainPersonCount: String(this.content.bargainPersonCount),
          minBargainPrice: String(this.content.minBargainPrice),
          maxBargainPrice: String(this.content.maxBargainPrice),
          desc: this.content.desc,
          publishTarget: this.rankData.publishTarget,
          memberRanks: this.rankData.memberRanks,
          members: this.rankData.members
        };
        Service.updateActivityContent(
          params,
          data => {
            this.$message.success('更新成功');
            this.loading = false;
            this.refresh();
            this.$emit('created');
          },
          ErrorData => {
            this.loading = false;
            this.$message.warning(ErrorData.errorMessage);
          }
        );
      });
    },
    handleCurrentChange(value) {
      this.pagination.currentPage = value;
      this.getProductList();
    },
    handleSizeChange(value) {
      this.pagination.pageSize = value;
      this.getProductList();
    },
    getProductList() {
      this.dialogVisible = true;
      let params = {
        shopId: window.top.SHOP_ID || '',
        productType: '0',
        keyword: this.dialogFilters[0].value,
        pageNumber: this.pagination.currentPage,
        pageSize: this.pagination.pageSize
      };
      Service.getProductList(
        params,
        data => {
          this.tableData = data.content;
          this.pagination.total = Number(data.total);
        },
        ErrorData => {
          console.log(ErrorData);
        }
      );
    },
    confirmedProduct(arr) {
      let product = {};
      for (const iterator of this.tableData) {
        if (iterator.id === arr[0]) {
          product = iterator;
          break;
        }
      }
      this.content.product.id = product.id;
      this.content.product.fullName = product.fullName;
      this.content.product.price = product.price;
    },
    productFilterDataChange() {
      this.pagination.currentPage = 1;
      this.getProductList();
    },
    getType(row) {
      switch (row.categoryType) {
        case '0':
          return '整车';
        case '1':
          return '车品';
        case '2':
          return '服务';
        default:
          break;
      }
    }
  }
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
.content-bkj {
  .biz-save-button {
    margin-top: 10px;
    justify-content: flex-start;
  }
  .el-form {
    height: 100%;
    overflow: auto;
    padding-bottom: 20px;
    padding-right: 30px;
    .vip-level {
      .vip-container {
        display: flex;
        flex-wrap: wrap;
        .vip {
          min-width: 110px;
        }
      }
    }
  }
}
</style>
