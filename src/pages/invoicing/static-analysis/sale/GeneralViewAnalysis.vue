<template>
  <div class="general-view-analysis-car">
    <div slot="top">
      <show-search-grid @refreshHandle="refreshHandle" :showViewType="false">
        <div slot="description" class="description-pover">
          <p>订单分布：统计销售订单状态、供应商的分布以及订单数量和金额的变化趋势</p>
          <p>商品分布：统计销售订单商品的分类分布、商品采购数量排行情况以及商品的采购数量变化趋势</p>
          <p>售后情况：统计销售订单的售后类型、售后频次以及售后率</p>
          <p>代理商分布：代理商发货的订单数量、金额以及发货周期情况</p>
        </div>
      </show-search-grid>
    </div>
    <div class="indicators-search" :class="{'showHide2' : showHideOperator1}" v-if="getUser().roleLevel !== 'shop'">
      <div class="title">运营商：</div>
      <div class="hardOperatorGroup1" :class="{'showHideOperator1' : showHideOperator1}" ref="operatorGroup">
        <el-checkbox-button v-model="checkAllOperator" @change="handleCheckAllOperator" :indeterminate="isIndeterminateOperator">全部
        </el-checkbox-button>
        <el-tooltip placement="bottom" v-for="(condition,index)  in operatorList" :key="index" :disabled="condition.name.length<=10">
          <el-checkbox-group v-model="checkedOperator" @change="operatorChange">
            <el-checkbox-button :label="condition.id" size="mini">
              {{condition.name.length>10?condition.name.substr(0, 10)+'...':condition.name}}
            </el-checkbox-button>
          </el-checkbox-group>
          <div slot="content">{{ condition.name }}</div>
        </el-tooltip>
      </div>
    </div>
    <div class="swichOperator" v-if="showOperatorSwich1">
      <i :class="classNameOperator" @click="swichOperator"></i>
    </div>
    <div class="indicators-search" :class="{'showHide2' : showHideShop1}" v-if="conditionData.shopsList.length>1">
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
    <div class="swichShop1" v-if="showShopSwich1&&conditionData.supplierList.length>1">
      <i :class="classNameShop1" @click="swichShop1"></i>
    </div>
    <div class="indicators-search" :class="{'showHide3' : showHideShop2}" v-if="conditionData.supplierList.length>1">
      <div class="title">代理商</div>
      <div class="hardShopGroup2"  ref="shopGroup"  :class="{'showHideShop2' : showHideShop2}">
        <el-checkbox-button v-model="checkAllSupplier" @change="handleCheckAllSupplier" :indeterminate="isIndeterminateSupplier">全部
        </el-checkbox-button>
        <el-tooltip placement="bottom" v-for="(item,index)  in conditionData.supplierList" :key="index" :disabled="item.name.length<=10">
          <el-checkbox-group :min="1" v-model="checkedSupplier" @change="supplierChange">
            <el-checkbox-button :label="item.id" size="mini">
              {{item.name.length>10?item.name.substr(0, 10)+'...':item.name}}
            </el-checkbox-button>
          </el-checkbox-group>
          <div slot="content">{{ item.name }}</div>
        </el-tooltip>
      </div>
    </div>
    <div class="swichShop2" v-if="showShopSwich2&&conditionData.supplierList.length>1">
      <i :class="classNameShop2" @click="swichShop2"></i>
    </div>
    <div class="indicators-search">
      <div class="title">订单状态</div>
      <div class="hardShopGroup1"  ref="shopGroup">
        <el-checkbox-button v-model="checkAllState" @change="handleCheckAllState" :indeterminate="isIndeterminateState">全部
        </el-checkbox-button>
        <el-tooltip placement="bottom" v-for="(item, index) in conditionData.stateList" :key="index" :disabled="item.name.length<=10">
          <el-checkbox-group :min="1" v-model="checkedState" @change="stateChange">
            <el-checkbox-button :label="item.id" size="mini">
              {{item.name.length>10?item.name.substr(0, 10)+'...':item.name}}
            </el-checkbox-button>
          </el-checkbox-group>
          <div slot="content">{{ item.name }}</div>
        </el-tooltip>
      </div>
    </div>
    <div class="total">
      <div class="column1">
        <div class="table-cell">
          订单数
          <div class="color-primary"><span class="font">{{summary.salesOrderNum}}</span>单</div>
          <div class="color-primary">
            环比
            <span :style="summary.salesOrderNumMon>0?'color:red':'color:green'"><i
                :class="summary.salesOrderNumMon>0?'iconfont biz-icon-i-sh-man-pullup':'iconfont biz-icon-i-sh-man-pulldown'"></i>{{summary.salesOrderNumMon}}%</span>
            同比
            <span :style="summary.salesOrderNumYoy>0?'color:red':'color:green'"><i
                :class="summary.salesOrderNumYoy>0?'iconfont biz-icon-i-sh-man-pullup':'iconfont biz-icon-i-sh-man-pulldown'"></i>{{summary.salesOrderNumYoy}}%</span>
          </div>
        </div>
      </div>
      <div class="column2">
        <div class="table-cell">
          订单金额
          <div class="color-primary"><span class="font">{{summary.salesOrderAmount}}</span>万元</div>
          <div class="color-primary">
            环比
            <span :style="summary.salesOrderAmountMon>0?'color:red':'color:green'"><i
                :class="summary.purchaseOrderAmountMon>0?'iconfont biz-icon-i-sh-man-pullup':'iconfont biz-icon-i-sh-man-pulldown'"></i>{{summary.salesOrderAmountMon}}%</span>
            同比
            <span :style="summary.salesOrderAmountYoy>0?'color:red':'color:green'"><i
                :class="summary.salesOrderAmountYoy>0?'iconfont biz-icon-i-sh-man-pullup':'iconfont biz-icon-i-sh-man-pulldown'"></i>{{summary.salesOrderAmountYoy}}%</span>
          </div>
        </div>
      </div>
      <div class="column3">
        <div class="table-cell">
          商品数
          <div class="color-primary"><span class="font">{{summary.salesProductNum}}</span>个</div>
          <div class="color-primary">
            环比
            <span :style="summary.salesProductNumMon>0?'color:red':'color:green'"><i
                :class="summary.salesProductNumMon>0?'iconfont biz-icon-i-sh-man-pullup':'iconfont biz-icon-i-sh-man-pulldown'"></i>{{summary.salesProductNumMon}}%</span>
            同比
            <span :style="summary.salesOrderNumYoy>0?'color:red':'color:green'"><i
                :class="summary.salesOrderNumYoy>0?'iconfont biz-icon-i-sh-man-pullup':'iconfont biz-icon-i-sh-man-pulldown'"></i>{{summary.salesProductNumYoy}}%</span>
          </div>
        </div>
      </div>
    </div>
    <div class="chart-area">
      <div class="graph"  style="width:100%">
        <div class="header">
          <span>订单分布</span>
          <span class="font">数量</span>
          <i class="iconfont biz-icon-i-web-fd" @click="orderAnalysis"></i>
        </div>
        <biz-chart :chartData="chartDataOfOrder" :loading="loading" :showSearch="false"></biz-chart>
      </div>
    </div>
    <div class="chart-area">
      <div class="graph">
        <div class="header">
          <span>商品分布</span>
          <span class="font">数量</span>
          <i class="iconfont biz-icon-i-web-fd" @click="productAnalysis"></i>
        </div>
        <biz-chart :chartData="chartDataOfProduct" :loading="loading" :showSearch="false"></biz-chart>
      </div>
      <div class="graph">
        <div class="header">
          <span>售后情况</span>
          <span class="font">售后类型</span>
          <i class="iconfont biz-icon-i-web-fd" @click="afterSaleAnalysis"></i>
        </div>
        <biz-chart :chartData="chartDataOfAfterSale" :loading="loading" :showSearch="false"></biz-chart>
      </div>
      <div class="graph">
        <div class="header">
          <span>代理商分布</span>
          <span class="font">代理商</span>
          <i class="iconfont biz-icon-i-web-fd" @click="supplierAnalysis"></i>
        </div>
        <biz-chart :chartData="chartDataOfSupplier" :loading="loading" :showSearch="false"></biz-chart>
      </div>
    </div>
    <el-dialog :visible.sync="dialogVisible" :title="title" width="1200px" append-to-body>
      <OrderAnalysis ref="orderAnalysis" v-if="showOrder" :params="params"></OrderAnalysis>
      <ProductAnalysis ref="productAnalysis" v-if="showProduct" :params="params"></ProductAnalysis>
      <SupplierAnalysis ref="supplierAnalysis" v-if="showSupplier" :params="params"></SupplierAnalysis>
      <AfterSaleAnalysis ref="afterSaleAnalysis" v-if="showAfterSale" :params="params"></AfterSaleAnalysis>
    </el-dialog>
  </div>
