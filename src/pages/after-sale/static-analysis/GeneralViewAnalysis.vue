<template>
  <div class="general-view-analysis">
    <div slot="top">
      <show-search-grid @refreshHandle="refreshHandle" :showViewType="false">
        <div slot="description" class="description-pover">
          <p>趋势分析：统计售后进厂台次及收入变化情况</p>
          <p>产值分析：统计售后维保收入变化情况</p>
          <p>占比分析：统计售后保养、维修、事故占比情况</p>
          <p>单车分析：统计单车产值变化情况</p>
          <p>顾问分析：统计各顾问销售分布情况</p>
          <p>服务质量：统计售后客户满意度变化情况</p>
        </div>
      </show-search-grid>
    </div>
    <div class="indicators-search" :class="{'showHide2' : showHideShop1}">
      <div class="title">店铺</div>
      <div class="hardShopGroup1" :class="{'showHideShop1' : showHideShop1}" ref="shopGroup">
        <el-checkbox-button v-model="checkAllShops" @change="handleCheckAllShops" :indeterminate="isIndeterminateShops">全部
        </el-checkbox-button>
        <el-tooltip placement="bottom" v-for="(item, index) in conditionData.shopsList" :key="index" :disabled="item.name.length<=10">
          <el-checkbox-group :min="1" v-model="checkedShops" @change="shopsChange">
            <el-checkbox-button :label="item.id" size="mini">
              {{item.name.length>10?item.name.substr(0, 10)+'...':item.name}}
            </el-checkbox-button>
          </el-checkbox-group>
          <div slot="content">{{ item.name }}</div>
        </el-tooltip>
      </div>
    </div>
    <div class="swichShop1" v-if="showShopSwich1">
      <i :class="classNameShop1" @click="swichShop1"></i>
    </div>
    <div class="total">
      <div class="column1">
        <div class="table-cell">
          进厂台次
          <div class="color-primary">
            <span class="font">{{summary.entryCnt.yValue}}</span>台
          </div>
          <div class="color-primary">
            环比
            <span :style="summary.entryCnt.momRate>0?'color:red':'color:green'">
              <i
                :class="summary.entryCnt.momRate>0?'iconfont biz-icon-i-sh-man-pullup':'iconfont biz-icon-i-sh-man-pulldown'"></i>
              {{summary.entryCnt.momRate}}%
            </span>
            同比
            <span :style="summary.entryCnt.yoyRate>0?'color:red':'color:green'">
              <i
                :class="summary.entryCnt.yoyRate>0?'iconfont biz-icon-i-sh-man-pullup':'iconfont biz-icon-i-sh-man-pulldown'"></i>
              {{summary.entryCnt.yoyRate}}%
            </span>
          </div>
        </div>
      </div>
      <div class="column2">
        <div class="table-cell">
          售后产值
          <div class="color-primary">
            <span class="font">{{summary.aftersaleAmount.yValue}}</span>万元
          </div>
          <div class="color-primary">
            环比
            <span :style="summary.aftersaleAmount.momRate>0?'color:red':'color:green'">
              <i
                :class="summary.aftersaleAmount.momRate>0?'iconfont biz-icon-i-sh-man-pullup':'iconfont biz-icon-i-sh-man-pulldown'"></i>
              {{summary.aftersaleAmount.momRate}}%
            </span>
            同比
            <span :style="summary.aftersaleAmount.yoyRate>0?'color:red':'color:green'">
              <i
                :class="summary.aftersaleAmount.yoyRate>0?'iconfont biz-icon-i-sh-man-pullup':'iconfont biz-icon-i-sh-man-pulldown'"></i>
              {{summary.aftersaleAmount.yoyRate}}%
            </span>
          </div>
        </div>
      </div>
      <div class="column3">
        <div class="table-cell">
          售后投诉
          <div class="color-primary">
            <span class="font">{{summary.aftersaleComplaint.yValue}}</span>个
          </div>
          <div class="color-primary">
            环比
            <span :style="summary.aftersaleComplaint.momRate>0?'color:red':'color:green'">
              <i
                :class="summary.aftersaleComplaint.momRate>0?'iconfont biz-icon-i-sh-man-pullup':'iconfont biz-icon-i-sh-man-pulldown'"></i>
              {{summary.aftersaleComplaint.momRate}}%
            </span>
            同比
            <span :style="summary.aftersaleComplaint.yoyRate>0?'color:red':'color:green'">
              <i
                :class="summary.aftersaleComplaint.yoyRate>0?'iconfont biz-icon-i-sh-man-pullup':'iconfont biz-icon-i-sh-man-pulldown'"></i>
              {{summary.aftersaleComplaint.yoyRate}}%
            </span>
          </div>
        </div>
      </div>
    </div>
    <div class="chart-area">
      <div class="graph">
        <div class="header">
          <span>趋势分析</span>
          <span class="font">进厂台次</span>
          <i class="iconfont biz-icon-i-web-fd" @click="tableNumberAnalysis"></i>
        </div>
        <biz-chart :chartData="chartData" :loading="loading" :showSearch="false"></biz-chart>
      </div>
      <div class="graph">
        <div class="header">
          <span>用户分群</span>
          <span class="font">车龄分布</span>
          <i class="iconfont biz-icon-i-web-fd" @click="outValueAnalysis"></i>
        </div>
        <biz-chart :chartData="chartDataOfOutValue" :loading="loading" :showSearch="false"></biz-chart>
      </div>
      <div class="graph">
        <div class="header">
          <span>占比分析</span>
          <span class="font">维保占比</span>
          <i class="iconfont biz-icon-i-web-fd" @click="scaleAnalysis"></i>
        </div>
        <biz-chart :chartData="chartDataOfScale" :loading="loading" :showSearch="false"></biz-chart>
      </div>
    </div>
    <div class="chart-area">
      <div class="graph">
        <div class="header">
          <span>单车分析</span>
          <span class="font">单车产值</span>
          <i class="iconfont biz-icon-i-web-fd" @click="singleCarAnalysis"></i>
        </div>
        <biz-chart :chartData="chartDataOfSingleCar" :loading="loading" :showSearch="false"></biz-chart>
      </div>
      <div class="graph">
        <div class="header">
          <span>顾问分析</span>
          <span class="font">顾问分布</span>
          <i class="iconfont biz-icon-i-web-fd" @click="consultantAnalysis"></i>
        </div>
        <biz-chart :chartData="chartDataOfConsultant" :loading="loading" :showSearch="false"></biz-chart>
      </div>
      <div class="graph">
        <div class="header">
          <span>服务质量</span>
          <span class="font">售后投诉</span>
          <i class="iconfont biz-icon-i-web-fd" @click="serviceAnalysis"></i>
        </div>
        <biz-chart :chartData="chartDataOfService" :loading="loading" :showSearch="false"></biz-chart>
      </div>
    </div>
    <el-dialog :visible.sync="dialogVisible" :title="title" width="1200px" append-to-body>
      <GeneralViewAnalysisInfo ref="generalViewAnalysisInfo" v-if="showGenral" :params="params"></GeneralViewAnalysisInfo>
      <OutValueAnalysis ref="outValueAnalysis" v-if="showOutValue" :params="params"></OutValueAnalysis>
      <ScaleAnalysis ref="scaleAnalysis" v-if="showScale" :params="params"></ScaleAnalysis>
      <SingleCarAnalysis ref="singleCarAnalysis" v-if="showSingleCar" :params="params"></SingleCarAnalysis>
      <ServiceAnalysis ref="serviceAnalysis" v-if="showService" :params="params"></ServiceAnalysis>
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
import OutValueAnalysis from './OutValueAnalysis';
import ScaleAnalysis from './ScaleAnalysis';
import SingleCarAnalysis from './SingleCarAnalysis';
import ServiceAnalysis from './ServiceAnalysis';
import ConsultantAnalysis from './ConsultantAnalysis';
import ShowSearchGrid from './components/ShowSearchGrid';
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
      isIndeterminateShops: true,
      checkAllShops: false,
      checkedShops: [],
      className: 'el-icon-caret-bottom',
      classNameShop1: 'el-icon-caret-bottom',
      showHideShop1: false,
      showShopSwich1: false,
      hardGroupShopHeight1: 0,
      showSwich: false,
      showHide: false,
      conditionData: {
        shopsList: []
      },
      showRecommend: false,
      dialogVisible: false,
      showGenral: false,
      showOutValue: false,
      showScale: false,
      showSingleCar: false,
      showService: false,
      showConsultant: false,
      title: '概览分析',
      summary: {
        aftersaleAmount: {},
        entryCnt: {},
        aftersaleComplaint: {}
      },
      kpiName: ['本期', '同比', '环比'],
      chartData: {},
      chartDataOfOutValue: {},
      chartDataOfScale: {},
      chartDataOfSingleCar: {},
      chartDataOfService: {},
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
    handleCheckAllShops(val) {
      this.checkedShops = val
        ? this.conditionData.shopsList.map(item => {
          return item.id;
        })
        : [this.getUser().shop.id];
      this.query();
    },
    shopsChange(val) {
      let checkedCount = val.length;
      this.checkAllShops = checkedCount === this.conditionData.shopsList.length;
      this.isIndeterminateShops = checkedCount > 0 && checkedCount < this.conditionData.shopsList.length;
      this.query();
    },
    getShopList() {
      let param = {
        sourceType: '5'
      };
      http
        .get('/admin/member/json/findEShops.jhtml', param)
        .then(data => {
          this.conditionData.shopsList = data.shops;
          this.checkedShops = [this.getUser().shop.id];
          this.$nextTick(() => {
            this.hardGroupShopHeight1 = document.getElementsByClassName('hardShopGroup1')[0].offsetHeight;
            console.log(this.hardGroupShopHeight1);
            if (this.hardGroupShopHeight1 > 55) {
              this.showShopSwich1 = true;
              this.showHideShop1 = true;
            } else {
              this.showShopSwich1 = false;
              this.showHideShop1 = false;
            }
          });
          this.query();
        })
        .catch(error => {
          if (error.errorMessage) {
            this.$message.warning(error.errorMessage);
          }
        });
    },
    query() {
      this.params = Object.assign(this.params, { checkedShops: this.checkedShops });
      this.init();
      this.getGraphData();
      this.getGraphPieData();
      this.getGraphScaleData();
      this.getGraphSingleCarData();
      this.getGraphServiceData();
      this.getGraphGeneralData();
    },
    tableNumberAnalysis() {
      this.title = '台次分析';
      this.showOutValue = false;
      this.showScale = false;
      this.showSingleCar = false;
      this.showService = false;
      this.showConsultant = false;
      this.showGenral = true;
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs.generalViewAnalysisInfo.load();
      });
    },
    outValueAnalysis() {
      this.title = '用户分群';
      this.showGenral = false;
      this.showScale = false;
      this.showSingleCar = false;
      this.showService = false;
      this.showConsultant = false;
      this.showOutValue = true;
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs.outValueAnalysis.load();
      });
    },
    scaleAnalysis() {
      this.title = '占比分析';
      this.showGenral = false;
      this.showOutValue = false;
      this.showSingleCar = false;
      this.showService = false;
      this.showConsultant = false;
      this.showScale = true;
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs.scaleAnalysis.load();
      });
    },
    singleCarAnalysis() {
      this.title = '单车分析';
      this.showGenral = false;
      this.showOutValue = false;
      this.showScale = false;
      this.showService = false;
      this.showConsultant = false;
      this.showSingleCar = true;
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs.singleCarAnalysis.load();
      });
    },
    serviceAnalysis() {
      this.title = '服务质量';
      this.showGenral = false;
      this.showOutValue = false;
      this.showScale = false;
      this.showService = true;
      this.showConsultant = false;
      this.showSingleCar = false;
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs.serviceAnalysis.load();
      });
    },
    consultantAnalysis() {
      this.title = '顾问分析';
      this.showGenral = false;
      this.showOutValue = false;
      this.showScale = false;
      this.showService = false;
      this.showConsultant = true;
      this.showSingleCar = false;
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs.consultantAnalysis.load();
      });
    },
    init() {
      this.loading = true;
      let params = {
        shopIds: this.checkedShops,
        beginDate: this.beginDate,
        endDate: this.endDate,
        // orderTypes: ['product'],
        viewType: this.viewType
      };
      http
        .post('/admin/ecommerce/kpi/afterSales/overview.jhtml', params)
        .then(data => {
          this.summary = data;
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
        shopIds: this.checkedShops,
        type: '4',
        indicator: '0',
        viewType: this.viewType,
        beginDate: this.beginDate,
        endDate: this.endDate,
        shopId: window.top.SHOP_ID || ''
      };
      http
        .post('/admin/ecommerce/kpi/afterSales/graph.jhtml', params)
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
    // 服务质量
    getGraphServiceData() {
      this.loading = true;
      let params = {
        orderTypes: ['rescue', 'service'],
        shopIds: this.checkedShops,
        type: '5',
        viewType: this.viewType,
        indicator: '3',
        indicators: ['3'],
        beginDate: this.beginDate,
        endDate: this.endDate,
        shopId: window.top.SHOP_ID || ''
      };
      http
        .post('/admin/ecommerce/kpi/afterSales/graph.jhtml', params)
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
          时间: data.indicators[i].xValue,
          次: data.indicators[i].yValue
        });
      }
      let chartData = {
        legendVisible: false,
        type: 'histogram',
        data: {
          columns: ['时间', '次'],
          rows: tmpData
        },
        settings: {}
      };
      return chartData;
    },
    // 单车分析
    getGraphSingleCarData() {
      this.loading = true;
      let params = {
        shopIds: this.checkedShops,
        type: '3',
        viewType: this.viewType,
        indicator: '0', // 车况
        beginDate: this.beginDate,
        endDate: this.endDate,
        shopId: window.top.SHOP_ID || ''
      };
      http
        .post('/admin/ecommerce/kpi/afterSales/graph.jhtml', params)
        .then(data => {
          this.chartDataOfSingleCar = this.dataSingleCarFormat(data);
        })
        .catch(errData => {
          this.loading = false;
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    dataSingleCarFormat(data) {
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
    },
    // 产值分析
    getGraphPieData() {
      this.loading = true;
      let params = {
        shopIds: this.checkedShops,
        type: '6',
        indicator: '0',
        viewType: this.viewType,
        beginDate: this.beginDate,
        endDate: this.endDate,
        shopId: window.top.SHOP_ID || ''
      };
      http
        .post('/admin/ecommerce/kpi/afterSales/graph.jhtml', params)
        .then(data => {
          this.chartDataOfOutValue = this.dataOutValueFormat(data);
        })
        .catch(errData => {
          this.loading = false;
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    dataOutValueFormat(data) {
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
    },
    // 占比分析
    getGraphScaleData() {
      this.loading = true;
      let params = {
        shopIds: this.checkedShops,
        type: '2',
        indicator: '0',
        beginDate: this.beginDate,
        endDate: this.endDate,
        viewType: this.viewType,
        shopId: window.top.SHOP_ID || ''
      };
      http
        .post('/admin/ecommerce/kpi/afterSales/graph.jhtml', params)
        .then(data => {
          this.chartDataOfScale = this.dataScaleFormat(data);
        })
        .catch(errData => {
          this.loading = false;
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    dataScaleFormat(data) {
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
    },
    // 台次分析
    getGraphData() {
      this.loading = true;
      let params = {
        shopIds: this.checkedShops,
        type: '0',
        viewType: this.viewType,
        indicator: '0',
        beginDate: this.beginDate,
        endDate: this.endDate,
        shopId: window.top.SHOP_ID || ''
      };
      http
        .post('/admin/ecommerce/kpi/afterSales/graph.jhtml', params)
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
      console.log(val);
      this.viewType = val.viewType;
      this.beginDate = val.date[0];
      this.endDate = val.date[1];
      this.params = {
        viewType: this.viewType,
        beginDate: this.beginDate,
        endDate: this.endDate,
        dateType: val.dateType,
        checkedShops: this.checkedShops
      };
      this.query();
    },
    handleSizeChange(val) {
      this.pagination.pageSize = val;
    },
    handleCurrentChange(val) {
      this.pagination.currentPage = val;
    },
    swichShop1() {
      this.classNameShop1 = this.classNameShop1 === 'el-icon-caret-bottom' ? 'el-icon-caret-top' : 'el-icon-caret-bottom';
      this.showHideShop1 = this.classNameShop1 === 'el-icon-caret-bottom';
      if (!this.showHideShop1) {
        document.getElementsByClassName('hardShopGroup1')[0].style.height = 'auto';
      } else {
        document.getElementsByClassName('hardShopGroup1')[0].style.height = '55px';
      }
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
          yAxisName: ['台', '%'],
          showLine: [this.kpiName[1], this.kpiName[2]]
        }
      };
      return chartData;
    }
  },
  computed: {},
  created() {
    this.getShopList();
  },
  components: {
    BizChart,
    GeneralViewAnalysisInfo,
    OutValueAnalysis,
    ScaleAnalysis,
    SingleCarAnalysis,
    ServiceAnalysis,
    ConsultantAnalysis,
    // ViewTypeSwich,
    ShowSearchGrid
  }
};
</script>

<style lang="scss">
.general-view-analysis {
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
  .swichShop1 {
    text-align: center;
    font-size: 24px;
    cursor: pointer;
    margin-top: -10px;
  }
  .showHideOperator1 {
    height: 55px;
    overflow-y: hidden;
  }
  .showHideShop1 {
    height: 55px;
    overflow-y: hidden;
  }
  .hardShopGroup1 {
    display: flex;
    width: calc(100% - 90px);
    flex-flow: wrap;
  }
  .showHide2 {
    height: 55px;
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
