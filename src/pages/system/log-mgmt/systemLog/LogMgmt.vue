<template>
  <div class="log-mgmt">
    <biz-flex-table ref="table" :loading="loading" :operations="operations" :tableData="tableData" :pagination="pagination" @row-click="rowClick" @selection-change="handleSelectionChange" @size-change="handleSizeChange" @current-change="handleCurrentChange" :filters="filters" @filter-data-change="filterDataChange" @operate="operate"
    :checkable="checkable">
      <el-table-column prop="operation" label="操作"></el-table-column>
      <el-table-column prop="operator" label="操作用户"></el-table-column>
      <el-table-column prop="ip" label="IP"></el-table-column>
      <el-table-column prop="result" label="操作结果"></el-table-column>
      <el-table-column prop="createDate" label="时间"></el-table-column>
    </biz-flex-table>
    <log-mgmt-popup slot="float" :open="openPopup" @close="closePopup" :id="id4Popup" @refreshNotification="refresh"></log-mgmt-popup>
  </div>
</template>

<script>
import { BizFlexTable } from '@/components/BizTable';
import LogMgmtPopup from './LogMgmtPopup';
import http from '@/common/http';
import urls from '@/common/urls';

export default {
  name: 'LogMgmt',
  data() {
    return {
      loading: false,
      id4Popup: '',
      openPopup: false,
      multipleSelection: [],
      selections: [],
      tableData: [],
      pagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        total: 0
      },
      filters: [
        {
          type: 'select',
          label: '操作结果',
          name: 'operateResultValue',
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
          placeholder: '请输入操作/操作用户',
          name: 'searchValue',
          value: ''
        }
      ],
      operations: [
        {
          label: '刷新',
          name: 'refresh',
          type: ''
        }
      ],
      checkable: false
    };
  },
  components: {
    BizFlexTable,
    LogMgmtPopup
  },
  created() {
    let today = new Date();
    let time = today.getFullYear() + '-' + parseInt(parseInt(today.getMonth()) + 1) + '-' + today.getDate();
    this.filters[1].value.push(time);
    this.filters[1].value.push(time);
    this.refresh();
  },
  methods: {
    operate(name) {
      this[name]();
    },
    refresh() {
      this.getList();
    },
    getList() {
      let params = {
        searchValue: this.filters[2].value,
        beginTimeStr: this.filters[1].value[0],
        endTimeStr: this.filters[1].value[1],
        pageNumber: this.pagination.currentPage.toString(),
        pageSize: this.pagination.pageSize.toString(),
        result: this.filters[0].value,
        type: '0'
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
          console.log('系统日志列表', data);
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
    handleSelectionChange(val) {
      this.selections = val;
    },
    handleSizeChange(val) {
      this.pagination.pageSize = val;
      this.refresh();
    },
    handleCurrentChange(val) {
      this.pagination.currentPage = val;
      this.refresh();
    },
    rowClick(row) {
      this.openPopup = true;
      this.id4Popup = row.id;
    },
    closePopup() {
      this.openPopup = false;
    },
    filterDataChange(filters) {
      this.pagination.currentPage = 1;
      this.refresh();
    }
  }
};
</script>

<style lang="scss">
.log-mgmt {
  .biz-customcol {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    .el-button {
      margin-right: 10px;
    }
  }
  .delete-btn {
    color: red;
  }
  .selection-column {
    text-align: center;
  }
}
</style>
