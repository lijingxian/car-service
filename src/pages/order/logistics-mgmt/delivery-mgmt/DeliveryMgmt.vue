<template>
  <div class="delivery-mgmt">
    <biz-flex-table
      :operations="operations"
      :loading="loading"
      :tableData="tableData"
      :pagination="pagination"
      :filters="filters"
      :checkable="false"
      @filter-data-change="filterDataChange"
      @operate="operate"
      @selection-change="handleSelectionChange"
      @row-click="rowClick"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      @sort-change="sortChange"
    >
      <el-table-column prop="shop.name" label="发货单" min-width="160">
        <template slot-scope="scope">
          <div style="width:100%">
            <div class="overflow">
              {{scope.row.sn}}
            </div>
            <div class="overflow">
              发货时间：{{scope.row.shippingDate||'--'}}
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="shop.name" label="发货信息" min-width="160">
        <template slot-scope="scope">
          <div style="width:100%">
            <div class="overflow">
              配送方式：{{scope.row.shippingMethod||'--'}}
            </div>
            <div class="overflow">
              物流公司：{{ scope.row.logistics ? scope.row.logistics:'--' }}
            </div>
            <div class="overflow">
              运单号：{{ scope.row.expressSn||'--' }}
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="shop.name" label="收件人信息" min-width="160">
        <template slot-scope="scope">
          <div style="width:100%">
            <div class="overflow">
              {{ scope.row.consignee +' '+scope.row.phone }}
            </div>
            <div class="overflow">
              {{ scope.row.address||'--' }}
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="shop.name" label="关联订单" min-width="160">
        <template slot-scope="scope">
          <div style="width:100%">
            <div class="overflow">
              <el-button type="text" size="mini" @click.stop="clickOrder($event, scope.row)">{{ scope.row.orderSn||'--' }}</el-button>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column width="110" prop="date" label="操作">
        <div slot-scope="scope">
          <div class="biz-customcol">
            <el-button type="text" size="mini" @click.stop="certificate(scope.row)">凭证</el-button>
            <!-- <el-button type="text" size="mini" v-if="scope.row.logistics==='快递配送'||scope.row.logistics==='物流配送'" @click.stop="prinptWayBill(scope.row)">打印运单</el-button>
            <el-button type="text" size="mini" @click.stop="printShippingOrder(scope.row)">打印发货单</el-button>-->
          </div>
        </div>
      </el-table-column>
    </biz-flex-table>
    <!-- 侧边弹出栏 -->
    <biz-popup-tabs :open="open" @close="close" v-model="tabName">
      <el-tab-pane label="基本信息" name="first" v-if="!openOrder&&!openPurchaseOrder">
        <base-info :itemId="currentRowId" @update="isUpdate = true"></base-info>
      </el-tab-pane>
      <el-tab-pane label="订单信息" name="first" v-if="openOrder">
        <order-base-info :itemId="orderId" @update="isUpdate = true"></order-base-info>
      </el-tab-pane>
      <el-tab-pane label="订单信息" name="order" v-if="openPurchaseOrder">
        <purchase-order-info ref="orderinfo" :orderId="relateBillId" @closeTabByLogistics="closeTabByLogistics" @closeTabByEvaluate="closeTabByEvaluate"></purchase-order-info>
      </el-tab-pane>
    </biz-popup-tabs>
    <biz-popup-tabs :open="openLogistics" @close="openLogistics=false" v-model="tabName">
      <el-tab-pane label="物流追踪" name="loginfo" v-if="sn">
        <logistics-following :orderId="itemId" :sn="sn" ref="logistics"></logistics-following>
      </el-tab-pane>
    </biz-popup-tabs>
    <biz-popup-tabs :open="openReview" @close="openReview=false" v-model="tabName">
      <el-tab-pane label="评价" name="reviewinfo">
        <my-evaluate :orderId="itemId" ref="reviewinfo" :editable="editable"></my-evaluate>
      </el-tab-pane>
    </biz-popup-tabs>

    <el-dialog :visible.sync="dialogTableVisible" center width="1200px" append-to-body>
      <el-row :gutter="10">
        <el-col :span="18">
          <div class="grid18"></div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content bg-purple" align="right">
            <el-button type="primary" @click="print" size="mini">打印</el-button>
          </div>
        </el-col>
      </el-row>

      <vue-easy-print tableShow ref="easyPrint">
        <div class="d-p-wrap">
          <el-row :gutter="10">
            <div class="p-title">{{title}}</div>
          </el-row>
          <el-row :gutter="10" class="row">
            <el-col :span="12">
              <div class="grid18"></div>
            </el-col>
            <el-col :span="12">
              <div class="grid-content bg-purple" align="right">打印日期：{{formatDate(new Date().getTime())}}</div>
            </el-col>
          </el-row>
          <el-row :gutter="10" class="row-top">
            <el-col :span="14">
              <div class="grid-content bg-purple">订单编号：{{form.sn}}</div>
            </el-col>
            <el-col :span="10">
              <div class="grid-content bg-purple">配送方式：{{form.shippingMethodName}}</div>
            </el-col>
          </el-row>
          <el-row :gutter="10" class="row">
            <el-col :span="14">
              <div class="grid-content bg-purple">物流单号：{{shipping.sn}}</div>
            </el-col>
            <el-col :span="10">
              <div class="grid-content bg-purple">物流公司：{{logisticCompany}}</div>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="14">
              <div class="grid-content bg-purple">收货人：{{form.consignee}}</div>
            </el-col>
            <el-col :span="10">
              <div class="grid-content bg-purple">电话：{{form.phone}}</div>
            </el-col>
          </el-row>
          <el-row :gutter="10" class="row">
            <el-col :span="14">
              <div class="grid-content bg-purple">地址：{{shipping.address}}</div>
            </el-col>
            <el-col :span="10">
              <div class="grid-content bg-purple">买家留言：{{form.memo}}</div>
            </el-col>
          </el-row>
          <el-table :data="gridData" class="table-class">
            <el-table-column property="isTotal" width="50" label="序号">
              <template slot-scope="scope">
                <div v-if="scope.row.isTotal">合计</div>
                <div v-else>{{scope.$index+1}}</div>
              </template>
            </el-table-column>
            <el-table-column property="name" label="商品名" width="200">
              <template slot-scope="scope" v-if="!scope.row.isTotal">{{scope.row.name}}</template>
            </el-table-column>
            <el-table-column property="address" label="规格">
              <template slot-scope="scope" v-if="!scope.row.isTotal">{{scope.row.fullName.indexOf('[')!==-1?scope.row.fullName.split("[")[1].split("]")[0]:''}}</template>
            </el-table-column>
            <el-table-column property="price" label="单价">
              <template slot-scope="scope" v-if="!scope.row.isTotal">￥{{scope.row.price}}</template>
            </el-table-column>
            <el-table-column property="quantity" label="数量"></el-table-column>
            <el-table-column property="subTotal" label="小计">
              <template slot-scope="scope">￥{{scope.row.subTotal}}</template>
            </el-table-column>
          </el-table>
          <el-row :gutter="10" class="row">
            <el-col :span="6">
              <div class="grid-content bg-purple">运费：￥{{form.freight}}</div>
            </el-col>
            <el-col :span="6">
              <div class="grid-content bg-purple">优惠金额：￥{{form.couponDiscount}}</div>
            </el-col>
            <el-col :span="6">
              <div class="grid-content bg-purple">调整金额：￥{{form.offsetAmount}}</div>
            </el-col>
            <el-col :span="6">
              <div class="grid-content bg-purple">订单金额：￥{{form.originalAmount}}</div>
            </el-col>
          </el-row>
          <el-row :gutter="10" class="row">
            <el-col :span="18">
              <div class="grid18"></div>
            </el-col>
            <el-col :span="6">
              <div class="grid-content bg-purple">仓库签字：</div>
            </el-col>
          </el-row>
        </div>
      </vue-easy-print>
    </el-dialog>
    <export-file-new ref="exportFile" :percentage="percentage" @clearTimeOut="clearTimeOut" @exportExcle="exportExcle"></export-file-new>
  </div>
