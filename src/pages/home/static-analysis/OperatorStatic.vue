<template>
  <div class="operatorAndStore-static">
    <div class="static-analysis">
      <ve-histogram :data="chartData" :colors="chartColors" :events="events" :height="height" :extend="chartExtend"></ve-histogram>
    </div>
    <div class="card">
      <el-card class="box-card">
        <div class="box-div">
          <span class="font" :class="{yellow:indicators==='member'}" @click="init('member')">会员</span>
          <span class="color">
            <a href="javascipt:;">{{statistics.member?statistics.member.member:''}}</a>
          </span>
        </div>
        <div class="box-div">
          <span class="font" :class="{yellow:indicators==='memberCard'}" @click="init('memberCard')">会员卡</span>
          <span class="color">
            <a href="javascipt:;">{{statistics.member?statistics.member.memberCard:''}}</a>
          </span>
        </div>
        <div class="box-div">
          <span class="font" :class="{yellow:indicators==='memberAmount'}" @click="init('memberAmount')">会员储值(万)</span>
          <span class="color">
            <a href="javascipt:;">{{statistics.member?statistics.member.memberAmount:''}}</a>
          </span>
        </div>
      </el-card>
      <el-card class="box-card">
        <div class="box-div1">
          <span class="font" :class="{yellow:indicators==='fleetClub'}" @click="init('fleetClub')">车友会</span>
          <span class="color">
            <a href="javascipt:;">{{statistics.fleet?statistics.fleet.fleetClub:''}}</a>
          </span>
        </div>
        <div class="box-div1">
          <span class="font" :class="{yellow:indicators==='fleetMember'}" @click="init('fleetMember')">车友会成员</span>
          <span class="color">
            <a href="javascipt:;">{{statistics.fleet?statistics.fleet.fleetMember:''}}</a>
          </span>
        </div>
        <div class="box-div1">
          <span class="font" :class="{yellow:indicators==='fleetActivity'}" @click="init('fleetActivity')">车友会活动</span>
          <span class="color">
            <a href="javascipt:;">{{statistics.fleet?statistics.fleet.fleetActivity:''}}</a>
          </span>
        </div>
        <div class="box-div1">
          <span class="font" :class="{yellow:indicators==='fleetActivityAttend'}" @click="init('fleetActivityAttend')">车友会活动参与人次</span>
          <span class="color">
            <a href="javascipt:;">{{statistics.fleet?statistics.fleet.fleetActivityAttend:''}}</a>
          </span>
        </div>
      </el-card>
    </div>
    <div class="card">
      <el-card class="box-card">
        <div class="box-div">
          <span class="font" :class="{yellow:indicators==='car'}" @click="init('car')">车辆</span>
          <span class="color">
            {{statistics.car?statistics.car.car:''}}
          </span>
        </div>
        <div class="box-div">
          <span class="font" :class="{yellow:indicators==='fleetGroup'}" @click="init('fleetGroup')">车队</span>
          <span class="color">
            {{statistics.fleet?statistics.fleet.fleetGroup:''}}
          </span>
        </div>
        <div class="box-div">
          <span class="font" :class="{yellow:indicators==='product'}" @click="init('product')">商品</span>
          <span class="color">
            <a href="javascipt:;">{{statistics.product?statistics.product.product:''}}</a>
          </span>
        </div>
      </el-card>
      <el-card class="box-card">
        <div class="box-div">
          <span class="font" :class="{yellow:indicators==='activity'}" @click="init('activity')">营促销活动</span>
          <span class="color">
            <a href="javascipt:;">{{statistics.activity?statistics.activity.activity:''}}</a>
          </span>
        </div>
        <div class="box-div">
          <span class="font" :class="{yellow:indicators==='activityAttend'}" @click="init('activityAttend')">活动参与人次</span>
          <span class="color">
            <a href="javascipt:;">{{statistics.activity?statistics.activity.activityAttend:''}}</a>
          </span>
        </div>
        <div class="box-div">
          <span class="font" :class="{yellow:indicators==='article'}" @click="init('article')">推送文章</span>
          <span class="color">
            <a href="javascipt:;">{{statistics.content?statistics.content.article:''}}</a>
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
      indicators: 'member',
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
        indicator: indicator || 'member',
        roleType: '2'
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
        roleType: '2'
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
.operatorAndStore-static {
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
    height: 170px;
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
