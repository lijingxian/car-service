<template>
  <div class="general-view-analysis-yygk">
    <div slot="top">
      <show-search-grid @refreshHandle="refreshHandle" :showIntroduce="false" ref="search">
      </show-search-grid>
    </div>
    <!-- <div class="indicators-search">
      <div class="title">一级分类：</div>
      <el-checkbox-button v-model="checkAllClass" @change="handleCheckAllClass" :indeterminate="isIndeterminate">全部
      </el-checkbox-button>
      <el-checkbox-group v-model="checkedClass" @change="classChange">
        <el-checkbox-button v-for="(item,index) in classList" :label="item.id.toString()" :key="index" size="mini">{{item.name}}
        </el-checkbox-button>
      </el-checkbox-group>
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
        <div class="content"
          style="width:40%;float:right;line-height:40px;font-size: 13px;padding:100px;height:70vh;overflow:auto"
          v-if="radioValue==='0'&&this.filters[0].value==='afterSaleReason'">
          <div v-for="(list,index) in channelLists" :key="index">
            <span :class="'list'+index">
              {{list.lable}}:{{list.value}}
              占比{{countTotal!==0?((list.value/countTotal)*100).toFixed(2):list.value}}%
            </span>
          </div>
        </div>
        <div class="content"
          style="width:40%;float:right;line-height:40px;font-size: 13px;padding:100px;height:70vh;overflow:auto"
          v-if="radioValue==='0'&&this.filters[0].value==='deliveryCorp'">
          <div v-for="(list,index) in channelLists" :key="index">
            <span :class="'list'+index">
              {{list.xValue}}:{{list.yValue}}
              占比{{countTotal!==0?((list.yValue/countTotal)*100).toFixed(2):list.yValue}}%
            </span>
          </div>
        </div>
        <biz-chart :chartData="chartData" :loading="loading" :showSearch="false" v-if="radioValue==='0'"></biz-chart>
        <biz-list ref="list" :height="height" :tableData="tableData" style="width: 100%" v-if="!isShow&&(this.filters[0].value === 'afterSafeAmountTrend'||this.filters[0].value === 'afterSafeNumTrend'||this.filters[0].value === 'afterSafeRateTrend')">
          <el-table-column prop="sn" label="售后编号"></el-table-column>
          <el-table-column prop="productName" label="售后商品"></el-table-column>
          <el-table-column prop="amount" label="售后金额"></el-table-column>
          <el-table-column prop="reason" label="售后原因"></el-table-column>
          <el-table-column prop="createDate" label="创建时间"></el-table-column>
        </biz-list>
         <biz-list ref="list" :height="height" :tableData="tableData" style="width: 100%" v-if="!isShow&&(this.filters[0].value === 'afterSaleReason')">
          <el-table-column prop="lable" label="售后原因"></el-table-column>
          <el-table-column prop="value" label="申请次数"></el-table-column>
          <el-table-column prop="percent" label="占比"></el-table-column>
        </biz-list>
        <biz-list ref="list" :height="height" :tableData="tableData" style="width: 100%" v-if="!isShow&&(this.filters[0].value === 'serviceAttitude,serviceSpeed,professional')">
          <el-table-column prop="plateNumber" label="订单编号"></el-table-column>
          <el-table-column prop="type" label="订单类型"></el-table-column>
          <el-table-column prop="shopName" label="店铺"></el-table-column>
          <el-table-column prop="date" label="评价时间"></el-table-column>
          <el-table-column prop="serviceAttitude" label="服务态度得分"></el-table-column>
          <el-table-column prop="serviceSpeed" label="服务速度得分" min-width="180"></el-table-column>
          <el-table-column prop="professional" label="专业技能得分"></el-table-column>
        </biz-list>
        <biz-list ref="list" :height="height" :tableData="tableData" style="width: 100%" v-if="!isShow&&(this.filters[0].value === 'deliveryNum'||this.filters[0].value === 'deliveryAmount')">
          <el-table-column prop="xValue" label="时间"></el-table-column>
          <el-table-column prop="yValue" label="发货量" v-if="this.filters[0].value === 'deliveryNum'"></el-table-column>
          <el-table-column prop="yValue" label="物流费用" v-if="this.filters[0].value === 'deliveryAmount'"></el-table-column>
          <el-table-column prop="yYearOnYear" label="同比"></el-table-column>
          <el-table-column prop="yMonthOnMonth" label="环比"></el-table-column>
        </biz-list>
        <biz-list ref="list" :height="height" :tableData="tableData" style="width: 100%" v-if="!isShow&&(this.filters[0].value === 'deliveryCorp')">
          <el-table-column prop="xValue" label="物流公司"></el-table-column>
          <el-table-column prop="yValue" label="单数"></el-table-column>
          <el-table-column prop="percent" label="占比"></el-table-column>
        </biz-list>
        <biz-pagination :pagination="pagination" @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange"
          v-if="!isShow"></biz-pagination>
        <div align="right" v-if="radioValue==='1'">
          <el-button type="primary" size="mini" @click="exportStart">导出</el-button>
        </div>
      </div>
    </div>
    <export-file-new ref="exportFile" :stepkey="stepkey" :total="total" :count="count" :percentage="percentage" @clearTimeOut="clearTimeOut" @exportExcle="exportExcle"></export-file-new>
  </div>
