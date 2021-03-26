<template>
  <div class="recommend-view">
    <div slot="top">
      <show-search-grid @refreshHandle="refreshHandle" :showIntroduce="false" :showViewType="false" ref="search"></show-search-grid>
    </div>
    <div class="indicators-search">
      <div class="title">统计指标：</div>
      <el-select v-model="indicators" class="order-select" size="mini" @change="filterChange">
        <el-option v-for="indicator in indicatorList" :key="indicator.label" :label="indicator.label" :value="indicator.value"></el-option>
      </el-select>
    </div>
    <div class="chart-area">
      <div class="graph">
        <div class="filterSeach">
          <div class="filter-area"></div>
          <div class="type-range">
            <view-type-swich @refreshHandle="refreshHandleType"></view-type-swich>
          </div>
        </div>
        <biz-chart :chartData="chartData" :loading="loading" :showSearch="false"></biz-chart>
      </div>
    </div>
  </div>
</template>

<script>
import BizChart from '@/components/BizChart';
import dateTime from '@/utils/dateTime';
import http from '@/common/http';
import ShowSearchGrid from './components/ShowSearchGrid';
import ViewTypeSwich from './components/ViewTypeSwich';
import date from '@/utils/date';
export default {
  name: 'recommendView',
  data() {
    return {
      loading: true,
      height: '500',
      beginDate: dateTime.getMonthStartDate(),
      endDate: date.nowDate(),
      viewType: 'month',
      indicators: 'cost',
      indicatorList: [
        {
          label: '消耗',
          value: 'cost'
        },
        {
          label: '展示数',
          value: 'impression'
        },
        {
          label: '点击数',
          value: 'click'
        },
        {
          label: '点击率',
          value: 'ctr'
        },
        {
          label: '平均点击单价',
          value: 'cpc'
        },
        {
          label: '平均千次展现费用',
          value: 'cpm'
        }
      ],
      chartData: {}
    };
  },
  props: {
    itemId: {
      type: Object,
      default() {
        return { id: '' };
      }
    }
  },
  methods: {
    getGraphData() {
      this.loading = true;
      let params = {
        recommendId: this.itemId.id,
        kpiViewType: this.viewType,
        beginTime: this.beginDate,
        endTime: this.endDate
      };
      http
        .get('/admin/recommend/queryRecommendReport.jhtml', params)
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
    refreshHandle(val) {
      // this.viewType = val.viewType;
      this.beginDate = val.date[0];
      this.endDate = val.date[1];
      this.getGraphData();
    },
    refreshHandleType(val) {
      this.viewType = val.viewType;
      // this.beginDate = val.date[0];
      // this.endDate = val.date[1];
      this.getGraphData();
    },
    filterChange(val) {
      this.indicators = val;
      this.getGraphData();
    },
    dataFormat(data) {
      let tmpData = [];
      let kpiName = [''];
      if (this.indicators === 'cost') {
        kpiName = ['消耗'];
      }
      if (this.indicators === 'impression') {
        kpiName = ['展示数'];
      }
      if (this.indicators === 'click') {
        kpiName = ['点击数'];
      }
      if (this.indicators === 'ctr') {
        kpiName = ['点击率'];
      }
      if (this.indicators === 'cpc') {
        kpiName = ['平均点击单价'];
      }
      if (this.indicators === 'cpm') {
        kpiName = ['平均千次展现费用'];
      }
      for (let i = 0; i < data.recommendReportDatas.length; i++) {
        tmpData.push({
          日期: data.recommendReportDatas[i].date,
          [kpiName[0]]:
            this.indicators === 'cost'
              ? data.recommendReportDatas[i].cost
              : this.indicators === 'impression'
                ? data.recommendReportDatas[i].impression
                : this.indicators === 'click'
                  ? data.recommendReportDatas[i].click
                  : this.indicators === 'ctr'
                    ? data.recommendReportDatas[i].ctr
                    : this.indicators === 'cpc'
                      ? data.recommendReportDatas[i].cpc
                      : data.recommendReportDatas[i].cpm
        });
      }
      let chartData = {
        type: 'line',
        legendVisible: false,
        data: {
          columns: ['日期', kpiName[0]],
          rows: tmpData
        },
        settings: {}
      };
      return chartData;
    }
  },
  computed: {
    kpiName: function() {
      if (this.indicators === 'cost') {
        return ['消耗'];
      }
      if (this.indicators === 'impression') {
        return ['展示数'];
      }
      if (this.indicators === 'click') {
        return ['点击数'];
      }
      if (this.indicators === 'ctr') {
        return ['点击率'];
      }
      if (this.indicators === 'cpc') {
        return ['平均点击单价'];
      }
      if (this.indicators === 'cpm') {
        return ['平均千次展现费用'];
      }
      return [''];
    }
  },
  watch: {
    itemId(nVal, oVal) {
      if (nVal.id) {
        let that = this;
        setTimeout(() => {
          that.getGraphData();
        }, 1000);
        // this.getGraphData();
      }
    }
  },
  mounted() {
    if (this.itemId.id) {
      let that = this;
      setTimeout(() => {
        that.getGraphData();
      }, 1000);
    }
  },
  components: {
    BizChart,
    ShowSearchGrid,
    ViewTypeSwich
  }
};
</script>

<style lang="scss">
.recommend-view {
  height: 100%;
  overflow: auto;
  display: flex;
  flex-direction: column;
  align-content: space-between;
  margin: 20px 0px 20px 20px;
  padding-bottom: 20px;
  padding-right: 10px;
  min-width: 560px;
  .indicators-search {
    display: flex;
    .title {
      padding: 20px 10px;
      font-size: 12px;
    }
    .el-select {
      padding-top: 15px;
    }
  }
  .total {
    display: flex;
    margin-top: 20px;
    .column1 {
      border: 1px solid #d9d9d9;
      padding: 20px;
      width: 350px;
      height: 155px;
      line-height: 40px;
      margin-right: 40px;
      .table-cell {
        font-size: 15px;
      }
      .color-primary {
        font-size: 13px;
      }
    }
    .column2 {
      border: 1px solid #d9d9d9;
      padding: 20px;
      width: 350px;
      height: 155px;
      line-height: 40px;
      .table-cell {
        font-size: 15px;
      }
      .color-primary {
        font-size: 13px;
      }
    }
  }
  .chart-area {
    margin-top: 10px;
    .graph {
      box-shadow: 0 2px 3px rgba(0, 0, 0, 0.1);
      margin-bottom: 20px;
      margin-left: 1px;
      width: 100%;
      .header {
        height: 40px;
        background-color: #f7f7f7;
        font-size: 13px;
        padding: 10px;
        font-weight: 700;
      }
      .filterSeach {
        display: flex;
        justify-content: space-between;
        margin: 10px 0px;
      }
    }
  }
  .v-charts-data-empty {
    background-color: #ffffff;
  }
  .description-pover {
    max-height: 500px;
    overflow: auto;
  }
  .yellow {
    color: #ff7300;
  }
  .search-property {
    display: flex;
    justify-content: space-between;
    .el-input--prefix .el-input__inner {
      height: 35px;
    }
  }
  .biz-table-filter .filter-wrap .biz-select .el-select {
    width: 150px;
  }
  .toggle {
    height: 40px;
    background-color: rgb(247, 247, 247);
    margin-bottom: 20px;
    padding: 10px;
    .toggle-btn {
      cursor: pointer;
      font-size: 12px;
      display: flex;
      z-index: 1;
      justify-content: center;
      align-items: center;
      .rotate-180 {
        transform: rotate(180deg);
      }
    }
  }
}
</style>
