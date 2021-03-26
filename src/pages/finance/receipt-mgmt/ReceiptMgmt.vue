<template>
  <div class="receipt-mgmt">
    <el-tabs v-model="tabNameHeader" style="padding-left:20px" @tab-click="tabClick">
      <el-tab-pane label="待收款"
                   name="receipt-info">
      </el-tab-pane>
      <el-tab-pane label="已收款"
                   name="received-info">
      </el-tab-pane>
    </el-tabs>
    <biz-flex-table
      :operations="operations"
      :loading="loading"
      :tableData="tableData"
      :pagination="pagination"
      :filters="filters"
      @filter-data-change="filterDataChange"
      @operate="operate"
      @selection-change="handleSelectionChange"
      @row-click="rowClick"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    >
      <el-table-column label="订单信息" min-width="160">
        <template slot-scope="scope">
          <div style="width:100%">
            <div class="overflow">
              {{scope.row.sn}}
            </div>
            <div class="overflow">
              创建日期：{{scope.row.orderTime}}
            </div>
            <div class="overflow">
              状态：<span :style="{color: stateColor(scope.row)}">{{scope.row.stateName?scope.row.stateName:formatStatus(scope.row)}}</span>
            </div>
            <div class="overflow">
              所属店铺：{{scope.row.shop?scope.row.shop.name:''}}
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="客户" min-width="120">
        <template slot-scope="scope">
          <div style="width:100%" class="customer-info-receipt">
            <div class="overflow">
              <div class="wrapper" style="display:flex">
                <span v-if="scope.row.dType==='order'" style="line-height: 20px;height: 20px;font-size:10px;border-radius: 4px;border: 1px solid rgba(187, 187, 187, 100);">会员</span>
                <span v-if="scope.row.dType==='purchaseOrder'" style="line-height: 20px;height: 20px;font-size:10px;border-radius: 4px;border: 1px solid rgba(187, 187, 187, 100);">代理商</span>
                <div v-if="scope.row.dType==='order'" class="titleMember" style="padding-left:5px" :title="scope.row.member.name">{{scope.row.member.name}}</div>
                <div v-if="scope.row.dType==='purchaseOrder'" class="titleMember" style="padding-left:5px" :title="scope.row.member.name">{{scope.row.agent.name}}</div>
              </div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="订单金额" min-width="140">
        <template slot-scope="scope">
          <div>
            <div>
              ￥{{scope.row.amount}}
            </div>
            <div>
              已收款：￥{{scope.row.amountPaid}}
              <el-button type="text" size="small" @click="detail($event, scope.row)" v-if="scope.row.amountPaid&&Number(scope.row.amountPaid)>0">详情</el-button>
            </div>
            <div>
              待收款：￥{{(Number(scope.row.amount)-Number(scope.row.amountPaid)).toFixed(2)}}
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="商品信息" min-width="160">
        <template slot-scope="scope">
          <div style="display:flex;justify-content:space-between;width:100%">
            <div style="width:100%">
              <div v-for="orderItem in (scope.row.orderItems.length>0?[scope.row.orderItems[0]]:[])" :key="orderItem.sn"
                class="product-info-content">
                  <!-- <img v-if="orderItem.thumbnail&&orderItem.thumbnail!==' '" :src="orderItem.thumbnail" :onerror="errorImg" />
                  <img v-else src="/resources/admin/images/default/product-default-100.png" /> -->
                  <div class="wrapper" style="width:200px;padding: 0px;">
                    <div class="titleClass" :title="orderItem.name">{{orderItem.name}}</div>
                    <div class="overflow">{{orderItem.product?orderItem.product.barCode:''}}</div>
                    <div class="overflow">单价：{{orderItem.price}}</div>
                  </div>
                  <div class="amount">{{orderItem.quantity}}{{scope.row.orderItems.length>1?'...':''}}</div>
              </div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="mini" v-if="tabNameHeader === 'receipt-info'" @click.stop="handleReceiptClick(scope.row)">收款</el-button>
        </template>
      </el-table-column>
    </biz-flex-table>
    <!-- 侧边弹出栏 -->
    <biz-popup-tabs :open="open" @close="open=false" v-model="tabName">
      <el-tab-pane label="基础画像" name="info">
        <base-info :itemId="itemId" :form="form" ref="baseInfo" :open="open"
          @operationSuccess="operationSuccess"></base-info>
      </el-tab-pane>
      <el-tab-pane label="发票画像" name="invoice" v-if="dType==='purchaseOrder'&&orderState!=='6'">
        <invoice-info-invoicing :itemId="itemId" :invoiceInfoId="invoiceInfoId" :invoiceId="invoiceId" :price="price" :open="open"
          :userId="userId" :isEdit="isEdit" :orderIds="orderIds" ref="invoice" @operationSuccess="operationSuccess" :category="'1'" :buyerType="'2'" :buyer="buyer" :sellerType="'5'" :seller="getUser.shop.id"></invoice-info-invoicing>
      </el-tab-pane>
      <el-tab-pane label="发票画像" name="invoice" v-if="dType==='order'&&showInvoice&&orderState!=='6'">
        <invoice-info :itemId="itemId" :invoiceInfoId="invoiceInfoId" :invoiceId="invoiceId" :price="price" :open="open"
          :userId="userId" :isEdit="isEdit" ref="invoice" @operationSuccess="operationSuccess"></invoice-info>
      </el-tab-pane>
    </biz-popup-tabs>
    <el-dialog :visible.sync="detailDialogShow" title="收款记录详情" :append-to-body="true" width="550px">
      <el-table :data="detaliData" size="small" stripe border highlight-current-row tooltip-effect="dark">
        <el-table-column prop="paymentDate" label="时间"></el-table-column>
        <el-table-column prop="amount" label="金额"></el-table-column>
        <el-table-column prop="paymentMethod" label="付款方式"></el-table-column>
        <el-table-column prop="payer" label="操作人"></el-table-column>
        <el-table-column prop="memo" label="备注"></el-table-column>
      </el-table>
    </el-dialog>
    <el-dialog :visible.sync="receiptDialogShow" title="收款" :append-to-body="true" width="550px">
      <el-form ref="form" :model="formModel" label-width="120px" size="small" :inline-message="true">
        <el-form-item label="订单编号：">
          <span class="form-static">{{formModel.sn}}</span>
        </el-form-item>
        <el-form-item label="订单金额：">
          <span class="form-static">￥{{formModel.amount}}</span>
        </el-form-item>
        <el-form-item label="已收款金额：">
          <span class="form-static">￥{{formModel.amountPaid}}</span>
        </el-form-item>
        <el-form-item label="待收款金额：">
          <span class="form-static">￥{{(Number(formModel.amount)-Number(formModel.amountPaid)).toFixed(2)}}</span>
        </el-form-item>
        <el-form-item label="本次收款金额">
          <el-input v-model="formModel.payableAmount" style="width:220px"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="formModel.memo" style="width:220px"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="close-button">
        <el-button @click="receiptDialogShow=false" size="mini">取消</el-button>
        <el-button @click="handleCommitClick" size="mini" type="primary">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { BizFlexTable } from '@/components/BizTable';
