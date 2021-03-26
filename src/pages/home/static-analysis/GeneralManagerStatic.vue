<template>
  <div class="general-static">
    <div class="static-analysis">
      <ve-histogram :data="chartData" :colors="chartColors" :extend="chartExtend" :events="events" :height="height"></ve-histogram>
    </div>
    <div class="card">
      <el-card class="box-card1">
        <div class="box-div">
          <span class="font"  :class="{yellow:indicators==='orderAmount'}" @click="init('orderAmount')">订单金额（万）</span>
          <span class="color">
            {{statistics.order?statistics.order.orderAmount:''}}
          </span>
        </div>
        <div class="box-div">
          <span class="font" :class="{yellow:indicators==='carOrderAmount'}" @click="init('carOrderAmount')">整车金额（万）</span>
          <span class="color">
            {{statistics.order?statistics.order.carOrderAmount:''}}
          </span>
        </div>
        <div class="box-div">
          <span class="font" :class="{yellow:indicators==='aftersaleOrderAmount'}" @click="init('aftersaleOrderAmount')">售后金额（万）</span>
          <span class="color">
            {{statistics.order?statistics.order.aftersaleOrderAmount:''}}
          </span>
        </div>
        <div class="box-div">
          <span class="font" :class="{yellow:indicators==='carOrder'}" @click="init('carOrder')">整车销量</span>
          <span class="color">
            {{statistics.order?statistics.order.carOrder:''}}
          </span>
        </div>
        <div class="box-div">
          <span class="font" :class="{yellow:indicators==='saleCar'}" @click="init('saleCar')">交车数</span>
          <span class="color">
            {{statistics.order?statistics.order.saleCar:''}}
          </span>
        </div>
        <div class="box-div">
          <span class="font" :class="{yellow:indicators==='entryShop'}" @click="init('entryShop')">进厂台次</span>
          <span class="color">
            {{statistics.order?statistics.order.entryShop:''}}
          </span>
        </div>
      </el-card>
      <el-card class="box-card">
        <div class="box-div">
          <span class="font" :class="{yellow:indicators==='activity'}" @click="init('activity')">营促销活动</span>
          <span class="color">
            {{statistics.activity?statistics.activity.activity:''}}
          </span>
        </div>
        <div class="box-div">
          <span class="font" :class="{yellow:indicators==='activityAttend'}" @click="init('activityAttend')">活动参与人次</span>
          <span class="color">
            {{statistics.activity?statistics.activity.activityAttend:''}}
          </span>
        </div>
      </el-card>
    </div>
    <div class="card">
      <el-card class="box-card1">
        <div class="box-div">
          <span class="font" :class="{yellow:indicators==='customer'}" @click="init('customer')">新增潜客</span>
          <span class="color">
            {{statistics.customer?statistics.customer.customer:''}}
          </span>
        </div>
        <div class="box-div">
          <span class="font" :class="{yellow:indicators==='customerVisit'}" @click="init('customerVisit')">潜客回访</span>
          <span class="color">
            {{statistics.customer?statistics.customer.customerVisit:''}}
          </span>
        </div>
        <div class="box-div">
          <span class="font" :class="{yellow:indicators==='member'}" @click="init('member')">新增会员</span>
          <span class="color">
            {{statistics.member?statistics.member.member:''}}
          </span>
        </div>
        <div class="box-div">
          <span class="font" :class="{yellow:indicators==='memberAmount'}" @click="init('memberAmount')">新增会员储值（万）</span>
          <span class="color">
            {{statistics.member?statistics.member.memberAmount:''}}
          </span>
        </div>
      </el-card>
      <el-card class="box-card">
        <div class="box-div">
          <span class="font" :class="{yellow:indicators==='satisfaction'}" @click="init('satisfaction')">售后用户满意度</span>
          <span class="color">
            {{statistics.review?statistics.review.satisfaction:''}}
          </span>
        </div>
        <div class="box-div">
          <span class="font" :class="{yellow:indicators==='complain'}" @click="init('complain')">投诉数</span>
          <span class="color">
            {{statistics.review?statistics.review.complain:''}}
          </span>
        </div>
        <div class="box-div">
          <span class="font" :class="{yellow:indicators==='csAdminScore'}" @click="init('csAdminScore')">客服会话评分</span>
          <span class="color">
            {{statistics.csSession?statistics.csSession.csAdminScore:''}}
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
      indicators: 'orderAmount',
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
        indicator: indicator || 'orderAmount',
        roleType: '9'
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
        roleType: '9'
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
.general-static {
  display: flex;
  .card {
    width: 20%;
    font-size: 14px;
  }
  .yellow {
    color: #ff7300;
  }
  .box-card {
    // border: 2px solid #ff7300;
    height: 120px;
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
  .box-card1 {
    // border: 2px solid #ff7300;
    height: 220px;
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
