<template>
  <div class="general-view-analysis-car">
    <div slot="top">
      <show-search-grid @refreshHandle="refreshHandle" :showViewType="false">
        <div slot="description" class="description-pover">
          <p>物流量概况：统计物流量趋势</p>
          <p>物流公司分布：统计物流公司占比</p>
        </div>
      </show-search-grid>
    </div>
    <div class="total">
      <div class="column1">
        <div class="table-cell">
          发货量
          <div class="color-primary">
            <span class="font">{{summary.deliveryNumIncrease}}</span>
          </div>
          <div class="color-primary">
            环比
            <span :style="summary.deliveryNumInsMom>0?'color:red':'color:green'">
              <i :class="summary.deliveryNumInsMom>0?'iconfont biz-icon-i-sh-man-pullup':'iconfont biz-icon-i-sh-man-pulldown'"></i>
              {{summary.deliveryNumInsMom}}%
            </span>
            同比
            <span :style="summary.deliveryNumInsYoy>0?'color:red':'color:green'">
              <i :class="summary.deliveryNumInsYoy>0?'iconfont biz-icon-i-sh-man-pullup':'iconfont biz-icon-i-sh-man-pulldown'"></i>
              {{summary.deliveryNumInsYoy}}%
            </span>
          </div>
        </div>
      </div>
      <div class="column2">
        <div class="table-cell">
          物流费用
          <div class="color-primary">
            <span class="font">{{summary.deliveryAmountIncrease}}</span>元
          </div>
          <div class="color-primary">
            环比
            <span :style="summary.deliveryAmountInsMom>0?'color:red':'color:green'">
              <i :class="summary.deliveryAmountInsMom>0?'iconfont biz-icon-i-sh-man-pullup':'iconfont biz-icon-i-sh-man-pulldown'"></i>
              {{summary.deliveryAmountInsMom}}%
            </span>
            同比
            <span :style="summary.deliveryAmountInsYoy>0?'color:red':'color:green'">
              <i :class="summary.deliveryAmountInsYoy>0?'iconfont biz-icon-i-sh-man-pullup':'iconfont biz-icon-i-sh-man-pulldown'"></i>
              {{summary.deliveryAmountInsYoy}}%
            </span>
          </div>
        </div>
      </div>
    </div>
    <div class="chart-area">
      <div class="graph">
        <div class="header">
          <span>物流量概况</span>
          <span class="font">发货量</span>
          <i class="iconfont biz-icon-i-web-fd" @click="countAnalysis"></i>
        </div>
        <biz-chart :chartData="chartDataOfCount" :loading="loading" :showSearch="false"></biz-chart>
      </div>
      <div class="graph">
        <div class="header">
          <span>物流公司分布</span>
          <span class="font"></span>
          <i class="iconfont biz-icon-i-web-fd" @click="companyAnalysis"></i>
        </div>
        <biz-chart :chartData="chartDataOfCompany" :loading="loading" :showSearch="false"></biz-chart>
      </div>
    </div>
    <el-dialog :visible.sync="dialogVisible" :title="title" width="1200px" append-to-body>
      <CountAnalysis ref="countAnalysis" v-if="showCount" :params="params"></CountAnalysis>
      <CompanyAnalysis ref="companyAnalysis" v-if="showCompany" :params="params"></CompanyAnalysis>
    </el-dialog>
  </div>
</template>

<script>
import BizChart from '@/components/BizChart';
import dateTime from '@/utils/dateTime';
import http from '@/common/http';
import CountAnalysis from './CountAnalysis';
import CompanyAnalysis from './CompanyAnalysis';
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
      showCount: false,
      showCompany: false,
      title: '概览分析',
      summary: {},
      kpiName: ['本期', '同比', '环比'],
      chartData: {},
      chartDataOfCompany: {},
      chartDataOfCount: {},
      isShow: 'false'
    };
  },
  methods: {
    ...mapGetters(['getUser']),
    query() {
      this.init();
      this.getGraphCompanyData();
      this.getGraphCountData();
    },
    countAnalysis() {
      this.title = '物流量分析';
      this.showCompany = false;
      this.showCount = true;
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs.countAnalysis.load();
      });
    },
    companyAnalysis() {
      this.title = '物流公司分布';
      this.showCount = false;
      this.showCompany = true;
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs.companyAnalysis.load();
      });
    },
    init() {
      this.loading = true;
      let params = {
        type: 'delivery',
        indicators: ['deliveryNum', 'deliveryAmount'],
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
    // 物流公司分布
    getGraphCompanyData() {
      this.loading = true;
      let params = {
        type: 'deliveryCorp',
        indicators: ['deliveryCorp'],
        viewType: this.viewType,
        beginDate: this.beginDate,
        endDate: this.endDate,
        shopId: window.top.SHOP_ID || ''
      };
      http
        .post('/admin/ecommerce/kpi/order/graph/order/order.jhtml', params)
        .then(data => {
          this.chartDataOfCompany = this.dataCompanyFormat(data);
        })
        .catch(errData => {
          this.loading = false;
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    dataCompanyFormat(data) {
      let tmpData = [];
      for (let i = 0; i < data.indicators.length; i++) {
        tmpData.push({
          物流公司: data.indicators[i].xValue,
          单数: data.indicators[i].yValue
        });
      }
      let chartData = {
        type: 'histogram',
        legendVisible: false,
        data: {
          columns: ['物流公司', '单数'],
          rows: tmpData
        },
        settings: {}
      };
      return chartData;
    },
    // 物流量分布
    getGraphCountData() {
      this.loading = true;
      let params = {
        type: 'delivery',
        indicators: ['deliveryNum'],
        viewType: this.viewType,
        beginDate: this.beginDate,
        endDate: this.endDate,
        shopId: window.top.SHOP_ID || ''
      };
      http
        .post('/admin/ecommerce/kpi/order/graph/order/order.jhtml', params)
        .then(data => {
          this.chartDataOfCount = this.dataCountFormat(data);
        })
        .catch(errData => {
          this.loading = false;
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    dataCountFormat(data) {
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
          yAxisType: ['KMB', 'normal'],
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
      this.getGraphCompanyData();
      this.getGraphCountData();
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
    CountAnalysis,
    CompanyAnalysis,
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
