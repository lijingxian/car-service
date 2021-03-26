<template>
  <div class="payment-mgmt">
    <biz-flex-table :operations="operations" :loading="loading" :tableData="tableData" :pagination="pagination" :filters="filters"
      @filter-data-change="filterDataChange" @operate="operate" @selection-change="handleSelectionChange" @row-click="rowClick"
      @size-change="handleSizeChange" @current-change="handleCurrentChange" @sort-change="handleSortChange">
      <!-- 表格内容 -->
      <el-table-column prop="sn" label="收款单号"></el-table-column>
      <el-table-column prop="amount" label="收款金额">
        <template slot-scope="scope">
          {{ scope.row.amount }}元
        </template>
      </el-table-column>
      <el-table-column prop="memberData" label="会员">
        <template slot-scope="scope">
          <el-button type="text" size="mini" @click="clickMember($event, scope.row)">
            {{ scope.row.memberData ? scope.row.memberData.name : '' }}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column prop="orderData" label="订单号">
        <template slot-scope="scope">
          <el-button type="text" size="mini" @click="clickOrder($event, scope.row)">
            {{ scope.row.orderData ? scope.row.orderData.sn : '' }}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="100">
        <template slot-scope="scope">
          <span :style="{color: stateColor(scope.row)}">{{ formatStatus(scope.row.status) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="paymentMethod" label="支付方式" width="100"></el-table-column>
      <el-table-column prop="paymentType" label="付款方式" width="100"></el-table-column>
      <el-table-column prop="paymentDate" label="付款时间" sortable="custom"></el-table-column>
    </biz-flex-table>
    <!-- 侧边弹出栏 -->
    <biz-popup-tabs :open="open" @close="close" v-model="tabName">
      <el-tab-pane label="基本信息" name="first" v-if="!openMember&&!openOrder">
        <base-info :itemId="currentRowId" :isEdit="isEdit" @update="isUpdate = true"></base-info>
      </el-tab-pane>
      <el-tab-pane label="会员基本信息" name="first" v-if="openMember">
        <member-base-info :itemId="memberId" @update="isUpdate = true"></member-base-info>
      </el-tab-pane>
      <el-tab-pane label="订单信息" name="first" v-if="openOrder">
        <order-base-info :itemId="orderId" @update="isUpdate = true"></order-base-info>
      </el-tab-pane>
    </biz-popup-tabs>
  </div>
</template>

<script>
import { BizFlexTable } from '@/components/BizTable';
import { BizPopupTabs } from '@/components/BizPopup';
import BaseInfo from './BaseInfo';
import MemberBaseInfo from '../base-info/MembershipBaseInfo';
import OrderBaseInfo from '../base-info/OrderBaseInfo';
import { mapGetters } from 'vuex';
import { financeMgmt, global } from '@/common/urls';
import http from '@/common/http';
import date from '@/utils/date';
export default {
  name: 'PaymentMgmt',
  data() {
    return {
      // 侧栏会员信息,订单信息
      openMember: false,
      openOrder: false,
      editShopIds: [],
      isEdit: true,
      memberId: { id: '' },
      orderId: { id: '' },
      // 排序
      orderProperty: '',
      orderDirection: '',
      // 导出
      exportFile: false,
      currentRowId: { id: '' },
      operations: [
        { label: '刷新', name: 'refresh', type: '' },
        // { label: '删除', name: 'del', type: 'primary' },
        { label: '导出', name: 'export', type: '' }
      ],
      filters: [
        {
          label: '状态',
          type: 'select',
          value: '',
          placeholder: '请选择状态',
          options: [
            { label: '全部', value: '' },
            // { label: '等待支付', value: '0' },
            { label: '支付成功', value: '1' },
            { label: '支付失败', value: '2' }
          ]
        },
        {
          label: '支付方式',
          type: 'select',
          value: '',
          placeholder: '请选择支付方式',
          options: [
            { label: '全部', value: '' },
            { label: '在线支付', value: '在线支付' },
            { label: '线下支付', value: '线下支付' },
            { label: '预存款支付', value: '预存款支付' },
            { label: '到店支付', value: '到店支付' },
            { label: '货到付款', value: '货到付款' }
          ]
        },
        {
          label: '付款方式',
          type: 'select',
          value: '',
          placeholder: '请选择付款方式',
          options: [
            { label: '全部', value: '' },
            { label: '支付宝', value: '支付宝支付' },
            { label: '微信', value: '微信支付' },
            { label: '会员卡余额', value: '会员卡余额' },
            { label: '现金', value: '现金' },
            { label: '刷卡', value: '刷卡' },
            { label: '汇款', value: '汇款' },
            { label: '其他', value: '其他' }
          ]
        },
        {
          label: '日期范围',
          type: 'daterange',
          value: [date.lastMonthDate(), date.nowDate()]
        },
        {
          type: 'input',
          value: '',
          placeholder: '请输入收款单号/会员/订单号'
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
      tabName: 'first'
    };
  },
  components: {
    BizFlexTable,
    BizPopupTabs,
    BaseInfo,
    MemberBaseInfo,
    OrderBaseInfo
  },
  methods: {
    ...mapGetters(['getUser']),
    operate(name) {
      this[name]();
    },
    // 添加
    add() {
      this.currentRowId = { id: '' };
      this.open = true;
    },
    getEditableStores() {
      http
        .get(global.editableStores, {
          resourceType: '1'
        })
        .then(data => {
          this.editShopIds = [];
          data.dataList.map(item => {
            this.editShopIds.push(item.id);
          });
        })
        .catch(errData => {
          console.log(errData);
          console.log('code错误');
        });
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
          .post(financeMgmt.payment.delete, params)
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
    export() {
      let idsStr = [];
      idsStr = this.multiSelected.join('&ids=');
      let params = {
        status: this.filters[0].value,
        paymentMethod: this.filters[1].value,
        paymentType: this.filters[2].value,
        beginTime: this.filters[3].value[0] ? this.filters[3].value[0] + ' 00:00:00' : '',
        endTime: this.filters[3].value[1] ? this.filters[3].value[1] + ' 23:59:59' : '',
        searchValue: this.filters[4].value,
        // ids: this.multiSelected.length === 0 ? '' : this.multiSelected
        ids: idsStr
      };
      let paramsArr = [];
      for (let name in params) {
        paramsArr.push(`${name}=${params[name]}`);
      }
      let linkedUrl = `${financeMgmt.payment.export}?` + paramsArr.join('&');
      http
        .get(linkedUrl)
        .then()
        .catch(data => {
          if (!data.errorMessage && data !== '没有符合条件的数据') {
            // 异步弹出窗口会被Chrome拦截
            window.open(linkedUrl);
            // location.href = linkedUrl;
          } else {
            if (data === '没有符合条件的数据') {
              this.$message.warning('没有符合条件的数据');
            } else {
              this.$message.warning(data.errorMessage);
              console.log('ERR_EXPORT: ', data);
            }
          }
        });
    },
    close() {
      this.open = false;
      this.openMember = false;
      this.openOrder = false;
    },
    clickMember(e, row) {
      this.openMember = true;
      this.memberId = { id: row.memberData.id };
      this.open = true;
    },
    clickOrder(e, row) {
      this.openOrder = true;
      this.orderId = { id: row.orderData.id };
      this.open = true;
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
      if (row.unionConfig.editable === '0' && this.getUser().roleLevel === 'shop') {
        this.isEdit = false;
      } else {
        this.isEdit = true;
      }
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
        status: this.filters[0].value,
        paymentMethod: this.filters[1].value,
        paymentType: this.filters[2].value,
        beginTime: this.filters[3].value[0] ? this.filters[3].value[0] + ' 00:00:00' : '',
        endTime: this.filters[3].value[1] ? this.filters[3].value[1] + ' 23:59:59' : '',
        searchValue: this.filters[4].value,
        orderProperty: this.orderProperty,
        orderDirection: this.orderDirection
      };
      http
        .get(financeMgmt.payment.queryList, params)
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
      if (row.status === '1') {
        return '#11AE17';
      } else {
        return '#FF7300';
      }
    },
    // 状态
    formatStatus(status) {
      let statusList = {
        0: '等待支付',
        1: '支付成功',
        2: '支付失败'
      };
      return statusList[status];
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
        type: 'payment'
      };
      http
        .get(financeMgmt.payment.queryInfo, params)
        .then(data => {
          this.showMessage(
            `今日新增收款${data.data.dayPaymentCount}条,共收款${data.data.dayPaymentAmount}元,本月累计收款${data.data.monthPaymentCount}条,共收款${data.data.monthPaymentAmount}元`,
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
.payment-mgmt {
  .biz-table-filter {
    .filter-wrap:nth-child(2),
    .filter-wrap:nth-child(3) {
      .biz-select .el-select.el-select--small {
        width: 130px;
      }
    }
  }
}
</style>
