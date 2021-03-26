<template>
  <div class="general-view-analysis-order">
    <div slot="top">
      <show-search-grid @refreshHandle="refreshHandle" :showViewType="false">
        <div slot="description" class="description-pover">
          <p>销售分析：统计订单的销售趋势</p>
          <p>转化分析：统计商品的流量和转化情况</p>
          <p>服务分析：统计商品的售后情况、发货和满意度情况</p>
          <p>商品榜单：从各维度统计商品排行榜</p>
        </div>
      </show-search-grid>
    </div>
    <!-- <div class="indicators-search">
      <div class="title">店铺：</div>
      <el-checkbox-button v-model="checkAllShop" @change="handleCheckAllShop" :indeterminate="isIndeterminateShop">全部</el-checkbox-button>
      <el-checkbox-group v-model="checkedShop" @change="shopChange">
        <el-checkbox-button v-for="(condition,index)  in shopList" :label="condition.id" :key="index" size="mini">{{condition.name}}</el-checkbox-button>
      </el-checkbox-group>
    </div>-->
    <div class="total">
      <div class="column1">
        <div class="table-cell">
          订单数
          <div class="color-primary">
            <span class="font">{{summary.orderIncrease}}</span>个
          </div>
          <div class="color-primary">
            环比
            <span :style="summary.orderInsMom>0?'color:red':'color:green'">
              <i :class="summary.orderInsMom>0?'iconfont biz-icon-i-sh-man-pullup':'iconfont biz-icon-i-sh-man-pulldown'"></i>
              {{summary.orderInsMom}}%
            </span>
            同比
            <span :style="summary.orderInsYoy>0?'color:red':'color:green'">
              <i :class="summary.orderInsYoy>0?'iconfont biz-icon-i-sh-man-pullup':'iconfont biz-icon-i-sh-man-pulldown'"></i>
              {{summary.orderInsYoy}}%
            </span>
          </div>
        </div>
      </div>
      <div class="column2">
        <div class="table-cell">
          销售额
          <div class="color-primary">
            <span class="font">{{summary.orderAmountIncrease}}</span>万元
          </div>
          <div class="color-primary">
            环比
            <span :style="summary.orderAmountInsMom>0?'color:red':'color:green'">
              <i :class="summary.orderAmountInsMom>0?'iconfont biz-icon-i-sh-man-pullup':'iconfont biz-icon-i-sh-man-pulldown'"></i>
              {{summary.orderAmountInsMom}}%
            </span>
            同比
            <span :style="summary.orderAmountInsYoy>0?'color:red':'color:green'">
              <i :class="summary.orderAmountInsYoy>0?'iconfont biz-icon-i-sh-man-pullup':'iconfont biz-icon-i-sh-man-pulldown'"></i>
              {{summary.orderAmountInsYoy}}%
            </span>
          </div>
        </div>
      </div>
    </div>
    <div class="chart-area">
      <div class="graph">
        <div class="header">
          <span>销售分析</span>
          <span class="font">销售额</span>
          <i class="iconfont biz-icon-i-web-fd" @click="saleAnalysis"></i>
        </div>
        <biz-chart :chartData="chartData" :loading="loading" :showSearch="false"></biz-chart>
      </div>
      <div class="graph">
        <div class="header">
          <span>满意度分析</span>
          <span class="font"></span>
          <i class="iconfont biz-icon-i-web-fd" @click="satisfactionAnalysis"></i>
        </div>
        <biz-chart :chartData="chartDataOfSatisfaction" :loading="loading" :showSearch="false"></biz-chart>
      </div>
      <div class="graph">
        <div class="header">
          <span>热门分析</span>
          <span class="font">热销车型</span>
          <i class="iconfont biz-icon-i-web-fd" @click="hitAnalysis"></i>
        </div>
        <biz-chart :chartData="chartDataOfHit" :loading="loading" :showSearch="false"></biz-chart>
      </div>
    </div>
    <div class="chart-area">
      <div class="graph">
        <div class="header">
          <span>服务车辆分析</span>
          <span class="font">品牌</span>
          <i class="iconfont biz-icon-i-web-fd" @click="serviceAnalysis"></i>
        </div>
        <biz-chart :chartData="chartDataOfService" :loading="loading" :showSearch="false"></biz-chart>
      </div>
      <div class="graph">
        <div class="header">
          <span>救援分析</span>
          <span class="font">救援项目</span>
          <i class="iconfont biz-icon-i-web-fd" @click="rescueAnalysis"></i>
        </div>
        <biz-chart :chartData="chartDataOfRescue" :loading="loading" :showSearch="false"></biz-chart>
      </div>
      <div class="graph">
        <div class="header">
          <span>顾问分析</span>
          <span class="font">整车销售量</span>
          <i class="iconfont biz-icon-i-web-fd" @click="consultantAnalysis"></i>
        </div>
        <biz-chart :chartData="chartDataOfConsultant" :loading="loading" :showSearch="false"></biz-chart>
      </div>
    </div>
    <el-dialog :visible.sync="dialogVisible" :title="title" width="1200px" append-to-body>
      <GeneralViewAnalysisInfo ref="generalViewAnalysisInfo" v-if="showGenral" :params="params"></GeneralViewAnalysisInfo>
      <SatisfactionAnalysis ref="satisfactionAnalysis" v-if="showSatisfaction" :params="params"></SatisfactionAnalysis>
      <HitAnalysis ref="hitAnalysis" v-if="showHit" :params="params"></HitAnalysis>
      <ServiceAnalysis ref="serviceAnalysis" v-if="showService" :params="params"></ServiceAnalysis>
      <RescueAnalysis ref="rescueAnalysis" v-if="showRescue" :params="params"></RescueAnalysis>
      <ConsultantAnalysis ref="consultantAnalysis" v-if="showConsultant" :params="params"></ConsultantAnalysis>
    </el-dialog>
  </div>
