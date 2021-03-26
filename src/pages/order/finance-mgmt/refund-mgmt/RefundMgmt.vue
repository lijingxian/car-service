<template>
  <div class="refund-mgmt">
    <biz-flex-table :operations="operations" :loading="loading" :tableData="tableData" :checkable="false" :pagination="pagination" :filters="filters"
      @filter-data-change="filterDataChange" @operate="operate" @selection-change="handleSelectionChange" @row-click="rowClick"
      @size-change="handleSizeChange" @current-change="handleCurrentChange" @sort-change="handleSortChange">
      <!-- 表格内容 -->
      <el-table-column prop="shop.name" label="售后单" min-width="160">
        <template slot-scope="scope">
          <div style="width:100%">
            <div class="overflow">
              {{scope.row.sn}}
            </div>
            <div class="overflow">
              状态：<span :style="{color: stateColor(scope.row)}">{{formatStatus(scope.row.state)}}</span>
            </div>
            <div class="overflow">
              创建时间：{{scope.row.createDate}}
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="shop.name" label="售后金额" min-width="80">
        <template slot-scope="scope">
          <div style="width:100%">
            <div class="overflow">
              ￥{{ scope.row.amount }}
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="memberData" label="会员">
        <template slot-scope="scope">
          <el-button type="text" size="mini" @click.stop="clickMember($event, scope.row)">
            {{ scope.row.memberData ? scope.row.memberData.name : '' }}</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="shop.name" label="关联订单" min-width="160">
        <template slot-scope="scope">
          <div style="width:100%">
            <div class="overflow">
              <el-button type="text" size="mini" @click.stop="clickOrder($event, scope.row)">{{ scope.row.orderData ? scope.row.orderData.sn : '' }}</el-button>
            </div>
          </div>
        </template>
      </el-table-column>
    </biz-flex-table>
    <!-- 侧边弹出栏 -->
    <biz-popup-tabs :open="open" @close="open=false" v-model="tabName">
      <el-tab-pane label="基本信息" name="first" v-if="!openMember&&!openOrder">
        <base-info :itemId="currentRowId" @update="isUpdate = true"></base-info>
      </el-tab-pane>
      <el-tab-pane label="会员基本信息" name="first" v-if="openMember">
        <member-base-info :itemId="memberId" @update="isUpdate = true"></member-base-info>
      </el-tab-pane>
      <el-tab-pane label="售后进度" name="afterprocess"
        v-if="!openMember&&!openOrder">
        <after-process :itemId="afterprocessId" ref="afterprocess" @update="isUpdate = true"></after-process>
      </el-tab-pane>
    </biz-popup-tabs>
    <biz-popup-tabs :open="openOrder" @close="openOrder=false" v-model="tabNameOrder">
      <el-tab-pane label="订单信息" name="baseinfo">
        <order-base-info :itemId="orderId"></order-base-info>
      </el-tab-pane>
      <el-tab-pane label="商品信息" name="productinfo">
        <order-product-info :itemId="orderProductId" :isEdit="isEdit"></order-product-info>
      </el-tab-pane>
    </biz-popup-tabs>
    <export-file-new ref="exportFile" :percentage="percentage" @clearTimeOut="clearTimeOut" @exportExcle="exportExcle"></export-file-new>
  </div>
</template>

