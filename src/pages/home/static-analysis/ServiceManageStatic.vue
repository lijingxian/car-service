<template>
  <div class="service-static">
    <div class="static-analysis">
      <ve-histogram :data="chartData" :colors="chartColors" :events="events" :extend="chartExtend" :height="height"></ve-histogram>
    </div>
    <div class="card">
      <el-card class="box-card">
        <div class="box-div">
          <span class="font" :class="{yellow:indicators==='csSession'}" @click="init('csSession')">会话数</span>
          <span class="color">
            {{statistics.csSession?statistics.csSession.csSession:''}}
          </span>
        </div>
        <div class="box-div">
          <span class="font" :class="{yellow:indicators==='csSessionTimes'}" @click="init('csSessionTimes')">会话时长（分钟）</span>
          <span class="color">
            {{statistics.csSession?statistics.csSession.csSessionTimes:''}}
          </span>
        </div>
        <div class="box-div">
          <span class="font" :class="{yellow:indicators==='csMemberScore'}" @click="init('csMemberScore')">用户评分</span>
          <span class="color">
            {{statistics.csSession?statistics.csSession.csMemberScore:''}}
          </span>
        </div>
        <div class="box-div">
          <span class="font" :class="{yellow:indicators==='csAdminScore'}" @click="init('csAdminScore')">质检评分</span>
          <span class="color">
            {{statistics.csSession?statistics.csSession.csAdminScore:''}}
          </span>
        </div>
        <div class="box-div">
          <span class="font" :class="{yellow:indicators==='csWorkSheet'}" @click="init('csWorkSheet')">工单数量</span>
          <span class="color">
            {{statistics.csSession?statistics.csSession.csWorkSheet:''}}
          </span>
        </div>
      </el-card>
    </div>
    <div class="card">
      <el-card class="box-card">
        <div class="box-div">
          <span class="font" :class="{yellow:indicators==='atShop'}" @click="init('atShop')">到店人数</span>
          <span class="color">
            {{statistics.intelligentAccess?statistics.intelligentAccess.atShop:''}}
          </span>
        </div>
        <div class="box-div">
          <span class="font" :class="{yellow:indicators==='atShopReception'}" @click="init('atShopReception')">接待人数</span>
          <span class="color">
            {{statistics.intelligentAccess?statistics.intelligentAccess.atShopReception:''}}
          </span>
        </div>
        <div class="box-div">
          <span class="font" :class="{yellow:indicators==='atShopAmount'}" @click="init('atShopAmount')">消费金额（万）</span>
          <span class="color">
            {{statistics.intelligentAccess?statistics.intelligentAccess.atShopAmount:''}}
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
      indicators: 'csSession',
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
    init(indicator) {
      this.indicators = indicator;
      let params = {
        beginDate: this.beginDate,
        endDate: this.endDate,
        viewType: this.viewType,
        indicator: indicator || 'csSession',
        roleType: '5'
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
        roleType: '5'
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
.service-static {
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
