<template>
  <biz-grid class="agent-mgmt">
    <biz-header slot="top" :operations="operations" :filters="filters" @operate="handleOperate"
      @filter-data-change="handleFilterDataChange">
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
          :action="'/admin/invoicing/stock/depot/import.jhtml'"
          :name="'uFile'"
          ref="importFile"
          @handle-import="handleImport"
          style="margin-left: 10px;"
        >
          <el-table-column label="编号" width="50" prop="line"></el-table-column>
          <el-table-column label="结果" prop="result"></el-table-column>
        </import-file>
      </template>
    </biz-header>
    <expand-table ref="expandTable" :data="tableData" :loading="loading" @expand-change="expandChange" @delete="handleDeleteClick"
      @row-click="handleRowClick" @handleAdmin="handleAdmin" @handleAgent="handleAgent" :isSearch="isSearch"
      style="height:95%;min-height:95%"></expand-table>
    <biz-pagination :pagination="pagination"></biz-pagination>
    <div slot="float">
      <!-- <right-popup :open="open" :itemId="itemId" @close="open = false;" @created="refresh" @operationSuccess="handleOperationSuccess"></right-popup> -->
      <biz-popup-tabs :open="open" @close="open = false;" v-model="tabSection">
        <el-tab-pane label="基本信息" name="baseinfo">
          <agent-base-info :itemId="itemId" :parentId="parentId" :parentName="parentName" :grade="grade"
            @operationSuccess="handleOperationSuccess" ref="base"></agent-base-info>
        </el-tab-pane>
        <el-tab-pane label="管理员" name="admininfo" v-if="itemId.id">
          <admin-info :itemId="itemId" @operationSuccess="handleOperationSuccess" ref="admininfo"></admin-info>
        </el-tab-pane>
      </biz-popup-tabs>
    </div>
    <export-file-new ref="exportFile" :percentage="percentage" @clearTimeOut="clearTimeOut" @exportExcle="exportExcle"></export-file-new>
  </biz-grid>
</template>

<script>
// import { BizFlexTable } from '@/components/BizTable';
// import RightPopup from './AgentPopup';
import { ImportFile } from '@/components/BizUpload';
import { BizGrid } from '@/components/BizGrid';
import { BizHeader, BizPagination } from '@/components/BizTable';
import { BizPopupTabs } from '@/components/BizPopup';
import AgentBaseInfo from './AgentBaseInfo';
import AdminInfo from './AdminInfo';
import ExpandTable from './components/ExpandTable';
import urls from '@/common/urls';
import http from '@/common/http';
import { mapGetters } from 'vuex';
import axios from 'axios';
import { ExportFileNew } from '@/components/BizUpload';

// 基础属性
const dataBase = {
  stepkey: '',
  taskId: '',
  t: '',
  percentage: 0,
  disabled: false,
  count: 0,
  total: 0,
  tagCatrgoryId: '',
  importResult: [],
  importLoading: false,
  successCount: 0,
  failCount: 0,
  // 控件
  itemId: { id: '' },
  parentId: '',
  parentName: '',
  grade: '',
  selections: [],
  // 右侧弹窗
  open: false,
  openPlatform: false
};
// Table相关
const dataTable = {
  loading: false,
  tableData: [],
  isSearch: true,
  currentRow: {},
  tabName: '1',
  pagination: {
    pageSize: 1000,
    pageSizes: [1000],
    currentPage: 1,
    total: 9
  },
  tabSection: 'baseinfo',
  operations: [
    {
      label: '新增',
      name: 'add',
      type: 'primary',
      auth: ['admin:agent.add']
    },
    {
      label: '刷新',
      name: 'refresh',
      type: ''
    },
    {
      label: '模板下载',
      name: 'download',
      type: ''
    },
    {
      label: '导出',
      name: 'exportStart',
      type: ''
    }
  ],
  filters: [
    {
      type: 'input',
      label: '',
      placeholder: '请输入仓库名称',
      name: 'searchValue',
      value: ''
    }
  ]
};

