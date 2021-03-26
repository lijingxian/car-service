<template>
  <div class="reception-static">
    <!-- <div class="search-property">
      <el-radio-group v-model="date" @change="dateSwich(date)" size="mini">
        <el-radio-button label="day">本日</el-radio-button>
        <el-radio-button label="week">本周</el-radio-button>
        <el-radio-button label="month">本月</el-radio-button>
        <el-radio-button label="quarter">本季</el-radio-button>
        <el-radio-button label="year">半年</el-radio-button>
      </el-radio-group>
      <el-date-picker type="daterange" v-model="defaultDate" size="mini" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"
        value-format="yyyy-MM-dd" @change="dateChange">
      </el-date-picker>
      <el-radio-group v-model="viewType" @change="queryType(viewType)" size="mini">
        <el-radio-button label="day">按日</el-radio-button>
        <el-radio-button label="week">按周</el-radio-button>
        <el-radio-button label="month">按月</el-radio-button>
      </el-radio-group>
      <el-button type="primary" size="mini" @click="exportExcle">导出</el-button>
    </div> -->
    <biz-flex-table ref="table" :operations="operations" :filters="filters" @filter-data-change="filterDataChange" :tableData="tableData" :loading="loading" :pagination="pagination"
      @row-click="rowClick" @size-change="handleSizeChange" @current-change="handleCurrentChange">
      <el-table-column width="200" prop="name" label="机器人">
      </el-table-column>
      <el-table-column prop="peopleCount" label="接待人数">
      </el-table-column>
      <el-table-column prop="memberCount" label="接待会员数">
      </el-table-column>
      <!-- <el-table-column prop="orderCount" label="订单人数">
      </el-table-column> -->
      <el-table-column prop="time" label="接待时长">
        <div slot-scope="scope">
          {{scope.row.time}}min
        </div>
      </el-table-column>
    </biz-flex-table>
  </div>
</template>

<script>
import { BizFlexTable } from '@/components/BizTable';
import http from '@/common/http';
import { customerService } from '@/common/urls';
import dateTime from '@/utils/dateTime';
export default {
  name: 'ReceptionStatic',
  data() {
    return {
      tabName: 'info',
      date: 'month',
      viewType: 'month',
      loading: false,
      selections: [],
      tableData: [],
      operations: [],
      pagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        total: 0
      },
      filters: [
        {
          type: 'daterange',
          label: '日期',
          name: 'publishDate',
          value: [dateTime.today(), dateTime.today()]
        }
      ]
    };
  },
  components: {
    BizFlexTable
  },
  created() {
    this.getList();
  },
  mounted() {},
  watch: {
    $route(nweVal, oldVal) {
      this.getList();
    }
  },
  methods: {
    operate(name) {
      this[name]();
    },
    refresh() {
      this.getList();
    },
    operationSuccess() {
      this.getList();
    },
    exportExcle() {},
    dateChange() {
      this.getList();
    },
    queryType(type) {
      this.viewType = type;
      this.getList();
    },
    rowClick(model, e, column) {},
    getList() {
      let params = {
        beginDate: this.filters[0].value[0],
        endDate: this.filters[0].value[1],
        pageNumber: this.pagination.currentPage,
        pageSize: this.pagination.pageSize,
        shopId: window.top.SHOP_ID || ''
      };
      http
        .get(customerService.smartReception.robotKpi, params)
        .then(data => {
          this.tableData = data.data;
          this.pagination.total = Number(data.total);
        })
        .catch(errData => {
          console.log(errData);
          console.log('code错误');
          if (errData.errorMessage) {
            this.$message.warning(errData.errorMessage);
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
    handleSizeChange(val) {
      this.pagination.pageSize = val;
      this.refresh();
    },
    handleCurrentChange(val) {
      this.pagination.currentPage = val;
      this.refresh();
    },
    filterDataChange(filters) {
      this.getList();
    }
  }
};
</script>

<style lang="scss">
.reception-static {
  .biz-icon-zhiding1 {
    color: #ff7300;
    font-size: 26px;
  }
  .federation-mgmt-header {
    text-align: right;
    padding: 5px 15px;
  }
  .biz-customcol {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    .el-button {
      margin-left: 10px;
    }
  }
  .delete-btn {
    color: red;
  }
}
</style>
