<template>
  <div class="general-view-analysis-car">
    <div slot="top">
      <show-search-grid @refreshHandle="refreshHandle" :showViewType="false">
        <div slot="description" class="description-pover">
          <p>智能到店：统计智能到店接待情况</p>
          <p>智能接待：统计智能机器人接待情况</p>
          <p>质量分析：统计智能到店异常到店, 接待时长及到店时间分布</p>
          <p>问答分析: 统计智能接待问答访问情况及客户评价情况</p>
        </div>
      </show-search-grid>
    </div>
    <div class="indicators-search" :class="{'showHide1' : showHideShopByShop1}">
      <div class="title">店铺</div>
      <div class="hardShopGroupByShop1" :class="{'showHideShopByShop1' : showHideShopByShop1}" ref="shopGroupByShop1">
        <el-checkbox-button v-model="checkAllShopByShop" @change="handleCheckAllShopByShop" :indeterminate="isIndeterminateShopByShop">全部</el-checkbox-button>
        <el-tooltip placement="bottom" v-for="(condition,index)  in shopListByShop" :key="index" :disabled="condition.name.length<=10">
          <el-checkbox-group :min="1" v-model="checkedShopByShop" @change="shopChangeByShop">
            <el-checkbox-button :label="condition.id" size="mini">
              {{condition.name.length>10?condition.name.substr(0, 10)+'...':condition.name}}</el-checkbox-button>
          </el-checkbox-group>
          <div slot="content">{{ condition.name }}</div>
        </el-tooltip>
      </div>
    </div>
    <div class="swichShopByShop1" v-if="showShopSwichByShop1">
      <i :class="classNameShopByShop1" @click="swichShopByShop1"></i>
    </div>
    <div class="total">
      <div class="column2">
        <div class="table-cell">
          到店人数
          <div class="color-primary">
            <span class="font">{{summary.intelAccessCnt.increase}}</span>人
          </div>
          <div class="color-primary">
            环比
            <span :style="summary.intelAccessCnt.monthOnMonth>0?'color:red':'color:green'">
              <i :class="summary.intelAccessCnt.monthOnMonth>0?'iconfont biz-icon-i-sh-man-pullup':'iconfont biz-icon-i-sh-man-pulldown'"></i>
              {{summary.intelAccessCnt.monthOnMonth}}%
            </span>
            同比
            <span :style="summary.intelAccessCnt.yearOnYear>0?'color:red':'color:green'">
              <i :class="summary.intelAccessCnt.yearOnYear>0?'iconfont biz-icon-i-sh-man-pullup':'iconfont biz-icon-i-sh-man-pulldown'"></i>
              {{summary.intelAccessCnt.yearOnYear}}%
            </span>
          </div>
        </div>
      </div>
      <div class="column3">
        <div class="table-cell">
          接待人数
          <div class="color-primary">
            <span class="font">{{summary.robotAccessCnt.increase}}</span>人
          </div>
          <div class="color-primary">
            环比
            <span :style="summary.robotAccessCnt.monthOnMonth>0?'color:red':'color:green'">
              <i :class="summary.robotAccessCnt.monthOnMonth>0?'iconfont biz-icon-i-sh-man-pullup':'iconfont biz-icon-i-sh-man-pulldown'"></i>
              {{summary.robotAccessCnt.monthOnMonth}}%
            </span>
            同比
            <span :style="summary.robotAccessCnt.yearOnYear>0?'color:red':'color:green'">
              <i :class="summary.robotAccessCnt.yearOnYear>0?'iconfont biz-icon-i-sh-man-pullup':'iconfont biz-icon-i-sh-man-pulldown'"></i>
              {{summary.robotAccessCnt.yearOnYear}}%
            </span>
          </div>
        </div>
      </div>
    </div>
    <div class="chart-area">
      <div class="graph">
        <div class="header">
          <span>智能到店</span>
          <span class="font">新增到店</span>
          <i class="iconfont biz-icon-i-web-fd" @click="smartToShopAnalysis"></i>
        </div>
        <biz-chart :chartData="chartDataOfSmartToShop" :loading="loading" :showSearch="false"></biz-chart>
      </div>
      <div class="graph">
        <div class="header">
          <span>智能接待</span>
          <span class="font">新增接待</span>
          <i class="iconfont biz-icon-i-web-fd" @click="smartToReceptionAnalysis"></i>
        </div>
        <biz-chart :chartData="chartDataOfSmartToReception" :loading="loading" :showSearch="false"></biz-chart>
      </div>
    </div>
    <div class="chart-area">
      <div class="graph">
        <div class="header">
          <span>质量分析</span>
          <span class="font">异常到店数</span>
          <i class="iconfont biz-icon-i-web-fd" @click="smartToShopMassAnalysis"></i>
        </div>
        <biz-chart :chartData="chartDataOfSmartToShopMass" :loading="loading" :showSearch="false"></biz-chart>
      </div>
      <div class="graph">
        <div class="header">
          <span>问答分析</span>
          <span class="font">服务满意度评分</span>
          <i class="iconfont biz-icon-i-web-fd" @click="smartToReceptionMassAnalysis"></i>
        </div>
        <biz-chart :chartData="chartDataOfSmartToReceptionMass" :loading="loading" :showSearch="false"></biz-chart>
      </div>
    </div>
    <el-dialog :visible.sync="dialogVisible" :title="title" width="1200px" append-to-body>
      <SmartToReceptionAnalysis ref="smartToReceptionAnalysis" v-if="showSmartToReception" :params="params"></SmartToReceptionAnalysis>
      <SmartToShopAnalysis ref="smartToShopAnalysis" v-if="showSmartToShop" :params="params"></SmartToShopAnalysis>
      <SmartToReceptionMassAnalysis ref="smartToReceptionMassAnalysis" v-if="showSmartToReceptionMass" :params="params"></SmartToReceptionMassAnalysis>
      <SmartToShopMassAnalysis ref="smartToShopMassAnalysis" v-if="showSmartToShopMass" :params="params"></SmartToShopMassAnalysis>
    </el-dialog>
  </div>
