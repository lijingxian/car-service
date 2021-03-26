<template>
  <div class="general-view-analysis-car">
    <div slot="top">
      <show-search-grid @refreshHandle="refreshHandle" :showViewType="false" :filters="filters" @filterDataChange="filterDataChange">
        <div slot="description" class="description-pover">
          <p>检测结果：统计车辆的检测评级情况。非常棒、良好、一般、尚可、危险共5个级别。</p>
          <p>故障：统计车辆的故障情况。前5个易发故障。</p>
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
    <!-- <div class="indicators-search" v-if="this.getUser().roleLevel !== 'shop'">
      <div class="title">店铺：</div>
      <el-checkbox-button v-model="checkAllShop" @change="handleCheckAllShop" :indeterminate="isIndeterminateShop">全部
      </el-checkbox-button>
      <el-checkbox-group v-model="checkedShop" @change="shopChange">
        <el-checkbox-button v-for="(condition,index)  in shopList" :label="condition.id" :key="index" size="mini">
          {{condition.name}}</el-checkbox-button>
      </el-checkbox-group>
    </div> -->
    <div class="indicators-search" :class="{'showHide1' : showHideFleet}">
      <div class="title">车队：</div>
      <div class="hardGroupFleet" :class="{'showHideFleet' : showHideFleet}" ref="fleetGroup">
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
    <!-- <div class="swich" v-if="showSwichFleet">
      <i :class="className" @click="swichFleet"></i>
    </div> -->
    <div class="indicators-search">
      <div class="title">车况</div>
      <div class="hardShopGroup1" :class="{'showHideShop1' : showHideShop1}" ref="shopGroup">
        <el-checkbox-button v-model="checkAllCondition" @change="handleCheckAllCondition" :indeterminate="isIndeterminateCondition">
          全部
        </el-checkbox-button>
        <el-tooltip placement="bottom" v-for="(item, index) in conditionList" :key="index" :disabled="item.name.length<=10">
          <el-checkbox-group v-model="checkedCondition" @change="conditionChange">
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
      <i :class="className1" @click="swich"></i>
    </div>
    <div class="chart-area">
      <div class="graph">
        <div class="header">
          <span>检测结果</span>
          <span class="font">车况</span>
          <i class="iconfont biz-icon-i-web-fd" @click="conditionAnalysis"></i>
        </div>
        <biz-chart :chartData="chartDataOfCondition" :loading="loading" :showSearch="false"></biz-chart>
      </div>
      <div class="graph">
        <div class="header">
          <span>故障</span>
          <span class="font">故障原因</span>
          <i class="iconfont biz-icon-i-web-fd" @click="faultAnalysis"></i>
        </div>
        <biz-chart :chartData="chartDataOfFault" :loading="loading" :showSearch="false"></biz-chart>
      </div>
    </div>
    <el-dialog :visible.sync="dialogVisible" :title="title" width="1200px" append-to-body>
      <ConditionAnalysis ref="conditionAnalysis" v-if="showCondition" :params="params"></ConditionAnalysis>
      <FaultAnalysis ref="faultAnalysis" v-if="showFault" :params="params"></FaultAnalysis>
    </el-dialog>
  </div>
</template>

