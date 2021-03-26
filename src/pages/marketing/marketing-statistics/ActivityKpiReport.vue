<template>
 <div class="marketing-statistics-activity-kpi-report">
   <biz-chart :chartData="chartData" :filters="filters" @filterDataChange="filterDataChange" :loading="loading"></biz-chart>
 </div>
</template>

<script>
import BizChart from '@/components/BizChart';
import MarketingStatistics from '@/service/marketing-statistics/marketingStatistics';

export default {
  name: 'ActivityKpiReport',
  data () {
    return {
      today: '',
      loading: true,
      filters: [
        {
          type: 'select',
          label: '查看类型',
          value: 'month',
          options: [
            { value: 'day', label: '按日' },
            { value: 'month', label: '按月' }
          ]
        },
        {
          type: 'select',
          label: '统计指标',
          value: 'attend',
          options: [
            { value: 'attend', label: '活动参与人数' }
          ]
        },
        {
          type: 'daterange',
          label: '日期区间：',
          value: ['2011-11-11', '2012-12-12']
        }
      ],
      kpiName: ['活动参与人数', '参与率'],
      chartData: {}
    };
  },
  methods: {
    init() {
      let begin = new Date(this.filters[2].value[0]);
      let end = new Date(this.filters[2].value[1]);
      if (this.filters[0].value === 'month' && (begin.getFullYear() === end.getFullYear() && begin.getMonth() === end.getMonth())) {
        this.$message({
          message: '按月查询时起止时间请选择不同月份',
          showClose: true,
          type: 'warning'
        });
        this.filters[0].value = 'day';
        return;
      }
      if (this.filters[2].value[0] > this.today || this.filters[2].value[1] > this.today) {
        this.$message.warning({
          message: '不能选择将来的时间',
          showClose: true
        });
        this.filters[0].value = 'month';
        this.getFormatDate();
        return;
      }
      this.loading = true;
      let params = {
        kpiCategory: 'activity',
        dateType: this.filters[0].value,
        kpiType: this.filters[1].value,
        beginDate: this.filters[2].value[0],
        endDate: this.filters[2].value[1]
      };
      MarketingStatistics.getActivityKpi(
        params,
        data => {
          this.loading = false;
          this.chartData = this.dataFormat(data);
        },
        ErrorData => {
          this.loading = false;
          if (ErrorData.resultCode === '779') {
            this.filters[0].value = 'month';
          }
          this.$message({
            showClose: true,
            message: ErrorData.errorMessage,
            type: 'danger'
          });
          console.log('ERR_INIT: ', ErrorData);
        }
      );
    },
    filterDataChange(val) {
      this.filters = val;
      this.init();
    },
    dataFormat(data) {
      let tmpData = [];
      for (let i = 0; i < data.histogram.length; i++) {
        tmpData.push({
          '日期': this.filters[0].value === 'day' ? data.histogram[i].xValue.slice(5, 10) : data.histogram[i].xValue,
          [this.kpiName[0]]: data.histogram[i].yValue,
          [this.kpiName[1]]: data.lineChat.length === 0 ? '' : (data.lineChat[i].yValue === '0' ? '0' : data.lineChat[i].yValue / 100)
        });
      }
      let chartData = {
        type: 'histogram',
        data: {
          columns: ['日期', this.kpiName[0], this.kpiName[1]],
          rows: tmpData
        },
        settings: {
          metrics: [this.kpiName[0], data.lineChat.length === 0 ? '' : this.kpiName[1]],
          showLine: this.kpiName[1],
          yAxisType: ['normal', 'percent'],
          yAxisName: [this.kpiName[0], data.lineChat.length === 0 ? '' : this.kpiName[1]]
        }
      };
      if (data.lineChat.length !== 0) {
        chartData.settings.axisSite = { right: [this.kpiName[1]] };
      }
      return chartData;
    },
    // 获取今天以及六个月前的日期
    getFormatDate() {
      let date = new Date();
      this.filters[2].value[1] = `${date.getFullYear()}-${date.getMonth() < 9 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1}-${date.getDate() < 10 ? '0' + date.getDate() : date.getDate()}`;
      this.today = this.filters[2].value[1];
      let halfYearAgo = function() {
        let dt = new Date();
        dt.setMonth(dt.getMonth() - 6);
        return `${dt.getFullYear()}-${dt.getMonth() < 9 ? '0' + (dt.getMonth() + 1) : dt.getMonth() + 1}-${dt.getDate() < 10 ? '0' + dt.getDate() : dt.getDate()}`;
      };
      this.filters[2].value[0] = halfYearAgo();
    }
  },
  computed: {
  },
  created() {
    this.getFormatDate();
    this.init();
  },
  components: {
    BizChart
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
