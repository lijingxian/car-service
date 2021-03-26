<template>
  <div class="smtop-analysis">
    <div slot="top">
      <show-search-grid @refreshHandle="refreshHandle" ref="search">
        <div slot="description" class="description-pover">
          <p>到店人数：筛选范围内新增到店记录数量</p>
          <p>接待人数：筛选范围内到店记录存在接待数量</p>
          <p>消费金额：筛选范围内到店记录的订单的消费金额</p>
          <p>接待时长：筛选范围内到店记录到店-离店时间差</p>
          <p>到店时间：筛选范围内到店记录时间</p>
          <!-- <p>异常分析：筛选范围内符合异常条件到店记录</p>
          <p>1.大于3小时，实付金额小于50</p>
          <p>2.大于12小时，实付金额小于1000</p>
          <p>3.大于60小时，实付金额小于3000</p>
          <p>4.大于120小时，不限订单金额</p> -->
          <p>顾问接待人数：筛选范围内顾问接待的人数</p>
          <p>顾问放行人数：筛选范围内顾问放行的人数</p>
          <p>顾问接待金额：筛选范围内顾问接待到店记录的订单实付金额</p>
        </div>
      </show-search-grid>
    </div>
    <div class="chart-area" v-loading="loading">
      <div class="graph">
        <div class="filterSeach">
          <div class="filter-area">
            <el-radio-group @change="indicatorChanged" v-model="indicatorValue" size="mini">
              <el-radio-button label="atShopCnt">到店人数</el-radio-button>
              <el-radio-button label="receptionCnt">接待人数</el-radio-button>
              <el-radio-button label="receptionMemberCnt">到店会员数</el-radio-button>
              <el-radio-button label="consumption">消费金额</el-radio-button>
              <el-radio-button label="receptionDuration">到店时长</el-radio-button>
              <el-radio-button label="atShopTime">到店时间</el-radio-button>
              <!-- <el-radio-button label="alarmIns">异常分析</el-radio-button> -->
              <el-radio-button label="consultantReceptionNum">顾问接待人数</el-radio-button>
              <el-radio-button label="consultantRelease">顾问放行人数</el-radio-button>
              <el-radio-button label="consultantReceptionAmount">顾问接待金额</el-radio-button>
            </el-radio-group>
          </div>
          <div class="type-range">
            <el-radio-group v-model="radioValue" size="mini">
              <el-radio-button label="0">视图</el-radio-button>
              <el-radio-button label="1">列表</el-radio-button>
            </el-radio-group>
          </div>
        </div>
        <biz-chart :chartData="chartData" :loading="loading" :showSearch="false" v-if="radioValue==='0'&&(indicatorValue==='atShopCnt'||indicatorValue==='receptionCnt'||indicatorValue==='receptionMemberCnt'||indicatorValue==='consumption'||indicatorValue==='receptionDuration')"></biz-chart>
        <biz-chart :chartData="chartDataOfWork" :loading="loading" :showSearch="false" v-if="radioValue==='0'&&(indicatorValue==='atShopTime'||indicatorValue==='consultantReceptionNum'||indicatorValue==='consultantRelease'||indicatorValue==='consultantReceptionAmount')"></biz-chart>
      <biz-list ref="list" :height="height" :tableData="tableData" style="width: 100%;height:100%" v-show="radioValue==='1'">
          <template v-if="!isConsultantAnalysis">
            <el-table-column prop="plateNumber" label="车牌号"></el-table-column>
            <el-table-column prop="mobile" label="会员手机号"></el-table-column>
            <el-table-column prop="name" label="会员姓名"></el-table-column>
            <el-table-column prop="accessTime" label="到店时间"></el-table-column>
            <el-table-column prop="leaveTime" label="离店时间"></el-table-column>
            <el-table-column prop="length" label="到店时长"></el-table-column>
            <el-table-column prop="adminName" label="接待人员"></el-table-column>
            <el-table-column prop="releaseAdminName" label="放行人员"></el-table-column>
            <el-table-column prop="orderAmount" label="订单金额"></el-table-column>
            <el-table-column prop="orderAmountPaid" label="实付金额"></el-table-column>
          </template>
          <template v-else>
            <el-table-column prop="xValue" label="顾问名称"></el-table-column>
            <el-table-column prop="yValue" :label="columnLabel"></el-table-column>
          </template>
        </biz-list>
        <biz-pagination :pagination="pagination" @size-change="handleSizeChange" @current-change="handleCurrentChange" v-show="radioValue==='1'"></biz-pagination>
        <div align="right" v-if="radioValue==='1'">
          <el-button type="primary" size="mini" @click="exportExcle">导出</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BizChart from '@/components/BizChart';
