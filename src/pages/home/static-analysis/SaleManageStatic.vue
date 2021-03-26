<template>
  <div class="sale-static">
    <div class="static-analysis">
      <ve-histogram :data="chartData" :colors="chartColors" :events="events" :extend="chartExtend" :height="height"></ve-histogram>
    </div>
    <div class="card">
      <el-card class="box-card">
        <div class="box-div">
          <span class="font"  :class="{yellow:indicators==='customer'}" @click="init('customer')">新增潜客</span>
          <span class="color">
            {{statistics.customer?statistics.customer.customer:''}}
          </span>
        </div>
        <div class="box-div">
          <span class="font" :class="{yellow:indicators==='customerChannel'}" @click="init('customerChannel')">潜客来源</span>
          <span class="color">
            {{statistics.customer?statistics.customer.customerChannel:''}}
          </span>
        </div>
        <div class="box-div">
          <span class="font" :class="{yellow:indicators==='customerValid'}" @click="init('customerValid')">有效潜客</span>
          <span class="color">
            {{statistics.customer?statistics.customer.customerValid:''}}
          </span>
        </div>
        <div class="box-div">
          <span class="font" :class="{yellow:indicators==='customerVisit'}" @click="init('customerVisit')">潜客回访</span>
          <span class="color">
            {{statistics.customer?statistics.customer.customerVisit:''}}
          </span>
        </div>
        <div class="box-div">
          <span class="font" :class="{yellow:indicators==='customerDefeat'}" @click="init('customerDefeat')">潜客战败</span>
          <span class="color">
            {{statistics.customer?statistics.customer.customerDefeat:''}}
          </span>
        </div>
      </el-card>
    </div>
    <div class="card">
      <el-card class="box-card">
        <div class="box-div">
          <span class="font" :class="{yellow:indicators==='carOrder'}" @click="init('carOrder')">整车销量</span>
          <span class="color">
            {{statistics.order?statistics.order.carOrder:''}}
          </span>
        </div>
        <div class="box-div">
          <span class="font" :class="{yellow:indicators==='carOrderAmount'}" @click="init('carOrderAmount')">整车销售金额（万）</span>
          <span class="color">
            {{statistics.order?statistics.order.carOrderAmount:''}}
          </span>
        </div>
        <div class="box-div">
          <span class="font" :class="{yellow:indicators==='saleCar'}" @click="init('saleCar')">交车数</span>
          <span class="color">
            {{statistics.order?statistics.order.saleCar:''}}
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
      kpiName1: ['跟进数', '计划数'],
      chartData: {},
      statistics: {},
      indicators: 'customer',
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
    this.init(this.indicators);
    this.query();
  },
  watch: {
    viewType(nVal, oVal) {
      this.init(this.indicators);
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
    dataFormat1(data) {
      let tmpData = [];
      console.log(data.indicators);
      for (let i = 0; i < data.indicators.length; i++) {
        tmpData.push({
          内容: data.indicators[i].xValue,
          跟进数: data.indicators[i].yValue,
          计划数: data.indicators[i].yYearOnYear
        });
      }
      let chartData = {
        columns: ['内容', this.kpiName1[0], this.kpiName1[1]],
        rows: tmpData
      };
      return chartData;
    },
    init(indicator) {
      this.indicators = indicator;
      let params = {
        beginDate: this.beginDate,
        endDate: this.endDate,
        viewType: this.viewType,
        indicator: indicator || 'customer',
        roleType: '15'
      };
      http
        .get('/admin/ecommerce/kpi/potal/graph.jhtml', params)
        .then(data => {
          if (indicator === 'customerVisit') {
            this.chartData = this.dataFormat1(data);
          } else {
            this.chartData = this.dataFormat(data);
          }
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
        roleType: '15'
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
.sale-static {
  display: flex;
  .card {
    width: 20%;
    font-size: 14px;
  }
  .yellow {
    color: #ff7300;
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
