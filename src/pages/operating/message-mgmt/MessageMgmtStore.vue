<template>
  <biz-grid class="message-mgmt">
    <div slot="top" class="message-mgmt-header">
      当前剩余短信数：{{leaveCount}}
      <el-button size="small" type="primary" @click="recharge">充值</el-button>
    </div>
    <biz-flex-table ref="table" :operations="operations" @operate="operate" :filters="filters" @filter-data-change="filterDataChange" :tableData="tableData"
      :loading="loading" :pagination="pagination" @selection-change="handleSelectionChange" @row-click="rowClick" @size-change="handleSizeChange"
      @current-change="handleCurrentChange">
      <el-table-column width="200" prop="name" label="使用情况">
      </el-table-column>
      <el-table-column prop="count" label="用量">
      </el-table-column>
      <el-table-column prop="shop.name" label="店铺">
        <template slot-scope="scope">
          <span type="text" @click.stop="showShopInfo(scope.row.shop)" class="shop-name">
            {{ scope.row.shop.name }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="operator.name" label="操作者">
      </el-table-column>
      <el-table-column min-width="150" prop="createDate" label="操作时间" width="160">
      </el-table-column>
    </biz-flex-table>
    <biz-popup-tabs :open="open" value="first" @close="open = false;">
      <el-tab-pane label="基本信息" name="first">
        <shop-info :item-id="selectedShopId.id"></shop-info>
      </el-tab-pane>
    </biz-popup-tabs>
  </biz-grid>
</template>

<script>
import { BizFlexTable } from '@/components/BizTable';
import { BizGrid } from '@/components/BizGrid';
import { BizPopupTabs } from '@/components/BizPopup';
import ShopInfo from './ShopInfo';
import service from '@/service/message-mgmt/messageMgmt';
import date from '@/utils/date';

export default {
  name: 'MessageMgmtSys',
  components: {
    BizFlexTable,
    BizGrid,
    BizPopupTabs,
    ShopInfo
  },
  data() {
    return {
      tabName: 'IncreaseFee',
      itemId: '',
      open: false,
      loading: false,
      selections: [],
      operations: [],
      filters: [
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
      selectedShopId: { id: '' },
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
    operationSuccess() {
      this.getList();
    },
    // 显示店铺基本信息
    showShopInfo(row) {
      this.selectedShopId = { id: row.id };
      this.open = true;
    },
    getList() {
      let params = {
        searchValue: this.filters[1].value,
        pageNumber: this.pagination.currentPage,
        pageSize: this.pagination.pageSize,
        beginDate: this.filters[0].value[0],
        endDate: this.filters[0].value[1],
        shopId: window.top.SHOP_ID || ''
      };
      service.listSmsRecord(
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
    rowOperationClickHandler(model, e, column) {},
    adminMgmt(model) {
      this.$router.push({
        path: '/oa/staff-mgmt/admin',
        query: { parentId: model.id, type: model.userType }
      });
    },
    recharge() {
      this.$router.push({ path: '/operating/service-mgmt/message/recharge', query: {} });
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
  .shop-name {
    color: #ff7300;
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
