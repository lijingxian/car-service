<template>
  <div class="intention-analysis-ly">
    <div slot="top">
      <show-search-grid @refreshHandle="refreshHandle" :showIntroduce="false" :showViewType="false" ref="search">
      </show-search-grid>
    </div>
    <div class="indicators-search">
      <div class="title">潜客级别：</div>
      <el-checkbox-button v-model="checkAllLevel" @change="handleCheckAllLevel" :indeterminate="isIndeterminate">全选
      </el-checkbox-button>
      <el-checkbox-group v-model="checkedLevel" @change="conditionChange">
        <el-checkbox-button v-for="(condition,index)  in conditionData.levelList" :label="condition.nlevel" :key="index"
          size="mini">{{condition.level}}</el-checkbox-button>
      </el-checkbox-group>
    </div>
    <div class="chart-area">
      <div class="graph">
        <div class="filterSeach">
          <div class="filter-area">
            <el-radio-group @change="indicatorChanged" v-model="indicatorValue" size="mini">
              <el-radio-button label="customerLevel">潜客级别</el-radio-button>
              <el-radio-button label="intentionProductRank">意向车型排行</el-radio-button>
            </el-radio-group>
          </div>
          <div class="type-range">
            <el-radio-group v-model="radioValue" size="mini">
              <el-radio-button label="0">视图</el-radio-button>
              <el-radio-button label="1">列表</el-radio-button>
            </el-radio-group>
          </div>
        </div>
        <div class="content" style="width:40%;float:right;line-height:40px;font-size: 13px;padding:100px;height:70vh;overflow:auto"
          v-show="radioValue==='0'&&indicatorValue==='customerLevel'">
          <div v-for="(list,index) in levelLists" :key="index">
            <span :class="'list'+index">{{list.name}}:{{list.count}}人
              占比{{countTotal!==0?((list.count/countTotal)*100).toFixed(2):list.count}}%</span>
          </div>
        </div>
        <biz-chart :chartData="chartDataOfLevel" :loading="loading" :showSearch="false"
          v-if="radioValue==='0'&&indicatorValue==='customerLevel'">
        </biz-chart>
        <biz-chart :chartData="chartDataOfTOP5" :loading="loading" :showSearch="false"
          v-if="radioValue==='0'&&indicatorValue==='intentionProductRank'">
        </biz-chart>
      <biz-list ref="list" :height="height" :tableData="tableData" style="width: 100%;height:100%" v-show="radioValue==='1'">
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
        <biz-pagination :pagination="pagination" @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange"
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
import ShowSearchGrid from '../components/ShowSearchGrid';
import dateTime from '@/utils/dateTime';
import http from '@/common/http';
import dateUtil from '@/utils/date';
import axios from 'axios';
export default {
  name: 'IntentionAnalysis',
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
      chartDataOfLevel: {},
      chartDataOfTOP5: {},
      isShow: true,
      // indicator
      levelLists: [],
      countTotal: 0,
      conditionData: [{ levelList: [] }],
      checkedLevel: [],
      checkAllLevel: true,
      isIndeterminate: true,
      radioValue: '0',
      indicatorValue: 'customerLevel'
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
    indicatorChanged() {
      if (this.indicatorValue === 'customerLevel') {
        this.getGraphPieData();
      } else {
        this.getGraphHistoData();
      }
      this.getTable();
    },
    init() {
      let params = {
        shopId: window.top.SHOP_ID || ''
      };
      http
        .get('/admin/ecommerce/kpi/condition/sales/customer.jhtml', params)
        .then(data => {
          this.conditionData.levelList = data.levelList;
          this.checkedLevel = this.conditionData.levelList ? this.conditionData.levelList.map(item => { return item.nlevel; }) : [];
          this.getTable();
          this.getGraphPieData();
          this.getGraphHistoData();
        })
        .catch(errData => {
          this.loading = false;
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    getGraphPieData() {
      this.loading = true;
      let params = {
        viewType: this.viewType,
        beginDate: this.beginDate,
        endDate: this.endDate,
        shopId: window.top.SHOP_ID || ''
      };
      http
        .get('/admin/ecommerce/kpi/graph/sales/customer/level/pie.jhtml', params)
        .then(data => {
          this.countTotal = 0;
          this.levelLists = data.data;
          for (const item of data.data) {
            this.countTotal += Number(item.count);
          }
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
    getGraphHistoData() {
      this.loading = true;
      let params = {
        viewType: this.viewType,
        beginDate: this.beginDate,
        endDate: this.endDate,
        levels: this.checkedLevel,
        shopId: window.top.SHOP_ID || ''
      };
      // let paramsArr = [];
      // for (let name in params) {
      //   paramsArr.push(`${name}=${params[name]}`);
      // }
      http
        .post('/admin/ecommerce/kpi/graph/sales/customer/intention/product/topN.jhtml', params)
        .then(data => {
          this.chartDataOfTOP5 = this.dataHistoFormat(data);
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
        indicator: this.indicatorValue,
        viewType: this.viewType,
        beginDate: this.beginDate,
        endDate: this.endDate,
        levels: this.checkedLevel,
        shopId: window.top.SHOP_ID || '',
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
        indicator: this.indicatorValue,
        viewType: this.viewType,
        beginDate: this.beginDate,
        levels: this.checkedLevel,
        endDate: this.endDate,
        shopId: window.top.SHOP_ID || '',
        pageSize: this.pagination.pageSize,
        pageNumber: this.pagination.currentPage
      };
      try {
        let response = await axios.post('/admin/ecommerce/kpi/export/sales/customer/multlist.jhtml', params, { responseType: 'blob' });
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
    handleCheckAllLevel(val) {
      this.checkedLevel = val ? this.conditionData.levelList.map(item => { return item.nlevel; }) : [];
      this.getTable();
      this.getGraphHistoData();
    },
    conditionChange(value) {
      let checkedCount = value.length;
      this.checkAllLevel = checkedCount === this.conditionData.levelList.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.conditionData.levelList.length;
      this.getTable();
      this.getGraphPieData();
      this.getGraphHistoData();
    },
    refreshHandle(val) {
      this.viewType = val.viewType;
      this.beginDate = val.date[0];
      this.endDate = val.date[1];
      this.getGraphPieData();
      this.getGraphHistoData();
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
    dataHistoFormat(data) {
      let tmpData = [];
      for (let i = 0; i < data.indicators.length; i++) {
        tmpData.push({
          车型: data.indicators[i].xValue,
          人数: data.indicators[i].yValue
        });
      }
      let chartData = {
        legendVisible: false,
        type: 'histogram',
        data: {
          columns: ['车型', '人数'],
          rows: tmpData
        },
        settings: {
          interval: 'auto',
          rotate: '45',
          yAxisName: ['人']
        }
      };
      return chartData;
    },
    dataLevelFormat(data) {
      let tmpData = [];
      for (let i = 0; i < data.data.length; i++) {
        tmpData.push({
          type: data.data[i].name,
          value: data.data[i].count
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
            this.levelLists.forEach((element, index) => {
              if (element.name === v.name) {
                document.getElementsByClassName('list' + index)[0].style.color = v.color;
                document.getElementsByClassName('list' + index)[0].style.fontSize = '16px';
              }
            });
          },
          mouseout: v => {
            this.levelLists.forEach((element, index) => {
              document.getElementsByClassName('list' + index)[0].style.color = 'black';
              document.getElementsByClassName('list' + index)[0].style.fontSize = '13px';
            });
          }
        }
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
    BizPagination,
    ShowSearchGrid
  }
};
</script>

<style lang="scss">
.intention-analysis-ly {
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
      .filterSeach {
        display: flex;
        justify-content: space-between;
        margin: 10px 0px;
      }
      .header {
        height: 40px;
        background-color: #f7f7f7;
        font-size: 13px;
        padding: 10px;
        font-weight: 700;
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
