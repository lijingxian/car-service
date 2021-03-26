<template>
  <div class="general-view-analysis-car">
    <div slot="top">
      <show-search-grid @refreshHandle="refreshHandle" :showViewType="false" :filters="filters" @filterDataChange="filterDataChange">
        <div slot="description" class="description-pover">
          <p>新增车辆分布：统计新增车辆的分布情况</p>
          <p>累计车辆分布：统计累计车辆的分布情况</p>
          <p>新增变化趋势：统计新增车辆的变化趋势</p>
          <p>累计变化趋势：统计累计车辆的变化趋势</p>
        </div>
      </show-search-grid>
    </div>
    <!-- <div class="indicators-search">
      <div class="title">运营商：</div>
      <el-checkbox-button v-model="checkAllOperator" @change="handleCheckAllOperator" :indeterminate="isIndeterminateOperator">全部
      </el-checkbox-button>
      <el-checkbox-group v-model="checkedOperator" @change="operatorChange">
        <el-checkbox-button v-for="(condition,index)  in operatorList" :label="condition.id" :key="index" size="mini">
          {{condition.name}}</el-checkbox-button>
      </el-checkbox-group>
    </div> -->
    <!-- <div class="indicators-search" v-if="this.getUser().roleLevel !== 'shop'">
      <div class="title">店铺：</div>
      <el-checkbox-button v-model="checkAllShop" @change="handleCheckAllShop" :indeterminate="isIndeterminateShop">全部
      </el-checkbox-button>
      <el-checkbox-group v-model="checkedShop" @change="shopChange">
        <el-checkbox-button v-for="(condition,index)  in shopList" :label="condition.id" :key="index" size="mini">
          {{condition.name}}</el-checkbox-button>
      </el-checkbox-group>
    </div> -->
    <div class="indicators-search" :class="{'showHide1' : showHideFleet}">
      <div class="title">车队</div>
      <div class="hardGroupFleet" :class="{'showHideFleet' : showHideFleet}" ref="fleetGroup">
        <el-checkbox-button v-model="checkAllFleet" @change="handleCheckAllFleet" :indeterminate="isIndeterminateFleet">全部
        </el-checkbox-button>
        <el-tooltip placement="bottom" v-for="(item, index) in fleetList" :key="index" :disabled="item.name.length<=10">
          <el-checkbox-group v-model="checkedFleet" @change="fleetChange">
            <el-checkbox-button :label="item.id" size="mini">
              {{item.name.length>10?item.name.substr(0, 10)+'...':item.name}}
            </el-checkbox-button>
          </el-checkbox-group>
          <div slot="content">{{ item.name }}</div>
        </el-tooltip>
      </div>
    </div>
    <!-- <div class="swich" v-if="showSwichFleet">
      <i :class="className" @click="swichFleet"></i>
    </div> -->
    <div class="indicators-search" :class="{'showHide1' : showHide}">
      <div class="title">品牌</div>
      <div class="hardGroup" :class="{'showHide' : showHide}" ref="brandGroup">
        <el-checkbox-button v-model="checkAllBrand" @change="handleCheckAllBrand" :indeterminate="isIndeterminateBrand">全部
        </el-checkbox-button>
        <el-tooltip placement="bottom" v-for="(item, index) in brandList" :key="index" :disabled="item.length<=10">
          <el-checkbox-group v-model="checkedBrand" @change="brandChange">
            <el-checkbox-button :label="item" size="mini">
              {{item.length>10?item.substr(0, 10)+'...':item}}
            </el-checkbox-button>
          </el-checkbox-group>
          <div slot="content">{{ item }}</div>
        </el-tooltip>
      </div>
    </div>
    <div class="swich" v-if="showSwich">
      <i :class="className1" @click="swich"></i>
    </div>
    <div class="total">
      <div class="column1">
        <div class="table-cell">
          新增车辆数
          <div class="color-primary"><span class="font">{{summary.increase}}</span>辆</div>
          <div class="color-primary">
            环比
            <span :style="summary.insMom>0?'color:red':'color:green'"><i :class="summary.insMom>0?'iconfont biz-icon-i-sh-man-pullup':'iconfont biz-icon-i-sh-man-pulldown'"></i>{{summary.insMom}}%</span>
            同比
            <span :style="summary.insYoy>0?'color:red':'color:green'"><i :class="summary.insYoy>0?'iconfont biz-icon-i-sh-man-pullup':'iconfont biz-icon-i-sh-man-pulldown'"></i>{{summary.insYoy}}%</span>
          </div>
        </div>
      </div>
      <div class="column2">
        <div class="table-cell">
          累计车辆数
          <div class="color-primary"><span class="font">{{summary.total}}</span>辆</div>
          <div class="color-primary">
            环比
            <span :style="summary.insMom>0?'color:red':'color:green'"><i :class="summary.insMom>0?'iconfont biz-icon-i-sh-man-pullup':'iconfont biz-icon-i-sh-man-pulldown'"></i>{{summary.insMom}}%</span>
            同比
            <span :style="summary.insYoy>0?'color:red':'color:green'"><i :class="summary.insYoy>0?'iconfont biz-icon-i-sh-man-pullup':'iconfont biz-icon-i-sh-man-pulldown'"></i>{{summary.insYoy}}%</span>
          </div>
        </div>
      </div>
      <div class="column3">
        <div class="table-cell">
          在线车辆数
          <div class="color-primary"><span class="font">{{summary.online}}</span>辆</div>
        </div>
      </div>
    </div>
    <div class="chart-area">
      <div class="graph">
        <div class="header">
          <span>新增车辆分布</span>
          <span class="font">品牌车系</span>
          <i class="iconfont biz-icon-i-web-fd" @click="distributeInsAnalysis"></i>
        </div>
        <biz-chart :chartData="chartDataOfDistributeIns" :loading="loading" :showSearch="false"></biz-chart>
      </div>
      <div class="graph">
        <div class="header">
          <span>累计车辆分布</span>
          <span class="font">品牌车系</span>
          <i class="iconfont biz-icon-i-web-fd" @click="distributeCntAnalysis"></i>
        </div>
        <biz-chart :chartData="chartDataOfDistributeCnt" :loading="loading" :showSearch="false"></biz-chart>
      </div>
    </div>
    <div class="chart-area">
      <div class="graph">
        <div class="header">
          <span>新增变化趋势</span>
          <span class="font">新增趋势</span>
          <i class="iconfont biz-icon-i-web-fd" @click="trendInsAnalysis"></i>
        </div>
        <biz-chart :chartData="chartDataOfTrendIns" :loading="loading" :showSearch="false"></biz-chart>
      </div>
      <div class="graph">
        <div class="header">
          <span>累计变化趋势</span>
          <span class="font">累计趋势</span>
          <i class="iconfont biz-icon-i-web-fd" @click="trendCntAnalysis"></i>
        </div>
        <biz-chart :chartData="chartDataOfTrendCnt" :loading="loading" :showSearch="false"></biz-chart>
      </div>
    </div>
    <el-dialog :visible.sync="dialogVisible" :title="title" width="1200px" append-to-body>
      <DistributeInsAnalysis ref="distributeInsAnalysis" v-if="showDistributeIns" :params="params"></DistributeInsAnalysis>
      <DistributeCntAnalysis ref="distributeCntAnalysis" v-if="showDistributeCnt" :params="params"></DistributeCntAnalysis>
      <TrendCntAnalysis ref="trendCntAnalysis" v-if="showTrendCnt" :params="params"></TrendCntAnalysis>
      <TrendInsAnalysis ref="trendInsAnalysis" v-if="showTrendIns" :params="params"></TrendInsAnalysis>
    </el-dialog>
  </div>
