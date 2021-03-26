<template>
  <biz-grid class="platform-account-mgmt">
    <biz-flex-table
      ref="table"
      @operate="operate"
      :filters="filters"
      :tableData="tableData"
      :loading="loading"
      :pagination="pagination"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      @filter-data-change="handleFilterDataChange"
      @row-click="handleRowClick"
    >
      <el-table-column prop="shop.name" label="店铺"></el-table-column>
      <el-table-column prop="shop.address" label="地址"></el-table-column>
      <el-table-column prop="balance" label="账户余额">
        <template slot-scope="scope">￥{{ scope.row.balance }}</template>
      </el-table-column>
      <el-table-column prop="availableAmount" label="可用余额">
        <template slot-scope="scope">￥{{ scope.row.availableAmount }}</template>
      </el-table-column>
    </biz-flex-table>
    <div slot="float">
      <biz-popup-tabs :open="open" @close="open = false;" v-model="tabName">
        <el-tab-pane label="账户充值信息" name="first">
          <shop-recharge :itemId="itemId" @operationSuccess="operationSuccess"></shop-recharge>
        </el-tab-pane>
      </biz-popup-tabs>
    </div>
  </biz-grid>
</template>

<script>
import { BizFlexTable } from '@/components/BizTable';
import { BizGrid } from '@/components/BizGrid';
import { BizPopupTabs } from '@/components/BizPopup';
import ShopRecharge from './ShopRecharge';
import http from '@/common/http';

export default {
  name: 'PlatformAccountMgmt',
  components: {
    BizFlexTable,
    BizGrid,
    BizPopupTabs,
    ShopRecharge
  },
  data() {
    return {
      tabName: 'first',
      itemId: '',
      open: false,
      loading: false,
      tableData: [],
      pagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        total: 9
      },
      filters: [
        {
          type: 'input',
          label: '',
          placeholder: '请输入店铺名称',
          name: 'searchValue',
          value: ''
        }
      ]
    };
  },
  created() {
    this.getList();
    this.queryKPI();
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
    getList() {
      let params = {
        pageNumber: this.pagination.currentPage,
        pageSize: this.pagination.pageSize,
        searchValue: this.filters[0].value
      };
      http
        .get('/admin/account/list.jhtml', params)
        .then(data => {
          this.tableData = data.dataList;
          this.pagination.total = Number(data.total);
          this.loading = false;
        })
        .catch(errData => {
          this.loading = false;
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    queryKPI() {
      http
        .get('/admin/account/kpi.jhtml', {})
        .then(data => {
          this.$message({
            customClass: 'motorists-club-activity__kpi',
            showClose: true,
            message: `账户余额${data.sumBalance}元，其中可用余额${data.sumAvailableAmount}元`,
            duration: 3000
          });
        })
        .catch(errData => {
          console.log(errData);
          console.log('code错误');
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        });
    },
    handleRowClick(model, e, column) {
      this.itemId = model.id;
      this.open = true;
    },
    handleSizeChange(val) {
      this.pagination.pageSize = val;
      this.refresh();
    },
    handleCurrentChange(val) {
      this.pagination.currentPage = val;
      this.refresh();
    },
    handleFilterDataChange() {
      this.pagination.currentPage = 1;
      this.refresh();
    }
  }
};
</script>

<style lang="scss">
.platform-account-mgmt {
  .message-mgmt-header {
    padding: 20px 0px 10px 20px;
  }
}
</style>
