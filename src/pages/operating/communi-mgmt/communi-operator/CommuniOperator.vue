<template>
  <div class="communi-operator">
    <biz-flex-table
      :operations="operations"
      :loading="loading"
      :tableData="tableData"
      :pagination="pagination"
      @operate="operate"
      @selection-change="handleSelectionChange"
      @row-click="rowClick"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    >
      <!-- 表格内容 -->
      <el-table-column prop="name" label="运营商" min-width="220">
        <template slot-scope="scope">
          <div style="width:100%">
            <div class="overflow">
              名称：{{scope.row.name}}
            </div>
            <div class="overflow">
              电话：{{scope.row.phone}}
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="telephoneCount" label="话费包"></el-table-column>
      <el-table-column prop="flowCount" label="流量包"></el-table-column>
      <el-table-column prop="simCount" label="通讯卡数量"></el-table-column>
      <el-table-column prop="options" label="操作" width="100">
        <template slot-scope="scope">
          <el-button type="text" @click.stop="del(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </biz-flex-table>
    <!-- 侧边弹出栏 -->
    <biz-popup-tabs :open="open" @close="open = false" v-model="tabName">
      <el-tab-pane label="运营商信息" name="first">
        <base-info :itemId="currentRowId"></base-info>
      </el-tab-pane>
      <el-tab-pane label="话费包" name="second" v-if="currentRowId.id">
        <recharge-package :itemId="currentRowId" :itemName="currentRowName"></recharge-package>
      </el-tab-pane>
      <el-tab-pane label="流量包" name="third" v-if="currentRowId.id">
        <flow-package :itemId="currentRowId" :itemName="currentRowName"></flow-package>
      </el-tab-pane>
    </biz-popup-tabs>
  </div>
</template>

<script>
import { BizFlexTable } from '@/components/BizTable';
import { BizPopupTabs } from '@/components/BizPopup';
import BaseInfo from './BaseInfo';
import RechargePackage from './RechargePackage';
import FlowPackage from './FlowPackage';
import http from '@/common/http';
import service from '@/service/communi-mgmt/communiOperator';

export default {
  name: 'CommuniOperator',
  data () {
    return {
      currentRowId: { id: '' },
      currentRowName: '',
      operations: [
        { label: '新增', name: 'add', type: 'primary' },
        { label: '删除', name: 'del', type: '', disabled: true },
        { label: '刷新', name: 'refresh', type: '' }
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
    BaseInfo,
    RechargePackage,
    FlowPackage
  },
  methods: {
    getKpi() {
      http
        .get('/admin/telecomOperator/navigation.jhtml', {
          shopId: window.top.shopId
        })
        .then(data => {
          this.showMessage(
            `共有运营商${data.data.companyCount}张`,
            'info'
          );
        })
        .catch(errData => {
          console.log(errData);
          console.log('code错误');
        });
    },
    operate(name) {
      this[name]();
    },
    add() {
      this.currentRowId = { id: '' };
      this.currentRowName = '';
      this.tabName = 'first';
      this.open = true;
    },
    // 删除
    del(id) {
      let ids = id ? Array(id) : (this.multiSelected.length === 0 ? [] : this.multiSelected);
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
        service.deleteBaseInfo(
          params,
          data => {
            this.loading = false;
            this.$message.success('操作成功');
            this.refresh();
          },
          ErrorData => {
            this.loading = false;
            this.$message.warning(ErrorData.errorMessage);
          });
      });
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
      this.currentRowId = { id: row.id };
      this.currentRowName = row.name;
      this.tabName = 'first';
      this.open = true;
    },
    handleSizeChange(pageSize) {
      this.pagination.pageSize = pageSize;
    },
    handleCurrentChange(pageNumber) {
      this.pagination.currentPage = pageNumber;
    },
    refresh() {
      this.loading = true;
      let params = {
        pageNumber: this.pagination.currentPage,
        pageSize: this.pagination.pageSize
      };
      service.queryList(
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
    this.getKpi();
  },
  computed: {
    currentTableData() {
      return this.tableData.slice((this.pagination.currentPage - 1) * this.pagination.pageSize, this.pagination.currentPage * this.pagination.pageSize);
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
.communi-operator {
  // .overflow {
  //   text-overflow: ellipsis;
  //   overflow: hidden;
  //   width: 100%;
  //   white-space: nowrap;
  // }
}
</style>
