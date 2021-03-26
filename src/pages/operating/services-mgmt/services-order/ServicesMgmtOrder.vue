<template>
  <div class="services-mgmt">
    <biz-flex-table ref="table" v-loading="loading" :operations="operations" @operate="operate" :filters="filters"
      @filter-data-change="filterDataChange" :tableData="tableData" :pagination="pagination"
      @selection-change="handleSelectionChange" @row-click="rowClick" @size-change="handleSizeChange"
      @current-change="handleCurrentChange" :checkable="false">
      <el-table-column prop="shop.name" label="订单" min-width="120">
        <template slot-scope="scope">
          <div style="width:100%">
            <div class="overflow">
              {{scope.row.sn}}
            </div>
            <div class="overflow">
              创建日期：{{scope.row.orderTime}}
            </div>
            <div class="overflow">
              状态：<span :style="{color: stateColor(scope.row)}">{{getOrderStatus(scope.row)}}</span>
            </div>
            <div class="overflow">
              所属店铺：{{scope.row.shopName}}
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="shop.name" label="价格" min-width="80">
        <template slot-scope="scope">
          <div style="width:100%">
            ￥{{scope.row.amountPaid}}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="shop.name" label="服务信息" min-width="120">
        <template slot-scope="scope">
          <div style="width:100%">
            <div class="overflow">
              服务名称：{{scope.row.name}}
              [{{scope.row.name==='短信充值'?scope.row.purchaseSpecification+'条':scope.row.purchaseSpecification+'个月'}}]
            </div>
            <div class="overflow">
              有效期：{{scope.row.endTime}}
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column min-width="100" prop="date" label="操作">
        <template #default="scope">
          <biz-column-operation :row="scope.row">
            <el-button type="text" size="mini" @click.stop="paymentMgmt(scope.row)" v-if="scope.row.state==='unpaid'">
              付款
            </el-button>
            <el-button type="text" size="mini" @click.stop="closeOrder(scope.row)" v-if="scope.row.state==='unpaid'">
              关闭
            </el-button>
            <el-button type="text" size="mini" @click.stop="paymentMgmtRenewal(scope.row, 'renewal')" v-if="scope.row.state==='paid'">
              再次购买
            </el-button>
            <el-button type="text" size="mini" @click.stop="paymentMgmtRenewal(scope.row)" v-if="scope.row.state==='cancelled'">
              重新购买
            </el-button>
          </biz-column-operation>
        </template>
      </el-table-column>
    </biz-flex-table>
    <!-- 侧边弹出栏 -->
    <biz-popup-tabs :open="open" @close="open=false" v-model="tabName">
      <el-tab-pane label="基本信息" name="first">
        <BaseInfo ref="baseInfo" :id="orderId" :refreshSign="refreshSign">
        </BaseInfo>
      </el-tab-pane>
      <el-tab-pane label="订单进度" name="second">
        <OrderProcess ref="orderProcess" :itemId="orderId" :open="open" :refreshSign="refreshSign">
        </OrderProcess>
      </el-tab-pane>
      <!-- <el-tab-pane label="服务信息" name="second">
        <ServiceInfo :id="orderId" :refreshSign="refreshSign"></ServiceInfo>
      </el-tab-pane> -->
    </biz-popup-tabs>
    <el-dialog title="网上支付提示(支付完成前请不要关闭此窗口)" :visible.sync="dialogVisible" width="35%" :before-close="handleClose"
      custom-class="paymentDialog">
      <span style="display:block;font-size:16px;font-weight:700;margin-bottom:10px">
        <i class="el-icon-warning" style="color:#ff7300;margin-right:5px"></i>请您在新打开的页面中完成支付
      </span>
      <span>
        没有弹出窗口，说明您的浏览器禁止窗口弹出，请修改浏览器设置。
        <span v-popover:codePop class="helpClass">查看帮助</span>
      </span>
      <el-popover ref="codePop" placement="top-start" width="300" trigger="hover">
        <slot name="description">
          <p>查看"弹出窗口阻止程序"是否勾选的方法</p>
          <p>1、IE：打开IE浏览器菜单中选择“工具”--“Internet选项”，在新弹出来的对话框里找到“隐私”--“阻止显示大多数弹出框口”，将针对此项的勾选操作取消掉，点击“确定”，再进行支付。</p>
          <p>2、谷歌：工具栏右上角三道杠（设置）--显示高级设置--隐私设置--点击内容设置--允许所有网站显示弹出式窗口</p>
          <p>3、火狐：点击浏览器右上角“三道杠”图标--选项--内容--弹出式窗口--拦截弹出式窗口。若都没有勾选，您可以清理一下浏览器的缓存，清理成功后再关机重启试下。</p>
        </slot>
      </el-popover>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="mini">支付遇到问题</el-button>
        <el-button type="primary" @click="payQuery" size="mini">支付完成</el-button>
      </span>
    </el-dialog>
    <el-dialog :visible.sync="showCloseOrder" center append-to-body custom-class="close-order-dialog">
      <div>
        <div>请您在与客户沟通一致的前提下使用此功能，订单关闭后，不能恢复</div>
        <div class="reson-container">
          <span class="start">* </span>
          <span>请选择关闭订单的理由：</span>
          <el-select v-model="curSelectCloseReason" placeholder="请选择关闭理由" class="order-select">
            <el-option v-for="reason in reasonList" :key="reason.label" :label="reason.label" :value="reason.value"></el-option>
          </el-select>
        </div>
        <div class="deccription">
          <span class="dec-label">备注：</span>
          <el-input v-model="closeDeccription" placeholder="请输入备注" type="textarea" :rows="4"></el-input>
        </div>
      </div>
      <div slot="footer" class="close-button">
        <el-button @click="cancelClose">取消</el-button>
        <el-button @click="confirmClose">确定关闭</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="showPayment" center append-to-body custom-class="close-order-dialog">
      <div>
        <el-radio-group v-model="paymentTypeName" size="mini">
          <el-radio label="支付宝"></el-radio>
          <el-radio label="个人银联"></el-radio>
          <el-radio label="企业银联"></el-radio>
          <el-radio label="店铺账户"></el-radio>
        </el-radio-group>
      </div>
      <div slot="footer" class="close-button">
        <el-button @click="confirmPay">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { BizPopupTabs } from '@/components/BizPopup';
