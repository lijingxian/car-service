<template>
  <div class="dbt-analysis">
    <div slot="top">
      <show-search-grid @refreshHandle="refreshHandle" :showIntroduce="false" :showViewType="false" ref="search">
        <div slot="description" class="description-pover">
          <p>标签不控制饼状图，其余突变受控制</p>
        </div>
      </show-search-grid>
    </div>
    <!-- <div class="indicators-search">
      <div class="title">运营商：</div>
      <el-checkbox-button v-model="checkAllOperator" @change="handleCheckAllOperator" :indeterminate="isIndeterminateOperator">全部
      </el-checkbox-button>
      <el-checkbox-group v-model="checkedOperator" @change="operatorChange">
        <el-checkbox-button v-for="(condition,index)  in operatorList" :label="condition.id" :key="index" size="mini">
          {{condition.name}}</el-checkbox-button>
      </el-checkbox-group>
    </div> -->
    <div class="indicators-search" v-if="this.getUser().roleLevel !== 'shop'">
      <div class="title">店铺</div>
      <div class="hardShopGroup1" :class="{'showHideShop1' : showHideShop1}" ref="shopGroup">
        <el-checkbox-button v-model="checkAllShop" @change="handleCheckAllShop" :indeterminate="isIndeterminateShop">全部
        </el-checkbox-button>
        <el-tooltip placement="bottom" v-for="(item, index) in shopList" :key="index" :disabled="item.name.length<=10">
          <el-checkbox-group v-model="checkedShop" @change="shopChange">
            <el-checkbox-button :label="item.id" size="mini">
              {{item.name.length>10?item.name.substr(0, 10)+'...':item.name}}
            </el-checkbox-button>
          </el-checkbox-group>
          <div slot="content">{{ item.name }}</div>
        </el-tooltip>
      </div>
    </div>
    <div class="indicators-search">
      <div class="title">车队</div>
      <div class="hardShopGroup1" :class="{'showHideShop1' : showHideShop1}" ref="shopGroup">
        <el-checkbox-button v-model="checkAllFleet" @change="handleCheckAllFleet" :indeterminate="isIndeterminateFleet">全部
        </el-checkbox-button>
        <el-tooltip placement="bottom" v-for="(item, index) in fleetList" :key="index" :disabled="item.name.length<=10">
          <el-checkbox-group v-model="checkedFleet" @change="fleetChange">
            <el-checkbox-button :label="item.id" size="mini">
              {{item.name.length>10?item.name.substr(0, 10)+'...':item.name}}
            </el-checkbox-button>
          </el-checkbox-group>
          <div slot="content">{{ item.name }}</div>
        </el-tooltip>
      </div>
    </div>
    <div class="indicators-search">
      <div class="title">安全指数</div>
      <div class="hardShopGroup1" :class="{'showHideShop1' : showHideShop1}" ref="shopGroup">
        <el-checkbox-button v-model="checkAllSafetyIndexs" @change="handleCheckAllSafetyIndexs" :indeterminate="isIndeterminateSafetyIndexs">
          全部
        </el-checkbox-button>
        <el-tooltip placement="bottom" v-for="(item, index) in safetyIndexsList" :key="index" :disabled="item.name.length<=10">
          <el-checkbox-group v-model="checkedSafetyIndexs" @change="safetyIndexsChange">
            <el-checkbox-button :label="item.id" size="mini">
              {{item.name.length>10?item.name.substr(0, 10)+'...':item.name}}
            </el-checkbox-button>
          </el-checkbox-group>
          <div slot="content">{{ item.name }}</div>
        </el-tooltip>
      </div>
    </div>
    <div class="indicators-search">
      <div class="title">油耗指数</div>
      <div class="hardShopGroup1" :class="{'showHideShop1' : showHideShop1}" ref="shopGroup">
        <el-checkbox-button v-model="checkAllOilIndexs" @change="handleCheckAllOilIndexs" :indeterminate="isIndeterminateOilIndexs">
          全部
        </el-checkbox-button>
        <el-tooltip placement="bottom" v-for="(item, index) in oilIndexsList" :key="index" :disabled="item.name.length<=10">
          <el-checkbox-group v-model="checkedOilIndexs" @change="oilIndexsChange">
            <el-checkbox-button :label="item.id" size="mini">
              {{item.name.length>10?item.name.substr(0, 10)+'...':item.name}}
            </el-checkbox-button>
          </el-checkbox-group>
          <div slot="content">{{ item.name }}</div>
        </el-tooltip>
      </div>
    </div>
    <div class="indicators-search">
      <div class="title">用车频率</div>
      <div class="hardShopGroup1" :class="{'showHideShop1' : showHideShop1}" ref="shopGroup">
        <el-checkbox-button v-model="checkAllUseRates" @change="handleCheckAllUseRates" :indeterminate="isIndeterminateUseRates">
          全部
        </el-checkbox-button>
        <el-tooltip placement="bottom" v-for="(item, index) in useRatesList" :key="index" :disabled="item.name.length<=10">
          <el-checkbox-group v-model="checkedUseRates" @change="useRatesChange">
            <el-checkbox-button :label="item.id" size="mini">
              {{item.name.length>10?item.name.substr(0, 10)+'...':item.name}}
            </el-checkbox-button>
          </el-checkbox-group>
          <div slot="content">{{ item.name }}</div>
        </el-tooltip>
      </div>
    </div>
    <div class="indicators-search" :class="{'showHide1' : showHide}">
      <div class="title">品牌</div>
      <div class="hardGroup" :class="{'showHide' : showHide}" ref="brandGroup">
        <el-checkbox-button v-model="checkAllBrand" @change="handleCheckAllBrand" :indeterminate="isIndeterminateBrand">全部
        </el-checkbox-button>
        <el-tooltip placement="bottom" v-for="(item, index) in brandList" :key="index" :disabled="item.length<=10">
          <el-checkbox-group v-model="checkedBrand" @change="brandChange">
            <el-checkbox-button :label="item" size="mini">
              {{item.length>10?item.substr(0, 10)+'...':item}}
            </el-checkbox-button>
          </el-checkbox-group>
          <div slot="content">{{ item }}</div>
        </el-tooltip>
      </div>
    </div>
    <div class="swich" v-if="showSwich">
      <i :class="className" @click="swich"></i>
    </div>
    <div class="chart-area">
      <div class="graph">
        <div class="filterSeach">
          <div class="filter-area">
            <el-radio-group @change="indicatorChanged" v-model="indicatorValue" size="mini">
              <el-radio-button label="carBrandCnt">品牌车系</el-radio-button>
              <el-radio-button label="carPriceCnt">价格</el-radio-button>
              <el-radio-button label="carAgeCnt">车龄</el-radio-button>
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
          v-show="radioValue==='0'">
          <div v-for="(list,index) in channelLists" :key="index">
            <span :class="'list'+index">
              {{list.lable}}:{{list.value}}辆
              占比{{countTotal!==0?((list.value/countTotal)*100).toFixed(2):list.value}}%
            </span>
          </div>
        </div>
        <biz-chart :chartData="chartDataOfBrand" :loading="loading" :showSearch="false"
          v-if="radioValue==='0'&&indicatorValue==='carBrandCnt'"></biz-chart>
        <biz-chart :chartData="chartDataOfPrice" :loading="loading" :showSearch="false"
          v-if="radioValue==='0'&&indicatorValue==='carPriceCnt'"></biz-chart>
        <biz-chart :chartData="chartDataOfAge" :loading="loading" :showSearch="false" v-if="radioValue==='0'&&indicatorValue==='carAgeCnt'">
        </biz-chart>
      <biz-list ref="list" :height="height" :tableData="tableData" style="width: 100%;height:100%" v-show="radioValue==='1'">
          <el-table-column prop="plateNumber" label="车牌号">
            <template slot-scope="scope">
              <el-button @click.stop="singleCar(scope.row)" type="text" size="mini">
                {{ scope.row.plateNumber}}
              </el-button>
            </template>
          </el-table-column>
          <el-table-column prop="ownerName" label="车主"></el-table-column>
          <el-table-column prop="carType" label="品牌车型">
            <template slot-scope="scope">
              {{scope.row.brand}}{{scope.row.carType}}
            </template>
          </el-table-column>
          <el-table-column prop="price" label="车辆价格"></el-table-column>
          <el-table-column prop="carAge" label="车龄"></el-table-column>
          <el-table-column prop="addresss" label="位置"></el-table-column>
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
import ShowSearchGrid from '../components/ShowSearchGrid';
import dateTime from '@/utils/dateTime';
import http from '@/common/http';
import urls from '@/common/urls';
import axios from 'axios';
import { mapGetters } from 'vuex';
export default {
  name: 'ChannelAnalysis',
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
      kpiName: ['本期', '同比', '环比'],
      showRecommend: false,
      chartDataOfBrand: {},
      chartDataOfPrice: {},
      chartDataOfAge: {},
      isShow: 'false',
      hardGroupHeight: 0,
      hardGroupHeight1: 0,
      showSwich: true,
      showSwichSeries: false,
      showHide: true,
      showSeriesHide: false,
      showHideShop1: false,
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
      checkedOperator: [],
      operatorList: [],
      checkAllOperator: true,
      isIndeterminateOperator: true,
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
      checkedOilIndexs: ['3', '2', '1'],
      oilIndexsList: [
        { id: '3', name: '高' },
        { id: '2', name: '正常' },
        { id: '1', name: '低' }
      ],
      checkAllOilIndexs: true,
      isIndeterminateOilIndexs: true,
      checkedSafetyIndexs: ['3', '2', '1'],
      safetyIndexsList: [
        { id: '3', name: '激进型' },
        { id: '2', name: '普通型' },
        { id: '1', name: '保守型' }
      ],
      checkAllSafetyIndexs: true,
      isIndeterminateSafetyIndexs: true,
      checkedUseRates: ['3', '2', '1'],
      useRatesList: [
        { id: '3', name: '高' },
        { id: '2', name: '正常' },
        { id: '1', name: '低' }
      ],
      checkAllUseRates: true,
      isIndeterminateUseRates: true,
      radioValue: '0',
      indicatorValue: 'carBrandCnt'
    };
  },
  props: {
    params: {
      type: Object
    }
  },
  methods: {
    ...mapGetters(['getUser']),
    operatorChange() {},
    handleCheckAllOperator() {},
    singleCar(row) {
      this.$router.push({
        path: '/operating/statistics-analysis/vehicleStatic/singleViewAnalysis',
        query: { plateNumber: row.plateNumber }
      });
    },
    shopChange(val) {
      let checkedCount = val.length;
      this.checkAllFleet = checkedCount === this.shopList.length;
      this.isIndeterminateShop = checkedCount > 0 && checkedCount < this.shopList.length;
      this.query();
    },
    handleCheckAllShop(val) {
      this.checkedShop = val ? this.shopList.map(item => { return item.id; }) : [];
      this.query();
    },
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
    safetyIndexsChange(val) {
      let checkedCount = val.length;
      this.checkAllSafetyIndexs = checkedCount === this.safetyIndexsList.length;
      this.isIndeterminateSafetyIndexs = checkedCount > 0 && checkedCount < this.safetyIndexsList.length;
      this.query();
    },
    handleCheckAllSafetyIndexs(val) {
      this.checkedSafetyIndexs = val ? this.safetyIndexsList.map(item => { return item.id; }) : [];
      this.query();
    },
    oilIndexsChange(val) {
      let checkedCount = val.length;
      this.checkAllOilIndexs = checkedCount === this.oilIndexsList.length;
      this.isIndeterminateOilIndexs = checkedCount > 0 && checkedCount < this.oilIndexsList.length;
      this.query();
    },
    handleCheckAllOilIndexs(val) {
      this.checkedOilIndexs = val ? this.oilIndexsList.map(item => { return item.id; }) : [];
      this.query();
    },
    useRatesChange(val) {
      let checkedCount = val.length;
      this.checkAllUseRates = checkedCount === this.useRatesList.length;
      this.isIndeterminateUseRates = checkedCount > 0 && checkedCount < this.useRatesList.length;
      this.query();
    },
    handleCheckAllUseRates(val) {
      this.checkedUseRates = val ? this.useRatesList.map(item => { return item.id; }) : [];
      this.query();
    },
    query() {
      if (this.indicatorValue === 'carBrandCnt') {
        this.getGraphBrandSeriesData();
      } else if (this.indicatorValue === 'carPriceCnt') {
        this.getGraphPriceData();
      } else if (this.indicatorValue === 'carAgeCnt') {
        this.getGraphAgeData();
      }
      this.getTable();
    },
    indicatorChanged() {
      if (this.indicatorValue === 'carBrandCnt') {
        this.getGraphBrandSeriesData();
      } else if (this.indicatorValue === 'carPriceCnt') {
        this.getGraphPriceData();
      } else if (this.indicatorValue === 'carAgeCnt') {
        this.getGraphAgeData();
      }
      this.getTable();
    },
    getGraphPriceData() {
      this.loading = true;
      let params = {
        indicator: 'carPriceCnt',
        viewType: this.viewType,
        beginDate: this.beginDate,
        endDate: this.endDate,
        shopIds: this.checkedShop,
        fleets: this.checkedFleet,
        oilIndexs: this.checkedOilIndexs,
        safetyIndexs: this.checkedSafetyIndexs,
        useRates: this.checkedUseRates,
        brands: this.checkedBrand
      };
      http
        .post('/admin/ecommerce/kpi/car/graph/distribute.jhtml', params)
        .then(data => {
          this.countTotal = 0;
          this.channelLists = data.indicators;
          for (const item of data.indicators) {
            this.countTotal += Number(item.value);
          }
          this.chartDataOfPrice = this.dataFormat(data);
        })
        .catch(errData => {
          this.loading = false;
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    getGraphBrandSeriesData() {
      this.loading = true;
      let params = {
        indicator: 'carBrandCnt',
        viewType: this.viewType,
        beginDate: this.beginDate,
        endDate: this.endDate,
        shopIds: this.checkedShop,
        fleets: this.checkedFleet,
        oilIndexs: this.checkedOilIndexs,
        safetyIndexs: this.checkedSafetyIndexs,
        useRates: this.checkedUseRates,
        brands: this.checkedBrand
      };
      http
        .post('/admin/ecommerce/kpi/car/graph/distribute.jhtml', params)
        .then(data => {
          this.channelLists = data.indicators;
          for (const item of data.indicators) {
            this.countTotal += Number(item.value);
          }
          this.chartDataOfBrand = this.dataFormat(data);
        })
        .catch(errData => {
          this.loading = false;
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    getGraphAgeData() {
      this.loading = true;
      let params = {
        indicator: 'carAgeCnt',
        viewType: this.viewType,
        beginDate: this.beginDate,
        endDate: this.endDate,
        shopIds: this.checkedShop,
        fleets: this.checkedFleet,
        oilIndexs: this.checkedOilIndexs,
        safetyIndexs: this.checkedSafetyIndexs,
        useRates: this.checkedUseRates,
        brands: this.checkedBrand
      };
      http
        .post('/admin/ecommerce/kpi/car/graph/distribute.jhtml', params)
        .then(data => {
          this.channelLists = data.indicators;
          for (const item of data.indicators) {
            this.countTotal += Number(item.value);
          }
          this.chartDataOfAge = this.dataFormat(data);
        })
        .catch(errData => {
          this.loading = false;
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    load() {
      this.viewType = this.params.viewType || 'month';
      this.checkedOilIndexs = this.params.checkedOilIndexs || ['3', '2', '1'];
      this.checkedSafetyIndexs = this.params.checkedSafetyIndexs || ['3', '2', '1'];
      this.checkedUseRates = this.params.checkedUseRates || ['3', '2', '1'];
      console.log(this.params);
      this.$refs.search.viewType = this.params.viewType || 'month';
      this.$refs.search.date = this.params.dateType || 'month';
      this.$refs.search.defaultDate = [dateTime.getPreThreeMonthDay(), dateTime.today()];
      if (this.params.beginDate) {
        this.beginDate = this.params.beginDate;
        this.endDate = this.params.endDate;
        this.$refs.search.defaultDate = [this.params.beginDate, this.params.endDate];
      }
      this.getShopList();
    },
    getShopList() {
      let param = {};
      if (this.getUser().roleLevel === 'shop') {
        this.shopList = [this.getUser().shop || ''];
      } else {
        http
          .get(urls.staticAnalisisi.vehicleShopList, param)
          .then(data => {
            this.shopList = data.stores;
          })
          .catch(errData => {
            if (errData.errorMessage) {
              this.$message.warning(errData.errorMessage);
            }
          });
      }
      this.checkedShop = this.params.checkedShop || [this.shopList[0].id] || [];
      this.getBrandsList();
      this.getfleetList();
    },
    getBrandsList() {
      this.loading = true;
      let param = {
        shopIds: this.checkedShop
      };
      http
        .post(urls.staticAnalisisi.vehicleBrandList, param)
        .then(data => {
          this.loading = false;
          this.brandList = data.brands;
          this.checkedBrand = this.params.checkedBrand || this.brandList || [];
          // this.$nextTick(() => {
          //   this.hardGroupHeight = document.getElementsByClassName('hardGroup')[0].offsetHeight;
          //   if (this.hardGroupHeight > 56) {
          //     this.showSwich = true;
          //     this.showHide = true;
          //   } else {
          //     this.showSwich = false;
          //     this.showHide = false;
          //   }
          // });
        })
        .catch(error => {
          this.loading = false;
          if (error.errorMessage) {
            this.$message.warning(error.errorMessage);
          }
        });
    },
    getfleetList() {
      this.loading = true;
      let param = {
        shopId: this.checkedShop[0],
        pageNumber: 1,
        pageSize: 1000,
        fleetType: 'group'
      };
      http
        .get('/admin/fleet/json/list.jhtml', param)
        .then(data => {
          this.loading = false;
          this.fleetList = data.content;
          this.checkedFleet =
            this.params.checkedFleet ||
            this.fleetList.map(item => {
              return item.id;
            }) ||
            [];
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
    getTable() {
      let params = {
        indicator: this.indicatorValue,
        viewType: this.viewType,
        beginDate: this.beginDate,
        endDate: this.endDate,
        shopIds: this.checkedShop,
        fleets: this.checkedFleet,
        brands: this.checkedBrand,
        oilIndexs: this.checkedOilIndexs,
        safetyIndexs: this.checkedSafetyIndexs,
        useRates: this.checkedUseRates,
        pageSize: this.pagination.pageSize,
        pageNumber: this.pagination.currentPage
      };
      http
        .post('/admin/ecommerce/kpi/car/table/drivingActions.jhtml', params)
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
        oilIndexs: this.checkedOilIndexs,
        safetyIndexs: this.checkedSafetyIndexs,
        useRates: this.checkedUseRates,
        pageSize: this.pagination.pageSize,
        pageNumber: this.pagination.currentPage
      };
      try {
        let response = await axios.post('/admin/ecommerce/kpi/car/export/drivingActions.jhtml', params, { responseType: 'blob' });
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
    refreshHandle(val) {
      this.viewType = val.viewType;
      this.beginDate = val.date[0];
      this.endDate = val.date[1];
      this.getGraphUseRateData();
      this.getGraphOilData();
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
          type: data.indicators[i].lable,
          value: data.indicators[i].value
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
            this.channelLists.forEach((element, index) => {
              if (element.lable === v.name) {
                document.getElementsByClassName('list' + index)[0].style.color = v.color;
                document.getElementsByClassName('list' + index)[0].style.fontSize = '16px';
              }
            });
          },
          mouseout: v => {
            this.channelLists.forEach((element, index) => {
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
.dbt-analysis {
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
      flex-flow: wrap;
    }
    .hardSeriesGroup {
      display: flex;
      width: calc(100% - 90px);
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
