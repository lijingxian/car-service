<template>
  <div class="general-view-analysis-terminal">
    <div slot="top">
      <show-search-grid @refreshHandle="refreshHandle" :showViewType="false">
        <div slot="description" class="description-pover">
          <p>分布情况：统计终端的分类、位置分布情况</p>
          <p>终端使用情况：统计终端启用情况</p>
          <p>功能使用情况：统计终端功能的使用情况</p>
          <p>版本分布：统计终端的硬件、软件的版本分布情况</p>
        </div>
      </show-search-grid>
    </div>
    <div class="indicators-search"  :class="{'showHide1' : showHideOperator}" v-if="getUser().roleLevel !== 'shop'">
      <div class="title">运营商</div>
      <div class="hardOperatorGroup" :class="{'showHideOperator' : showHideOperator}" ref="operatorGroup">
        <el-checkbox-button v-model="checkAllOperator" @change="handleCheckAllOperator" :indeterminate="isIndeterminateOperator">全部
        </el-checkbox-button>
        <el-tooltip placement="bottom" v-for="(item, index) in operatorList" :key="index" :disabled="item.name.length<=10">
          <el-checkbox-group v-model="checkedOperator" @change="operatorChange">
            <el-checkbox-button :label="item.id" size="mini">
              {{item.name.length>10?item.name.substr(0, 10)+'...':item.name}}
            </el-checkbox-button>
          </el-checkbox-group>
          <div slot="content">{{ item.name }}</div>
        </el-tooltip>
      </div>
    </div>
    <div class="swichOperator" v-if="showOperatorSwich">
      <i :class="classNameOperator" @click="swichOperator"></i>
    </div>
    <div class="indicators-search" :class="{'showHide1' : showHideShop}" v-if="getUser().roleLevel !== 'shop'">
      <div class="title">店铺</div>
      <div class="hardShopGroup" :class="{'showHideShop' : showHideShop}" ref="shopGroup">
        <el-checkbox-button v-model="checkAllShops" @change="handleCheckAllShops" :indeterminate="isIndeterminateShops">全部</el-checkbox-button>
        <el-tooltip placement="bottom" v-for="(item, index) in conditionData.shopsList" :key="index" :disabled="item.name.length<=10">
          <el-checkbox-group v-model="checkedShops" @change="shopsChange">
            <el-checkbox-button :label="item.id" size="mini">
              {{item.name.length>10?item.name.substr(0, 10)+'...':item.name}}
            </el-checkbox-button>
          </el-checkbox-group>
          <div slot="content">{{ item.name }}</div>
        </el-tooltip>
      </div>
    </div>
    <div class="swichShop" v-if="showShopSwich">
      <i :class="classNameShop" @click="swichShop"></i>
    </div>
    <div class="indicators-search">
      <div class="title">终端类型</div>
      <div class="hardShopGroup" :class="{'showHideShop' : showHideShop}" ref="shopGroup">
        <el-checkbox-button v-model="checkAllTerminal" @change="handleCheckAllTerminal" :indeterminate="isIndeterminate">全部</el-checkbox-button>
        <el-tooltip placement="bottom" v-for="(item, index) in conditionData.terminalList" :key="index" :disabled="item.name.length<=10">
          <el-checkbox-group v-model="checkedTerminal" @change="conditionChange">
            <el-checkbox-button :label="item.id.toString()" size="mini">
              {{item.name.length>10?item.name.substr(0, 10)+'...':item.name}}
            </el-checkbox-button>
          </el-checkbox-group>
          <div slot="content">{{ item.name }}</div>
        </el-tooltip>
      </div>
    </div>
    <div class="swich" v-if="showSwich">
      <i :class="className" @click="swich"></i>
    </div>
    <div class="total">
      <div class="column1">
        <div class="table-cell">
          设备数
          <div class="color-primary"><span class="font">{{summary.total}}</span>个</div>
        </div>
      </div>
      <div class="column2">
        <div class="table-cell">
          已绑定车辆设备数
          <div class="color-primary"><span class="font">{{summary.bingdCar}}</span>个</div>
        </div>
      </div>
      <div class="column3">
        <div class="table-cell">
          在线/离线设备数
          <div class="color-primary"><span class="font">{{summary.online}}/{{summary.offline}}</span>个</div>
        </div>
      </div>
    </div>
    <div class="chart-area">
      <div class="graph">
        <div class="header">
          <span>分布情况</span>
          <span class="font">终端分类</span>
          <i class="iconfont biz-icon-i-web-fd" @click="distributeAnalysis"></i>
        </div>
        <biz-chart :chartData="chartDataOfDistribute" :loading="loading" :showSearch="false"></biz-chart>
      </div>
      <div class="graph">
        <div class="header">
          <span>终端使用情况</span>
          <span class="font"></span>
          <i class="iconfont biz-icon-i-web-fd" @click="useAnalysis"></i>
        </div>
        <biz-chart :chartData="chartDataOfUse" :loading="loading" :showSearch="false"></biz-chart>
      </div>
    </div>
    <div class="chart-area">
      <div class="graph">
        <div class="header">
          <span>功能使用情况</span>
          <span class="font">TOP10</span>
          <i class="iconfont biz-icon-i-web-fd" @click="topAnalysis"></i>
        </div>
        <biz-chart :chartData="chartDataOfTop" :loading="loading" :showSearch="false"></biz-chart>
      </div>
      <div class="graph">
        <div class="header">
          <span>版本分布</span>
          <span class="font">硬件版本</span>
          <i class="iconfont biz-icon-i-web-fd" @click="versionAnalysis"></i>
        </div>
        <biz-chart :chartData="chartDataOfVersion" :loading="loading" :showSearch="false"></biz-chart>
      </div>
    </div>
    <el-dialog :visible.sync="dialogVisible" :title="title" width="1200px" append-to-body>
      <DistributeAnalysis ref="distributeAnalysis" v-if="showDistribute" :params="params"></DistributeAnalysis>
      <UseAnalysis ref="useAnalysis" v-if="showUse" :params="params"></UseAnalysis>
      <TopAnalysis ref="topAnalysis" v-if="showTop" :params="params"></TopAnalysis>
      <VersionAnalysis ref="versionAnalysis" v-if="showVersion" :params="params"></VersionAnalysis>
    </el-dialog>
  </div>
