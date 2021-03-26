<template>
  <div class="general-view-analysis-fince">
    <div slot="top">
      <show-search-grid @refreshHandle="refreshHandle" :showViewType="false">
        <div slot="description" class="description-pover">
          <p>月结：统计筛选范围内商品期初期末情况</p>
          <p>成本核算：统计筛选范围内商品成本核算情况</p>
          <p>收付款：统计筛选范围内商品收付款情况</p>
          <p>发票：统计筛选范围内开票状态分布</p>
        </div>
      </show-search-grid>
    </div>
    <div class="indicators-search" :class="{'showHide2' : showHideOperator1}" v-if="getUser().roleLevel !== 'shop'">
      <div class="title">运营商：</div>
      <div class="hardOperatorGroup1" :class="{'showHideOperator1' : showHideOperator1}" ref="operatorGroup">
        <el-checkbox-button v-model="checkAllOperator" @change="handleCheckAllOperator" :indeterminate="isIndeterminateOperator">
          全部
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
    <div class="swichShop1" v-if="showShopSwich1&&conditionData.shopsList.length>1">
      <i :class="classNameShop1" @click="swichShop1"></i>
    </div>
    <div class="indicators-search">
      <div class="title">收款类型</div>
      <div class="hardShopGroup1" ref="shopGroup">
        <el-checkbox-button v-model="checkAllGathering" @change="handleCheckAllGathering"
          :indeterminate="isIndeterminateGathering">
          全部
        </el-checkbox-button>
        <el-tooltip placement="bottom" v-for="(item, index) in conditionData.gatheringList" :key="index" :disabled="item.name.length<=10">
          <el-checkbox-group :min="1" v-model="checkedGathering" @change="gatheringChange">
            <el-checkbox-button :label="item.id" size="mini">
              {{item.name.length>10?item.name.substr(0, 10)+'...':item.name}}
            </el-checkbox-button>
          </el-checkbox-group>
          <div slot="content">{{ item.name }}</div>
        </el-tooltip>
      </div>
    </div>
    <div class="indicators-search">
      <div class="title">付款类型</div>
      <div class="hardShopGroup1" ref="shopGroup">
        <el-checkbox-button v-model="checkAllPayment" @change="handleCheckAllPayment" :indeterminate="isIndeterminatePayment">全部
        </el-checkbox-button>
        <el-tooltip placement="bottom" v-for="(item, index) in conditionData.paymentList" :key="index" :disabled="item.name.length<=10">
          <el-checkbox-group :min="1" v-model="checkedPayment" @change="paymentChange">
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
          期初/期末金额
          <div class="color-primary"><span class="font">{{summary.beginningAmount}}/{{summary.endingAmount}}</span>万元</div>
          <div class="color-primary">
            环比
            <span :style="summary.endingAmountMon>0?'color:red':'color:green'"><i
                :class="summary.endingAmountMon>0?'iconfont biz-icon-i-sh-man-pullup':'iconfont biz-icon-i-sh-man-pulldown'"></i>{{summary.endingAmountMon}}%</span>
            同比
            <span :style="summary.endingAmountYoy>0?'color:red':'color:green'"><i
                :class="summary.endingAmountYoy>0?'iconfont biz-icon-i-sh-man-pullup':'iconfont biz-icon-i-sh-man-pulldown'"></i>{{summary.endingAmountYoy}}%</span>
          </div>
        </div>
      </div>
      <div class="column2">
        <div class="table-cell">
          收款
          <div class="color-primary"><span class="font">{{summary.accountInAmount}}/{{summary.accountInAllAmount}}</span>万元</div>
          <div class="color-primary">
            环比
            <span :style="summary.accountInAmountMon>0?'color:red':'color:green'"><i
                :class="summary.accountInAmountMon>0?'iconfont biz-icon-i-sh-man-pullup':'iconfont biz-icon-i-sh-man-pulldown'"></i>{{summary.accountInAmountMon}}%</span>
            同比
            <span :style="summary.accountInAmountYoy>0?'color:red':'color:green'"><i
                :class="summary.accountInAmountYoy>0?'iconfont biz-icon-i-sh-man-pullup':'iconfont biz-icon-i-sh-man-pulldown'"></i>{{summary.accountInAmountYoy}}%</span>
          </div>
        </div>
      </div>
      <div class="column3">
        <div class="table-cell">
          付款
          <div class="color-primary"><span class="font">{{summary.accountOutAmount}}/{{summary.accountOutAllAmount}}</span>万元</div>
          <div class="color-primary">
            环比
            <span :style="summary.accountOutAmountMon>0?'color:red':'color:green'"><i
                :class="summary.accountOutAmountMon>0?'iconfont biz-icon-i-sh-man-pullup':'iconfont biz-icon-i-sh-man-pulldown'"></i>{{summary.accountOutAmountMon}}%</span>
            同比
            <span :style="summary.accountOutAmountYoy>0?'color:red':'color:green'"><i
                :class="summary.accountOutAmountYoy>0?'iconfont biz-icon-i-sh-man-pullup':'iconfont biz-icon-i-sh-man-pulldown'"></i>{{summary.accountOutAmountYoy}}%</span>
          </div>
        </div>
      </div>
    </div>
    <div class="chart-area">
      <div class="graph">
        <div class="header">
          <span>月结</span>
          <span class="font">库存排行</span>
          <i class="iconfont biz-icon-i-web-fd" @click="monthPaymentAnalysis"></i>
        </div>
        <biz-chart :chartData="chartDataOfMonthPayment" :loading="loading" :showSearch="false"></biz-chart>
      </div>
      <div class="graph">
        <div class="header">
          <span>成本核算</span>
          <span class="font">毛利率</span>
          <i class="iconfont biz-icon-i-web-fd" @click="costAnalysis"></i>
        </div>
        <biz-chart :chartData="chartDataOfCost" :loading="loading" :showSearch="false"></biz-chart>
      </div>
    </div>
    <div class="chart-area">
      <div class="graph" style="width:100%">
        <div class="header">
          <span>收付款</span>
          <span class="font">支付方式</span>
          <i class="iconfont biz-icon-i-web-fd" @click="gatheringAnalysis"></i>
        </div>
        <biz-chart :chartData="chartDataOfGathering" :loading="loading" :showSearch="false"></biz-chart>
      </div>
      <!-- <div class="graph">
        <div class="header">
          <span>发票</span>
          <span class="font">状态</span>
          <i class="iconfont biz-icon-i-web-fd" @click="invoiceAnalysis"></i>
        </div>
        <biz-chart :chartData="chartDataOfInvoice" :loading="loading" :showSearch="false"></biz-chart>
      </div> -->
    </div>
    <el-dialog :visible.sync="dialogVisible" :title="title" width="1200px" append-to-body>
      <MonthPaymentAnalysis ref="monthPaymentAnalysis" v-if="showMonthPayment" :params="params"></MonthPaymentAnalysis>
      <CostAnalysis ref="costAnalysis" v-if="showCost" :params="params"></CostAnalysis>
      <GatheringAnalysis ref="gatheringAnalysis" v-if="showGathering" :params="params"></GatheringAnalysis>
      <InvoiceAnalysis ref="invoiceAnalysis" v-if="showInvoice" :params="params"></InvoiceAnalysis>
    </el-dialog>
  </div>
