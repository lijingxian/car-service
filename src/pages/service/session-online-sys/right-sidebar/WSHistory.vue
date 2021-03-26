<template>
  <biz-grid class="w-s-history">
    <biz-table-body :pagination="pagination"
                    :tableData="tableData"
                    height="420"
                    @handleSizeChange="handleSizeChange"
                    @handleCurrentChange="handleCurrentChange">
      <el-table-column width="170"
                       prop="number"
                       label="工单号">
      </el-table-column>
      <el-table-column :formatter="workSheetType"
                       label="工单类型">
      </el-table-column>
      <el-table-column :formatter="getState"
                       label="状态">
      </el-table-column>
      <el-table-column prop="sponsor.nickname"
                       label="受理人">
      </el-table-column>
    </biz-table-body>
  </biz-grid>
</template>

<script>
import { BizTableBody } from '@/components/BizTable';
import { BizGrid } from '@/components/BizGrid';
import service from '@/service/customer-service/workSheetMgmt.js';

export default {
  name: 'WSHistory',
  data() {
    return {
      tableData: [],
      pagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        total: 9
      },
      filters: [
        {
          type: 'input',
          placeholder: '请输入关键字',
          name: 'searchbar',
          value: ''
        }
      ]
    };
  },
  props: {},
  components: {
    BizGrid,
    BizTableBody
  },
  watch: {},
  mounted() {
    this.refresh();
  },
  methods: {
    refresh() {
      this.getList();
    },
    getList() {
      let params = {
        pageSize: this.pagination.pageSize,
        pageNumber: this.pagination.currentPage,
        searchValue: this.filters[0].value
      };
      service.queryList(
        params,
        data => {
          this.tableData = data.content;
          this.pagination.total = Number(data.total);
        },
        ErrorData => {
          console.log('ERR_REFRESH: ', ErrorData);
        }
      );
    },
    handleSizeChange(val) {
      this.pagination.pageSize = val;
      this.refresh();
    },
    handleCurrentChange(val) {
      this.pagination.currentPage = val;
      this.refresh();
    }, // 类型
    workSheetType(row) {
      switch (row.type) {
        case '0':
          return '售前';
        case '1':
          return '售后';
        case '2':
          return '问题反馈';
        case '3':
          return '投诉';
        case '4':
          return '拉黑';
      }
    },
    // 状态
    getState(row) {
      switch (row.state) {
        case '0':
          return '待受理';
        case '1':
          return '受理中';
        case '2':
          return '已完成';
        default:
          return '待受理';
      }
    }
  }
};
</script>

<style lang="scss">
.w-s-history {
  .biz-grid__content {
    margin-top: 15px;
  }
  .el-pagination {
    .btn-next,
    .btn-prev {
      padding: 0;
    }
    .el-pagination__sizes {
      margin: 0;
    }
    .el-pagination__jump {
      margin: 0;
    }
    .el-input .el-input__inner {
      padding-right: 8px !important;
    }
  }
}
</style>
