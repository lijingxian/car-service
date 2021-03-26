<template>
  <div class="general-view-analysis-car">
    <div slot="top">
      <show-search-grid @refreshHandle="refreshHandle" :showViewType="false">
        <div slot="description" class="description-pover">
          <p>车况：统计某一车辆的历史检测结果</p>
          <p>故障：统计某一车辆的故障情况</p>
          <p>油耗情况：统计某一车辆的油耗情况</p>
          <p>行驶里程：统计某一车辆的行驶里程情况</p>
          <p>驾驶习惯：统计某一车辆的急操作情况</p>
        </div>
      </show-search-grid>
    </div>
    <div class="member-info">
      <div class="header">
        <span>{{filters[0].value || this.$route.query.plateNumber}}</span>
        <span><el-button @click="carSelected" type="text" size="mini">切换车辆</el-button></span>
      </div>
      <div class="content">
        <span>车主：{{summary.ownerName}}</span><span>车主电话：{{summary.mobile}}</span>
      </div>
      <div class="content">
        <span>品牌：{{summary.brand}}</span><span>系列：{{summary.series}}</span><span>车型：{{summary.type}}</span><span>车辆识别代号：{{summary.vin}}</span><span>发动机号：{{summary.engine_number}}</span>
      </div>
      <div class="content">
        <span>价格：{{summary.price}}</span><span>排量：{{summary.exhaust}}</span><span>车龄：{{summary.carAge}}</span>
      </div>
    </div>
    <div class="chart-area">
      <div class="graph">
        <div class="header">
          <span>车况</span>
          <i class="iconfont biz-icon-i-web-fd" @click="actionAnalysis"></i>
        </div>
        <biz-chart :chartData="chartDataOfAction" :loading="loading" :showSearch="false"></biz-chart>
      </div>
      <div class="graph">
        <div class="header">
          <span>故障</span>
          <i class="iconfont biz-icon-i-web-fd" @click="faultAnalysis"></i>
        </div>
        <biz-chart :chartData="chartDataOfFault" :loading="loading" :showSearch="false"></biz-chart>
      </div>
    </div>
    <div class="chart-area">
      <div class="graph1">
        <div class="header">
          <span>油耗情况</span>
          <i class="iconfont biz-icon-i-web-fd" @click="oilAnalysis"></i>
        </div>
        <biz-chart :chartData="chartDataOfOil" :loading="loading" :showSearch="false"></biz-chart>
      </div>
      <div class="graph1">
        <div class="header">
          <span>行驶里程</span>
          <i class="iconfont biz-icon-i-web-fd" @click="rangAnalysis"></i>
        </div>
        <biz-chart :chartData="chartDataOfRang" :loading="loading" :showSearch="false"></biz-chart>
      </div>
      <div class="graph1">
        <div class="header">
          <span>驾驶习惯</span>
          <i class="iconfont biz-icon-i-web-fd" @click="driveAnalysis"></i>
        </div>
        <biz-chart :chartData="chartDataOfDriving" :loading="loading" :showSearch="false"></biz-chart>
      </div>
    </div>
    <el-dialog :visible.sync="dialogVisible" :title="title" width="1200px" append-to-body>
      <ActionAnalysis ref="actionAnalysis" v-if="showAction" :params="params"></ActionAnalysis>
      <FaultAnalysis ref="faultAnalysis" v-if="showFault" :params="params"></FaultAnalysis>
      <RangAnalysis ref="rangAnalysis" v-if="showRang" :params="params"></RangAnalysis>
      <OilAnalysis ref="oilAnalysis" v-if="showOil" :params="params"></OilAnalysis>
      <DriveAnalysis ref="driveAnalysis" v-if="showDrive" :params="params"></DriveAnalysis>
    </el-dialog>
    <biz-dialog-selector
      title="选择车辆"
      :visibility.sync="showDialog"
      :appendToBody="true"
      :selectionMode="'single'"
      :isClear="false"
      :loading="dialogLoading"
      :tableData="dialogTableData"
      :pagination="dialogPagination"
      :filters="dialogFilters"
      @confirmed="handleConfirmed"
      @filterDataChange="dialogFilterDataChange"
      class="notice-dialog-selector"
      @pageSizeChange="dialogPageSizeChange"
      @currentPageChange="dialogCurrentPageChange"
    >
      <el-table-column prop="plateNumber" label="车牌号"></el-table-column>
      <el-table-column prop="member.name" label="车主姓名"></el-table-column>
      <el-table-column prop="member.mobile" label="车主电话"></el-table-column>
    </biz-dialog-selector>
  </div>
