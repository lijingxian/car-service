<template>
  <biz-grid class="purchase-order-info" v-loading="loading">
    <el-form label-width="110px" size="small" :inline-message="true">
      <el-form-item label="采购退货申请单">
        <span
          v-for="applyList in applyLists"
          :key="applyList.id"
          :label="applyList.sn"
          :value="applyList.id"
          @click="onClickApplyList(applyList)"
          class="tel-style"
        >{{applyList.sn}}</span>
      </el-form-item>
      <el-form-item label="出库单">
        <span
          v-for="depotBillList in depotBillLists"
          :key="depotBillList.id"
          :label="depotBillList.sn"
          :value="depotBillList.id"
          @click="onClickStorageList(depotBillList)"
          class="tel-style"
        >{{depotBillList.sn}}</span>
      </el-form-item>
      <el-form-item label="收款单">
        <span
          v-for="accountBillList in accountBillLists"
          :key="accountBillList.id"
          :label="accountBillList.sn"
          :value="accountBillList.id"
          @click="onClickReceiptList(accountBillList)"
          class="tel-style"
        >{{accountBillList.sn}}</span>
      </el-form-item>
    </el-form>

    <el-dialog :visible.sync="dialogApplyTableVisible" center width="800px" append-to-body custom-class="orderDialog">
      <div class="d-p-wrap">
        <el-row :gutter="10" class="row">
          <div class="p-title">采购退货申请单</div>
        </el-row>
        <el-row :gutter="10" class="row-top">
          <el-col :span="14">
            <div class="grid-content bg-purple">编号：{{form.sn}}</div>
          </el-col>
          <el-col :span="10">
            <div class="grid-content bg-purple">创建时间：{{form.createDate}}</div>
          </el-col>
        </el-row>
        <el-row :gutter="10" class="row">
          <el-col :span="14">
            <div class="grid-content bg-purple">供应商：{{form.relatePartnerName}}</div>
          </el-col>
          <el-col :span="10">
            <div class="grid-content bg-purple">优惠率(%)：{{form.discountRate}}</div>
          </el-col>
        </el-row>
        <el-row :gutter="10" class="row">
          <el-col :span="14">
            <div class="grid-content bg-purple">优惠金额(元)：{{form.discontFee}}</div>
          </el-col>
          <el-col :span="10">
            <div class="grid-content bg-purple">总金额(元)：{{form.totalFee}}</div>
          </el-col>
        </el-row>
        <el-row :gutter="10" class="row">
          <el-col :span="14">
            <div class="grid-content bg-purple">申请人：{{form.applierName}}</div>
          </el-col>
          <el-col :span="10">
            <div class="grid-content bg-purple">状态：{{form.state}}</div>
          </el-col>
        </el-row>
        <el-row :gutter="10" class="row">
          <el-col :span="14">
            <div class="grid-content bg-purple">备注：{{form.remark}}</div>
          </el-col>
        </el-row>
        <el-table :data="gridApplyData" class="table-class">
          <el-table-column property="productName" label="商品">
            <template slot-scope="scope">{{scope.row.productName}}</template>
          </el-table-column>
          <el-table-column property="price" label="采购单价(元)">
            <template slot-scope="scope">￥{{scope.row.price}}</template>
          </el-table-column>
          <el-table-column property="amount" label="退货数量"></el-table-column>
          <el-table-column property="totalFee" label="金额(元)">
            <template slot-scope="scope">￥{{scope.row.totalFee}}</template>
          </el-table-column>
          <el-table-column property="depotName" label="仓库"></el-table-column>
        </el-table>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogStorageTableVisible" center width="800px" append-to-body custom-class="orderDialog">
      <div class="d-p-wrap">
        <el-row :gutter="10" class="row">
          <div class="p-title">出库单</div>
        </el-row>
        <el-row :gutter="10" class="row-top">
          <el-col :span="14">
            <div class="grid-content bg-purple">编号：{{formDepotOut.sn}}</div>
          </el-col>
          <el-col :span="10">
            <div class="grid-content bg-purple">创建时间：{{formDepotOut.createDate}}</div>
          </el-col>
        </el-row>
        <el-row :gutter="10" class="row">
          <el-col :span="14">
            <div class="grid-content bg-purple">供应商：{{formDepotOut.relatePartnerName}}</div>
          </el-col>
          <el-col :span="10">
            <div class="grid-content bg-purple">创建人：{{formDepotOut.creatorName}}</div>
          </el-col>
        </el-row>
        <el-row :gutter="10" class="row">
          <el-col :span="14">
            <div class="grid-content bg-purple">状态：{{formDepotOut.state}}</div>
          </el-col>
          <el-col :span="10">
            <div class="grid-content bg-purple">备注：{{formDepotOut.remark}}</div>
          </el-col>
        </el-row>
        <el-table :data="gridStorageData" class="table-class">
          <el-table-column property="productName" label="商品" min-width="200"></el-table-column>
          <el-table-column property="amount" label="出库数量"></el-table-column>
          <el-table-column property="depotName" label="仓库"></el-table-column>
        </el-table>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogReceiptTableVisible" center width="800px" append-to-body custom-class="orderDialog">
      <div class="d-p-wrap">
        <el-row :gutter="10" class="row">
          <div class="p-title">收款单</div>
        </el-row>
        <el-row :gutter="10" class="row-top">
          <el-col :span="14">
            <div class="grid-content bg-purple">编号：{{formReceipt.sn}}</div>
          </el-col>
          <el-col :span="10">
            <div class="grid-content bg-purple">创建时间：{{formReceipt.createDate}}</div>
          </el-col>
        </el-row>
        <el-row :gutter="10" class="row">
          <el-col :span="14">
            <div class="grid-content bg-purple">往来方：{{formReceipt.relateUnit}}</div>
          </el-col>
          <el-col :span="10">
            <div class="grid-content bg-purple">结算账户：{{formReceipt.account}}</div>
          </el-col>
        </el-row>
        <el-row :gutter="10" class="row">
          <el-col :span="14">
            <div class="grid-content bg-purple">付款金额(元)：{{formReceipt.amount}}</div>
          </el-col>
          <el-col :span="10">
            <div class="grid-content bg-purple">付款人：{{formReceipt.creator}}</div>
          </el-col>
        </el-row>
        <el-row :gutter="10" class="row">
          <el-col :span="14">
            <div class="grid-content bg-purple">状态：{{formReceipt.state}}</div>
          </el-col>
          <el-col :span="10">
            <div class="grid-content bg-purple">备注：{{formReceipt.remarks}}</div>
          </el-col>
        </el-row>
      </div>
    </el-dialog>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import http from '@/common/http';