</template>

<script>
import BizChart from '@/components/BizChart';
import { BizList, BizPagination } from '@/components/BizTable';
import BizFilter from '@/components/BizTable/BizFilter';
import dateTime from '@/utils/dateTime';
import http from '@/common/http';
import ShowSearchGrid from './components/ShowSearchGrid';
import dateUtil from '@/utils/date';
import axios from 'axios';
import { ExportFileNew } from '@/components/BizUpload';
export default {
  name: 'GeneralViewAnalysis',
  data() {
    return {
      loading: true,
      height: '500',
      beginDate: dateTime.getPreThreeMonthDay(),
      endDate: dateTime.today(),
      viewType: 'month',
      total: 0,
      count: 0,
      typeModel: '0',
      t: '',
      percentage: 0,
      stepkey: '',
      pagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        total: 0
      },
      classList: [],
      checkAllClass: true,
      checkedClass: [],
      isIndeterminate: true,
      tableData: [],
      showRecommend: false,
      channelLists: [],
      countTotal: '',
      summary: {},
      filters: [
        {
          type: 'single',
          label: '',
          value: 'serviceAttitude,serviceSpeed,professional',
          options: [
            { value: 'serviceAttitude,serviceSpeed,professional', label: '满意度' },
            { value: 'afterSafeAmountTrend', label: '售后金额' },
            { value: 'afterSafeNumTrend', label: '售后次数' },
            { value: 'afterSafeRateTrend', label: '售后率' },
            { value: 'afterSaleReason', label: '售后原因' },
            { value: 'deliveryNum', label: '发货量' },
            { value: 'deliveryAmount', label: '物流费用' },
            { value: 'deliveryCorp', label: '物流公司分布' }
          ]
        }
      ],
      kpiName: ['本期', '同比', '环比'],
      chartData: {},
      chartDataPie: {},
      isShow: 'false',
      radioValue: '0',
      taskId: ''
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
      this.getClassList();
    },
    handleCheckAllClass(val) {
      this.checkedClass = val
        ? this.classList.map(item => {
          return item.id.toString();
        })
        : [];
      this.query();
    },
    classChange(value) {
      let checkedCount = value.length;
      this.checkAllClass = checkedCount === this.classList.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.classList.length;
      this.query();
    },
    getClassList() {
      this.loading = true;
      let params = {};
      http
        .get('/admin/json/ShopProduct_category/list.jhtml?', params)
        .then(data => {
          this.classList = data.ProductCategoryManage;
          if (this.params.checkedClass) {
            this.checkedClass = this.params.checkedClass;
          } else {
            this.checkedClass = this.classList
              ? this.classList.map(item => {
                return item.id.toString();
              })
              : [];
          }
          this.getGraphData();
          this.getTable();
        })
        .catch(errData => {
          this.loading = false;
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
        });
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
      let type = 'productServiceAnalysis';
      let url = '/admin/ecommerce/kpi/product/graph/product.jhtml';
      let indicators = [this.filters[0].value];
      if (this.filters[0].value === 'afterSaleReason') {
        type = 'afterSaleReason';
        url = '/admin/ecommerce/kpi/order/graph/order/order.jhtml';
      } else if (this.filters[0].value === 'deliveryNum' || this.filters[0].value === 'deliveryAmount') {
        type = 'delivery';
        url = '/admin/ecommerce/kpi/order/graph/order/order.jhtml';
      } else if (this.filters[0].value === 'deliveryCorp') {
        type = 'deliveryCorp';
        url = '/admin/ecommerce/kpi/order/graph/order/order.jhtml';
      } else if (this.filters[0].value === 'serviceAttitude,serviceSpeed,professional') {
        type = 'orderSatisfaction';
        url = '/admin/ecommerce/kpi/order/graph/order/order.jhtml';
        indicators = ['serviceAttitude', 'serviceSpeed', 'professional'];
      }
      let params = {
        viewType: this.viewType,
        indicators: indicators,
        beginDate: this.beginDate,
        endDate: this.endDate,
        shopId: window.top.SHOP_ID || '',
        type: type,
        productCateGorys: this.checkedClass
      };
      http
        .post(url, params)
        .then(data => {
          if (this.filters[0].value === 'afterSafeRateTrend') {
            this.chartData = this.dataFormatLine(data);
          } else if (this.filters[0].value === 'afterSaleReason' || this.filters[0].value === 'deliveryCorp') {
            this.chartData = this.dataFormatPie(data);
            this.countTotal = 0;
            this.channelLists = data.indicators || data.dataList;
            for (const item of data.indicators) {
              this.countTotal += Number(item.value || item.yValue);
            }
          } else if (this.filters[0].value === 'serviceAttitude,serviceSpeed,professional') {
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
      let type = 'productServiceAnalysis';
      let url = '/admin/ecommerce/kpi/Product/table/product.jhtml';
      let indicators = [this.filters[0].value];
      if (this.filters[0].value === 'afterSaleReason') {
        type = 'afterSaleReason';
        url = '/admin/ecommerce/kpi/order/table/order/order.jhtml';
      } else if (this.filters[0].value === 'deliveryNum' || this.filters[0].value === 'deliveryAmount') {
        type = 'delivery';
        url = '/admin/ecommerce/kpi/order/table/order/order.jhtml';
      } else if (this.filters[0].value === 'deliveryCorp') {
        type = 'deliveryCorp';
        url = '/admin/ecommerce/kpi/order/table/order/order.jhtml';
      } else if (this.filters[0].value === 'serviceAttitude,serviceSpeed,professional') {
        type = 'orderSatisfaction';
        url = '/admin/ecommerce/kpi/order/table/order/order.jhtml';
        indicators = ['serviceAttitude', 'serviceSpeed', 'professional'];
      }
      let params = {
        indicators: indicators,
        type: type,
        productCateGorys: this.checkedClass,
        viewType: this.viewType,
        beginDate: this.beginDate,
        endDate: this.endDate,
        shopId: window.top.SHOP_ID || '',
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
    exportStart() {
      let type = 'productServiceAnalysis';
      let indicators = [this.filters[0].value];
      if (this.filters[0].value === 'afterSaleReason') {
        type = 'afterSaleReason';
      } else if (this.filters[0].value === 'deliveryNum' || this.filters[0].value === 'deliveryAmount') {
        type = 'delivery';
      } else if (this.filters[0].value === 'deliveryCorp') {
        type = 'deliveryCorp';
      } else if (this.filters[0].value === 'serviceAttitude,serviceSpeed,professional') {
        type = 'orderSatisfaction';
      }
      let params = {
        indicators: indicators,
        type: type,
        productCateGorys: this.checkedClass,
        viewType: this.viewType,
        beginDate: this.beginDate,
        endDate: this.endDate,
        shopId: window.top.SHOP_ID || '',
        pageSize: this.pagination.pageSize,
        pageNumber: this.pagination.currentPage
      };
      http
        .post('/admin/ecommerce/kpi/order/export/exportStart.jhtml', params)
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
      // let type = 'productServiceAnalysis';
      let url = '/admin/ecommerce/kpi/product/export/exportResult.jhtml?taskId=' + this.taskId;
      // let indicators = [this.filters[0].value];
      if (this.filters[0].value === 'afterSaleReason') {
        // type = 'afterSaleReason';
        url = '/admin/ecommerce/kpi/order/export/exportResult.jhtml?taskId=' + this.taskId;
      } else if (this.filters[0].value === 'deliveryNum' || this.filters[0].value === 'deliveryAmount') {
        // type = 'delivery';
        url = '/admin/ecommerce/kpi/order/export/exportResult.jhtml?taskId=' + this.taskId;
      } else if (this.filters[0].value === 'deliveryCorp') {
        // type = 'deliveryCorp';
        url = '/admin/ecommerce/kpi/order/export/exportResult.jhtml?taskId=' + this.taskId;
      } else if (this.filters[0].value === 'serviceAttitude,serviceSpeed,professional') {
        // type = 'orderSatisfaction';
        url = '/admin/ecommerce/kpi/order/export/exportResult.jhtml?taskId=' + this.taskId;
        // indicators = ['serviceAttitude', 'serviceSpeed', 'professional'];
      }
      // let params = {
      //   taskId: this.taskId
      // };
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
    dataFormatSatisfaction(data) {
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
    },
    dataFormat(data) {
      let tmpData = [];
      for (let i = 0; i < (data.indicators.length > 10 ? 10 : data.indicators.length); i++) {
        tmpData.push({
          日期: data.indicators[i].xValue,
          本期: data.indicators[i].yValue,
          同比: data.indicators[i].yoyRate,
          环比: data.indicators[i].momRate
        });
      }
      let yName = '元';
      if (this.filters[0].value === 'afterSafeAmountTrend') {
        yName = '元';
      } else if (this.filters[0].value === 'afterSafeNumTrend' || this.filters[0].value === 'deliveryNum') {
        yName = '次';
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
          yAxisName: [yName, '%'],
          showLine: [this.kpiName[1], this.kpiName[2]]
        }
      };
      return chartData;
    },
    dataFormatLine(data) {
      let tmpData = [];
      for (let i = 0; i < data.indicators.length; i++) {
        tmpData.push({
          分类: data.indicators[i].xValue,
          占比: data.indicators[i].yValue
        });
      }
      let chartData = {
        legendVisible: false,
        type: 'line',
        data: {
          columns: ['分类', '占比'],
          rows: tmpData
        },
        settings: {
          yAxisType: ['percent'],
          yAxisName: ['比率']
        }
      };
      return chartData;
    },
    dataFormatPie(data) {
      let tmpData = [];
      for (let i = 0; i < data.indicators.length; i++) {
        tmpData.push({
          type: data.indicators[i].lable || data.indicators[i].xValue,
          value: data.indicators[i].value || data.indicators[i].yValue
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
              if (element.lable === v.name) {
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
    purposeConverter(row) {
      return `${row.purposeBrand} ${row.purposeSeries} ${row.purposeProduct}`;
    },
    createDateConverter(row) {
      if (!row.entryDate) return '';

      let date = new Date(row.entryDate);
      return dateUtil.dateConverter(date);
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
.general-view-analysis-yygk {
  height: 100%;
  overflow: auto;
  margin: 20px 0px 20px 20px;
  padding-bottom: 20px;
  padding-right: 10px;
  min-width: 560px;
  .indicators-search {
    display: flex;
    height: auto;
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
      width: 130px;
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
