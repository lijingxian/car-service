<template>
  <div class="defeat-analysis-ly">
    <div slot="top">
      <show-search-grid @refreshHandle="refreshHandle" :showIntroduce="false" ref="search">
        <div slot="description" class="description-pover">
          <p>新增潜客：统计期内新增的潜客数量（不论潜客意向级别为多少/是否为空)</p>
          <p>新增有效潜客：统计期内，新增潜客中，潜客级别为O,H,A,B,C,D的潜客数量</p>
          <p>潜客总数：截止统计期，系统内所有潜客数的数量</p>
          <p>新增试驾数：统计期内新增的试驾行为的潜客数量</p>
          <p>新增试驾率：统计期内新增试驾行为的潜客比率，新增试驾数/新增潜客*100%，比率可能会>100%</p>
        </div>
      </show-search-grid>
    </div>
    <div class="chart-area">
      <div class="graph">
        <div class="filterSeach">
          <div class="filter-area">
            <biz-filter :filters="filters" @filterDataChange="filterDataChange"></biz-filter>
          </div>
          <div class="type-range">
            <el-radio-group v-model="radioValue" size="mini">
              <el-radio-button label="0">视图</el-radio-button>
              <el-radio-button label="1">列表</el-radio-button>
            </el-radio-group>
          </div>
        </div>
        <biz-chart :chartData="chartDataOfDefeat" :loading="loading" :showSearch="false"
          v-if="filters[0].value!=='defeatProductRank'&&filters[0].value!=='defeatReason'&&radioValue==='0'"></biz-chart>
        <biz-chart :chartData="chartDataOfTOP5" :loading="loading" :showSearch="false"
          v-if="filters[0].value==='defeatProductRank'&&radioValue==='0'"></biz-chart>
        <div class="content" style="width:40%;float:right;line-height:40px;font-size: 13px;padding:100px;height:70vh;overflow:auto" v-if="filters[0].value==='defeatReason'&&radioValue==='0'">
          <div v-for="(list,index) in reasonList" :key="index">
            <span :class="'list'+index">{{list.name}}:{{list.count}}人
              占比{{countTotal!==0?((list.count/countTotal)*100).toFixed(2):list.count}}%</span>
          </div>
        </div>
        <biz-chart :chartData="chartDataOfReason" :loading="loading" :showSearch="false"
          v-if="filters[0].value==='defeatReason'&&radioValue==='0'"></biz-chart>
        <biz-list ref="list" :height="height" :tableData="tableData" style="width: 100%" v-if="radioValue==='1'">
          <el-table-column prop="mobile" label="手机号"></el-table-column>
          <el-table-column prop="name" label="潜客姓名"></el-table-column>
          <el-table-column prop="date" label="新增日期"></el-table-column>
          <el-table-column prop="defeatDate" label="战败日期"></el-table-column>
          <el-table-column label="战败车型" prop="carType" min-width="180">
          </el-table-column>
          <el-table-column prop="chanel" label="渠道"></el-table-column>
          <el-table-column prop="advisorName" label="顾问">
          </el-table-column>
          <el-table-column prop="visitCount" label="回访次数"></el-table-column>
          <el-table-column prop="testDriveCnt" label="试驾次数"></el-table-column>
          <el-table-column prop="latestVisitTime" label="最新回访时间"></el-table-column>
        </biz-list>
        <biz-pagination :pagination="pagination" @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange"
          v-if="radioValue==='1'"></biz-pagination>
        <div align="right" v-if="radioValue==='1'">
          <el-button type="primary" size="mini" @click="exportStart">导出</el-button>
        </div>
        <export-file-new ref="exportFile" :percentage="percentage" @clearTimeOut="clearTimeOut" @exportExcle="exportExcle"></export-file-new>
      </div>
    </div>
  </div>
</template>

