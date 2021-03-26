<template>
  <div class="general-view-analysis-fans">
    <div slot="top">
      <show-search-grid @refreshHandle="refreshHandle" :showViewType="false">
        <div slot="description" class="description-pover">
          <p>粉丝数量分析：分析粉丝数量趋势</p>
          <p>特性分析：分析粉丝属性特性</p>
        </div>
      </show-search-grid>
    </div>
    <div class="indicators-search">
      <div class="title">店铺</div>
      <div class="hardShopGroup1" :class="{'showHideShop1' : showHideShop1}" ref="shopGroup">
        <el-checkbox-button v-model="checkAllShop" @change="handleCheckAllShop" :indeterminate="isIndeterminateShop">全部
        </el-checkbox-button>
        <el-tooltip placement="bottom" v-for="(item, index) in shopList" :key="index" :disabled="item.name.length<=10">
          <el-checkbox-group v-model="checkedShop" @change="shopChange">
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
          净增粉丝数
          <div class="color-primary"><span class="font">{{summary.fansNumInc}}</span>人</div>
          <div class="color-primary">
            环比
            <span :style="summary.fansNumIncMon>0?'color:red':'color:green'"><i :class="summary.fansNumIncMon>0?'iconfont biz-icon-i-sh-man-pullup':'iconfont biz-icon-i-sh-man-pulldown'"></i>{{summary.fansNumIncMon}}%</span>
            同比
            <span :style="summary.fansNumIncYoy>0?'color:red':'color:green'"><i :class="summary.fansNumIncYoy>0?'iconfont biz-icon-i-sh-man-pullup':'iconfont biz-icon-i-sh-man-pulldown'"></i>{{summary.fansNumIncYoy}}%</span>
          </div>
        </div>
      </div>
      <div class="column2">
        <div class="table-cell">
          累计粉丝数
          <div class="color-primary"><span class="font">{{summary.fansNumCnt}}</span>人</div>
          <div class="color-primary">
            环比
            <span :style="summary.fansNumCntMon>0?'color:red':'color:green'"><i :class="summary.fansNumCntMon>0?'iconfont biz-icon-i-sh-man-pullup':'iconfont biz-icon-i-sh-man-pulldown'"></i>{{summary.fansNumCntMon}}%</span>
            同比
            <span :style="summary.fansNumCntYoy>0?'color:red':'color:green'"><i :class="summary.fansNumCntYoy>0?'iconfont biz-icon-i-sh-man-pullup':'iconfont biz-icon-i-sh-man-pulldown'"></i>{{summary.fansNumCntYoy}}%</span>
          </div>
        </div>
      </div>
    </div>
    <div class="chart-area">
      <div class="graph">
        <div class="header">
          <span>粉丝数量分析</span>
          <span class="font">新增粉丝数</span>
          <i class="iconfont biz-icon-i-web-fd" @click="fansNumberAnalysis"></i>
        </div>
        <biz-chart :chartData="chartDataOfFansNumber" :loading="loading" :showSearch="false"></biz-chart>
      </div>
      <div class="graph">
        <div class="header">
          <span>特性分析</span>
          <span class="font">性别</span>
          <i class="iconfont biz-icon-i-web-fd" @click="genderAnalysis"></i>
        </div>
        <biz-chart :chartData="chartDataOfGender" :loading="loading" :showSearch="false"></biz-chart>
      </div>
    </div>
    <div class="chart-area">
      <div class="graph">
        <div class="header">
          <span>地域分布</span>
          <span class="font"></span>
          <i class="iconfont biz-icon-i-web-fd" @click="geographicalAnalysis"></i>
        </div>
        <biz-chart :chartData="chartDataOfGeographical" :loading="loading" :showSearch="false"></biz-chart>
      </div>
      <div class="graph">
        <div class="header">
          <span>偏好排行</span>
          <span class="font">搜索偏好</span>
          <i class="iconfont biz-icon-i-web-fd" @click="preferenceAnalysis"></i>
        </div>
        <biz-chart :chartData="chartDataOfPreference" :loading="loading" :showSearch="false"></biz-chart>
      </div>
    </div>
    <el-dialog :visible.sync="dialogVisible" :title="title" width="1200px" append-to-body>
      <FansNumberAnalysis ref="fansNumberAnalysis" v-if="showFans" :params="params"></FansNumberAnalysis>
      <GenderAnalysis ref="genderAnalysis" v-if="showGender" :params="params"></GenderAnalysis>
      <GeographicalAnalysis ref="geographicalAnalysis" v-if="showGeographical" :params="params"></GeographicalAnalysis>
      <PreferenceAnalysis ref="preferenceAnalysis" v-if="showPreference" :params="params"></PreferenceAnalysis>
    </el-dialog>
  </div>
