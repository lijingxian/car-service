<template>
  <div class="potential-customer-mgmt__callback-alert">
    <biz-flex-table
      ref="table"
      :pagination="pagination"
      :tableData="tableData"
      :loading="loading"
      :checkable="false"

      @size-change="handlePageSizeChange"
      @current-change="handleCurrentPageChange"
      @row-click="handleRowClick"
    >
      <el-table-column label="提醒日期" prop="alarmDate" :formatter="alertDateConverter">
      </el-table-column>
      <el-table-column label="提醒类型" prop="reasonType" :formatter="typeConverter">
      </el-table-column>
      <el-table-column label="是否处理" prop="isProcessed" :formatter="processedConverter">
      </el-table-column>
      <el-table-column label="回访日期" prop="visitDate" :formatter="callbackDateConverter">
      </el-table-column>
      <el-table-column
        prop="tag"
        label="操作"
        width="50">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="mini"
            @click="handleCallbackClick($event, scope.row)"
            >
            回访
          </el-button>
        </template>
      </el-table-column>
    </biz-flex-table>
  </div>
</template>

<script>
import { BizFlexTable } from '@/components/BizTable';

import { potentialCustomerMgmt } from '@/common/urls';
import http from '@/common/http';
import dateUtil from '@/utils/date';

const methods4Out = {
  updateHeight () {
    setTimeout(() => {
      this.$refs.table.doHeight();
    }, 100);
  }
};

const dataBase = {
  data: {

  },
  methods: {
    getQueryParams () {
      return {
        shopId: window.top.SHOP_ID || '',

        potentialConsumerId: this.itemId.id,

        pageSize: this.pagination.pageSize,
        pageNumber: this.pagination.currentPage
      };
    },
    query () {
      this.loading = true;

      http.get(potentialCustomerMgmt.callbackAlert.list, this.getQueryParams())
        .then(data => {
          this.tableData = data.data;

          this.$set(this.pagination, 'total', Number.parseInt(data.total));
        })
        .catch(errData => {
          console.log(errData);
          console.log('code错误');
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(() => {
          this.loading = false;
        });
    }
  },
  events: {

  }
};

// Table相关
const dataTable = {
  data: {
    loading: false,
    tableData: [],
    pagination: {
      pageSize: 20,
      currentPage: 1,
      total: 0
    }
  },
  methods: {
    alertDateConverter (row) {
      if (row.alarmDate) {
        let date = new Date(row.alarmDate);
        return dateUtil.dateConverter(date);
      } else {
        return '--';
      }
    },
    typeConverter (row) {
      let map = {
        alarm: '提醒回访',
        sale: '交车回访',
        insurance: '首保回访'
      };

      return map[row.reasonType];
    },
    processedConverter (row) {
      if (row.isProcessed) return '是';
      else return '否';
    },
    callbackDateConverter (row) {
      if (row.visitDate) {
        row.visitDate = row.visitDate.replace(/-/g, '/');
        let date = new Date(row.visitDate);
        return dateUtil.dateConverter(date);
      } else {
        return '--';
      }
    }
  },
  events: {
    handlePageSizeChange (val) {
      this.pagination.pageSize = val;
      this.pagination.currentPage = 1;
      this.query();
    },
    handleCurrentPageChange (val) {
      this.pagination.currentPage = val;
      this.query();
    },
    handleCallbackClick (e, row) {
      this.handleRowClick(row);
    },
    handleRowClick (row) {
      this.$emit('operationSuccess', row);
    }
  }
};

export default {
  name: 'PotentialCustomerCallbackAlert',
  components: {
    BizFlexTable
  },
  props: {
    itemId: {
      type: Object,
      default () {
        return {
          id: ''
        };
      }
    }
  },
  data () {
    return {
      ...dataTable.data
    };
  },
  methods: {
    ...methods4Out,

    ...dataBase.methods,
    ...dataBase.events,

    ...dataTable.methods,
    ...dataTable.events
  },
  watch: {
    itemId (nVal, oVal) {
      if (nVal.id) {
        this.query();
      }
    }
  },
  created () {
    if (this.itemId.id) this.query();
  }
};
</script>

<style lang="scss">
.potential-customer-mgmt__callback-alert {
  padding-top: 20px;
}
</style>