</template>

<script>
import BizChart from '@/components/BizChart';
// import BizFilter from '@/components/BizTable/BizFilter';
import dateTime from '@/utils/dateTime';
import http from '@/common/http';
import urls from '@/common/urls';
import MonthPaymentAnalysis from './MonthPaymentAnalysis';
import CostAnalysis from './CostAnalysis';
import GatheringAnalysis from './GatheringAnalysis';
import InvoiceAnalysis from './InvoiceAnalysis';
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
      showMonthPayment: false,
      showCost: false,
      showGathering: false,
      showInvoice: false,
      showHideShop1: false,
      showShopSwich1: false,
      hardGroupShopHeight1: 0,
      classNameShop1: 'el-icon-caret-bottom',
      isIndeterminateOperator: true,
      checkAllOperator: true,
      checkedOperator: [],
      isIndeterminatePayment: true,
      checkAllPayment: true,
      checkedPayment: [],
      isIndeterminateGathering: true,
      checkAllGathering: true,
      checkedGathering: [],
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
        gatheringList: [
          { label: '销售收款', value: '1' },
          { label: '采购退货收款', value: '2' },
          { label: '其他收款', value: '3' }
        ],
        paymentList: [
          { label: '采购付款', value: '1' },
          { label: '销售退货收款', value: '2' },
          { label: '其他付款', value: '3' },
          { label: '平台充值', value: '4' },
          { label: '服务订购', value: '5' }
        ]
      },
      filters: [],
      kpiName: ['本期', '同比', '环比'],
      chartData: {},
      chartDataOfCost: {},
      chartDataOfMonthPayment: {},
      chartDataOfGathering: {},
      chartDataOfInvoice: {},
      isShow: 'false'
    };
  },
  methods: {
    ...mapGetters(['getUser']),
    handleCheckAllGathering(val) {
      this.checkedGathering = val
        ? this.conditionData.gatheringList.map(item => {
          return item.id;
        })
        : [];
      this.query();
    },
    gatheringChange(val) {
      let checkedCount = val.length;
      this.checkAllGathering = checkedCount === this.conditionData.gatheringList.length;
      this.isIndeterminateGathering = checkedCount > 0 && checkedCount < this.conditionData.gatheringList.length;
      this.query();
    },
    handleCheckAllPayment(val) {
      this.checkedPayment = val
        ? this.conditionData.paymentList.map(item => {
          return item.id;
        })
        : [];
      this.query();
    },
    paymentChange(val) {
      let checkedCount = val.length;
      this.checkAllPayment = checkedCount === this.conditionData.paymentList.length;
      this.isIndeterminatePayment = checkedCount > 0 && checkedCount < this.conditionData.paymentList.length;
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
      this.checkedShops = val
        ? this.conditionData.shopsList.map(item => {
          return item.id;
        })
        : [];
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
          // this.$nextTick(() => {
          //   this.hardGroupShopHeight1 = document.getElementsByClassName('hardShopGroup1')[0].offsetHeight;
          //   console.log(this.hardGroupShopHeight1);
          //   if (this.hardGroupShopHeight1 > 62) {
          //     this.showShopSwich1 = true;
          //     this.showHideShop1 = true;
          //   } else {
          //     this.showShopSwich1 = false;
          //     this.showHideShop1 = false;
          //   }
          // });
          this.getConditionList();
        })
        .catch(error => {
          if (error.errorMessage) {
            this.$message.warning(error.errorMessage);
          }
        });
    },
    getConditionList() {
      let param = {
        sourceType: '5'
      };
      http
        .get('/admin/ecommerce/kpi/finance/condition/types.jhtml', param)
        .then(data => {
          this.conditionData.gatheringList = data.accountInTypes;
          this.checkedGathering = this.conditionData.gatheringList.map(item => {
            return item.id;
          });
          this.conditionData.paymentList = data.accountOutTypes;
          this.checkedPayment = this.conditionData.paymentList.map(item => {
            return item.id;
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
        checkedShops: this.checkedShops,
        accountOutTypes: this.checkedPayment,
        accountInTypes: this.checkedGathering
      };
      this.init();
      this.getGraphGatheringData();
      this.getGraphCostData();
      this.getGraphInvoiceData();
      this.getGraphMonthPaymentData();
    },
    monthPaymentAnalysis() {
      this.title = '月结';
      this.showCost = false;
      this.showGathering = false;
      this.showMonthPayment = true;
      this.dialogVisible = true;
      this.showInvoice = false;
      this.$nextTick(() => {
        this.$refs.monthPaymentAnalysis.load();
      });
    },
    costAnalysis() {
      this.title = '成本核算';
      this.showMonthPayment = false;
      this.showGathering = false;
      this.showCost = true;
      this.dialogVisible = true;
      this.showInvoice = false;
      this.$nextTick(() => {
        this.$refs.costAnalysis.load();
      });
    },
    gatheringAnalysis() {
      this.title = '收付款';
      this.showMonthPayment = false;
      this.showCost = false;
      this.showGathering = true;
      this.dialogVisible = true;
      this.showInvoice = false;
      this.$nextTick(() => {
        this.$refs.gatheringAnalysis.load();
      });
    },
    invoiceAnalysis() {
      this.title = '发票';
      this.showMonthPayment = false;
      this.showCost = false;
      this.showGathering = false;
      this.showInvoice = true;
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs.invoiceAnalysis.load();
      });
    },
    init() {
      this.loading = true;
      let params = {
        indicators: ['beginningEndingAmount', 'accountIn', 'accountOut'],
        shopIds: this.checkedShops,
        accountOutTypes: this.checkedPayment,
        accountInTypes: this.checkedGathering,
        beginDate: this.beginDate,
        endDate: this.endDate,
        viewType: this.viewType
      };
      http
        .post('/admin/ecommerce/kpi/finance/summary/finance.jhtml', params)
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
    // 发票
    getGraphInvoiceData() {
      this.loading = true;
      let params = {
        indicators: ['agentOrderNum'],
        shopIds: this.checkedShops,
        accountOutTypes: this.checkedPayment,
        accountInTypes: this.checkedGathering,
        viewType: this.viewType,
        beginDate: this.beginDate,
        endDate: this.endDate
      };
      http
        .post('/admin/ecommerce/kpi/purchase/graph/columnGraphRank.jhtml', params)
        .then(data => {
          this.chartDataOfInvoice = this.dataGatheringFormat(data);
        })
        .catch(errData => {
          this.loading = false;
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    // 收付款
    getGraphGatheringData() {
      this.loading = true;
      let params = {
        indicators: ['paymentMethod'],
        shopIds: this.checkedShops,
        accountOutTypes: this.checkedPayment,
        accountInTypes: this.checkedGathering,
        viewType: this.viewType,
        beginDate: this.beginDate,
        endDate: this.endDate
      };
      http
        .post('/admin/ecommerce/kpi/finance/graph/pie.jhtml', params)
        .then(data => {
          this.chartDataOfGathering = this.dataGatheringFormat(data);
        })
        .catch(errData => {
          this.loading = false;
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    dataGatheringFormat(data) {
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
          adius: [30, 30],
          offsetY: '50%'
        }
      };
      return chartData;
    },
    // 成本核算
    getGraphCostData() {
      this.loading = true;
      let params = {
        indicators: ['grossProfitRateRank'],
        shopIds: this.checkedShops,
        accountOutTypes: this.checkedPayment,
        accountInTypes: this.checkedGathering,
        viewType: this.viewType,
        beginDate: this.beginDate,
        endDate: this.endDate
      };
      http
        .post('/admin/ecommerce/kpi/finance/graph/columnGraphRank.jhtml', params)
        .then(data => {
          this.chartDataOfCost = this.dataCostFormat(data);
        })
        .catch(errData => {
          this.loading = false;
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    dataCostFormat(data) {
      let tmpData = [];
      for (let i = 0; i < (data.indicators.length > 5 ? 5 : data.indicators.length); i++) {
        tmpData.push({
          商品: data.indicators[i].xValue,
          占比: data.indicators[i].yValue
        });
      }
      let chartData = {
        type: 'histogram',
        legendVisible: false,
        data: {
          columns: ['商品', '占比'],
          rows: tmpData
        },
        settings: {}
      };
      return chartData;
    },
    // 月结
    getGraphMonthPaymentData() {
      this.loading = true;
      let params = {
        indicators: ['stockRank'],
        shopIds: this.checkedShops,
        accountOutTypes: this.checkedPayment,
        accountInTypes: this.checkedGathering,
        viewType: this.viewType,
        beginDate: this.beginDate,
        endDate: this.endDate
      };
      http
        .post('/admin/ecommerce/kpi/finance/graph/columnGraphRank.jhtml', params)
        .then(data => {
          this.chartDataOfMonthPayment = this.dataMonthPaymentFormat(data);
        })
        .catch(errData => {
          this.loading = false;
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    dataMonthPaymentFormat(data) {
      let tmpData = [];
      for (let i = 0; i < (data.indicators.length > 5 ? 5 : data.indicators.length); i++) {
        tmpData.push({
          商品: data.indicators[i].xValue,
          个: data.indicators[i].yValue
        });
      }
      let chartData = {
        type: 'histogram',
        legendVisible: false,
        data: {
          columns: ['商品', '个'],
          rows: tmpData
        },
        settings: {}
      };
      return chartData;
    },
    refreshHandle(val) {
      this.viewType = val.viewType;
      this.beginDate = val.date[0];
      this.endDate = val.date[1];
      this.dateType = val.dateType;
      this.params = { viewType: this.viewType, beginDate: this.beginDate, endDate: this.endDate, dateType: val.dateType };
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
  },
  components: {
    BizChart,
    MonthPaymentAnalysis,
    CostAnalysis,
    GatheringAnalysis,
    InvoiceAnalysis,
    ShowSearchGrid
  }
};
</script>

<style lang="scss">
.general-view-analysis-fince {
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
  .showHide2 {
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
  .showHideOperator1 {
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
      width: 33%;
      overflow: auto;
      // width: 350px;
      // height: 155px;
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
      width: 33%;
      // width: 350px;
      // height: 155px;
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
      width: 33%;
      // width: 350px;
      // height: 155px;
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