import { BizPopupTabs } from '@/components/BizPopup';
import service from '@/service/order-mgmt/orderMgmt';
import BaseInfo from './BaseInfo';
import InvoiceInfo from './InvoiceInfo';
import InvoiceInfoInvoicing from './InvoiceInfoInvoicing';
import urls from '@/common/urls';
import { mapGetters } from 'vuex';
import http from '@/common/http';
export default {
  name: 'ReceiptMgmt',
  data() {
    return {
      tableId: '18',
      tabNameHeader: 'receipt-info',
      sn: '',
      // 导出
      exportFile: false,
      itemId: '',
      dType: '',
      orderType: '',
      orderIds: [],
      openInvocie: false,
      orderState: '',
      buyer: '',
      operations: [
        { label: '刷新', name: 'refresh', type: '' }
      ],
      filters: [
        {
          type: 'input',
          value: '',
          placeholder: '请输入订单编号'
        }
      ],
      loading: false,
      tableData: [],
      editable: false,
      multiSelected: [],
      pagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        // 总条目数
        total: 0
      },
      // 侧栏
      open: false,
      tabName: 'info',
      isEdit: true,
      paymentMethodId: '',
      detaliData: [],
      detailDialogShow: false,
      receiptDialogShow: false,
      form: {},
      payableAmount: '',
      memo: '',
      formModel: {},
      invoiceInfoId: '',
      invoiceId: '',
      userId: '',
      price: ''
    };
  },
  components: {
    BizFlexTable,
    BizPopupTabs,
    BaseInfo,
    InvoiceInfo,
    InvoiceInfoInvoicing
  },
  created() {
    this.refresh();
  },
  methods: {
    tabClick(val) {
      this.pagination = {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        // 总条目数
        total: 0
      };
      this.refresh();
    },
    operate(name) {
      this[name]();
    },
    operationSuccess(val) {
      this.open = false;
      this.itemId = val;
      this.refresh();
    },
    filterDataChange(value) {
      this.pagination.currentPage = 1;
      this.refresh();
    },
    handleSelectionChange(selectedItems) {
      this.multiSelected = selectedItems.map(row => {
        return row.id;
      });
    },
    rowClick(row) {
      this.tabName = 'info';
      this.dType = row.dType;
      window.dType = row.dType;
      this.buyer = row.agent ? row.agent.id : '';
      this.orderIds = [row.id];
      this.orderType = row.orderType;
      this.orderState = row.type;
      this.userId = row.member.id;
      this.invoiceInfoId = row.invoiceInfoId;
      this.invoiceId = row.invoiceId;
      this.price = row.amount;
      // this.form = row;
      this.itemId = row.id;
      this.open = true;
    },
    handleSizeChange(pageSize) {
      this.pagination.pageSize = pageSize;
      this.refresh();
    },
    handleCurrentChange(pageNumber) {
      this.pagination.currentPage = pageNumber;
      this.refresh();
    },
    refresh() {
      this.tableData = [];
      if (this.tabNameHeader === 'receipt-info') {
        this.getList();
      } else {
        this.getReceivedList();
      }
    },
    getList() {
      this.loading = true;
      let params = {
        pageNumber: this.pagination.currentPage,
        pageSize: this.pagination.pageSize,
        shopId: window.top.SHOP_ID || '',
        type: '1',
        searchValue: this.filters[0].value
      };
      http
        .get('/admin/invoicing/finance/accountIn/orders.jhtml', params)
        .then(data => {
          this.loading = false;
          this.pagination.total = Number(data.total);
          this.tableData = data.content;
        })
        .catch(ErrorData => {
          this.loading = false;
          console.log('ERR_REFRESH: ', ErrorData);
          this.$message.warning(ErrorData.errorMessage);
        });
    },
    getReceivedList() {
      this.loading = true;
      let params = {
        pageNumber: this.pagination.currentPage,
        pageSize: this.pagination.pageSize,
        shopId: window.top.SHOP_ID || '',
        type: '2',
        searchValue: this.filters[0].value
      };
      http
        .get('/admin/invoicing/finance/accountIn/orders.jhtml', params)
        .then(data => {
          this.loading = false;
          this.pagination.total = Number(data.total);
          this.tableData = data.content;
        })
        .catch(ErrorData => {
          this.loading = false;
          console.log('ERR_REFRESH: ', ErrorData);
          this.$message.warning(ErrorData.errorMessage);
        });
    },
    init(id, dType) {
      this.detaliData = [];
      window.dType = dType;
      service.viewOrder(
        { orderId: id },
        data => {
          this.detaliData = data.order.payments;
        },
        // result_code 不是100的处理
        ErrorData => {
          this.$message.warning(ErrorData.errorMessage);
        }
      );
    },
    detail(e, row) {
      e.stopPropagation();
      this.init(row.id, row.dType);
      this.detailDialogShow = true;
    },
    handleReceiptClick(row) {
      this.formModel = row;
      this.payableAmount = (Number(row.amount) - Number(row.amountPaid)).toFixed(2);
      this.$set(this.formModel, 'payableAmount', this.payableAmount);
      this.receiptDialogShow = true;
    },
    // 确定收款
    handleCommitClick() {
      if (this.formModel.dType === 'purchaseOrder') {
        let params = {
          amount: this.formModel.payableAmount,
          memo: this.formModel.memo,
          orderId: this.formModel.id,
          methodName: 'BalancePayment',
          clientType: '2',
          shopId: this.getUser.shop.id,
          userId: this.getUser.id
        };
        http
          .post(urls.hypermarketMgmt.internalTransferPayment, params)
          .then(data => {
            this.$message.success('支付成功');
            this.receiptDialogShow = false;
            this.loading = false;
            this.getList();
          })
          .catch(errData => {
            console.log(errData);
            this.loading = false;
            this.$message.warning(errData.errorMessage);
          });
      } else {
        service.paymentOrder(
          this.formModel,
          data => {
            this.loading = false;
            this.$message.success('保存成功');
            this.$emit('operationSuccess');
          },
          ErrorData => {
            this.loading = false;
            this.$message.warning(ErrorData.errorMessage);
          }
        );
      }
    },
    stateColor(row) {
      if (row.type === '5' || row.type === '7') {
        return '#11AE17';
      } else {
        return '#FF7300';
      }
    },
    // 状态
    formatStatus(row) {
      switch (row.type) {
        case '11':
          return '卖家已发货';
        case '10':
          return '售后完成';
        case '9':
          return '售后中';
        case '8':
          return '已过期';
        case '7':
          return '已评价';
        case '6':
          return '订单关闭';
        case '5':
          return '交易完成';
        case '4':
          return '订单已执行';
        case '3':
          return '买家已付款';
        case '2':
          return '商家已确认';
        case '1':
          return '待商家确认';
        default:
          return '无';
      }
    }
  },
  mounted() {},
  computed: {
    ...mapGetters(['getUser']),
    showInvoice() {
      let orderTypeList = ['5', '0', '9', '10', '3', '17'];
      return orderTypeList.indexOf(this.orderType) !== -1;
    }
  },
  watch: {}
};
</script>

