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
        <span>{{shopName}}</span><span>会员卡月报</span><span>|</span><span>{{endDate.split('-')[0]+'年'+endDate.split('-')[1]+'月'}}1-{{lastDate}}日</span>
      </div>
      <div class="content">
        <div class="title-header">
          <span>一、会员卡概述</span>
        </div>
        <div class="des">
          <p>
            截至{{endDate.split('-')[0]+'年'+endDate.split('-')[1]+'月'}}，新增会员卡{{indicators.memberCardInc}}张。
            累计会员卡{{indicators.totalMemberCard}}张，同比增加{{indicators.memberCardIncYoy}}%，环比增加{{indicators.memberCardIncMon}}%。卡内余额{{indicators.totalBalance}}元；
            当月累计会员卡储值金额{{indicators.memberCardDepositInc}}元，同比增加{{indicators.memberCardDepositIncYoy}}%，环比增加{{indicators.memberCardDepositIncMon}}%。
            会员卡消费金额{{indicators.memberCardConsumeInc}}元，同比增加{{indicators.memberCardConsumeIncYoy}}%，环比增加{{indicators.memberCardConsumeIncMon}}%。
          </p>
        </div>
        <div class="chart-area">
          <div class="graph">
             <div align="center" class="des">新增会员卡变化-按月</div>
            <biz-chart :chartData="chartDataOfInc" :loading="loading" :showSearch="false"></biz-chart>
          </div>
          <div class="graph">
            <div align="center" class="des">会员卡储值金额变化-按月</div>
            <biz-chart :chartData="chartDataOfIncome" :loading="loading" :showSearch="false"></biz-chart>
          </div>
          <div class="graph">
            <div align="center" class="des">会员卡消费金额变化-按月</div>
            <biz-chart :chartData="chartDataOfConsume" :loading="loading" :showSearch="false"></biz-chart>
          </div>
        </div>
      </div>
      <div class="content">
        <div class="title-header">
          <span>二、结论建议</span>
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
      chartDataOfInc: {},
      chartDataOfConsume: {},
      chartDataOfIncome: {},
      topCarX: [],
      topCarY: [],
      topCarAmountX: [],
      topCarAmountY: [],
      topConsultantX: [],
      topConsultantY: [],
      topConsultantAmountX: [],
      topConsultantAmountY: [],
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
        endDate: this.endDate.split('-')[0] + '-' + this.endDate.split('-')[1] + '-' + date.getMonthDays(this.endDate),
        shopIds: [this.checkedShops || this.getUser().shop.id]
      };
      http
        .post('/admin/ecommerce/kpi/summary/memberCard/report.jhtml', param)
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
          pdf.save('会员卡月报.pdf');
          that.loading = false;
        });
      }, 500);
    },
    link(link) {
      this.updateRoutes({ routes: sideList[`${link.split('/')[1]}`] });
      this.$router.push(link);
    },
    query() {
      this.getGraphIncData();
      this.getGraphConsumeData();
      this.getGraphIncomeData();
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
    // 新增会员数
    getGraphIncData() {
      this.loading = true;
      let params = {
        viewType: 'month',
        indicator: '2',
        type: '0',
        beginDate: date.halfYearAgo(this.endDate),
        shopIds: [this.checkedShops || this.getUser().shop.id],
        endDate: this.endDate.split('-')[0] + '-' + this.endDate.split('-')[1] + '-' + date.getMonthDays(this.endDate)
      };
      http
        .post('/admin/ecommerce/kpi/memberCard/graph.jhtml', params)
        .then(data => {
          this.chartDataOfInc = this.dataFormat(data);
        })
        .catch(errData => {
          this.loading = false;
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    // 消费会员数
    getGraphConsumeData() {
      this.loading = true;
      let params = {
        viewType: 'month',
        indicator: '0',
        type: '3',
        beginDate: date.halfYearAgo(this.endDate),
        shopIds: [this.checkedShops || this.getUser().shop.id],
        endDate: this.endDate.split('-')[0] + '-' + this.endDate.split('-')[1] + '-' + date.getMonthDays(this.endDate)
      };
      http
        .post('/admin/ecommerce/kpi/memberCard/graph.jhtml', params)
        .then(data => {
          this.chartDataOfConsume = this.dataFormat(data);
        })
        .catch(errData => {
          this.loading = false;
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    // 收入
    getGraphIncomeData() {
      this.loading = true;
      let params = {
        viewType: 'month',
        indicator: '1',
        type: '3',
        beginDate: date.halfYearAgo(this.endDate),
        shopIds: [this.checkedShops || this.getUser().shop.id],
        endDate: this.endDate.split('-')[0] + '-' + this.endDate.split('-')[1] + '-' + date.getMonthDays(this.endDate)
      };
      http
        .post('/admin/ecommerce/kpi/memberCard/graph.jhtml', params)
        .then(data => {
          this.chartDataOfIncome = this.dataFormat(data);
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
      margin-top: 10px;
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
</style>
