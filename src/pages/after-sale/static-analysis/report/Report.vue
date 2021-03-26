<template>
  <div class="afterSale-report">
    <div class="top">
      <div class="block">
        <div class="demonstration">月份</div>
        <el-date-picker v-model="endDate" value-format="yyyy-MM-dd" type="month" placeholder="选择月" size="mini"
          :picker-options="pickerOptions" :clearable="false" @change="dateChange">
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
        <span>{{shopName}}</span><span>售后月报</span><span>|</span><span>{{endDate.split('-')[0]+'年'+endDate.split('-')[1]+'月'}}1-{{lastDate}}日</span>
      </div>
      <div class="content">
        <div class="title-header">
          <span>一、进厂台次与产值情况</span>
        </div>
        <div class="des">
          <p>
            {{endDate.split('-')[0]+'年'+endDate.split('-')[1]+'月'}}，
            车辆售后进厂台次共{{indicators.intelligentAccessNumInc}}台，同比增加{{indicators.intelligentAccessNumIncYoy}}%，环比增加{{indicators.intelligentAccessNumIncMon}}%；
            <!-- 其中预约台次{{indicators.orderProductAvgNumInc}}台，同比增加{{indicators.orderProductAvgNumIncYoy}}%，环比增加{{indicators.orderProductAvgNumIncMon}}%；预约率{{indicators.orderAmountPaidInc}}%， -->
            人均接待次数{{indicators.avgIntelligentAccessNumInc}}次，同比增加{{indicators.avgIntelligentAccessNumIncYoy}}%，环比增加{{indicators.avgIntelligentAccessNumIncMon}}%。
          </p>
          <p>
            售后收入共{{indicators.afterSaleAmountInc}}万元，同比增加{{indicators.afterSaleAmountIncYoy}}%，环比增加{{indicators.afterSaleAmountIncMon}}%；
            按服务项目统计分别为：维修产值{{repairData[0].yValue}}，同比增加{{repairData[0].yoyRate}}%，环比增加{{repairData[0].momRate}}%;
            保养产值{{maintainceData[0].yValue}}，同比增加{{maintainceData[0].yoyRate}}%，环比增加{{maintainceData[0].momRate}}%
            事故车产值{{instanteData[0].yValue}}，同比增加{{instanteData[0].yoyRate}}%，环比增加{{instanteData[0].momRate}}%
          </p>
          <p>
            单车产值{{indicators.singleAfterSaleAmountInc}}元，同比增加{{indicators.singleAfterSaleAmountIncYoy}}%，环比增加{{indicators.singleAfterSaleAmountIncMon}}%。
          </p>
        </div>
        <div class="chart-area">
          <div class="graph">
            <biz-chart :chartData="chartData" :loading="loading" :showSearch="false"></biz-chart>
            <div align="center" class="des">进厂台次变化趋势图</div>
          </div>
          <div class="graph">
            <biz-chart :chartData="chartDataOfAppreciation" :loading="loading" :showSearch="false"></biz-chart>
            <div align="center" class="des">售后产值趋势图</div>
          </div>
        </div>
      </div>
      <div class="content">
        <div class="title-header">
          <span>二、分车型/顾问售后情况</span>
        </div>
        <div class="des">
          <p v-if="topCarX.length>0">
            {{endDate.split('-')[0]+'年'+endDate.split('-')[1]+'月'}}进厂台次排行前五的车型是{{topCarX.join('、')}}，分别是{{topCarY.join('、')}}台；售后收入排行前五的车型是{{topCarAmountX.join('、')}}，分别是{{topCarAmountY.join('、')}}万元。
          </p>
          <p v-if="topConsultantX.length>0">
            {{endDate.split('-')[0]+'年'+endDate.split('-')[1]+'月'}}售后接待次数排行前五的销售顾问是{{topConsultantX.join('、')}}，分别是{{topConsultantY.join('、')}}台；售后收入排行前五的销售顾问是{{topConsultantAmountX.join('、')}}，分别是{{topConsultantAmountY.join('、')}}万元。
          </p>
          <!-- <p>
            {{endDate.split('-')[0]+'年'+endDate.split('-')[1]+'月'}}售后收入排行前五的销售顾问是{{topConsultantX.join('、')}}，分别是{{topConsultantY.join('、')}}台；售后收入排行前五的销售顾问是{{topConsultantAmountX.join('、')}}，分别是{{topConsultantAmountY.join('、')}}万元。
          </p> -->
          <p>
            {{endDate.split('-')[0]+'年'+endDate.split('-')[1]+'月'}}用户满意度评分，其中服务态度{{indicators.satisfactionInc}}分，服务速度{{indicators.serviceAttitudeSatisfactionInc}}分，专业技能{{indicators.professionalSatisfactionInc}}分。
            售后投诉数{{indicators.aftersaleComplaintInc}}个，同比增加{{indicators.aftersaleComplaintIncYoy}}%，环比增加{{indicators.aftersaleComplaintIncMon}}%；
            <!-- 千台投诉率{{indicators.insuranceOrderAmountPaidInc}}%，同比增加{{indicators.insuranceOrderAmountPaidIncYoy}}%，环比增加{{indicators.insuranceOrderAmountPaidIncMon}}%。 -->
          </p>
        </div>
        <div class="chart-area">
          <div class="graph">
            <biz-chart :chartData="chartDataOfCarType" :loading="loading" :showSearch="false"></biz-chart>
            <div align="center" class="des">售后收入排行前五车型</div>
          </div>
          <div class="graph">
            <biz-chart :chartData="chartDataOfConsultant" :loading="loading" :showSearch="false"></biz-chart>
            <div align="center" class="des">售后收入排行前五顾问</div>
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
      chartDataOfAppreciation: {},
      chartDataOfCarType: {},
      chartDataOfConsultant: {},
      topCarX: [],
      topCarY: [],
      topCarAmountX: [],
      topCarAmountY: [],
      topConsultantX: [],
      topConsultantY: [],
      topConsultantAmountX: [],
      topConsultantAmountY: [],
      maintainceData: [],
      repairData: [],
      instanteData: [],
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
        shopId: this.checkedShops
      };
      http
        .post('/admin/ecommerce/kpi/aftersales/summary/report.jhtml', param)
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
          pdf.save('售后月报.pdf');
          that.loading = false;
        });
      }, 500);
    },
    link(link) {
      this.updateRoutes({ routes: sideList[`${link.split('/')[1]}`] });
      this.$router.push(link);
    },
    query() {
      this.getGraphData();
      this.getGraphAppreciationData();
      this.getGraphCarTypeData();
      this.getGraphGeneralData();
      this.getGraphCarTypeAmountData();
      this.getGraphGeneralAmountData();
      this.getMaintainceData();
      this.getRepairData();
      this.getInstanteData();
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
    // 顾问接待次数分析
    getGraphGeneralData() {
      this.loading = true;
      let params = {
        viewType: 'month',
        type: '4',
        indicator: '0',
        beginDate: this.beginDate,
        endDate: this.endDate.split('-')[0] + '-' + this.endDate.split('-')[1] + '-' + date.getMonthDays(this.endDate),
        shopIds: [this.checkedShops || this.getUser().shop.id]
      };
      http
        .post('/admin/ecommerce/kpi/afterSales/graph.jhtml', params)
        .then(data => {
          this.chartDataOfConsultant = this.dataConsultantFormat(data);
          this.topConsultantX = [];
          data.indicators.map((item, index) => {
            if (index < 5) {
              this.topConsultantX.push(item.xValue);
            }
          });
          this.topConsultantY = [];
          data.indicators.map((item, index) => {
            if (index < 5) {
              this.topConsultantY.push(item.yValue);
            }
          });
        })
        .catch(errData => {
          this.loading = false;
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    // 顾问收入分析
    getGraphGeneralAmountData() {
      this.loading = true;
      let params = {
        viewType: 'month',
        type: '4',
        indicator: '1',
        beginDate: this.beginDate,
        endDate: this.endDate.split('-')[0] + '-' + this.endDate.split('-')[1] + '-' + date.getMonthDays(this.endDate),
        shopIds: [this.checkedShops || this.getUser().shop.id]
      };
      http
        .post('/admin/ecommerce/kpi/afterSales/graph.jhtml', params)
        .then(data => {
          this.topConsultantAmountX = [];
          data.indicators.map((item, index) => {
            if (index < 5) {
              this.topConsultantAmountX.push(item.xValue);
            }
          });
          this.topConsultantAmountY = [];
          data.indicators.map((item, index) => {
            if (index < 5) {
              this.topConsultantAmountY.push(item.yValue);
            }
          });
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
          台: data.indicators[i].yValue
        });
      }
      let chartData = {
        legendVisible: false,
        type: 'histogram',
        data: {
          columns: ['顾问', '台'],
          rows: tmpData
        },
        settings: {}
      };
      return chartData;
    },
    // 车型分析
    getGraphCarTypeData() {
      this.loading = true;
      let params = {
        viewType: 'month',
        type: '3',
        indicator: '1',
        beginDate: this.beginDate,
        endDate: this.endDate.split('-')[0] + '-' + this.endDate.split('-')[1] + '-' + date.getMonthDays(this.endDate),
        shopIds: [this.checkedShops || this.getUser().shop.id]
      };
      http
        .post('/admin/ecommerce/kpi/afterSales/graph.jhtml', params)
        .then(data => {
          this.chartDataOfCarType = this.dataCarTypeFormat(data);
          this.topCarX = [];
          data.indicators.map((item, index) => {
            if (index < 5) {
              this.topCarX.push(item.xValue);
            }
          });
          this.topCarY = [];
          data.indicators.map((item, index) => {
            if (index < 5) {
              this.topCarY.push(item.yValue);
            }
          });
        })
        .catch(errData => {
          this.loading = false;
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    // 车型金额
    getGraphCarTypeAmountData() {
      this.loading = true;
      let params = {
        viewType: 'month',
        type: '2',
        indicator: '1',
        beginDate: this.beginDate,
        endDate: this.endDate.split('-')[0] + '-' + this.endDate.split('-')[1] + '-' + date.getMonthDays(this.endDate),
        shopIds: [this.checkedShops || this.getUser().shop.id]
      };
      http
        .post('/admin/ecommerce/kpi/afterSales/graph.jhtml', params)
        .then(data => {
          this.topCarAmountX = [];
          data.indicators.map((item, index) => {
            if (index < 5) {
              this.topCarAmountX.push(item.xValue);
            }
          });
          this.topCarAmountY = [];
          data.indicators.map((item, index) => {
            if (index < 5) {
              this.topCarAmountY.push(item.yValue);
            }
          });
        })
        .catch(errData => {
          this.loading = false;
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    dataCarTypeFormat(data) {
      let tmpData = [];
      for (let i = 0; i < data.indicators.length; i++) {
        tmpData.push({
          车型: data.indicators[i].xValue,
          辆: data.indicators[i].yValue
        });
      }
      let chartData = {
        legendVisible: false,
        type: 'histogram',
        data: {
          columns: ['车型', '辆'],
          rows: tmpData
        },
        settings: {}
      };
      return chartData;
    },
    // 台次分析
    getGraphData() {
      this.loading = true;
      let params = {
        viewType: 'month',
        indicator: '0',
        type: '0',
        beginDate: date.halfYearAgo(this.endDate),
        endDate: this.endDate.split('-')[0] + '-' + this.endDate.split('-')[1] + '-' + date.getMonthDays(this.endDate),
        shopIds: [this.checkedShops || this.getUser().shop.id]
      };
      http
        .post('/admin/ecommerce/kpi/afterSales/graph.jhtml', params)
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
    // 增值分析
    getGraphAppreciationData() {
      this.loading = true;
      let params = {
        viewType: 'month',
        type: '1',
        beginDate: date.halfYearAgo(this.endDate),
        endDate: this.endDate.split('-')[0] + '-' + this.endDate.split('-')[1] + '-' + date.getMonthDays(this.endDate),
        indicator: '0',
        shopIds: [this.checkedShops || this.getUser().shop.id]
      };
      http
        .post('/admin/ecommerce/kpi/afterSales/graph.jhtml', params)
        .then(data => {
          this.chartDataOfAppreciation = this.dataAppreciationFormat(data);
        })
        .catch(errData => {
          this.loading = false;
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    // 保养分析
    getMaintainceData() {
      this.loading = true;
      let params = {
        viewType: 'month',
        type: '2',
        beginDate: this.beginDate,
        endDate: this.endDate.split('-')[0] + '-' + this.endDate.split('-')[1] + '-' + date.getMonthDays(this.endDate),
        indicator: '0',
        shopIds: [this.checkedShops || this.getUser().shop.id]
      };
      http
        .post('/admin/ecommerce/kpi/afterSales/graph.jhtml', params)
        .then(data => {
          this.maintainceData = data.indicators;
        })
        .catch(errData => {
          this.loading = false;
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    // 维修分析
    getRepairData() {
      this.loading = true;
      let params = {
        viewType: 'month',
        type: '2',
        beginDate: this.beginDate,
        endDate: this.endDate.split('-')[0] + '-' + this.endDate.split('-')[1] + '-' + date.getMonthDays(this.endDate),
        indicator: '1',
        shopIds: [this.checkedShops || this.getUser().shop.id]
      };
      http
        .post('/admin/ecommerce/kpi/afterSales/graph.jhtml', params)
        .then(data => {
          this.repairData = data.indicators;
        })
        .catch(errData => {
          this.loading = false;
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    // 事故分析
    getInstanteData() {
      this.loading = true;
      let params = {
        viewType: 'month',
        type: '2',
        beginDate: this.beginDate,
        endDate: this.endDate.split('-')[0] + '-' + this.endDate.split('-')[1] + '-' + date.getMonthDays(this.endDate),
        indicator: '2',
        shopIds: [this.checkedShops || this.getUser().shop.id]
      };
      http
        .post('/admin/ecommerce/kpi/afterSales/graph.jhtml', params)
        .then(data => {
          this.instanteData = data.indicators;
        })
        .catch(errData => {
          this.loading = false;
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    dataAppreciationFormat(data) {
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
.afterSale-report {
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
  margin-top: 10px !important;
  display: flex;
  .graph {
    margin-right: 5px;
    width: 49%;
    height: 22vw;
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
</style>
