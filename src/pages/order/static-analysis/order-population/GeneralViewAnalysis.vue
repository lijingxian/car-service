<template>
  <div class="general-view-analysis-order">
    <div slot="top">
      <show-search-grid @refreshHandle="refreshHandle" :showViewType="false">
        <div slot="description" class="description-pover">
          <p>地域分布：统计下单人群的地域分布</p>
          <p>新老客户：统计下单人群的新老客分布</p>
          <p>消费价值：统计下单人群的消费价值特性</p>
          <p>人群属性：统计下单人群的人群属性</p>
        </div>
      </show-search-grid>
      <div class="indicators-search">
        <div class="title">订单类型</div>
        <div style="display:flex;width: calc(100% - 90px);flex-flow:wrap">
          <el-checkbox-button v-model="checkAllOrderType" @change="handleCheckAllOrderType" :indeterminate="isIndeterminate">全部</el-checkbox-button>
          <el-tooltip placement="bottom" v-for="(condition,index)  in conditionData.orderTypeList" :key="index" :disabled="condition.label.length<=10">
            <el-checkbox-group v-model="checkedOrderType" @change="conditionChange">
              <el-checkbox-button :label="condition.value" size="mini">
                {{condition.label.length>10?condition.label.substr(0, 10)+'...':condition.label}}</el-checkbox-button>
            </el-checkbox-group>
            <div slot="content">{{ condition.label }}</div>
          </el-tooltip>
        </div>
      </div>
    </div>
    <div class="total">
      <div class="column1">
        <div class="table-cell">
          下单人数
          <div class="color-primary">
            <span class="font">{{summary.increase}}</span>人
          </div>
          <div class="color-primary">
            环比
            <span style="color:red;">
              <i class="iconfont biz-icon-i-sh-man-pullup"></i>
              {{summary.insMom}}%
            </span>
            同比
            <span style="color:red;">
              <i class="iconfont biz-icon-i-sh-man-pullup"></i>
              {{summary.insYoy}}%
            </span>
          </div>
        </div>
      </div>
    </div>
    <div class="chart-area">
      <div class="graph">
        <div class="header">
          <span>地域分布</span>
          <span class="font"></span>
          <i class="iconfont biz-icon-i-web-fd" @click="positionAnalysis"></i>
        </div>
        <biz-chart ref="bizChart" :chartData="chartData" :loading="loading" :showSearch="false" :showMap="showMap" :showMapChart="showMapChart"></biz-chart>
      </div>
      <div class="graph">
        <div class="header">
          <span>新老客户</span>
          <span class="font"></span>
          <i class="iconfont biz-icon-i-web-fd" @click="customerAnalysis"></i>
        </div>
        <biz-chart :chartData="chartDataOfCustomer" :loading="loading" :showSearch="false"></biz-chart>
      </div>
    </div>
    <div class="chart-area">
      <div class="graph">
        <div class="header">
          <span>消费价值</span>
          <span class="font">消费价值</span>
          <i class="iconfont biz-icon-i-web-fd" @click="consumeAnalysis"></i>
        </div>
        <biz-chart :chartData="chartDataOfConsume" :loading="loading" :showSearch="false"></biz-chart>
      </div>
      <div class="graph">
        <div class="header">
          <span>人群属性</span>
          <span class="font">年龄</span>
          <i class="iconfont biz-icon-i-web-fd" @click="crowdAnalysis"></i>
        </div>
        <biz-chart :chartData="chartDataOfCrowd" :loading="loading" :showSearch="false"></biz-chart>
      </div>
    </div>
    <el-dialog :visible.sync="dialogVisible" :title="title" width="1200px" append-to-body>
      <PositionAnalysisInfo ref="positionAnalysisInfo" v-if="showGenral" :params="params"></PositionAnalysisInfo>
      <CustomerAnalysis ref="customerAnalysis" v-if="showCustomer" :params="params"></CustomerAnalysis>
      <ConsumeAnalysis ref="consumeAnalysis" v-if="showConsume" :params="params"></ConsumeAnalysis>
      <CrowdAnalysis ref="crowdAnalysis" v-if="showCrowd" :params="params"></CrowdAnalysis>
    </el-dialog>
  </div>
</template>