<style lang="scss">
.grid18 {
  height: 20px;
}
.receipt-mgmt {
  .biz-grid {
    padding-top: 45px !important;
  }
  .custom-header {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    i {
      font-size: 18px;
    }
  }
  // .biz-input {
  //   position: absolute;
  //   top: 15px;
  //   right: 85px;
  // }
  .toggle-btn {
    position: absolute;
    top: 20px;
    right: 40px;
    cursor: pointer;
    font-size: 12px;
    display: flex;
    z-index: 1;
    .rotate-180 {
      transform: rotate(180deg);
    }
  }
  .biz-table-filter .filter-wrap {
    margin-top: 5px;
    .el-select {
      width: 100%;
    }
  }
  .operate-container {
    margin-left: 10px;
  }
  .row {
    padding: 10px 0px;
  }
  .row-top {
    padding: 10px 0px 0px;
    border-top: 1px solid #666;
  }
  .grid18 {
    height: 20px;
  }
  .row-bottom {
    padding: 10px 0px;
    border-bottom: 1px solid #666;
  }
  .table-class {
    padding: 10px 0px 0px;
  }
  .el-date-editor {
    width: 210px;
  }
  .biz-table-filter {
    .filter-wrap {
      .biz-select .el-select.el-select--small {
        width: 160px;
      }
    }
  }
  .biz-popup .popup-content {
    width: 600px;
  }
}
</style>
