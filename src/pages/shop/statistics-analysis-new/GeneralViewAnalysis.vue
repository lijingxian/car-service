<template>
  <div class="general-view-analysis-shopProduct">
    <div slot="top">
      <show-search-grid @refreshHandle="refreshHandle" :showViewType="false">
        <div slot="description" class="description-pover">
          <p>销售分析：统计商品的销售趋势</p>
          <p>转化分析：统计商品的流量和转化情况</p>
          <p>服务分析：统计商品的售后情况、发货和满意度情况</p>
          <p>商品榜单：从各维度统计商品排行榜</p>
        </div>
      </show-search-grid>
    </div>
    <!-- <div class="indicators-search">
      <div class="title">一级分类：</div>
      <el-checkbox-button v-model="checkAllClass" @change="handleCheckAllClass" :indeterminate="isIndeterminate">全部
      </el-checkbox-button>
      <el-checkbox-group v-model="checkedClass" @change="classChange">
        <el-checkbox-button v-for="(item,index) in classList" :label="item.id.toString()" :key="index" size="mini">{{item.name}}
        </el-checkbox-button>
      </el-checkbox-group>
    </div> -->
    <div class="total">
      <div class="column1">
        <div class="table-cell">
          订单数
          <div class="color-primary">
            <span class="font">{{summary.orderIncrease}}</span>单
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
              <i
                :class="summary.orderAmountInsMom>0?'iconfont biz-icon-i-sh-man-pullup':'iconfont biz-icon-i-sh-man-pulldown'"></i>
              {{summary.orderAmountInsMom}}%
            </span>
            同比
            <span :style="summary.orderAmountInsYoy>0?'color:red':'color:green'">
              <i
                :class="summary.orderAmountInsYoy>0?'iconfont biz-icon-i-sh-man-pullup':'iconfont biz-icon-i-sh-man-pulldown'"></i>
              {{summary.orderAmountInsYoy}}%
            </span>
          </div>
        </div>
      </div>
    </div>
    <div class="chart-area">
      <!-- <div class="graph">
        <div class="header">
          <span>数量分析</span>
          <span class="font">分类</span>
          <i class="iconfont biz-icon-i-web-fd" @click="genralAnalysis"></i>
        </div>
        <biz-chart :chartData="chartData" :loading="loading" :showSearch="false"></biz-chart>
      </div> -->
      <div class="graph">
        <div class="header">
          <span>销售分析</span>
          <span class="font">销售额</span>
          <i class="iconfont biz-icon-i-web-fd" @click="intentionAnalysis"></i>
        </div>
        <biz-chart :chartData="chartDataOfLevel" :loading="loading" :showSearch="false"></biz-chart>
      </div>
      <div class="graph">
        <div class="header">
          <span>转化分析</span>
          <span class="font">购买转化率</span>
          <i class="iconfont biz-icon-i-web-fd" @click="channelAnalysis"></i>
        </div>
        <biz-chart :chartData="chartDataOfChannel" :loading="loading" :showSearch="false"></biz-chart>
      </div>
    </div>
    <div class="chart-area">
      <div class="graph">
        <div class="header">
          <span>服务分析</span>
          <span class="font">满意度</span>
          <i class="iconfont biz-icon-i-web-fd" @click="contractAnalysis"></i>
        </div>
        <biz-chart :chartData="chartDataOfContract" :loading="loading" :showSearch="false"></biz-chart>
      </div>
      <!-- <div class="graph">
        <div class="header">
          <span>消费人群分析</span>
          <span class="font">性别</span>
          <i class="iconfont biz-icon-i-web-fd" @click="defeatAnalysis"></i>
        </div>
        <biz-chart :chartData="chartDataOfDefeat" :loading="loading" :showSearch="false" style="padding-bottom:40px"></biz-chart>
      </div> -->
      <div class="graph">
        <div class="header">
          <span>商品榜单</span>
          <span class="font">热销榜</span>
          <i class="iconfont biz-icon-i-web-fd" @click="consultantAnalysis"></i>
        </div>
        <biz-chart :chartData="chartDataOfConsultant" :loading="loading" :showSearch="false"></biz-chart>
      </div>
    </div>
    <el-dialog :visible.sync="dialogVisible" :title="title" width="1200px" append-to-body>
      <!-- <GeneralViewAnalysisInfo ref="generalViewAnalysisInfo" v-if="showGenral" :params="params"></GeneralViewAnalysisInfo> -->
      <IntentionAnalysis ref="intentionAnalysis" v-if="showIntention" :params="params"></IntentionAnalysis>
      <ChannelAnalysis ref="channelAnalysis" v-if="showChannel" :params="params"></ChannelAnalysis>
      <ContractAnalysis ref="contractAnalysis" v-if="showContract" :params="params"></ContractAnalysis>
      <!-- <DefeatAnalysis ref="defeatAnalysis" v-if="showDefeat" :params="params"></DefeatAnalysis> -->
      <ConsultantAnalysis ref="consultantAnalysis" v-if="showConsultant" :params="params"></ConsultantAnalysis>
    </el-dialog>
  </div>
