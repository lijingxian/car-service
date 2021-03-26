<template>
  <div class="general-view-analysis-order-info">
    <div slot="top">
      <show-search-grid @refreshHandle="refreshHandle" :showIntroduce="false" ref="search"></show-search-grid>
    </div>
    <!-- <div class="indicators-search">
      <div class="title">订单类型：</div>
      <div style="display:flex;width: calc(100% - 90px);">
        <el-checkbox-button v-model="checkAllOrderType" @change="handleCheckAllOrderType" :indeterminate="isIndeterminate">全部
        </el-checkbox-button>
        <el-checkbox-group v-model="checkedOrderType" @change="conditionChange">
          <el-checkbox-button v-for="(condition,index) in conditionData.orderTypeList" :label="condition.value" :key="index"
            size="mini">{{condition.label}}</el-checkbox-button>
        </el-checkbox-group>
      </div>
    </div> -->
    <div class="chart-area">
      <div class="graph">
        <div class="filterSeach">
          <div class="filter-area">
            <biz-filter :filters="filters" @filterDataChange="filterDataChange"></biz-filter>
          </div>
          <div class="type-range">
            <el-radio-group @change="indicatorChanged" v-model="radioValue" size="mini">
              <el-radio-button label="0">视图</el-radio-button>
              <el-radio-button label="1">列表</el-radio-button>
            </el-radio-group>
          </div>
        </div>
        <div class="content" style="width:35%;float:right;line-height:40px;font-size: 13px;margin-top:100px"
          v-if="radioValue==='0'&&(filters[0].value==='safeAmountDistribute'||filters[0].value==='safeNumDistribute')">
          <div v-for="(list,index) in channelLists" :key="index">
            <span :class="'list'+index">
              {{list.lable}}:{{list.value}}{{filters[0].value==='safeAmountDistribute'?'元':'个'}}
              占比{{countTotal!==0?((list.value/countTotal)*100).toFixed(2):list.value}}%
            </span>
          </div>
        </div>
        <biz-chart :chartData="chartData" :loading="loading" :showSearch="false" v-if="isShow"></biz-chart>
        <biz-list ref="list" :height="height" :tableData="tableData" style="width: 100%" v-if="!isShow&&filters[0].value==='order'">
          <el-table-column prop="xValue" label="时间"></el-table-column>
          <el-table-column prop="yValue" label="订单金额" v-if="filters[0].value==='orderAmount'"></el-table-column>
          <el-table-column prop="yValue" label="订单数" v-if="filters[0].value==='order'"></el-table-column>
          <el-table-column prop="yValue" label="进场台次" v-if="filters[0].value==='car'"></el-table-column>
          <el-table-column prop="yYearOnYear" label="同比"></el-table-column>
          <el-table-column label="环比" prop="yMonthOnMonth" min-width="180"></el-table-column>
        </biz-list>
        <biz-chart :chartData="chartDataPie" :loading="loading" :showSearch="false"
          v-if="radioValue==='0'&&(filters[0].value==='safeAmountDistribute'||filters[0].value==='safeNumDistribute')">
        </biz-chart>
        <biz-list ref="list" :height="height" :tableData="tableData" style="width: 100%" v-if="!isShow&&filters[0].value==='safeAmountDistribute'">
          <el-table-column prop="lable" label="一级分类"></el-table-column>
          <el-table-column prop="percent" label="占比"></el-table-column>
          <el-table-column prop="value" label="金额（元）"></el-table-column>
        </biz-list>
        <biz-list ref="list" :height="height" :tableData="tableData" style="width: 100%" v-if="!isShow&&filters[0].value==='safeNumDistribute'">
          <el-table-column prop="lable" label="一级分类"></el-table-column>
          <el-table-column prop="percent" label="占比"></el-table-column>
          <el-table-column prop="value" label="销售量"></el-table-column>
        </biz-list>
        <biz-list ref="list" :height="height" :tableData="tableData" style="width: 100%" v-if="!isShow&&filters[0].value==='safeNumTrend'">
          <el-table-column prop="yValue" label="销售量"></el-table-column>
          <el-table-column prop="xValue" label="时间"></el-table-column>
          <el-table-column prop="yYearOnYear" label="同比"></el-table-column>
          <el-table-column prop="yMonthOnMonth" label="环比"></el-table-column>
        </biz-list>
        <biz-list ref="list" :height="height" :tableData="tableData" style="width: 100%" v-if="!isShow&&filters[0].value==='safeAmountTrend'">
          <el-table-column prop="yValue" label="金额（万元）"></el-table-column>
          <el-table-column prop="xValue" label="时间"></el-table-column>
          <el-table-column prop="yYearOnYear" label="同比"></el-table-column>
          <el-table-column prop="yMonthOnMonth" label="环比"></el-table-column>
        </biz-list>
        <biz-pagination :pagination="pagination" @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange"
          v-if="!isShow"></biz-pagination>
        <div align="right" v-if="radioValue==='1'">
          <el-button type="primary" size="mini" @click="exportStart">导出</el-button>
        </div>
      </div>
    </div>
    <export-file-new ref="exportFile" :percentage="percentage" @clearTimeOut="clearTimeOut" @exportExcle="exportExcle"></export-file-new>
  </div>
