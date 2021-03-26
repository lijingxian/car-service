<template>
  <div class="cost-analysis-invoice">
    <div slot="top" style="display:flex">
      <show-search-grid @refreshHandle="refreshHandle" ref="search">
        <div slot="description" class="description-pover">
          <p>毛利率：统计商品毛利率排行情况</p>
        </div>
      </show-search-grid>
      <div class="filter-portrait" v-if="filters.length > 0">
        <biz-filter v-if="filters.length > 0" :filters="filters" @filterDataChange="filterDataChange"></biz-filter>
      </div>
    </div>
    <div class="indicators-search" :class="{'showHide2' : showHideOperator1}" v-if="getUser().roleLevel !== 'shop'">
      <div class="title">运营商：</div>
      <div class="hardOperatorGroup1" :class="{'showHideOperator1' : showHideOperator1}" ref="operatorGroup">
        <el-checkbox-button v-model="checkAllOperator" @change="handleCheckAllOperator" :indeterminate="isIndeterminateOperator">全部
        </el-checkbox-button>
        <el-tooltip placement="bottom" v-for="(condition,index)  in operatorList" :key="index" :disabled="condition.name.length<=10">
          <el-checkbox-group v-model="checkedOperator" @change="operatorChange">
            <el-checkbox-button :label="condition.id" size="mini">
              {{condition.name.length>10?condition.name.substr(0, 10)+'...':condition.name}}
            </el-checkbox-button>
          </el-checkbox-group>
          <div slot="content">{{ condition.name }}</div>
        </el-tooltip>
      </div>
    </div>
    <div class="swichOperator" v-if="showOperatorSwich1">
      <i :class="classNameOperator" @click="swichOperator"></i>
    </div>
    <div class="indicators-search" :class="{'showHide2' : showHideShop1}" v-if="conditionData.shopsList.length>1">
      <div class="title">店铺</div>
      <div class="hardShopGroup1" :class="{'showHideShop1' : showHideShop1}" ref="shopGroup">
        <el-checkbox-button v-model="checkAllShops" @change="handleCheckAllShops" :indeterminate="isIndeterminateShops">全部
        </el-checkbox-button>
        <el-tooltip placement="bottom" v-for="(item, index) in conditionData.shopsList" :key="index" :disabled="item.name.length<=10">
          <el-checkbox-group :min="1" v-model="checkedShops" @change="shopsChange">
            <el-checkbox-button :label="item.id" size="mini">
              {{item.name.length>10?item.name.substr(0, 10)+'...':item.name}}
            </el-checkbox-button>
          </el-checkbox-group>
          <div slot="content">{{ item.name }}</div>
        </el-tooltip>
      </div>
    </div>
    <div class="chart-area" v-loading="loading">
      <div class="graph">
        <div class="filterSeach">
          <div class="filter-area">
            <el-radio-group @change="indicatorChanged" v-model="indicatorValue" size="mini">
              <el-radio-button label="grossProfitRateRank">毛利率</el-radio-button>
            </el-radio-group>
          </div>
          <div class="type-range">
            <el-radio-group v-model="radioValue" size="mini">
              <el-radio-button label="0">视图</el-radio-button>
              <el-radio-button label="1">列表</el-radio-button>
            </el-radio-group>
          </div>
        </div>
        <biz-chart :chartData="chartData" :loading="loading" :showSearch="false" v-if="radioValue==='0'"></biz-chart>
        <biz-list ref="list" :height="height" :tableData="tableData" style="width: 100%;height:100%" v-show="radioValue==='1'">
          <el-table-column prop="name" label="商品名称"></el-table-column>
          <el-table-column prop="barCode" label="商品条码"></el-table-column>
          <el-table-column prop="price" label="零售价"></el-table-column>
          <el-table-column prop="purchasePriceWithTax" label="平均采购成本"></el-table-column>
          <!-- <el-table-column prop="purchasePriceWithTax" label="采购价（含税）"></el-table-column>
          <el-table-column prop="purchaseCount" label="采购数量"></el-table-column> -->
          <!-- <el-table-column prop="returnAmount" label="采购税额"></el-table-column> -->
          <!-- <el-table-column prop="purchaseAmount" label="采购金额"></el-table-column> -->
          <!-- <el-table-column prop="returnAmount" label="销售价（不含税）"></el-table-column> -->
          <!-- <el-table-column prop="salesPriceWithTax" label="销售价（含税）"></el-table-column> -->
          <el-table-column prop="salesCount" label="销售数量"></el-table-column>
          <!-- <el-table-column prop="returnAmount" label="销售税额"></el-table-column> -->
          <el-table-column prop="salesAmount" label="销售额"></el-table-column>
          <el-table-column prop="grossProfitRate" label="毛利率"></el-table-column>
          <!-- <el-table-column prop="stock" label="库存数量"></el-table-column> -->
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
import ShowSearchGrid from '../components/ShowSearchGrid';
import dateTime from '@/utils/dateTime';
import http from '@/common/http';
import axios from 'axios';
import { mapGetters } from 'vuex';
import urls from '@/common/urls';
import BizFilter from '@/components/BizTable/BizFilter.vue';
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
      filters: [
        {
          type: 'input',
          value: '',
          name: 'search',
          placeholder: '请输入商品名称/条码'
        }
      ],
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
      isIndeterminateShops: false,
      isIndeterminateTemps: false,
      checkAllShops: false,
      checkedShops: [],
      isIndeterminateOperator: true,
      checkAllOperator: true,
      checkedOperator: [],
      operatorList: [],
      hardGroupOperatorHeight1: 0,
      classNameOperator1: 'el-icon-caret-bottom',
      showOperatorSwich1: false,
      showHideOperator1: false,
      kpiName: ['本期', '同比', '环比'],
      className: 'el-icon-caret-bottom',
      classSeriesName: 'el-icon-caret-bottom',
      // indicator
      conditionData: {
        shopsList: [],
        supplierList: [],
        stateList: []
      },
      showHideShop1: false,
      showShopSwich1: false,
      hardGroupShopHeight1: 0,
      classNameShop1: 'el-icon-caret-bottom',
      showHideTemp1: false,
      showTempSwich1: false,
      hardGroupTempHeight1: 0,
      classNameTemp1: 'el-icon-caret-bottom',
      channelLists: [],
      countTotal: 0,
      radioValue: '0',
      indicatorValue: 'grossProfitRateRank'
    };
  },
  props: {
    params: {
      type: Object
    }
  },
  methods: {
    ...mapGetters(['getUser']),
    filterDataChange(val) {
      this.query();
    },
    handleCheckAllOperator(val) {
      this.checkedOperator = val
        ? this.operatorList.map(item => {
          return item.id;
        })
        : [];
      this.getShopList();
    },
    operatorChange(val) {
      let checkedCount = val.length;
      this.checkAllOperator = checkedCount === this.operatorList.length;
      this.isIndeterminateOperator = checkedCount > 0 && checkedCount < this.operatorList.length;
      this.getShopList();
    },
    handleCheckAllShops(val) {
      this.checkedShops = val ? this.conditionData.shopsList.map(item => { return item.id; }) : [];
      this.query();
    },
    shopsChange(val) {
      let checkedCount = val.length;
      this.checkAllShops = checkedCount === this.conditionData.shopsList.length;
      this.isIndeterminateShops = checkedCount > 0 && checkedCount < this.conditionData.shopsList.length;
      this.query();
    },
    getShopList() {
      let param = {
        sourceType: '5'
      };
      http
        .get('/admin/member/json/findEShops.jhtml', param)
        .then(data => {
          this.conditionData.shopsList = data.shops;
          this.checkedShops = this.params.checkedShops;
          // this.$nextTick(() => {
          //   this.hardGroupShopHeight1 = document.getElementsByClassName('hardShopGroup1')[3].offsetHeight;
          //   console.log(this.hardGroupShopHeight1);
          //   if (this.hardGroupShopHeight1 > 55) {
          //     this.showShopSwich1 = true;
          //     this.showHideShop1 = true;
          //   } else {
          //     this.showShopSwich1 = false;
          //     this.showHideShop1 = false;
          //   }
          // });
          this.query();
        })
        .catch(error => {
          if (error.errorMessage) {
            this.$message.warning(error.errorMessage);
          }
        });
    },
    getCompanyList() {
      http
        .get(urls.terminalMgmt.Component_queryOperators)
        .then(data => {
          this.operatorList = data.content;
          this.checkedOperator = this.operatorList
            ? this.operatorList.map(item => {
              return item.id;
            })
            : [];
          this.$nextTick(() => {
            this.hardGroupOperatorHeight1 = document.getElementsByClassName('hardOperatorGroup1')[0].offsetHeight;
            if (this.hardGroupOperatorHeight1 > 55) {
              this.showOperatorSwich1 = true;
              this.showHideOperator1 = true;
            } else {
              this.showOperatorSwich1 = false;
              this.showHideOperator1 = false;
            }
          });
          this.getShopList();
        })
        .catch(error => {
          if (error.errorMessage) {
            this.$message.warning(error.errorMessage);
          }
        });
    },
    swichOperator() {
      this.classNameOperator = this.classNameOperator === 'el-icon-caret-bottom' ? 'el-icon-caret-top' : 'el-icon-caret-bottom';
      this.showHideOperator = this.classNameOperator === 'el-icon-caret-bottom';
      if (!this.showHideOperator) {
        document.getElementsByClassName('hardOperatorGroup')[0].style.height = 'auto';
      } else {
        document.getElementsByClassName('hardOperatorGroup')[0].style.height = '55px';
      }
    },
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
      if (this.getUser().roleLevel !== 'shop') {
        this.getCompanyList();
      } else {
        this.getShopList();
      }
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
        indicators: [this.indicatorValue],
        shopIds: this.checkedShops,
        states: this.checkedState,
        agentIds: this.checkedSupplier,
        viewType: this.viewType,
        beginDate: this.beginDate,
        endDate: this.endDate
      };
      http
        .post('/admin/ecommerce/kpi/finance/graph/columnGraphRank.jhtml', params)
        .then(data => {
          this.chartData = this.dataFormatZf(data);
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
        indicators: [this.indicatorValue],
        shopIds: this.checkedShops,
        states: this.checkedState,
        agentIds: this.checkedSupplier,
        viewType: this.viewType,
        beginDate: this.beginDate,
        endDate: this.endDate,
        pageSize: this.pagination.pageSize,
        pageNumber: this.pagination.currentPage
      };
      http
        .post('/admin/ecommerce/kpi/finance/table/finance.jhtml', params)
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
        indicators: [this.indicatorValue],
        shopIds: this.checkedShops,
        states: this.checkedState,
        agentIds: this.checkedSupplier,
        viewType: this.viewType,
        beginDate: this.beginDate,
        endDate: this.endDate,
        pageSize: this.pagination.pageSize,
        pageNumber: this.pagination.currentPage
      };
      try {
        let response = await axios.post('/admin/ecommerce/kpi/finance/export/finance.jhtml', params, { responseType: 'blob' });
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
    dataFormatZf(data) {
      let tmpData = [];
      for (let i = 0; i < (data.indicators.length > 10 ? 10 : data.indicators.length); i++) {
        tmpData.push({
          商品: data.indicators[i].xValue,
          利率: data.indicators[i].yValue
        });
      }
      let chartData = {
        legendVisible: false,
        type: 'histogram',
        data: {
          columns: ['商品', '利率'],
          rows: tmpData
        },
        settings: {
          interval: 0
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
    ShowSearchGrid,
    BizFilter
  }
};
</script>

<style lang="scss">
.cost-analysis-invoice {
  height: 100%;
  overflow: auto;
  align-content: space-between;
  margin: 20px 0px 20px 20px;
  padding-bottom: 20px;
  padding-right: 10px;
  min-width: 560px;
  .search-property {
    width: 100%;
  }
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
  .swichShop1 {
    text-align: center;
    font-size: 24px;
    cursor: pointer;
    margin-top: -10px;
  }
  .showHideShop1 {
    height: 55px;
    overflow-y: hidden;
  }
  .hardShopGroup1 {
    display: flex;
    width: calc(100% - 90px);
    flex-flow: wrap;
  }
  .swichTemp1 {
    text-align: center;
    font-size: 24px;
    cursor: pointer;
    margin-top: -10px;
  }
  .showHideTemp1 {
    height: 55px;
    overflow-y: hidden;
  }
  .hardTempGroup1 {
    display: flex;
    width: calc(100% - 90px);
  }
  .showHide2 {
    height: 55px;
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