</template>

<script>
import BizChart from '@/components/BizChart';
// import BizFilter from '@/components/BizTable/BizFilter';
import dateTime from '@/utils/dateTime';
import http from '@/common/http';
import urls from '@/common/urls';
import OrderAnalysis from './OrderAnalysis';
import ProductAnalysis from './ProductAnalysis';
import SupplierAnalysis from './SupplierAnalysis';
import AfterSaleAnalysis from './AfterSaleAnalysis';
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
      checkAllShops: false,
      checkedShops: [],
      className: 'el-icon-caret-bottom',
      showSwich: false,
      showHide: false,
      showRecommend: false,
      dialogVisible: false,
      showOrder: false,
      showProduct: false,
      showSupplier: false,
      showAfterSale: false,
      showHideShop1: false,
      showShopSwich1: false,
      showHideShop2: false,
      showShopSwich2: false,
      hardGroupShopHeight1: 0,
      hardGroupShopHeight2: 0,
      classNameShop1: 'el-icon-caret-bottom',
      classNameShop2: 'el-icon-caret-bottom',
      isIndeterminateOperator: true,
      checkAllOperator: true,
      checkedOperator: [],
      isIndeterminateState: true,
      checkAllState: true,
      checkedState: [],
      isIndeterminateSupplier: true,
      checkAllSupplier: true,
      checkedSupplier: [],
      operatorList: [],
      hardGroupOperatorHeight1: 0,
      classNameOperator1: 'el-icon-caret-bottom',
      showOperatorSwich1: false,
      showHideOperator1: false,
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
      chartDataOfProduct: {},
      chartDataOfOrder: {},
      chartDataOfSupplier: {},
      chartDataOfAfterSale: {},
      isShow: 'false'
    };
  },
  methods: {
    ...mapGetters(['getUser']),
    handleCheckAllSupplier(val) {
      this.checkedSupplier = val
        ? this.conditionData.supplierList.map(item => {
          return item.id;
        })
        : [];
      this.query();
    },
    supplierChange(val) {
      let checkedCount = val.length;
      this.checkAllSupplier = checkedCount === this.conditionData.supplierList.length;
      this.isIndeterminateSupplier = checkedCount > 0 && checkedCount < this.conditionData.supplierList.length;
      this.query();
    },
    handleCheckAllState(val) {
      this.checkedState = val
        ? this.conditionData.stateList.map(item => {
          return item.id;
        })
        : [];
      this.query();
    },
    stateChange(val) {
      let checkedCount = val.length;
      this.checkAllState = checkedCount === this.conditionData.stateList.length;
      this.isIndeterminateState = checkedCount > 0 && checkedCount < this.conditionData.stateList.length;
      this.query();
    },
    handleCheckAllOperator(val) {
      this.checkedOperator = val
        ? this.operatorList.map(item => {
          return item.id;
        })
        : [];
      this.getShopList();
    },
    operatorChange(val) {
      let checkedCount = val.length;
      this.checkAllOperator = checkedCount === this.operatorList.length;
      this.isIndeterminateOperator = checkedCount > 0 && checkedCount < this.operatorList.length;
      this.getShopList();
    },
    getCompanyList() {
      http
        .get(urls.terminalMgmt.Component_queryOperators)
        .then(data => {
          this.operatorList = data.content;
          this.checkedOperator = this.operatorList
            ? this.operatorList.map(item => {
              return item.id;
            })
            : [];
          this.$nextTick(() => {
            this.hardGroupOperatorHeight1 = document.getElementsByClassName('hardOperatorGroup1')[0].offsetHeight;
            if (this.hardGroupOperatorHeight1 > 55) {
              this.showOperatorSwich1 = true;
              this.showHideOperator1 = true;
            } else {
              this.showOperatorSwich1 = false;
              this.showHideOperator1 = false;
            }
          });
          this.getShopList();
        })
        .catch(error => {
          if (error.errorMessage) {
            this.$message.warning(error.errorMessage);
          }
        });
    },
    handleCheckAllShops(val) {
      this.checkedShops = val ? this.conditionData.shopsList.map(item => { return item.id; }) : [];
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
            if (this.hardGroupShopHeight1 > 62) {
              this.showShopSwich1 = true;
              this.showHideShop1 = true;
            } else {
              this.showShopSwich1 = false;
              this.showHideShop1 = false;
            }
          });
          this.getSupplierList();
        })
        .catch(error => {
          if (error.errorMessage) {
            this.$message.warning(error.errorMessage);
          }
        });
    },
    getSupplierList() {
      let param = {
        shopIds: this.checkedShops,
        type: '1'
      };
      http
        .post('/admin/ecommerce/kpi/purchase/condition/cooperationInfos.jhtml', param)
        .then(data => {
          this.conditionData.supplierList = data.dataList;
          this.checkedSupplier = this.conditionData.supplierList
            ? this.conditionData.supplierList.map(item => {
              return item.id;
            })
            : [];
          this.$nextTick(() => {
            this.hardGroupShopHeight2 = document.getElementsByClassName('hardShopGroup2')[0].offsetHeight;
            console.log(this.hardGroupShopHeight2);
            if (this.hardGroupShopHeight2 > 62) {
              this.showShopSwich2 = true;
              this.showHideShop2 = true;
            } else {
              this.showShopSwich2 = false;
              this.showHideShop2 = false;
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
    getStatesList() {
      let param = {};
      http
        .get('/admin/ecommerce/kpi/purchase/condition/orderStates.jhtml', param)
        .then(data => {
          this.conditionData.stateList = data.orderStates;
          this.checkedState = this.conditionData.stateList
            ? this.conditionData.stateList.map(item => {
              return item.id;
            })
            : [];
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
        checkedShops: this.checkedShops,
        checkedState: this.checkedState,
        checkedSupplier: this.checkedSupplier
      };
      this.init();
      this.getGraphSupplierData();
      this.getGraphProductData();
      this.getGraphOrderData();
      this.getGraphAfterSaleData();
    },
    orderAnalysis() {
      this.title = '订单分布';
      this.showProduct = false;
      this.showSupplier = false;
      this.showOrder = true;
      this.dialogVisible = true;
      this.showAfterSale = false;
      this.$nextTick(() => {
        this.$refs.orderAnalysis.load();
      });
    },
    productAnalysis() {
      this.title = '商品分布';
      this.showOrder = false;
      this.showSupplier = false;
      this.showProduct = true;
      this.dialogVisible = true;
      this.showAfterSale = false;
      this.$nextTick(() => {
        this.$refs.productAnalysis.load();
      });
    },
    supplierAnalysis() {
      this.title = '代理商分布';
      this.showOrder = false;
      this.showProduct = false;
      this.showSupplier = true;
      this.dialogVisible = true;
      this.showAfterSale = false;
      this.$nextTick(() => {
        this.$refs.supplierAnalysis.load();
      });
    },
    afterSaleAnalysis() {
      this.title = '售后情况';
      this.showOrder = false;
      this.showProduct = false;
      this.showSupplier = false;
      this.showAfterSale = true;
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs.afterSaleAnalysis.load();
      });
    },
    init() {
      this.loading = true;
      let params = {
        indicators: ['salesOrderNum', 'salesOrderAmount', 'salesProductNum'],
        shopIds: this.checkedShops,
        states: this.checkedState,
        agentIds: this.checkedSupplier,
        beginDate: this.beginDate,
        endDate: this.endDate,
        viewType: this.viewType
      };
      http
        .post('/admin/ecommerce/kpi/purchase/summary/sales.jhtml', params)
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
    // 供应商分析
    getGraphSupplierData() {
      this.loading = true;
      let params = {
        indicators: ['agentOrderNum'],
        shopIds: this.checkedShops,
        states: this.checkedState,
        agentIds: this.checkedSupplier,
        viewType: this.viewType,
        beginDate: this.beginDate,
        endDate: this.endDate
      };
      http
        .post('/admin/ecommerce/kpi/purchase/graph/columnGraphRank.jhtml', params)
        .then(data => {
          this.chartDataOfSupplier = this.dataSupplierFormat(data);
        })
        .catch(errData => {
          this.loading = false;
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    dataSupplierFormat(data) {
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
    // 售后情况
    getGraphAfterSaleData() {
      this.loading = true;
      let params = {
        indicators: ['salesRefundsType'],
        shopIds: this.checkedShops,
        states: this.checkedState,
        supplierIds: this.checkedSupplier,
        viewType: this.viewType,
        beginDate: this.beginDate,
        endDate: this.endDate
      };
      http
        .post('/admin/ecommerce/kpi/purchase/graph/columnGraphMults.jhtml', params)
        .then(data => {
          this.chartDataOfAfterSale = this.dataFormatWork(data);
        })
        .catch(errData => {
          this.loading = false;
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    dataFormatWork(data) {
      let tmpData = [];
      for (let i = 0; i < data.indicators.length; i++) {
        tmpData.push({
          type: data.indicators[i].xValue,
          value: data.indicators[i].y[0].yValue
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
          radius: [30, 100],
          offsetY: '50%'
        }
      };
      return chartData;
    },
    // 销售商品分析
    getGraphProductData() {
      this.loading = true;
      let params = {
        indicators: ['salesProductNum'],
        shopIds: this.checkedShops,
        states: this.checkedState,
        agentIds: this.checkedSupplier,
        viewType: this.viewType,
        beginDate: this.beginDate,
        endDate: this.endDate
      };
      http
        .post('/admin/ecommerce/kpi/purchase/graph/columnGraph.jhtml', params)
        .then(data => {
          this.chartDataOfProduct = this.dataProductFormat(data);
        })
        .catch(errData => {
          this.loading = false;
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    dataProductFormat(data) {
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
    // 销售订单分析
    getGraphOrderData() {
      this.loading = true;
      let params = {
        indicators: ['salesOrderNum'],
        shopIds: this.checkedShops,
        states: this.checkedState,
        agentIds: this.checkedSupplier,
        viewType: this.viewType,
        beginDate: this.beginDate,
        endDate: this.endDate
      };
      http
        .post('/admin/ecommerce/kpi/purchase/graph/columnGraph.jhtml', params)
        .then(data => {
          this.chartDataOfOrder = this.dataOrderFormat(data);
        })
        .catch(errData => {
          this.loading = false;
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    dataOrderFormat(data) {
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
      this.params = { viewType: this.viewType, beginDate: this.beginDate, endDate: this.endDate, dateType: val.dateType, checkedShops: this.checkedShops };
      this.getGraphProductData();
      this.getGraphOrderData();
      this.getGraphSupplierData();
      this.init();
    },
    filterDataChange(val) {
      this.filters = val;
      this.getGraphProductData();
      this.getGraphSupplierData();
      this.getGraphOrderData();
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
    swichOperator() {
      this.classNameOperator = this.classNameOperator === 'el-icon-caret-bottom' ? 'el-icon-caret-top' : 'el-icon-caret-bottom';
      this.showHideOperator = this.classNameOperator === 'el-icon-caret-bottom';
      if (!this.showHideOperator) {
        document.getElementsByClassName('hardOperatorGroup')[0].style.height = 'auto';
      } else {
        document.getElementsByClassName('hardOperatorGroup')[0].style.height = '55px';
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
    swichShop2() {
      this.classNameShop2 = this.classNameShop2 === 'el-icon-caret-bottom' ? 'el-icon-caret-top' : 'el-icon-caret-bottom';
      this.showHideShop2 = this.classNameShop2 === 'el-icon-caret-bottom';
      if (!this.showHideShop2) {
        document.getElementsByClassName('hardShopGroup2')[0].style.height = 'auto';
      } else {
        document.getElementsByClassName('hardShopGroup2')[0].style.height = '55px';
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
    if (this.getUser().roleLevel !== 'shop') {
      this.getCompanyList();
    } else {
      this.getShopList();
    }
    this.getStatesList();
  },
  components: {
    BizChart,
    OrderAnalysis,
    ProductAnalysis,
    SupplierAnalysis,
    AfterSaleAnalysis,
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
  .hardOperatorGroup1 {
    display: flex;
    width: calc(100% - 90px);
  }
  .hardShopGroup1 {
    display: flex;
    width: calc(100% - 90px);
    flex-flow: wrap;
  }
  .hardShopGroup2 {
    display: flex;
    width: calc(100% - 90px);
    flex-flow: wrap;
  }
  .showHide2 {
    height: 55px;
  }
  .showHide3 {
    height: 55px;
  }
  .swichOperator1 {
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
  .swichShop2 {
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
  .showHideShop2 {
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
