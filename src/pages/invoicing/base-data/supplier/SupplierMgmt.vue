<template>
  <div class="supplier-mgmt">
    <biz-flex-table ref="table" :operations="operations" :filters="filters" :tableData="tableData" :loading="loading"
      :pagination="pagination" @operate="handleOperate" @size-change="handlePageSizeChange"
      @current-change="handleCurrentPageChange" @selection-change="handleSelectionChange"
      @filter-data-change="handleFilterDataChange" @row-click="handleRowClick">
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
          :action="'/admin/cooperationInfo/importSupplier.jhtml'"
          :name="'uFile'"
          ref="importFile"
          @handle-import="handleImport"
          style="margin-left: 10px;"
        >
          <el-table-column label="编号" width="50" prop="line"></el-table-column>
          <el-table-column label="结果" prop="result"></el-table-column>
        </import-file>
      </template>
      <el-table-column label="供应商" prop="name">
        <template slot-scope="scope">
          <div>
            <div>名称：{{scope.row.name}}</div>
            <div>地址：{{scope.row.address!==''?scope.row.address:'--'}}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="联系信息" prop="address">
        <template slot-scope="scope">
          <div>
            <div>联系人：{{scope.row.contact!==''?scope.row.contact:'--'}}</div>
            <div>电话：{{scope.row.phone!==''?scope.row.phone:'--'}}</div>
            <div>邮箱：{{scope.row.email!==''?scope.row.email:'--'}}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="tag" label="操作" width="130">
        <template slot-scope="scope">
          <el-button type="text" size="mini" v-if="hasAuthAdmin" @click.stop="handleAdmin($event, scope.row)">管理员设置</el-button>
          <el-button type="text" size="mini" v-if="hasAuthDel" @click.stop="handleDeleteClick($event, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </biz-flex-table>
    <div slot="float">
      <right-popup :open="open" :itemId="itemId" :isEdit="isEdit" @close="open = false;" @operationSuccess="handleOperationSuccess"></right-popup>
      <biz-popup-tabs :open="openPlatform" @close="openPlatform = false;" v-model="tabName">
        <el-tab-pane label="选择平台门店" name="1">
          <supplier-platform-info :itemId="itemId" ref="platform" @operationSuccess="handleOperationSuccess">
          </supplier-platform-info>
        </el-tab-pane>
        <el-tab-pane label="添加非平台门店" name="2">
          <supplier-unplatform-info :itemId="itemId" ref="unplatform" @operationSuccess="handleOperationSuccess">
          </supplier-unplatform-info>
        </el-tab-pane>
      </biz-popup-tabs>
    </div>
    <export-file-new ref="exportFile" :percentage="percentage" @clearTimeOut="clearTimeOut" @exportExcle="exportExcle"></export-file-new>
  </div>
</template>

<script>
import { BizFlexTable } from '@/components/BizTable';
import { ImportFile } from '@/components/BizUpload';
import RightPopup from './SupplierPopup';
import { BizPopupTabs } from '@/components/BizPopup';
import SupplierPlatformInfo from './SupplierPlatformInfo';
import { ExportFileNew } from '@/components/BizUpload';
import SupplierUnplatformInfo from './SupplierUnplatformInfo';
import axios from 'axios';
import urls from '@/common/urls';
import http from '@/common/http';
import { mapGetters } from 'vuex';

// 基础属性
const dataBase = {
  stepkey: '',
  taskId: '',
  t: '',
  percentage: 0,
  disabled: false,
  count: 0,
  total: 0,
  importResult: [],
  importLoading: false,
  successCount: 0,
  failCount: 0,
  // 控件
  itemId: { id: '' },
  selections: [],
  isEdit: true,

  // 右侧弹窗
  open: false,
  openPlatform: false
};
// Table相关
const dataTable = {
  loading: false,
  tableData: [],
  tabName: '1',
  operations: [
    {
      label: '新增',
      name: 'add',
      type: 'primary',
      auth: ['admin:Supplier.add']
    },
    {
      label: '删除',
      name: 'delete',
      type: '',
      disabled: true,
      auth: ['admin:Supplier.delete']
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
      placeholder: '请输入供应商名称',
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
      shopId: window.top.SHOP_ID || '',
      cooperationType: '0',
      pageSize: this.pagination.pageSize,
      pageNumber: this.pagination.currentPage,
      searchValue: this.filters[0].value,
      state: ''
    };
  },
  download() {
    window.open('/upload/mode/V服爱车_供应商导入模板.xlsx');
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
    let url = '/admin/cooperationInfo/supplier/importProgress.jhtml';
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
      cooperationType: '0',
      pageSize: this.pagination.pageSize,
      pageNumber: this.pagination.currentPage,
      searchValue: this.filters[0].value,
      state: ''
    };
    http
      .post('/admin/cooperationInfo/supplier/exportSupplierListStart.jhtml', params)
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
      let response = await axios.get('/admin/cooperationInfo/supplier/exportSupplierListResult.jhtml?taskId=' + this.taskId, { responseType: 'blob' });
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
      .get(urls.invoicing.supplierMgmt.shopSupplierList, this.getQueryParams())
      .then(data => {
        this.loading = false;
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
  queryKpi() {
    let params = {
      shopId: window.top.SHOP_ID || '',
      cooperationType: '0'
    };
    http
      .get('/admin/cooperationInfo/queryCooperationInfoKpi.jhtml', params)
      .then(data => {
        this.$message({
          customClass: 'motorists-club-activity__kpi',
          showClose: true,
          message: `维护供应商数据。已有供应商${data.data.count}个`,
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
        .delete(urls.invoicing.supplierMgmt.shopSupplier, { ids: ids })
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
    this.tabName = '1';
    this.$refs.platform.clearSearchValue();
    this.$refs.platform.getList();
    this.$refs.unplatform.restForm();
    this.isEdit = true;
    this.openPlatform = true;
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
    this.itemId = { id: String(model.id) };
    this.isEdit = true;
    this.open = true;
  },

  handleDeleteClick(e, model) {
    e.stopPropagation();

    this.deleteItem([model.id]);
  },
  handleAdmin(e, model) {
    this.$router.push({ path: this.$route.fullPath + '/admin-setting', query: { cooperationId: model.id } });
  }
};

export default {
  name: 'SupplierMgmt',
  components: {
    BizFlexTable,
    RightPopup,
    BizPopupTabs,
    SupplierPlatformInfo,
    SupplierUnplatformInfo,
    ImportFile,
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
  computed: {
    ...mapGetters('Authority', ['currentAuth']),
    hasAuthDel() {
      return this.currentAuth.includes('admin:Supplier.delete');
      // return true;
    },
    hasAuthAdmin() {
      return this.currentAuth.includes('admin:Supplier.usermanage');
      // return true;
    }
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
.supplier-mgmt {
  .biz-popup .popup-content {
    width: 600px;
  }
}
</style>
