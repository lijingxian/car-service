<template>
  <div class="general-view-analysis-car">
    <div slot="top">
      <show-search-grid @refreshHandle="refreshHandle" :showViewType="false" :filters="filters"
        @filterDataChange="filterDataChange">
        <div slot="description" class="description-pover">
          <p>互动分析：统计社区内帖子各行为的变化趋势</p>
          <p>热度分析：统计社区内各行为的帖子热度排行</p>
          <!-- <p>偏好分析：统计社区内各行为的偏好分布</p>
          <p>关键词分析：统计社区内各行为的关键词排行</p> -->
        </div>
      </show-search-grid>
    </div>
    <div class="indicators-search" :class="{'showHide1' : showHideFleet}">
      <div class="title">车友会</div>
      <div class="hardGroupFleet" :class="{'showHideFleet' : showHideFleet}" ref="fleetGroup">
        <el-checkbox-button v-model="checkAllFleet" @change="handleCheckAllFleet" :indeterminate="isIndeterminateFleet">全部
        </el-checkbox-button>
        <el-tooltip placement="bottom" v-for="(condition,index)  in fleetList" :key="index" :disabled="condition.name.length<=10">
          <el-checkbox-group v-model="checkedFleet" @change="fleetChange">
            <el-checkbox-button :label="condition.id" size="mini">
              {{condition.name.length>10?condition.name.substr(0, 10)+'...':condition.name}}</el-checkbox-button>
          </el-checkbox-group>
          <div slot="content">{{ condition.name }}</div>
        </el-tooltip>
      </div>
    </div>
    <div class="swich" v-if="showSwichFleet">
      <i :class="className" @click="swichFleet"></i>
    </div>
    <div class="indicators-search">
      <div class="title">类型</div>
      <div class="hardGroup" ref="brandGroup">
        <el-radio-group v-model="checkedBrand" @change="brandChange" size="mini">
          <el-radio-button v-for="(condition,index)  in brandList" :label="condition.id" :key="index">
            {{condition.name}}</el-radio-button>
        </el-radio-group>
      </div>
    </div>
    <div class="total">
      <div class="column1">
        <div class="table-cell">
          累计帖子数
          <div class="color-primary"><span class="font">{{summary.contentNumCnt}}</span>条</div>
        </div>
      </div>
      <div class="column2">
        <div class="table-cell">
          当期新增帖子数
          <div class="color-primary"><span class="font">{{summary.contentNumInc}}</span>条</div>
          <div class="color-primary">
            环比
            <span :style="summary.contentNumIncMon>0?'color:red':'color:green'"><i
                :class="summary.contentNumIncMon>0?'iconfont biz-icon-i-sh-man-pullup':'iconfont biz-icon-i-sh-man-pulldown'"></i>{{summary.contentNumIncMon}}%</span>
            同比
            <span :style="summary.contentNumIncYoy>0?'color:red':'color:green'"><i
                :class="summary.contentNumIncYoy>0?'iconfont biz-icon-i-sh-man-pullup':'iconfont biz-icon-i-sh-man-pulldown'"></i>{{summary.contentNumIncYoy}}%</span>
          </div>
        </div>
      </div>
      <div class="column3">
        <div class="table-cell">
          当期阅读数
          <div class="color-primary"><span class="font">{{summary.viewNumIns}}</span>次</div>
          <div class="color-primary">
            环比
            <span :style="summary.viewNumInsMon>0?'color:red':'color:green'"><i
                :class="summary.viewNumInsMon>0?'iconfont biz-icon-i-sh-man-pullup':'iconfont biz-icon-i-sh-man-pulldown'"></i>{{summary.viewNumInsMon}}%</span>
            同比
            <span :style="summary.viewNumInsYoy>0?'color:red':'color:green'"><i
                :class="summary.viewNumInsYoy>0?'iconfont biz-icon-i-sh-man-pullup':'iconfont biz-icon-i-sh-man-pulldown'"></i>{{summary.viewNumInsYoy}}%</span>
          </div>
        </div>
      </div>
    </div>
    <div class="chart-area">
      <div class="graph">
        <div class="header">
          <span>互动分析</span>
          <span class="font">阅读量</span>
          <i class="iconfont biz-icon-i-web-fd" @click="dynamicAnalysis"></i>
        </div>
        <biz-chart :chartData="chartDataOfDynamic" :loading="loading" :showSearch="false"></biz-chart>
      </div>
      <div class="graph">
        <div class="header">
          <span>热度分析</span>
          <span class="font">评论排行</span>
          <i class="iconfont biz-icon-i-web-fd" @click="hotAnalysis"></i>
        </div>
        <biz-chart :chartData="chartDataOfHot" :loading="loading" :showSearch="false"></biz-chart>
      </div>
    </div>
    <el-dialog :visible.sync="dialogVisible" :title="title" width="1200px" append-to-body>
      <DynamicAnalysis ref="dynamicAnalysis" v-if="showDynamic" :params="params"></DynamicAnalysis>
      <HotAnalysis ref="hotAnalysis" v-if="showHot" :params="params"></HotAnalysis>
      <!-- <PreferenceAnalysis ref="preferenceAnalysis" v-if="showPreference" :params="params"></PreferenceAnalysis>
      <KeywordAnalysis ref="keywordAnalysis" v-if="showKeyword" :params="params"></KeywordAnalysis> -->
    </el-dialog>
  </div>
