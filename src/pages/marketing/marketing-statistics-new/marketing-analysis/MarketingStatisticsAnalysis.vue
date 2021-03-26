<template>
  <div class="general-view-analysis-marketing">
    <div slot="top">
      <show-search-grid @refreshHandle="refreshHandle" :showViewType="false">
        <div slot="description" class="description-pover">
          <p>转化分析：统计营销的转化情况</p>
          <p>营销数量：统计营销活动和文章的数量情况</p>
          <p>效果分析：统计营销活动/内容的参与和阅读效果</p>
          <p>热度排行：统计营销内容的热门情况</p>
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
    <!-- <div class="indicators-search">
      <div class="title">类别</div>
      <el-radio-group v-model="checkedCategory" @change="categoryChange" size="mini">
        <el-radio-button v-for="(condition,index) in categoryList" :label="condition.id" :key="index" size="mini">
          {{condition.name}}</el-radio-button>
      </el-radio-group>
    </div> -->
    <div class="total">
      <div class="column2">
        <div class="table-cell">
          参与人数
          <div class="color-primary"><span class="font">{{summary.activityCrowNumInc}}</span>人</div>
          <div class="color-primary">
            环比
            <span :style="summary.activityCrowNumIncMon>0?'color:red':'color:green'"><i
                :class="summary.activityCrowNumIncMon>0?'iconfont biz-icon-i-sh-man-pullup':'iconfont biz-icon-i-sh-man-pulldown'"></i>{{summary.activityCrowNumIncMon}}%</span>
            同比
            <span :style="summary.activityCrowNumIncYoy>0?'color:red':'color:green'"><i
                :class="summary.activityCrowNumIncYoy>0?'iconfont biz-icon-i-sh-man-pullup':'iconfont biz-icon-i-sh-man-pulldown'"></i>{{summary.activityCrowNumIncYoy}}%</span>
          </div>
        </div>
      </div>
      <div class="column1">
        <div class="table-cell">
          阅读量
          <div class="color-primary"><span class="font">{{summary.marketingViewNumInc}}</span>次</div>
          <div class="color-primary">
            环比
            <span :style="summary.marketingViewNumIncMon>0?'color:red':'color:green'"><i
                :class="summary.marketingViewNumIncMon>0?'iconfont biz-icon-i-sh-man-pullup':'iconfont biz-icon-i-sh-man-pulldown'"></i>{{summary.marketingViewNumIncMon}}%</span>
            同比
            <span :style="summary.marketingViewNumIncYoy>0?'color:red':'color:green'"><i
                :class="summary.marketingViewNumIncYoy>0?'iconfont biz-icon-i-sh-man-pullup':'iconfont biz-icon-i-sh-man-pulldown'"></i>{{summary.marketingViewNumIncYoy}}%</span>
          </div>
        </div>
      </div>
    </div>
    <div class="chart-area">
      <div class="graph" style="position:relative">
        <div class="header">
          <span>转化分析</span>
          <span class="font">营销转化</span>
          <i class="iconfont biz-icon-i-web-fd" @click="activityEffectAnalysis"></i>
        </div>
        <!-- <div style="font-size:12px;position:absolute;top:80px;left:40%">访问-参与转化率：{{rate}}</div> -->
        <biz-chart :chartData="chartDataOfActivityEffect" :loading="loading" :showSearch="false" v-if="!showDefault"></biz-chart>
        <img :src="yx" v-if="showDefault" style="width:100%">
      </div>
      <div class="graph">
        <div class="header">
          <span>效果分析</span>
          <span class="font">阅读量</span>
          <i class="iconfont biz-icon-i-web-fd" @click="flowAnalysis"></i>
        </div>
        <biz-chart :chartData="chartDataOfFlow" :loading="loading" :showSearch="false"></biz-chart>
      </div>
    </div>
    <div class="chart-area">
      <div class="graph">
        <div class="header">
          <span>数量分析</span>
          <span class="font">活动数</span>
          <i class="iconfont biz-icon-i-web-fd" @click="marketingGeneralViewAnalysis"></i>
        </div>
        <biz-chart :chartData="chartDataOfGeneralView" :loading="loading" :showSearch="false"></biz-chart>
      </div>
      <div class="graph">
        <div class="header">
          <span>热度排行</span>
          <span class="font">热门活动</span>
          <i class="iconfont biz-icon-i-web-fd" @click="heatRankingAnalysis"></i>
        </div>
        <biz-chart :chartData="chartDataOfHeatRanking" :loading="loading" :showSearch="false"></biz-chart>
      </div>
    </div>
    <el-dialog :visible.sync="dialogVisible" :title="title" width="1000px" append-to-body>
      <MarketingGeneralViewAnalysis ref="marketingGeneralViewAnalysis" v-if="showGeneralView" :params="params">
      </MarketingGeneralViewAnalysis>
      <ActivityEffectAnalysis ref="activityEffectAnalysis" v-if="showActivity" :params="params"></ActivityEffectAnalysis>
      <FlowAnalysis ref="flowAnalysis" v-if="showFlow" :params="params"></FlowAnalysis>
      <HeatRankingAnalysis ref="heatRankingAnalysis" v-if="showHeatRanking" :params="params"></HeatRankingAnalysis>
    </el-dialog>
  </div>
