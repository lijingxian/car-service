<template>
  <div class="marketing-statistics-activity-kpi-report">
    <biz-chart :chartData="chartData" :filters="filters" @filterDataChange="filterDataChange" :loading="loading" :pagination="pagination"
      @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange" @refreshHandle="refreshHandle" @exportExcle="exportExcle">
      <div slot="list">
        <biz-list ref="list" :height="height" :tableData="tableData" style="width: 100%">
          <el-table-column prop="sn" label="订单编号">
          </el-table-column>
          <el-table-column prop="date" label="日期">
          </el-table-column>
          <el-table-column prop="memberMobile" label="会员手机号">
          </el-table-column>
          <el-table-column prop="memberName" label="会员昵称">
          </el-table-column>
          <el-table-column prop="plateNumber" label="车牌号">
          </el-table-column>
          <el-table-column prop="amountPaid" label="订单净额（元）">
          </el-table-column>
        </biz-list>
      </div>
      <div slot="description">
        <p>当期订单数：统计期内订单状态变更为“交易完成”的订单的,订单类型为产品的订单数量</p>
        <p>累计订单数：自然年内，截止至统计选择期，订单类型为产品、订单状态变更为“交易完成”的订单数总计</p>
        <p>当期订单金额：统计期内订单状态变更为“交易完成”&订单类型为产品的订单的实付金额总计—统计期内退款金额总计</p>
        <p>累计订单金额：自然年内，截止至统计选择期，订单类型为产品、订单状态变更为“交易完成”的订单金额总计</p>
      </div>
    </biz-chart>
  </div>
</template>

<script>
import BizChart from '@/components/BizChart';
import BizList from '@/components/BizTable/BizList';
import dateTime from '@/utils/dateTime';
import urls from '@/common/urls';
import http from '@/common/http';
export default {
  name: 'ActivityKpiReport',
  data() {
    return {
      today: '',
      loading: true,
      height: '500',
      beginDate: dateTime.getPreThreeMonthDay(),
      endDate: dateTime.today(),
      viewType: 'month',
      pagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        total: 0
      },
      tableData: [],
      filters: [
        {
          type: 'select',
          label: '统计指标',
          value: 'orderCnt',
          options: [
            { value: 'orderCnt', label: '当期订单数' },
            { value: 'totalOrderCnt', label: '累计订单数' },
            { value: 'orderAmount', label: '当期订单金额' },
            {
              value: 'totalOrderAmount',
              label: '累计订单金额'
            }
          ]
        }
      ],
      kpiName: ['当前', '同比', '环比'],
      chartData: {}
    };
  },
  methods: {
    init() {
      this.loading = true;
      let params = {
        type: 'product',
        viewType: this.viewType,
        indicator: this.filters[0].value,
        beginDate: this.beginDate,
        endDate: this.endDate,
        shopId: window.top.SHOP_ID || '',
        pageSize: this.pagination.pageSize,
        pageNumber: this.pagination.currentPage
      };
      http
        .get(urls.orderMgmt.statisticsAnalysis.queryOrderKpiReport, params)
        .then(data => {
          this.chartData = this.dataFormat(data);
        })
        .catch(errData => {
          this.loading = false;
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    getTable() {
      let params = {
        type: 'product',
        viewType: this.viewType,
        indicator: this.filters[0].value,
        beginDate: this.beginDate,
        endDate: this.endDate,
        shopId: window.top.SHOP_ID || '',
        pageSize: this.pagination.pageSize,
        pageNumber: this.pagination.currentPage
      };
      http
        .get(urls.orderMgmt.statisticsAnalysis.queryOrderKpiTable, params)
        .then(data => {
          this.tableData = data.dataList;
          this.pagination.total = Number(data.total);
        })
        .catch(errData => {
          this.loading = false;
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    refreshHandle(val) {
      this.viewType = val.viewType;
      this.beginDate = val.date[0];
      this.endDate = val.date[1];
      this.init();
      this.getTable();
    },
    filterDataChange(val) {
      this.filters = val;
      this.init();
      this.getTable();
    },
    handleSizeChange(val) {
      this.pagination.pageSize = val;
      this.getTable();
    },
    handleCurrentChange(val) {
      this.pagination.currentPage = val;
      this.getTable();
    },
    exportExcle() {
      let params = {
        type: 'product',
        viewType: this.viewType,
        indicator: this.filters[0].value,
        beginDate: this.beginDate,
        endDate: this.endDate
      };
      http
        .get(urls.orderMgmt.statisticsAnalysis.orderKpiExport, params)
        .then()
        .catch(data => {
          if (!data.errorMessage && data !== '没有符合条件的数据') {
            let paramsArr = [];
            for (let name in params) {
              paramsArr.push(`${name}=${params[name]}`);
            }
            let linkedUrl =
              `${
                urls.orderMgmt.statisticsAnalysis.orderKpiExport
              }?` + paramsArr.join('&');
            // 异步弹出窗口会被Chrome拦截
            window.open(linkedUrl);
            // location.href = linkedUrl;
          } else {
            if (data === '没有符合条件的数据') {
              this.$message.warning('没有符合条件的数据');
            } else {
              this.$message.warning(data.errorMessage);
              console.log('ERR_EXPORT: ', data);
            }
          }
        });
    },
    dataFormat(data) {
      let tmpData = [];
      for (let i = 0; i < data.indicators.length; i++) {
        tmpData.push({
          日期: data.indicators[i].xValue,
          当前: data.indicators[i].yValue,
          同比: data.indicators[i].yYearOnYear,
          环比: data.indicators[i].yMonthOnMonth
        });
      }
      let chartData = {
        type: 'histogram',
        data: {
          columns: ['日期', this.kpiName[0], this.kpiName[1], this.kpiName[2]],
          rows: tmpData
        },
        settings: {
          showLine: [this.kpiName[1], this.kpiName[2]],
          yAxisName: this.filters[0].value === 'orderCnt' || this.filters[0].value === 'totalOrderCnt' ? '个' : ['万元']
        }
      };
      return chartData;
    }
  },
  computed: {},
  created() {
    this.init();
    this.getTable();
  },
  components: {
    BizChart,
    BizList
  }
};
</script>

<style lang="scss">
.marketing-statistics-activity-kpi-report {
  height: 100%;
  overflow: auto;
  .biz-table-filter .filter-wrap .biz-select .el-select {
    width: 150px;
  }
}
</style>