</template>

<script>
import BizChart from '@/components/BizChart';
// import BizFilter from '@/components/BizTable/BizFilter';
import dateTime from '@/utils/dateTime';
import http from '@/common/http';
import GeneralViewAnalysisInfo from './GeneralViewAnalysisInfo';
import SatisfactionAnalysis from './SatisfactionAnalysis';
import HitAnalysis from './HitAnalysis';
import ServiceAnalysis from './ServiceAnalysis';
import RescueAnalysis from './RescueAnalysis';
import ConsultantAnalysis from './ConsultantAnalysis';
import ShowSearchGrid from '../components/ShowSearchGrid';
import { mapGetters } from 'vuex';

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
      pagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        total: 0
      },
      tableData: [],
      showRecommend: false,
      dialogVisible: false,
      showGenral: false,
      showSatisfaction: false,
      showHit: false,
      showService: false,
      showRescue: false,
      showConsultant: false,
      title: '概览分析',
      summary: {},
      kpiName: ['本期', '同比', '环比'],
      chartData: {},
      chartDataOfSatisfaction: {},
      chartDataOfHit: {},
      chartDataOfService: {},
      chartDataOfRescue: {},
      chartDataOfConsultant: {},
      isShow: 'false'
      // checkedShop: [],
      // shopList: [],
      // checkAllShop: true,
      // isIndeterminateShop: true
    };
  },
  methods: {
    ...mapGetters(['getUser']),
    // shopChange(val) {
    //   let checkedCount = val.length;
    //   this.checkAllShop = checkedCount === this.shopList.length;
    //   this.isIndeterminateShop = checkedCount > 0 && checkedCount < this.shopList.length;
    //   this.query();
    // },
    // handleCheckAllShop(val) {
    //   this.checkedShop = val
    //     ? this.shopList.map(item => {
    //       return item.id;
    //     })
    //     : [];
    //   this.query();
    // },
    // getShopList() {
    //   let param = {};
    //   if (this.getUser().roleLevel === 'shop') {
    //     this.shopList = [this.getUser().shop || ''];
    //   } else {
    //     http
    //       .get(urls.staticAnalisisi.vehicleShopList, param)
    //       .then(data => {
    //         this.shopList = data.stores;
    //       })
    //       .catch(errData => {
    //         if (errData.errorMessage) {
    //           this.$message.warning(errData.errorMessage);
    //         }
    //       });
    //   }
    //   this.checkedShop = this.params.checkedShop || [this.shopList[0].id] || [];
    //   this.query();
    // },
    query() {
      this.init();
      this.getGraphData();
      this.getGraphPieData();
      this.getGraphHitData();
      this.getGraphServiceData();
      this.getGraphRescueData();
      this.getGraphGeneralData();
    },
    saleAnalysis() {
      this.title = '销售分析';
      this.showSatisfaction = false;
      this.showHit = false;
      this.showService = false;
      this.showRescue = false;
      this.showConsultant = false;
      this.showGenral = true;
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs.generalViewAnalysisInfo.load();
      });
    },
    satisfactionAnalysis() {
      this.title = '满意度分析';
      this.showGenral = false;
      this.showHit = false;
      this.showService = false;
      this.showRescue = false;
      this.showConsultant = false;
      this.showSatisfaction = true;
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs.satisfactionAnalysis.load();
      });
    },
    hitAnalysis() {
      this.title = '热门分析';
      this.showGenral = false;
      this.showSatisfaction = false;
      this.showService = false;
      this.showRescue = false;
      this.showConsultant = false;
      this.showHit = true;
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs.hitAnalysis.load();
      });
    },
    serviceAnalysis() {
      this.title = '服务车辆分析';
      this.showGenral = false;
      this.showSatisfaction = false;
      this.showHit = false;
      this.showRescue = false;
      this.showConsultant = false;
      this.showService = true;
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs.serviceAnalysis.load();
      });
    },
    rescueAnalysis() {
      this.title = '救援分析';
      this.showGenral = false;
      this.showSatisfaction = false;
      this.showHit = false;
      this.showRescue = true;
      this.showConsultant = false;
      this.showService = false;
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs.rescueAnalysis.load();
      });
    },
    consultantAnalysis() {
      this.title = '顾问分析';
      this.showGenral = false;
      this.showSatisfaction = false;
      this.showHit = false;
      this.showRescue = false;
      this.showConsultant = true;
      this.showService = false;
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs.consultantAnalysis.load();
      });
    },
    init() {
      this.loading = true;
      let params = {
        shopId: window.top.SHOP_ID || '',
        beginDate: this.beginDate,
        endDate: this.endDate,
        type: 'orderSale',
        indicators: ['orderAmount', 'order', 'car'],
        // orderTypes: ['product'],
        viewType: this.viewType
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
    // 顾问分析
    getGraphGeneralData() {
      this.loading = true;
      let params = {
        type: 'orderConsultant',
        indicators: ['consultantCarCount'],
        viewType: this.viewType,
        beginDate: this.beginDate,
        endDate: this.endDate,
        shopId: window.top.SHOP_ID || ''
      };
      http
        .post('/admin/ecommerce/kpi/order/graph/order/order.jhtml', params)
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
    // 救援分析
    getGraphRescueData() {
      this.loading = true;
      let params = {
        type: 'orderResue',
        viewType: this.viewType,
        indicators: ['resueItem'],
        beginDate: this.beginDate,
        endDate: this.endDate,
        shopId: window.top.SHOP_ID || ''
      };
      http
        .post('/admin/ecommerce/kpi/order/graph/order/order.jhtml', params)
        .then(data => {
          this.chartDataOfRescue = this.dataRescueFormat(data);
        })
        .catch(errData => {
          this.loading = false;
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    dataRescueFormat(data) {
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
    // 服务车辆分析
    getGraphServiceData() {
      this.loading = true;
      let params = {
        type: 'orderServiceCar',
        viewType: this.viewType,
        indicators: ['carCondition'], // 车况
        beginDate: this.beginDate,
        endDate: this.endDate,
        shopId: window.top.SHOP_ID || ''
      };
      http
        .post('/admin/ecommerce/kpi/order/graph/order/order.jhtml', params)
        .then(data => {
          this.chartDataOfService = this.dataServiceFormat(data);
        })
        .catch(errData => {
          this.loading = false;
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    dataServiceFormat(data) {
      let tmpData = [];
      for (let i = 0; i < data.indicators.length; i++) {
        tmpData.push({
          服务车辆: data.indicators[i].xValue,
          车辆数: data.indicators[i].yValue
        });
      }
      let chartData = {
        type: 'histogram',
        legendVisible: false,
        data: {
          columns: ['服务车辆', '车辆数'],
          rows: tmpData
        },
        settings: {}
      };
      return chartData;
    },
    // 满意度分析
    getGraphPieData() {
      this.loading = true;
      let params = {
        type: 'orderSatisfaction',
        indicators: ['serviceAttitude', 'serviceSpeed', 'professional'],
        viewType: this.viewType,
        beginDate: this.beginDate,
        endDate: this.endDate,
        shopId: window.top.SHOP_ID || ''
      };
      http
        .post('/admin/ecommerce/kpi/order/graph/order/order.jhtml', params)
        .then(data => {
          this.chartDataOfSatisfaction = this.dataSatisfactionFormat(data);
        })
        .catch(errData => {
          this.loading = false;
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    dataSatisfactionFormat(data) {
      let tmpData = [];
      for (let i = 0; i < data.indicators.length; i++) {
        tmpData.push({
          日期: data.indicators[i].xValue,
          服务态度: data.indicators[i].y[0].yValue,
          服务速度: data.indicators[i].y[1].yValue,
          专业技能: data.indicators[i].y[2].yValue
        });
      }
      let chartData = {
        type: 'line',
        data: {
          columns: ['日期', '服务态度', '服务速度', '专业技能'],
          rows: tmpData
        },
        settings: {}
      };
      return chartData;
    },
    // 热门分析
    getGraphHitData() {
      this.loading = true;
      let params = {
        type: 'orderHot',
        indicators: ['hotCar'],
        beginDate: this.beginDate,
        endDate: this.endDate,
        viewType: this.viewType,
        shopId: window.top.SHOP_ID || ''
      };
      http
        .post('/admin/ecommerce/kpi/order/graph/order/order.jhtml', params)
        .then(data => {
          this.chartDataOfHit = this.dataHitFormat(data);
        })
        .catch(errData => {
          this.loading = false;
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    dataHitFormat(data) {
      let tmpData = [];
      for (let i = 0; i < data.indicators.length; i++) {
        tmpData.push({
          类型: data.indicators[i].xValue,
          数量: data.indicators[i].yValue
        });
      }
      let chartData = {
        type: 'histogram',
        legendVisible: false,
        data: {
          columns: ['类型', '数量'],
          rows: tmpData
        },
        settings: {}
      };
      return chartData;
    },
    // 销售分析
    getGraphData() {
      this.loading = true;
      let params = {
        type: 'productSafeAnalysis',
        viewType: this.viewType,
        indicators: ['safeAmountTrend'],
        beginDate: this.beginDate,
        endDate: this.endDate,
        shopId: window.top.SHOP_ID || ''
      };
      http
        .post('/admin/ecommerce/kpi/product/graph/product.jhtml', params)
        .then(data => {
          this.chartData = this.dataFormat(data);
        })
        .catch(errData => {
          this.loading = false;
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    refreshHandle(val) {
      this.viewType = val.viewType;
      this.beginDate = val.date[0];
      this.endDate = val.date[1];
      this.params = { viewType: this.viewType, beginDate: this.beginDate, endDate: this.endDate, dateType: val.dateType };
      this.query();
    },
    handleSizeChange(val) {
      this.pagination.pageSize = val;
    },
    handleCurrentChange(val) {
      this.pagination.currentPage = val;
    },
    dataFormat(data) {
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
          yAxisName: ['万元', '%'],
          showLine: [this.kpiName[1], this.kpiName[2]]
        }
      };
      return chartData;
    }
  },
  computed: {},
  created() {
    this.query();
  },
  components: {
    BizChart,
    GeneralViewAnalysisInfo,
    SatisfactionAnalysis,
    HitAnalysis,
    ServiceAnalysis,
    RescueAnalysis,
    ConsultantAnalysis,
    // ViewTypeSwich,
    ShowSearchGrid
  }
};
</script>

<style lang="scss">
.general-view-analysis-order {
  height: 100%;
  overflow: auto;
  margin: 20px 0px 20px 20px;
  padding-bottom: 20px;
  padding-right: 10px;
  min-width: 560px;
  .indicators-search {
    display: -webkit-box;
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
      width: 33%;
      height: 22vw;
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
