<template>
  <div class="logistics-mgmt">
    <biz-flex-table
      :operations="operations"
      :loading="loading"
      :tableData="tableData"
      :pagination="pagination"
      :filters="filters"
      @filter-data-change="filterDataChange"
      @operate="operate"
      @selection-change="handleSelectionChange"
      @row-click="rowClick"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    >
      <!-- 表格内容 -->
      <el-table-column prop="name" label="物流公司"></el-table-column>
      <el-table-column prop="code" label="代码">
        <template slot-scope="scope">
          {{scope.row.code||'--'}}
        </template>
      </el-table-column>
      <el-table-column prop="url" label="网址">
        <template slot-scope="scope">
          {{scope.row.url||'--'}}
        </template>
      </el-table-column>
      <!-- <el-table-column prop="sort" label="排序"></el-table-column> -->
      <el-table-column width="110" prop="date" label="操作">
        <div slot-scope="scope">
          <div class="biz-customcol">
            <el-button type="text" size="mini" @click.stop="deleteLog(scope.row)">删除</el-button>
          </div>
        </div>
      </el-table-column>
    </biz-flex-table>
    <!-- 侧边弹出栏 -->
    <biz-popup-tabs :open="open" @close="open = false" v-model="tabName">
      <el-tab-pane label="基本信息" name="first">
        <base-info :itemId="currentRowId" @update="isUpdate = true"></base-info>
      </el-tab-pane>
    </biz-popup-tabs>
  </div>
</template>

<script>
import { BizFlexTable } from '@/components/BizTable';
import { BizPopupTabs } from '@/components/BizPopup';
import BaseInfo from './BaseInfo';
import { logisticsMgmt } from '@/common/urls';
import http from '@/common/http';

export default {
  name: 'LogisticsMgmt',
  data() {
    return {
      // 导出
      exportFile: false,
      currentRowId: { id: '' },
      operations: [
        { label: '新增', name: 'add', type: 'primary' },
        { label: '删除', name: 'del', type: '', disabled: true },
        { label: '刷新', name: 'refresh', type: '' }
      ],
      filters: [
        {
          type: 'input',
          value: '',
          placeholder: '请输入名称'
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
      // 侧栏更新后刷新
      isUpdate: false,
      tabName: 'first'
    };
  },
  components: {
    BizFlexTable,
    BizPopupTabs,
    BaseInfo
  },
  methods: {
    operate(name) {
      this[name]();
    },
    // 添加
    add() {
      this.currentRowId = { id: '' };
      this.open = true;
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
        http
          .post(logisticsMgmt.logistics.delete, params)
          .then(data => {
            this.loading = false;
            this.$message.success('删除成功');
            this.refresh();
          })
          .catch(ErrorData => {
            this.loading = false;
            this.$message.warning(ErrorData.errorMessage);
          });
      });
    },
    // 快捷删除
    deleteLog(row) {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let params = {
          ids: [row.id]
        };
        this.loading = true;
        http
          .post(logisticsMgmt.logistics.delete, params)
          .then(data => {
            this.loading = false;
            this.$message.success('删除成功');
            this.refresh();
          })
          .catch(ErrorData => {
            this.loading = false;
            this.$message.warning(ErrorData.errorMessage);
          });
      });
    },
    filterDataChange(value) {
      this.filters = value;
      this.refresh();
    },
    handleSelectionChange(selectedItems) {
      this.multiSelected = selectedItems.map(row => {
        return row.id;
      });
      this.operations[1].disabled = true;
      if (selectedItems.length > 0) {
        this.operations[1].disabled = false;
      }
    },
    rowClick(row) {
      this.currentRowId = { id: row.id };
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
        shopId: window.top.SHOP_ID || '',
        pageNumber: this.pagination.currentPage,
        pageSize: this.pagination.pageSize,
        searchValue: this.filters[0].value
      };
      http
        .get(logisticsMgmt.logistics.queryList, params)
        .then(data => {
          this.loading = false;
          this.pagination.total = Number(data.total);
          this.tableData = data.content;
        })
        .catch(ErrorData => {
          this.loading = false;
          console.log('ERR_REFRESH: ', ErrorData);
          this.$message.warning(ErrorData.errorMessage);
        });
    },
    showMessage(msg, type) {
      this.$message({
        message: msg,
        type: type,
        showClose: true
      });
    },
    // 页面提示语
    queryInfo() {
      let params = {
        type: 'deliveryCorp'
      };
      http
        .get(logisticsMgmt.logistics.queryInfo, params)
        .then(data => {
          this.$message({
            customClass: 'motorists-club-activity__kpi',
            showClose: true,
            message: `您可在此处管理合作物流公司，已有合作物流公司${data.data.deliveryCorp}家`,
            duration: 3000
          });
        })
        .catch();
    }
  },
  mounted() {
    this.queryInfo();
    this.refresh();
  },
  computed: {},
  watch: {
    open(newVal, oldVal) {
      if (!newVal && this.isUpdate) {
        this.refresh();
        this.isUpdate = false;
      }
    }
  }
};
</script>

<style lang="scss">
</style>