// 方法
const methods = {
  expandChange(row) {
    this.currentRow = row;
    this.query(row);
  },
  // 查询
  getQueryParams() {
    return {
      shopId: window.top.SHOP_ID || '',
      searchValue: this.filters[0].value,
      pageNumber: '1'
    };
  },
  download() {
    window.open('/upload/mode/V服爱车_仓库导入模板.xlsx');
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
    let url = '/admin/invoicing/stock/depot/importProgress.jhtml';
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
          this.$refs.importFile.uploadingVisible = true;

          if (data.data && data.data.results && data.data.results.length > 0) {
            this.importResult = data.data.results;
            this.$refs.importFile.uploadingVisible = false;
            this.$refs.importFile.importingVisible = true;
            this.getList();
          }
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
  exportStart() {
    let ids = [];
    if (this.selections && this.selections.length > 0) {
      this.selections.forEach(element => {
        ids.push(element.productId);
      });
    }
    let params = {
      ids: ids,
      shopId: window.top.SHOP_ID || this.getUser().shop.id,
      searchValue: this.filters[0].value,
      pageSize: this.pagination.pageSize,
      pageNumber: this.pagination.currentPage
    };
    http
      .post('/admin/invoicing/stock/depot/exportDepotListStart.jhtml', params)
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
      let response = await axios.get('/admin/invoicing/stock/depot/exportDepotListResult.jhtml?taskId=' + this.taskId, { responseType: 'blob' });
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
      .get(url, { taskId: taskId })
      .then(data => {
        if (!data.data.rate) {
          this.percentage = 0;
        }
        if (data.data.rate) {
          this.percentage = Number(data.data.rate);
        }
        this.$refs.exportFile.uploadingVisible = true;
        if (data.data && data.data.rate && data.data.rate === '100') {
          this.clearTimeOut();
          this.$refs.exportFile.title = '导出完成';
        } else if ((data.data && data.data.rate && data.data.rate !== '100') || !data.data.rate) {
          if (this.t) {
            this.clearTimeOut();
          }
          this.t = setTimeout(this.getProcess(taskId), 2000);
        }
      })
      .catch(errData => {
        console.log(errData);
        console.log('code错误');
      });
  },
  query() {
    this.loading = true;
    http
      .get('/admin/invoicing/stock/depotTree.jhtml', this.getQueryParams())
      .then(data => {
        this.loading = false;
        this.tableData = data.dataList;
        for (const iterator of this.tableData) {
          if (iterator.children.length > 0) {
            iterator.hasChild = '1';
            for (const item of iterator.children) {
              item.parentName = iterator.name;
              if (item.children.length > 0) {
                item.hasChild = '1';
                for (const list of item.children) {
                  list.parentName = item.name;
                }
              }
            }
          }
        }
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
  queryKpi() {
    let params = {
      shopId: window.top.SHOP_ID || '',
      cooperationType: '1'
    };
    http
      .get('/admin/invoicing/stock/queryShopDepotsKpi.jhtml', params)
      .then(data => {
        this.$message({
          customClass: 'motorists-club-activity__kpi',
          showClose: true,
          message: `维护仓库数据。已有仓库${data.data.currentDepotCount}个`,
          duration: 3000
        });
      })
      .catch(ErrorData => {
        this.$message.warning(ErrorData.errorMessage);
        console.log('ERR_REFRESH: ', ErrorData);
      })
      .finally(data => {
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
        .delete(urls.invoicing.storeHouseMgmt.shopDepot, { ids: ids })
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
    this.itemId = { id: '' };
    this.grade = '';
    this.parentId = '';
    this.parentName = '';
    this.tabName = '1';
    this.open = true;
  }
};

// 事件
const events = {
  handleOperationSuccess(val) {
    this.itemId = { id: String(val) };
    this.query();
  },

  handleOperate(name) {
    this[name]();
  },
  handleFilterDataChange() {
    this.query();
  },
  handleRowClick(model, e, column) {
    this.parentId = model.parentId;
    this.parentName = model.parentName;
    this.grade = model.grade;
    this.tabSection = 'baseinfo';
    this.itemId = { id: String(model.id) };
    this.open = true;
    this.$nextTick(() => {
      this.$refs.admininfo.getList();
    });
  },

  handleDeleteClick(e, model) {
    e.stopPropagation();

    this.deleteItem([model.id]);
  },
  handleAdmin(e, model) {
    this.$router.push({ path: this.$route.fullPath + '/admin-setting', query: { cooperationId: model.id } });
  },
  handleAgent(e, model) {
    this.itemId = { id: '' };
    this.parentId = model.id;
    this.parentName = model.name;
    this.grade = model.grade;
    this.tabName = 'baseinfo';
    this.$nextTick(() => {
      this.open = true;
    });
  }
};

export default {
  name: 'AgentMgmt',
  components: {
    BizHeader,
    BizGrid,
    BizPopupTabs,
    AgentBaseInfo,
    ExpandTable,
    ImportFile,
    BizPagination,
    AdminInfo,
    ExportFileNew
  },
  props: {},
  beforeDestroy() {
    if (this.t) {
      // 如果定时器还在运行 或者直接关闭，不用判断
      window.clearTimeout(this.t); // 关闭
    }
  },
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
    this.queryKpi();
  }
};
</script>

<style lang="scss">
.agent-mgmt {
  .biz-popup .popup-content {
    // width: 700px;
  }
  .biz-input {
    position: absolute;
    top: 20px;
    right: 5px;
  }
  .biz-cascader {
    width: 150px;
  }
  .biz-table-filter {
    margin-top: 10px;
  }
  .noexpand {
    .el-table__expand-icon {
      visibility: hidden;
    }
  }

  .first-name {
    .el-table__expand-icon {
      display: none;
    }
  }
  .biz-pagination .el-pagination {
    .el-pagination__sizes {
      display: none;
    }
    .el-pagination__jump {
      display: none;
    }
  }
}
</style>
