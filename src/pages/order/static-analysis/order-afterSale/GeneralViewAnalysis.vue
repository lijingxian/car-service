<template>
  <div class="general-view-analysis-car">
    <div slot="top">
      <show-search-grid @refreshHandle="refreshHandle" :showViewType="false">
        <div slot="description" class="description-pover">
          <p>售后退款分析：统计订单退货退货趋势</p>
          <p>售后原因分析：统计订单退款退货原因</p>
          <p>TOP退款商品：统计订单退款较高的商品</p>
          <p>TOP负面评价商品：统计评价较低的商品</p>
        </div>
      </show-search-grid>
    </div>
    <div class="total">
      <div class="column1">
        <div class="table-cell">
          售后退款次数
          <div class="color-primary">
            <span class="font">{{summary.afterSaleRefundNumIncrease}}</span>次
          </div>
          <div class="color-primary">
            环比
            <span :style="summary.afterSaleRefundNumInsMom>0?'color:red':'color:green'">
              <i :class="summary.afterSaleRefundNumInsMom>0?'iconfont biz-icon-i-sh-man-pullup':'iconfont biz-icon-i-sh-man-pulldown'"></i>
              {{summary.afterSaleRefundNumInsMom}}%
            </span>
            同比
            <span :style="summary.afterSaleRefundNumInsYoy>0?'color:red':'color:green'">
              <i :class="summary.afterSaleRefundNumInsYoy>0?'iconfont biz-icon-i-sh-man-pullup':'iconfont biz-icon-i-sh-man-pulldown'"></i>
              {{summary.afterSaleRefundNumInsYoy}}%
            </span>
          </div>
        </div>
      </div>
      <div class="column2">
        <div class="table-cell">
          退款总金额
          <div class="color-primary">
            <span class="font">{{summary.afterSaleRefundAmountIncrease}}</span>万元
          </div>
          <div class="color-primary">
            环比
            <span :style="summary.afterSaleRefundAmountInsMom>0?'color:red':'color:green'">
              <i :class="summary.afterSaleRefundAmountInsMom>0?'iconfont biz-icon-i-sh-man-pullup':'iconfont biz-icon-i-sh-man-pulldown'"></i>
              {{summary.afterSaleRefundAmountInsMom}}%
            </span>
            同比
            <span :style="summary.afterSaleRefundAmountInsYoy>0?'color:red':'color:green'">
              <i :class="summary.afterSaleRefundAmountInsYoy>0?'iconfont biz-icon-i-sh-man-pullup':'iconfont biz-icon-i-sh-man-pulldown'"></i>
              {{summary.afterSaleRefundAmountInsYoy}}%
            </span>
          </div>
        </div>
      </div>
      <div class="column3">
        <div class="table-cell">
          售后率
          <div class="color-primary">
            <span class="font">{{summary.afterSaleRefundRateIncrease}}</span>%
          </div>
          <div class="color-primary">
            环比
            <span :style="summary.afterSaleRefundRateInsMom>0?'color:red':'color:green'">
              <i :class="summary.afterSaleRefundRateInsMom>0?'iconfont biz-icon-i-sh-man-pullup':'iconfont biz-icon-i-sh-man-pulldown'"></i>
              {{summary.afterSaleRefundRateInsMom}}%
            </span>
            同比
            <span :style="summary.afterSaleRefundRateInsYoy>0?'color:red':'color:green'">
              <i :class="summary.afterSaleRefundRateInsYoy>0?'iconfont biz-icon-i-sh-man-pullup':'iconfont biz-icon-i-sh-man-pulldown'"></i>
              {{summary.afterSaleRefundRateInsYoy}}%
            </span>
          </div>
        </div>
      </div>
    </div>
    <div class="chart-area">
      <div class="graph">
        <div class="header">
          <span>售后退款分析</span>
          <span class="font">售后次数</span>
          <i class="iconfont biz-icon-i-web-fd" @click="refundsAnalysis"></i>
        </div>
        <biz-chart :chartData="chartDataOfRefunds" :loading="loading" :showSearch="false"></biz-chart>
      </div>
      <div class="graph">
        <div class="header">
          <span>售后原因分析</span>
          <span class="font"></span>
          <i class="iconfont biz-icon-i-web-fd" @click="reasonAnalysis"></i>
        </div>
        <biz-chart :chartData="chartDataOfReason" :loading="loading" :showSearch="false"></biz-chart>
      </div>
    </div>
    <div class="chart-area">
      <div class="graph">
        <div class="header">
          <span>TOP售后商品</span>
          <span class="font"></span>
          <i class="iconfont biz-icon-i-web-fd" @click="topAfterSaleAnalysis"></i>
        </div>
        <biz-chart :chartData="chartDataOfTopAfterSale" :loading="loading" :showSearch="false"></biz-chart>
      </div>
      <div class="graph">
        <div class="header">
          <span>TOP负面评价商品</span>
          <span class="font"></span>
          <i class="iconfont biz-icon-i-web-fd" @click="topReviewAnalysis"></i>
        </div>
        <biz-chart :chartData="chartDataOfTopReview" :loading="loading" :showSearch="false"></biz-chart>
      </div>
    </div>
    <el-dialog :visible.sync="dialogVisible" :title="title" width="1200px" append-to-body>
      <RefundsAnalysis ref="refundsAnalysis" v-if="showRefunds" :params="params"></RefundsAnalysis>
      <ReasonAnalysis ref="reasonAnalysis" v-if="showReason" :params="params"></ReasonAnalysis>
      <TopReviewAnalysis ref="topReviewAnalysis" v-if="showTopReview" :params="params"></TopReviewAnalysis>
      <TopAfterSaleAnalysis ref="topAfterSaleAnalysis" v-if="showTopAfterSale" :params="params"></TopAfterSaleAnalysis>
    </el-dialog>
  </div>