</template>

<script>
import { BizFlexTable } from '@/components/BizTable';
import { BizPopupTabs } from '@/components/BizPopup';
import BaseInfo from './BaseInfo';
import { mapGetters } from 'vuex';
import { logisticsMgmt } from '@/common/urls';
import OrderBaseInfo from '@/pages/order/finance-mgmt/base-info/OrderBaseInfo';
import PurchaseOrderInfo from '@/pages/invoicing/purchase-mgmt/purchase-order/OrderInfo';
import LogisticsFollowing from '@/pages/invoicing/purchase-mgmt/purchase-order/LogisticsFollowing';
import MyEvaluate from '@/pages/invoicing/agency-purchase-order/MyEvaluate';
import http from '@/common/http';
import dates from '@/utils/date';
import { ExportFileNew } from '@/components/BizUpload';
import vueEasyPrint from 'vue-easy-print';
import axios from 'axios';
export default {
  name: 'DeliveryMgmt',
  data() {
    return {
      // 导出
      exportFile: false,
      currentRowId: { id: '' },
      relateBillId: '',
      orderId: { id: '' },
      sn: '',
      dialogTableVisible: false,
      openOrder: false,
      editable: true,
      openPurchaseOrder: false,
      openLogistics: false,
      openReview: false,
      openInfo: true,
      gridData: [],
      taskId: '',
      t: '',
      percentage: 0,
      form: {},
      operations: [
        { label: '导出', name: 'export', type: '', auth: ['admin:shipping.export'] },
        { label: '刷新', name: 'refresh', type: '' }
        // { label: '删除', name: 'del', type: '', disabled: true }
      ],
      filters: [
        {
          type: 'daterange',
          label: '日期区间',
          value: [dates.lastMonthDate(), dates.nowDate()]
        },
        {
          type: 'input',
          value: '',
          placeholder: '请输入编号/订单号/姓名/电话'
        }
      ],
      loading: false,
      title: '',
      itemId: '',
      orderProperty: '',
      tableData: [],
      shipping: {},
      logisticCompany: '',
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
      // 侧栏更新后刷新
      isUpdate: false,
      tabName: 'first'
    };
  },
  components: {
    BizFlexTable,
    BizPopupTabs,
    BaseInfo,
    vueEasyPrint,
    OrderBaseInfo,
    PurchaseOrderInfo,
    LogisticsFollowing,
    MyEvaluate,
    ExportFileNew
  },
  beforeDestroy() {
    if (this.t) {
      // 如果定时器还在运行 或者直接关闭，不用判断
      window.clearTimeout(this.t); // 关闭
    }
  },
  methods: {
    ...mapGetters(['getUser']),
    clearTimeOut() {
      window.clearTimeout(this.t);
    },
    operate(name) {
      this[name]();
    },
    print() {
      this.$refs.easyPrint.print();
    },
    close() {
      this.open = false;
      this.openOrder = false;
    },
    clickOrder(e, row) {
      if (row.orderDType === 'purchaseOrder') {
        this.tabName = 'order';
        this.openPurchaseOrder = true;
        this.openOrder = false;
        this.relateBillId = row.orderId;
        this.$nextTick(() => {
          this.$refs.orderinfo.getOrderInfo();
        });
        this.open = true;
      } else {
        this.tabName = 'first';
        this.openOrder = true;
        this.openPurchaseOrder = false;
        this.orderId = { id: row.orderId };
        this.open = true;
      }
    },
    closeTabByLogistics(sn) {
      this.open = false;
      this.tabName = 'loginfo';
      this.sn = sn;
      this.openLogistics = true;
      this.$nextTick(() => {
        this.$refs.logistics.getLogisticsInfo();
      });
    },
    closeTabByEvaluate(id) {
      this.open = false;
      this.editable = false;
      this.tabName = 'reviewinfo';
      this.itemId = id;
      this.openReview = true;
      this.$nextTick(() => {
        this.$refs.reviewinfo.getEvaluationInfo();
      });
    },
    certificate(row) {
      this.logisticCompany = row.logistics;
      if (row.orderDType === 'purchaseOrder') {
        let params = {
          orderId: row.orderId,
          shopId: window.top.SHOP_ID || ''
        };
        http
          .get('/admin/purchaseOrderManage/voucher/shipping.jhtml', params)
          .then(data => {
            this.dialogTableVisible = true;
            this.title = this.getUser().shop ? this.getUser().shop.name + '发货单' : '发货单';
            this.form = data.order;
            this.shipping = data.shipping;
            this.userCard = data.userCard;
            this.gridData = data.order.orderItems;
          })
          .catch(ErrorData => {
            this.loading = false;
            console.log('ERR_REFRESH: ', ErrorData);
            this.$message.warning(ErrorData.errorMessage);
          });
      } else {
        let params = {
          orderId: row.orderId,
          shopId: window.top.SHOP_ID || ''
        };
        http
          .get(logisticsMgmt.delivery.queryShippingVoucher, params)
          .then(data => {
            this.dialogTableVisible = true;
            this.title = this.getUser().shop ? this.getUser().shop.name + '发货单' : '发货单';
            this.form = data.order;
            this.shipping = data.shipping;
            this.userCard = data.userCard;
            this.gridData = data.order.orderItems;
          })
          .catch(ErrorData => {
            this.loading = false;
            console.log('ERR_REFRESH: ', ErrorData);
            this.$message.warning(ErrorData.errorMessage);
          });
      }
    },
    formatDate(time) {
      let date = new Date(time);
      let year = date.getFullYear();
      let month = date.getMonth() + 1; // 月份是从0开始的
      let day = date.getDate();
      // let hour = date.getHours();
      // let min = date.getMinutes();
      // let sec = date.getSeconds();
      let newTime = year + '-' + (month < 10 ? '0' + month : month) + '-' + (day < 10 ? '0' + day : day);

      return newTime;
    },
    // 删除
    del(id) {
      let ids = id ? Array(id) : this.multiSelected.length === 0 ? [] : this.multiSelected;
      if (ids.length === 0) {
        this.$message.warning('未选择删除条目');
        return;
      }
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let params = {
          ids: ids
        };
        this.loading = true;
        http
          .post(logisticsMgmt.delivery.delete, params)
          .then(data => {
            this.loading = false;
            this.$message.success('操作成功');
            this.refresh();
          })
          .catch(ErrorData => {
            this.loading = false;
            this.$message.warning(ErrorData.errorMessage);
          });
      });
    },
    // 导出
    exportStart() {
      let params = {
        shopId: window.top.SHOP_ID || '',
        beginTime: this.filters[0].value[0] ? this.filters[0].value[0] + ' 00:00:00' : '',
        endTime: this.filters[0].value[1] ? this.filters[0].value[1] + ' 23:59:59' : '',
        searchValue: this.filters[1].value || '',
        ids: this.multiSelected
      };
      http
        .post('/admin/shipping/json/exportShippingStart.jhtml', params)
        .then(data => {
          this.taskId = data.data.taskId;
          this.getProcess(data.data.taskId);
        })
        .catch(errData => {
          this.loading = false;
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    async exportExcle() {
      try {
        let response = await axios.get('/admin/shipping/json/exportShippingResult.jhtml?taskId=' + this.taskId, { responseType: 'blob' });
        console.log('response => ', response);
        const blob = new Blob([response.data], { type: 'application/vnd.ms-excel' });
        console.log(decodeURI(response.headers['content-disposition']));
        const fileName = decodeURI(response.headers['content-disposition'].split('filename=')[1]);
        let elink = document.createElement('a');
        elink.download = fileName.match(/"(\S*)"/)[1];
        elink.style.display = 'none';
        elink.href = URL.createObjectURL(blob);
        document.body.appendChild(elink);
        elink.click();
        URL.revokeObjectURL(elink.href); // 释放URL 对象
        document.body.removeChild(elink);
        return;
      } catch (error) {
        throw new Error(error);
      }
    },
    getProcess(taskId) {
      let url = '/rest/v1/asynctask/getTaskInfo.jhtml';
      http
        .get(url, { taskId: this.taskId })
        .then(data => {
          if (!data.data.rate) {
            this.percentage = 0;
          }
          if (data.data.rate) {
            this.percentage = Number(data.data.rate);
          }
          if (data.data.status === '1' || data.data.status === '2' || data.data.status === '0') {
            this.$refs.exportFile.uploadingVisible = true;
            if (data.data && data.data.rate && data.data.rate === '100') {
              this.clearTimeOut();
              this.$refs.exportFile.title = '导出完成';
            } else if ((data.data && data.data.rate && data.data.rate !== '100') || !data.data.rate) {
              if (this.t) {
                this.clearTimeOut();
              }
              this.t = setTimeout(this.getProcess, 2000);
            }
          } else {
            this.$message.warning('导出失败');
          }
        })
        .catch(errData => {
          console.log(errData);
          console.log('code错误');
        });
    },
    filterDataChange(value) {
      this.filters = value;
      this.pagination.currentPage = 1;
      this.refresh();
    },
    handleSelectionChange(selectedItems) {
      this.multiSelected = selectedItems.map(row => {
        return row.id;
      });
      this.operations[2].disabled = true;
      if (selectedItems.length > 0) {
        this.operations[2].disabled = false;
      }
    },
    rowClick(row) {
      this.currentRowId = { id: row.id };
      this.tabName = 'first';
      this.open = true;
      this.openOrder = false;
      this.openPurchaseOrder = false;
    },
    handleSizeChange(pageSize) {
      this.pagination.pageSize = pageSize;
      this.refresh();
    },
    handleCurrentChange(pageNumber) {
      this.pagination.currentPage = pageNumber;
      this.refresh();
    },
    refresh(order) {
      this.loading = true;
      let params = {
        shopId: window.top.SHOP_ID || '',
        pageNumber: this.pagination.currentPage,
        pageSize: this.pagination.pageSize,
        orderDirection: order,
        orderProperty: this.orderProperty,
        searchValue: this.filters[1].value,
        beginTime: this.filters[0].value[0] || '',
        endTime: this.filters[0].value[1] || ''
      };
      http
        .get(logisticsMgmt.delivery.queryList, params)
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
    // 排序
    sortChange(data) {
      this.orderProperty = data.column ? data.column.property : '';
      this.refresh({ ascending: 'asc', descending: 'desc' }[data.order]);
    },
    showMessage(msg, type) {
      this.$message({
        message: msg,
        type: type,
        showClose: true
      });
    },
    // 页面提示语
    queryInfo() {
      let params = {
        type: 'shipping'
      };
      http
        .get(logisticsMgmt.delivery.queryInfo, params)
        .then(data => {
          this.showMessage(
            `今日新增发货记录${data.data.dayShippingCount}条,本月累计发货记录${data.data.monthShippingCount}条`,
            'info'
          );
        })
        .catch();
    }
  },
  mounted() {
    this.queryInfo();
    this.refresh();
  },
  computed: {},
  watch: {
    open(newVal, oldVal) {
      if (!newVal && this.isUpdate) {
        this.refresh();
        this.isUpdate = false;
      }
    }
  }
};
</script>

<style lang="scss">
.grid18 {
  height: 20px;
}
.d-p-wrap {
  .p-title {
    text-align: center;
    font-size: 20px;
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
}
.delivery-mgmt {
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
  .filter-wrap .biz-input {
    width: 260px;
  }
}
</style>