<script>
import BizChart from '@/components/BizChart';
import { BizList, BizPagination } from '@/components/BizTable';
import dateTime from '@/utils/dateTime';
import http from '@/common/http';
import BizFilter from '@/components/BizTable/BizFilter';
import ShowSearchGrid from '../components/ShowSearchGrid';
import axios from 'axios';
import { ExportFileNew } from '@/components/BizUpload';
export default {
  name: 'DefeatAnalysis',
  data() {
    return {
      loading: true,
      height: '500',
      beginDate: dateTime.getPreThreeMonthDay(),
      endDate: dateTime.today(),
      viewType: 'month',
      summary: {},
      countTotal: 0,
      pagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        total: 0
      },
      taskId: '',
      t: '',
      percentage: 0,
      tableData: [],
      showRecommend: false,
      kpiName: ['本期', '同比', '环比'],
      chartDataOfDefeat: {},
      chartDataOfTOP5: {},
      reasonList: [],
      chartDataOfReason: {},
      filters: [
        {
          type: 'single',
          value: 'customerDefeatIns',
          label: ' ',
          options: [
            { value: 'customerDefeatIns', label: '新增战败数' },
            { value: 'customerDefeatCnt', label: '累计战败数' },
            { value: 'customerDefeatRate', label: '新增战败率' },
            { value: 'customerDefeatCntRate', label: '累计战败率' },
            { value: 'defeatProductRank', label: '战败车型排行' },
            { value: 'defeatReason', label: '战败原因' }
          ]
        }
      ],
      isShow: 'false',
      radioValue: '0',
      indicatorValue: '0'
    };
  },
  props: {
    params: {
      type: Object
    }
  },
  beforeDestroy() {
    if (this.t) {
      // 如果定时器还在运行 或者直接关闭，不用判断
      window.clearTimeout(this.t); // 关闭
    }
  },
  methods: {
    clearTimeOut() {
      window.clearTimeout(this.t);
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
      this.init();
      this.getGraphDefeatData();
      this.getGraphTOP5Data();
      this.getGraphReasonData();
      this.getTable();
    },
    init() {
      this.loading = true;
      let params = {
        beginDate: this.beginDate,
        endDate: this.endDate,
        summaryType: '2'
      };
      http
        .get('admin/ecommerce/kpi/summary/sales/customer/v2.jhtml', params)
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
    getGraphDefeatData() {
      this.loading = true;
      let params = {
        viewType: this.viewType,
        indicator: this.filters[0].value,
        beginDate: this.beginDate,
        endDate: this.endDate,
        shopId: window.top.SHOP_ID || ''
      };
      http
        .get('admin/ecommerce/kpi/graph/sales/customer/defeat.jhtml', params)
        .then(data => {
          this.chartDataOfDefeat = this.dataDefeatFormat(data);
        })
        .catch(errData => {
          this.loading = false;
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    getGraphTOP5Data() {
      this.loading = true;
      let params = {
        viewType: this.viewType,
        beginDate: this.beginDate,
        endDate: this.endDate,
        shopId: window.top.SHOP_ID || ''
      };
      http
        .post('admin/ecommerce/kpi/graph/sales/customer/defeat/product/topN.jhtml', params)
        .then(data => {
          this.chartDataOfTOP5 = this.dataTOP5Format(data);
        })
        .catch(errData => {
          this.loading = false;
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    getGraphReasonData() {
      this.loading = true;
      let params = {
        viewType: this.viewType,
        indicator: this.filters[0].value,
        beginDate: this.beginDate,
        endDate: this.endDate,
        shopId: window.top.SHOP_ID || ''
      };
      http
        .get('admin/ecommerce/kpi/graph/sales/customer/defeat/reason.jhtml', params)
        .then(data => {
          this.countTotal = 0;
          this.reasonList = data.dataList;
          for (const item of data.dataList) {
            this.countTotal += Number(item.count);
          }
          this.chartDataOfReason = this.dataReasonFormat(data);
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
      let params = {
        viewType: this.viewType,
        indicator: this.filters[0].value,
        beginDate: this.beginDate,
        endDate: this.endDate,
        shopId: window.top.SHOP_ID || '',
        pageSize: this.pagination.pageSize,
        pageNumber: this.pagination.currentPage
      };
      http
        .get('admin/ecommerce/kpi/table/sales/customer/defeat.jhtml', params)
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
    exportStart() {
      let params = {
        viewType: this.viewType,
        indicator: this.filters[0].value,
        beginDate: this.beginDate,
        endDate: this.endDate,
        shopId: window.top.SHOP_ID || '',
        pageSize: this.pagination.pageSize,
        pageNumber: this.pagination.currentPage
      };
      http
        .post('/admin/ecommerce/kpi/export/sales/customer/defeat/exportStart.jhtml', params)
        .then(data => {
          this.taskId = data.data.taskId;
          this.getProcess(data.data.taskId);
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
      try {
        let response = await axios.get('/admin/ecommerce/kpi/export/sales/customer/defeat/exportResult.jhtml?taskId=' + this.taskId, { responseType: 'blob' });
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
    getProcess(taskId) {
      let url = '/rest/v1/asynctask/getTaskInfo.jhtml';
      http
        .get(url, { taskId: this.taskId })
        .then(data => {
          if (!data.data.rate) {
            this.percentage = 0;
          }
          if (data.data.rate) {
            this.percentage = Number(data.data.rate);
          }
          if (data.data.status === '1' || data.data.status === '2' || data.data.status === '0') {
            this.$refs.exportFile.uploadingVisible = true;
            if (data.data && data.data.rate && data.data.rate === '100') {
              this.clearTimeOut();
              this.$refs.exportFile.title = '导出完成';
            } else if ((data.data && data.data.rate && data.data.rate !== '100') || !data.data.rate) {
              if (this.t) {
                this.clearTimeOut();
              }
              this.t = setTimeout(this.getProcess, 2000);
            }
          } else {
            this.$message.warning('导出失败');
          }
        })
        .catch(errData => {
          console.log(errData);
          console.log('code错误');
        });
    },
    refreshHandle(val) {
      this.viewType = val.viewType;
      this.beginDate = val.date[0];
      this.endDate = val.date[1];
      this.getGraphDefeatData();
      this.getGraphTOP5Data();
      this.getGraphReasonData();
      this.getTable();
    },
    filterDataChange(val) {
      this.filters = val;
      if (this.filters[0].value === 'defeatProductRank') {
        this.getGraphTOP5Data();
      } else if (this.filters[0].value === 'defeatReason') {
        this.getGraphReasonData();
      } else {
        this.getGraphDefeatData();
      }
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
    dataDefeatFormat(data) {
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
    dataTOP5Format(data) {
      let tmpData = [];
      for (let i = 0; i < data.indicators.length; i++) {
        tmpData.push({
          级别: data.indicators[i].xValue,
          人数: data.indicators[i].yValue
        });
      }
      let chartData = {
        legendVisible: false,
        type: 'histogram',
        data: {
          columns: ['级别', '人数'],
          rows: tmpData
        },
        settings: {}
      };
      return chartData;
    },
    dataReasonFormat(data) {
      let tmpData = [];
      for (let i = 0; i < data.dataList.length; i++) {
        tmpData.push({
          type: data.dataList[i].name,
          value: data.dataList[i].count
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
        },
        events: {
          mouseover: v => {
            this.reasonList.forEach((element, index) => {
              if (element.name === v.name) {
                document.getElementsByClassName('list' + index)[0].style.color = v.color;
                document.getElementsByClassName('list' + index)[0].style.fontSize = '16px';
              }
            });
          },
          mouseout: v => {
            this.reasonList.forEach((element, index) => {
              document.getElementsByClassName('list' + index)[0].style.color = 'black';
              document.getElementsByClassName('list' + index)[0].style.fontSize = '13px';
            });
          }
        }
      };
      return chartData;
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
    ShowSearchGrid,
    BizPagination,
    BizFilter,
    ExportFileNew
  }
};
</script>

<style lang="scss">
.defeat-analysis-ly {
  height: 100%;
  overflow: auto;
  display: flex;
  flex-direction: column;
  align-content: space-between;
  margin: 20px 0px 20px 20px;
  padding-bottom: 20px;
  padding-right: 10px;
  min-width: 560px;
  .total {
    display: flex;
    margin-top: 20px;
    .column1 {
      border: 1px solid #d9d9d9;
      padding: 20px;
      width: 50%;
      line-height: 40px;
      margin-right: 40px;
      .table-cell {
        font-size: 15px;
      }
      .color-primary {
        font-size: 13px;
      }
    }
    .column2 {
      border: 1px solid #d9d9d9;
      padding: 20px;
      width: 50%;
      line-height: 40px;
      .table-cell {
        font-size: 15px;
      }
      .color-primary {
        font-size: 13px;
      }
    }
  }
  .chart-area {
    margin-top: 10px;
    .graph {
      width: 100%;
      box-shadow: 0 2px 3px rgba(0, 0, 0, 0.1);
      margin-bottom: 20px;
      margin-left: 1px;
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