</template>

<script>
import BizChart from '@/components/BizChart';
// import BizFilter from '@/components/BizTable/BizFilter';
import dateTime from '@/utils/dateTime';
import http from '@/common/http';
import RefundsAnalysis from './RefundsAnalysis';
import ReasonAnalysis from './ReasonAnalysis';
import TopReviewAnalysis from './TopReviewAnalysis';
import TopAfterSaleAnalysis from './TopAfterSaleAnalysis';
import { mapGetters } from 'vuex';
import ShowSearchGrid from '../components/ShowSearchGrid';
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
      showRefunds: false,
      showReason: false,
      showTopReview: false,
      showTopAfterSale: false,
      title: '售后退款分析',
      summary: {},
      kpiName: ['本期', '同比', '环比'],
      chartData: {},
      chartDataOfReason: {},
      chartDataOfRefunds: {},
      chartDataOfTopAfterSale: {},
      chartDataOfTopReview: {},
      isShow: 'false'
    };
  },
  methods: {
    ...mapGetters(['getUser']),
    query() {
      this.init();
      this.getGraphTopReviewData();
      this.getGraphTopAfterSaleData();
      this.getGraphReasonData();
      this.getGraphRefundsData();
    },
    refundsAnalysis() {
      this.title = '售后退款分析';
      this.showReason = false;
      this.showTopAfterSale = false;
      this.showTopReview = false;
      this.showRefunds = true;
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs.refundsAnalysis.load();
      });
    },
    reasonAnalysis() {
      this.title = '售后原因分析';
      this.showRefunds = false;
      this.showTopAfterSale = false;
      this.showTopReview = false;
      this.showReason = true;
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs.reasonAnalysis.load();
      });
    },
    topAfterSaleAnalysis() {
      this.title = 'TOP售后商品';
      this.showRefunds = false;
      this.showReason = false;
      this.showTopReview = false;
      this.showTopAfterSale = true;
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs.topAfterSaleAnalysis.load();
      });
    },
    topReviewAnalysis() {
      this.title = 'TOP负面评价商品';
      this.showRefunds = false;
      this.showReason = false;
      this.showTopAfterSale = false;
      this.showTopReview = true;
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs.topReviewAnalysis.load();
      });
    },
    init() {
      this.loading = true;
      let params = {
        type: 'afterSaleRefund',
        indicators: ['afterSaleRefundNum', 'afterSaleRefundAmount', 'afterSaleRefundRate'],
        beginDate: this.beginDate,
        endDate: this.endDate,
        viewType: this.viewType,
        shopId: window.top.SHOP_ID || ''
      };
      http
        .post('/admin/ecommerce/kpi/order/summary/order/order.jhtml', params)
        .then(data => {
          this.summary = data.indicators;
        })
        .catch(errData => {
          this.loading = false;
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    // TOP负面评价商品
    getGraphTopReviewData() {
      this.loading = true;
      let params = {
        type: 'afterSaleProductView',
        indicators: ['afterSaleProductView'],
        viewType: this.viewType,
        beginDate: this.beginDate,
        endDate: this.endDate,
        shopId: window.top.SHOP_ID || ''
      };
      http
        .post('/admin/ecommerce/kpi/order/graph/order/order.jhtml', params)
        .then(data => {
          this.chartDataOfTopReview = this.dataTopReviewFormat(data);
        })
        .catch(errData => {
          this.loading = false;
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    dataTopReviewFormat(data) {
      let tmpData = [];
      for (let i = 0; i < data.indicators.length; i++) {
        tmpData.push({
          商品: data.indicators[i].xValue,
          商品评分: data.indicators[i].yValue
        });
      }
      let chartData = {
        type: 'histogram',
        legendVisible: false,
        data: {
          columns: ['商品', '商品评分'],
          rows: tmpData
        },
        settings: {}
      };
      return chartData;
    },
    // TOP售后商品
    getGraphTopAfterSaleData() {
      this.loading = true;
      let params = {
        type: 'afterSaleProduct',
        indicators: ['afterSaleProduct'],
        viewType: this.viewType,
        beginDate: this.beginDate,
        endDate: this.endDate,
        shopId: window.top.SHOP_ID || ''
      };
      http
        .post('/admin/ecommerce/kpi/order/graph/order/order.jhtml', params)
        .then(data => {
          this.chartDataOfTopAfterSale = this.dataTopAfterSaleFormat(data);
        })
        .catch(errData => {
          this.loading = false;
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    dataTopAfterSaleFormat(data) {
      let tmpData = [];
      for (let i = 0; i < data.indicators.length; i++) {
        tmpData.push({
          商品: data.indicators[i].xValue,
          售后次数: data.indicators[i].yValue
        });
      }
      let chartData = {
        type: 'histogram',
        legendVisible: false,
        data: {
          columns: ['商品', '售后次数'],
          rows: tmpData
        },
        settings: {}
      };
      return chartData;
    },
    // 售后原因分析
    getGraphReasonData() {
      this.loading = true;
      let params = {
        type: 'afterSaleReason',
        indicators: ['afterSaleReason'],
        viewType: this.viewType,
        beginDate: this.beginDate,
        endDate: this.endDate,
        shopId: window.top.SHOP_ID || ''
      };
      http
        .post('/admin/ecommerce/kpi/order/graph/order/order.jhtml', params)
        .then(data => {
          this.chartDataOfReason = this.dataReasonFormat(data);
        })
        .catch(errData => {
          this.loading = false;
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    dataReasonFormat(data) {
      let tmpData = [];
      for (let i = 0; i < data.indicators.length; i++) {
        tmpData.push({
          type: data.indicators[i].lable,
          value: data.indicators[i].value
        });
      }
      let chartData = {
        type: 'pie',
        legendVisible: false,
        data: {
          columns: ['type', 'value'],
          rows: tmpData
        },
        settings: {
          radius: ['20%', '60%'],
          offsetY: '50%'
        }
      };
      return chartData;
    },
    // 售后退款分析
    getGraphRefundsData() {
      this.loading = true;
      let params = {
        type: 'afterSaleRefund',
        indicators: ['afterSaleRefundNum'],
        viewType: this.viewType,
        beginDate: this.beginDate,
        endDate: this.endDate,
        shopId: window.top.SHOP_ID || ''
      };
      http
        .post('/admin/ecommerce/kpi/order/graph/order/order.jhtml', params)
        .then(data => {
          this.chartDataOfRefunds = this.dataRefundsFormat(data);
        })
        .catch(errData => {
          this.loading = false;
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    dataRefundsFormat(data) {
      let tmpData = [];
      for (let i = 0; i < data.indicators.length; i++) {
        tmpData.push({
          日期: data.indicators[i].xValue,
          本期: data.indicators[i].yValue,
          同比: data.indicators[i].yYearOnYear,
          环比: data.indicators[i].yMonthOnMonth
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
          yAxisType: ['normal', 'normal'],
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
      this.getGraphReasonData();
      this.getGraphRefundsData();
      this.getGraphTopAfterSaleData();
      this.getGraphTopReviewData();
      this.init();
    },
    handleSizeChange(val) {
      this.pagination.pageSize = val;
    },
    handleCurrentChange(val) {
      this.pagination.currentPage = val;
    }
  },
  computed: {},
  watch: {},
  created() {
    this.query();
  },
  components: {
    BizChart,
    RefundsAnalysis,
    ReasonAnalysis,
    TopAfterSaleAnalysis,
    TopReviewAnalysis,
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
  .showHideFleet {
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