<script>
import BizChart from '@/components/BizChart';
// import BizFilter from '@/components/BizTable/BizFilter';
import dateTime from '@/utils/dateTime';
import http from '@/common/http';
import FaultAnalysis from './FaultAnalysis';
import ConditionAnalysis from './ConditionAnalysis';
import { mapGetters } from 'vuex';
import ShowSearchGrid from '../components/ShowSearchGrid';
import dateUtil from '@/utils/date';
import urls from '@/common/urls';
export default {
  name: 'GeneralViewAnalysis',
  data() {
    return {
      params: {},
      loading: true,
      height: '500',
      beginDate: dateTime.getPreThreeMonthDay(),
      endDate: dateTime.today(),
      viewType: 'month',
      dateType: 'month',
      pagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        total: 0
      },
      tableData: [],
      hardGroupHeight: 0,
      hardGroupFleetHeight: 0,
      className: 'el-icon-caret-bottom',
      className1: 'el-icon-caret-bottom',
      showSwich: false,
      showHide: false,
      showSwichFleet: false,
      showHideFleet: false,
      showHideShop1: false,
      showRecommend: false,
      dialogVisible: false,
      showCondition: false,
      showFault: false,
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
      checkAllFleet: false,
      isIndeterminateFleet: true,
      checkedBrand: [],
      brandList: [],
      checkAllBrand: true,
      isIndeterminateBrand: true,
      checkedCondition: ['0', '1', '2', '3', '4'],
      conditionList: [
        { id: '0', name: '非常棒' },
        { id: '1', name: '良好' },
        { id: '2', name: '一般' },
        { id: '3', name: '尚可' },
        { id: '4', name: '危险' }
      ],
      checkAllCondition: true,
      isIndeterminateCondition: true,
      title: '概览分析',
      summary: {},
      filters: [
        {
          type: 'select',
          label: '运营商',
          name: 'company',
          value: '',
          options: [{ label: '全部', value: '' }],
          class: 'hidden'
        },
        {
          type: 'select',
          label: '店铺',
          name: 'shop',
          value: '',
          options: [{ label: '全部', value: '' }],
          class: 'hidden'
        }
      ],
      chartData: {},
      chartDataOfCondition: {},
      chartDataOfFault: {},
      isShow: 'false'
    };
  },
  methods: {
    ...mapGetters(['getUser']),
    operatorChange() {},
    handleCheckAllOperator() {},
    shopChange(val) {
      let checkedCount = val.length;
      this.checkAllFleet = checkedCount === this.shopList.length;
      this.isIndeterminateShop = checkedCount > 0 && checkedCount < this.shopList.length;
      this.getBrandsList();
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
    conditionChange(val) {
      let checkedCount = val.length;
      this.checkAllCondition = checkedCount === this.conditionList.length;
      this.isIndeterminateCondition = checkedCount > 0 && checkedCount < this.conditionList.length;
      this.query();
    },
    handleCheckAllCondition(val) {
      this.checkedCondition = val ? this.conditionList.map(item => { return item.id; }) : [];
      this.query();
    },
    query() {
      this.params = {
        viewType: this.viewType,
        beginDate: this.beginDate,
        endDate: this.endDate,
        dateType: this.dateType,
        checkedShop: this.checkedShop,
        checkedFleet: this.checkedFleet,
        checkedBrand: this.checkedBrand,
        checkedCondition: this.checkedCondition
      };
      this.getGraphFaultData();
      this.getGraphConditionData();
    },
    getCompanyList() {
      http
        .get(urls.terminalMgmt.Component_queryOperators)
        .then(data => {
          console.log('运营商', data);
          this.companyList = [];
          if (data.content.length) {
            data.content.forEach(element => {
              this.filters[0].options.push({ label: element.name, value: element.id });
            });
            console.log('111', this.companyList);
            this.getShopList();
          }
        })
        .catch(error => {
          if (error.errorMessage) {
            this.$message.warning(error.errorMessage);
          }
        });
    },
    getShopList() {
      let param = {
        companyId: this.filters[0].value
      };
      http
        .get(urls.terminalMgmt.BaseInfo_queryShopList, param)
        .then(data => {
          console.log('店铺', data);
          this.filters[1].options = [{ label: '全部', value: '' }];
          if (data.shopDatas.length) {
            data.shopDatas.forEach(element => {
              this.filters[1].options.push({ label: element.name, value: element.id });
            });
          }
          this.getBrandsList();
          this.getfleetList();
        })
        .catch(error => {
          if (error.errorMessage) {
            this.$message.warning(error.errorMessage);
          }
        });
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
          this.checkedBrand = this.brandList ? this.brandList : [];
          this.$nextTick(() => {
            this.hardGroupHeight = document.getElementsByClassName('hardGroup')[0].offsetHeight;
            if (this.hardGroupHeight > 54) {
              this.showSwich = true;
              this.showHide = true;
            } else {
              this.showSwich = false;
              this.showHide = false;
            }
          });
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
          // this.checkedFleet = this.fleetList ? this.fleetList.map(item => { return item.id; }) : [];
          // this.$nextTick(() => {
          //   this.hardGroupFleetHeight = document.getElementsByClassName('hardGroupFleet')[0].offsetHeight;
          //   console.log(this.hardGroupFleetHeight);
          //   if (this.hardGroupFleetHeight > 54) {
          //     this.showSwichFleet = true;
          //     this.showHideFleet = true;
          //   } else {
          //     this.showSwichFleet = false;
          //     this.showHideFleet = false;
          //   }
          // });
          this.query();
        })
        .catch(error => {
          this.loading = false;
          if (error.errorMessage) {
            this.$message.warning(error.errorMessage);
          }
        });
    },
    swich() {
      this.className1 = this.className1 === 'el-icon-caret-bottom' ? 'el-icon-caret-top' : 'el-icon-caret-bottom';
      this.showHide = this.className1 === 'el-icon-caret-bottom';
      if (!this.showHide) {
        document.getElementsByClassName('hardGroup')[0].style.height = 'auto';
      } else {
        document.getElementsByClassName('hardGroup')[0].style.height = '55px';
      }
    },
    swichFleet() {
      this.className = this.className === 'el-icon-caret-bottom' ? 'el-icon-caret-top' : 'el-icon-caret-bottom';
      this.showHideFleet = this.className === 'el-icon-caret-bottom';
      if (!this.showHideFleet) {
        document.getElementsByClassName('hardGroupFleet')[0].style.height = 'auto';
      } else {
        document.getElementsByClassName('hardGroupFleet')[0].style.height = '55px';
      }
    },
    conditionAnalysis() {
      this.title = '检测结果';
      this.showCondition = true;
      this.showFault = false;
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs.conditionAnalysis.load();
      });
    },
    faultAnalysis() {
      this.title = '故障';
      this.showFault = true;
      this.showCondition = false;
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs.faultAnalysis.load();
      });
    },
    // 故障
    getGraphFaultData() {
      this.loading = true;
      let params = {
        viewType: this.viewType,
        beginDate: this.beginDate,
        endDate: this.endDate,
        shopIds: this.checkedShop,
        fleets: this.checkedFleet,
        brands: this.checkedBrand,
        carConditions: this.checkedCondition
      };
      http
        .post('/admin/ecommerce/kpi/car/graph/carFaultReason.jhtml', params)
        .then(data => {
          this.chartDataOfFault = this.dataFaultFormat(data);
        })
        .catch(errData => {
          this.loading = false;
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    dataFaultFormat(data) {
      let tmpData = [];
      for (let i = 0; i < data.indicators.length; i++) {
        tmpData.push({
          故障原因: data.indicators[i].xValue,
          故障分布: data.indicators[i].y[0].yValue
        });
      }
      let chartData = {
        legendVisible: false,
        type: 'histogram',
        data: {
          columns: ['故障原因', '故障分布'],
          rows: tmpData
        },
        settings: {
          rotate: '45',
          interval: 'auto',
          yAxisName: ['辆']
        }
      };
      return chartData;
    },
    // 检测结果-车况
    getGraphConditionData() {
      this.loading = true;
      let params = {
        viewType: this.viewType,
        beginDate: this.beginDate,
        endDate: this.endDate,
        shopIds: this.checkedShop,
        fleets: this.checkedFleet,
        brands: this.checkedBrand,
        carConditions: this.checkedCondition
      };
      http
        .post('/admin/ecommerce/kpi/car/graph/carCondition.jhtml', params)
        .then(data => {
          this.chartDataOfCondition = this.dataConditionFormat(data);
        })
        .catch(errData => {
          this.loading = false;
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    dataConditionFormat(data) {
      let tmpData = [];
      for (let i = 0; i < data.indicators.length; i++) {
        tmpData.push({
          车况: data.indicators[i].xValue,
          车况分布: data.indicators[i].y[0].yValue
        });
      }
      let chartData = {
        legendVisible: false,
        type: 'histogram',
        data: {
          columns: ['车况', '车况分布'],
          rows: tmpData
        },
        settings: {
          yAxisName: ['辆']
        }
      };
      return chartData;
    },
    refreshHandle(val) {
      this.viewType = val.viewType;
      this.beginDate = val.date[0];
      this.endDate = val.date[1];
      this.dateType = val.dateType;
      this.params = { viewType: this.viewType, beginDate: this.beginDate, endDate: this.endDate, dateType: val.dateType };
      this.getGraphConditionData();
      this.getGraphFaultData();
    },
    filterDataChange(val) {
      this.filters = val;
      this.getShopList();
      this.filters[1].value && this.checkedShop.push(this.filters[1].value);
    },
    handleSizeChange(val) {
      this.pagination.pageSize = val;
    },
    handleCurrentChange(val) {
      this.pagination.currentPage = val;
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
    },
    pokerHistory() {
      return this.filters[0].value;
    }
  },
  watch: {
    pokerHistory(newValue, oldValue) {
      this.filters[1].value = '';
    }
  },
  created() {
    if (this.getUser().roleLevel !== 'shop') {
      this.filters[0].class = 'show';
      this.filters[1].class = 'show';
      this.getCompanyList();
    } else {
      this.getShopList();
    }
  },
  components: {
    BizChart,
    FaultAnalysis,
    ConditionAnalysis,
    ShowSearchGrid
  }
};
</script>

<style lang="scss">
.general-view-analysis-car {
  height: 100%;
  overflow: auto;
  margin: 20px 0px 20px 20px;
  padding-bottom: 20px;
  padding-right: 10px;
  min-width: 560px;
  .indicators-search {
    display: -webkit-box;
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
      height: 100%;
    }
    .hardGroup {
      display: flex;
      width: calc(100% - 90px);
      flex-flow: wrap;
    }
    .hardGroupFleet {
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
  .swich {
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
  .showHideFleet {
    height: 55px;
    overflow-y: hidden;
  }
  .showSeriesHide {
    height: 55px;
    overflow-y: hidden;
  }
  .total {
    display: flex;
    margin-top: 20px;
    .column1 {
      border: 1px solid #d9d9d9;
      padding: 20px;
      width: 350px;
      height: 155px;
      line-height: 40px;
      margin: 0px 20px 0px 0px;
      .table-cell {
        font-size: 15px;
      }
      .color-primary {
        font-size: 13px;
        .font {
          font-size: 32px;
          color: #000000;
          font-weight: bold;
        }
      }
    }
    .column2 {
      border: 1px solid #d9d9d9;
      padding: 20px;
      width: 350px;
      height: 155px;
      line-height: 40px;
      margin: 0px 0px 0px 20px;
      .table-cell {
        font-size: 15px;
      }
      .color-primary {
        font-size: 13px;
        .font {
          font-size: 32px;
          color: #000000;
          font-weight: bold;
        }
      }
    }
    .column3 {
      border: 1px solid #d9d9d9;
      padding: 20px;
      width: 350px;
      height: 155px;
      line-height: 40px;
      margin: 0px 5px 0px 20px;
      .table-cell {
        font-size: 15px;
      }
      .color-primary {
        font-size: 13px;
        .font {
          font-size: 32px;
          color: #000000;
          font-weight: bold;
        }
      }
    }
  }
  .chart-area {
    margin-top: 10px;
    display: flex;
    .graph {
      box-shadow: 0 2px 3px rgba(0, 0, 0, 0.1);
      margin-bottom: 20px;
      margin-right: 5px;
      width: 49%;
      height: 32vw;
      .header {
        height: 40px;
        background-color: #f7f7f7;
        font-size: 13px;
        padding: 10px;
        font-weight: 700;
        display: flex;
        justify-content: space-between;
        .font {
          color: #666666;
          font-weight: normal;
        }
        .iconfont {
          font-size: 26px;
          cursor: pointer;
        }
      }
      .filterSeach {
        margin-top: 10px;
        .type-range {
          float: right;
        }
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
