<template>
  <div class="general-view-analysis-car">
    <div slot="top">
      <show-search-grid @refreshHandle="refreshHandle" :showViewType="false">
        <div slot="description" class="description-pover">
          <p>库存分析：在库商品分类分布以及商品在库数量排行情况</p>
          <p>入库分析：入库单状态、业务类型、往来方分布以及入库单数量变化趋势</p>
          <p>出库分析：出库单状态、业务类型、往来方分布以及入库单数量变化趋势</p>
          <p>盘点分析：盘点单状态、盈亏分布以及盘点次数变化趋势</p>
          <p>调拨分析：调拨单状态分布以及调拨次数变化趋势</p>
        </div>
      </show-search-grid>
    </div>
    <div class="indicators-search">
      <div class="title">仓库：</div>
      <div class="hardShopDepotGroup1" ref="shopDepotGroup">
        <el-checkbox-button v-model="checkAllShopDepot" @change="handleCheckAllShopDepot" :indeterminate="isIndeterminateShopDepot">全部
        </el-checkbox-button>
        <el-tooltip placement="bottom" v-for="(condition, index) in shopDepotList" :key="index" :disabled="condition.name.length<=10">
          <el-checkbox-group v-model="checkedShopDepot" @change="shopDepotChange">
            <el-checkbox-button :label="condition.id" size="mini">
              {{condition.name.length>10?condition.name.substr(0, 10)+'...':condition.name}}
            </el-checkbox-button>
          </el-checkbox-group>
          <div slot="content">{{ condition.name }}</div>
        </el-tooltip>
      </div>
    </div>
    <div class="total">
      <div class="column1">
        <div class="table-cell">
          入库单
          <div class="color-primary"><span class="font">{{summary.depotInNumInc}}</span>单</div>
          <div class="color-primary">
            环比
            <span :style="summary.depotInNumIncMon>0?'color:red':'color:green'"><i
                :class="summary.depotInNumIncMon>0?'iconfont biz-icon-i-sh-man-pullup':'iconfont biz-icon-i-sh-man-pulldown'"></i>{{summary.depotInNumIncMon}}%</span>
            同比
            <span :style="summary.depotInNumIncYoy>0?'color:red':'color:green'"><i
                :class="summary.depotInNumIncYoy>0?'iconfont biz-icon-i-sh-man-pullup':'iconfont biz-icon-i-sh-man-pulldown'"></i>{{summary.depotInNumIncYoy}}%</span>
          </div>
        </div>
      </div>
      <div class="column2">
        <div class="table-cell">
          出库单
          <div class="color-primary"><span class="font">{{summary.depotOutNumInc}}</span>单</div>
          <div class="color-primary">
            环比
            <span :style="summary.depotOutNumIncMon>0?'color:red':'color:green'"><i
                :class="summary.depotOutNumIncMon>0?'iconfont biz-icon-i-sh-man-pullup':'iconfont biz-icon-i-sh-man-pulldown'"></i>{{summary.depotOutNumIncMon}}%</span>
            同比
            <span :style="summary.depotOutNumIncYoy>0?'color:red':'color:green'"><i
                :class="summary.depotOutNumIncYoy>0?'iconfont biz-icon-i-sh-man-pullup':'iconfont biz-icon-i-sh-man-pulldown'"></i>{{summary.depotOutNumIncYoy}}%</span>
          </div>
        </div>
      </div>
      <div class="column3">
        <div class="table-cell">
          盘点单
          <div class="color-primary"><span class="font">{{summary.depotInventoryNumInc}}</span>单</div>
          <div class="color-primary">
            环比
            <span :style="summary.depotInventoryNumIncMon>0?'color:red':'color:green'"><i
                :class="summary.depotInventoryNumIncMon>0?'iconfont biz-icon-i-sh-man-pullup':'iconfont biz-icon-i-sh-man-pulldown'"></i>{{summary.depotInventoryNumIncMon}}%</span>
            同比
            <span :style="summary.depotInventoryNumIncYoy>0?'color:red':'color:green'"><i
                :class="summary.depotInventoryNumIncYoy>0?'iconfont biz-icon-i-sh-man-pullup':'iconfont biz-icon-i-sh-man-pulldown'"></i>{{summary.depotInventoryNumIncYoy}}%</span>
          </div>
        </div>
      </div>
      <div class="column3">
        <div class="table-cell">
          调拨单
          <div class="color-primary"><span class="font">{{summary.depotTransferNumInc}}</span>单</div>
          <div class="color-primary">
            环比
            <span :style="summary.depotTransferNumIncMon>0?'color:red':'color:green'"><i
                :class="summary.depotTransferNumIncMon>0?'iconfont biz-icon-i-sh-man-pullup':'iconfont biz-icon-i-sh-man-pulldown'"></i>{{summary.depotTransferNumIncMon}}%</span>
            同比
            <span :style="summary.depotTransferNumIncYoy>0?'color:red':'color:green'"><i
                :class="summary.depotTransferNumIncYoy>0?'iconfont biz-icon-i-sh-man-pullup':'iconfont biz-icon-i-sh-man-pulldown'"></i>{{summary.depotTransferNumIncYoy}}%</span>
          </div>
        </div>
      </div>
    </div>
    <div class="chart-area">
      <div class="graph">
        <div class="header">
          <span>库存分析</span>
          <span class="font">库存排行</span>
          <i class="iconfont biz-icon-i-web-fd" @click="storeAllAnalysis"></i>
        </div>
        <biz-chart :chartData="chartDataOfStoreAll" :loading="loading" :showSearch="false"></biz-chart>
      </div>
      <div class="graph">
        <div class="header">
          <span>入库分析</span>
          <span class="font">订单数量</span>
          <i class="iconfont biz-icon-i-web-fd" @click="storeInAnalysis"></i>
        </div>
        <biz-chart :chartData="chartDataOfStoreIn" :loading="loading" :showSearch="false"></biz-chart>
      </div>
      <div class="graph">
        <div class="header">
          <span>出库分析</span>
          <span class="font">订单数量</span>
          <i class="iconfont biz-icon-i-web-fd" @click="storeOutAnalysis"></i>
        </div>
        <biz-chart :chartData="chartDataOfStoreOut" :loading="loading" :showSearch="false"></biz-chart>
      </div>
    </div>
    <div class="chart-area">
      <div class="graph">
        <div class="header">
          <span>盘点分析</span>
          <span class="font">盘点次数</span>
          <i class="iconfont biz-icon-i-web-fd" @click="checkAnalysis"></i>
        </div>
        <biz-chart :chartData="chartDataOfCheck" :loading="loading" :showSearch="false"></biz-chart>
      </div>
      <div class="graph">
        <div class="header">
          <span>调拨分析</span>
          <span class="font">调拨次数</span>
          <i class="iconfont biz-icon-i-web-fd" @click="allocateAnalysis"></i>
        </div>
        <biz-chart :chartData="chartDataOfAllocate" :loading="loading" :showSearch="false"></biz-chart>
      </div>
    </div>
    <el-dialog :visible.sync="dialogVisible" :title="title" width="1200px" append-to-body>
      <StoreAllAnalysis ref="storeAllAnalysis" v-if="showStoreAll" :params="params"></StoreAllAnalysis>
      <StoreInAnalysis ref="storeInAnalysis" v-if="showStoreIn" :params="params"></StoreInAnalysis>
      <StoreOutAnalysis ref="storeOutAnalysis" v-if="showStoreOut" :params="params"></StoreOutAnalysis>
      <CheckAnalysis ref="checkAnalysis" v-if="showCheck" :params="params"></CheckAnalysis>
      <AllocateAnalysis ref="allocateAnalysis" v-if="showAllocate" :params="params"></AllocateAnalysis>
    </el-dialog>
  </div>
