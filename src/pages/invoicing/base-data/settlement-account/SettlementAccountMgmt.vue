<template>
  <div class="settlement-account-mgmt">
    <biz-flex-table
      ref="table"
      :operations="operations"
      :tableData="tableData"
      :loading="loading"
      :pagination="pagination"
      @operate="handleOperate"
      @size-change="handlePageSizeChange"
      @current-change="handleCurrentPageChange"
      @selection-change="handleSelectionChange"
      @row-click="handleRowClick"
    >
      <el-table-column label="账户名称" prop="name"></el-table-column>
      <el-table-column label="编号" prop="accountNum"></el-table-column>
      <el-table-column label="当前余额" prop="currentAmount"></el-table-column>
      <el-table-column label="是否默认" prop="isDefault">
        <template slot-scope="scope">
          <span :style="{color: stateColor(scope.row)}">{{scope.row.isDefault==='1'?'√':'X'}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="tag" label="操作" width="130">
        <template slot-scope="scope">
          <el-button type="text" size="mini" @click="handleDeleteClick($event, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </biz-flex-table>
    <div slot="float">
      <right-popup :open="open" :itemId="itemId" @close="open = false;" @operationSuccess="handleOperationSuccess"></right-popup>
    </div>
  </div>
</template>

<script>
import { BizFlexTable } from '@/components/BizTable';
import RightPopup from './SettlementAccountPopup';
import urls from '@/common/urls';
import http from '@/common/http';
import { mapGetters } from 'vuex';

// 基础属性
const dataBase = {
  // 控件
  itemId: { id: '' },
  selections: [],

  // 右侧弹窗
  open: false
};
// Table相关
const dataTable = {
  loading: false,
  tableData: [],
  operations: [
    {
      label: '新增',
      name: 'add',
      type: 'primary'
    },
    {
      label: '删除',
      name: 'delete',
      type: '',
      disabled: true
    },
    {
      label: '刷新',
      name: 'refresh',
      type: ''
    }
  ],
  pagination: {
    pageSize: 20,
    currentPage: 1,
    pageSizes: [10, 20, 50, 100],
    total: 0
  }
};

// 方法
const methods = {
  // 查询
  getQueryParams() {
    return {
      shopId: window.top.SHOP_ID || '',
      pageSize: this.pagination.pageSize,
      pageNumber: this.pagination.currentPage
    };
  },
  query() {
    this.loading = true;
    http
      .get(urls.invoicing.settlementAccountMgmt.shopAccountList, this.getQueryParams())
      .then(data => {
        this.tableData = data.dataList;
        this.pagination.total = Number(data.total);
      })
      .catch(errData => {
        console.log(errData);
        console.log('code错误');
        if (errData.errorMessage) this.$message.warning(errData.errorMessage);
      })
      .finally(() => {
        this.loading = false;
      });
  },
  refresh() {
    this.query();
  },

  // 删除
  deleteItem(ids) {
    this.$confirm('是否确认删除?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      this.loading = true;
      http
        .delete(urls.invoicing.settlementAccountMgmt.shopAccount, { ids: ids })
        .then(data => {
          this.$message.success('删除成功');
          this.query();
        })
        .catch(errData => {
          console.log(errData);
          console.log('code错误');
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(() => {
          this.loading = false;
        });
    });
  },
  delete() {
    if (this.selections && this.selections.length > 0) {
      let ids = [];
      this.selections.forEach(element => {
        ids.push(element.id);
      });
      this.deleteItem(ids);
    } else {
      this.$message('请选择一条数据');
    }
  },

  // 添加
  add() {
    this.open = true;
    this.itemId = { id: '' };
  }
};

// 事件
const events = {
  handleOperationSuccess(val) {
    this.itemId.id = String(val);
    this.query();
  },

  handleOperate(name) {
    this[name]();
  },
  handlePageSizeChange(val) {
    this.pagination.pageSize = val;
    this.pagination.currentPage = 1;
    this.query();
  },
  handleCurrentPageChange(val) {
    this.pagination.currentPage = val;
    this.query();
  },
  handleSelectionChange(val) {
    this.selections = val;
    this.operations[1].disabled = true;
    if (val.length > 0) {
      this.operations[1].disabled = false;
    }
  },
  stateColor(row) {
    if (row.isDefault === '1') {
      return '#11AE17';
    } else {
      return '#FF7300';
    }
  },
  handleRowClick(model, e, column) {
    this.itemId = { id: String(model.id) };
    this.open = true;
  },

  handleDeleteClick(e, model) {
    e.stopPropagation();

    this.deleteItem([model.id]);
  }
};

export default {
  name: 'SettlementAccountMgmt',
  components: {
    BizFlexTable,
    RightPopup
  },
  props: {},
  data() {
    return {
      ...dataBase,
      ...dataTable
    };
  },
  methods: {
    ...mapGetters(['getUser']),

    ...methods,
    ...events
  },
  created() {
    this.query();
  }
};
</script>

<style lang="scss">
</style>
