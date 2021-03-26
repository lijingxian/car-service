<template>
  <div class="general-view-analysis-car">
    <div slot="top">
      <show-search-grid @refreshHandle="refreshHandle" :showViewType="false">
        <div slot="description" class="description-pover">
          <p>成员状况：统计各车友会成员情况</p>
          <p>车友会排行：统计各车友会排名情况</p>
        </div>
      </show-search-grid>
    </div>
    <div class="indicators-search" :class="{'showHide1' : showHideFleet}">
      <div class="title">车友会：</div>
      <div class="hardGroupFleet" :class="{'showHideFleet' : showHideFleet}" ref="fleetGroup">
        <el-checkbox-button v-model="checkAllFleet" @change="handleCheckAllFleet" :indeterminate="isIndeterminateFleet">全部
        </el-checkbox-button>
        <el-tooltip placement="bottom" v-for="(condition,index)  in fleetList" :key="index" :disabled="condition.name.length<=10">
          <el-checkbox-group v-model="checkedFleet" @change="fleetChange">
            <el-checkbox-button :label="condition.id" size="mini">
              {{condition.name.length>10?condition.name.substr(0, 10)+'...':condition.name}}</el-checkbox-button>
          </el-checkbox-group>
          <div slot="content">{{ condition.name }}</div>
        </el-tooltip>
      </div>
    </div>
    <div class="swich" v-if="showSwichFleet">
      <i :class="className" @click="swichFleet"></i>
    </div>
    <div class="total">
      <div class="column1">
        <div class="table-cell">
          累计成员数
          <div class="color-primary"><span class="font">{{summary.memberNumCnt}}</span>人</div>
        </div>
      </div>
      <div class="column2">
        <div class="table-cell">
          当期新增成员数
          <div class="color-primary"><span class="font">{{summary1.memberNumInc}}</span>人</div>
          <div class="color-primary">
            环比
            <span :style="summary1.memberNumIncMon>0?'color:red':'color:green'"><i :class="summary1.memberNumIncMon>0?'iconfont biz-icon-i-sh-man-pullup':'iconfont biz-icon-i-sh-man-pulldown'"></i>{{summary1.memberNumIncMon}}%</span>
            同比
            <span :style="summary1.memberNumIncYoy>0?'color:red':'color:green'"><i :class="summary1.memberNumIncYoy>0?'iconfont biz-icon-i-sh-man-pullup':'iconfont biz-icon-i-sh-man-pulldown'"></i>{{summary1.memberNumIncYoy}}%</span>
          </div>
        </div>
      </div>
      <div class="column3">
        <div class="table-cell">
          当期活跃成员数
          <div class="color-primary"><span class="font">{{summary2.activeMemberNumCnt}}</span>人</div>
          <div class="color-primary">
            环比
            <span :style="summary2.activeMemberCntMon>0?'color:red':'color:green'"><i :class="summary2.activeMemberCntMon>0?'iconfont biz-icon-i-sh-man-pullup':'iconfont biz-icon-i-sh-man-pulldown'"></i>{{summary2.activeMemberCntMon}}%</span>
            同比
            <span :style="summary2.activeMemberCntYoy>0?'color:red':'color:green'"><i :class="summary2.activeMemberCntYoy>0?'iconfont biz-icon-i-sh-man-pullup':'iconfont biz-icon-i-sh-man-pulldown'"></i>{{summary2.activeMemberCntYoy}}%</span>
          </div>
        </div>
      </div>
    </div>
    <div class="chart-area">
      <div class="graph">
        <div class="header">
          <span>成员状况</span>
          <span class="font">新增成员数</span>
          <i class="iconfont biz-icon-i-web-fd" @click="conditionAnalysis"></i>
        </div>
        <biz-chart :chartData="chartDataOfCondition" :loading="loading" :showSearch="false"></biz-chart>
      </div>
      <div class="graph">
        <div class="header">
          <span>车友会排行</span>
          <span class="font">成员数</span>
          <i class="iconfont biz-icon-i-web-fd" @click="topAnalysis"></i>
        </div>
        <biz-chart :chartData="chartDataOfTop" :loading="loading" :showSearch="false"></biz-chart>
      </div>
    </div>
    <el-dialog :visible.sync="dialogVisible" :title="title" width="1200px" append-to-body>
      <ConditionAnalysis ref="conditionAnalysis" v-if="showCondition" :params="params"></ConditionAnalysis>
      <TopAnalysis ref="topAnalysis" v-if="showTop" :params="params"></TopAnalysis>
    </el-dialog>
  </div>
