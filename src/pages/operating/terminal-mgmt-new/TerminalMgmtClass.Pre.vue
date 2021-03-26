<template>
  <div class="terminal-mgmt-class">
    <biz-flex-table ref="table" :operations="operations" :tableData="tableData" :loading="loading" @selection-change="selectionChangeHandler"
      @operate="operateHandler" @row-click="rowOperationClickHandler" :pagination="pagination" @size-change="pageSizeChange"
      @current-change="currentPageChange">
      <template slot="operation">
        <import-file :tableData="importResult" :importLoading="importLoading" :total="total" :disabled="disabled" :count="count"
          :percentage="percentage" @clearTimeOut="clearTimeOut" @restProcess="restProcess" :stepkey="stepkey" :action="'/admin/terminal/importTerminal.jhtml'"
          :name="'uFile'" ref="importFile" @handle-import="handleImport" style="margin-left: 10px;">
          <el-table-column label="编号" width="50" prop="line">
          </el-table-column>
          <el-table-column label="状态" width="150">
            <template slot-scope="scope">
              <span class="imoprt-error-text" :class="{ 'imoprt-success-text': scope.row[scope.row.length - 1] === 'ok' }">{{scope.row[scope.row.length
                - 1] === 'ok' ? '成功' : '失败'}}</span>
            </template>
          </el-table-column>
          <el-table-column label="信息" prop="result">
          </el-table-column>
        </import-file>
      </template>
      <el-table-column prop="name" label="分类名称" min-width="150">
        <template slot-scope="scope">
          <div style="width:100%">
            <div class="overflow">{{scope.row.name}}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="originalName" label="终端标识" min-width="150">
        <template slot-scope="scope">
          <div style="width:100%">
            <div class="overflow">{{scope.row.originalName}}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="styleType" label="终端类型" min-width="100" :formatter="typeConverter">
        <template slot-scope="scope">
          <div style="width:100%">
            <div class="overflow">{{typeConverter(scope.row)}}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="ability" label="终端能力" min-width="220">
        <template slot-scope="scope">
          <div style="width:100%">
            <div class="overflow">{{abilityConverter(scope.row)}}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="tag" label="操作" min-width="100">
        <template slot-scope="scope">
          <!-- <el-button
            type="text"
            size="mini"
            @click="rowOperationClickHandler(scope.row, $event)"
            >
            编辑
          </el-button> -->
          <el-button type="text" size="mini" @click="rowDeleteClickHandler(scope.row, $event)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </biz-flex-table>
    <terminal-class-popup slot="float" :open="open" :itemId="itemId" @close="open = false;" @operationSuccess="operationSuccess"></terminal-class-popup>
  </div>
</template>

<script>
import { BizFlexTable } from '@/components/BizTable';
import { ImportFile } from '@/components/BizUpload';
import http from '@/common/http';
import TerminalClassPopup from './terminal-class/TerminalClassPopup.Pre';

import service from '@/service/terminal-mgmt/TerminalMgmtClass';

const importData = {
  data: {
    importResult: [],
    importLoading: false,
    disabled: false,
    total: 0,
    count: 0,
    t: '',
    percentage: 0,
    stepkey: '',
    pagination: {
      pageSize: 20,
      currentPage: 1,
      pageSizes: [10, 20, 50, 100],
      total: 0
    }
  },
  methods: {
    numberConverter(row) {
      return row[0];
    },
    statusConverter(row) {
      return row.status === '1' ? '启用' : '停用';
    },
    infoConverter(row) {
      return row[row.length - 1] === 'ok' ? '' : row[row.length - 1];
    },
    clearTimeOut() {
      window.clearTimeout(this.t);
    },
    restProcess() {
      this.total = 0;
      this.count = 0;
      this.stepkey = '';
      this.percentage = 0;
    }
  },
  events: {
    handleImport() {
      let url = '/admin/terminal/importProgress.jhtml';
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
    }
  }
};

export default {
  name: 'TerminalMgmtClass',
  components: {
    BizFlexTable,
    TerminalClassPopup,
    ImportFile
  },
  props: {},
  data() {
    return {
      // 控件
      itemId: {},

      // 右侧弹窗
      open: false,

      // Table相关
      loading: false,
      tableData: [],
      selections: [],
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
          label: '模板下载',
          name: 'download',
          type: ''
        }
      ],

      ...importData.data
    };
  },
  methods: {
    typeConverter(row) {
      let result = '';
      switch (row.styleType) {
        case 'intelligent_driving':
          result = '智能驾驶';
          break;
        case 'comfort_control':
          result = '舒适控制';
          break;
        case 'entertainment_information':
          result = '娱乐信息';
          break;
        case 'intelligentaccess':
          result = '智能到店';
          break;
      }

      return result;
    },
    delete() {
      if (this.selections && this.selections.length > 0) {
        let ids = [];
        this.selections.forEach(element => {
          ids.push(element.id);
        });
        this.$confirm('是否确认删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          service.delete(
            {
              ids: ids
            },
            data => {
              this.$message.success('删除成功');
              this.query();
            },
            // result_code 不是100的处理
            ErrorData => {
              this.$message.warning(ErrorData.errorMessage);
            }
          );
        });
      } else {
        this.$message('请选择一个终端');
      }
    },
    selectionChangeHandler(val) {
      this.selections = val;
      this.operations[1].disabled = true;
      if (val.length > 0) {
        this.operations[1].disabled = false;
      }
    },
    operationSuccess() {
      this.open = false;
      this.query();
    },
    operateHandler(name) {
      this[name]();
    },
    pageSizeChange(val) {
      this.pagination.pageSize = val;
      this.pagination.currentPage = 1;
      this.query();
    },
    currentPageChange(val) {
      this.pagination.currentPage = val;
      this.query();
    },
    rowOperationClickHandler(model, e, column) {
      this.itemId = { id: model.id };
      this.open = true;
    },
    rowDeleteClickHandler(model, e, column) {
      e.stopPropagation();

      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        service.delete(
          {
            ids: [model.id]
          },
          data => {
            this.$message.success('删除成功');
            this.query();
          },
          // result_code 不是100的处理
          ErrorData => {
            this.$message.warning(ErrorData.errorMessage);
          }
        );
      });
    },

    query() {
      this.loading = true;
      service.query(
        {
          pageNumber: this.pagination.currentPage,
          pageSize: this.pagination.pageSize
        },
        data => {
          this.tableData = data.data;
          this.pagination.total = Number(data.total);
          this.loading = false;
        },
        // result_code 不是100的处理
        ErrorData => {
          console.log(ErrorData);
          console.log('code错误');
          this.loading = false;
        }
      );
    },
    add() {
      this.open = true;
      this.itemId = { id: '' };
    },
    download() {
      window.open('/upload/mode/V服爱车_终端设备导入模板.xlsx');
    },
    abilityConverter(row) {
      let abilityList = [];
      row.ability.forEach(item => {
        abilityList.push(item.name);
      });

      return abilityList.join(', ');
    },

    ...importData.methods,
    ...importData.events
  },
  created() {
    this.query();
  }
};
</script>

<style lang="scss">
</style>