<script>
import { BizFlexTable } from '@/components/BizTable';
import { BizPopupTabs } from '@/components/BizPopup';
import BaseInfo from './BaseInfo';
import MemberBaseInfo from '../base-info/MembershipBaseInfo';
import OrderBaseInfo from '../base-info/OrderBaseInfo';
import OrderProductInfo from '@/pages/order/OrderMgmt/ProductInfo';
import AfterProcess from './AfterProcess';
import { financeMgmt } from '@/common/urls';
import http from '@/common/http';
// import date from '@/utils/date';
import axios from 'axios';
import { ExportFileNew } from '@/components/BizUpload';
export default {
  name: 'RefoundMgmt',
  data() {
    return {
      // 侧栏会员信息,订单信息
      openMember: false,
      openOrder: false,
      memberId: { id: '' },
      orderId: { id: '' },
      afterprocessId: { id: '' },
      isEdit: false,
      orderProductId: '',
      // 排序
      orderProperty: '',
      taskId: '',
      t: '',
      percentage: 0,
      orderDirection: '',
      // 导出
      exportFile: false,
      currentRowId: { id: '' },
      operations: [
        // { label: '删除', name: 'del', type: 'primary' },
        { label: '刷新', name: 'refresh', type: '' },
        { label: '导出', name: 'exportStart', type: '', auth: ['admin:refunds.export'] }
      ],
      filters: [
        {
          label: '状态',
          type: 'select',
          value: '',
          placeholder: '请选择状态',
          options: [
            { label: '全部', value: '' },
            { value: '0', label: '未确认' },
            { value: '1', label: '拒绝退款退货申请' },
            { value: '2', label: '同意退货申请' },
            { value: '3', label: '买家发货' },
            { value: '4', label: '卖家拒收' },
            { value: '5', label: '卖家退款' },
            { value: '6', label: '取消退款' }
          ]
        },
        {
          label: '日期范围',
          type: 'daterange',
          // value: [date.lastMonthDate(), date.nowDate()]
          value: []
        },
        {
          type: 'input',
          value: '',
          placeholder: '请输入退款单号/会员/订单号'
        }
      ],
      loading: false,
      tableData: [],
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
      tabName: 'first',
      tabNameOrder: 'baseinfo'
    };
  },
  components: {
    BizFlexTable,
    BizPopupTabs,
    BaseInfo,
    MemberBaseInfo,
    OrderBaseInfo,
    OrderProductInfo,
    AfterProcess,
    ExportFileNew
  },
  beforeDestroy() {
    if (this.t) {
      // 如果定时器还在运行 或者直接关闭，不用判断
      window.clearTimeout(this.t); // 关闭
    }
  },
  methods: {
    clearTimeOut() {
      window.clearTimeout(this.t);
    },
    operate(name) {
      this[name]();
    },
    // 添加
    add() {
      this.currentRowId = { id: '' };
      this.open = true;
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
          .post(financeMgmt.refund.delete, params)
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
        state: this.filters[0].value,
        beginTime: this.filters[1].value[0] ? this.filters[1].value[0] + ' 00:00:00' : '',
        endTime: this.filters[1].value[1] ? this.filters[1].value[1] + ' 23:59:59' : '',
        searchValue: this.filters[2].value,
        ids: this.multiSelected
      };
      http
        .post('/admin/refunds/json/exportPurchaseBillStart.jhtml', params)
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
        let response = await axios.get('/admin/refunds/json/exportPurchaseBillResult.jhtml?taskId=' + this.taskId, { responseType: 'blob' });
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
    clickMember(e, row) {
      this.openMember = true;
      this.memberId = { id: row.memberData.id };
      this.open = true;
      this.openOrder = false;
    },
    clickOrder(e, row) {
      window.dType = row.dType;
      this.tabNameOrder = 'baseinfo';
      this.openOrder = true;
      this.orderId = { id: row.orderData.id };
      this.orderProductId = row.orderData.id;
      this.isEdit = false;
      this.openMember = false;
      this.open = false;
    },
    filterDataChange(value) {
      this.filters = value;
      this.pagination = {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        // 总条目数
        total: 0
      };
      this.refresh();
    },
    handleSelectionChange(selectedItems) {
      this.multiSelected = selectedItems.map(row => {
        return row.id;
      });
    },
    handleSortChange(value) {
      const ORDER_DIRECTION = {
        ascending: 'asc',
        descending: 'desc'
      };
      this.orderProperty = value.column ? value.column.property : '';
      this.orderDirection = value.order ? ORDER_DIRECTION[value.order] : '';
      this.refresh();
    },
    rowClick(row) {
      this.currentRowId = { id: row.id };
      window.dType = row.orderData.dType;
      this.afterprocessId = { id: row.orderData.id };
      this.tabName = 'first';
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
      this.loading = true;
      let params = {
        pageNumber: this.pagination.currentPage,
        pageSize: this.pagination.pageSize,
        state: this.filters[0].value,
        beginTime: this.filters[1].value[0] ? this.filters[1].value[0] + ' 00:00:00' : '',
        endTime: this.filters[1].value[1] ? this.filters[1].value[1] + ' 23:59:59' : '',
        searchValue: this.filters[2].value,
        orderProperty: this.orderProperty,
        orderDirection: this.orderDirection
      };
      http
        .get(financeMgmt.refund.queryList, params)
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
    stateColor(row) {
      if (row.state === '5') {
        return '#11AE17';
      } else {
        return '#FF7300';
      }
    },
    // 状态
    formatStatus(state) {
      let stateList = {
        0: '未确认',
        1: '拒绝退款退货申请',
        2: '同意退货申请',
        3: '买家发货',
        4: '卖家拒收',
        5: '卖家退款',
        6: '取消退款'
      };
      return stateList[state];
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
        type: 'refunds'
      };
      http
        .get(financeMgmt.refund.queryInfo, params)
        .then(data => {
          this.showMessage(
            `今日新增退款${data.data.dayRefundsCount}条,共退款${data.data.dayRefundsAmount}元,本月累计退款${data.data.monthRefundsCount}条,共退款${data.data.monthRefundsAmount}元`,
            'info'
          );
        })
        .catch();
    }
  },
  mounted() {
    this.filters[0].value = this.$route.query.state;
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
.refund-mgmt {
  .biz-table-filter {
    .filter-wrap {
      .biz-select .el-select.el-select--small {
        width: 160px;
      }
    }
    .biz-input {
      width: 230px;
    }
  }
}
</style>
