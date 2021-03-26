<template>
  <biz-grid class="news-mgmt">
    <biz-header :operations="operations" @operate="operate" slot="top" :filters="filters">
    </biz-header>
    <expand-table ref="expandTable" :data="tableData" :loading="loading" @expand-change="expandChange" @deleteCategory="deleteHandler"
      @row-click="rowClick" @selection-change="handleSelectionChange" :pagination="pagination" @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange">
    </expand-table>
    <biz-pagination slot="bottom" v-if="pagination" :pagination="pagination" @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange">
    </biz-pagination>
    <!-- <biz-flex-table ref="table" :operations="operations" @operate="operate" :filters="filters" @filter-data-change="filterDataChange"
      :tableData="tableData" :loading="loading" :pagination="pagination" @selection-change="handleSelectionChange" @row-click="rowClick"
      @size-change="handleSizeChange" @current-change="handleCurrentChange">
      <el-table-column prop="title" label="消息标题" min-width="170">
      </el-table-column>
      <el-table-column prop="content" label="消息内容" min-width="170">
      </el-table-column>
      <el-table-column prop="carPlateNumber" label="车辆" min-width="80" v-if="category==='car'||category==='service'">
      </el-table-column>
      <el-table-column label="车主信息" v-if="category==='car'||category==='service'" min-width="100">
        <div slot-scope="scope" v-if="scope.row.car">
          <div class="biz-customcol">
            {{scope.row.car.member?scope.row.car.member.name:''}}
          </div>
          <div class="biz-customcol">
            {{scope.row.car.member?scope.row.car.member.mobile:''}}
          </div>
        </div>
      </el-table-column>
      <el-table-column prop="address" label="地点" v-if="category==='car'" min-width="170">
      </el-table-column>
      <el-table-column prop="typeName" label="消息类别" min-width="95">
      </el-table-column>
      <el-table-column prop="sendTime" label="日期" min-width="90">
      </el-table-column>
      <el-table-column prop="date" label="操作" min-width="60">
        <div slot-scope="scope">
          <div class="biz-customcol" v-if="scope.row.typeName==='订单确认'">
            <el-button type="text" size="mini" @click.stop="orderConfirm(scope.row)">
              确认
            </el-button>
            <el-button type="text" size="mini" @click.stop="closeOrder(scope.row)">
              关闭
            </el-button>
          </div>
          <div class="biz-customcol" v-else>
            <el-button type="text" size="mini" @click.stop="handler(scope.row)" v-if="category==='pendingRemind'">
              处理
            </el-button>
            <el-button type="text" size="mini" @click.stop="deleteHandler(scope.row)">
              删除
            </el-button>
          </div>
        </div>
      </el-table-column>
    </biz-flex-table> -->
    <biz-popup-tabs :open="open" v-model="tabName" @close="open = false;">
      <el-tab-pane label="详细信息" name="info">
        <NewsMgmtInfo :itemId="itemId">
        </NewsMgmtInfo>
      </el-tab-pane>
    </biz-popup-tabs>
    <right-popup :open="openPotentialCustomer" :itemId="potentialCustomerId" :defaultTab="defaultTab" @close="openPotentialCustomer = false;"
      v-if="potentialCustomerId.id" @operationSuccess="refresh"></right-popup>
    <biz-popup-tabs :open="openWork" @close="openWork=false" v-model="workName">
      <el-tab-pane label="工单信息" name="work" v-show="openWork">
        <base-info :itemId="currentRowId" ref="baseInfo"></base-info>
      </el-tab-pane>
    </biz-popup-tabs>
    <biz-popup-tabs :open="openOrder" @close="openOrder=false" v-model="orderName" v-if="getUser().roleLevel === 'shop'">
      <el-tab-pane label="基本信息" name="info">
        <order-base-info :itemId="orderId" ref="orderBaseInfo" :activeNames="activeNames" @operationSuccess="refresh"></order-base-info>
      </el-tab-pane>
      <el-tab-pane label="商品信息" name="productinfo" @operationSuccess="refresh">
        <product-info :itemId="orderId" ref="productinfo" @setOrderItems="setOrderItems"></product-info>
      </el-tab-pane>
      <el-tab-pane label="订单进度" name="loginfo">
        <order-logs :itemId="orderId" ref="loginfo" :paymentMethodName="paymentMethodName" @operationSuccess="refresh"></order-logs>
      </el-tab-pane>
      <el-tab-pane label="售后进度" name="afterprocess">
        <after-process :itemId="orderId" ref="afterprocess"></after-process>
      </el-tab-pane>
      <el-tab-pane label="服务记录" name="orderhistory">
        <order-history :itemId="orderId" ref="orderhistory"></order-history>
      </el-tab-pane>
      <el-tab-pane label="发票" name="invoice" v-if="invoiceState!=='无'">
        <invoice-info :itemId="orderId" ref="invoice"></invoice-info>
      </el-tab-pane>
    </biz-popup-tabs>
    <biz-popup-tabs :open="openReception" @close="openReception=false" v-model="receptionName">
      <el-tab-pane label="基本信息" name="first" v-if="receptionId.id">
        <reception-base-info :itemId="receptionId"></reception-base-info>
      </el-tab-pane>
    </biz-popup-tabs>
    <biz-popup-tabs :open="openMerchants" v-model="merchantsName" @close="openMerchants = false;">
      <el-tab-pane label="申请单基本信息" name="first">
        <merchants-mgmt-base-info ref="baseInfo" :id="currentId" :open="openMerchants" :email="currentRowEmail" @created="refresh">
        </merchants-mgmt-base-info>
      </el-tab-pane>
      <el-tab-pane label="个人资质信息" name="second">
        <merchants-mgmt-psn-qua :id="currentId" :open="openMerchants" :email="currentRowEmail">
        </merchants-mgmt-psn-qua>
      </el-tab-pane>
      <el-tab-pane label="企业资质信息" name="third">
        <merchants-mgmt-com-qua :id="currentId" :open="openMerchants" :email="currentRowEmail">
        </merchants-mgmt-com-qua>
      </el-tab-pane>
    </biz-popup-tabs>
    <biz-popup-tabs :open="openCard" @close="openCard=false" v-model="tabName">
      <el-tab-pane label="通讯卡信息" name="info">
        <card-base-info :itemId="cardId" @update="refresh"></card-base-info>
      </el-tab-pane>
      <el-tab-pane label="充值记录" name="second">
        <recharge-records ref="recharge" :itemId="cardId" @update="refresh"></recharge-records>
      </el-tab-pane>
    </biz-popup-tabs>
    <biz-popup-tabs :open="openMember" v-model="tabName" @close="openMember=false">
      <el-tab-pane label="基本信息" name="info">
        <membership-mgmt-base-info :itemId="memberId" @operationSuccess="refresh"></membership-mgmt-base-info>
      </el-tab-pane>
      <el-tab-pane label="车辆信息" name="carInfo">
        <membership-mgmt-vehicle-info :itemId="memberId" @operationSuccess="refresh"></membership-mgmt-vehicle-info>
      </el-tab-pane>
      <el-tab-pane label="实名认证" name="2">
        <membership-certification :itemId="memberId" @operationSuccess="refresh"></membership-certification>
      </el-tab-pane>
    </biz-popup-tabs>
  </biz-grid>