</template>

<script>
import BizChart from '@/components/BizChart';
// import BizFilter from '@/components/BizTable/BizFilter';
import dateTime from '@/utils/dateTime';
import http from '@/common/http';
import ActionAnalysis from './ActionAnalysis';
import FaultAnalysis from './FaultAnalysis';
import RangAnalysis from './RangAnalysis';
import OilAnalysis from './OilAnalysis';
import DriveAnalysis from './DriveAnalysis';
import { mapGetters } from 'vuex';
import BizDialogSelector from '@/components/BizDialogSelector';
import ShowSearchGrid from '../components/ShowSearchGrid';
import dateUtil from '@/utils/date';
import service from '@/service/vehicle-mgmt/VehicleMgmtVehicle';
export default {
  name: 'GeneralViewAnalysis',
  data() {
    return {
      params: {},
      loading: true,
      dialogLoading: true,
      showDialog: false,
      dialogTableData: [],
      dialogPagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        total: 0
      },
      dialogFilters: [
        {
          type: 'input',
          label: '',
          placeholder: '请输入车牌号/姓名/电话',
          name: 'searchValue',
          value: ''
        }
      ],
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
      className: 'el-icon-caret-bottom',
      showSwich: false,
      showHide: false,
      showRecommend: false,
      dialogVisible: false,
      showAction: false,
      showFault: false,
      showRang: false,
      showOil: false,
      showDrive: false,
      title: '概览分析',
      summary: {},
      filters: [
        {
          type: 'input',
          value: '',
          name: 'search',
          placeholder: '请输入车牌号',
          class: 'show'
        }
      ],
      kpiName: ['本期', '同比', '环比'],
      chartData: {},
      chartDataOfFault: {},
      chartDataOfAction: {},
      chartDataOfOil: {},
      chartDataOfRang: {},
      chartDataOfDriving: {},
      isShow: 'false'
    };
  },
  methods: {
    ...mapGetters(['getUser']),
    carSelected() {
      this.showDialog = true;
      this.queryCar();
    },
    handleConfirmed(selectionKeys, selections) {
      this.showDialog = false;
      this.filters[0].value = selections[0].plateNumber;
      this.query();
    },
    getQueryParams() {
      return {
        pageNumber: this.dialogPagination.currentPage,
        pageSize: this.dialogPagination.pageSize,
        searchValue: this.dialogFilters[0].value
      };
    },
    queryCar() {
      service.query(
        this.getQueryParams(),
        data => {
          this.dialogLoading = false;
          this.dialogTableData = data.cars;
          this.$set(this.dialogPagination, 'total', Number.parseInt(data.total));
        },
        // result_code 不是100的处理
        ErrorData => {
          this.dialogLoading = false;
          console.log(ErrorData);
          console.log('code错误');
          if (ErrorData.errorMessage !== '店铺不存在') this.$message.warning(ErrorData.errorMessage);
        }
      );
    },
    dialogFilterDataChange(val) {
      this.dialogFilters = val;
      this.dialogPagination.currentPage = 1;
      this.queryCar();
    },
    dialogPageSizeChange(val) {
      this.dialogPagination.pageSize = val;
      this.queryCar();
    },
    dialogCurrentPageChange(val) {
      this.dialogPagination.currentPage = val;
      this.queryCar();
    },
    query() {
      this.params = {
        viewType: this.viewType,
        beginDate: this.beginDate,
        endDate: this.endDate,
        dateType: this.dateType,
        plateNumber: this.filters[0].value || this.$route.query.plateNumber || ''
      };
      this.init();
      this.getGraphOilData();
      this.getGraphRangData();
      this.getGraphFaultData();
      this.getGraphActionData();
      this.getGraphDrivingData();
    },
    swich() {
      this.className = this.className === 'el-icon-caret-bottom' ? 'el-icon-caret-top' : 'el-icon-caret-bottom';
      this.showHide = this.className === 'el-icon-caret-bottom';
      if (!this.showHide) {
        document.getElementsByClassName('hardGroup')[0].style.height = 'auto';
      } else {
        document.getElementsByClassName('hardGroup')[0].style.height = '55px';
      }
    },
    actionAnalysis() {
      this.title = '车况';
      this.showFault = false;
      this.showOil = false;
      this.showRang = false;
      this.showDrive = false;
      this.showAction = true;
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs.actionAnalysis.load();
      });
    },
    faultAnalysis() {
      this.title = '故障';
      this.showAction = false;
      this.showOil = false;
      this.showRang = false;
      this.showDrive = false;
      this.showFault = true;
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs.faultAnalysis.load();
      });
    },
    oilAnalysis() {
      this.title = '油耗情况';
      this.showAction = false;
      this.showFault = false;
      this.showRang = false;
      this.showDrive = false;
      this.showOil = true;
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs.oilAnalysis.load();
      });
    },
    rangAnalysis() {
      this.title = '行驶里程';
      this.showAction = false;
      this.showFault = false;
      this.showOil = false;
      this.showDrive = false;
      this.showRang = true;
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs.rangAnalysis.load();
      });
    },
    driveAnalysis() {
      this.title = '驾驶习惯';
      this.showAction = false;
      this.showFault = false;
      this.showOil = false;
      this.showRang = false;
      this.showDrive = true;
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs.driveAnalysis.load();
      });
    },
    init() {
      this.loading = true;
      let params = {
        beginDate: this.beginDate,
        endDate: this.endDate,
        plateNumber: this.filters[0].value || this.$route.query.plateNumber || ''
      };
      http
        .post('/admin/ecommerce/kpi/car/summary/singleCarBaseInfo.jhtml', params)
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
    // 油耗情况
    getGraphOilData() {
      this.loading = true;
      let params = {
        plateNumber: this.filters[0].value || this.$route.query.plateNumber || '',
        indicator: 'singleOilIndex ',
        viewType: this.viewType,
        beginDate: this.beginDate,
        endDate: this.endDate
      };
      http
        .post('/admin/ecommerce/kpi/car/graph/singleDrivingAction.jhtml', params)
        .then(data => {
          this.chartDataOfOil = this.dataOilFormat(data);
        })
        .catch(errData => {
          this.loading = false;
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    dataOilFormat(data) {
      let tmpData = [];
      for (let i = 0; i < data.indicators.length; i++) {
        tmpData.push({
          油耗情况: data.indicators[i].xValue,
          升每百公里: data.indicators[i].y[0].yValue,
          temp: data.indicators[i].y // 自定义tooltip内容数据
        });
      }
      let chartData = {
        legendVisible: false,
        type: 'line',
        tooltip: true,
        data: {
          columns: ['油耗情况', '升每百公里', 'temp'],
          rows: tmpData
        },
        settings: {
          yAxisName: ['升/百公里']
        }
      };
      return chartData;
    },
    // 行驶里程
    getGraphRangData() {
      this.loading = true;
      let params = {
        plateNumber: this.filters[0].value || this.$route.query.plateNumber || '',
        indicator: 'singleUseRate',
        viewType: this.viewType,
        beginDate: this.beginDate,
        endDate: this.endDate
      };
      http
        .post('/admin/ecommerce/kpi/car/graph/singleDrivingAction.jhtml', params)
        .then(data => {
          this.chartDataOfRang = this.dataRangFormat(data);
        })
        .catch(errData => {
          this.loading = false;
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    dataRangFormat(data) {
      let tmpData = [];
      for (let i = 0; i < data.indicators.length; i++) {
        tmpData.push({
          行驶里程: data.indicators[i].xValue,
          公里: data.indicators[i].y[0].yValue,
          temp: data.indicators[i].y // 自定义tooltip内容数据
        });
      }
      let chartData = {
        legendVisible: false,
        tooltip: true,
        type: 'line',
        data: {
          columns: ['行驶里程', '公里', 'temp'],
          rows: tmpData
        },
        settings: {
          yAxisName: ['公里']
        }
      };
      return chartData;
    },
    // 驾驶习惯
    getGraphDrivingData() {
      this.loading = true;
      let params = {
        plateNumber: this.filters[0].value || this.$route.query.plateNumber || '',
        indicator: 'singleSafetyIndex',
        viewType: this.viewType,
        beginDate: this.beginDate,
        endDate: this.endDate
      };
      http
        .post('/admin/ecommerce/kpi/car/graph/singleDrivingAction.jhtml', params)
        .then(data => {
          this.chartDataOfDriving = this.dataDrivingFormat(data);
        })
        .catch(errData => {
          this.loading = false;
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    dataDrivingFormat(data) {
      let tmpData = [];
      for (let i = 0; i < data.indicators.length; i++) {
        tmpData.push({
          驾驶习惯: data.indicators[i].xValue,
          次: data.indicators[i].y[0].yValue ? data.indicators[i].y[0].yValue.split('次')[0] : '',
          temp: data.indicators[i].y // 自定义tooltip内容数据
        });
      }
      let chartData = {
        legendVisible: false,
        tooltip: true,
        type: 'line',
        data: {
          columns: ['驾驶习惯', '次', 'temp'],
          rows: tmpData
        },
        settings: {
          yAxisName: ['次/百公里']
        }
      };
      return chartData;
    },
    // 故障
    getGraphFaultData() {
      this.loading = true;
      let params = {
        plateNumber: this.filters[0].value || this.$route.query.plateNumber || '',
        indicator: 'singleFaultReason',
        viewType: this.viewType,
        beginDate: this.beginDate,
        endDate: this.endDate
      };
      http
        .post('/admin/ecommerce/kpi/car/graph/singleCarFaultReason.jhtml', params)
        .then(data => {
          this.chartDataOfFault = this.dataFaultFormat(data);
        })
        .catch(errData => {
          this.loading = false;
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    dataFaultFormat(data) {
      let tmpData = [];
      for (let i = 0; i < data.indicators.length; i++) {
        tmpData.push({
          车况: data.indicators[i].xValue,
          次: data.indicators[i].y[0].yValue,
          temp: data.indicators[i].y // 自定义tooltip内容数据
        });
      }
      let chartData = {
        legendVisible: false,
        type: 'histogram',
        tooltip: true,
        data: {
          columns: ['故障', '次', 'temp'],
          rows: tmpData
        },
        settings: {
          yAxisName: ['次']
        }
      };
      return chartData;
    },
    // 车况
    getGraphActionData() {
      this.loading = true;
      let params = {
        plateNumber: this.filters[0].value || this.$route.query.plateNumber || '',
        indicator: 'singleCarCondition',
        viewType: this.viewType,
        beginDate: this.beginDate,
        endDate: this.endDate
      };
      http
        .post('/admin/ecommerce/kpi/car/graph/singleCarConditionTrend.jhtml', params)
        .then(data => {
          this.chartDataOfAction = this.dataActionFormat(data);
        })
        .catch(errData => {
          this.loading = false;
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    dataActionFormat(data) {
      let tmpData = [];
      for (let i = 0; i < data.indicators.length; i++) {
        tmpData.push({
          车况: data.indicators[i].xValue,
          分: data.indicators[i].y[0].yValue,
          temp: data.indicators[i].y // 自定义tooltip内容数据
        });
      }
      let chartData = {
        legendVisible: false,
        type: 'line',
        tooltip: true,
        data: {
          columns: ['车况', '分', 'temp'],
          rows: tmpData
        },
        settings: {
          yAxisName: ['分']
        }
      };
      return chartData;
    },
    refreshHandle(val) {
      this.viewType = val.viewType;
      this.beginDate = val.date[0];
      this.endDate = val.date[1];
      this.dateType = val.dateType;
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
    this.getGraphFaultData();
    this.getGraphActionData();
    this.getGraphRangData();
    this.getGraphOilData();
    this.getGraphDrivingData();
  },
  mounted() {
    this.filters[0].value = this.$route.query.plateNumber || '';
  },
  components: {
    BizChart,
    ActionAnalysis,
    FaultAnalysis,
    OilAnalysis,
    RangAnalysis,
    DriveAnalysis,
    ShowSearchGrid,
    BizDialogSelector
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
  .member-info {
    margin: 10px 10px 0px 0px;
    width: 98%;
    box-shadow: 0 2px 3px rgba(0, 0, 0, 0.1);
    clear: both;
    font-size: 14px;
    .content {
      display: flex;
      color: #666666;
      span {
        padding: 10px 20px;
      }
    }
    .header {
      background-color: #f7f7f7;
      height: 40px;
      font-weight: 700;
      justify-content: flex-start;
      display: flex;
      span:first-child {
        padding: 10px;
        display: block;
        font-weight: bold;
        float: left;
      }
      .time-portrait {
        float: right;
      }
    }
  }
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
  .showHide {
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
    .graph1 {
      box-shadow: 0 2px 3px rgba(0, 0, 0, 0.1);
      margin-bottom: 20px;
      margin-right: 5px;
      width: 33%;
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