</template>

<script>
import BizChart from '@/components/BizChart';
// import BizFilter from '@/components/BizTable/BizFilter';
import dateTime from '@/utils/dateTime';
import http from '@/common/http';
import TopAnalysis from './TopAnalysis';
import ConditionAnalysis from './ConditionAnalysis';
import { mapGetters } from 'vuex';
import ShowSearchGrid from '../components/ShowSearchGrid';
import dateUtil from '@/utils/date';
export default {
  name: 'GeneralViewAnalysis',
  data() {
    return {
      params: {},
      loading: true,
      height: '500',
      beginDate: dateTime.getPreThreeMonthDay(),
      endDate: dateTime.today(),
      viewType: 'month',
      dateType: 'month',
      pagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        total: 0
      },
      tableData: [],
      hardGroupHeight: 0,
      hardGroupFleetHeight: 0,
      className: 'el-icon-caret-bottom',
      className1: 'el-icon-caret-bottom',
      showSwich: false,
      showHide: false,
      showSwichFleet: false,
      showHideFleet: false,
      showRecommend: false,
      dialogVisible: false,
      showCondition: false,
      showTop: false,
      checkedFleet: [],
      fleetList: [],
      checkAllFleet: true,
      isIndeterminateFleet: true,
      title: '概览分析',
      chartData: {},
      chartDataOfCondition: {},
      chartDataOfTop: {},
      kpiName: ['本期', '同比', '环比'],
      isShow: 'false',
      summary: {},
      summary1: {},
      summary2: {},
      arr: [
        { indicators: 'memberCnt' },
        { indicators: 'memberIns' },
        { indicators: 'activeMemberCnt' }
      ]
    };
  },
  methods: {
    ...mapGetters(['getUser']),
    fleetChange(val) {
      let checkedCount = val.length;
      this.checkAllFleet = checkedCount === this.fleetList.length;
      this.isIndeterminateFleet = checkedCount > 0 && checkedCount < this.fleetList.length;
      this.query();
    },
    handleCheckAllFleet(val) {
      this.checkedFleet = val ? this.fleetList.map(item => { return item.id; }) : [];
      this.query();
    },
    init(indicators, i) {
      this.loading = true;
      let params = {
        beginDate: this.beginDate,
        endDate: this.endDate,
        viewType: this.viewType,
        productCateGorys: this.checkedClass,
        indicators: [indicators],
        shopId: window.top.SHOP_ID || ''
      };
      http
        .post('/admin/ecommerce/kpi/friend/summary/fleet.jhtml', params)
        .then(data => {
          if (i === 0) {
            this.summary = data.indicators;
          } else if (i === 1) {
            this.summary1 = data.indicators;
          } else {
            this.summary2 = data.indicators;
          }
        })
        .catch(errData => {
          this.loading = false;
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    query() {
      this.params = {
        viewType: this.viewType,
        beginDate: this.beginDate,
        endDate: this.endDate,
        dateType: this.dateType,
        checkedFleet: this.checkedFleet
      };
      this.getGraphTopData();
      this.getGraphConditionData();
      for (let i = 0; i < this.arr.length; i++) {
        this.init(this.arr[i].indicators, i);
      }
    },
    getfleetList() {
      this.loading = true;
      let param = {
        pageNumber: 1,
        pageSize: 1000,
        fleetType: 'circle'
      };
      http
        .get('/admin/fleet/json/list.jhtml', param)
        .then(data => {
          this.loading = false;
          this.fleetList = data.content;
          this.checkedFleet = this.fleetList ? this.fleetList.map(item => { return item.id; }) : [];
          this.$nextTick(() => {
            this.hardGroupFleetHeight = document.getElementsByClassName('hardGroupFleet')[0].offsetHeight;
            console.log(this.hardGroupFleetHeight);
            if (this.hardGroupFleetHeight > 54) {
              this.showSwichFleet = true;
              this.showHideFleet = true;
            } else {
              this.showSwichFleet = false;
              this.showHideFleet = false;
            }
          });
          this.query();
        })
        .catch(error => {
          this.loading = false;
          if (error.errorMessage) {
            this.$message.warning(error.errorMessage);
          }
        });
    },
    swichFleet() {
      this.className = this.className === 'el-icon-caret-bottom' ? 'el-icon-caret-top' : 'el-icon-caret-bottom';
      this.showHideFleet = this.className === 'el-icon-caret-bottom';
      if (!this.showHideFleet) {
        document.getElementsByClassName('hardGroupFleet')[0].style.height = 'auto';
      } else {
        document.getElementsByClassName('hardGroupFleet')[0].style.height = '55px';
      }
    },
    conditionAnalysis() {
      this.title = '成员状况';
      this.showCondition = true;
      this.showTop = false;
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs.conditionAnalysis.load();
      });
    },
    topAnalysis() {
      this.title = '车友会排行';
      this.showTop = true;
      this.showCondition = false;
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs.topAnalysis.load();
      });
    },
    // 车友会排行
    getGraphTopData() {
      this.loading = true;
      let params = {
        viewType: this.viewType,
        beginDate: this.beginDate,
        endDate: this.endDate,
        fleets: this.checkedFleet,
        indicators: ['memberTop']
      };
      http
        .post('/admin/ecommerce/kpi/friend/graph/fleet.jhtml', params)
        .then(data => {
          this.chartDataOfTop = this.dataTopFormat(data);
        })
        .catch(errData => {
          this.loading = false;
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    dataTopFormat(data) {
      let tmpData = [];
      for (let i = 0; i < (data.indicators.length > 4 ? 4 : data.indicators.length); i++) {
        tmpData.push({
          成员数: data.indicators[i].xValue,
          人: data.indicators[i].yValue
        });
      }
      let chartData = {
        legendVisible: false,
        type: 'histogram',
        data: {
          columns: ['成员数', '人'],
          rows: tmpData
        },
        settings: {
          interval: 0,
          yAxisName: ['人']
        }
      };
      return chartData;
    },
    // 成员状况
    getGraphConditionData() {
      this.loading = true;
      let params = {
        viewType: this.viewType,
        beginDate: this.beginDate,
        endDate: this.endDate,
        fleets: this.checkedFleet,
        indicators: ['memberIns']
      };
      http
        .post('/admin/ecommerce/kpi/friend/graph/fleet.jhtml', params)
        .then(data => {
          this.chartDataOfCondition = this.dataConditionFormat(data);
        })
        .catch(errData => {
          this.loading = false;
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    dataConditionFormat(data) {
      let tmpData = [];
      for (let i = 0; i < data.indicators.length; i++) {
        tmpData.push({
          日期: data.indicators[i].xValue,
          本期: data.indicators[i].yValue,
          同比: data.indicators[i].yoyRate,
          环比: data.indicators[i].momRate
        });
      }
      let chartData = {
        type: 'histogram',
        data: {
          columns: ['日期', this.kpiName[0], this.kpiName[1], this.kpiName[2]],
          rows: tmpData
        },
        settings: {
          axisSite: { right: ['同比', '环比'] },
          yAxisType: ['KMB', 'KMB'],
          yAxisName: ['', '%'],
          showLine: [this.kpiName[1], this.kpiName[2]]
        }
      };
      return chartData;
    },
    refreshHandle(val) {
      this.viewType = val.viewType;
      this.beginDate = val.date[0];
      this.endDate = val.date[1];
      this.dateType = val.dateType;
      this.params = { viewType: this.viewType, beginDate: this.beginDate, endDate: this.endDate, dateType: val.dateType };
      this.getGraphConditionData();
      this.getGraphTopData();
    },
    handleSizeChange(val) {
      this.pagination.pageSize = val;
    },
    handleCurrentChange(val) {
      this.pagination.currentPage = val;
    },
    purposeConverter(row) {
      return `${row.purposeBrand} ${row.purposeSeries} ${row.purposeProduct}`;
    },
    createDateConverter(row) {
      if (!row.entryDate) return '';

      let date = new Date(row.entryDate);
      return dateUtil.dateConverter(date);
    },
    showTableList() {
      if (this.showRecommend) {
        this.isShow = true;
      } else {
        this.isShow = false;
      }
      this.showRecommend = !this.showRecommend;
    }
  },
  computed: {},
  watch: {},
  created() {
    this.getfleetList();
  },
  components: {
    BizChart,
    TopAnalysis,
    ConditionAnalysis,
    ShowSearchGrid
  }
};
</script>

<style lang="scss">
.general-view-analysis-car {
  height: 100%;
  overflow: auto;
  margin: 20px 0px 20px 20px;
  padding-bottom: 20px;
  padding-right: 10px;
  min-width: 560px;
  .indicators-search {
    display: -webkit-box;
    height: auto;
    .el-checkbox-button {
      padding: 15px;
    }
    .el-checkbox-button__inner {
      padding: 10px;
      font-size: 12px;
      border: none;
    }
    .el-checkbox-button:first-child .el-checkbox-button__inner {
      border: none;
      border-radius: 15px;
    }
    .el-checkbox-button:last-child .el-checkbox-button__inner {
      border-radius: 15px;
    }
    .el-checkbox-button,
    .el-checkbox-button__inner {
      border-radius: 15px;
    }
    .el-checkbox-button.is-checked .el-checkbox-button__inner {
      background-color: #f8d6ad;
      border-color: #fff;
      box-shadow: -1px 0 0 0 #fff;
      color: #ff7300;
    }
    .title {
      padding: 20px 10px;
      font-size: 12px;
      height: 100%;
    }
    .hardGroup {
      display: flex;
      width: calc(100% - 90px);
    }
    .hardGroupFleet {
      display: flex;
      width: calc(100% - 90px);
      flex-flow: wrap;
    }
    .hardSeriesGroup {
      display: flex;
      width: calc(100% - 90px);
    }
  }
  .swich {
    text-align: center;
    font-size: 24px;
    cursor: pointer;
    margin-top: -10px;
  }
  .showHide {
    height: 55px;
    overflow-y: hidden;
  }
  .showHide1 {
    height: 55px;
  }
  .showHideFleet {
    height: 55px;
    overflow-y: hidden;
  }
  .showSeriesHide {
    height: 55px;
    overflow-y: hidden;
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
      margin: 0px 20px 0px 0px;
      .table-cell {
        font-size: 15px;
      }
      .color-primary {
        font-size: 13px;
        .font {
          font-size: 32px;
          color: #000000;
          font-weight: bold;
        }
      }
    }
    .column2 {
      border: 1px solid #d9d9d9;
      padding: 20px;
      width: 350px;
      height: 155px;
      line-height: 40px;
      margin: 0px 0px 0px 20px;
      .table-cell {
        font-size: 15px;
      }
      .color-primary {
        font-size: 13px;
        .font {
          font-size: 32px;
          color: #000000;
          font-weight: bold;
        }
      }
    }
    .column3 {
      border: 1px solid #d9d9d9;
      padding: 20px;
      width: 350px;
      height: 155px;
      line-height: 40px;
      margin: 0px 5px 0px 20px;
      .table-cell {
        font-size: 15px;
      }
      .color-primary {
        font-size: 13px;
        .font {
          font-size: 32px;
          color: #000000;
          font-weight: bold;
        }
      }
    }
  }
  .chart-area {
    margin-top: 10px;
    display: flex;
    .graph {
      box-shadow: 0 2px 3px rgba(0, 0, 0, 0.1);
      margin-bottom: 20px;
      margin-right: 5px;
      width: 49%;
      height: 32vw;
      .header {
        height: 40px;
        background-color: #f7f7f7;
        font-size: 13px;
        padding: 10px;
        font-weight: 700;
        display: flex;
        justify-content: space-between;
        .font {
          color: #666666;
          font-weight: normal;
        }
        .iconfont {
          font-size: 26px;
          cursor: pointer;
        }
      }
      .filterSeach {
        margin-top: 10px;
        .type-range {
          float: right;
        }
      }
    }
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