</template>

<script>
import BizChart from '@/components/BizChart';
import dateTime from '@/utils/dateTime';
import http from '@/common/http';
import FansNumberAnalysis from './FansNumberAnalysis';
import GenderAnalysis from './GenderAnalysis';
import GeographicalAnalysis from './GeographicalAnalysis';
import PreferenceAnalysis from './PreferenceAnalysis';
import { mapGetters } from 'vuex';
import ShowSearchGrid from '../components/ShowSearchGrid';
import vPinyin from '@/utils/vue-py';

export default {
  name: 'FansStatisticsAnalysis',
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
      dialogVisible: false,
      showFans: false,
      showGender: false,
      showGeographical: false,
      showPreference: false,
      showHideShop1: false,
      title: '粉丝数量分析',
      summary: {
        sessionCnt: {},
        robotAccessCnt: {},
        intelAccessCnt: {}
      },
      filters: [],
      kpiName: ['本期', '同比', '环比'],
      chartData: {},
      chartDataOfFansNumber: {},
      chartDataOfGender: {},
      chartDataOfGeographical: {},
      chartDataOfPreference: {},
      checkedShop: [],
      shopList: [],
      checkAllShop: false,
      isIndeterminateShop: true,
      isShow: 'false'
    };
  },
  methods: {
    ...mapGetters(['getUser']),
    shopChange(val) {
      let checkedCount = val.length;
      this.checkAllShop = checkedCount === this.shopList.length;
      this.isIndeterminateShop = checkedCount > 0 && checkedCount < this.shopList.length;
      this.query();
    },
    handleCheckAllShop(val) {
      this.checkedShop = val ? this.shopList.map(item => { return item.id; }) : [];
      this.query();
    },
    getShopList() {
      let param = {
        sourceType: '5'
      };
      http
        .get('/admin/member/json/findEShops.jhtml', param)
        .then(data => {
          this.shopList = data.shops;
          this.checkedShop = [this.getUser().shop.id];
          // this.$nextTick(() => {
          //   this.hardGroupShopHeight1 = document.getElementsByClassName('hardShopGroup1')[0].offsetHeight;
          //   console.log(this.hardGroupShopHeight1);
          //   if (this.hardGroupShopHeight1 > 55) {
          //     this.showShopSwich1 = true;
          //     this.showHideShop1 = true;
          //   } else {
          //     this.showShopSwich1 = false;
          //     this.showHideShop1 = false;
          //   }
          // });
          this.query();
        })
        .catch(error => {
          if (error.errorMessage) {
            this.$message.warning(error.errorMessage);
          }
        });
    },
    query() {
      this.params = Object.assign(this.params, { checkedShop: this.checkedShop });
      this.getGraphFansData();
      this.getGraphGenderData();
      this.getGraphGeographicalData();
      this.getGraphPreferenceData();
    },
    fansNumberAnalysis() {
      this.title = '粉丝数量分析';
      this.showFans = true;
      this.showGender = false;
      this.showGeographical = false;
      this.showPreference = false;
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs.fansNumberAnalysis.load();
      });
    },
    genderAnalysis() {
      this.title = '特性分析';
      this.showFans = false;
      this.showGender = true;
      this.showGeographical = false;
      this.showPreference = false;
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs.genderAnalysis.load();
      });
    },
    geographicalAnalysis() {
      this.title = '地域分布';
      this.showFans = false;
      this.showGender = false;
      this.showGeographical = true;
      this.showPreference = false;
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs.geographicalAnalysis.load();
      });
    },
    preferenceAnalysis() {
      this.title = '偏好排行';
      this.showFans = false;
      this.showGender = false;
      this.showGeographical = false;
      this.showPreference = true;
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs.preferenceAnalysis.load();
      });
    },
    init() {
      this.loading = true;
      let params = {
        indicators: ['fansNumInt', 'fansNumCnt'],
        beginDate: this.beginDate,
        endDate: this.endDate,
        viewType: this.viewType
      };
      http
        .post('/admin/ecommerce/kpi/marketing/summary/marketing.jhtml', params)
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
    // 粉丝数量分析
    getGraphFansData() {
      this.loading = true;
      let params = {
        indicators: ['fansNumInt'],
        viewType: this.viewType,
        beginDate: this.beginDate,
        endDate: this.endDate
      };
      http
        .post('/admin/ecommerce/kpi/marketing/graph/marketing.jhtml', params)
        .then(data => {
          this.chartDataOfFansNumber = this.dataFansFormat(data);
        })
        .catch(errData => {
          this.loading = false;
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    dataFansFormat(data) {
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
    // 特性分析
    getGraphGenderData() {
      this.loading = true;
      let params = {
        indicators: ['fansGender'],
        viewType: this.viewType,
        beginDate: this.beginDate,
        endDate: this.endDate
      };
      http
        .post('/admin/ecommerce/kpi/marketing/graph/marketing.jhtml', params)
        .then(data => {
          this.chartDataOfGender = this.dataGenderFormat(data);
        })
        .catch(errData => {
          this.loading = false;
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    dataGenderFormat(data) {
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
          radius: [60, 150],
          offsetY: '50%'
        }
      };
      return chartData;
    },
    // 地域分布
    getGraphGeographicalData() {
      this.loading = true;
      let params = {
        indicators: ['areaDistribution'],
        viewType: this.viewType,
        beginDate: this.beginDate,
        endDate: this.endDate
      };
      http
        .post('/admin/ecommerce/kpi/marketing/graph/marketing.jhtml', params)
        .then(data => {
          this.chartDataOfGeographical = this.dataGeographicalFormat(data.indicators);
        })
        .catch(errData => {
          this.loading = false;
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    dataGeographicalFormat(data) {
      let tmpData = [];
      let tmpDataByPro = [];
      let maxValue = 0;
      if (data.length === 1) {
        for (const item of data) {
          for (let i = 0; i < item.children.length; i++) {
            tmpDataByPro.push({
              位置: item.children[i].name,
              人: Number(item.children[i].netCount)
            });
            maxValue = Math.max(maxValue, Number(item.children[i].count));
          }
        }
      } else {
        for (let i = 0; i < data.length; i++) {
          tmpData.push({
            位置: data[i].name,
            人: Number(data[i].count)
          });
          maxValue = Math.max(maxValue, Number(data[i].count));
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
        legendVisible: false,
        data: {
          columns: ['位置', '人'],
          rows: curData
        },
        maxRangeValue: maxValue || 100,
        settings: {
          position: data.length === 1 ? 'province/' + oneProvince : 'china',
          selectedMode: 'single',
          dimension: '位置',
          itemStyle: {
            normal: {
              areaColor: '#fff'
            }
          }
        }
      };
      return chartData;
    },
    // 热度排行
    getGraphPreferenceData() {
      this.loading = true;
      let params = {
        indicators: ['columnPrefer'],
        viewType: this.viewType,
        beginDate: this.beginDate,
        endDate: this.endDate
      };
      http
        .post('/admin/ecommerce/kpi/marketing/graph/marketing.jhtml', params)
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
          type: data.indicators[i].xValue,
          人: data.indicators[i].yValue
        });
      }
      let chartData = {
        type: 'histogram',
        legendVisible: false,
        data: {
          columns: ['type', '人'],
          rows: tmpData
        },
        settings: {
          yAxisName: ['人']
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
      this.getGraphFansData();
      this.getGraphGenderData();
      // this.getGraphGeographicalData();
      // this.getGraphPreferenceData();
      this.init();
    }
  },
  computed: {
  },
  created() {
    this.init();
    this.getShopList();
    this.query();
  },
  components: {
    BizChart,
    FansNumberAnalysis,
    GenderAnalysis,
    GeographicalAnalysis,
    PreferenceAnalysis,
    ShowSearchGrid
  }
};
</script>

<style lang="scss">
.general-view-analysis-fans {
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
    .showHideShop1 {
      height: 55px;
      overflow-y: hidden;
    }
    .hardShopGroup1 {
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