</template>

<script>
import BizChart from '@/components/BizChart';
// import BizFilter from '@/components/BizTable/BizFilter';
import dateTime from '@/utils/dateTime';
import http from '@/common/http';
// import GeneralViewAnalysisInfo from './GeneralViewAnalysisInfo';
import IntentionAnalysis from './IntentionAnalysis';
import ChannelAnalysis from './ChannelAnalysis';
import ContractAnalysis from './ContractAnalysis';
// import DefeatAnalysis from './DefeatAnalysis';
import ConsultantAnalysis from './ConsultantAnalysis';
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
      pagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        total: 0
      },
      tableData: [],
      classList: [],
      checkAllClass: true,
      checkedClass: [],
      showRecommend: false,
      isIndeterminate: true,
      dialogVisible: false,
      showGenral: false,
      showIntention: false,
      showChannel: false,
      showContract: false,
      showDefeat: false,
      showConsultant: false,
      title: '数量分析',
      summary: {},
      summary1: {},
      summary2: {},
      filters: [
        {
          type: 'single',
          label: '',
          value: 'customerIns',
          options: [
            { value: 'customerIns', label: '新增潜客' },
            { value: 'customerCnt', label: '累计潜客' },
            { value: 'customerDriveIns', label: '新增试驾' },
            { value: 'customerDriveCnt', label: '累计试驾' },
            { value: 'customerVisitIns', label: '当期回访' },
            { value: 'customerVisitRate', label: '当期回访率' },
            { value: 'customerVisitCnt', label: '累计回访' }
          ]
        }
      ],
      kpiName: ['本期', '同比', '环比'],
      arr: [
        { type: 'productNumDistribute', indicators: 'totalNum' },
        { type: 'productSafeAnalysis', indicators: 'safeAmountTrend' },
        { type: 'productTransformationAnalysis', indicators: 'viewNum' }
      ],
      chartData: {},
      chartDataOfLevel: {},
      chartDataOfChannel: {},
      chartDataOfContract: {},
      chartDataOfDefeat: {},
      chartDataOfConsultant: {},
      isShow: 'false'
    };
  },
  methods: {
    handleCheckAllClass(val) {
      this.checkedClass = val
        ? this.classList.map(item => {
          return item.id.toString();
        })
        : [];
      this.query();
    },
    classChange(value) {
      let checkedCount = value.length;
      this.checkAllClass = checkedCount === this.classList.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.classList.length;
      this.query();
    },
    query() {
      this.params = {
        viewType: this.viewType,
        beginDate: this.beginDate,
        endDate: this.endDate,
        dateType: this.dateType,
        checkedClass: this.checkedClass
      };
      // this.getGraphData();
      this.getGraphPieData();
      this.getGraphChannelData();
      this.getGraphContractData();
      // this.getGraphDefeatData();
      this.getGraphGeneralData();
      for (let i = 0; i < this.arr.length; i++) {
        this.init(this.arr[i].type, this.arr[i].indicators, i);
      }
    },
    getClassList() {
      this.loading = true;
      let params = {};
      http
        .get('/admin/json/ShopProduct_category/list.jhtml?', params)
        .then(data => {
          this.classList = data.ProductCategoryManage;
          this.checkedClass = this.classList
            ? this.classList.map(item => {
              return item.id.toString();
            })
            : [];
          this.query();
        })
        .catch(errData => {
          this.loading = false;
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    genralAnalysis() {
      this.title = '数量分析';
      this.showIntention = false;
      this.showChannel = false;
      this.showContract = false;
      this.showDefeat = false;
      this.showConsultant = false;
      this.showGenral = true;
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs.generalViewAnalysisInfo.load();
      });
    },
    intentionAnalysis() {
      this.title = '销售分析';
      this.showGenral = false;
      this.showChannel = false;
      this.showContract = false;
      this.showDefeat = false;
      this.showConsultant = false;
      this.showIntention = true;
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs.intentionAnalysis.load();
      });
    },
    channelAnalysis() {
      this.title = '转化分析';
      this.showGenral = false;
      this.showIntention = false;
      this.showContract = false;
      this.showDefeat = false;
      this.showConsultant = false;
      this.showChannel = true;
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs.channelAnalysis.load();
      });
    },
    contractAnalysis() {
      this.title = '服务分析';
      this.showGenral = false;
      this.showIntention = false;
      this.showChannel = false;
      this.showDefeat = false;
      this.showConsultant = false;
      this.showContract = true;
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs.contractAnalysis.load();
      });
    },
    defeatAnalysis() {
      this.title = '消费人群分析';
      this.showGenral = false;
      this.showIntention = false;
      this.showChannel = false;
      this.showDefeat = true;
      this.showConsultant = false;
      this.showContract = false;
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs.defeatAnalysis.load();
      });
    },
    consultantAnalysis() {
      this.title = '商品榜单';
      this.showGenral = false;
      this.showIntention = false;
      this.showChannel = false;
      this.showDefeat = false;
      this.showConsultant = true;
      this.showContract = false;
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
    // 商品榜单
    getGraphGeneralData() {
      this.loading = true;
      let params = {
        viewType: this.viewType,
        beginDate: this.beginDate,
        endDate: this.endDate,
        shopId: window.top.SHOP_ID || '',
        type: 'productTop',
        indicators: ['sellWell'],
        productCateGorys: this.checkedClass
      };
      http
        .post('/admin/ecommerce/kpi/product/graph/product.jhtml', params)
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
      for (let i = 0; i < (data.indicators.length > 4 ? 4 : data.indicators.length); i++) {
        tmpData.push({
          商品: data.indicators[i].xValue,
          件: data.indicators[i].yValue
        });
      }
      let chartData = {
        legendVisible: false,
        type: 'histogram',
        data: {
          columns: ['商品', '件'],
          rows: tmpData
        },
        settings: {
          interval: 0
        }
      };
      return chartData;
    },
    // 消费人群分析
    getGraphDefeatData() {
      this.loading = true;
      let params = {
        viewType: this.viewType,
        type: 'productCrowdAnalysis',
        indicators: ['productConsumeValue'],
        productCateGorys: this.checkedClass,
        beginDate: this.beginDate,
        endDate: this.endDate,
        shopId: window.top.SHOP_ID || ''
      };
      http
        .post('/admin/ecommerce/kpi/product/graph/product.jhtml', params)
        .then(data => {
          this.chartDataOfDefeat = this.dataDefeatFormat(data);
        })
        .catch(errData => {
          this.loading = false;
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    dataDefeatFormat(data) {
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
    // 服务分析
    getGraphContractData() {
      this.loading = true;
      let params = {
        viewType: this.viewType,
        type: 'orderSatisfaction',
        indicators: ['serviceAttitude', 'serviceSpeed', 'professional'],
        productCateGorys: this.checkedClass,
        beginDate: this.beginDate,
        endDate: this.endDate,
        shopId: window.top.SHOP_ID || ''
      };
      http
        .post('/admin/ecommerce/kpi/order/graph/order/order.jhtml', params)
        .then(data => {
          this.chartDataOfContract = this.dataContractFormat(data);
        })
        .catch(errData => {
          this.loading = false;
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    dataContractFormat(data) {
      console.log(1);
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
    // 销售分析
    getGraphPieData() {
      this.loading = true;
      let params = {
        viewType: this.viewType,
        beginDate: this.beginDate,
        endDate: this.endDate,
        type: 'productSafeAnalysis',
        indicators: ['safeAmountTrend'],
        productCateGorys: this.checkedClass,
        shopId: window.top.SHOP_ID || ''
      };
      http
        .post('/admin/ecommerce/kpi/product/graph/product.jhtml', params)
        .then(data => {
          this.chartDataOfLevel = this.dataLevelFormat(data);
        })
        .catch(errData => {
          this.loading = false;
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    dataLevelFormat(data) {
      let tmpData = [];
      for (let i = 0; i < (data.indicators.length > 4 ? 4 : data.indicators.length); i++) {
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
    // 转化分析
    getGraphChannelData() {
      this.loading = true;
      let params = {
        beginDate: this.beginDate,
        endDate: this.endDate,
        viewType: this.viewType,
        productCateGorys: this.checkedClass,
        shopId: window.top.SHOP_ID || ''
      };
      http
        .post('/admin/ecommerce/kpi/product/summary/productTransformation.jhtml', params)
        .then(data => {
          this.chartDataOfChannel = this.dataChannelFormat(data);
        })
        .catch(errData => {
          this.loading = false;
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    dataChannelFormat(data) {
      let tmpData = [
        {
          状态: '浏览人数',
          数值: data.indicators.viewNum
        },
        { 状态: '下单人数', 数值: data.indicators.consumeNum },
        { 状态: '付款人数', 数值: data.indicators.paymentNum }
      ];
      let chartData = {
        type: 'funnel',
        data: {
          columns: ['状态', '数值'],
          rows: tmpData
        },
        settings: {}
      };
      return chartData;
    },
    // 数量分析
    getGraphData() {
      this.loading = true;
      let params = {
        viewType: this.viewType,
        indicators: ['typeDistribute'],
        beginDate: this.beginDate,
        endDate: this.endDate,
        shopId: window.top.SHOP_ID || '',
        type: 'productNumDistribute',
        productCateGorys: this.checkedClass
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
      this.dateType = val.dateType;
      this.beginDate = val.date[0];
      this.endDate = val.date[1];
      this.params = { viewType: this.viewType, beginDate: this.beginDate, endDate: this.endDate, dateType: val.dateType };
      this.query();
    },
    dataFormat(data) {
      let tmpData = [];
      for (let i = 0; i < (data.indicators.length > 4 ? 4 : data.indicators.length); i++) {
        tmpData.push({
          分类: data.indicators[i].lable,
          数量: data.indicators[i].value
        });
      }
      let chartData = {
        legendVisible: false,
        type: 'histogram',
        data: {
          columns: ['分类', '数量'],
          rows: tmpData
        },
        settings: {
          interval: 0
        }
      };
      return chartData;
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
    this.query();
  },
  components: {
    BizChart,
    // GeneralViewAnalysisInfo,
    IntentionAnalysis,
    ChannelAnalysis,
    ContractAnalysis,
    // DefeatAnalysis,
    ConsultantAnalysis,
    // ViewTypeSwich,
    ShowSearchGrid
  }
};
</script>

<style lang="scss">
.general-view-analysis-shopProduct {
  height: 100%;
  overflow: auto;
  margin: 20px 0px 20px 20px;
  padding-bottom: 20px;
  padding-right: 10px;
  min-width: 560px;
  .indicators-search {
    display: flex;
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
      width: 130px;
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
    margin-top: 10px!important;
    display: flex;
    .graph {
      box-shadow: 0 2px 3px rgba(0, 0, 0, 0.1);
      margin-bottom: 20px;
      margin-right: 5px;
      width: 49%;
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