</template>

<script>
// import BizFilter from '@/components/BizTable/BizFilter';
import BizChart from '@/components/BizChart';
import dateTime from '@/utils/dateTime';
import http from '@/common/http';
import DynamicAnalysis from './DynamicAnalysis';
import HotAnalysis from './HotAnalysis';
// import PreferenceAnalysis from './PreferenceAnalysis';
// import KeywordAnalysis from './KeywordAnalysis';
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
      hardGroupFleetHeight: 0,
      className: 'el-icon-caret-bottom',
      className1: 'el-icon-caret-bottom',
      showSwich: false,
      showHide: false,
      showSwichFleet: false,
      showHideFleet: false,
      showRecommend: false,
      dialogVisible: false,
      showDynamic: false,
      showHot: false,
      showPreference: false,
      showKeyword: false,
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
      checkAllFleet: true,
      isIndeterminateFleet: true,
      checkedBrand: 'FLEET',
      brandList: [{ id: 'FLEET', name: '动态' }, { id: 'TOPIC', name: '问答' }, { id: 'ARTICLE', name: '文章' }],
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
      chartDataOfHot: {},
      chartDataOfDynamic: {},
      chartDataOfKeyword: {},
      chartDataOfPreference: {},
      isShow: 'false'
    };
  },
  methods: {
    ...mapGetters(['getUser']),
    operatorChange() {},
    handleCheckAllOperator() {},
    fleetChange(val) {
      let checkedCount = val.length;
      this.checkAllFleet = checkedCount === this.fleetList.length;
      this.isIndeterminateFleet = checkedCount > 0 && checkedCount < this.fleetList.length;
      this.query();
    },
    handleCheckAllFleet(val) {
      this.checkedFleet = val
        ? this.fleetList.map(item => {
          return item.id;
        })
        : [];
      this.query();
    },
    brandChange(val) {
      let checkedCount = val.length;
      this.checkAllBrand = checkedCount === this.brandList.length;
      this.isIndeterminateBrand = checkedCount > 0 && checkedCount < this.brandList.length;
      this.query();
    },
    filterDataChange(val) {
      this.filters = val;
    },
    query() {
      this.params = {
        viewType: this.viewType,
        beginDate: this.beginDate,
        endDate: this.endDate,
        dateType: this.dateType,
        checkedShop: this.checkedShop,
        checkedFleet: this.checkedFleet,
        repostType: this.checkedBrand
      };
      this.init();
      // this.getGraphPreferenceData();
      // this.getGraphKeywordData();
      this.getGraphHotData();
      this.getGraphDynamicData();
    },
    getfleetList() {
      this.loading = true;
      let param = {
        pageNumber: 1,
        pageSize: 1000,
        fleetType: 'circle'
      };
      http
        .get('/admin/fleet/json/list.jhtml', param)
        .then(data => {
          this.loading = false;
          this.fleetList = data.content;
          this.checkedFleet = this.fleetList
            ? this.fleetList.map(item => {
              return item.id;
            })
            : [];
          this.$nextTick(() => {
            this.hardGroupFleetHeight = document.getElementsByClassName('hardGroupFleet')[0].offsetHeight;
            console.log(this.hardGroupFleetHeight);
            if (this.hardGroupFleetHeight > 54) {
              this.showSwichFleet = true;
              this.showHideFleet = true;
            } else {
              this.showSwichFleet = false;
              this.showHideFleet = false;
            }
          });
          this.query();
        })
        .catch(error => {
          this.loading = false;
          if (error.errorMessage) {
            this.$message.warning(error.errorMessage);
          }
        });
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
    dynamicAnalysis() {
      this.title = '互动分析';
      this.showHot = false;
      this.showKeyword = false;
      this.showPreference = false;
      this.showDynamic = true;
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs.dynamicAnalysis.load();
      });
    },
    hotAnalysis() {
      this.title = '热度排行';
      this.showDynamic = false;
      this.showKeyword = false;
      this.showPreference = false;
      this.showHot = true;
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs.hotAnalysis.load();
      });
    },
    keywordAnalysis() {
      this.title = '新增变化趋势';
      this.showDynamic = false;
      this.showHot = false;
      this.showPreference = false;
      this.showKeyword = true;
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs.keywordAnalysis.load();
      });
    },
    preferenceAnalysis() {
      this.title = '累计变化趋势';
      this.showDynamic = false;
      this.showHot = false;
      this.showKeyword = false;
      this.showPreference = true;
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs.preferenceAnalysis.load();
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
        repostType: this.checkedBrand,
        indicators: ['contentCnt', 'contentIns', 'viewNum']
      };
      http
        .post('/admin/ecommerce/kpi/friend/summary/fleet.jhtml', params)
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
    // 偏好分析
    getGraphPreferenceData() {
      this.loading = true;
      let params = {
        indicators: ['carCnt'],
        viewType: this.viewType,
        beginDate: this.beginDate,
        endDate: this.endDate,
        shopIds: this.checkedShop,
        fleets: this.checkedFleet,
        repostType: this.checkedBrand
      };
      http
        .post('/admin/ecommerce/kpi/friend/graph/fleet.jhtml', params)
        .then(data => {
          this.chartDataOfPreference = this.dataPreferenceFormat(data);
        })
        .catch(errData => {
          this.loading = false;
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    dataPreferenceFormat(data) {
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
    // 关键词分析
    getGraphKeywordData() {
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
          this.chartDataOfKeyword = this.dataKeywordFormat(data);
        })
        .catch(errData => {
          this.loading = false;
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    dataKeywordFormat(data) {
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
    // 热度分析
    getGraphHotData() {
      this.loading = true;
      let params = {
        indicators: ['commentTop'],
        viewType: this.viewType,
        beginDate: this.beginDate,
        endDate: this.endDate,
        shopIds: this.checkedShop,
        fleets: this.checkedFleet,
        repostType: this.checkedBrand
      };
      http
        .post('/admin/ecommerce/kpi/friend/graph/fleet.jhtml', params)
        .then(data => {
          this.chartDataOfHot = this.dataHotFormat(data);
        })
        .catch(errData => {
          this.loading = false;
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    dataHotFormat(data) {
      let tmpData = [];
      for (let i = 0; i < data.indicators.length; i++) {
        tmpData.push({
          日期: data.indicators[i].xValue,
          数量: data.indicators[i].yValue
          // 同比: data.indicators[i].yoyRate,
          // 环比: data.indicators[i].momRate
        });
      }
      let chartData = {
        type: 'histogram',
        data: {
          columns: ['日期', '数量'],
          rows: tmpData
        },
        settings: {}
      };
      return chartData;
    },
    // 互动分析
    getGraphDynamicData() {
      this.loading = true;
      let params = {
        indicators: ['viewNum'],
        viewType: this.viewType,
        beginDate: this.beginDate,
        endDate: this.endDate,
        shopIds: this.checkedShop,
        fleets: this.checkedFleet,
        repostType: this.checkedBrand
      };
      http
        .post('/admin/ecommerce/kpi/friend/graph/fleet.jhtml', params)
        .then(data => {
          this.chartDataOfDynamic = this.dataDynamicFormat(data);
        })
        .catch(errData => {
          this.loading = false;
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    dataDynamicFormat(data) {
      let tmpData = [];
      for (let i = 0; i < data.indicators.length; i++) {
        tmpData.push({
          日期: data.indicators[i].xValue,
          数量: data.indicators[i].yValue
          // 同比: data.indicators[i].yoyRate,
          // 环比: data.indicators[i].momRate
        });
      }
      let chartData = {
        type: 'histogram',
        data: {
          columns: ['日期', '数量'],
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
      this.getGraphHotData();
      this.getGraphDynamicData();
      // this.getGraphKeywordData();
      // this.getGraphPreferenceData();
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
  computed: {},
  watch: {},
  created() {
    this.getfleetList();
  },
  components: {
    DynamicAnalysis,
    HotAnalysis,
    BizChart,
    // KeywordAnalysis,
    // PreferenceAnalysis,
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
    .el-radio-button {
      padding: 15px 0px;
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