</template>

<script>
import BizChart from '@/components/BizChart';
// import BizFilter from '@/components/BizTable/BizFilter';
import dateTime from '@/utils/dateTime';
import http from '@/common/http';
import SmartToReceptionAnalysis from './SmartToReceptionAnalysis';
import SmartToShopAnalysis from './SmartToShopAnalysis';
import SmartToReceptionMassAnalysis from './SmartToReceptionMassAnalysis';
import SmartToShopMassAnalysis from './SmartToShopMassAnalysis';
import { mapGetters } from 'vuex';
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
      dateType: 'month',
      pagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        total: 0
      },
      tableData: [],
      hardGroupHeight: 0,
      hardGroupHeight1: 0,
      checkedShopByShop: [],
      shopListByShop: [],
      checkAllShopByShop: false,
      isIndeterminateShopByShop: false,
      className: 'el-icon-caret-bottom',
      classNameShopByShop1: 'el-icon-caret-bottom',
      showShopSwichByShop1: false,
      showHideShopByShop1: false,
      showHide1: false,
      showSwich: false,
      showHide: false,
      conditionData: [
        {
          shopsList: []
        }
      ],
      showRecommend: false,
      dialogVisible: false,
      showSmartToShopMass: false,
      showSmartToReceptionMass: false,
      showSmartToReception: false,
      showSmartToShop: false,
      title: '概览分析',
      summary: {
        sessionCnt: {},
        robotAccessCnt: {},
        intelAccessCnt: {}
      },
      filters: [],
      kpiName: ['本期', '同比', '环比'],
      chartData: {},
      chartDataOfConsultant: {},
      chartDataOfCustomerService: {},
      chartDataOfSmartToShop: {},
      chartDataOfSmartToReception: {},
      chartDataOfSmartToShopMass: {},
      chartDataOfSmartToReceptionMass: {},
      isShow: 'false'
    };
  },
  methods: {
    ...mapGetters(['getUser']),
    shopChangeByShop(val) {
      let checkedCount = val.length;
      this.checkAllShopByShop = checkedCount === this.shopListByShop.length;
      this.isIndeterminateShopByShop = checkedCount > 0 && checkedCount < this.shopListByShop.length;
      this.query();
    },
    handleCheckAllShopByShop(val) {
      if (val) {
        this.checkedShopByShop = val
          ? this.shopListByShop.map(item => {
            return item.id;
          })
          : [];
      } else {
        this.checkedShopByShop = [];
        this.checkedShopByShop.push(this.getUser().shop.id);
      }
      this.query();
    },
    query() {
      this.params = {
        viewType: this.viewType,
        beginDate: this.beginDate,
        endDate: this.endDate,
        dateType: this.dateType
      };
      this.init();
      this.getGraphSmartToReceptionData();
      this.getGraphSmartToShopData();
      this.getGraphSmartToReceptionMassData();
      this.getGraphSmartToShopMassData();
    },
    smartToShopAnalysis() {
      this.title = '智能到店';
      this.showSmartToShopMass = false;
      this.showSmartToReceptionMass = false;
      this.showSmartToReception = false;
      this.showSmartToShop = true;
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs.smartToShopAnalysis.load();
      });
    },
    smartToReceptionAnalysis() {
      this.title = '智能接待';
      this.showSmartToShopMass = false;
      this.showSmartToReceptionMass = false;
      this.showSmartToShop = false;
      this.showSmartToReception = true;
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs.smartToReceptionAnalysis.load();
      });
    },
    smartToShopMassAnalysis() {
      this.title = '质量分析';
      this.showSmartToShopMass = true;
      this.showSmartToReceptionMass = false;
      this.showSmartToReception = false;
      this.showSmartToShop = false;
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs.smartToShopMassAnalysis.load();
      });
    },
    smartToReceptionMassAnalysis() {
      this.title = '问答分析';
      this.showSmartToShopMass = false;
      this.showSmartToReceptionMass = true;
      this.showSmartToShop = false;
      this.showSmartToReception = false;
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs.smartToReceptionMassAnalysis.load();
      });
    },
    init() {
      this.loading = true;
      let params = {
        beginDate: this.beginDate,
        endDate: this.endDate,
        viewType: this.viewType,
        searchShopIds: this.checkedShopByShop.join('&searchShopIds=')
      };
      let paramsArr = [];
      for (let name in params) {
        paramsArr.push(`${name}=${params[name]}`);
      }
      http
        .get('/admin/ecommerce/kpi/summary/service/service.jhtml' + '?' + paramsArr.join('&'))
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
    getShopList() {
      http
        .get('/admin/member/json/findEShops.jhtml', { sourceType: '5' })
        .then(data => {
          this.shopListByShop = data.shops;
          this.checkedShopByShop.push(this.getUser().shop.id);
          this.$nextTick(() => {
            this.hardGroupHeight1 = document.getElementsByClassName('hardShopGroupByShop1')[0].offsetHeight;
            if (this.hardGroupHeight1 > 62) {
              this.showShopSwichByShop1 = true;
              this.showHideShopByShop1 = true;
            } else {
              this.showShopSwichByShop1 = false;
              this.showHideShopByShop1 = false;
            }
            this.query();
          });
        })
        .catch(errData => {
          if (errData.errorMessage) {
            this.$message.warning(errData.errorMessage);
          }
        });
    },
    // 智能接待
    getGraphSmartToReceptionData() {
      this.loading = true;
      let params = {
        indicator: 'receptionCnt',
        viewType: this.viewType,
        beginDate: this.beginDate,
        endDate: this.endDate,
        searchShopIds: this.checkedShopByShop
      };
      http
        .post('/admin/ecommerce/kpi/graph/service/reception.jhtml', params)
        .then(data => {
          this.chartDataOfSmartToReception = this.dataSmartToReceptionFormat(data);
        })
        .catch(errData => {
          this.loading = false;
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    dataSmartToReceptionFormat(data) {
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
    // 智能到店
    getGraphSmartToShopData() {
      this.loading = true;
      let params = {
        indicator: 'atShopCnt',
        viewType: this.viewType,
        beginDate: this.beginDate,
        endDate: this.endDate,
        searchShopIds: this.checkedShopByShop
      };
      http
        .post('/admin/ecommerce/kpi/graph/service/intelligentAccess.jhtml', params)
        .then(data => {
          this.chartDataOfSmartToShop = this.dataSmartToShopFormat(data);
        })
        .catch(errData => {
          this.loading = false;
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    dataSmartToShopFormat(data) {
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
    // 智能接待质量分析
    getGraphSmartToReceptionMassData() {
      this.loading = true;
      let params = {
        indicator: 'serviceAttitude',
        viewType: this.viewType,
        beginDate: this.beginDate,
        endDate: this.endDate,
        searchShopIds: this.checkedShopByShop
      };
      http
        .post('/admin/ecommerce/kpi/graph/service/reception.jhtml', params)
        .then(data => {
          this.chartDataOfSmartToReceptionMass = this.dataSmartToReceptionFormat(data);
        })
        .catch(errData => {
          this.loading = false;
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    dataSmartToReceptionMassFormat(data) {
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
    // 智能到店质量分析
    getGraphSmartToShopMassData() {
      this.loading = true;
      let params = {
        indicator: 'alarmIns',
        viewType: this.viewType,
        beginDate: this.beginDate,
        endDate: this.endDate,
        searchShopIds: this.checkedShopByShop
      };
      let paramsArr = [];
      for (let name in params) {
        paramsArr.push(`${name}=${params[name]}`);
      }
      http
        .post('/admin/ecommerce/kpi/graph/service/intelligentAccess.jhtml', params)
        .then(data => {
          this.chartDataOfSmartToShopMass = this.dataSmartToShopFormat(data);
        })
        .catch(errData => {
          this.loading = false;
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    dataSmartToShopMassFormat(data) {
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
    refreshHandle(val) {
      this.viewType = val.viewType;
      this.beginDate = val.date[0];
      this.endDate = val.date[1];
      this.dateType = val.dateType;
      this.params = { viewType: this.viewType, beginDate: this.beginDate, endDate: this.endDate, dateType: val.dateType };
      this.getGraphSmartToReceptionData();
      this.getGraphSmartToShopData();
      this.getGraphSmartToReceptionMassData();
      this.getGraphSmartToShopMassData();
      this.init();
    },
    filterDataChange(val) {
      this.filters = val;
      this.getGraphSmartToReceptionData();
      this.getGraphSmartToShopData();
      this.getGraphSmartToReceptionMassData();
      this.getGraphSmartToShopMassData();
    },
    swichShopByShop1() {
      this.classNameShopByShop1 =
        this.classNameShopByShop1 === 'el-icon-caret-bottom' ? 'el-icon-caret-top' : 'el-icon-caret-bottom';
      this.showHideShopByShop1 = this.classNameShopByShop1 === 'el-icon-caret-bottom';
      if (!this.showHideShopByShop1) {
        document.getElementsByClassName('hardShopGroupByShop1')[0].style.height = 'auto';
      } else {
        document.getElementsByClassName('hardShopGroupByShop1')[0].style.height = '55px';
      }
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
    }
  },
  created() {
    this.shopListByShop = [];
    this.getShopList();
  },
  components: {
    BizChart,
    SmartToShopAnalysis,
    SmartToReceptionAnalysis,
    SmartToShopMassAnalysis,
    SmartToReceptionMassAnalysis,
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
    .hardShopGroupByShop1 {
      display: flex;
      width: calc(100% - 90px);
      flex-flow: wrap;
    }
  }
  .swich {
    text-align: center;
    font-size: 24px;
    cursor: pointer;
    margin-top: -10px;
  }
  .swichShopByShop1 {
    text-align: center;
    font-size: 24px;
    cursor: pointer;
    margin-top: -10px;
  }
  .showHide {
    height: 55px;
    overflow-y: hidden;
  }
  .showHide1 {
    height: 55px;
  }
  .showHideShopByShop1 {
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
