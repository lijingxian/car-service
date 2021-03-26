<template>
  <div class="general-view-analysis-info">
    <div slot="top">
      <show-search-grid @refreshHandle="refreshHandle" :showIntroduce="false" ref="search">
      </show-search-grid>
    </div>
    <div class="indicators-search">
      <div class="title">一级分类：</div>
      <el-checkbox-button v-model="checkAllClass" @change="handleCheckAllClass" :indeterminate="isIndeterminate">全部</el-checkbox-button>
      <el-checkbox-group v-model="checkedClass" @change="classChange">
        <el-checkbox-button v-for="(item,index) in classList" :label="item.id.toString()" :key="index" size="mini">{{item.name}}</el-checkbox-button>
      </el-checkbox-group>
    </div>
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
        <biz-chart :chartData="chartData" :loading="loading" :showSearch="false" v-if="radioValue==='0'"></biz-chart>
        <biz-list ref="list" :height="height" :tableData="tableData" style="width: 100%" v-if="!isShow&&(filters[0].value==='sellWell'||filters[0].value==='Unsalable')">
          <el-table-column type="index" label="排序"></el-table-column>
          <el-table-column prop="xValue" label="商品"></el-table-column>
          <el-table-column prop="yValue" label="数量"></el-table-column>
        </biz-list>
        <biz-list ref="list" :height="height" :tableData="tableData" style="width: 100%" v-if="!isShow&&filters[0].value==='afterSaleProductView'">
          <el-table-column type="index" label="排序"></el-table-column>
          <el-table-column prop="xValue" label="商品名称"></el-table-column>
          <el-table-column prop="yValue" label="评价"></el-table-column>
        </biz-list>
        <biz-list ref="list" :height="height" :tableData="tableData" style="width: 100%" v-if="!isShow&&filters[0].value==='afterSaleProduct'">
          <el-table-column type="index" label="排序"></el-table-column>
          <el-table-column prop="xValue" label="商品名称"></el-table-column>
          <el-table-column prop="yValue" label="售后率"></el-table-column>
        </biz-list>
        <biz-pagination :pagination="pagination" @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange"
          v-if="!isShow"></biz-pagination>
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
import BizFilter from '@/components/BizTable/BizFilter';
import dateTime from '@/utils/dateTime';
import http from '@/common/http';
import ShowSearchGrid from './components/ShowSearchGrid';
import dateUtil from '@/utils/date';
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
      countTotal: '',
      classList: [],
      checkAllClass: true,
      checkedClass: [],
      isIndeterminate: true,
      tableData: [],
      showRecommend: false,
      channelLists: [],
      summary: {},
      filters: [
        {
          type: 'single',
          label: '',
          value: 'sellWell',
          options: [
            { value: 'sellWell', label: '热销榜' },
            { value: 'Unsalable', label: '滞销榜' },
            // { value: 'afterSaleProductView', label: '好评榜' },
            { value: 'afterSaleProductView', label: '差评榜' },
            { value: 'afterSaleProduct', label: '高售后榜' }
            // { value: 'afterSaleProduct', label: '高转化榜' }
          ]
        }
      ],
      kpiName: ['本期', '同比', '环比'],
      chartData: {},
      chartDataPie: {},
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
          this.checkedClass = this.classList ? this.classList.map(item => { return item.id.toString(); }) : [];
          this.checkAllClass = true;
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
    query() {
      this.getGraphData();
      this.getTable();
    },
    getGraphData() {
      this.loading = true;
      let type = 'productTop';
      let url = '/admin/ecommerce/kpi/product/graph/product.jhtml';
      if (this.filters[0].value === 'afterSaleProductView') {
        type = 'afterSaleProductView';
        url = '/admin/ecommerce/kpi/order/graph/order/order.jhtml';
      } else if (this.filters[0].value === 'afterSaleProduct') {
        type = 'afterSaleProduct';
        url = '/admin/ecommerce/kpi/order/graph/order/order.jhtml';
      }
      let params = {
        viewType: this.viewType,
        indicators: [this.filters[0].value],
        beginDate: this.beginDate,
        endDate: this.endDate,
        shopId: window.top.SHOP_ID || '',
        type: type,
        productCateGorys: this.checkedClass
      };
      http
        .post(url, params)
        .then(data => {
          if (this.filters[0].value === 'afterSaleProduct') {
            this.chartData = this.dataFormatA(data);
          } else if (this.filters[0].value === 'afterSaleProductView') {
            this.chartData = this.dataFormatB(data);
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
      let type = 'productTop';
      let url = '/admin/ecommerce/kpi/Product/table/product.jhtml';
      if (this.filters[0].value === 'afterSaleProductView') {
        type = 'afterSaleProductView';
        url = '/admin/ecommerce/kpi/order/table/order/order.jhtml';
      } else if (this.filters[0].value === 'afterSaleProduct') {
        type = 'afterSaleProduct';
        url = '/admin/ecommerce/kpi/order/table/order/order.jhtml';
      }
      let params = {
        indicators: [this.filters[0].value],
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
    async exportExcle() {
      let type = 'productTop';
      let url = '/admin/ecommerce/kpi/product/export/product.jhtml';
      if (this.filters[0].value === 'afterSaleProductView') {
        type = 'afterSaleProductView';
        url = '/admin/ecommerce/kpi/order/export/order/order.jhtml';
      } else if (this.filters[0].value === 'afterSaleProduct') {
        type = 'afterSaleProduct';
        url = '/admin/ecommerce/kpi/order/export/order/order.jhtml';
      }
      let params = {
        indicators: [this.filters[0].value],
        type: type,
        productCateGorys: this.checkedClass,
        viewType: this.viewType,
        beginDate: this.beginDate,
        endDate: this.endDate,
        shopId: window.top.SHOP_ID || '',
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
    dataFormat(data) {
      let tmpData = [];
      for (let i = 0; i < (data.indicators.length > 10 ? 10 : data.indicators.length); i++) {
        tmpData.push({
          分类: data.indicators[i].xValue,
          数量: data.indicators[i].yValue
        });
      }
      let chartData = {
        legendVisible: false,
        type: 'histogram',
        data: {
          columns: ['分类', '数量'],
          rows: tmpData
        },
        settings: {
          yAxisName: ['件']
        }
      };
      return chartData;
    },
    dataFormatA(data) {
      let tmpData = [];
      for (let i = 0; i < (data.indicators.length > 10 ? 10 : data.indicators.length); i++) {
        tmpData.push({
          分类: data.indicators[i].xValue,
          占比: data.indicators[i].yValue
        });
      }
      let chartData = {
        legendVisible: false,
        type: 'histogram',
        data: {
          columns: ['分类', '占比'],
          rows: tmpData
        },
        settings: {
          yAxisName: ['%']
        }
      };
      return chartData;
    },
    dataFormatB(data) {
      let tmpData = [];
      for (let i = 0; i < (data.indicators.length > 10 ? 10 : data.indicators.length); i++) {
        tmpData.push({
          评价: data.indicators[i].xValue,
          分: data.indicators[i].yValue
        });
      }
      let chartData = {
        legendVisible: false,
        type: 'histogram',
        data: {
          columns: ['评价', '分'],
          rows: tmpData
        },
        settings: {
          yAxisName: ['分']
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
    BizPagination
  }
};
</script>

<style lang="scss">
.general-view-analysis-info {
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
