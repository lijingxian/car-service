<template>
  <div class="general-view-analysis-car">
    <div slot="top">
      <show-search-grid @refreshHandle="refreshHandle" :showViewType="false">
        <div slot="description" class="description-pover">
          <p>客服服务：统计客服会话变化情况</p>
          <p>顾问分析：统计客服顾问会话与工单处理分布情况</p>
          <p>工单分析：统计工单数变化情况</p>
          <p>异常分析：统计投诉及客户响应不及时情况</p>
        </div>
      </show-search-grid>
    </div>
    <div class="total">
      <div class="column1">
        <div class="table-cell">
          客服会话数
          <div class="color-primary"><span class="font">{{summary.sessionCnt.increase}}</span>人</div>
          <div class="color-primary">
            环比
            <span :style="summary.sessionCnt.monthOnMonth>0?'color:red':'color:green'"><i :class="summary.sessionCnt.monthOnMonth>0?'iconfont biz-icon-i-sh-man-pullup':'iconfont biz-icon-i-sh-man-pulldown'"></i>{{summary.sessionCnt.monthOnMonth}}%</span>
            同比
            <span :style="summary.sessionCnt.yearOnYear>0?'color:red':'color:green'"><i :class="summary.sessionCnt.yearOnYear>0?'iconfont biz-icon-i-sh-man-pullup':'iconfont biz-icon-i-sh-man-pulldown'"></i>{{summary.sessionCnt.yearOnYear}}%</span>
          </div>
        </div>
      </div>
      <div class="column2">
        <div class="table-cell">
          新增工单数
          <div class="color-primary"><span class="font">{{summary.workSheetCnt.increase}}</span>个</div>
          <div class="color-primary">
            环比
            <span :style="summary.workSheetCnt.monthOnMonth>0?'color:red':'color:green'"><i :class="summary.workSheetCnt.monthOnMonth>0?'iconfont biz-icon-i-sh-man-pullup':'iconfont biz-icon-i-sh-man-pulldown'"></i>{{summary.workSheetCnt.monthOnMonth}}%</span>
            同比
            <span :style="summary.workSheetCnt.yearOnYear>0?'color:red':'color:green'"><i :class="summary.workSheetCnt.yearOnYear>0?'iconfont biz-icon-i-sh-man-pullup':'iconfont biz-icon-i-sh-man-pulldown'"></i>{{summary.workSheetCnt.yearOnYear}}%</span>
          </div>
        </div>
      </div>
      <div class="column3">
        <div class="table-cell">
          客户满意度
          <div class="color-primary"><span class="font">{{summary.managerScore.increase}}</span>分</div>
          <div class="color-primary">
            环比
            <span :style="summary.managerScore.monthOnMonth>0?'color:red':'color:green'"><i :class="summary.managerScore.monthOnMonth>0?'iconfont biz-icon-i-sh-man-pullup':'iconfont biz-icon-i-sh-man-pulldown'"></i>{{summary.managerScore.monthOnMonth}}%</span>
            同比
            <span :style="summary.managerScore.yearOnYear>0?'color:red':'color:green'"><i :class="summary.managerScore.yearOnYear>0?'iconfont biz-icon-i-sh-man-pullup':'iconfont biz-icon-i-sh-man-pulldown'"></i>{{summary.managerScore.yearOnYear}}%</span>
          </div>
        </div>
      </div>
    </div>
    <div class="chart-area">
      <div class="graph">
        <div class="header">
          <span>客服服务</span>
          <span class="font">新增会话</span>
          <i class="iconfont biz-icon-i-web-fd" @click="customerServiceAnalysis"></i>
        </div>
        <biz-chart :chartData="chartDataOfCustomerService" :loading="loading" :showSearch="false"></biz-chart>
      </div>
      <div class="graph">
        <div class="header">
          <span>顾问分析</span>
          <span class="font">新增会话</span>
          <i class="iconfont biz-icon-i-web-fd" @click="consultantAnalysis"></i>
        </div>
        <biz-chart :chartData="chartDataOfConsultant" :loading="loading" :showSearch="false"></biz-chart>
      </div>
    </div>
    <div class="chart-area">
      <div class="graph">
        <div class="header">
          <span>工单分析</span>
          <span class="font">新增工单</span>
          <i class="iconfont biz-icon-i-web-fd" @click="workSheetAnalysis"></i>
        </div>
        <biz-chart :chartData="chartDataOfWorkSheet" :loading="loading" :showSearch="false"></biz-chart>
      </div>
      <div class="graph">
        <div class="header">
          <span>异常分析</span>
          <span class="font">客户满意度</span>
          <i class="iconfont biz-icon-i-web-fd" @click="abnormalAnalysis"></i>
        </div>
        <biz-chart :chartData="chartDataOfAbnormal" :loading="loading" :showSearch="false"></biz-chart>
      </div>
    </div>
    <el-dialog :visible.sync="dialogVisible" :title="title" width="1000px" append-to-body custom-class="service-dialog">
      <CustomerServiceAnalysis ref="customerServiceAnalysis" v-if="showCustomerService" :params="params"></CustomerServiceAnalysis>
      <ConsultantAnalysis ref="consultantAnalysis" v-if="showConsultant" :params="params"></ConsultantAnalysis>
      <AbnormalAnalysis ref="abnormalAnalysis" v-if="showAbnormal" :params="params"></AbnormalAnalysis>
      <WorkSheetAnalysis ref="workSheetAnalysis" v-if="showWorkSheet" :params="params"></WorkSheetAnalysis>
    </el-dialog>
  </div>
