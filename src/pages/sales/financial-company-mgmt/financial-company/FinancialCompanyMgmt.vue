<template>
  <div class="financial-company-mgmt">
    <biz-flex-table ref="table" :operations="operations" :tableData="tableData" :loading="loading" :pagination="pagination"
      @operate="handleOperate" @size-change="handlePageSizeChange" @current-change="handleCurrentPageChange" @selection-change="handleSelectionChange"
      @filter-data-change="handleFilterDataChange" @row-click="handleRowClick">
      <el-table-column prop="name" label="金融机构名称" min-width="150">
      </el-table-column>
      <el-table-column label="机构类型" min-width="80">
        <template slot-scope="scope">
          {{scope.row.type === '0' ? '金融' : '保险'}}
        </template>
      </el-table-column>
      <el-table-column prop="mobile" label="电话" min-width="100">
      </el-table-column>
      <el-table-column prop="address" label="地址" min-width="200">
      </el-table-column>
      <el-table-column label="操作" min-width="50">
        <template slot-scope="scope">
          <el-button type="text" size="mini" @click="handleStopClick($event, scope.row)">
            {{scope.row.isEnabled==='1'?'停用':'启用'}}
          </el-button>
          <el-button type="text" size="mini" @click="handleDeleteClick($event, scope.row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </biz-flex-table>
    <!-- <div slot="float">
      <right-popup :open="open" :itemId="itemId" @close="open = false;" @operationSuccess="handleOperationSuccess"></right-popup>
    </div> -->
    <el-dialog :visible.sync="dialogTableVisible" append-to-body title="基本信息" custom-class="f-dialog">
      <finacial-company-baseInfo :itemId="itemId" @operationSuccess="handleOperationSuccess"></finacial-company-baseInfo>
    </el-dialog>
  </div>
</template>

<script>
import { BizFlexTable } from '@/components/BizTable';
// import RightPopup from './FinancialCompanyMgmt/FinancialCompanyPopup';
import FinacialCompanyBaseInfo from './FinancialCompanyMgmt/FinacialCompanyBaseInfo';
// import { finacialProgramMgmt as service } from '@/common/urls';
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
  dialogTableVisible: false,
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
      pageNumber: this.pagination.currentPage
    };
  },
  getKpi() {
    http
      .get('/admin/financialInstitution/queryFinancialInstitutionCount.jhtml', { shopId: window.top.SHOP_ID || '' })
      .then(data => {
        this.$message({
          customClass: 'motorists-club-activity__kpi',
          showClose: true,
          message: `已创建金融机构${data.createdCount}个`,
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
      .get('/admin/financialInstitution/queryFinancialInstitutionList.jhtml', this.getQueryParams())
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
        .delete('/admin/financialInstitution/deleteFinancialInstitution.jhtml', { ids: ids, shopId: window.top.SHOP_ID || '' })
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
    this.defaultTab = '0';
    this.dialogTableVisible = true;
    this.itemId = { id: '' };
  }
};

// 事件
const events = {
  handleOperationSuccess(id) {
    this.itemId = { id: id };
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
  handleFilterDataChange() {
    this.query();
  },
  handleRowClick(model, e, column) {
    this.defaultTab = '0';
    this.itemId = { id: String(model.id) };
    this.dialogTableVisible = true;
  },

  handleStopClick(e, model) {
    e.stopPropagation();
    this.$confirm('是否确认执行此操作?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      this.loading = true;
      let isEnabled = '';
      if (model.isEnabled === '0') {
        isEnabled = '1';
      } else {
        isEnabled = '0';
      }
      let params = {
        isEnabled: isEnabled,
        id: model.id
      };
      http
        .post('/admin/financialInstitution/enableFinancialInstitution.jhtml', params)
        .then(data => {
          this.$message.success('操作成功');
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
  handleDeleteClick(e, model) {
    e.stopPropagation();

    this.deleteItem([model.id]);
  }
};

export default {
  name: 'FinacialProgramMgmt',
  components: {
    BizFlexTable,
    // RightPopup
    FinacialCompanyBaseInfo
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
    this.getKpi();
  }
};
</script>

<style lang="scss">
  .f-dialog {
    .el-dialog__body {
      height: 500px;
    }
  }
</style>