</template>

<script>
import BizChart from '@/components/BizChart';
// import BizFilter from '@/components/BizTable/BizFilter';
import dateTime from '@/utils/dateTime';
import http from '@/common/http';
import DistributeInsAnalysis from './DistributeInsAnalysis';
import DistributeCntAnalysis from './DistributeCntAnalysis';
import TrendCntAnalysis from './TrendCntAnalysis';
import TrendInsAnalysis from './TrendInsAnalysis';
import { mapGetters } from 'vuex';
import ShowSearchGrid from '../components/ShowSearchGrid';
import dateUtil from '@/utils/date';
import urls from '@/common/urls';
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
      showDistributeIns: false,
      showDistributeCnt: false,
      showTrendCnt: false,
      showTrendIns: false,
      checkedOperator: [],
      operatorList: [],
      checkAllOperator: true,
      isIndeterminateOperator: true,
      checkedShop: [],
      shopList: [],
      checkAllShop: true,
      isIndeterminateShop: true,
      checkedFleet: [],
      fleetList: [],
      checkAllFleet: false,
      isIndeterminateFleet: true,
      checkedBrand: [],
      brandList: [],
      checkAllBrand: true,
      isIndeterminateBrand: true,
      title: '概览分析',
      summary: {},
      filters: [
        {
          type: 'select',
          label: '运营商',
          name: 'company',
          value: '',
          options: [{ label: '全部', value: '' }],
          class: 'hidden'
        },
        {
          type: 'select',
          label: '店铺',
          name: 'shop',
          value: '',
          options: [{ label: '全部', value: '' }],
          class: 'hidden'
        }
      ],
      kpiName: ['本期', '同比', '环比'],
      chartData: {},
      chartDataOfDistributeCnt: {},
      chartDataOfDistributeIns: {},
      chartDataOfTrendIns: {},
      chartDataOfTrendCnt: {},
      isShow: 'false'
    };
  },
  methods: {
    ...mapGetters(['getUser']),
    operatorChange() {},
    handleCheckAllOperator() {},
    shopChange(val) {
      let checkedCount = val.length;
      this.checkAllFleet = checkedCount === this.shopList.length;
      this.isIndeterminateShop = checkedCount > 0 && checkedCount < this.shopList.length;
      this.getBrandsList();
      this.query();
    },
    handleCheckAllShop(val) {
      this.checkedShop = val ? this.shopList.map(item => { return item.id; }) : [];
      this.query();
    },
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
    brandChange(val) {
      let checkedCount = val.length;
      this.checkAllBrand = checkedCount === this.brandList.length;
      this.isIndeterminateBrand = checkedCount > 0 && checkedCount < this.brandList.length;
      this.query();
    },
    handleCheckAllBrand(val) {
      this.checkedBrand = val ? this.brandList.map(item => { return item; }) : [];
      this.query();
    },
    filterDataChange(val) {
      this.filters = val;
      this.getShopList();
      this.filters[1].value && this.checkedShop.push(this.filters[1].value);
    },
    query() {
      this.params = {
        viewType: this.viewType,
        beginDate: this.beginDate,
        endDate: this.endDate,
        dateType: this.dateType,
        checkedShop: this.checkedShop,
        checkedFleet: this.checkedFleet,
        checkedBrand: this.checkedBrand
      };
      this.init();
      this.getGraphTrendCntData();
      this.getGraphTrendInsData();
      this.getGraphDistributeCntData();
      this.getGraphDistributeInsData();
    },
    getCompanyList() {
      http
        .get(urls.terminalMgmt.Component_queryOperators)
        .then(data => {
          console.log('运营商', data);
          this.companyList = [];
          if (data.content.length) {
            data.content.forEach(element => {
              this.filters[0].options.push({ label: element.name, value: element.id });
            });
            console.log('111', this.companyList);
            this.getShopList();
          }
        })
        .catch(error => {
          if (error.errorMessage) {
            this.$message.warning(error.errorMessage);
          }
        });
    },
    getShopList() {
      let param = {
        companyId: this.filters[0].value
      };
      http
        .get(urls.terminalMgmt.BaseInfo_queryShopList, param)
        .then(data => {
          console.log('店铺', data);
          this.filters[1].options = [{ label: '全部', value: '' }];
          if (data.shopDatas.length) {
            data.shopDatas.forEach(element => {
              this.filters[1].options.push({ label: element.name, value: element.id });
            });
          }
          this.getBrandsList();
          this.getfleetList();
        })
        .catch(error => {
          if (error.errorMessage) {
            this.$message.warning(error.errorMessage);
          }
        });
    },
    getBrandsList() {
      this.loading = true;
      console.log(this.filters);
      let param = {
        shopIds: this.checkedShop
      };
      http
        .post(urls.staticAnalisisi.vehicleBrandList, param)
        .then(data => {
          this.loading = false;
          this.brandList = data.brands;
          this.checkedBrand = this.brandList ? this.brandList : [];
          this.$nextTick(() => {
            this.hardGroupHeight = document.getElementsByClassName('hardGroup')[0].offsetHeight;
            if (this.hardGroupHeight > 62) {
              this.showSwich = true;
              this.showHide = true;
            } else {
              this.showSwich = false;
              this.showHide = false;
            }
          });
        })
        .catch(error => {
          this.loading = false;
          if (error.errorMessage) {
            this.$message.warning(error.errorMessage);
          }
        });
    },
    getfleetList() {
      this.loading = true;
      let param = {
        shopId: this.filters[1].value,
        pageNumber: 1,
        pageSize: 1000,
        fleetType: 'group'
      };
      http
        .get('/admin/fleet/json/list.jhtml', param)
        .then(data => {
          this.loading = false;
          this.fleetList = data.content;
          // this.checkedFleet = this.fleetList ? this.fleetList.map(item => { return item.id; }) : [];
          // this.$nextTick(() => {
          //   this.hardGroupFleetHeight = document.getElementsByClassName('hardGroupFleet')[0].offsetHeight;
          //   console.log(this.hardGroupFleetHeight);
          //   if (this.hardGroupFleetHeight > 54) {
          //     this.showSwichFleet = true;
          //     this.showHideFleet = true;
          //   } else {
          //     this.showSwichFleet = false;
          //     this.showHideFleet = false;
          //   }
          // });
          this.query();
        })
        .catch(error => {
          this.loading = false;
          if (error.errorMessage) {
            this.$message.warning(error.errorMessage);
          }
        });
    },
    swich() {
      this.className1 = this.className1 === 'el-icon-caret-bottom' ? 'el-icon-caret-top' : 'el-icon-caret-bottom';
      this.showHide = this.className1 === 'el-icon-caret-bottom';
      if (!this.showHide) {
        document.getElementsByClassName('hardGroup')[0].style.height = 'auto';
      } else {
        document.getElementsByClassName('hardGroup')[0].style.height = '55px';
      }
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
    distributeInsAnalysis() {
      this.title = '新增车辆分布';
      this.showDistributeCnt = false;
      this.showTrendIns = false;
      this.showTrendCnt = false;
      this.showDistributeIns = true;
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs.distributeInsAnalysis.load();
      });
    },
    distributeCntAnalysis() {
      this.title = '累计车辆分布';
      this.showDistributeIns = false;
      this.showTrendIns = false;
      this.showTrendCnt = false;
      this.showDistributeCnt = true;
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs.distributeCntAnalysis.load();
      });
    },
    trendInsAnalysis() {
      this.title = '新增变化趋势';
      this.showDistributeIns = false;
      this.showDistributeCnt = false;
      this.showTrendCnt = false;
      this.showTrendIns = true;
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs.trendInsAnalysis.load();
      });
    },
    trendCntAnalysis() {
      this.title = '累计变化趋势';
      this.showDistributeIns = false;
      this.showDistributeCnt = false;
      this.showTrendIns = false;
      this.showTrendCnt = true;
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs.trendCntAnalysis.load();
      });
    },
    init() {
      this.loading = true;
      let params = {
        beginDate: this.beginDate,
        endDate: this.endDate,
        viewType: this.viewType,
        shopIds: this.checkedShop,
        fleets: this.checkedFleet,
        brands: this.checkedBrand
      };
      http
        .post('/admin/ecommerce/kpi/car/summary/storeCar/summary.jhtml', params)
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
    // 累计变化趋势
    getGraphTrendCntData() {
      this.loading = true;
      let params = {
        indicator: 'carCnt',
        viewType: this.viewType,
        beginDate: this.beginDate,
        endDate: this.endDate,
        shopIds: this.checkedShop,
        fleets: this.checkedFleet,
        brands: this.checkedBrand
      };
      http
        .post('/admin/ecommerce/kpi/car/graph/trend.jhtml', params)
        .then(data => {
          this.chartDataOfTrendCnt = this.dataTrendCntFormat(data);
        })
        .catch(errData => {
          this.loading = false;
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    dataTrendCntFormat(data) {
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
          yAxisType: ['KMB', 'KMB'],
          yAxisName: ['', '%'],
          showLine: [this.kpiName[1], this.kpiName[2]]
        }
      };
      return chartData;
    },
    // 新增变化趋势
    getGraphTrendInsData() {
      this.loading = true;
      let params = {
        indicator: 'carIns',
        viewType: this.viewType,
        beginDate: this.beginDate,
        endDate: this.endDate,
        shopIds: this.checkedShop,
        fleets: this.checkedFleet,
        brands: this.checkedBrand
      };
      http
        .post('/admin/ecommerce/kpi/car/graph/trend.jhtml', params)
        .then(data => {
          this.chartDataOfTrendIns = this.dataTrendInsFormat(data);
        })
        .catch(errData => {
          this.loading = false;
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    dataTrendInsFormat(data) {
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
          yAxisType: ['KMB', 'KMB'],
          yAxisName: ['', '%'],
          showLine: [this.kpiName[1], this.kpiName[2]]
        }
      };
      return chartData;
    },
    // 累计车辆分布
    getGraphDistributeCntData() {
      this.loading = true;
      let params = {
        indicator: 'carBrandCnt',
        viewType: this.viewType,
        beginDate: this.beginDate,
        endDate: this.endDate,
        shopIds: this.checkedShop,
        fleets: this.checkedFleet,
        brands: this.checkedBrand
      };
      http
        .post('/admin/ecommerce/kpi/car/graph/distribute.jhtml', params)
        .then(data => {
          this.chartDataOfDistributeCnt = this.dataDistributeCntFormat(data);
        })
        .catch(errData => {
          this.loading = false;
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    dataDistributeCntFormat(data) {
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
    // 新增车辆分布
    getGraphDistributeInsData() {
      this.loading = true;
      let params = {
        indicator: 'carBrandIns',
        viewType: this.viewType,
        beginDate: this.beginDate,
        endDate: this.endDate,
        shopIds: this.checkedShop,
        fleets: this.checkedFleet,
        brands: this.checkedBrand
      };
      http
        .post('/admin/ecommerce/kpi/car/graph/distribute.jhtml', params)
        .then(data => {
          this.chartDataOfDistributeIns = this.dataDistributeInsFormat(data);
        })
        .catch(errData => {
          this.loading = false;
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    dataDistributeInsFormat(data) {
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
    refreshHandle(val) {
      this.viewType = val.viewType;
      this.beginDate = val.date[0];
      this.endDate = val.date[1];
      this.dateType = val.dateType;
      this.params = { viewType: this.viewType, beginDate: this.beginDate, endDate: this.endDate, dateType: val.dateType };
      this.getGraphDistributeCntData();
      this.getGraphDistributeInsData();
      this.getGraphTrendInsData();
      this.getGraphTrendCntData();
      this.init();
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
    },
    pokerHistory() {
      return this.filters[0].value;
    }
  },
  watch: {
    pokerHistory(newValue, oldValue) {
      this.filters[1].value = '';
    }
  },
  created() {
    if (this.getUser().roleLevel !== 'shop') {
      this.filters[0].class = 'show';
      this.filters[1].class = 'show';
      this.getCompanyList();
    } else {
      this.getShopList();
    }
  },
  components: {
    BizChart,
    DistributeInsAnalysis,
    DistributeCntAnalysis,
    TrendInsAnalysis,
    TrendCntAnalysis,
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
      flex-flow: wrap;
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
      margin: 0;
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
      margin: 0 20px 0 20px;
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
