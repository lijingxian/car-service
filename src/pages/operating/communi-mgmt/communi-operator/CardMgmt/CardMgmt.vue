<template>
  <div class="communi-operator">
    <biz-flex-table :operations="operations" :loading="loading" :tableData="currentTableData" :pagination="pagination" :filters="filters"
      @filter-data-change="filterDataChange" @operate="operate" @selection-change="handleSelectionChange" @row-click="rowClick"
      @size-change="handleSizeChange" @current-change="handleCurrentChange">
      <!-- 上传 -->
      <template slot="operation">
        <import-file :tableData="importResult" :importLoading="importLoading" :total="total" :disabled="disabled" :count="count"
          :percentage="percentage" @clearTimeOut="clearTimeOut" @restProcess="restProcess" :stepkey="stepkey" :action="'/admin/rechargeCard/importRechargeCard.jhtml'"
          :name="'uFile'" ref="importFile" @handle-import="handleImport" style="margin-left: 10px;">
          <el-table-column label="卡号" prop="number"></el-table-column>
          <el-table-column label="卡密" prop="code"></el-table-column>
          <el-table-column label="运营商套餐编号" prop="sn"></el-table-column>
          <el-table-column label="电信运营商" prop="name"></el-table-column>
          <el-table-column label="结果" prop="result"></el-table-column>
        </import-file>
      </template>
      <!-- 表格内容 -->
      <el-table-column prop="number" label="卡号"></el-table-column>
      <el-table-column prop="code" label="卡密"></el-table-column>
      <el-table-column prop="orderSn" label="订单号"></el-table-column>
      <el-table-column prop="state" label="状态">
        <template slot-scope="scope">
          <span :style="{color: stateColor(scope.row)}">{{scope.row.state === '0' ? '未使用' : '已使用'}}</span>
        </template>
      </el-table-column>
    </biz-flex-table>
    <!-- 侧边弹出栏 -->
    <biz-popup-tabs :open="open" @close="open = false" v-model="tabName">
      <el-tab-pane label="卡密信息" name="first">
        <base-info :item="currentRow"></base-info>
      </el-tab-pane>
    </biz-popup-tabs>
  </div>
</template>

<script>
import { BizFlexTable } from '@/components/BizTable';
import { BizPopupTabs } from '@/components/BizPopup';
import { ImportFile } from '@/components/BizUpload';
import BaseInfo from './BaseInfo';
import { mapGetters } from 'vuex';
import http from '@/common/http';
import service from '@/service/communi-mgmt/communiOperator';

export default {
  name: 'CommuniCardMgmt',
  data() {
    return {
      // 上传Start
      action: '/admin/rechargeCard/import.jhtml',
      importResult: [],
      importLoading: false,
      disabled: false,
      total: 0,
      count: 0,
      t: '',
      percentage: 0,
      stepkey: '',
      // 上传End
      currentRow: {
        code: '',
        id: '',
        number: '',
        state: ''
      },
      operations: [
        { label: '新增', name: 'add', type: 'primary' },
        { label: '删除', name: 'del', type: '', disabled: true },
        { label: '模板下载', name: 'download', type: '' }
      ],
      filters: [
        {
          label: '状态',
          type: 'select',
          placeholder: '请选择状态',
          value: '',
          options: [{ label: '全部', value: '' }, { label: '未使用', value: '0' }, { label: '已使用', value: '1' }]
        }
      ],
      loading: false,
      tableData: [],
      multiSelected: [],
      pagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        // 总条目数
        total: 0
      },
      // 侧栏
      open: false,
      tabName: 'first'
    };
  },
  components: {
    BizFlexTable,
    BizPopupTabs,
    ImportFile,
    BaseInfo
  },
  methods: {
    operate(name) {
      this[name]();
    },
    add() {
      this.currentRow = {
        code: '',
        id: '',
        number: '',
        state: ''
      };
      this.tabName = 'first';
      this.open = true;
    },
    stateColor(row) {
      if (row.state === '1') {
        return '#11AE17';
      } else {
        return '#FF7300';
      }
    },
    // 删除
    del(id) {
      let ids = id ? Array(id) : this.multiSelected.length === 0 ? [] : this.multiSelected;
      if (ids.length === 0) {
        this.$message.warning('未选择删除条目');
        return;
      }
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let params = {
          ids: ids
        };
        this.loading = true;
        service.deleteCardBaseInfo(
          params,
          data => {
            this.loading = false;
            this.$message.success('操作成功');
            this.refresh();
          },
          ErrorData => {
            this.loading = false;
            this.$message.warning(ErrorData.errorMessage);
          }
        );
      });
    },
    download() {
      window.open('/upload/mode/V服爱车_卡密导入模板.xlsx');
    },
    filterDataChange(val) {
      this.refresh();
    },
    handleSelectionChange(selectedItems) {
      this.operations[1].disabled = true;
      if (selectedItems.length > 0) {
        this.operations[1].disabled = false;
      }
      this.multiSelected = selectedItems.map(row => {
        return row.id;
      });
    },
    rowClick(row) {
      this.currentRow = row;
      this.tabName = 'first';
      this.open = true;
    },
    handleSizeChange(pageSize) {
      this.pagination.pageSize = pageSize;
      this.refresh();
    },
    handleCurrentChange(pageNumber) {
      this.pagination.currentPage = pageNumber;
      this.refresh();
    },
    refresh() {
      this.loading = true;
      let params = {
        rechargePackageId: this.currentPackage.packageId,
        state: this.filters[0].value,
        pageNumber: this.pagination.currentPage,
        pageSize: this.pagination.pageSize
      };
      service.queryCardList(
        params,
        data => {
          this.loading = false;
          this.pagination.total = Number(data.total);
          this.tableData = data.content;
        },
        ErrorData => {
          this.loading = false;
          console.log('ERR_REFRESH: ', ErrorData);
          this.$message.warning(ErrorData.errorMessage);
        }
      );
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
      let url = '/admin/rechargeCard/importProgress.jhtml';
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
    },
    showMessage(msg, type) {
      this.$message({
        message: msg,
        type: type,
        showClose: true
      });
    }
  },
  mounted() {
    this.refresh();
  },
  computed: {
    ...mapGetters('CommunicationCard', ['currentPackage']),
    currentTableData() {
      return this.tableData.slice(
        (this.pagination.currentPage - 1) * this.pagination.pageSize,
        this.pagination.currentPage * this.pagination.pageSize
      );
    }
  },
  watch: {
    open(newVal, oldVal) {
      if (!newVal) {
        this.refresh();
      }
    }
  }
};
</script>

<style lang="scss">
</style>