import { BizFlexTable } from '@/components/BizTable';
import { mapGetters } from 'vuex';
import serviceOrder from '@/service/order-mgmt/orderMgmt';
import service from '@/service/services-mgmt/services-order/servicesMgmtOrder';
import subscriptionService from '@/service/services-mgmt/services-order/subscriptionService';
import BaseInfo from './BaseInfo';
import OrderProcess from './OrderProcess';
import http from '@/common/http';
import { membershipMgmt as membership } from '@/common/urls';
export default {
  name: 'ServicesMgmtOrder',
  components: {
    BizPopupTabs,
    BizFlexTable,
    BaseInfo,
    OrderProcess
  },
  data() {
    return {
      orderId: '',
      paymentTypeName: '支付宝',
      open: false,
      loading: false,
      // 侧栏是否刷新
      refreshSign: false,
      dialogVisible: false,
      showCloseOrder: false,
      showPayment: false,
      curSelectCloseReason: '',
      closeDeccription: '',
      reasonList: [
        { label: '我不想买了', value: '我不想买了' },
        { label: '信息填写有误，重新拍', value: '信息填写有误，重新拍' },
        { label: '重复下单，误下单', value: '重复下单，误下单' },
        { label: '支付方式有误，无法支付', value: '支付方式有误，无法支付' }
      ],
      selections: [],
      tabName: 'first',
      operations: [
        {
          label: '服务订购',
          name: 'subscriptionService',
          type: 'primary'
        },
        {
          label: '刷新',
          name: 'refresh',
          type: ''
        }
      ],
      filters: [
        {
          type: 'select',
          label: '状态',
          name: 'state',
          value: '',
          options: [
            { label: '全部', value: '' },
            { label: '待付款', value: 'unpaid' },
            { label: '已完成', value: 'paid' },
            { label: '已关闭', value: 'cancelled' }
          ]
        },
        {
          type: 'select',
          label: '店铺',
          name: 'shop',
          value: '',
          options: []
        },
        {
          type: 'input',
          label: '',
          placeholder: '请输入服务名称',
          select: [],
          name: 'searchValue',
          value: ''
        }
      ],
      tableData: [],
      multipleSelection: [],
      serviceDatas: [],
      pagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        total: 0
      }
    };
  },
  created() {
    this.getUser();
    this.refresh();
    // this.queryServicesIdFilters();
    this.queryShopList();
  },
  mounted() {},
  watch: {},
  methods: {
    ...mapGetters(['getUser']),
    operate(name) {
      this[name]();
    },
    refresh() {
      this.getList();
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
    closeOrder(row) {
      this.orderId = row.id;
      this.showCloseOrder = true;
      this.curSelectCloseReason = '';
      this.closeDeccription = '';
    },
    cancelClose() {
      this.showCloseOrder = false;
    },
    confirmClose() {
      if (!this.curSelectCloseReason) {
        this.$message.warning('请选择订单关闭的理由');
        return false;
      }
      this.showCloseOrder = false;
      this.loading = true;
      serviceOrder.closeOrder(
        {
          orderId: this.orderId,
          shopId: window.top.SHOP_ID || '',
          reason: this.curSelectCloseReason,
          memo: this.closeDeccription
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
    queryShopList() {
      http
        .get(membership.mainPage.shopList, {
          shopId: window.top.SHOP_ID || '',
          sourceType: '4'
        })
        .then(data => {
          let arr = data.shops;
          arr.map(item => {
            item.value = item.id;
            item.label = item.name;
          });
          arr.unshift({ value: '', label: '全部' });
          this.$set(this.filters[1], 'options', arr);
        })
        .catch(errData => {
          console.log(errData);
          console.log('code错误');
          if (errData.errorMessage !== '店铺不存在') this.$message.warning(errData.errorMessage);
        });
    },
    getList() {
      let params = {
        shopId: this.filters[1].value || window.top.SHOP_ID || '',
        name: this.filters[2].value || '',
        // type: this.getSelectedType(),
        state: this.getSelectedState(),
        pageNumber: this.pagination.currentPage,
        pageSize: this.pagination.pageSize
      };
      this.loading = true;
      http
        .get('/admin/businessOrder/list/v201901.jhtml', params)
        .then(data => {
          this.tableData = data.dataList;
          // console.log(data);
          this.pagination.total = Number(data.total);
          this.loading = false;
        })
        .catch(errData => {
          console.log(errData);
          console.log('code错误');
          this.loading = false;
          this.$message.warning(errData.errorMessage);
        });
    },
    getOrderPurchaseWay(row) {
      switch (row.purchaseWay) {
        case 'newly':
          return '新购';
        case 'renewal':
          return '续订';
        default:
          break;
      }
    },
    stateColor(row) {
      if (row.state === 'paid') {
        return '#11AE17';
      } else {
        return '#FF7300';
      }
    },
    getOrderStatus(row) {
      switch (row.state) {
        case 'unpaid':
          return '待付款';
        case 'paid':
          return '已完成';
        case 'cancelled':
          return '已关闭';
        default:
          break;
      }
    },
    queryServicesIdFilters() {
      let params = { shopId: window.top.SHOP_ID || '' };
      service.queryFilters(
        params,
        data => {
          this.serviceDatas = data.topServices;
          this.setServicesIdFilters();
        },
        ErrorData => {
          console.log(ErrorData);
        }
      );
    },
    // setServicesIdFilters() {
    //   let options = [
    //     {
    //       value: '',
    //       label: '全部'
    //     }
    //   ];

    //   this.serviceDatas.forEach(service => {
    //     options.push({ value: service.value, label: service.label });
    //   });

    //   this.filters[0].options = options;
    // },
    // getSelectedServiceId() {
    //   return this.filters[0].value;
    // },
    // getSelectedType() {
    //   return this.filters[1].value;
    // },
    getSelectedState() {
      return this.filters[0].value;
    },
    subscriptionService() {
      this.$router.push({
        // path: `/operating/service-mgmt/services/subscription`,
        path: '/union/service-mgmt/subscribe'
        // query: { id: ``, type: 'newly' }
      });
    },
    rowClick(row) {
      this.refreshSign = !this.refreshSign;
      this.orderId = row.id;
      this.open = true;
      this.tabName = 'first';
    },
    paymentMgmt(model) {
      // this.$router.push({
      //   path: `/operating/service-mgmt/services/subscription`,
      //   query: { id: model.id, type: '' }
      // });
      this.orderId = model.id;
      this.showPayment = true;
    },
    confirmPay (model) {
      this.dialogVisible = true;
      if (this.paymentTypeName === '支付宝') {
        // if (navigator.userAgent.indexOf('Firefox') !== -1 || navigator.userAgent.indexOf('MSIE') !== -1) {
        //   this.dialogVisible = false;
        //   this.$message.warning('此浏览器不支持支付，请更换浏览器');
        //   return;
        // }
        this.alipayPagePay(this.orderId);
      } else if (this.paymentTypeName === '个人银联') {
        this.unionGatePayQuery(this.orderId);
      } else if (this.paymentTypeName === '企业银联') {
        this.unionB2BPayQuery(this.orderId);
      } else {
        this.accountPay(this.orderId);
      }
    },
    payQuery() {
      if (this.paymentTypeName === '支付宝') {
        this.alipayQuery(this.orderId);
      } else if (this.paymentTypeName === '个人银联') {
        this.unionGatePay(this.orderId);
      } else {
        this.unionB2BPay(this.orderId);
      }
    },
    alipayPagePay(orderId) {
      subscriptionService.alipayPagePay(
        { orderId: orderId },
        data => {
          // let newwin = window.open('', '_blank', '');
          // console.log(newwin);
          // // if (newwin === null) {
          // //   this.$message.warning('您的浏览器阻止了付款窗口打开，请关闭拦截');
          // // }
          // newwin.document.open('text/html', 'replace');
          // newwin.opener = null;
          // newwin.document.write(data.response.body);
          // newwin.document.close();
          window.open(data.response.body);
        },
        // result_code 不是100的处理
        ErrorData => {
          this.$message.warning(ErrorData.message);
        }
      );
    },
    unionGatePay(orderId) {
      subscriptionService.unionGatePay(
        { orderId: orderId },
        data => {
          let newwin = window.open('', '_blank', '');
          if (newwin === null) {
            this.$message.warning('您的浏览器阻止了付款窗口打开，请关闭拦截');
          }
          newwin.document.open('text/html', 'replace');
          newwin.opener = null;
          newwin.document.write(data.response);
          newwin.document.close();
        },
        // result_code 不是100的处理
        ErrorData => {
          this.$message.warning(ErrorData.message);
        }
      );
    },
    unionB2BPay(orderId) {
      subscriptionService.unionB2BPay(
        { orderId: orderId },
        data => {
          let newwin = window.open('', '_blank', '');
          if (newwin === null) {
            this.$message.warning('您的浏览器阻止了付款窗口打开，请关闭拦截');
          }
          newwin.document.open('text/html', 'replace');
          newwin.opener = null;
          newwin.document.write(data.response);
          newwin.document.close();
        },
        // result_code 不是100的处理
        ErrorData => {
          this.$message.warning(ErrorData.message);
        }
      );
    },
    alipayQuery(orderId) {
      subscriptionService.alipayQuery(
        { orderId: orderId },
        data => {
          this.$message.success('支付成功');
          this.dialogVisible = false;
          this.getList();
        },
        // result_code 不是100的处理
        ErrorData => {
          this.$message.warning(ErrorData.message);
          this.getList();
        }
      );
    },
    unionGatePayQuery(orderId) {
      subscriptionService.unionGatePayQuery(
        { orderId: orderId },
        data => {
          this.$message.success('支付成功');
          this.dialogVisible = false;
          this.getList();
        },
        // result_code 不是100的处理
        ErrorData => {
          this.$message.warning(ErrorData.message);
          this.getList();
        }
      );
    },
    unionB2BPayQuery(orderId) {
      subscriptionService.unionB2BPayQuery(
        { orderId: orderId },
        data => {
          this.$message.success('支付成功');
          this.dialogVisible = false;
          this.getList();
        },
        // result_code 不是100的处理
        ErrorData => {
          this.$message.warning(ErrorData.message);
          this.getList();
        }
      );
    },
    accountPay(orderId) {
      let params = { orderId: this.orderId, grade: 'platform' };
      http
        .get('/admin/order/json/accountPay.jhtml', params)
        .then(data => {
          this.$message.success('支付成功');
          this.dialogVisible = false;
          this.getList();
        })
        .catch(err => {
          this.$message.warning(err.errorMessage);
        });
    },
    paymentMgmtRenewal(model, type = '') {
      if (type) {
        this.$router.push({
          path: `/union/service-mgmt/subscribe?id=${model.product}`
        });
      } else {
        this.$router.push({
          path: '/union/service-mgmt/subscribe'
        });
      }
    },
    filterChange(val) {
      this.$refs.table.doLayout();
    },
    filterDataChange(filters) {
      this.pagination.currentPage = 1;
      this.refresh();
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleSizeChange(val) {
      this.pagination.pageSize = val;
      this.refresh();
    },
    handleCurrentChange(val) {
      this.pagination.currentPage = val;
      this.refresh();
    }
  }
};
</script>

<style lang="scss">
.paymentDialog {
  .el-dialog__body {
    border-bottom: 1px solid #e1e1e1;
    border-top: 1px solid #e1e1e1;
  }
}
.close-order-dialog {
  width: 500px;
  .reson-container {
    margin: 10px 0;
    .start {
      color: red;
      font-size: 16px;
    }
  }
  .order-select {
    width: 260px;
  }
  .deccription {
    display: flex;
    .dec-label {
      white-space: nowrap;
    }
  }
  .close-button {
    text-align: right;
  }
}
.services-mgmt {
  .biz-icon-zhiding1 {
    color: #ff7300;
    font-size: 26px;
  }
  .message-mgmt-header {
    position: absolute;
    top: 5px;
    left: 10px;
    font-size: 14px;
    z-index: 1;
  }
  .biz-customcol {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    .el-button {
      margin-left: 10px;
    }
  }
  .biz-two-column {
    display: flex;
    img {
      width: 100px;
      height: 100px;
    }
    .biz-two-row {
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
  }
  .delete-btn {
    color: red;
  }
}
</style>
