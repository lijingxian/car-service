<template>
  <div class="abno-analysis">
    <div slot="top">
      <show-search-grid @refreshHandle="refreshHandle" ref="search">
        <div slot="description" class="description-pover">
          <p>统计投诉及客户响应不及时情况</p>
        </div>
      </show-search-grid>
    </div>
    <div class="chart-area" v-loading="loading">
      <div class="graph">
        <div class="filterSeach">
          <div class="filter-area">
            <el-radio-group @change="indicatorChanged" v-model="indicatorValue" size="mini">
              <el-radio-button label="satisfaction">客户满意度</el-radio-button>
              <el-radio-button label="workSheetComplaintCnt">累计投诉</el-radio-button>
              <el-radio-button label="sessionTimeOutCnt">超时未响应会话</el-radio-button>
              <el-radio-button label="workSheetTimeOutCnt">超时未处理工单</el-radio-button>
            </el-radio-group>
          </div>
          <div class="type-range">
            <el-radio-group v-model="radioValue" size="mini" @change="query">
              <el-radio-button label="0">视图</el-radio-button>
              <el-radio-button label="1">列表</el-radio-button>
            </el-radio-group>
          </div>
        </div>
        <biz-chart :chartData="chartData" :loading="loading" :showSearch="false"
          v-if="radioValue==='0'&&(indicatorValue==='workSheetComplaintCnt'||indicatorValue==='satisfaction')"></biz-chart>
        <biz-chart :chartData="chartDataOfWork" :loading="loading" :showSearch="false"
          v-if="radioValue==='0'&&(indicatorValue==='sessionTimeOutCnt'||indicatorValue==='workSheetTimeOutCnt')"></biz-chart>
        <biz-list ref="list" :height="height" :tableData="tableData" style="width: 100%" v-show="radioValue==='1'&&indicatorValue!=='satisfaction'">
          <el-table-column prop="mobile" label="客户手机号"></el-table-column>
          <el-table-column prop="name" label="客户姓名"></el-table-column>
          <el-table-column prop="createDate" label="工单创建时间" v-if="indicatorValue!=='sessionTimeOutCnt'"></el-table-column>
          <el-table-column prop="type" label="工单类型" v-if="indicatorValue!=='sessionTimeOutCnt'"></el-table-column>
          <el-table-column prop="length" label="工单处理时长(分钟)" v-if="indicatorValue!=='sessionTimeOutCnt'"></el-table-column>
          <el-table-column prop="beginTime" label="会话开始时间" v-if="indicatorValue==='sessionTimeOutCnt'"></el-table-column>
          <el-table-column prop="length" label="会话时长（分钟）" v-if="indicatorValue==='sessionTimeOutCnt'"></el-table-column>
          <el-table-column prop="memberScore" label="用户评分" v-if="indicatorValue==='sessionTimeOutCnt'"></el-table-column>
          <el-table-column prop="managerScore" label="质检评分" v-if="indicatorValue==='sessionTimeOutCnt'"></el-table-column>
        </biz-list>
        <biz-list ref="list" :height="height" :tableData="tableData" style="width: 100%" v-if="radioValue==='1'&&indicatorValue==='satisfaction'">
          <el-table-column prop="plateNumber" label="订单编号"></el-table-column>
          <el-table-column prop="type" label="订单类型"></el-table-column>
          <el-table-column prop="shopName" label="店铺"></el-table-column>
          <el-table-column prop="date" label="评价时间"></el-table-column>
          <el-table-column prop="serviceAttitude" label="服务态度得分"></el-table-column>
          <el-table-column prop="serviceSpeed" label="服务速度得分"></el-table-column>
          <el-table-column prop="professional" label="专业技能得分"></el-table-column>
        </biz-list>
        <biz-pagination :pagination="pagination" @size-change="handleSizeChange" @current-change="handleCurrentChange"
          v-show="radioValue==='1'"></biz-pagination>
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
      checkedRobot: [],
      robotList: [],
      checkAllRobot: true,
      isIndeterminateRobot: true,
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
      channelLists: [],
      countTotal: 0,
      radioValue: '0',
      indicatorValue: 'satisfaction'
    };
  },
  props: {
    params: {
      type: Object
    }
  },
  methods: {
    ...mapGetters(['getUser']),
    robotChange(val) {
      let checkedCount = val.length;
      this.checkAllRobot = checkedCount === this.robotList.length;
      this.isIndeterminateRobot = checkedCount > 0 && checkedCount < this.robotList.length;
      this.query();
    },
    load() {
      this.viewType = this.params.viewType || 'month';
      console.log(this.params);
      this.$refs.search.viewType = this.params.viewType || 'month';
      this.$refs.search.date = this.params.dateType || 'month';
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
      let url = '/admin/ecommerce/kpi/graph/service/service/v2.jhtml';
      if (this.indicatorValue === 'satisfaction') {
        url = '/admin/ecommerce/kpi/order/graph/order/order.jhtml';
      }
      let params = {
        indicator: this.indicatorValue,
        indicators: [this.indicatorValue],
        type: 'orderSatisfaction',
        robotIds: this.checkedRobot,
        viewType: this.viewType,
        beginDate: this.beginDate,
        endDate: this.endDate
      };
      http
        .post(url, params)
        .then(data => {
          if (this.indicatorValue === 'sessionTimeOutCnt' || this.indicatorValue === 'workSheetTimeOutCnt') {
            this.chartDataOfWork = this.dataFormatWork(data);
          } else if (this.indicatorValue === 'satisfaction') {
            this.chartData = this.dataFormatSatisfaction(data);
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
      let url = '/admin/ecommerce/kpi/table/service/service/v2.jhtml';
      if (this.indicatorValue === 'satisfaction') {
        url = '/admin/ecommerce/kpi/order/table/order/order.jhtml';
      }
      let params = {
        indicator: this.indicatorValue,
        type: 'orderSatisfaction',
        indicators: [this.indicatorValue],
        robotIds: this.checkedRobot,
        viewType: this.viewType,
        beginDate: this.beginDate,
        endDate: this.endDate,
        pageSize: this.pagination.pageSize,
        pageNumber: this.pagination.currentPage
      };
      http
        .post(url, params)
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
      let url = '/admin/ecommerce/kpi/export/service/service/v2.jhtml';
      if (this.indicatorValue === 'satisfaction') {
        url = '/admin/ecommerce/kpi/order/export/order/order.jhtml';
      }
      let params = {
        indicator: this.indicatorValue,
        type: 'orderSatisfaction',
        indicators: [this.indicatorValue],
        robotIds: this.checkedRobot,
        viewType: this.viewType,
        beginDate: this.beginDate,
        endDate: this.endDate,
        pageSize: this.pagination.pageSize,
        pageNumber: this.pagination.currentPage
      };
      try {
        let response = await axios.post(url, params, { responseType: 'blob' });
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
    dataFormatSatisfaction(data) {
      let tmpData = [];
      for (let i = 0; i < data.indicators.length; i++) {
        tmpData.push({
          日期: data.indicators[i].xValue,
          本期: data.indicators[i].y[0].yValue,
          同比: data.indicators[i].y[0].yYearOnYear,
          环比: data.indicators[i].y[0].yMonthOnMonth
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
          yAxisName: [this.indicatorValue === 'receptionDuration' ? '分钟' : '', '%'],
          showLine: [this.kpiName[1], this.kpiName[2]]
        }
      };
      return chartData;
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
          yAxisName: [this.indicatorValue === 'receptionDuration' ? '分钟' : '', '%'],
          showLine: [this.kpiName[1], this.kpiName[2]]
        }
      };
      return chartData;
    },
    dataFormatWork(data) {
      let tmpData = [];
      for (let i = 0; i < data.indicators.length; i++) {
        tmpData.push({
          type: data.indicators[i].xValue,
          单: data.indicators[i].yValue
        });
      }
      let chartData = {
        type: 'histogram',
        legendVisible: false,
        data: {
          columns: ['type', '单'],
          rows: tmpData
        },
        settings: {
          yAxisName: ['单']
        }
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
.abno-analysis {
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
      height:100%;
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
