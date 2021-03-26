<template>
  <biz-grid class="message-mgmt">
    <div slot="top" class="message-mgmt-header">
      当前剩余短信数：{{leaveCount}}
      <el-button size="small" type="primary" @click="open = true;">续增</el-button>
    </div>
    <biz-flex-table ref="table" :operations="operations" @operate="operate" :filters="filters" @filter-data-change="filterDataChange"
      :tableData="tableData" :loading="loading" :pagination="pagination" @selection-change="handleSelectionChange" @row-click="rowClick"
      @size-change="handleSizeChange" @current-change="handleCurrentChange">
      <el-table-column width="200" prop="name" label="使用情况">
      </el-table-column>
      <el-table-column prop="count" label="用量">
      </el-table-column>
      <el-table-column prop="shop.name" label="店铺">
        <template slot-scope="scope">
          <el-button type="text" @click.stop="showShopInfo(scope.row.shop)">
            {{ scope.row.shop.name }}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column prop="operator.name" label="操作者">
      </el-table-column>
      <el-table-column min-width="150" prop="createDate" label="操作时间" width="160">
      </el-table-column>
    </biz-flex-table>
    <biz-popup-tabs :open="open" v-model="tabName" @close="open = false;">
      <el-tab-pane label="续增信息" name="first">
        <IncreaseFee @operationSuccess="operationSuccess">
        </IncreaseFee>
      </el-tab-pane>
    </biz-popup-tabs>
    <biz-popup-tabs :open="openShopInfo" v-model="tabName" @close="openShopInfo = false;">
      <el-tab-pane label="基本信息" name="first">
        <shop-info :item-id="selectedShopId.id"></shop-info>
      </el-tab-pane>
    </biz-popup-tabs>
  </biz-grid>
</template>

<script>
import { BizPopupTabs } from '@/components/BizPopup';
import { BizFlexTable } from '@/components/BizTable';
import { BizGrid } from '@/components/BizGrid';
import IncreaseFee from './message/IncreaseFee';
import ShopInfo from './ShopInfo';
import service from '@/service/message-mgmt/messageMgmt';
import date from '@/utils/date';

export default {
  name: 'MessageMgmtSys',
  components: {
    BizPopupTabs,
    BizFlexTable,
    BizGrid,
    IncreaseFee,
    ShopInfo
  },
  data() {
    return {
      tabName: 'first',
      itemId: '',
      open: false,
      openShopInfo: false,
      selectedShopId: { id: '' },
      loading: false,
      selections: [],
      operations: [],
      filters: [
        {
          type: 'select',
          label: '使用情况',
          name: 'name',
          value: '',
          options: []
        },
        {
          type: 'select',
          label: '店铺',
          name: 'shopId',
          value: '',
          options: []
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
          placeholder: '请输入操作者名称',
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
    this.init();
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
      if (!row.id) return;
      this.selectedShopId = { id: row.id };
      this.openShopInfo = true;
    },
    init() {
      let params = {
        shopId: window.top.SHOP_ID || ''
      };
      service.init(
        params,
        data => {
          this.loading = false;
          this.filters[0].options = [{ label: '全部', value: '' }].concat(
            data.nameList
          );
          this.filters[1].options = [{ label: '全部', value: '' }].concat(
            data.shopList
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
        shopId: window.top.SHOP_ID || this.filters[1].value,
        beginDate: this.filters[2].value[0],
        endDate: this.filters[2].value[1],
        name: this.filters[0].value
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