</template>

<script>
import BizChart from '@/components/BizChart';
// import BizFilter from '@/components/BizTable/BizFilter';
import dateTime from '@/utils/dateTime';
import http from '@/common/http';
import StoreAllAnalysis from './StoreAllAnalysis';
import StoreInAnalysis from './StoreInAnalysis';
import StoreOutAnalysis from './StoreOutAnalysis';
import AllocateAnalysis from './AllocateAnalysis';
import CheckAnalysis from './CheckAnalysis';
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
      isIndeterminateShops: true,
      checkAllShops: true,
      checkedShops: [],
      className: 'el-icon-caret-bottom',
      showSwich: false,
      showHide: false,
      showRecommend: false,
      dialogVisible: false,
      showStoreAll: false,
      showStoreIn: false,
      showStoreOut: false,
      showAllocate: false,
      showCheck: false,
      showHideShop1: false,
      showShopSwich1: false,
      hardGroupShopHeight1: 0,
      classNameShop1: 'el-icon-caret-bottom',
      isIndeterminateShopDepot: true,
      checkAllShopDepot: true,
      checkedShopDepot: [],
      shopDepotList: [],
      hardGroupShopDepotHeight1: 0,
      classNameShopDepot: 'el-icon-caret-bottom',
      showShopDepotSwich1: false,
      showHideShopDepot1: false,
      title: '概览分析',
      summary: {
        sessionCnt: {},
        workSheetCnt: {},
        workSheetComplaintUnFinishCnt: {}
      },
      conditionData: {
        shopsList: [],
        supplierList: [],
        stateList: []
      },
      filters: [],
      kpiName: ['本期', '同比', '环比'],
      chartData: {},
      chartDataOfStoreIn: {},
      chartDataOfStoreOut: {},
      chartDataOfStoreAll: {},
      chartDataOfAllocate: {},
      chartDataOfCheck: {},
      isShow: 'false'
    };
  },
  methods: {
    ...mapGetters(['getUser']),
    handleCheckAllShopDepot(val) {
      this.checkedShopDepot = val
        ? this.shopDepotList.map(item => {
          return item.id;
        })
        : [];
      this.query();
    },
    shopDepotChange(val) {
      let checkedCount = val.length;
      this.checkAllShopDepot = checkedCount === this.shopDepotList.length;
      this.isIndeterminateShopDepot = checkedCount > 0 && checkedCount < this.shopDepotList.length;
      this.query();
    },
    getShopDepotsList() {
      http
        .get('/admin/invoicing/stock/shopDepots.jhtml')
        .then(data => {
          this.shopDepotList = data.dataList;
          this.checkedShopDepot = this.shopDepotList
            ? this.shopDepotList.map(item => {
              return item.id;
            })
            : [];
          this.$nextTick(() => {
            this.hardGroupShopDepotHeight1 = document.getElementsByClassName('hardShopDepotGroup1')[0].offsetHeight;
            if (this.hardGroupShopDepotHeight1 > 55) {
              this.showShopDepotSwich1 = true;
              this.showHideShopDepot1 = true;
            } else {
              this.showShopDepotSwich1 = false;
              this.showHideShopDepot1 = false;
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
      this.params = {
        viewType: this.viewType,
        beginDate: this.beginDate,
        endDate: this.endDate,
        dateType: this.dateType,
        checkedShopDepot: this.checkedShopDepot
      };
      this.init();
      this.getGraphCheckData();
      this.getGraphAllocateData();
      this.getGraphStoreInData();
      this.getGraphStoreOutData();
      this.getGraphStoreAllData();
    },
    storeAllAnalysis() {
      this.title = '库存分析';
      this.showStoreIn = false;
      this.showStoreOut = false;
      this.showAllocate = false;
      this.showCheck = false;
      this.showStoreAll = true;
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs.storeAllAnalysis.load();
      });
    },
    storeInAnalysis() {
      this.title = '入库分析';
      this.showStoreAll = false;
      this.showAllocate = false;
      this.showCheck = false;
      this.showStoreIn = true;
      this.showStoreOut = false;
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs.storeInAnalysis.load();
      });
    },
    storeOutAnalysis() {
      this.title = '出库分析';
      this.showStoreAll = false;
      this.showAllocate = false;
      this.showCheck = false;
      this.showStoreIn = false;
      this.showStoreOut = true;
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs.storeOutAnalysis.load();
      });
    },
    allocateAnalysis() {
      this.title = '调拨分析';
      this.showStoreAll = false;
      this.showStoreIn = false;
      this.showStoreOut = false;
      this.showCheck = false;
      this.showAllocate = true;
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs.allocateAnalysis.load();
      });
    },
    checkAnalysis() {
      this.title = '盘点分析';
      this.showStoreAll = false;
      this.showStoreIn = false;
      this.showStoreOut = false;
      this.showCheck = true;
      this.showAllocate = false;
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs.checkAnalysis.load();
      });
    },
    init() {
      this.loading = true;
      let params = {
        beginDate: this.beginDate,
        endDate: this.endDate,
        viewType: this.viewType,
        indicators: ['depotInNum', 'depotOutNum', 'depotInventoryNum', 'depotTransferNum'],
        depotIds: this.checkedShopDepot
      };
      http
        .post('/admin/ecommerce/kpi/stock/summary/stock.jhtml', params)
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
    // 调拨分析
    getGraphAllocateData() {
      this.loading = true;
      let params = {
        indicators: ['depotTransferNum'],
        depotIds: this.checkedShopDepot,
        viewType: this.viewType,
        beginDate: this.beginDate,
        endDate: this.endDate
      };
      http
        .post('/admin/ecommerce/kpi/stock/graph/depotColumn.jhtml', params)
        .then(data => {
          this.chartDataOfAllocate = this.dataAllocateFormat(data);
        })
        .catch(errData => {
          this.loading = false;
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    dataAllocateFormat(data) {
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
    // 盘点分析
    getGraphCheckData() {
      this.loading = true;
      let params = {
        indicators: ['depotInventoryNum'],
        depotIds: this.checkedShopDepot,
        viewType: this.viewType,
        beginDate: this.beginDate,
        endDate: this.endDate
      };
      http
        .post('/admin/ecommerce/kpi/stock/graph/depotColumn.jhtml', params)
        .then(data => {
          this.chartDataOfCheck = this.dataCheckFormat(data);
        })
        .catch(errData => {
          this.loading = false;
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    dataCheckFormat(data) {
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
    // 入库分析
    getGraphStoreInData() {
      this.loading = true;
      let params = {
        depotIds: this.checkedShopDepot,
        indicators: ['depotInNum'],
        viewType: this.viewType,
        beginDate: this.beginDate,
        endDate: this.endDate
      };
      http
        .post('/admin/ecommerce/kpi/stock/graph/depotColumn.jhtml', params)
        .then(data => {
          this.chartDataOfStoreIn = this.dataStoreInFormat(data);
        })
        .catch(errData => {
          this.loading = false;
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    dataStoreInFormat(data) {
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
    // 出库分析
    getGraphStoreOutData() {
      this.loading = true;
      let params = {
        depotIds: this.checkedShopDepot,
        indicators: ['depotOutNum'],
        viewType: this.viewType,
        beginDate: this.beginDate,
        endDate: this.endDate
      };
      http
        .post('/admin/ecommerce/kpi/stock/graph/depotColumn.jhtml', params)
        .then(data => {
          this.chartDataOfStoreOut = this.dataStoreOutFormat(data);
        })
        .catch(errData => {
          this.loading = false;
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    dataStoreOutFormat(data) {
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
    // 库存分析
    getGraphStoreAllData() {
      this.loading = true;
      let params = {
        depotIds: this.checkedShopDepot,
        indicators: ['depotProductRank'],
        viewType: this.viewType,
        beginDate: this.beginDate,
        endDate: this.endDate
      };
      http
        .post('/admin/ecommerce/kpi/stock/graph/depotRank.jhtml', params)
        .then(data => {
          this.chartDataOfStoreAll = this.dataStoreAllFormat(data);
        })
        .catch(errData => {
          this.loading = false;
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    dataStoreAllFormat(data) {
      let tmpData = [];
      for (let i = 0; i < (data.indicators.length > 4 ? 4 : data.indicators.length); i++) {
        tmpData.push({
          商品: data.indicators[i].xValue,
          个: data.indicators[i].yValue
        });
      }
      let chartData = {
        legendVisible: false,
        type: 'histogram',
        data: {
          columns: ['商品', '个'],
          rows: tmpData
        },
        settings: {
          interval: 'auto'
        }
      };
      return chartData;
    },
    refreshHandle(val) {
      this.viewType = val.viewType;
      this.beginDate = val.date[0];
      this.endDate = val.date[1];
      this.dateType = val.dateType;
      this.params = { viewType: this.viewType, beginDate: this.beginDate, endDate: this.endDate, dateType: val.dateType, checkedShopDepot: this.checkedShopDepot };
      this.query();
    },
    filterDataChange(val) {
      this.filters = val;
      this.query();
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
    swichShopDepot() {
      this.classNameShopDepot = this.classNameShopDepot === 'el-icon-caret-bottom' ? 'el-icon-caret-top' : 'el-icon-caret-bottom';
      this.showHideShopDepot = this.classNameShopDepot === 'el-icon-caret-bottom';
      if (!this.showHideShopDepot) {
        document.getElementsByClassName('hardShopDepotGroup')[0].style.height = 'auto';
      } else {
        document.getElementsByClassName('hardShopDepotGroup')[0].style.height = '55px';
      }
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
    this.getShopDepotsList();
  },
  components: {
    BizChart,
    StoreAllAnalysis,
    StoreInAnalysis,
    StoreOutAnalysis,
    AllocateAnalysis,
    CheckAnalysis,
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
  .hardShopDepotGroup1 {
    display: flex;
    width: calc(100% - 90px);
    flex-flow: wrap;
  }
  .hardShopGroup1 {
    display: flex;
    width: calc(100% - 90px);
  }
  .showHide2 {
    height: 55px;
  }
  .swichShopDepot1 {
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
  .showHideShopDepot1 {
    height: 55px;
    overflow-y: hidden;
  }
  .showHideShop1 {
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
      min-height: 155px;
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
      min-height: 155px;
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
      min-height: 155px;
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
