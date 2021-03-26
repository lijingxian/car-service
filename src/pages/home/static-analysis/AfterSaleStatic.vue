<template>
  <div class="afterSale-static">
    <div class="static-analysis">
      <ve-histogram :data="chartData" :colors="chartColors" :events="events" :extend="chartExtend" :height="height"></ve-histogram>
    </div>
    <div class="card1">
      <el-card class="box-card">
        <div class="box-div">
          <span class="font" :class="{yellow:indicators==='aftersaleOrder'}" @click="init('aftersaleOrder')">售后订单数</span>
          <span class="color">
            <router-link to="/after-sale/statistics-analysis/aftersale">{{statistics.order?statistics.order.aftersaleOrder:''}}</router-link>
          </span>
        </div>
        <div class="box-div">
          <span class="font" :class="{yellow:indicators==='aftersaleOrderAmount'}" @click="init('aftersaleOrderAmount')">售后金额（万）</span>
          <span class="color">
            <router-link to="/after-sale/statistics-analysis/aftersale">{{statistics.order?statistics.order.aftersaleOrderAmount:''}}</router-link>
          </span>
        </div>
        <div class="box-div">
          <span class="font" :class="{yellow:indicators==='entryShop'}" @click="init('entryShop')">进厂台次</span>
          <span class="color">
            <router-link to="/after-sale/statistics-analysis/aftersale">{{statistics.order?statistics.order.entryShop:''}}</router-link>
          </span>
        </div>
        <div class="box-div">
          <span class="font" :class="{yellow:indicators==='repairAmount'}" @click="init('repairAmount')">维修金额（万）</span>
          <span class="color">
            <router-link to="/after-sale/statistics-analysis/aftersale">{{statistics.order?statistics.order.repairAmount:''}}</router-link>
          </span>
        </div>
        <div class="box-div">
          <span class="font" :class="{yellow:indicators==='maintainAmount'}" @click="init('maintainAmount')">保养金额（万） </span>
          <span class="color">
            <router-link to="/after-sale/statistics-analysis/aftersale">{{statistics.order?statistics.order.maintainAmount:''}}</router-link>
          </span>
        </div>
        <div class="box-div">
          <span class="font" :class="{yellow:indicators==='finishRescue'}" @click="init('finishRescue')">执行救援订单</span>
          <span class="color">
           {{statistics.rescue?statistics.rescue.finishRescue:''}}
          </span>
        </div>
      </el-card>
    </div>
    <div class="card">
      <el-card class="box-card">
        <div class="box-div">
          <span class="font" :class="{yellow:indicators==='member'}" @click="init('member')">会员</span>
          <span class="color">
            {{statistics.member?statistics.member.member:''}}
          </span>
        </div>
        <div class="box-div">
          <span class="font" :class="{yellow:indicators==='memberCard'}" @click="init('memberCard')">会员卡</span>
          <span class="color">
            {{statistics.member?statistics.member.memberCard:''}}
          </span>
        </div>
        <div class="box-div">
          <span class="font" :class="{yellow:indicators==='memberAmount'}" @click="init('memberAmount')">会员储值(万)</span>
          <span class="color">
            {{statistics.member?statistics.member.memberAmount:''}}
          </span>
        </div>
      </el-card>
      <el-card class="box-card">
        <div class="box-div1">
          <span class="font" :class="{yellow:indicators==='satisfaction'}" @click="init('satisfaction')">用户满意度</span>
          <span class="color">
            {{statistics.review?statistics.review.satisfaction:''}}
          </span>
        </div>
        <div class="box-div1">
          <span class="font" :class="{yellow:indicators==='skillSatisfaction'}" @click="init('skillSatisfaction')">技术满意度</span>
          <span class="color">
            {{statistics.review?statistics.review.skillSatisfaction:''}}
          </span>
        </div>
        <div class="box-div1">
          <span class="font" :class="{yellow:indicators==='serviceSatisfaction'}" @click="init('serviceSatisfaction')">服务满意度</span>
          <span class="color">
            {{statistics.review?statistics.review.serviceSatisfaction:''}}
          </span>
        </div>
        <div class="box-div1">
          <span class="font" :class="{yellow:indicators==='complain'}" @click="init('complain')">售后投诉数</span>
          <span class="color">
            {{statistics.review?statistics.review.complain:''}}
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
      indicators: 'aftersaleOrder',
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
        indicator: indicator || 'aftersaleOrder',
        roleType: '8'
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
        roleType: '8'
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
.afterSale-static {
  display: flex;
  .yellow {
    color: #ff7300;
  }
  .card {
    width: 20%;
    font-size: 14px;
    .el-card {
      // border: 2px solid #ff7300;
      height: 165px;
      margin: 0px 10px 10px 0px;
      .box-div {
        display: flex;
        justify-content: space-between;
        height: 30px;
        line-height: 30px;
        .font {
          font-weight: bold;
          cursor: pointer;
        }
        .color a {
          color: #ff7300;
        }
      }
    }
  }
  .card1 {
    width: 20%;
    font-size: 14px;
    .el-card {
      // border: 2px solid #ff7300;
      height: 340px;
      margin: 0px 10px 10px 0px;
      .box-div {
        display: flex;
        justify-content: space-between;
        height: 30px;
        line-height: 30px;
        .font {
          font-weight: bold;
          cursor: pointer;
        }
        .color a {
          color: #ff7300;
        }
      }
    }
  }
  .box-div1 {
    display: flex;
    justify-content: space-between;
    height: 30px;
    line-height: 30px;
    .font {
      font-weight: bold;
      cursor: pointer;
    }
    .color a {
      color: #ff7300;
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
