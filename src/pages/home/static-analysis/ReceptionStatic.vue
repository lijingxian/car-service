<template>
  <div class="reception-static">
    <div class="static-analysis">
      <ve-histogram :data="chartData" :colors="chartColors" :events="events" :extend="chartExtend" :height="height"></ve-histogram>
    </div>
    <div class="card">
      <el-card class="box-card">
        <div class="box-div">
          <span class="font" @click="init('atShopReception')">接待人数</span>
          <span class="color">
            {{statistics.intelligentAccess?statistics.intelligentAccess.atShopReception:''}}
          </span>
        </div>
      </el-card>
    </div>
  </div>
</template>
<script>
import VeHistogram from 'v-charts/lib/histogram';
import http from '@/common/http';
export default {
  props: {
    beginDate: {
      type: String,
      default: ''
    },
    endDate: {
      type: String,
      default: ''
    },
    viewType: {
      type: String,
      default: ''
    },
    roleType: {
      type: String,
      default: ''
    }
  },
  data() {
    this.chartExtend = {
      series(v) {
        if (v) {
          v.forEach(i => {
            i.barWidth = 20;
            i.barGap = 0;
          });
          return v;
        }
      },
      xAxis: {
        type: 'category',
        axisLabel: {
          interval: 'auto'
        }
      }
    };
    return {
      chartColors: ['#bdd7ee', '#ffe669', '#909399', '#FF7993', '#0071B6'], // 柱形-折线图表颜色
      kpiName: ['本期', '同比', '环比'],
      chartData: {},
      statistics: {},
      height: '360px'
    };
  },
  components: {
    VeHistogram
  },
  created() {
    let me = this;
    // 点击事件
    this.events = {
      click: e => {
        me.$emit('events', e);
      }
    };
    this.init();
    this.query();
  },
  watch: {
    viewType(nVal, oVal) {
      this.init();
      this.query();
    },
    roleType(nVal, oVal) {
      this.init();
      this.query();
    }
  },
  methods: {
    dataFormat(data) {
      let tmpData = [];
      console.log(data.indicators);
      for (let i = 0; i < data.indicators.length; i++) {
        tmpData.push({
          内容: data.indicators[i].xValue,
          本期: data.indicators[i].yValue,
          同比: data.indicators[i].yYearOnYear,
          环比: data.indicators[i].yMonthOnMonth
        });
      }
      let chartData = {
        columns: ['内容', this.kpiName[0], this.kpiName[1], this.kpiName[2]],
        rows: tmpData
      };
      return chartData;
    },
    init(indicator) {
      let params = {
        beginDate: this.beginDate,
        endDate: this.endDate,
        viewType: this.viewType,
        indicator: indicator || 'atShopReception',
        roleType: '11'
      };
      http
        .get('/admin/ecommerce/kpi/potal/graph.jhtml', params)
        .then(data => {
          this.chartData = this.dataFormat(data);
        })
        .catch(errData => {
          console.log(errData);
          console.log('code错误');
          if (errData.errorMessage) {
            this.$message.warning(errData.errorMessage);
          }
        })
        .finally(() => {});
    },
    query() {
      let params = {
        beginDate: this.beginDate,
        endDate: this.endDate,
        viewType: this.viewType,
        roleType: '11'
      };
      http
        .get('/admin/ecommerce/kpi/potal/statistics.jhtml', params)
        .then(data => {
          this.statistics = data.statistics;
        })
        .catch(errData => {
          console.log(errData);
          console.log('code错误');
          if (errData.errorMessage) {
            this.$message.warning(errData.errorMessage);
          }
        })
        .finally(() => {});
    }
  }
};
</script>
<style lang="scss">
.reception-static {
  display: flex;
  .card {
    width: 20%;
    font-size: 14px;
  }
  .el-card {
    // border: 2px solid #ff7300;
    height: 300px;
    margin: 0px 10px 10px 0px;
    .box-div {
      display: flex;
      justify-content: space-between;
      height: 50px;
      line-height: 50px;
      .font {
        font-weight: bold;
        cursor: pointer;
        color: #ff7300;
      }
      .color a {
        color: #ff7300;
      }
    }
  }
  .static-analysis {
    display: flex;
    flex-direction: column;
    align-content: space-between;
    margin: 0px 20px;
    width: 60%;
    .chart-area {
      margin-top: 100px;
    }
    .search-property {
      display: flex;
      justify-content: space-between;
    }
  }
}
</style>
