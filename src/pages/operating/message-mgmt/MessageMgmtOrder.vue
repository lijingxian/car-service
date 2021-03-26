<template>
  <div class="message-mgmt">
    <biz-flex-table ref="table" :operations="operations" @operate="operate" :filters="filters" @filter-data-change="filterDataChange" :tableData="tableData"
      :loading="loading" :pagination="pagination" @selection-change="handleSelectionChange" @row-click="rowClick" @size-change="handleSizeChange"
      @current-change="handleCurrentChange">
      <el-table-column width="200" prop="sn" label="订单号">
      </el-table-column>
      <el-table-column prop="products[0].name" label="套餐">
      </el-table-column>
      <el-table-column prop="amount" label="价格">
      </el-table-column>
      <el-table-column prop="shop.name" label="店铺">
      </el-table-column>
      <el-table-column prop="member.name" label="操作者">
      </el-table-column>
      <el-table-column prop="orderStatus" :formatter="getOrderStatus" label="状态">
      </el-table-column>
      <el-table-column min-width="150" prop="orderTime" label="日期" width="160">
      </el-table-column>
      <el-table-column width="100" prop="date" label="操作">
        <div slot-scope="scope">
          <div class="biz-customcol" v-if="scope.row.orderStatus==='unpaid'">
            <el-button type="text" size="mini" @click.stop="paymentMgmt(scope.row)">
              付款
            </el-button>
            <el-button type="text" size="mini" @click.stop="cancelOrder(scope.row)">
              取消
            </el-button>
          </div>
        </div>
      </el-table-column>
    </biz-flex-table>
  </div>
</template>

<script>
import { BizFlexTable } from '@/components/BizTable';
import service from '@/service/message-mgmt/messageMgmt';
import date from '@/utils/date';

export default {
  name: 'MessageMgmtOrder',
  components: {
    BizFlexTable
  },
  data() {
    return {
      itemId: '',
      open: false,
      loading: false,
      selections: [],
      operations: [
        {
          disabled: false,
          label: '充值',
          name: 'recharge',
          type: 'danger'
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
          label: '店铺',
          name: 'shopId',
          value: '',
          options: []
        },
        {
          type: 'select',
          label: '状态',
          name: 'orderStatus',
          value: '',
          options: [
            { label: '全部', value: '' },
            { label: '未付款', value: 'unpaid' },
            { label: '已付款', value: 'paid' },
            { label: '已取消', value: 'cancelled' }
          ]
        },
        {
          type: 'daterange',
          label: '日期',
          name: 'publishDate',
          value: [date.lastMonthDate(), date.nowDate()]
        },
        {
          type: 'input',
          label: '',
          placeholder: '请输入操作者',
          name: 'searchValue',
          value: ''
        }
      ],
      tableData: [],
      leaveCount: '',
      pagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        total: 9
      }
    };
  },
  created() {
    this.getList();
    this.findEShops();
  },
  mounted() {},
  watch: {},
  methods: {
    operate(name) {
      this[name]();
    },
    refresh() {
      this.getList();
    },
    recharge() {
      this.$router.push({ path: '/operating/service-mgmt/message/recharge' });
    },
    getOrderStatus(row) {
      switch (row.orderStatus) {
        case 'unpaid':
          return '未付款';
        case 'paid':
          return '已付款';
        case 'cancelled':
          return '已取消';
        default:
          break;
      }
    },
    operationSuccess() {
      this.getList();
    },
    findEShops() {
      service.findEShops(
        {},
        data => {
          this.loading = false;
          this.filters[0].options = [{ label: '全部', value: '' }].concat(
            data.shops.map(item => {
              return { label: item.name, value: item.id };
            })
          );
        },
        // result_code 不是100的处理
        ErrorData => {
          console.log(ErrorData);
        }
      );
    },
    getList() {
      let params = {
        searchValue: this.filters[3].value,
        pageNumber: this.pagination.currentPage,
        pageSize: this.pagination.pageSize,
        beginDate: this.filters[2].value[0],
        endDate: this.filters[2].value[1],
        shopId: this.filters[0].value,
        state: this.filters[1].value
      };
      service.listSmsOrder(
        params,
        data => {
          this.loading = false;
          this.tableData = data.dataList;
          this.leaveCount = data.leaveCount;
          // console.log(data);
          this.pagination.total = Number(data.total);
        },
        // result_code 不是100的处理
        ErrorData => {
          console.log(ErrorData);
        }
      );
    },
    cancelOrder(model) {
      service.cancelOrder(
        {
          orderId: model.id,
          shopId: window.top.SHOP_ID || ''
        },
        data => {
          this.$message.success('操作成功');
          this.getList();
          this.loading = false;
        },
        // result_code 不是100的处理
        ErrorData => {
          this.$message.warning(ErrorData.errorMessage);
        }
      );
    },
    // 显示消息提示
    showNotify(msg, type) {
      this.$notify({
        showClose: true,
        message: msg,
        type: type
      });
    },
    rowOperationClickHandler(model, e, column) {},
    paymentMgmt(model) {
      this.$router.push({
        path: '/operating/service-mgmt/message/recharge',
        query: { id: model.id }
      });
    },
    // 状态/店铺名过滤
    filterHandler(value, row, column) {
      const property = column.property;
      if (property === 'isEnabled') {
        return row[property] === value;
      }
    },
    filterDataChange(filters) {
      this.refresh();
    },
    handleSelectionChange(val) {
      this.operations[0].disabled = true;
      if (val.length > 0) {
        this.operations[0].disabled = false;
      }
      this.selections = val;
    },
    rowClick(row) {},
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
.message-mgmt {
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
  .delete-btn {
    color: red;
  }
}
</style>
