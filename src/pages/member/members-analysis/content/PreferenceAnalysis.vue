<template>
  <div class="preference-analysis">
    <div slot="top">
      <show-search-grid @refreshHandle="refreshHandle" :showIntroduce="false" :showViewType="false" ref="search">
        <div slot="description" class="description-pover">
          <p>标签不控制饼状图，其余突变受控制</p>
        </div>
      </show-search-grid>
    </div>
    <div class="indicators-search">
      <div class="title">车友会：</div>
      <el-checkbox-button v-model="checkAllFleet" @change="handleCheckAllFleet" :indeterminate="isIndeterminateFleet">全部</el-checkbox-button>
      <el-checkbox-group v-model="checkedFleet" @change="fleetChange">
        <el-checkbox-button v-for="(condition,index)  in fleetList" :label="condition.id" :key="index" size="mini">{{condition.name}}</el-checkbox-button>
      </el-checkbox-group>
    </div>
    <div class="indicators-search" :class="{'showHide1' : showHide}">
      <div class="title">类型：</div>
      <div class="hardGroup" :class="{'showHide' : showHide}" ref="brandGroup">
        <el-checkbox-button v-model="checkAllBrand" @change="handleCheckAllBrand" :indeterminate="isIndeterminateBrand">全部</el-checkbox-button>
        <el-checkbox-group v-model="checkedBrand" @change="brandChange">
          <el-checkbox-button v-for="(condition,index)  in brandList" :label="condition" :key="index" size="mini">{{condition}}</el-checkbox-button>
        </el-checkbox-group>
      </div>
    </div>
    <div class="swich" v-if="showSwich">
      <i :class="className" @click="swich"></i>
    </div>
    <div class="chart-area" v-loading="loading">
      <div class="graph">
        <div class="filterSeach">
          <div class="filter-area">
            <el-radio-group @change="indicatorChanged" v-model="indicatorValue" size="mini">
              <el-radio-button label="carBrandIns">阅读偏好</el-radio-button>
              <el-radio-button label="carPriceIns">点赞偏好</el-radio-button>
              <el-radio-button label="carAgeIns">评论偏好</el-radio-button>
              <el-radio-button label="carAddressIns">转发偏好</el-radio-button>
            </el-radio-group>
          </div>
          <div class="type-range">
            <el-radio-group v-model="radioValue" size="mini">
              <el-radio-button label="0">视图</el-radio-button>
              <el-radio-button label="1">列表</el-radio-button>
            </el-radio-group>
          </div>
        </div>
        <biz-chart :chartData="chartData" :loading="loading" :showSearch="false" v-if="radioValue==='0'&&indicatorValue==='carBrandIns'"></biz-chart>
      <biz-list ref="list" :height="height" :tableData="tableData" style="width: 100%;height:100%" v-show="radioValue==='1'">
          <el-table-column prop="plateNumber" label="店铺名称"></el-table-column>
          <el-table-column prop="ownerName" label="车友会"></el-table-column>
          <el-table-column prop="carType" label="文章标题"></el-table-column>
          <el-table-column prop="price" label="文章类型"></el-table-column>
          <el-table-column prop="carAge" label="阅读量"></el-table-column>
          <el-table-column prop="address" label="点赞量"></el-table-column>
          <el-table-column prop="address" label="评论量"></el-table-column>
          <el-table-column prop="address" label="转发量"></el-table-column>
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
      chartData: {},
      isShow: 'false',
      hardGroupHeight: 0,
      hardGroupHeight1: 0,
      showSwich: true,
      showSwichSeries: false,
      showHide: true,
      showSeriesHide: false,
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
      checkedShop: [],
      shopList: [],
      checkAllShop: true,
      isIndeterminateShop: true,
      checkedFleet: [],
      fleetList: [],
      checkAllFleet: true,
      isIndeterminateFleet: true,
      checkedBrand: [],
      brandList: [],
      checkAllBrand: true,
      isIndeterminateBrand: true,
      radioValue: '0',
      indicatorValue: 'carBrandIns',
      showMap: true,
      showMapChart: false,
      showBackButton: false,
      level: '1',
      provinceName: '',
      hasChildFlg: false,
      charMapData: []
    };
  },
  props: {
    params: {
      type: Object
    }
  },
  methods: {
    ...mapGetters(['getUser']),
    fleetChange(val) {
      let checkedCount = val.length;
      this.checkAllFleet = checkedCount === this.fleetList.length;
      this.isIndeterminateFleet = checkedCount > 0 && checkedCount < this.fleetList.length;
      this.query();
    },
    handleCheckAllFleet(val) {
      this.checkedFleet = val ? this.fleetList.map(item => { return item.id; }) : [];
      this.query();
    },
    brandChange(val) {
      let checkedCount = val.length;
      this.checkAllBrand = checkedCount === this.brandList.length;
      this.isIndeterminateBrand = checkedCount > 0 && checkedCount < this.brandList.length;
      this.query();
    },
    handleCheckAllBrand(val) {
      this.checkedBrand = val ? this.brandList.map(item => { return item; }) : [];
      this.query();
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
    },
    query() {
      this.getGraphData();
      this.getTable();
    },
    getfleetList() {
      this.loading = true;
      let param = {
        shopId: this.checkedShop[0],
        pageNumber: 1,
        pageSize: 1000,
        fleetType: 'circle'
      };
      http
        .get('/admin/fleet/json/list.jhtml', param)
        .then(data => {
          this.loading = false;
          this.fleetList = data.content;
          this.checkedFleet = this.params.checkedFleet || this.fleetList.map(item => { return item.id; }) || [];
          let checkedCount = this.checkedFleet.length;
          this.checkAllFleet = checkedCount === this.fleetList.length;
          this.isIndeterminateFleet = checkedCount > 0 && checkedCount < this.fleetList.length;
          this.query();
        })
        .catch(error => {
          this.loading = false;
          if (error.errorMessage) {
            this.$message.warning(error.errorMessage);
          }
        });
    },
    indicatorChanged() {
      this.getGraphData();
      this.getTable();
    },
    getGraphData() {
      this.loading = true;
      let params = {
        indicator: 'carCnt',
        viewType: this.viewType,
        beginDate: this.beginDate,
        endDate: this.endDate,
        shopIds: this.checkedShop,
        fleets: this.checkedFleet,
        brands: this.checkedBrand
      };
      http
        .post('/admin/ecommerce/kpi/car/graph/trend.jhtml', params)
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
          showLine: [this.kpiName[1], this.kpiName[2]]
        }
      };
      return chartData;
    },
    getTable() {
      let params = {
        indicator: this.indicatorValue,
        viewType: this.viewType,
        beginDate: this.beginDate,
        endDate: this.endDate,
        shopIds: this.checkedShop,
        fleets: this.checkedFleet,
        brands: this.checkedBrand,
        pageSize: this.pagination.pageSize,
        pageNumber: this.pagination.currentPage
      };
      http
        .post('/admin/ecommerce/kpi/car/table/cars.jhtml', params)
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
        shopIds: this.checkedShop,
        fleets: this.checkedFleet,
        brands: this.checkedBrand,
        pageSize: this.pagination.pageSize,
        pageNumber: this.pagination.currentPage
      };
      try {
        let response = await axios.post('/admin/ecommerce/kpi/car/export/cars.jhtml', params, { responseType: 'blob' });
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
    swich() {
      this.className = this.className === 'el-icon-caret-bottom' ? 'el-icon-caret-top' : 'el-icon-caret-bottom';
      this.showHide = this.className === 'el-icon-caret-bottom';
      if (!this.showHide) {
        document.getElementsByClassName('hardGroup')[0].style.height = 'auto';
      } else {
        document.getElementsByClassName('hardGroup')[0].style.height = '55px';
      }
    },
    buttonClick() {
      if (this.level === '2') {
        this.level = '1';
        this.showBackButton = false;
      } else if (this.level === '3') {
        this.level = '2';
        this.showMap = true;
        this.showMapChart = false;
      } else {
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
.preference-analysis {
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