import urls from '@/common/urls';
export default {
  name: 'OrderInfo',
  props: {
    itemId: {
      type: String
    },
    isEdit: {
      type: Boolean,
      default() {
        return true;
      }
    }
  },
  components: {
    BizGrid
  },
  data() {
    return {
      loading: false,
      dialogVisible: false,
      applyLists: [],
      depotBillLists: [],
      accountBillLists: [],
      // 用户信息
      form: {},
      formDepotOut: {},
      formReceipt: {},
      gridApplyData: [],
      gridStorageData: [],
      dialogApplyTableVisible: false,
      dialogStorageTableVisible: false,
      dialogReceiptTableVisible: false
    };
  },
  created() {},
  watch: {
    itemId(val) {
      this.applyLists = [];
      this.depotBillLists = [];
      this.accountBillLists = [];
      this.itemId && this.getList();
    }
  },
  mounted() {},
  methods: {
    getList() {
      http
        .get(urls.invoicing.purchaseReturnOrderMgmt.relateBill, {
          id: this.itemId || '',
          shopId: window.top.SHOP_ID || ''
        })
        .then(data => {
          this.applyLists = data.applyList;
          this.depotBillLists = data.depotBillList;
          this.accountBillLists = data.accountBillList;
        })
        .catch(errData => {
          console.log(errData);
          console.log('code错误');
        });
    },
    queryApplyList(id) {
      // 调用申请单接口
      let params = {
        id: id
      };
      http
        .get(urls.invoicing.purchaseReturnApplyMgmt.print, params)
        .then(data => {
          this.dialogApplyTableVisible = true;
          this.title = '采购退货申请单';
          this.form = data.data;
          if (this.form.state === '0') {
            this.form.state = '已创建';
          } else if (this.form.state === '1') {
            this.form.state = '已提交';
          } else if (this.form.state === '2') {
            this.form.state = '审核中';
          } else if (this.form.state === '3') {
            this.form.state = '已通过';
          } else if (this.form.state === '4') {
            this.form.state = '已驳回';
          } else {
          }
          this.gridApplyData = data.data.itemDatas;
          this.loading = false;
        })
        .catch(ErrorData => {
          this.$message.warning(ErrorData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    queryStorageList(id) {
      // 调用出库单接口
      let params = {
        id: id
      };
      http
        .get(urls.invoicing.depotOutMgmt.print, params)
        .then(data => {
          this.dialogStorageTableVisible = true;
          this.title = '出库单';
          this.formDepotOut = data.data;
          if (this.formDepotOut.state === '0') {
            this.formDepotOut.state = '已创建';
          } else if (this.formDepotOut.state === '1') {
            this.formDepotOut.state = '已提交';
          } else {
          }
          this.gridStorageData = data.data.itemDatas;
          this.loading = false;
        })
        .catch(ErrorData => {
          this.$message.warning(ErrorData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    queryReceiptList(id) {
      // 调用收款单接口
      let params = {
        id: id
      };
      http
        .get(urls.finance.receiptMgmt.receipt, params)
        .then(data => {
          this.dialogReceiptTableVisible = true;
          this.title = '收款单';
          if (id === data.data.id) {
            this.formReceipt.sn = data.data.sn;
            this.formReceipt.createDate = data.data.createDate;
            this.formReceipt.relateUnit = data.data.relateUnit.name;
            this.formReceipt.account = data.data.account.name;
            this.formReceipt.amount = data.data.amount;
            this.formReceipt.state = data.data.state;
            this.formReceipt.creator = data.data.creator;
            if (this.formReceipt.state === '0') {
              this.formReceipt.state = '已创建';
            } else if (this.formReceipt.state === '1') {
              this.formReceipt.state = '已提交';
            } else {
            }
            this.formReceipt.remarks = data.data.remarks;
          }
          this.loading = false;
        })
        .catch(ErrorData => {
          this.$message.warning(ErrorData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    onClickApplyList(val) {
      this.form = {};
      this.gridApplyData = [];
      this.queryApplyList(val.id);
    },
    onClickStorageList(val) {
      this.formDepotOut = {};
      this.gridStorageData = [];
      this.queryStorageList(val.id);
    },
    onClickReceiptList(val) {
      this.formReceipt = {};
      this.queryReceiptList(val.id);
    }
  }
};
</script>

<style lang="scss">
.purchase-order-info {
  .tel-style {
    color: #ff7300;
    cursor: pointer;
    display: flex;
  }
}
</style>
