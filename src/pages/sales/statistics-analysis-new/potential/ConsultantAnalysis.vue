<template>
  <div class="consultant-analysis-ly">
    <div slot="top">
      <show-search-grid @refreshHandle="refreshHandle" :showIntroduce="false" ref="search">
        <div slot="description" class="description-pover">
          <p>标签不控制饼状图，其余突变受控制</p>
        </div>
      </show-search-grid>
    </div>
    <div class="indicators-search">
      <div class="title">服务顾问：</div>
      <div class="hardSeriesGroup" >
        <el-checkbox-button v-model="checkAllConsultant" @change="handleCheckAllConsultant" :indeterminate="isIndeterminate">全选
        </el-checkbox-button>
        <el-checkbox-group v-model="checkedConsultant" @change="conditionChange">
          <el-checkbox-button v-for="(condition,index)  in conditionData.salesmanList" :label="condition.id" :key="index" size="mini">
            {{condition.name}}</el-checkbox-button>
        </el-checkbox-group>
      </div>
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
        <biz-chart :chartData="chartDataOfConsultant" :loading="loading" :showSearch="false"
          v-if="filters[0].value==='salesAdvisor'&&radioValue==='0'"></biz-chart>
        <biz-chart :chartData="chartDataOfGeneral" :loading="loading" :showSearch="false"
          v-if="filters[0].value!=='salesAdvisor'&&filters[0].value!=='customerLevel'&&radioValue==='0'"></biz-chart>
        <biz-chart :chartData="chartDataOfLevel" :loading="loading" :showSearch="false"
          v-if="filters[0].value==='customerLevel'&&radioValue==='0'"></biz-chart>
        <biz-list ref="list" :height="height" :tableData="tableData" style="width: 100%" v-if="radioValue==='1'">
          <el-table-column prop="mobile" label="手机号"></el-table-column>
          <el-table-column prop="name" label="潜客姓名"></el-table-column>
          <el-table-column prop="date" label="新增日期"></el-table-column>
          <el-table-column label="意向车型" prop="carType" min-width="180">
          </el-table-column>
          <el-table-column prop="chanel" label="渠道"></el-table-column>
          <el-table-column prop="advisorName" label="顾问">
          </el-table-column>
          <el-table-column prop="visitCount" label="回访次数"></el-table-column>
          <el-table-column prop="testDriveCnt" label="试驾次数"></el-table-column>
          <el-table-column prop="latestVisitTime" label="最新回访时间"></el-table-column>
        </biz-list>
        <biz-pagination :pagination="pagination" @size-change="handleSizeChange" @current-change="handleCurrentChange"
          v-if="radioValue==='1'"></biz-pagination>
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
import ShowSearchGrid from '../components/ShowSearchGrid';
import BizFilter from '@/components/BizTable/BizFilter';
import dateTime from '@/utils/dateTime';
import http from '@/common/http';
import dateUtil from '@/utils/date';
import axios from 'axios';
export default {
  name: 'ConsultantAnalysis',
  data() {
    return {
      loading: true,
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
      kpiName: ['本期', '同比', '环比'],
      chartDataOfConsultant: {},
      chartDataOfGeneral: {},
      chartDataOfLevel: {},
      filters: [
        {
          type: 'single',
          value: 'salesAdvisor',
          label: ' ',
          options: [
            { value: 'salesAdvisor', label: '顾问分布' },
            { value: 'customerIns', label: '新增潜客数' },
            { value: 'customerCnt', label: '累计潜客数' },
            { value: 'validCustomerIns', label: '新增有效潜客' },
            { value: 'customerDefeatIns', label: '新增战败数' },
            { value: 'customerDefeatCnt', label: '累计战败数' },
            { value: 'customerSignIns', label: '新增签约数' },
            { value: 'customerSignCnt', label: '累计签约数' },
            { value: 'customerVisitIns', label: '新增回访数' },
            { value: 'customerVisitCnt', label: '累计回访数' },
            { value: 'customerLevel', label: '顾问潜客级别' }
          ]
        }
      ],
      isShow: 'false',

      // indicator
      conditionData: [],
      checkedConsultant: [],
      checkAllConsultant: true,
      isIndeterminate: true,
      radioValue: '0',
      indicatorValue: '0'
    };
  },
  props: {
    params: {
      type: Object
    }
  },
  methods: {
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
    },
    init() {
      let params = {
        shopId: window.top.SHOP_ID || ''
      };
      http
        .get('/admin/ecommerce/kpi/condition/sales/customer.jhtml', params)
        .then(data => {
          this.conditionData = data;
          this.checkedConsultant = this.conditionData.salesmanList ? this.conditionData.salesmanList.map(item => { return item.id; }) : [];
          this.getTable();
          this.getGraphConsultantData();
          this.getGraphGeneralData();
          this.getGraphLevelData();
        })
        .catch(errData => {
          this.loading = false;
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    getGraphConsultantData() {
      this.loading = true;
      let params = {
        adminIds: this.checkedConsultant.join('&adminIds='),
        viewType: this.viewType,
        beginDate: this.beginDate,
        endDate: this.endDate,
        shopId: window.top.SHOP_ID || ''
      };
      let paramsArr = [];
      for (let name in params) {
        paramsArr.push(`${name}=${params[name]}`);
      }
      http
        .get('/admin/ecommerce/kpi/graph/sales/customer/salesAdvisor.jhtml' + '?' + paramsArr.join('&'))
        .then(data => {
          this.chartDataOfConsultant = this.dataConsultantFormat(data);
        })
        .catch(errData => {
          this.loading = false;
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    getGraphGeneralData() {
      this.loading = true;
      let params = {
        adminIds: this.checkedConsultant.join('&adminIds='),
        viewType: this.viewType,
        indicators: this.filters[0].value,
        beginDate: this.beginDate,
        endDate: this.endDate,
        shopId: window.top.SHOP_ID || ''
      };
      let paramsArr = [];
      for (let name in params) {
        paramsArr.push(`${name}=${params[name]}`);
      }
      http
        .get('/admin/ecommerce/kpi/graph/sales/customer/v2.jhtml' + '?' + paramsArr.join('&'))
        .then(data => {
          this.chartDataOfGeneral = this.dataGeneralFormat(data);
        })
        .catch(errData => {
          this.loading = false;
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    getGraphLevelData() {
      this.loading = true;
      let params = {
        adminIds: this.checkedConsultant,
        viewType: this.viewType,
        beginDate: this.beginDate,
        endDate: this.endDate,
        shopId: window.top.SHOP_ID || ''
      };
      // let paramsArr = [];
      // for (let name in params) {
      //   paramsArr.push(`${name}=${params[name]}`);
      // }
      http
        .post('admin/ecommerce/kpi/graph/sales/customer/level.jhtml', params)
        .then(data => {
          this.chartDataOfLevel = this.dataLevelFormat(data);
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
        indicator: this.filters[0].value,
        viewType: this.viewType,
        beginDate: this.beginDate,
        endDate: this.endDate,
        shopId: window.top.SHOP_ID || '',
        adminIds: this.checkedConsultant,
        pageSize: this.pagination.pageSize,
        pageNumber: this.pagination.currentPage
      };
      // let paramsArr = [];
      // for (let name in params) {
      //   paramsArr.push(`${name}=${params[name]}`);
      // }
      http
        .post('/admin/ecommerce/kpi/table/sales/customer/multlist.jhtml', params)
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
        indicator: this.filters[0].value,
        viewType: this.viewType,
        beginDate: this.beginDate,
        endDate: this.endDate,
        shopId: window.top.SHOP_ID || '',
        adminIds: this.checkedConsultant,
        pageSize: this.pagination.pageSize,
        pageNumber: this.pagination.currentPage
      };
      try {
        let response = await axios.post('/admin/ecommerce/kpi/export/customer/list.jhtml', params, { responseType: 'blob' });
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
    handleCheckAllConsultant(val) {
      this.checkedConsultant = val ? this.conditionData.salesmanList.map(item => { return item.id; }) : [];
      // this.getTable();
      // this.getGraphConsultantData();
      // this.getGraphGeneralData();
      this.getGraphLevelData();
    },
    conditionChange(value) {
      let checkedCount = value.length;
      this.checkAllConsultant = checkedCount === this.conditionData.salesmanList.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.conditionData.salesmanList.length;
      // this.getTable();
      // this.getGraphConsultantData();
      // this.getGraphGeneralData();
      this.getGraphLevelData();
    },
    refreshHandle(val) {
      this.viewType = val.viewType;
      this.beginDate = val.date[0];
      this.endDate = val.date[1];
      this.getGraphConsultantData();
      this.getGraphGeneralData();
      this.getGraphLevelData();
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
    filterDataChange(val) {
      this.filters = val;
      if (this.filters[0].value === 'salesAdvisor') {
        this.getGraphConsultantData();
      } else if (this.filters[0].value === 'customerLevel') {
        this.getGraphLevelData();
      } else {
        this.getGraphGeneralData();
      }
      this.getTable();
    },
    dataConsultantFormat(data) {
      let tmpData = [];
      for (let i = 0; i < data.indicators.length; i++) {
        tmpData.push({
          顾问: data.indicators[i].xValue,
          人数: data.indicators[i].yValue
        });
      }
      let chartData = {
        legendVisible: false,
        type: 'histogram',
        data: {
          columns: ['顾问', '人数'],
          rows: tmpData
        },
        settings: {}
      };
      return chartData;
    },
    dataGeneralFormat(data) {
      let tmpData = [];
      for (let i = 0; i < data.indicators.length; i++) {
        tmpData.push({
          日期: data.indicators[i].xValue,
          本期: data.indicators[i].y[0].yValue,
          同比: data.indicators[i].y[0].yoyRate,
          环比: data.indicators[i].y[0].momRate
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
    dataLevelFormat(data) {
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
  components: {
    BizChart,
    BizList,
    BizFilter,
    BizPagination,
    ShowSearchGrid
  }
};
</script>

<style lang="scss">
.consultant-analysis-ly {
  height: 100%;
  overflow: auto;
  display: flex;
  flex-direction: column;
  align-content: space-between;
  margin: 20px 0px 20px 20px;
  padding-bottom: 20px;
  padding-right: 10px;
  min-width: 560px;
  .indicators-search {
    display: -webkit-box;
    .hardSeriesGroup {
      display: flex;
      width: calc(100% - 90px);
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
      padding: 20px 10px;
      font-size: 12px;
    }
  }
  .chart-area {
    margin-top: 10px;
    .graph {
      width: 100%;
      box-shadow: 0 2px 3px rgba(0, 0, 0, 0.1);
      margin-bottom: 20px;
      margin-left: 1px;
      height: 100%;
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
