<template>
  <div class="interface-log">
    <biz-flex-table ref="table" :loading="loading" :tableData="tableData" :operations="operations" :pagination="pagination" @row-click="rowClick" @selection-change="handleSelectionChange" @size-change="handleSizeChange" @current-change="handleCurrentChange" :filters="filters" @filter-data-change="filterDataChange" @operate="operate"
    :checkable="checkable">
      <el-table-column prop="api" label="接口"></el-table-column>
      <el-table-column prop="result" label="操作结果"></el-table-column>
      <el-table-column prop="reqTime" label="请求时间"></el-table-column>
      <el-table-column prop="respTime" label="响应时间"></el-table-column>
    </biz-flex-table>
    <interface-popup slot="float" :open="openPopup" @close="closePopup" :id="curId" @refreshNotification="refresh"></interface-popup>
  </div>
</template>

<script>
import { BizFlexTable } from '@/components/BizTable';
import InterfacePopup from './InterfacePopup';
import http from '@/common/http';
import urls from '@/common/urls';

export default {
  name: 'interface-log',
  data() {
    return {
      curId: '',
      openPopup: false,
      loading: false,
      selections: [],
      tableData: [],
      operations: [
        {
          label: '刷新',
          name: 'refresh',
          type: ''
        }
      ],
      filters: [
        {
          type: 'select',
          label: '操作结果',
          name: 'searchValue',
          value: '成功',
          options: [
            {
              label: '成功',
              value: '成功'
            },
            {
              label: '失败',
              value: '失败'
            }
          ]
        },
        {
          type: 'daterange',
          label: '时间',
          name: 'selectTime',
          value: [],
          startPlaceholder: '开始时间',
          endPlaceholder: '结束时间'
        },
        {
          type: 'input',
          label: '',
          placeholder: '请输入接口',
          name: 'searchValue',
          value: ''
        }
      ],
      pagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        total: 0
      },
      checkable: false
    };
  },
  props: {},
  components: { BizFlexTable, InterfacePopup },
  watch: {},
  methods: {
    operate(name) {
      this[name]();
    },
    refresh() {
      this.getList();
    },
    delete() {
      if (this.selections && this.selections.length > 0) {
        let ids = [];
        this.selections.forEach(element => {
          ids.push(element.id);
        });
        this.deleteItem(ids);
      } else {
        this.$message('请选择一个分类');
      }
    },
    deleteItem(ids) {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true;
        let param = {
          ids: ids,
          type: '1'
        };
        http
          .delete(urls.systemSetting.logUpdate, param)
          .then(data => {
            console.log(data);
            this.loading = false;
            this.$message.success('删除成功');
            this.refresh();
          })
          .catch(error => {
            this.loading = false;
            this.$message.warning(error.errorMessage);
          })
          .finally(() => {});
      });
    },
    closePopup() {
      this.openPopup = false;
    },
    rowClick(row) {
      this.openPopup = true;
      this.curId = row.id;
    },
    handleSelectionChange(val) {
      console.log('handleSelectionChange');
      this.selections = val;
    },
    handleSizeChange(val) {
      console.log('handleSizeChange');
      this.pagination.pageSize = val;
      this.refresh();
    },
    handleCurrentChange(val) {
      this.pagination.currentPage = val;
      console.log('handleCurrentChange');
      this.refresh();
    },
    filterDataChange() {
      this.pagination.currentPage = 1;
      console.log('filterDataChange');
      this.refresh();
    },
    getList() {
      let params = {
        searchValue: this.filters[2].value,
        beginTimeStr: this.filters[1].value[0],
        endTimeStr: this.filters[1].value[1],
        pageNumber: this.pagination.currentPage,
        pageSize: this.pagination.pageSize,
        result: this.filters[0].value,
        type: '1'
      };

      if (!params.beginTimeStr || !params.endTimeStr) {
        this.$message({
          showClose: true,
          message: '请选择开始时间与截止时间'
        });
        return;
      }

      this.loading = true;
      http
        .get(urls.systemSetting.getLogsList, params)
        .then(data => {
          console.log('接口日志列表', data);
          this.tableData = data.contents;
          this.pagination.pageSize = parseInt(data.pageSize);
          this.pagination.currentPage = parseInt(data.pageNumber);
          this.pagination.total = parseInt(data.total);
          this.loading = false;
        })
        .catch(ErrorData => {
          console.log(ErrorData);
          this.loading = false;
        })
        .finally(() => {});
    }
  },
  created() {
    let today = new Date();
    let time = today.getFullYear() + '-' + parseInt(parseInt(today.getMonth()) + 1) + '-' + today.getDate();
    this.filters[1].value.push(time);
    this.filters[1].value.push(time);
    this.refresh();
  }
};
</script>

<style lang="scss">
.interface-log {
}
</style>