</template>

<script>
import { BizPopupTabs } from '@/components/BizPopup';
import { BizHeader, BizPagination } from '@/components/BizTable';
import { BizGrid } from '@/components/BizGrid';
import service from '@/service/news-mgmt/newsMgmt';
import orderService from '@/service/order-mgmt/orderMgmt';
import NewsMgmtInfo from './NewsMgmtInfo';
import RightPopup from '@/pages/sales/potential-customer-mgmt/PotentialCustomerMgmt/PotentialCustomerPopup';
import BaseInfo from '@/pages/service/worksheet-mgmt/WorkSheetBaseInfo';
import OrderBaseInfo from '@/pages/order/OrderMgmt/BaseInfo';
import ProductInfo from '@/pages/order/OrderMgmt/ProductInfo';
import OrderLogs from '@/pages/order/OrderMgmt/OrderLogs';
import AfterProcess from '@/pages/order/OrderMgmt/AfterProcess';
import OrderHistory from '@/pages/order/OrderMgmt/OrderHistory';
import InvoiceInfo from '@/pages/order/OrderMgmt/InvoiceInfo';
import ReceptionBaseInfo from '@/pages/service/smart-to-shop/reception-mgmt/BaseInfo';
import MerchantsMgmtBaseInfo from '@/pages/operating/merchants-mgmt/MerchantsMgmtBaseInfo';
import MerchantsMgmtPsnQua from '@/pages/operating/merchants-mgmt/MerchantsMgmtPsnQua';
import MerchantsMgmtComQua from '@/pages/operating/merchants-mgmt/MerchantsMgmtComQua';
import CardBaseInfo from '@/pages/operating/communi-mgmt/communi-card/BaseInfo';
import RechargeRecords from '@/pages/operating/communi-mgmt/communi-card/RechargeRecords';
import MembershipMgmtBaseInfo from '@/pages/member/membership-mgmt/MembershipMgmt/MembershipMgmtBaseInfo';
import MembershipMgmtVehicleInfo from '@/pages/member/membership-mgmt/MembershipMgmt/MembershipMgmtVehicleInfo';
import MembershipCertification from '@/pages/member/membership-mgmt/MembershipMgmt/MembershipMgmtCertification';
import { mapGetters } from 'vuex';
import ExpandTable from './components/ExpandTable';
import http from '@/common/http';
export default {
  name: 'NewsMgmt',
  data() {
    return {
      tabName: 'info',
      workName: 'work',
      orderName: 'info',
      receptionName: 'first',
      merchantsName: 'first',
      itemId: '',
      invoiceState: '',
      orderId: '',
      currentRowId: {},
      cardId: { id: '' },
      memberId: { id: '' },
      currentId: '',
      currentRowEmail: '',
      receptionId: { id: '' },
      potentialCustomerId: { id: '' },
      defaultTab: '0',
      category: 'car',
      subCategory: '',
      paymentMethodName: '',
      loading: false,
      open: false,
      openOrder: false,
      openWork: false,
      openReception: false,
      openPotentialCustomer: false,
      openMerchants: false,
      openCard: false,
      openMember: false,
      showWork: false,
      selections: [],
      activeNames: ['2'],
      operations: [
        // {
        //   disabled: true,
        //   label: '删除',
        //   name: 'delete',
        //   type: ''
        // },
        {
          label: '刷新',
          name: 'refresh',
          type: ''
        }
      ],
      filters: [
        {
          type: 'select',
          label: '消息类别',
          name: 'type',
          value: '',
          options: []
        },
        {
          type: 'daterange',
          label: '日期',
          name: 'publishDate',
          value: []
        },
        {
          type: 'input',
          label: '',
          placeholder: '请输入关键字',
          name: 'searchValue',
          value: ''
        }
      ],
      tableData: [],
      pagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        total: 0
      }
    };
  },
  components: {
    BizPopupTabs,
    // BizFlexTable,
    NewsMgmtInfo,
    RightPopup,
    BaseInfo,
    OrderBaseInfo,
    ProductInfo,
    OrderLogs,
    AfterProcess,
    InvoiceInfo,
    OrderHistory,
    ReceptionBaseInfo,
    MerchantsMgmtBaseInfo,
    MerchantsMgmtPsnQua,
    MerchantsMgmtComQua,
    CardBaseInfo,
    RechargeRecords,
    MembershipMgmtBaseInfo,
    MembershipMgmtVehicleInfo,
    MembershipCertification,
    BizGrid,
    ExpandTable,
    BizHeader,
    BizPagination
  },
  created() {
    this.category = 'service';
    this.subCategory = '';
    this.state = this.$route.query.state || '';
    this.filters[0].value = this.$route.query.type || '';
    this.getList();
    this.listMsgType();
  },
  mounted() {},
  watch: {
    $route(nweVal, oldVal) {
      Object.assign(this.$data, this.$options.data());
      this.category = 'service';
      this.subCategory = '';
      this.state = this.$route.query.state || '';
      this.filters[0].value = this.$route.query.type || '';
      this.getList();
      this.listMsgType();
    }
  },
  methods: {
    ...mapGetters(['getUser']),
    operate(name) {
      this[name]();
    },
    expandChange(row) {
      this.getChildrenList(row);
    },
    setOrderItems(val) {
      this.orderName = 'info';
      this.$refs.orderBaseInfo.setOrderItems(val);
    },
    refresh() {
      this.getList();
    },
    operationSuccess() {
      this.getList();
    },
    rowClick(model, e, column) {
      if (this.category !== 'pendingRemind') this.open = true;
      this.itemId = String(model.messageId);
    },
    getChildrenList(row) {
      http
        .get('/admin/messages/listMergeMessage.jhtml', {
          id: row.messageId,
          searchValue: this.filters[2].value,
          category: this.category,
          state: this.state,
          subCategory: this.subCategory,
          type: this.filters[0].value,
          beginDate: this.filters[1].value[0],
          endDate: this.filters[1].value[1],
          pageNumber: this.pagination.currentPage,
          pageSize: this.pagination.pageSize
        })
        .then(data => {
          this.tableData.forEach(item => {
            this.$set(item, 'childrenList', []);
            if (item.messageId === row.messageId) {
              this.$set(item, 'childrenList', data.messages);
            }
          });
          console.log(this.tableData);
        })
        .catch(ErrorData => {
          this.$message.warning(ErrorData.errorMessage || '操作出现错误');
        });
    },
    getList() {
      this.loading = true;
      let params = {
        id: this.$route.query.id || '',
        searchValue: this.filters[2].value,
        category: this.category,
        state: this.state,
        subCategory: this.subCategory,
        type: this.filters[0].value,
        beginDate: this.filters[1].value[0],
        endDate: this.filters[1].value[1],
        pageNumber: this.pagination.currentPage,
        pageSize: this.pagination.pageSize
      };
      service.listMsg(
        params,
        data => {
          this.loading = false;
          this.tableData = data.messages;
          this.pagination.total = Number(data.total);
        },
        // result_code 不是100的处理
        ErrorData => {
          console.log(ErrorData);
        }
      );
    },
    listMsgType() {
      this.loading = true;
      let params = {
        category: this.category,
        subCategory: this.subCategory
      };
      service.listMsgType(
        params,
        data => {
          this.loading = false;
          this.filters[0].options = [{ label: '全部', value: '' }].concat(
            data.content.map(item => {
              return {
                label: item.label,
                value: item.value
              };
            })
          );
        },
        // result_code 不是100的处理
        ErrorData => {
          console.log(ErrorData);
        }
      );
    },
    deleteHandler(row) {
      let ids = [];
      ids.push(row.messageId);
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(
        () => {
          this.loading = true;
          service.deleteMsg(
            { ids: ids },
            data => {
              this.$message.success('删除成功');
              this.loading = false;
              this.getList();
            },
            // result_code 不是100的处理
            ErrorData => {
              console.log(ErrorData);
              this.loading = false;
            }
          );
        },
        () => {
          this.loading = false;
        }
      );
    },
    delete() {
      let ids = [];
      this.selections.forEach(element => {
        ids.push(element.messageId);
      });
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(
        () => {
          this.loading = true;
          service.deleteMsg(
            { ids: ids },
            data => {
              this.$message.success('删除成功');
              this.loading = false;
              this.getList();
            },
            // result_code 不是100的处理
            ErrorData => {
              console.log(ErrorData);
              this.loading = false;
            }
          );
        },
        () => {
          this.loading = false;
        }
      );
    },
    handler(row) {
      console.log(row);
      let type = row.msgType;
      switch (type) {
        case 'orderExecute':
          this.orderId = row.order.id;
          this.paymentMethodName = row.order.paymentMethodName;
          this.openOrder = true;
          this.invoiceState = row.order.invoiceState;
          break;
        case 'rescue':
          this.orderId = row.order.id;
          this.paymentMethodName = row.order.paymentMethodName;
          this.orderName = 'loginfo';
          this.openOrder = true;
          this.invoiceState = row.order.invoiceState;
          break;
        case 'orderRefund':
          this.orderId = row.order.id;
          this.paymentMethodName = row.order.paymentMethodName;
          this.orderName = 'afterprocess';
          this.openOrder = true;
          this.invoiceState = row.order.invoiceState;
          break;
        case 'invoice':
          this.orderId = row.order.id;
          this.paymentMethodName = row.order.paymentMethodName;
          this.orderName = 'invoice';
          this.openOrder = true;
          this.invoiceState = row.order.invoiceState;
          break;
        case 'delivery':
          this.orderId = row.templateId;
          this.openOrder = true;
          break;
        case 'reception':
          this.receptionId = { id: row.templateId };
          this.openReception = true;
          break;
        case 'potentialResult':
          this.potentialCustomerId = { id: row.templateId };
          this.defaultTab = '3';
          this.openPotentialCustomer = true;
          break;
        case 'potential':
          this.potentialCustomerId = { id: row.templateId };
          this.defaultTab = '3';
          this.openPotentialCustomer = true;
          break;
        case 'reply':
          this.$router.push({ path: '/service/service-mgmt/online-response' });
          break;
        case 'workOrder':
          this.currentRowId = { id: row.templateId };
          this.workName = 'work';
          this.openWork = true;
          break;
        case 'investmentApply':
          this.currentId = row.templateId;
          this.currentRowEmail = row.email;
          this.openMerchants = true;
          break;
        case 'investmentAptitude':
          this.currentId = row.templateId;
          this.currentRowEmail = row.email;
          this.openMerchants = true;
          break;
        case 'addSim':
          this.cardId = { id: row.templateId };
          this.openCard = true;
          break;
        case 'member':
          this.memberId = { id: row.templateId };
          this.openMember = true;
          break;
        case 'idcardcertification':
          this.memberId = { id: row.templateId };
          this.openMember = true;
          break;
        case 'importbooklet':
          window.open(row.value);
          break;
        default:
          this.messagePendingDeal(row);
      }
    },
    handleSelectionChange(val) {
      this.operations[0].disabled = true;
      if (val.length > 0) {
        this.operations[0].disabled = false;
      }
      this.selections = val;
    },
    filterDataChange(filters) {
      this.pagination.currentPage = 1;
      this.refresh();
    },
    handleSizeChange(val) {
      this.pagination.pageSize = val;
      this.refresh();
    },
    handleCurrentChange(val) {
      this.pagination.currentPage = val;
      this.refresh();
    },
    orderConfirm(row) {
      orderService.confirmOrder(
        {
          orderId: row.order.id,
          shopId: window.top.SHOP_ID || ''
        },
        data => {
          this.$message.success('操作成功');
          this.loading = false;
          this.getList();
        },
        // result_code 不是100的处理
        ErrorData => {
          console.log(ErrorData);
          this.$message.warning(ErrorData.errorMessage);
          this.loading = false;
        }
      );
    },
    closeOrder(row) {
      orderService.closeOrder(
        {
          orderId: row.order.id,
          shopId: window.top.SHOP_ID || ''
        },
        data => {
          this.loading = false;
          this.$message.success('操作成功');
          this.getList();
        },
        // result_code 不是100的处理
        ErrorData => {
          this.loading = false;
          this.$message.warning(ErrorData.errorMessage);
        }
      );
    },
    messagePendingDeal(row) {
      let ids = [];
      ids.push(row.messageId);
      this.$confirm('是否确认处理?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(
        () => {
          this.loading = true;
          service.messagePendingDeal(
            { ids: ids },
            data => {
              this.$message.success('操作成功');
              this.loading = false;
              this.getList();
            },
            // result_code 不是100的处理
            ErrorData => {
              console.log(ErrorData);
              this.loading = false;
            }
          );
        },
        () => {
          this.loading = false;
        }
      );
    }
  }
};
</script>

<style lang="scss">
.news-mgmt {
  .biz-icon-zhiding1 {
    color: #ff7300;
    font-size: 26px;
  }
  .federation-mgmt-header {
    text-align: right;
    padding: 5px 15px;
  }
  .biz-customcol {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    .el-button {
      margin-left: 10px;
    }
  }
  .delete-btn {
    color: red;
  }
}
</style>