</template>

<script>
import BizChart from '@/components/BizChart';
// import BizFilter from '@/components/BizTable/BizFilter';
import dateTime from '@/utils/dateTime';
import http from '@/common/http';
import CustomerServiceAnalysis from './CustomerServiceAnalysis';
import ConsultantAnalysis from './ConsultantAnalysis';
import AbnormalAnalysis from './AbnormalAnalysis';
import WorkSheetAnalysis from './WorkSheetAnalysis';
import { mapGetters } from 'vuex';
import ShowSearchGrid from './components/ShowSearchGrid';
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
      className: 'el-icon-caret-bottom',
      showSwich: false,
      showHide: false,
      showRecommend: false,
      dialogVisible: false,
      showCustomerService: false,
      showConsultant: false,
      showAbnormal: false,
      showWorkSheet: false,
      title: '概览分析',
      summary: {
        sessionCnt: {},
        managerScore: {},
        workSheetCnt: {}
      },
      filters: [],
      kpiName: ['本期', '同比', '环比'],
      chartData: {},
      chartDataOfConsultant: {},
      chartDataOfCustomerService: {},
      chartDataOfWorkSheet: {},
      chartDataOfAbnormal: {},
      isShow: 'false'
    };
  },
  methods: {
    ...mapGetters(['getUser']),
    query() {
      this.params = {
        viewType: this.viewType,
        beginDate: this.beginDate,
        endDate: this.endDate,
        dateType: this.dateType
      };
      this.init();
      this.getGraphAbnormalData();
      this.getGraphWorkSheetData();
      this.getGraphConsultantData();
      this.getGraphCustomerServiceData();
    },
    customerServiceAnalysis() {
      this.title = '客服服务';
      this.showConsultant = false;
      this.showWorkSheet = false;
      this.showAbnormal = false;
      this.showCustomerService = true;
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs.customerServiceAnalysis.load();
      });
    },
    consultantAnalysis() {
      this.title = '顾问分析';
      this.showCustomerService = false;
      this.showWorkSheet = false;
      this.showAbnormal = false;
      this.showConsultant = true;
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs.consultantAnalysis.load();
      });
    },
    workSheetAnalysis() {
      this.title = '工单分析';
      this.showCustomerService = false;
      this.showConsultant = false;
      this.showAbnormal = false;
      this.showWorkSheet = true;
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs.workSheetAnalysis.load();
      });
    },
    abnormalAnalysis() {
      this.title = '异常分析';
      this.showCustomerService = false;
      this.showConsultant = false;
      this.showWorkSheet = false;
      this.showAbnormal = true;
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs.abnormalAnalysis.load();
      });
    },
    init() {
      this.loading = true;
      let params = {
        beginDate: this.beginDate,
        endDate: this.endDate,
        viewType: this.viewType
      };
      http
        .get('/admin/ecommerce/kpi/summary/service/service.jhtml', params)
        .then(data => {
          this.summary = Object.assign(this.summary, data.indicators);
        })
        .catch(errData => {
          this.loading = false;
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    // 异常分析
    getGraphAbnormalData() {
      this.loading = true;
      let params = {
        indicator: 'satisfaction',
        indicators: ['satisfaction'],
        type: 'orderSatisfaction',
        robotIds: this.checkedRobot,
        viewType: this.viewType,
        beginDate: this.beginDate,
        endDate: this.endDate
      };
      http
        .post('/admin/ecommerce/kpi/order/graph/order/order.jhtml', params)
        .then(data => {
          this.chartDataOfAbnormal = this.dataAbnormalFormat(data);
        })
        .catch(errData => {
          this.loading = false;
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    dataAbnormalFormat(data) {
      let tmpData = [];
      for (let i = 0; i < data.indicators.length; i++) {
        tmpData.push({
          日期: data.indicators[i].xValue,
          本期: data.indicators[i].y[0].yValue,
          同比: data.indicators[i].y[0].yYearOnYear,
          环比: data.indicators[i].y[0].yMonthOnMonth
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
          yAxisName: [this.indicatorValue === 'receptionDuration' ? '分钟' : '', '%'],
          showLine: [this.kpiName[1], this.kpiName[2]]
        }
      };
      return chartData;
    },
    // 工单分析
    getGraphWorkSheetData() {
      this.loading = true;
      let params = {
        indicator: 'workSheetCnt',
        viewType: this.viewType,
        beginDate: this.beginDate,
        endDate: this.endDate
      };
      http
        .post('/admin/ecommerce/kpi/graph/service/service/v2.jhtml', params)
        .then(data => {
          this.chartDataOfWorkSheet = this.dataWorkSheetFormat(data);
        })
        .catch(errData => {
          this.loading = false;
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    dataWorkSheetFormat(data) {
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
    // 顾问分布
    getGraphConsultantData() {
      this.loading = true;
      let params = {
        adminIds: [],
        indicator: 'sessionIns',
        viewType: this.viewType,
        beginDate: this.beginDate,
        endDate: this.endDate
      };
      http
        .post('/admin/ecommerce/kpi/graph/service/service/v2.jhtml', params)
        .then(data => {
          this.chartDataOfConsultant = this.dataConsultantFormat(data);
        })
        .catch(errData => {
          this.loading = false;
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    dataConsultantFormat(data) {
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
    // 客服服务
    getGraphCustomerServiceData() {
      this.loading = true;
      let params = {
        indicator: 'sessionIns',
        viewType: this.viewType,
        beginDate: this.beginDate,
        endDate: this.endDate
      };
      http
        .post('/admin/ecommerce/kpi/graph/service/service/v2.jhtml', params)
        .then(data => {
          this.chartDataOfCustomerService = this.dataCustomerServiceFormat(data);
        })
        .catch(errData => {
          this.loading = false;
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    dataCustomerServiceFormat(data) {
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
      this.getGraphConsultantData();
      this.getGraphCustomerServiceData();
      this.getGraphWorkSheetData();
      this.getGraphAbnormalData();
      this.init();
    },
    filterDataChange(val) {
      this.filters = val;
      this.getGraphConsultantData();
      this.getGraphWorkSheetData();
      this.getGraphAbnormalData();
      this.getGraphCustomerServiceData();
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
  computed: {
    toggleRecommendTxt() {
      if (this.showRecommend) {
        return '收起明细';
      }
      return '查看明细';
    }
  },
  created() {
    this.init();
    this.getGraphAbnormalData();
    this.getGraphWorkSheetData();
    this.getGraphConsultantData();
    this.getGraphCustomerServiceData();
  },
  components: {
    BizChart,
    CustomerServiceAnalysis,
    ConsultantAnalysis,
    WorkSheetAnalysis,
    AbnormalAnalysis,
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