</template>

<script>
import BizChart from '@/components/BizChart';
import urls from '@/common/urls';
import dateTime from '@/utils/dateTime';
import http from '@/common/http';
import DistributeAnalysis from './DistributeAnalysis';
import VersionAnalysis from './VersionAnalysis';
import UseAnalysis from './UseAnalysis';
import TopAnalysis from './TopAnalysis';
import { mapGetters } from 'vuex';
import ShowSearchGrid from '../components/ShowSearchGrid';
import dateUtil from '@/utils/date';
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
      hardGroupOperatorHeight: 0,
      hardGroupShopHeight: 0,
      className: 'el-icon-caret-bottom',
      classNameOperator: 'el-icon-caret-bottom',
      classNameShop: 'el-icon-caret-bottom',
      showSwich: false,
      showOperatorSwich: false,
      showShopSwich: false,
      showHide: false,
      showHideOperator: false,
      showHideShop: false,
      showRecommend: false,
      dialogVisible: false,
      showDistribute: false,
      showUse: false,
      showTop: false,
      showVersion: false,
      isIndeterminateShops: true,
      checkAllShops: false,
      checkedShops: [],
      conditionData: [
        {
          terminalList: [],
          shopsList: []
        }
      ],
      isIndeterminateOperator: true,
      checkAllOperator: true,
      checkedOperator: [],
      operatorList: [],
      checkedTerminal: [],
      checkAllTerminal: true,
      isIndeterminate: true,
      title: '概览分析',
      summary: {},
      // filters: [
      //   {
      //     type: 'select',
      //     label: '运营商',
      //     name: 'company',
      //     value: '',
      //     options: [{ label: '全部', value: '' }],
      //     class: 'hidden'
      //   },
      //   {
      //     type: 'select',
      //     label: '店铺',
      //     name: 'shop',
      //     value: '',
      //     options: [{ label: '全部', value: '' }],
      //     class: 'hidden'
      //   }
      // ],
      kpiName: ['本期', '同比', '环比'],
      chartData: {},
      chartDataOfUse: {},
      chartDataOfDistribute: {},
      chartDataOfTop: {},
      chartDataOfVersion: {},
      isShow: 'false'
    };
  },
  methods: {
    ...mapGetters(['getUser']),
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
      if (val) {
        this.checkedShops = val
          ? this.conditionData.shopsList.map(item => {
            return item.id;
          })
          : [];
      } else {
        this.checkedShops = [];
        this.checkedShops.push(this.conditionData.shopsList[0].id);
      }
      this.getGraphData();
      this.getTable();
    },
    shopsChange(val) {
      let checkedCount = val.length;
      this.checkAllShops = checkedCount === this.conditionData.shopsList.length;
      this.isIndeterminateShops = checkedCount > 0 && checkedCount < this.conditionData.shopsList.length;
      this.query();
    },
    handleCheckAllTerminal(val) {
      this.checkedTerminal = val
        ? this.conditionData.terminalList.map(item => {
          return item.id.toString();
        })
        : [];
      this.getGraphData();
      this.getTable();
    },
    conditionChange(value) {
      let checkedCount = value.length;
      this.checkAllTerminal = checkedCount === this.conditionData.terminalList.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.conditionData.terminalList.length;
      this.query();
    },
    init() {
      let params = {
        beginDate: this.beginDate,
        endDate: this.endDate,
        terminalTypes: this.checkedTerminal.length > 0 ? this.checkedTerminal.join('&terminalTypes=') : [],
        searchShopIds: this.checkedShops
        // searchShopIds: this.checkedShops.length > 0 ? this.getCheckedShopsId.join('&searchShopIds=') : []
      };
      let paramsArr = [];
      for (let name in params) {
        paramsArr.push(`${name}=${params[name]}`);
      }
      http
        .get('/admin/ecommerce/kpi/summary/terminal/storeTerminal/summary.jhtml' + '?' + paramsArr.join('&'))
        .then(data => {
          this.summary = data.indicators;
        })
        .catch(errData => {
          this.loading = false;
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
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
            this.hardGroupOperatorHeight = document.getElementsByClassName('hardOperatorGroup')[0].offsetHeight;
            if (this.hardGroupOperatorHeight > 62) {
              this.showOperatorSwich = true;
              this.showHideOperator = true;
            } else {
              this.showOperatorSwich = false;
              this.showHideOperator = false;
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
    getShopList() {
      let param = {
        companys: this.checkedOperator
      };
      http
        .post('/admin/ecommerce/kpi/condition/json/queryShopsByMultiCompany.jhtml', param)
        .then(data => {
          this.conditionData.shopsList = data.shopDatas;
          this.checkedShops = [this.getUser().shop.id];
          this.$nextTick(() => {
            this.hardGroupShopHeight = document.getElementsByClassName('hardShopGroup')[0].offsetHeight;
            if (this.hardGroupShopHeight > 62) {
              this.showShopSwich = true;
              this.showHideShop = true;
            } else {
              this.showShopSwich = false;
              this.showHideShop = false;
            }
          });
          this.query();
        })
        .catch(error => {
          if (error.errorMessage) {
            this.$message.warning(error.errorMessage);
          }
        });
    },
    getTerminalTypeList() {
      this.loading = true;
      let param = {
        shopId: window.top.SHOP_ID || ''
      };
      http
        .get(urls.terminalMgmt.areaTypeList, param)
        .then(data => {
          this.loading = false;
          this.conditionData.terminalList = data.terminalTypeList;
          this.checkedTerminal = this.conditionData.terminalList
            ? this.conditionData.terminalList.map(item => {
              return item.id.toString();
            })
            : [];
        })
        .catch(error => {
          this.loading = false;
          if (error.errorMessage) {
            this.$message.warning(error.errorMessage);
          }
        });
    },
    query() {
      this.params = {
        viewType: this.viewType,
        beginDate: this.beginDate,
        endDate: this.endDate,
        dateType: this.dateType,
        checkedShop: this.checkedShops,
        checkedTerminal: this.checkedTerminal,
        shopIds: this.checkedShops
        // companyId: this.checkedOperator
      };
      this.getGraphVersionData();
      this.getGraphTopData();
      this.getGraphUseData();
      this.getGraphDistributeData();
      this.init();
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
    swichOperator() {
      this.classNameOperator = this.classNameOperator === 'el-icon-caret-bottom' ? 'el-icon-caret-top' : 'el-icon-caret-bottom';
      this.showHideOperator = this.classNameOperator === 'el-icon-caret-bottom';
      if (!this.showHideOperator) {
        document.getElementsByClassName('hardOperatorGroup')[0].style.height = 'auto';
      } else {
        document.getElementsByClassName('hardOperatorGroup')[0].style.height = '55px';
      }
    },
    swichShop() {
      this.classNameShop = this.classNameShop === 'el-icon-caret-bottom' ? 'el-icon-caret-top' : 'el-icon-caret-bottom';
      this.showHideShop = this.classNameShop === 'el-icon-caret-bottom';
      if (!this.showHideShop) {
        document.getElementsByClassName('hardShopGroup')[0].style.height = 'auto';
      } else {
        document.getElementsByClassName('hardShopGroup')[0].style.height = '55px';
      }
    },
    distributeAnalysis() {
      this.title = '分布情况';
      this.showUse = false;
      this.showVersion = false;
      this.showTop = false;
      this.showDistribute = true;
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs.distributeAnalysis.load();
      });
    },
    useAnalysis() {
      this.title = '终端使用情况';
      this.showDistribute = false;
      this.showVersion = false;
      this.showTop = false;
      this.showUse = true;
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs.useAnalysis.load();
      });
    },
    topAnalysis() {
      this.title = '功能使用情况';
      this.showDistribute = false;
      this.showUse = false;
      this.showVersion = false;
      this.showTop = true;
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs.topAnalysis.load();
      });
    },
    versionAnalysis() {
      this.title = '版本分布';
      this.showDistribute = false;
      this.showUse = false;
      this.showTop = false;
      this.showVersion = true;
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs.versionAnalysis.load();
      });
    },
    // 版本分布
    getGraphVersionData() {
      this.loading = true;
      let params = {
        // companyId: this.checkedOperator,
        shopIds: this.checkedShops,
        beginDate: this.beginDate,
        endDate: this.endDate,
        viewType: this.viewType,
        terminalTypes: this.checkedTerminal
      };
      http
        .post('/admin/ecommerce/kpi/graph/terminal/hardVer.jhtml', params)
        .then(data => {
          this.chartDataOfVersion = this.dataVersionFormat(data);
        })
        .catch(errData => {
          this.loading = false;
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    dataVersionFormat(data) {
      let tmpData = [];
      this.kpiName = [];
      for (let i = 0; i < data.indicators.length; i++) {
        tmpData.push({
          日期: data.indicators[i].xValue,
          本期应用数: data.indicators[i].y[0].yValue,
          同比: data.indicators[i].y[0].yoyRate,
          环比: data.indicators[i].y[0].momRate
        });
      }
      this.kpiName = ['日期', '本期应用数', '同比', '环比'];
      let chartData = {
        type: 'histogram',
        data: {
          columns: this.kpiName,
          rows: tmpData
        },
        settings: {
          axisSite: { right: ['同比', '环比'] },
          yAxisType: ['KMB', 'KMB'],
          yAxisName: ['', '%'],
          rotate: '45',
          interval: 'auto',
          showLine: [this.kpiName[2], this.kpiName[3]]
        }
      };
      return chartData;
    },
    // 功能使用情况
    getGraphTopData() {
      this.loading = true;
      let params = {
        // companyId: this.checkedOperator,
        shopIds: this.checkedShops,
        beginDate: this.beginDate,
        endDate: this.endDate,
        viewType: this.viewType,
        terminalTypes: this.checkedTerminal
      };
      http
        .post('/admin/ecommerce/kpi/graph/terminal/topX.jhtml', params)
        .then(data => {
          this.chartDataOfTop = this.dataTopFormat(data);
        })
        .catch(errData => {
          this.loading = false;
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    dataTopFormat(data) {
      let tmpData = [];
      this.kpiName = [];
      for (let i = 0; i < data.indicators.length; i++) {
        tmpData.push({
          日期: data.indicators[i].xValue,
          功能启用数: data.indicators[i].y[0].yValue,
          同比: data.indicators[i].y[0].yoyRate,
          环比: data.indicators[i].y[0].momRate
        });
      }
      this.kpiName = ['日期', '功能启用数', '同比', '环比'];
      let chartData = {
        type: 'histogram',
        data: {
          columns: this.kpiName,
          rows: tmpData
        },
        settings: {
          axisSite: { right: ['同比', '环比'] },
          yAxisType: ['KMB', 'KMB'],
          yAxisName: ['', '%'],
          rotate: '45',
          interval: 'auto',
          showLine: [this.kpiName[2], this.kpiName[3]]
        }
      };
      return chartData;
    },
    // 使用情况
    getGraphUseData() {
      this.loading = true;
      let params = {
        // companyId: this.checkedOperator,
        shopIds: this.checkedShops,
        beginDate: this.beginDate,
        endDate: this.endDate,
        viewType: this.viewType,
        terminalTypes: this.checkedTerminal
      };
      http
        .post('/admin/ecommerce/kpi/graph/terminal/trend.jhtml', params)
        .then(data => {
          this.chartDataOfUse = this.dataUseFormat(data);
        })
        .catch(errData => {
          this.loading = false;
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    dataUseFormat(data) {
      let tmpData = [];
      this.kpiName = [];
      for (let i = 0; i < data.indicators.length; i++) {
        tmpData.push({
          日期: data.indicators[i].xValue,
          终端启用数: data.indicators[i].y[0].yValue,
          同比: data.indicators[i].y[0].yoyRate,
          环比: data.indicators[i].y[0].momRate
        });
      }
      this.kpiName = ['日期', '终端启用数', '同比', '环比'];
      let chartData = {
        type: 'histogram',
        data: {
          columns: this.kpiName,
          rows: tmpData
        },
        settings: {
          axisSite: { right: ['同比', '环比'] },
          yAxisType: ['KMB', 'KMB'],
          yAxisName: ['', '%'],
          rotate: '45',
          interval: 'auto',
          showLine: [this.kpiName[2], this.kpiName[3]]
        }
      };
      return chartData;
    },
    // 分布情况
    getGraphDistributeData() {
      this.loading = true;
      let params = {
        shopIds: this.checkedShops,
        terminalTypes: this.checkedTerminal,
        viewType: this.viewType,
        beginDate: this.beginDate,
        endDate: this.endDate
      };
      http
        .post('/admin/ecommerce/kpi/car/graph/terminalTypeDistribute.jhtml', params)
        .then(data => {
          this.chartDataOfDistribute = this.dataDistributeFormat(data);
        })
        .catch(errData => {
          this.loading = false;
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    dataDistributeFormat(data) {
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
          radius: ['20%', '60%'],
          offsetY: '50%'
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
      this.query();
    },
    // filterDataChange(val) {
    //   this.filters = val;
    //   if (this.filters[0].value) {
    //     this.getShopList();
    //   }
    //   this.query();
    // },
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
    }
  },
  created() {
    this.getTerminalTypeList();
    if (this.getUser().roleLevel !== 'shop') {
      this.getCompanyList();
    } else {
      this.getGraphUseData();
      this.getGraphDistributeData();
      this.getGraphTopData();
      this.getGraphVersionData();
      this.init();
    }
  },
  components: {
    BizChart,
    DistributeAnalysis,
    UseAnalysis,
    VersionAnalysis,
    TopAnalysis,
    ShowSearchGrid
  }
};
</script>

<style lang="scss">
.general-view-analysis-terminal {
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
      flex-flow: wrap;
    }
    .hardOperatorGroup {
      display: flex;
      width: calc(100% - 90px);
      flex-flow: wrap;
    }
    .hardShopGroup {
      display: flex;
      width: calc(100% - 90px);
      flex-flow: wrap;
    }
    .hardSeriesGroup {
      display: flex;
      width: calc(100% - 90px);
    }
  }
  .swich {
    text-align: center;
    font-size: 24px;
    cursor: pointer;
    margin-top: -10px;
  }
  .swichOperator {
    text-align: center;
    font-size: 24px;
    cursor: pointer;
    margin-top: -10px;
  }
  .swichShop {
    text-align: center;
    font-size: 24px;
    cursor: pointer;
    margin-top: -10px;
  }
  .showHide {
    height: 55px;
    overflow-y: hidden;
  }
  .showHideOperator {
    height: 55px;
    overflow-y: hidden;
  }
  .showHideShop {
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
  .total {
    display: flex;
    margin-top: 20px;
    .column1 {
      border: 1px solid #d9d9d9;
      padding: 20px;
      width: 350px;
      height: 155px;
      line-height: 40px;
      margin: 0px;
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
      margin: 0px 20px 0px 20px;
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