import { BizList, BizPagination } from '@/components/BizTable';
import ShowSearchGrid from './components/ShowSearchGrid';
import dateTime from '@/utils/dateTime';
import http from '@/common/http';
import axios from 'axios';
import { mapGetters } from 'vuex';

export default {
  name: 'ChannelAnalysis',
  data() {
    return {
      loading: false,
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
      chartDataOfWork: {},
      chartData: {},
      isShow: 'false',
      hardGroupHeight: 0,
      hardGroupHeight1: 0,
      showSwich: true,
      showSwichSeries: false,
      showHide: true,
      showSeriesHide: false,
      kpiName: ['本期', '同比', '环比'],
      className: 'el-icon-caret-bottom',
      classSeriesName: 'el-icon-caret-bottom',
      // indicator
      conditionData: [
        {
          channelList: [],
          brandList: [],
          seriesList: []
        }
      ],
      channelLists: [],
      countTotal: 0,
      radioValue: '0',
      indicatorValue: 'atShopCnt'
    };
  },
  props: {
    params: {
      type: Object
    }
  },
  methods: {
    ...mapGetters(['getUser']),
    load() {
      this.viewType = this.params.viewType || 'month';
      console.log(this.params);
      this.$refs.search.viewType = this.params.viewType || 'month';
      this.$refs.search.date = this.params.dateType || 'month';
      this.$refs.search.defaultDate = [dateTime.getPreThreeMonthDay(), dateTime.today()];
      if (this.params.beginDate) {
        this.beginDate = this.params.beginDate;
        this.endDate = this.params.endDate;
        this.$refs.search.defaultDate = [this.params.beginDate, this.params.endDate];
      }
      this.query();
    },
    query() {
      this.getGraphData();
      this.getTable();
    },
    indicatorChanged() {
      this.getGraphData();
      this.getTable();
    },
    getGraphData() {
      this.loading = true;
      let params = {
        indicator: this.indicatorValue,
        viewType: this.viewType,
        beginDate: this.beginDate,
        endDate: this.endDate
      };
      http
        .post('/admin/ecommerce/kpi/graph/service/intelligentAccess.jhtml', params)
        .then(data => {
          if (this.indicatorValue === 'atShopTime' || this.indicatorValue === 'consultantReceptionNum' || this.indicatorValue === 'consultantRelease') {
            this.chartDataOfWork = this.dataFormatWork(data);
          } else if (this.indicatorValue === 'consultantReceptionAmount') {
            this.chartDataOfWork = this.dataFormatAmount(data);
          } else {
            this.chartData = this.dataFormat(data);
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
    getTable() {
      // 顾问接待, 顾问放行, 顾问金额
      if (this.isConsultantAnalysis) {
        let params = {
          indicator: this.indicatorValue,
          viewType: this.viewType,
          beginDate: this.beginDate,
          endDate: this.endDate
        };
        http
          .post('/admin/ecommerce/kpi/graph/service/intelligentAccess.jhtml', params)
          .then(data => {
            if (this.indicatorValue === 'consultantReceptionAmount') {
              this.tableData = data.indicators.map(i => Object.assign({}, i, { yValue: Number(i.yValue).toFixed(2) }));
            } else {
              this.tableData = data.indicators;
            }
            this.pagination.total = data.indicators.length;
          })
          .catch(errData => {
            this.loading = false;
            if (errData.errorMessage) this.$message.warning(errData.errorMessage);
          })
          .finally(data => {
            this.loading = false;
          });
        return;
      }
      let params = {
        indicator: this.indicatorValue,
        viewType: this.viewType,
        beginDate: this.beginDate,
        endDate: this.endDate,
        pageSize: this.pagination.pageSize,
        pageNumber: this.pagination.currentPage
      };
      http
        .post('/admin/ecommerce/kpi/table/service/intelligentAccess.jhtml', params)
        .then(data => {
          this.tableData = data.dataList;
          this.pagination.total = Number(data.total);
        })
        .catch(errData => {
          this.loading = false;
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    async exportExcle() {
      let params = {
        indicator: this.indicatorValue,
        viewType: this.viewType,
        beginDate: this.beginDate,
        endDate: this.endDate,
        pageSize: this.pagination.pageSize,
        pageNumber: this.pagination.currentPage
      };
      try {
        let response = await axios.post('/admin/ecommerce/kpi/export/service/intelligentAccess.jhtml', params, {
          responseType: 'blob'
        });
        console.log('response => ', response);
        const blob = new Blob([response.data], { type: 'application/vnd.ms-excel' });
        console.log(decodeURI(response.headers['content-disposition']));
        const fileName = decodeURI(response.headers['content-disposition'].split('filename=')[1]);
        let elink = document.createElement('a');
        elink.download = fileName.match(/"(\S*)"/)[1];
        elink.style.display = 'none';
        elink.href = URL.createObjectURL(blob);
        document.body.appendChild(elink);
        elink.click();
        URL.revokeObjectURL(elink.href); // 释放URL 对象
        document.body.removeChild(elink);
        return;
      } catch (error) {
        throw new Error(error);
      }
    },
    refreshHandle(val) {
      this.viewType = val.viewType;
      this.beginDate = val.date[0];
      this.endDate = val.date[1];
      this.getGraphData();
      this.getTable();
    },
    handleSizeChange(val) {
      this.pagination.pageSize = val;
      this.getTable();
    },
    handleCurrentChange(val) {
      this.pagination.currentPage = val;
      this.getTable();
    },
    dataFormat(data) {
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
          rotate: '45',
          interval: 'auto',
          showLine: [this.kpiName[1], this.kpiName[2]]
        }
      };
      return chartData;
    },
    dataFormatWork(data) {
      let tmpData = [];
      for (let i = 0; i < data.indicators.length; i++) {
        tmpData.push({
          日期: data.indicators[i].xValue,
          人数: data.indicators[i].yValue
        });
      }
      let chartData = {
        type: 'histogram',
        legendVisible: false,
        data: {
          columns: ['日期', '人数'],
          rows: tmpData
        },
        settings: {}
      };
      return chartData;
    },
    dataFormatAmount(data) {
      let tmpData = [];
      console.log(1);
      for (let i = 0; i < data.indicators.length; i++) {
        tmpData.push({
          顾问: data.indicators[i].xValue,
          元: data.indicators[i].yValue
        });
      }
      let chartData = {
        type: 'histogram',
        legendVisible: false,
        data: {
          columns: ['顾问', '元'],
          rows: tmpData
        },
        settings: {}
      };
      return chartData;
    },
    purposeConverter(row) {
      return `${row.purposeBrand} ${row.purposeSeries} ${row.purposeProduct}`;
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
    isConsultantAnalysis() {
      return ['consultantReceptionNum', 'consultantRelease', 'consultantReceptionAmount'].includes(this.indicatorValue);
    },
    columnLabel() {
      const obj = {
        'consultantReceptionNum': '顾问接待人数(人)',
        'consultantRelease': '顾问放行人数(人)',
        'consultantReceptionAmount': '顾问接待金额(元)'
      };
      return obj[this.indicatorValue];
    },
    toggleRecommendTxt() {
      if (this.showRecommend) {
        return '收起明细';
      }
      return '查看明细';
    }
  },
  created() {},
  components: {
    BizChart,
    BizList,
    BizPagination,
    ShowSearchGrid
  }
};
</script>

<style lang="scss">
.smtop-analysis {
  height: 100%;
  overflow: auto;
  align-content: space-between;
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
  .chart-area {
    margin-top: 10px;
    .graph {
      box-shadow: 0 2px 3px rgba(0, 0, 0, 0.1);
      margin-bottom: 20px;
      margin-left: 1px;
      width: 100%;
      .header {
        height: 40px;
        background-color: #f7f7f7;
        font-size: 13px;
        padding: 10px;
        font-weight: 700;
      }
      .filterSeach {
        display: flex;
        justify-content: space-between;
        margin: 10px 0px;
      }
    }
  }
  .swich {
    text-align: center;
    font-size: 24px;
    cursor: pointer;
    margin-top: -10px;
  }
  .swichSeries {
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
