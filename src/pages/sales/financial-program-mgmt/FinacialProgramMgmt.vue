<template>
  <div class="financial-program-mgmt">
    <biz-flex-table ref="table" :operations="operations" :filters="filters" :tableData="tableData" :loading="loading"
      :pagination="pagination" @operate="handleOperate" @size-change="handlePageSizeChange"
      @current-change="handleCurrentPageChange" @selection-change="handleSelectionChange"
      @filter-data-change="handleFilterDataChange" @row-click="handleRowClick">
      <el-table-column prop="name" label="方案名称" min-width="300">
      </el-table-column>
      <el-table-column prop="downPayment" label="首付比例" min-width="80">
        <template slot-scope="scope">
          {{scope.row.downPayment}}%
        </template>
      </el-table-column>
      <el-table-column prop="counterFee" label="手续费" min-width="100">
      </el-table-column>
      <el-table-column prop="minLimit" label="额度下限" min-width="100">
      </el-table-column>
      <el-table-column prop="maxLimit" label="额度上限" min-width="100">
      </el-table-column>
      <el-table-column prop="cities" label="支持省市" min-width="250" :formatter="cityConverter">
      </el-table-column>
      <el-table-column prop="tag" label="操作" min-width="50">
        <template slot-scope="scope" v-if="hasAuthDel">
          <el-button type="text" size="mini" @click="handleDeleteClick($event, scope.row)">
            删除
          </el-button>
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
import RightPopup from './FinacialProgramMgmt/FinacialProgramPopup';

import { finacialProgramMgmt as service } from '@/common/urls';
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
      type: 'primary',
      auth: ['admin:finnancialPlan.add']
    },
    {
      label: '删除',
      name: 'delete',
      type: '',
      disabled: true,
      auth: ['admin:finnancialPlan.delete']
    },
    {
      label: '刷新',
      name: 'refresh',
      type: ''
    }
  ],
  filters: [
    {
      type: 'input',
      label: '',
      placeholder: '请输入方案名称',
      name: 'searchValue',
      value: ''
    }
  ],
  pagination: {
    pageSize: 20,
    currentPage: 1,
    total: 0
  },
  sortInfo: {}
};

// 方法
const methods = {
  // 查询
  getQueryParams() {
    return {
      shopId: window.top.SHOP_ID || '',

      pageSize: this.pagination.pageSize,
      pageNumber: this.pagination.currentPage,

      searchValue: this.filters[0].value
    };
  },
  getKpi() {
    http
      .get('/admin/customer/queryDayKpi.jhtml', { shopId: window.top.SHOP_ID || '' })
      .then(data => {
        this.$message({
          customClass: 'motorists-club-activity__kpi',
          showClose: true,
          message: `已创建金融方案${data.planCount}个`,
          duration: 3000
        });
      })
      .catch(ErrorData => {
        this.$message.warning(ErrorData.errorMessage || '操作出现错误');
      });
  },
  query() {
    this.loading = true;

    http
      .get(service.mainPage.list, this.getQueryParams())
      .then(data => {
        this.tableData = data.content;

        this.$set(this.pagination, 'total', Number.parseInt(data.total));
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
        .delete(service.mainPage.financialPlan, { ids: ids })
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

  cityConverter(row) {
    return row.cities.join(', ');
  },

  // 添加
  add() {
    this.defaultTab = '0';
    this.open = true;
    this.itemId = { id: '' };
  }
};

// 事件
const events = {
  handleOperationSuccess() {
    this.open = false;
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
    this.operations.map(item => {
      if (item.name === 'delete') {
        item.disabled = true;
      }
    });
    if (val.length > 0) {
      this.operations.map(item => {
        if (item.name === 'delete') {
          item.disabled = false;
        }
      });
    }
  },
  handleFilterDataChange() {
    this.query();
  },
  handleRowClick(model, e, column) {
    this.defaultTab = '0';
    this.itemId = { id: String(model.id) };
    this.open = true;
  },

  handleDeleteClick(e, model) {
    e.stopPropagation();

    this.deleteItem([model.id]);
  }
};

export default {
  name: 'FinacialProgramMgmt',
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
  computed: {
    ...mapGetters('Authority', ['currentAuth']),
    hasAuthDel() {
      // return true;
      return this.currentAuth.includes('admin:finnancialPlan.delete');
    }
  },
  methods: {
    ...mapGetters(['getUser']),

    ...methods,
    ...events
  },
  created() {
    this.query();
    this.getKpi();
  }
};
</script>

<style lang="scss">
</style>
