<template>
  <div class="key-word-template">
    <biz-flex-table
      ref="table"
      :operations="operations"
      :filters="filters"
      :tableData="tableData"
      :loading="loading"
      :pagination="pagination"
      @operate="handleOperate"
      @size-change="handlePageSizeChange"
      @current-change="handleCurrentPageChange"
      @selection-change="handleSelectionChange"
      @filter-data-change="handleFilterDataChange"
      @row-click="handleRowClick"
    >
      <template slot="operation">
        <import-file
          :tableData="importResult"
          :importLoading="importLoading"
          :total="total"
          :disabled="disabled"
          :count="count"
          :percentage="percentage"
          @clearTimeOut="clearTimeOut"
          @restProcess="restProcess"
          :stepkey="stepkey"
          :action="'/admin/keyword/importKeyword.jhtml'"
          :name="'uFile'"
          ref="importFile"
          @handle-import="handleImport"
          style="margin-left: 10px;"
        >
          <el-table-column label="编号" prop="line" width="50"></el-table-column>
          <el-table-column label="消息" prop="result"></el-table-column>
        </import-file>
      </template>
      <el-table-column label="关键词包" prop="name"></el-table-column>
      <el-table-column label="关键词举例">
        <template slot-scope="scope">
          <template v-for="(keyword,index) in scope.row.keywords">
            {{keyword.name}}
            <template v-if="index < scope.row.keywords.length - 1">{{separator}}</template>
          </template>
        </template>
      </el-table-column>
      <el-table-column label="关键词个数">
        <template slot-scope="scope" v-if="scope.row.keywords">{{getKeyWordNumber(scope.row.keywords)}}</template>
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
import RightPopup from './KeyWordPopup';
import http from '@/common/http';
import { mapGetters } from 'vuex';
import { ImportFile } from '@/components/BizUpload';

// 基础属性
const dataBase = {
  // 控件
  itemId: { id: '' },
  selections: [],
  separator: ',',

  // 右侧弹窗
  open: false
};
// Table相关
const dataTable = {
  loading: false,
  tableData: [],
  importResult: [],
  importLoading: false,
  disabled: false,
  total: 0,
  count: 0,
  t: '',
  percentage: 0,
  stepkey: '',
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
    },
    {
      label: '模板下载',
      name: 'downloadTemplate',
      type: ''
    }
  ],
  filters: [
    {
      type: 'input',
      label: '',
      placeholder: '请输入关键词包名称',
      name: 'searchValue',
      value: ''
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
      store: this.getUser().shop.id || window.top.SHOP_ID,
      pageSize: this.pagination.pageSize,
      pageNumber: this.pagination.currentPage,
      searchValue: this.filters[0].value
    };
  },
  downloadTemplate() {
    window.open('/upload/mode/V服爱车_关键词导入版.xlsx');
  },
  clearTimeOut() {
    window.clearTimeout(this.t);
  },
  restProcess() {
    this.total = 0;
    this.count = 0;
    this.stepkey = '';
    this.percentage = 0;
  },
  handleImport() {
    let url = '/admin/keyword/importProgress.jhtml';
    http
      .get(url, {})
      .then(data => {
        if (!data.data.total) {
          this.total = 0;
          this.count = 0;
          this.stepkey = '';
          this.percentage = 0;
        }
        if (data.data.total) {
          this.total = Number(data.data.total || 0);
          this.count = Number(data.data.count || 0);
          this.stepkey = data.data.remark;
          this.percentage = Number(data.data.rate);
          this.$refs.importFile.title = data.data.title;
        }
        if (data.data && data.data.rate && data.data.rate === '100') {
          this.clearTimeOut();
          this.$refs.importFile.showCurrentInfo = false;
          this.$refs.importFile.title = '导入完成';
          this.refresh();
          if (data.data && data.data.results && data.data.results.length > 0) {
            this.importResult = data.data.results;
            this.$refs.importFile.uploadingVisible = false;
            this.$refs.importFile.importingVisible = true;
          }
          this.disabled = false;
        } else if (data.data && data.data.rate && data.data.rate !== '100') {
          if (this.t) {
            this.clearTimeOut();
          }
          this.t = setTimeout(this.handleImport, 2000);
          this.$refs.importFile.uploadingVisible = true;
          this.$refs.importFile.showCurrentInfo = true;
          this.disabled = true;
        }
      })
      .catch(errData => {
        console.log(errData);
        console.log('code错误');
      });
  },
  getKeyWordNumber(keywords) {
    return keywords.length;
  },
  query() {
    this.loading = true;
    http
      .get('/admin/keyword/keywords.jhtml', this.getQueryParams())
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
        .delete('/admin/keyword/keyword.jhtml', { ids: ids })
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
    this.operations[1].disabled = true;
    if (val.length > 0) {
      this.operations[1].disabled = false;
    }
  },
  handleFilterDataChange() {
    this.query();
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
  name: 'KeyWordTemplate',
  components: {
    BizFlexTable,
    RightPopup,
    ImportFile
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
    // this.handleImport();
  }
};
</script>

<style lang="scss">
</style>
