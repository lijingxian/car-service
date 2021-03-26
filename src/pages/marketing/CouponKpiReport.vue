<template>
  <div class="marketing-statistics-activity-kpi-report">
    <biz-chart :chartData="chartData" :filters="filters" @filterDataChange="filterDataChange" :loading="loading" :pagination="pagination"
      @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange" @refreshHandle="refreshHandle" @exportExcle="exportExcle">
      <div slot="list">
        <biz-list ref="list" :height="height" :tableData="tableData" style="width: 100%">
          <el-table-column prop="name" label="活动名称">
          </el-table-column>
          <el-table-column prop="beginTime" label="活动开始日期">
          </el-table-column>
          <el-table-column prop="type" label="活动类型">
          </el-table-column>
          <el-table-column prop="couponCnt" label="优惠券发放量">
          </el-table-column>
          <el-table-column prop="couponReceiveCnt" label="优惠券领取量">
          </el-table-column>
          <el-table-column prop="couponUserCnt" label="优惠券使用量">
          </el-table-column>
        </biz-list>
      </div>
      <div slot="description">
        <p>优惠券发放量：开始日期在统计期内的，促销类型为“优惠券”活动，设置的发放总量总计数</p>
        <p>优惠券领取量：统计期内，促销类型为“优惠券”--活动中优惠券的累计领取数量</p>
        <p>优惠券领取率：统计期内，对应活动优惠券累计领取量/对应活动优惠券发放量*100%</p>
        <p>优惠券使用量：统计期内，累计核销使用的优惠券数量</p>
        <p>优惠券使用率：统计期内，优惠券使用量/优惠券领取量*100%</p>
      </div>
    </biz-chart>
  </div>
</template>

<script>
import BizChart from '@/components/BizChart';
import MarketingStatistics from '@/service/marketing-statistics/marketingStatistics';
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
          value: 'couponSendCnt',
          options: [
            { value: 'couponSendCnt', label: '优惠券发放量' },
            { value: 'couponReceiveCnt', label: '优惠券领取量' },
            { value: 'couponReceiveRate', label: '优惠券领取率' },
            { value: 'couponUseCnt', label: '优惠券使用量' },
            { value: 'couponUseRate', label: '优惠券使用率' }
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
        viewType: this.viewType,
        indicator: this.filters[0].value,
        beginDate: this.beginDate,
        endDate: this.endDate,
        shopId: window.top.SHOP_ID || '',
        pageSize: this.pagination.pageSize,
        pageNumber: this.pagination.currentPage
      };
      MarketingStatistics.getCouponKpi(
        params,
        data => {
          this.loading = false;
          this.chartData = this.dataFormat(data);
        },
        ErrorData => {
          this.loading = false;
          this.$message.warning({
            showClose: true,
            message: ErrorData.errorMessage
          });
          console.log('ERR_INIT: ', ErrorData);
        }
      );
    },
    getTable() {
      let params = {
        viewType: this.viewType,
        indicator: this.filters[0].value,
        beginDate: this.beginDate,
        endDate: this.endDate,
        shopId: window.top.SHOP_ID || '',
        pageSize: this.pagination.pageSize,
        pageNumber: this.pagination.currentPage
      };
      http
        .get(urls.marketingStatistics.queryCouponKpiTable, params)
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
        type: this.filters[0].value,
        viewType: this.viewType,
        indicator: this.filters[0].value,
        beginDate: this.beginDate,
        endDate: this.endDate
      };
      http
        .get(urls.marketingStatistics.couponExport, params)
        .then()
        .catch(data => {
          if (!data.errorMessage && data !== '没有符合条件的数据') {
            let paramsArr = [];
            for (let name in params) {
              paramsArr.push(`${name}=${params[name]}`);
            }
            let linkedUrl =
              `${urls.marketingStatistics.couponExport}?` +
              paramsArr.join('&');
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
      let inheritAttrs = ['couponSendCnt', 'couponReceiveCnt', 'couponUseCnt'];
      let chartData = {
        type: 'histogram',
        data: {
          columns: ['日期', this.kpiName[0], this.kpiName[1], this.kpiName[2]],
          rows: tmpData
        },
        settings: {
          showLine: [this.kpiName[1], this.kpiName[2]],
          yAxisName: inheritAttrs.indexOf(this.filters[0].value) !== -1 ? '个' : ['比率']
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
