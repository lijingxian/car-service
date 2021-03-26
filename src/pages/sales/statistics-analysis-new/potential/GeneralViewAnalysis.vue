<template>
  <div class="general-view-analysis-ly">
    <div slot="top">
      <show-search-grid @refreshHandle="refreshHandle" :showViewType="false">
        <div slot="description" class="description-pover">
          <p>概览分析：统计潜客各行为特征的变化情况</p>
          <p>意向分析：统计潜客意向级别与意向车型分布情况</p>
          <p>渠道分析：统计潜客来源渠道分布情况</p>
          <p>签约分析：统计潜客签约变化情况</p>
          <p>战败分析：统计潜客战败变化情况</p>
          <p>顾问分析：统计销售顾问行为情况</p>
        </div>
      </show-search-grid>
    </div>
    <div class="total">
      <div class="column1">
        <div class="table-cell">
          新增有效潜客数
          <div class="color-primary"><span class="font">{{summary.valid.increase}}</span>人</div>
          <div class="color-primary">
            环比
            <span :style="summary.valid.monthOnMonth>0?'color:red':'color:green'"><i :class="summary.valid.monthOnMonth>0?'iconfont biz-icon-i-sh-man-pullup':'iconfont biz-icon-i-sh-man-pulldown'"></i>{{summary.valid.monthOnMonth}}%</span>
            同比
            <span :style="summary.valid.yearOnYear>0?'color:red':'color:green'"><i :class="summary.valid.yearOnYear>0?'iconfont biz-icon-i-sh-man-pullup':'iconfont biz-icon-i-sh-man-pulldown'"></i>{{summary.valid.yearOnYear}}%</span>
          </div>
        </div>
      </div>
      <div class="column2">
        <div class="table-cell">
          新增签约数
          <div class="color-primary"><span class="font">{{summary.sign.increase}}</span>人</div>
          <div class="color-primary">
            环比
            <span :style="summary.sign.monthOnMonth>0?'color:red':'color:green'"><i :class="summary.sign.monthOnMonth>0?'iconfont biz-icon-i-sh-man-pullup':'iconfont biz-icon-i-sh-man-pulldown'"></i>{{summary.sign.monthOnMonth}}%</span>
            同比
            <span :style="summary.sign.yearOnYear>0?'color:red':'color:green'"><i :class="summary.sign.yearOnYear>0?'iconfont biz-icon-i-sh-man-pullup':'iconfont biz-icon-i-sh-man-pulldown'"></i>{{summary.sign.yearOnYear}}%</span>
          </div>
        </div>
      </div>
    </div>
    <div class="chart-area">
      <div class="graph">
        <div class="header">
          <span>趋势分析</span>
          <span class="font">新增潜客</span>
          <i class="iconfont biz-icon-i-web-fd" @click="genralAnalysis"></i>
        </div>
        <biz-chart :chartData="chartData" :loading="loading" :showSearch="false"></biz-chart>
      </div>
      <div class="graph">
        <div class="header">
          <span>意向分析</span>
          <span class="font">潜客级别</span>
          <i class="iconfont biz-icon-i-web-fd" @click="intentionAnalysis"></i>
        </div>
        <biz-chart :chartData="chartDataOfLevel" :loading="loading" :showSearch="false"></biz-chart>
      </div>
      <div class="graph">
        <div class="header">
          <span>渠道分析</span>
          <span class="font">潜客渠道</span>
          <i class="iconfont biz-icon-i-web-fd" @click="channelAnalysis"></i>
        </div>
        <biz-chart :chartData="chartDataOfChannel" :loading="loading" :showSearch="false"></biz-chart>
      </div>
    </div>
    <div class="chart-area">
      <div class="graph">
        <div class="header">
          <span>转化分析</span>
          <span class="font">潜客转化</span>
          <i class="iconfont biz-icon-i-web-fd" @click="contractAnalysis"></i>
        </div>
        <biz-chart :chartData="chartDataOfContract" :loading="loading" :showSearch="false"></biz-chart>
      </div>
      <div class="graph">
        <div class="header">
          <span>战败分析</span>
          <span class="font">新增战败</span>
          <i class="iconfont biz-icon-i-web-fd" @click="defeatAnalysis"></i>
        </div>
        <biz-chart :chartData="chartDataOfDefeat" :loading="loading" :showSearch="false"></biz-chart>
      </div>
      <div class="graph">
        <div class="header">
          <span>顾问分析</span>
          <span class="font">顾问分布</span>
          <i class="iconfont biz-icon-i-web-fd" @click="consultantAnalysis"></i>
        </div>
        <biz-chart :chartData="chartDataOfConsultant" :loading="loading" :showSearch="false"></biz-chart>
      </div>
    </div>
    <el-dialog :visible.sync="dialogVisible" :title="title" width="1200px" append-to-body>
      <GeneralViewAnalysisInfo ref="generalViewAnalysisInfo" v-if="showGenral" :params="params"></GeneralViewAnalysisInfo>
      <IntentionAnalysis ref="intentionAnalysis" v-if="showIntention" :params="params"></IntentionAnalysis>
      <ChannelAnalysis ref="channelAnalysis" v-if="showChannel" :params="params"></ChannelAnalysis>
      <ContractAnalysis ref="contractAnalysis" v-if="showContract" :params="params"></ContractAnalysis>
      <DefeatAnalysis ref="defeatAnalysis" v-if="showDefeat" :params="params"></DefeatAnalysis>
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
import IntentionAnalysis from './IntentionAnalysis';
import ChannelAnalysis from './ChannelAnalysis';
import ContractAnalysis from './ContractAnalysis';
import DefeatAnalysis from './DefeatAnalysis';
import ConsultantAnalysis from './ConsultantAnalysis';
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
      showIntention: false,
      showChannel: false,
      showContract: false,
      showDefeat: false,
      showConsultant: false,
      title: '概览分析',
      summary: {
        sign: {},
        valid: {}
      },
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
    genralAnalysis() {
      this.title = '趋势分析';
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
      this.title = '意向分析';
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
      this.title = '渠道分析';
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
      this.title = '签约分析';
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
      this.title = '战败分析';
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
      this.title = '顾问分析';
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
        beginDate: this.beginDate,
        endDate: this.endDate,
        summaryType: '0'
      };
      http
        .get('admin/ecommerce/kpi/summary/sales/customer/v2.jhtml', params)
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
        viewType: this.viewType,
        beginDate: this.beginDate,
        endDate: this.endDate,
        shopId: window.top.SHOP_ID || ''
      };
      http
        .get('/admin/ecommerce/kpi/graph/sales/customer/salesAdvisor.jhtml', params)
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
          顾问: data.indicators[i].xValue,
          人数: data.indicators[i].yValue
        });
      }
      let chartData = {
        legendVisible: false,
        type: 'histogram',
        data: {
          columns: ['顾问', '人数'],
          rows: tmpData
        },
        settings: {}
      };
      return chartData;
    },
    // 战败分析
    getGraphDefeatData() {
      this.loading = true;
      let params = {
        viewType: this.viewType,
        indicator: 'customerDefeatIns', // 新增战败数
        beginDate: this.beginDate,
        endDate: this.endDate,
        shopId: window.top.SHOP_ID || ''
      };
      http
        .get('admin/ecommerce/kpi/graph/sales/customer/defeat.jhtml', params)
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
    // 回访率
    getGraphContractData() {
      this.loading = true;
      let params = {
        viewType: this.viewType,
        indicators: 'customerVisitRate', // 回访率
        beginDate: this.beginDate,
        endDate: this.endDate,
        shopId: window.top.SHOP_ID || ''
      };
      http
        .get('/admin/ecommerce/kpi/graph/sales/customer/v2.jhtml', params)
        .then(data => {
          this.zhData = { customerVisitRate: data.indicators[0].y[0].yValue };
          this.getGraphDriveData();
        })
        .catch(errData => {
          this.loading = false;
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    // 试驾率
    getGraphDriveData() {
      this.loading = true;
      let params = {
        viewType: this.viewType,
        indicators: 'customerDriveRate', // 回访率
        beginDate: this.beginDate,
        endDate: this.endDate,
        shopId: window.top.SHOP_ID || ''
      };
      http
        .get('/admin/ecommerce/kpi/graph/sales/customer/v2.jhtml', params)
        .then(data => {
          this.zhData = Object.assign(this.zhData, { customerDriveRate: data.indicators[0].y[0].yValue });
          this.getGraphSignData();
        })
        .catch(errData => {
          this.loading = false;
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    // 签约率
    getGraphSignData() {
      this.loading = true;
      let params = {
        viewType: this.viewType,
        indicators: 'customerSignRate', // 回访率
        beginDate: this.beginDate,
        endDate: this.endDate,
        shopId: window.top.SHOP_ID || ''
      };
      http
        .get('/admin/ecommerce/kpi/graph/sales/customer/v2.jhtml', params)
        .then(data => {
          this.zhData = Object.assign(this.zhData, { customerSignRate: data.indicators[0].y[0].yValue });
          this.chartDataOfContract = this.dataFunnelFormat(this.zhData);
        })
        .catch(errData => {
          this.loading = false;
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    dataFunnelFormat(data) {
      let tmpData = [
        {
          状态: '回访率',
          数值: data.customerVisitRate
        },
        { 状态: '试驾率', 数值: data.customerDriveRate },
        { 状态: '签约率', 数值: data.customerSignRate }
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
    dataContractFormat(data) {
      let tmpData = [];
      for (let i = 0; i < data.indicators.length; i++) {
        tmpData.push({
          日期: data.indicators[i].xValue,
          本期: data.indicators[i].y[0].yValue,
          同比: data.indicators[i].y[0].yoyRate,
          环比: data.indicators[i].y[0].momRate
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
    // 意向分析
    getGraphPieData() {
      this.loading = true;
      let params = {
        viewType: this.viewType,
        beginDate: this.beginDate,
        endDate: this.endDate,
        shopId: window.top.SHOP_ID || ''
      };
      http
        .get('/admin/ecommerce/kpi/graph/sales/customer/level/pie.jhtml', params)
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
      for (let i = 0; i < data.data.length; i++) {
        tmpData.push({
          type: data.data[i].name,
          value: data.data[i].count
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
          offsetY: '40%'
        }
      };
      return chartData;
    },
    // 渠道分析
    getGraphChannelData() {
      this.loading = true;
      let params = {
        beginDate: this.beginDate,
        endDate: this.endDate,
        shopId: window.top.SHOP_ID || ''
      };
      http
        .get('/admin/ecommerce/kpi/graph/sales/customer/channel.jhtml', params)
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
      let tmpData = [];
      for (let i = 0; i < data.data.length; i++) {
        tmpData.push({
          type: data.data[i].name,
          value: data.data[i].count
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
          offsetY: '55%'
        }
      };
      return chartData;
    },
    // 概览分析
    getGraphData() {
      this.loading = true;
      let params = {
        viewType: this.viewType,
        indicators: this.filters[0].value,
        beginDate: this.beginDate,
        endDate: this.endDate,
        shopId: window.top.SHOP_ID || ''
      };
      http
        .get('/admin/ecommerce/kpi/graph/sales/customer/v2.jhtml', params)
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
      this.getGraphData();
      this.getGraphPieData();
      this.getGraphChannelData();
      this.getGraphContractData();
      this.getGraphDefeatData();
      this.getGraphGeneralData();
      this.init();
    },
    filterDataChange(val) {
      this.filters = val;
      this.getGraphData();
      this.getGraphPieData();
      this.getGraphContractData();
      this.getGraphDefeatData();
      this.getGraphGeneralData();
      this.getGraphChannelData();
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
          本期: data.indicators[i].y[0].yValue,
          同比: data.indicators[i].y[0].yoyRate,
          环比: data.indicators[i].y[0].momRate
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
    this.getGraphData();
    this.getGraphPieData();
    this.getGraphChannelData();
    this.getGraphContractData();
    this.getGraphDefeatData();
    this.getGraphGeneralData();
  },
  components: {
    BizChart,
    GeneralViewAnalysisInfo,
    IntentionAnalysis,
    ChannelAnalysis,
    ContractAnalysis,
    DefeatAnalysis,
    ConsultantAnalysis,
    // ViewTypeSwich,
    ShowSearchGrid
  }
};
</script>

<style lang="scss">
.general-view-analysis-ly {
  height: 100%;
  overflow: auto;
  margin: 20px 0px 20px 20px;
  padding-bottom: 20px;
  padding-right: 10px;
  min-width: 560px;
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
