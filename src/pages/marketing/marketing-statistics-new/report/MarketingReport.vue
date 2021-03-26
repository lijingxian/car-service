<template>
  <div class="member-report">
    <div class="top">
      <div class="block">
        <div class="demonstration">月份</div>
        <el-date-picker v-model="endDate" :clearable="false" value-format="yyyy-MM" type="month" placeholder="选择月" size="mini" :picker-options="pickerOptions" @change="dateChange">
        </el-date-picker>
        <div class="demonstration" style="padding-left:10px">店铺</div>
        <el-select v-model="checkedShops" placeholder="请选择" @change="shopChange" size="mini">
          <el-option v-for="item in shopsList" :key="item.id" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
      </div>
      <div>
        <!-- <el-button type="text" size="mini" v-popover:codePop class="description">
          统计说明
          <i class="iconfont el-icon-question"></i>
        </el-button>
        <el-popover ref="codePop" placement="bottom-start" width="300" trigger="hover">
          <div></div>
        </el-popover> -->
        <el-button type="primary" size="mini" @click="printView">打印</el-button>
        <el-button type="primary" size="mini" @click="save">导出</el-button>
      </div>
    </div>
    <div ref="imageWrapper">
      <div class="title-header">
        <span>{{shopName}}</span><span>营销月报</span><span>|</span><span>{{endDate.split('-')[0]+'年'+endDate.split('-')[1]+'月'}}1-{{lastDate}}日</span>
      </div>
      <div class="content">
        <div class="title-header">
          <span>一、营销效果</span>
        </div>
        <div class="des">
          <p>
            {{endDate.split('-')[0]+'年'+endDate.split('-')[1]+'月'}}，共举办活动{{indicators.marketingActivityNumInc}}次。
            其中，营销活动{{indicators.advertiseMarketingViewNumInc}}次，促销活动{{indicators.promotionActivityNumInc}}次，线下活动{{indicators.localActivityAvgIncomeInc}}次，
            总参与人次{{indicators.activityCrowNumInc}}次，同比增长{{indicators.activityCrowNumIncYoy}}%，环比增长{{indicators.activityCrowNumIncMon}}%；
            <!-- 人均活动成本{{indicators.consumeMemberInc}}次，同比增长{{indicators.consumeMemberIncProportion}}%，环比增长{{indicators.consumeMemberIncProportion}}%； -->
            人均活动产值{{indicators.activityAvgIncomeInc}}次，同比增长{{indicators.activityAvgIncomeIncYoy}}%，环比增长{{indicators.activityAvgIncomeIncMon}}%；
          </p>
          <p>
            {{endDate.split('-')[0]+'年'+endDate.split('-')[1]+'月'}}，
            共发布资讯{{indicators.articleNumInc}}篇，
            其中软文宣传{{indicators.consumeMemberInc}}篇，商品推广{{indicators.channelViewNum}}篇，总阅读量{{indicators.marketingViewNumInc}}次，
            同比增长{{indicators.marketingViewNumIncYoy}}%，环比增长{{indicators.marketingViewNumIncMon}}%。
          </p>
          <p>
            从活动的热度和效果来看，在营销活动中，{{marketing.length>0?marketing[0].xValue:''}}活动热度最好，参与人次最多。
            在促销活动中，{{promotion.length>0?promotion[0].xValue:''}}活动的效果最高，促销的总产值最高。
            在软文宣传中，{{article.length>0?article[0].xValue:''}}文章的热度最好，阅读量最高。
          </p>
        </div>
        <div class="chart-area">
          <div class="graph">
            <biz-chart :chartData="chartDataOfMarket" :loading="loading" :showSearch="false"></biz-chart>
            <div align="center" class="des">营销活动热度排行</div>
          </div>
          <div class="graph">
            <biz-chart :chartData="chartDataOfPromotion" :loading="loading" :showSearch="false"></biz-chart>
            <div align="center" class="des">促销活动效果排行</div>
          </div>
          <div class="graph">
            <biz-chart :chartData="chartDataOfArticle" :loading="loading" :showSearch="false"></biz-chart>
            <div align="center" class="des">软文宣传效果排行</div>
          </div>
        </div>
      </div>
      <div class="content">
        <div class="title-header">
          <span>二、渠道推送对比</span>
        </div>
        <div class="des">
          <p>
            {{endDate.split('-')[0]+'年'+endDate.split('-')[1]+'月'}}，
            共向各渠道推送{{indicators.channelPushNumInc}}次，同比增长{{indicators.channelPushNumIncYoy}}%，环比增长{{indicators.channelPushNumIncMon}}%；
            总点击量{{indicators.marketingViewNumInc}}次，同比增长{{indicators.marketingViewNumIncYoy}}%，环比增长{{indicators.marketingViewNumIncMon}}%；
            从渠道推送效果来看，{{channel.length>0?channel[0].lable:''}}渠道的推广效果最好，其点击量最高。
          </p>
        </div>
        <div class="chart-area">
          <div class="graph" style="width:100%">
            <biz-chart :chartData="chartDataOfChannel" :loading="loading" :showSearch="false"></biz-chart>
            <div align="center" class="des">各渠道点击量情况</div>
          </div>
        </div>
      </div>
      <div class="content">
        <div class="title-header">
          <span>三、结论建议</span>
        </div>
        <div class="des">
          <p v-for="(advise, index) in indicators.advise" :key="index" v-show="indicators.advise && indicators.advise.length > 0">
            {{advise.join(',')}}
          </p>
          <p v-show="!indicators.advise || indicators.advise.length === 0">
            您的店铺当月经营良好，暂无明显需要改善的地方。
          </p>
        </div>
      </div>
    </div>
    <el-dialog :visible.sync="dialogTableVisible" center width="1200px" append-to-body>
      <div align="right">
        <el-button type="primary" @click="print" size="mini">打印</el-button>
      </div>
      <vue-easy-print tableShow ref="easyPrint">
        <img :src="url" width="100%">
      </vue-easy-print>
    </el-dialog>
  </div>
