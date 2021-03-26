<template>
  <div class="general-view-analysis-satisfaction">
    <div slot="top">
      <show-search-grid @refreshHandle="refreshHandle" :showIntroduce="false" ref="search"></show-search-grid>
    </div>
    <div class="indicators-search">
      <div class="title">订单类型</div>
      <div style="display:flex;width: calc(100% - 90px);flex-flow:wrap">
        <el-checkbox-button v-model="checkAllOrderType" @change="handleCheckAllOrderType" :indeterminate="isIndeterminate">全部</el-checkbox-button>
        <el-tooltip placement="bottom" v-for="(condition,index)  in conditionData.orderTypeList" :key="index" :disabled="condition.label.length<=10">
          <el-checkbox-group v-model="checkedOrderType" @change="conditionChange">
            <el-checkbox-button :label="condition.value" size="mini">
              {{condition.label.length>10?condition.label.substr(0, 10)+'...':condition.label}}</el-checkbox-button>
          </el-checkbox-group>
          <div slot="content">{{ condition.label }}</div>
        </el-tooltip>
      </div>
    </div>
    <div class="chart-area">
      <div class="graph">
        <div class="filterSeach">
          <div class="filter-area"></div>
          <div class="type-range">
            <el-radio-group @change="indicatorChanged" v-model="radioValue" size="mini">
              <el-radio-button label="0">视图</el-radio-button>
              <el-radio-button label="1">列表</el-radio-button>
            </el-radio-group>
          </div>
        </div>
        <biz-chart :chartData="chartData" :loading="loading" :showSearch="false" v-if="isShow"></biz-chart>
        <biz-list ref="list" :height="height" :tableData="tableData" style="width: 100%" v-if="!isShow">
          <el-table-column prop="plateNumber" label="订单编号"></el-table-column>
          <el-table-column prop="type" label="订单类型"></el-table-column>
          <el-table-column prop="shopName" label="店铺"></el-table-column>
          <el-table-column prop="date" label="评价时间"></el-table-column>
          <el-table-column prop="serviceAttitude" label="服务态度得分"></el-table-column>
          <el-table-column prop="serviceSpeed" label="服务速度得分" min-width="180"></el-table-column>
          <el-table-column prop="professional" label="专业技能得分"></el-table-column>
        </biz-list>
        <biz-pagination :pagination="pagination" @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange" v-if="!isShow"></biz-pagination>
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
import dateTime from '@/utils/dateTime';
import http from '@/common/http';
import ShowSearchGrid from '../components/ShowSearchGrid';
import axios from 'axios';
export default {
  name: 'GeneralViewAnalysis',
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
      checkAllOrderType: true,
      isIndeterminate: true,
      checkedOrderType: [],
      conditionData: [],
      summary: {},
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
        type: 'orderSatisfaction',
        orderTypes: this.checkedOrderType,
        viewType: this.viewType,
        indicators: ['serviceAttitude', 'serviceSpeed', 'professional'],
        beginDate: this.beginDate,
        endDate: this.endDate,
        shopId: window.top.SHOP_ID || ''
      };
      http
        .post('/admin/ecommerce/kpi/order/graph/order/order.jhtml', params)
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
    getTable() {
      let params = {
        type: 'orderSatisfaction',
        orderTypes: this.checkedOrderType,
        indicators: ['serviceAttitude', 'serviceSpeed', 'professional'],
        viewType: this.viewType,
        beginDate: this.beginDate,
        endDate: this.endDate,
        shopId: window.top.SHOP_ID || '',
        pageSize: this.pagination.pageSize,
        pageNumber: this.pagination.currentPage
      };
      http
        .post('/admin/ecommerce/kpi/order/table/order/order.jhtml', params)
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
        type: 'orderSatisfaction',
        orderTypes: this.checkedOrderType,
        indicators: ['serviceAttitude', 'serviceSpeed', 'professional'],
        viewType: this.viewType,
        beginDate: this.beginDate,
        endDate: this.endDate,
        shopId: window.top.SHOP_ID || '',
        pageSize: this.pagination.pageSize,
        pageNumber: this.pagination.currentPage
      };
      try {
        let response = await axios.post('/admin/ecommerce/kpi/order/export/order/order.jhtml', params, {
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
          服务态度: data.indicators[i].y[0].yValue,
          服务速度: data.indicators[i].y[1].yValue,
          专业技能: data.indicators[i].y[2].yValue
        });
      }
      let chartData = {
        type: 'line',
        data: {
          columns: ['日期', '服务态度', '服务速度', '专业技能'],
          rows: tmpData
        },
        settings: {}
      };
      return chartData;
    }
  },
  created() {},
  components: {
    BizChart,
    BizList,
    ShowSearchGrid,
    BizPagination
  }
};
</script>

<style lang="scss">
.general-view-analysis-satisfaction {
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