</template>

<script>
import BizChart from '@/components/BizChart';
import { BizList, BizPagination } from '@/components/BizTable';
import BizFilter from '@/components/BizTable/BizFilter';
import dateTime from '@/utils/dateTime';
import http from '@/common/http';
import ShowSearchGrid from './components/ShowSearchGrid';
import axios from 'axios';
import { ExportFileNew } from '@/components/BizUpload';
export default {
  name: 'GeneralViewAnalysis',
  data() {
    return {
      taskId: '',
      t: '',
      percentage: 0,
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
      checkAllOrderType: true,
      isIndeterminate: true,
      checkedOrderType: [],
      channelLists: [],
      countTotal: 0,
      conditionData: [
        {
          orderTypeList: []
        }
      ],
      summary: {},
      filters: [
        {
          type: 'single',
          label: '',
          value: 'safeAmountTrend',
          options: [
            { value: 'safeAmountTrend', label: '销售额' },
            { value: 'safeNumTrend', label: '销售数量' },
            { value: 'order', label: '订单数' },
            { value: 'safeAmountDistribute', label: '品类销售额分布' },
            { value: 'safeNumDistribute', label: '品类销售量分布' }
          ]
        }
      ],
      kpiName: ['本期', '同比', '环比'],
      chartData: {},
      isShow: 'false',
      radioValue: '0'
    };
  },
  props: {
    params: {
      type: Object
    }
  },
  methods: {
    clearTimeOut() {
      window.clearTimeout(this.t);
    },
    handleCheckAllOrderType(val) {
      this.checkedOrderType = val
        ? this.conditionData.orderTypeList.map(item => {
          return item.value;
        })
        : [];
      this.getGraphData();
      this.getTable();
    },
    conditionChange(value) {
      let checkedCount = value.length;
      this.checkAllOrderType = checkedCount === this.conditionData.orderTypeList.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.conditionData.orderTypeList.length;
      this.getGraphData();
      this.getTable();
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
      this.conditionData = [];
      this.getConditionData();
    },
    getConditionData() {
      this.conditionData.orderTypeList = [
        { label: '车品订单', value: 'product' },
        { label: '充值', value: 'deposit' },
        { label: '普通服务', value: 'service' },
        { label: '一键救援', value: 'rescue' },
        { label: '预约维修', value: 'repair' },
        { label: '预约保养', value: 'maintain' },
        { label: '预约置换', value: 'replace' },
        { label: '贷款购车', value: 'loan' },
        { label: '预约体验', value: 'ride' },
        { label: '整车订单', value: 'car' },
        { label: '普通订单', value: 'general' },
        { label: '维修保养订单', value: 'repairAndMaintain' },
        { label: '产品订单', value: 'productAndCar' },
        { label: 'sim卡充值订单', value: 'simRecharge' },
        { label: '平台服务', value: 'businessService' },
        { label: '短信服务', value: 'smsService' },
        { label: '活动招募', value: 'recruit' },
        { label: '优惠券订单', value: 'couponOrder' },
        { label: '打赏订单', value: 'rewardOrder' },
        { label: '店铺账户充值订单', value: 'accountRecharge' }
      ];
      this.checkedOrderType = this.conditionData.orderTypeList
        ? this.conditionData.orderTypeList.map(item => {
          return item.value;
        })
        : [];
      this.getGraphData();
      this.getTable();
    },
    indicatorChanged() {
      if (this.radioValue === '0') {
        this.isShow = true;
      } else {
        this.isShow = false;
      }
    },
    getGraphData() {
      this.loading = true;
      let params = {
        type: this.filters[0].value === 'order' ? 'orderSale' : 'productSafeAnalysis',
        orderTypes: this.checkedOrderType,
        viewType: this.viewType,
        indicators: [this.filters[0].value],
        beginDate: this.beginDate,
        endDate: this.endDate,
        shopId: window.top.SHOP_ID || ''
      };
      let url = '/admin/ecommerce/kpi/product/graph/product.jhtml';
      if (this.filters[0].value === 'order') {
        url = '/admin/ecommerce/kpi/order/graph/order/order.jhtml';
      }
      http
        .post(url, params)
        .then(data => {
          if (this.filters[0].value !== 'safeAmountDistribute' && this.filters[0].value !== 'safeNumDistribute') {
            this.chartData = this.dataFormat(data);
          } else {
            this.channelLists = data.indicators;
            this.countTotal = 0;
            for (const item of data.indicators) {
              this.countTotal += Number(item.value);
            }
            this.chartData = this.dataFormatPie(data);
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
      let params = {
        type: this.filters[0].value === 'order' ? 'orderSale' : 'productSafeAnalysis',
        orderTypes: this.checkedOrderType,
        indicators: [this.filters[0].value],
        viewType: this.viewType,
        beginDate: this.beginDate,
        endDate: this.endDate,
        shopId: window.top.SHOP_ID || '',
        pageSize: this.pagination.pageSize,
        pageNumber: this.pagination.currentPage
      };
      let url = '/admin/ecommerce/kpi/Product/table/product.jhtml';
      if (this.filters[0].value === 'order') {
        url = '/admin/ecommerce/kpi/order/table/order/order.jhtml';
      }
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
    exportStart() {
      let params = {
        type: this.filters[0].value === 'order' ? 'orderSale' : 'productSafeAnalysis',
        orderTypes: this.checkedOrderType,
        indicators: [this.filters[0].value],
        viewType: this.viewType,
        beginDate: this.beginDate,
        endDate: this.endDate,
        shopId: window.top.SHOP_ID || '',
        pageSize: this.pagination.pageSize,
        pageNumber: this.pagination.currentPage
      };
      let url = '/admin/ecommerce/kpi/product/export/exportStart.jhtml';
      if (this.filters[0].value === 'order') {
        url = '/admin/ecommerce/kpi/order/export/exportStart.jhtml';
      }
      http
        .post(url, params)
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
      let url = '/admin/ecommerce/kpi/product/export/exportResult.jhtml?taskId=' + this.taskId;
      if (this.filters[0].value === 'order') {
        url = '/admin/ecommerce/kpi/order/export/exportResult.jhtml?taskId=' + this.taskId;
      }
      try {
        let response = await axios.get(url, { responseType: 'blob' });
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
      this.getGraphData();
      this.getTable();
    },
    filterDataChange(val) {
      this.filters = val;
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
    dataFormatPie(data) {
      let tmpData = [];
      for (let i = 0; i < data.indicators.length; i++) {
        tmpData.push({
          分类: data.indicators[i].lable,
          数量: data.indicators[i].value
        });
      }
      let chartData = {
        legendVisible: false,
        type: 'pie',
        data: {
          columns: ['分类', '数量'],
          rows: tmpData
        },
        settings: {
          radius: [60, 150],
          offsetY: '50%'
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
          同比: data.indicators[i].yoyRate,
          环比: data.indicators[i].momRate
        });
      }
      let tem = '万元';
      if (this.filters[0].value === 'safeNumTrend' || this.filters[0].value === 'order') {
        tem = '件';
      }
      let chartData = {
        type: 'histogram',
        data: {
          columns: ['日期', this.kpiName[0], this.kpiName[1], this.kpiName[2]],
          rows: tmpData
        },
        settings: {
          axisSite: { right: ['同比', '环比'] },
          yAxisType: ['normal', 'normal'],
          yAxisName: [tem, '%'],
          showLine: [this.kpiName[1], this.kpiName[2]]
        }
      };
      return chartData;
    }
  },
  created() {},
  components: {
    BizChart,
    BizList,
    BizFilter,
    ShowSearchGrid,
    BizPagination,
    ExportFileNew
  }
};
</script>

<style lang="scss">
.general-view-analysis-order-info {
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