<script>
import BizChart from '@/components/BizChart';
// import BizFilter from '@/components/BizTable/BizFilter';
import dateTime from '@/utils/dateTime';
import http from '@/common/http';
import PositionAnalysisInfo from './PositionAnalysisInfo';
import CustomerAnalysis from './CustomerAnalysis';
import ConsumeAnalysis from './ConsumeAnalysis';
import CrowdAnalysis from './CrowdAnalysis';
import ShowSearchGrid from '../components/ShowSearchGrid';
import vPinyin from '@/utils/vue-py';
export default {
  name: 'PositionAnalysis',
  data() {
    return {
      params: {},
      loading: true,
      height: '500',
      beginDate: dateTime.getPreThreeMonthDay(),
      endDate: dateTime.today(),
      viewType: 'month',
      checkAllOrderType: true,
      isIndeterminate: true,
      checkedOrderType: [],
      conditionData: [
        {
          orderTypeList: []
        }
      ],
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
      showCustomer: false,
      showHit: false,
      showConsume: false,
      showCrowd: false,
      showConsultant: false,
      title: '地域分布',
      summary: {},
      kpiName: ['本期', '同比', '环比'],
      chartData: {},
      chartDataOfCustomer: {},
      chartDataOfHit: {},
      chartDataOfConsume: {},
      chartDataOfCrowd: {},
      chartDataOfConsultant: {},
      isShow: 'false',
      showMap: true,
      showMapChart: false,
      showBackButton: false,
      level: '1',
      provinceName: '',
      hasChildFlg: false,
      charMapData: []
    };
  },
  methods: {
    handleCheckAllOrderType(val) {
      this.checkedOrderType = val
        ? this.conditionData.orderTypeList.map(item => {
          return item.value;
        })
        : [];
      this.query();
    },
    conditionChange(value) {
      let checkedCount = value.length;
      this.checkAllOrderType = checkedCount === this.conditionData.orderTypeList.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.conditionData.orderTypeList.length;
      this.query();
    },
    getConditionData() {
      this.conditionData.orderTypeList = [
        { label: '车品订单', value: 'product' },
        { label: '充值', value: 'deposit' },
        { label: '普通服务', value: 'service' },
        { label: '一键救援', value: 'rescue' },
        { label: '预约维修', value: 'repair' },
        { label: '预约保养', value: 'maintain' },
        { label: '预约置换', value: 'replace' },
        { label: '贷款购车', value: 'loan' },
        { label: '预约体验', value: 'ride' },
        { label: '整车订单', value: 'car' },
        { label: '普通订单', value: 'general' },
        { label: '维修保养订单', value: 'repairAndMaintain' },
        { label: '产品订单', value: 'productAndCar' },
        { label: 'sim卡充值订单', value: 'simRecharge' },
        { label: '平台服务', value: 'businessService' },
        { label: '短信服务', value: 'smsService' },
        { label: '活动招募', value: 'recruit' },
        { label: '优惠券订单', value: 'couponOrder' },
        { label: '打赏订单', value: 'rewardOrder' },
        { label: '店铺账户充值订单', value: 'accountRecharge' }
      ];
      this.checkedOrderType = this.conditionData.orderTypeList
        ? this.conditionData.orderTypeList.map(item => {
          return item.value;
        })
        : [];
      this.query();
    },
    positionAnalysis() {
      this.title = '地域分布';
      this.showCustomer = false;
      this.showConsume = false;
      this.showCrowd = false;
      this.showGenral = true;
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs.positionAnalysisInfo.load();
      });
    },
    customerAnalysis() {
      this.title = '新老客户';
      this.showGenral = false;
      this.showConsume = false;
      this.showCrowd = false;
      this.showCustomer = true;
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs.customerAnalysis.load();
      });
    },
    consumeAnalysis() {
      this.title = '消费价值';
      this.showGenral = false;
      this.showCustomer = false;
      this.showCrowd = false;
      this.showConsume = true;
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs.consumeAnalysis.load();
      });
    },
    crowdAnalysis() {
      this.title = '人群属性';
      this.showGenral = false;
      this.showCustomer = false;
      this.showCrowd = true;
      this.showConsume = false;
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs.crowdAnalysis.load();
      });
    },
    init() {
      this.loading = true;
      let params = {
        orderTypes: this.checkedOrderType,
        shopId: window.top.SHOP_ID || '',
        beginDate: this.beginDate,
        endDate: this.endDate,
        viewType: this.viewType,
        indicators: ['crowdOrderNum'],
        type: 'crowdOrderNum'
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
    // 人群属性
    getGraphCrowdData() {
      this.loading = true;
      let params = {
        orderTypes: this.checkedOrderType,
        viewType: this.viewType,
        indicators: ['age'],
        type: 'crowdAttribute',
        beginDate: this.beginDate,
        endDate: this.endDate,
        shopId: window.top.SHOP_ID || ''
      };
      http
        .post('/admin/ecommerce/kpi/order/graph/order/order.jhtml', params)
        .then(data => {
          this.chartDataOfCrowd = this.dataCrowdFormat(data);
        })
        .catch(errData => {
          this.loading = false;
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    dataCrowdFormat(data) {
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
          // radius: [60, 150],
          offsetY: '50%'
        }
      };
      return chartData;
    },
    // 消费价值
    getGraphConsumeData() {
      this.loading = true;
      let params = {
        orderTypes: this.checkedOrderType,
        type: 'crowdCosumeValue',
        viewType: this.viewType,
        indicators: ['consumeDecision'],
        beginDate: this.beginDate,
        endDate: this.endDate,
        shopId: window.top.SHOP_ID || ''
      };
      http
        .post('/admin/ecommerce/kpi/order/graph/order/order.jhtml', params)
        .then(data => {
          this.chartDataOfConsume = this.dataConsumeFormat(data);
        })
        .catch(errData => {
          this.loading = false;
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    dataConsumeFormat(data) {
      let tmpData = [];
      for (let i = 0; i < data.indicators.length; i++) {
        tmpData.push({
          消费价值: data.indicators[i].lable,
          人数: data.indicators[i].value
        });
      }
      let chartData = {
        type: 'histogram',
        legendVisible: false,
        data: {
          columns: ['消费价值', '人数'],
          rows: tmpData
        },
        settings: {
          yAxisName: ['人']
        }
      };
      return chartData;
    },
    // 新老客户
    getGraphCustomerData() {
      this.loading = true;
      let params = {
        orderTypes: this.checkedOrderType,
        type: 'crowdOrderNum',
        viewType: this.viewType,
        indicators: ['crowdOrderNum'],
        beginDate: this.beginDate,
        endDate: this.endDate,
        shopId: window.top.SHOP_ID || ''
      };
      http
        .post('/admin/ecommerce/kpi/order/graph/order/order.jhtml', params)
        .then(data => {
          this.chartDataOfCustomer = this.dataCustomerFormat(data);
        })
        .catch(errData => {
          this.loading = false;
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    dataCustomerFormat(data) {
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
          // radius: ['20%', '60%'],
          offsetY: '50%'
        }
      };
      return chartData;
    },
    // 地域分析
    getGraphPositionData() {
      this.loading = true;
      let param = {
        orderTypes: this.checkedOrderType,
        type: 'crowdRegion',
        viewType: this.viewType,
        indicators: ['crowdRegion'],
        beginDate: this.beginDate,
        endDate: this.endDate,
        shopId: window.top.SHOP_ID || ''
      };
      http
        .post('/admin/ecommerce/kpi/order/graph/order/order.jhtml', param)
        .then(data => {
          this.charMapData = data.indicators;
          this.loading = false;
          if (this.level === '3') {
            this.showMap = true;
            this.showMapChart = false;
          }
          this.level = '1';
          this.showBackButton = false;
          this.chartData = this.dataPositionFormat(data.indicators);
        })
        .catch(error => {
          this.loading = false;
          if (error.errorMessage) {
            this.$message.warning(error.errorMessage);
          }
        });
    },
    dataPositionFormat(data) {
      let tmpData = [];
      let tmpDataByPro = [];
      let maxValue = 0;
      if (data.length === 1) {
        for (const item of data) {
          for (let i = 0; i < item.children.length; i++) {
            tmpDataByPro.push({
              位置: item.children[i].name,
              数量: Number(item.children[i].count)
            });
            maxValue = Math.max(maxValue, Number(item.children[i].totalCount));
          }
        }
      } else {
        for (let i = 0; i < data.length; i++) {
          tmpData.push({
            位置: data[i].name,
            数量: Number(data[i].count)
          });
          maxValue = Math.max(maxValue, Number(data[i].totalCount));
        }
      }
      let tmpStr = JSON.stringify(tmpData);
      let str = tmpStr.replace(/省/g, '');
      str = str.replace(/市/g, '');
      str = str.replace(/自治区/g, '');
      str = str.replace(/维吾尔/g, '');
      str = str.replace(/回族/g, '');
      str = str.replace(/壮族/g, '');
      str = str.replace(/特别行政区/g, '');
      let curData = JSON.parse(str);
      if (data.length === 1) {
        curData = tmpDataByPro;
      } else {
        curData = JSON.parse(str);
      }

      let oneProvince = vPinyin.chineseToPinYin(data.length > 0 ? data[0].name : []);

      let chartData = {
        type: 'map',
        data: {
          columns: ['位置', '数量'],
          rows: curData || []
        },
        maxRangeValue: maxValue || 100,
        settings: {
          position: data.length === 1 ? 'province/' + oneProvince : 'china',
          selectedMode: 'single',
          dimension: '位置',
          metrics: ['数量'],
          itemStyle: {
            normal: {
              areaColor: '#fff'
            }
          }
        }
      };
      return chartData;
    },
    refreshHandle(val) {
      this.viewType = val.viewType;
      this.beginDate = val.date[0];
      this.endDate = val.date[1];
      this.params = { viewType: this.viewType, beginDate: this.beginDate, endDate: this.endDate, dateType: val.dateType, checkedOrderType: this.checkedOrderType };
      this.getGraphPositionData();
      this.getGraphCustomerData();
      this.getGraphConsumeData();
      this.getGraphCrowdData();
      this.init();
    },
    handleSizeChange(val) {
      this.pagination.pageSize = val;
    },
    handleCurrentChange(val) {
      this.pagination.currentPage = val;
    },
    query() {
      this.params = Object.assign(this.params, { checkedOrderType: this.checkedOrderType });
      this.init();
      this.getGraphPositionData();
      this.getGraphCustomerData();
      this.getGraphConsumeData();
      this.getGraphCrowdData();
    }
  },
  computed: {},
  created() {
    this.getConditionData();
  },
  components: {
    BizChart,
    PositionAnalysisInfo,
    CustomerAnalysis,
    ConsumeAnalysis,
    CrowdAnalysis,
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
      width: 50%;
      height: 32vw;
      .biz-chart {
        height: 95%;
      }
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