</template>

<script>
import BizChart from '@/components/BizChart';
import { mapGetters, mapMutations } from 'vuex';
import sideList from '@/pages/layout/SideList.js';
import http from '@/common/http';
import date from '@/utils/date';
import dateTime from '@/utils/dateTime';
import vueEasyPrint from 'vue-easy-print';
import html2canvas from 'html2canvas';
import JsPdf from 'jspdf';
export default {
  name: 'CustomerServiceNav',
  data() {
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      companyCount: 0,
      storeCount: 0,
      unionCount: 0,
      countTotal: 0,
      carData: [],
      ageData: [],
      genderData: [],
      genData: [],
      marryData: [],
      incomeData: [],
      beginDate: dateTime.getMonthStartDate(),
      endDate: date.nowDate(),
      addOperator: '',
      addStore: '',
      storeList: '',
      url: '',
      isIndeterminateShops: true,
      dialogTableVisible: false,
      loading: false,
      checkAllShops: true,
      checkedShops: this.getUser().shop.id,
      shopsList: [],
      chartData: {},
      chartDataOfMarket: {},
      chartDataOfPromotion: {},
      chartDataOfArticle: {},
      chartDataOfChannel: {},
      marketing: [],
      promotion: [],
      article: [],
      channel: [],
      indicators: { advise: [] },
      imgUrl: '',
      kpiName: ['本期', '同比', '环比']
    };
  },
  computed: {
    shopName() {
      let temp = this.getUser().shop.name;
      this.shopsList.map(item => {
        if (this.checkedShops === item.id) {
          temp = item.name;
        }
      });
      return temp;
    },
    lastDate() {
      return date.getMonthDays(this.endDate);
    }
  },
  components: {
    BizChart,
    vueEasyPrint
  },
  created() {
    this.getShopList();
  },
  methods: {
    ...mapGetters(['getUser']),
    ...mapMutations('Menu', ['updateRoutes']),
    ...mapGetters('Authority', ['currentAuth']),
    print() {
      // window.print();
      this.$refs.easyPrint.print();
    },
    dateChange() {
      this.beginDate = this.endDate.split('-')[0] + '-' + this.endDate.split('-')[1] + '-01';
      this.query();
    },
    init() {
      let param = {
        viewType: 'month',
        beginDate: this.beginDate,
        endDate: this.endDate.split('-')[0] + '-' + this.endDate.split('-')[1] + '-' + date.getMonthDays(this.endDate)
      };
      http
        .post('/admin/ecommerce/kpi/marketing/summary/report.jhtml', param)
        .then(data => {
          this.indicators = data.indicators;
        })
        .catch(error => {
          if (error.errorMessage) {
            this.$message.warning(error.errorMessage);
          }
        });
    },
    printView() {
      let that = this;
      window.pageYOffset = 0;
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      setTimeout(() => {
        html2canvas(this.$refs.imageWrapper).then(canvas => {
          that.url = canvas.toDataURL();
          that.dialogTableVisible = true;
        });
      }, 500);
    },
    save() {
      let that = this;
      window.pageYOffset = 0;
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      setTimeout(() => {
        html2canvas(this.$refs.imageWrapper).then(canvas => {
          let contentWidth = canvas.width;
          let contentHeight = canvas.height;
          // 一页pdf显示html页面生成的canvas高度;
          let pageHeight = (contentWidth / 592.28) * 841.89;
          // 未生成pdf的html页面高度
          let leftHeight = contentHeight;
          // 页面偏移
          let position = 0;
          // a4纸的尺寸[595.28,595.28]，html页面生成的canvas在pdf中图片的宽高
          let imgWidth = 595.28;
          let imgHeight = (592.28 / contentWidth) * contentHeight;
          let pageData = canvas.toDataURL('image/jpeg', 1.0);
          // element.append(canvas)
          let pdf = new JsPdf('', 'pt', 'a4');
          // 有两个高度需要区分，一个是html页面的实际高度，和生成pdf的页面高度(841.89)
          // 当内容未超过pdf一页显示的范围，无需分页
          if (leftHeight < pageHeight) {
            pdf.addImage(pageData, 'JPEG', 0, 0, imgWidth, imgHeight);
          } else {
            // 分页
            while (leftHeight > 0) {
              pdf.addImage(pageData, 'JPEG', 0, position, imgWidth, imgHeight);
              leftHeight -= pageHeight;
              position -= 841.89;
              // 避免添加空白页
              if (leftHeight > 0) {
                pdf.addPage();
              }
            }
          }
          pdf.save('销售月报.pdf');
          that.loading = false;
        });
      }, 500);
    },
    link(link) {
      this.updateRoutes({ routes: sideList[`${link.split('/')[1]}`] });
      this.$router.push(link);
    },
    query() {
      this.getGraphMarketata();
      this.getGraphPromotionData();
      this.getGraphArticleData();
      this.getGraphChannelData();
      this.init();
    },
    shopChange(val) {
      this.query();
    },
    getShopList() {
      let param = {
        sourceType: '5'
      };
      http
        .get('/admin/member/json/findEShops.jhtml', param)
        .then(data => {
          this.shopsList = data.shops;
          this.query();
        })
        .catch(error => {
          if (error.errorMessage) {
            this.$message.warning(error.errorMessage);
          }
        });
    },
    // 热门活动
    getGraphMarketata() {
      this.loading = true;
      let params = {
        viewType: 'month',
        indicators: ['hotMarketingActivity'],
        beginDate: this.beginDate,
        endDate: this.endDate.split('-')[0] + '-' + this.endDate.split('-')[1] + '-' + date.getMonthDays(this.endDate)
      };
      http
        .post('/admin/ecommerce/kpi/marketing/graph/marketing.jhtml', params)
        .then(data => {
          this.marketing = data.indicators;
          this.chartDataOfMarket = this.dataFormat(data);
        })
        .catch(errData => {
          this.loading = false;
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    // 热门促销
    getGraphPromotionData() {
      this.loading = true;
      let params = {
        viewType: 'month',
        indicators: ['hotPromotionActivity'],
        beginDate: this.beginDate,
        endDate: this.endDate.split('-')[0] + '-' + this.endDate.split('-')[1] + '-' + date.getMonthDays(this.endDate)
      };
      http
        .post('/admin/ecommerce/kpi/marketing/graph/marketing.jhtml', params)
        .then(data => {
          this.promotion = data.indicators;
          this.chartDataOfPromotion = this.dataFormatPromotion(data);
        })
        .catch(errData => {
          this.loading = false;
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    // 软文宣传
    getGraphArticleData() {
      this.loading = true;
      let params = {
        viewType: 'month',
        indicators: ['marketingHotArticle'],
        beginDate: this.beginDate,
        endDate: this.endDate.split('-')[0] + '-' + this.endDate.split('-')[1] + '-' + date.getMonthDays(this.endDate)
      };
      http
        .post('/admin/ecommerce/kpi/marketing/graph/marketing.jhtml', params)
        .then(data => {
          this.article = data.indicators;
          this.chartDataOfArticle = this.dataFormat(data);
        })
        .catch(errData => {
          this.loading = false;
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    dataFormatPromotion(data) {
      let tmpData = [];
      for (let i = 0; i < (data.indicators.length > 4 ? 4 : data.indicators.length); i++) {
        tmpData.push({
          type: data.indicators[i].xValue,
          万元: data.indicators[i].yValue
        });
      }
      let chartData = {
        type: 'histogram',
        legendVisible: false,
        data: {
          columns: ['type', '万元'],
          rows: tmpData
        },
        settings: {
          yAxisName: ['销售额'],
          interval: '0'
        }
      };
      return chartData;
    },
    dataFormat(data) {
      let tmpData = [];
      for (let i = 0; i < (data.indicators.length > 4 ? 4 : data.indicators.length); i++) {
        tmpData.push({
          type: data.indicators[i].xValue,
          次: data.indicators[i].yValue
        });
      }
      let chartData = {
        type: 'histogram',
        legendVisible: false,
        data: {
          columns: ['type', '次'],
          rows: tmpData
        },
        settings: {
          yAxisName: ['次'],
          interval: '0'
        }
      };
      return chartData;
    },
    // 渠道
    getGraphChannelData() {
      this.loading = true;
      let params = {
        viewType: 'month',
        beginDate: this.beginDate,
        endDate: this.endDate.split('-')[0] + '-' + this.endDate.split('-')[1] + '-' + date.getMonthDays(this.endDate),
        indicators: ['channelViewNum']
      };
      http
        .post('/admin/ecommerce/kpi/marketing/graph/marketing.jhtml', params)
        .then(data => {
          this.channel = data.indicators;
          this.chartDataOfChannel = this.dataFormatPie(data);
          this.countTotal = 0;
          for (const item of data.indicators) {
            this.countTotal += Number(item.value);
          }
        })
        .catch(errData => {
          this.loading = false;
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    dataFormatPie(data) {
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
          offsetY: '50%'
        }
      };
      return chartData;
    }
  },
  mounted() {}
};
</script>

<style lang="scss">
.member-report {
  padding: 20px;
  font-size: 12px;
  height: 100%;
  overflow: auto;
  .top {
    display: flex;
    justify-content: space-between;
    padding-bottom: 10px;
    .block {
      .demonstration {
        height: 20px;
        line-height: 30px;
        margin-right: 10px;
      }
      display: flex;
    }
    .description {
      margin-right: 30px;
    }
  }
  .title-header {
    height: 40px;
    background: #f7f7f7;
    line-height: 40px;
    span {
      padding: 0px 10px;
    }
  }
  .content {
    margin: 20px 0px;
    p {
      padding-left: 20px;
    }
  }
  .chart-area {
    margin-top: 10px!important;
    display: flex;
    background: #ffffff;
    .graph {
      margin-right: 5px;
      width: 49%;
      height: 22vw;
      background: #ffffff;
      .biz-chart {
        background: #ffffff;
      }
      .des {
        margin-top: -10px;
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
  .indicators-search {
    display: -webkit-box;
    height: auto;
    .hardShopGroup {
      display: flex;
    }
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
      padding: 20px 0px;
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
}
</style>