</template>

<script>
import BizChart from '@/components/BizChart';
import dateTime from '@/utils/dateTime';
import http from '@/common/http';
import MarketingGeneralViewAnalysis from './MarketingGeneralViewAnalysis';
import ActivityEffectAnalysis from './ActivityEffectAnalysis';
import FlowAnalysis from './FlowAnalysis';
import HeatRankingAnalysis from './HeatRankingAnalysis';
import { mapGetters } from 'vuex';
import ShowSearchGrid from '../components/ShowSearchGrid';
import yx from '@/assets/images/yx.png';
import CategoryTreeVue from '../../../shop/commodity/category-mgmt/CategoryTree.vue';
export default {
  name: 'MarketingStatisticsAnalysis',
  data() {
    return {
      params: {},
      loading: true,
      height: '500',
      beginDate: dateTime.getPreThreeMonthDay(),
      endDate: dateTime.today(),
      chartData1: {},
      viewType: 'month',
      dateType: 'month',
      pagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        total: 0
      },
      tableData: [],
      yx: yx,
      dialogVisible: false,
      showGeneralView: false,
      showActivity: false,
      showFlow: false,
      showDefault: false,
      showHeatRanking: false,
      rate: '',
      title: '营销数量',
      checkedCategory: 'marketing',
      categoryList: [
        { name: '营销', id: 'marketing' },
        { name: '促销', id: 'promotion' },
        { name: '线下活动', id: 'localMarketing' }
      ],
      summary: {
        sessionCnt: {},
        robotAccessCnt: {},
        intelAccessCnt: {}
      },
      filters: [],
      kpiName: ['本期', '同比', '环比'],
      chartData: {},
      chartDataOfGeneralView: {},
      chartDataOfActivityEffect: {},
      chartDataOfFlow: {},
      chartDataOfHeatRanking: {},
      checkedShop: [],
      shopList: [],
      checkAllShop: false,
      isIndeterminateShop: true,
      showHideShop1: false,
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
      this.checkedShop = val
        ? this.shopList.map(item => {
          return item.id;
        })
        : [];
      this.query();
    },
    categoryChange(val) {
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
      this.params = {
        viewType: this.viewType,
        beginDate: this.beginDate,
        endDate: this.endDate,
        dateType: this.dateType,
        checkedShop: this.checkedShop
      };
      this.getGraphGeneralViewData();
      this.getGraphActivityEffectData();
      this.getGraphFlowData();
      this.getGraphHeatRankingData();
      this.init();
    },
    marketingGeneralViewAnalysis() {
      this.title = '数量分析';
      this.showGeneralView = true;
      this.showActivity = false;
      this.showFlow = false;
      this.showHeatRanking = false;
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs.marketingGeneralViewAnalysis.load();
      });
    },
    activityEffectAnalysis() {
      this.title = '转化分析';
      this.showGeneralView = false;
      this.showActivity = true;
      this.showFlow = false;
      this.showHeatRanking = false;
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs.activityEffectAnalysis.load();
      });
    },
    flowAnalysis() {
      this.title = '效果分析';
      this.showGeneralView = false;
      this.showActivity = false;
      this.showFlow = true;
      this.showHeatRanking = false;
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs.flowAnalysis.load();
      });
    },
    heatRankingAnalysis() {
      this.title = '热度排行';
      this.showGeneralView = false;
      this.showActivity = false;
      this.showFlow = false;
      this.showHeatRanking = true;
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs.heatRankingAnalysis.load();
      });
    },
    init() {
      this.loading = true;
      let params = {
        beginDate: this.beginDate,
        endDate: this.endDate,
        viewType: this.viewType,
        marketingCateGory: this.checkedCategory,
        indicators: ['marketingViewNum', 'activityCrowNum'],
        shopIds: this.checkedShop
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
    // 营销概览
    getGraphGeneralViewData() {
      this.loading = true;
      let params = {
        marketingCateGory: this.checkedCategory,
        indicators: ['activityNum'],
        viewType: this.viewType,
        beginDate: this.beginDate,
        endDate: this.endDate,
        shopIds: this.checkedShop
      };
      http
        .post('/admin/ecommerce/kpi/marketing/graph/marketing.jhtml', params)
        .then(data => {
          this.chartDataOfGeneralView = this.dataFormat(data);
        })
        .catch(errData => {
          this.loading = false;
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    // 转化分析
    getGraphActivityEffectData() {
      this.loading = true;
      let params = '';
      let params1 = '';
      params = {
        table: [
          'dw_operation_log'
        ],
        showColumn: [
          {
            formula: 'count(1)',
            as: 'num'
          }
        ],
        filter: {
          and: [
            {
              name: 'operate_date',
              value: this.beginDate,
              compare: '>='
            },
            {
              name: 'operate_date',
              value: this.endDate,
              compare: '<='
            },
            {
              name: 'operate_type',
              value: 'view',
              compare: '='
            },
            {
              name: 'shop_id',
              value: this.checkedShop,
              compare: 'in'
            },
            {
              or: [
                {
                  name: 'biz_code',
                  value: 'marketing',
                  compare: '='
                },
                {
                  name: 'biz_code',
                  value: 'marketingfollow',
                  compare: '='
                }
              ]
            }
          ]
        }
      };
      // 參與人數
      params1 = {
        table: [
          'dw_marketing_attend'
        ],
        showColumn: [
          {
            formula: 'count(1)',
            as: 'num'
          }
        ],
        filter: {
          and: [
            {
              name: 'attend_date',
              value: this.beginDate,
              compare: '>='
            },
            {
              name: 'attend_date',
              value: this.endDate,
              compare: '<='
            },
            {
              name: 'shop_id',
              value: this.checkedShop,
              compare: 'in'
            }
          ]
        }
      };
      http
        .post('admin/statistics/common/statisticsDatas.jhtml', params)
        .then(data => {
          this.chartData1 = data;
        })
        .catch(errData => {
          this.loading = false;
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
        });
      http
        .post('admin/statistics/common/statisticsDatas.jhtml', params1)
        .then(data => {
          this.chartDataOfActivityEffect = this.dataFormatLd(this.chartData1, data);
          // this.rate = data.indicators.statisticsRowDatas[0].statisticsColumnDatas[0].columnValue/this.chartData1.indicators.statisticsRowDatas[0].statisticsColumnDatas[0].columnValue
        })
        .catch(errData => {
          this.loading = false;
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    dataFormatLd(data, data1) {
      this.showDefault = false;
      if (data.indicators.statisticsRowDatas[0].statisticsColumnDatas[0].columnValue === '0' && data1.indicators.statisticsRowDatas[0].statisticsColumnDatas[0].columnValue === '0') {
        this.showDefault = CategoryTreeVue;
      }
      let tmpData = [
        {
          状态: '访问人数',
          数值: data.indicators.statisticsRowDatas[0].statisticsColumnDatas[0].columnValue
        },
        { 状态: '参与人数', 数值: data1.indicators.statisticsRowDatas[0].statisticsColumnDatas[0].columnValue }
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
    // 效果分析
    getGraphFlowData() {
      this.loading = true;
      let params = {
        marketingCateGory: this.checkedCategory,
        indicators: ['marketingViewNum'],
        viewType: this.viewType,
        beginDate: this.beginDate,
        endDate: this.endDate,
        shopIds: this.checkedShop
      };
      http
        .post('/admin/ecommerce/kpi/marketing/graph/marketing.jhtml', params)
        .then(data => {
          this.chartDataOfFlow = this.dataFormat(data);
        })
        .catch(errData => {
          this.loading = false;
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    dataFormat(data) {
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
    // 热度排行
    getGraphHeatRankingData() {
      this.loading = true;
      let params = {
        marketingCateGory: this.checkedCategory,
        indicators: ['marketingHotArticle'],
        viewType: this.viewType,
        beginDate: this.beginDate,
        endDate: this.endDate,
        shopIds: this.checkedShop
      };
      http
        .post('/admin/ecommerce/kpi/marketing/graph/marketing.jhtml', params)
        .then(data => {
          this.chartDataOfHeatRanking = this.dataHeatRankingFormat(data);
        })
        .catch(errData => {
          this.loading = false;
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    dataHeatRankingFormat(data) {
      let tmpData = [];
      for (let i = 0; i < (data.indicators.length > 4 ? 4 : data.indicators.length); i++) {
        tmpData.push({
          type: data.indicators[i].xValue,
          阅读量: data.indicators[i].yValue
        });
      }
      let chartData = {
        type: 'histogram',
        legendVisible: false,
        data: {
          columns: ['type', '阅读量'],
          rows: tmpData
        },
        settings: {
          yAxisName: ['阅读量'],
          interval: '0'
        }
      };
      return chartData;
    },
    refreshHandle(val) {
      this.viewType = val.viewType;
      this.beginDate = val.date[0];
      this.endDate = val.date[1];
      this.dateType = val.dateType;
      this.params = { viewType: this.viewType, beginDate: this.beginDate, endDate: this.endDate, dateType: val.dateType, checkedShop: this.checkedShop };
      this.getGraphGeneralViewData();
      this.getGraphActivityEffectData();
      this.getGraphFlowData();
      this.getGraphHeatRankingData();
      this.init();
    }
  },
  computed: {},
  created() {
    this.init();
    this.getShopList();
    this.query();
  },
  components: {
    BizChart,
    MarketingGeneralViewAnalysis,
    ActivityEffectAnalysis,
    FlowAnalysis,
    HeatRankingAnalysis,
    ShowSearchGrid
  }
};
</script>

<style lang="scss">
.general-view-analysis-marketing {
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
