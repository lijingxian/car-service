<template>
  <div class="shop-static-analysis">
    <div slot="top">
      <show-search-grid @refreshHandle="refreshHandle" :showViewType="false">
        <div slot="description" class="description-pover">
          <p>加盟情况：统计联盟各店铺的加盟情况</p>
          <p>运营趋势：统计各联盟各店铺的运营变化趋势</p>
          <p>店铺排行榜：统计联盟各店铺的排行情况</p>
          <p>店铺分布：统计联盟各店铺的规模分布情况</p>
          <p>业务分布：统计联盟各店铺的业务分布情况</p>
        </div>
      </show-search-grid>
    </div>
    <div class="indicators-search" :class="{'showHide1' : showHideOperator1}" v-if="getUser().roleLevel !== 'shop'">
      <div class="title">运营商</div>
      <div class="hardOperatorGroup1" :class="{'showHideOperator1' : showHideOperator1}" ref="operatorGroup1">
        <el-checkbox-button v-model="checkAllOperator" @change="handleCheckAllOperator" :indeterminate="isIndeterminateOperator">全部</el-checkbox-button>
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
    <div class="swichOperator1" v-if="showOperatorSwich1">
      <i :class="classNameOperator1" @click="swichOperator1"></i>
    </div>
    <!-- <div class="indicators-search" :class="{'showHide1' : showHideShop1}" v-if="getUser().roleLevel !== 'shop'">
      <div class="title">店铺</div>
      <div class="hardShopGroup1" :class="{'showHideShop1' : showHideShop1}" ref="shopGroup1">
        <el-checkbox-button v-model="checkAllShops" @change="handleCheckAllShops" :indeterminate="isIndeterminateShops">全部</el-checkbox-button>
        <el-checkbox-group v-model="checkedShop" @change="shopsChange">
          <el-checkbox-button v-for="(item,index) in conditionData.shopsList" :label="item.id" :key="index" size="mini">{{item.name}}</el-checkbox-button>
        </el-checkbox-group>
      </div>
    </div>
    <div class="swichShop1" v-if="showShopSwich1">
      <i :class="classNameShop1" @click="swichShop1"></i>
    </div> -->
    <div class="indicators-search" :class="{'showHide1' : showHideShopByShop1}"  v-if="this.getUser().roleLevel === 'shop'">
      <div class="title">店铺</div>
      <div class="hardShopGroupByShop1" :class="{'showHideShopByShop1' : showHideShopByShop1}" ref="shopGroupByShop1">
        <el-checkbox-button v-model="checkAllShopByShop" @change="handleCheckAllShopByShop" :indeterminate="isIndeterminateShopByShop">全部</el-checkbox-button>
        <el-tooltip placement="bottom" v-for="(item, index) in shopListByShop" :key="index" :disabled="item.name.length<=10">
          <el-checkbox-group :min="1" v-model="checkedShopByShop" @change="shopChangeByShop">
            <el-checkbox-button :label="item.id" size="mini">
              {{item.name.length>10?item.name.substr(0, 10)+'...':item.name}}
            </el-checkbox-button>
          </el-checkbox-group>
          <div slot="content">{{ item.name }}</div>
        </el-tooltip>
      </div>
    </div>
    <div class="swichShopByShop1" v-if="showShopSwichByShop1">
      <i :class="classNameShopByShop1" @click="swichShopByShop1"></i>
    </div>
    <div class="total">
      <div class="column1">
        <div class="table-cell">
          累计店铺数
          <div class="color-primary">
            <span class="font">{{summary.totalStoreCount}}</span>个
          </div>
        </div>
      </div>
      <div class="column2">
        <div class="table-cell">
          当期营业额
          <div class="color-primary">
            <span class="font">{{summary.turnover}}</span>万元
          </div>
          <div class="color-primary">
            环比
            <span :style="summary.turnoverMom>0?'color:red':'color:green'">
              <i :class="summary.turnoverMom>0?'iconfont biz-icon-i-sh-man-pullup':'iconfont biz-icon-i-sh-man-pulldown'"></i>
              {{summary.turnoverMom}}%
            </span>
            同比
            <span :style="summary.turnoverYoy>0?'color:red':'color:green'">
              <i :class="summary.turnoverYoy>0?'iconfont biz-icon-i-sh-man-pullup':'iconfont biz-icon-i-sh-man-pulldown'"></i>
              {{summary.turnoverYoy}}%
            </span>
          </div>
        </div>
      </div>
      <div class="column3">
        <div class="table-cell">
          当期新增会员数
          <div class="color-primary">
            <span class="font">{{summary.increaseMember}}</span>人
          </div>
          <div class="color-primary">
            环比
            <span :style="summary.increaseMemberMom>0?'color:red':'color:green'">
              <i :class="summary.increaseMemberMom>0?'iconfont biz-icon-i-sh-man-pullup':'iconfont biz-icon-i-sh-man-pulldown'"></i>
              {{summary.increaseMemberMom}}%
            </span>
            同比
            <span :style="summary.increaseMemberYoy>0?'color:red':'color:green'">
              <i :class="summary.increaseMemberYoy>0?'iconfont biz-icon-i-sh-man-pullup':'iconfont biz-icon-i-sh-man-pulldown'"></i>
              {{summary.increaseMemberYoy}}%
            </span>
          </div>
        </div>
      </div>
    </div>
    <div>
      <div class="chart-area">
        <div class="graph">
          <div class="header">
            <span>加盟情况分析</span>
            <span class="font">店铺地域分布</span>
            <i class="iconfont biz-icon-i-web-fd" @click="franchiseSituationAnalysis"></i>
          </div>
          <biz-chart style="margin-top: -35px" :chartData="chartDataOfFranchise" :loading="loading" :showSearch="false"></biz-chart>
        </div>
        <div class="graph">
          <div class="header">
            <span>运营趋势分析</span>
            <span class="font">营业额</span>
            <i class="iconfont biz-icon-i-web-fd" @click="operationTrendAnalysis"></i>
          </div>
          <biz-chart :chartData="chartDataOfOperation" :loading="loading" :showSearch="false"></biz-chart>
        </div>
      </div>
    </div>
    <div>
      <div class="chart-area-t">
        <div class="graph">
          <div class="header">
            <span>店铺排行榜</span>
            <span class="font">营业额</span>
            <i class="iconfont biz-icon-i-web-fd" @click="storeRankingAnalysis"></i>
          </div>
          <biz-chart :chartData="chartDataOfRank" :loading="loading" :showSearch="false"></biz-chart>
        </div>
        <div class="graph">
          <div class="header">
            <span>店铺分布情况</span>
            <span class="font">等级</span>
            <i class="iconfont biz-icon-i-web-fd" @click="shopDistributionAnalysis"></i>
          </div>
          <biz-chart :chartData="chartDataOfShop" :loading="loading" :showSearch="false"></biz-chart>
        </div>
        <div class="graph">
          <div class="header">
            <span>业务分布情况</span>
            <span class="font">订单类型</span>
            <i class="iconfont biz-icon-i-web-fd" @click="businessDistributionAnalysis"></i>
          </div>
          <biz-chart :chartData="chartDataOfBusiness" :loading="loading" :showSearch="false"></biz-chart>
        </div>
      </div>
    </div>
    <el-dialog :visible.sync="dialogVisible" :title="title" width="1200px" append-to-body>
      <FranchiseSituationAnalysis ref="franchiseSituationAnalysis" v-if="showFranchise" :params="params"></FranchiseSituationAnalysis>
      <OperationTrendAnalysis ref="operationTrendAnalysis" v-if="showOperation" :params="params"></OperationTrendAnalysis>
      <BusinessDistributionAnalysis ref="businessDistributionAnalysis" v-if="showBusiness" :params="params"></BusinessDistributionAnalysis>
      <ShopDistributionAnalysis ref="shopDistributionAnalysis" v-if="showDistribution" :params="params"></ShopDistributionAnalysis>
      <StoreRankingAnalysis ref="storeRankingAnalysis" v-if="showRank" :params="params"></StoreRankingAnalysis>
    </el-dialog>
  </div>
</template>

<script>
import BizChart from '@/components/BizChart';
import dateTime from '@/utils/dateTime';
import http from '@/common/http';
import urls from '@/common/urls';
import FranchiseSituationAnalysis from './FranchiseSituationAnalysis';
import OperationTrendAnalysis from './OperationTrendAnalysis';
import BusinessDistributionAnalysis from './BusinessDistributionAnalysis';
import ShopDistributionAnalysis from './ShopDistributionAnalysis';
import StoreRankingAnalysis from './StoreRankingAnalysis';
import ShowSearchGrid from '../components/ShowSearchGrid';
import { mapGetters } from 'vuex';

export default {
  name: 'ShopStaticAnalysis',
  data() {
    return {
      params: {},
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
      dialogVisible: false,
      showFranchise: false,
      showOperation: false,
      showBusiness: false,
      showDistribution: false,
      showRank: false,
      title: '加盟情况分布',
      summary: {},
      kpiName: ['本期', '同比', '环比'],
      chartDataOfFranchise: {},
      chartDataOfOperation: {},
      chartDataOfBusiness: {},
      chartDataOfRank: {},
      chartDataOfShop: {},
      conditionData: [
        {
          shopsList: []
        }
      ],
      isIndeterminateShops: true,
      checkAllShops: true,
      checkedShop: [],
      checkedShopByShop: [],
      shopListByShop: [],
      checkAllShopByShop: false,
      isIndeterminateShopByShop: false,
      isIndeterminateOperator: false,
      checkAllOperator: true,
      checkedOperator: [],
      operatorList: [],
      hardGroupHeight: 0,
      hardGroupOperatorHeight1: 0,
      hardGroupShopHeight1: 0,
      hardGroupShopHeight2: 0,
      className1: 'el-icon-caret-bottom',
      classNameOperator1: 'el-icon-caret-bottom',
      classNameShop1: 'el-icon-caret-bottom',
      classNameShopByShop1: 'el-icon-caret-bottom',
      showSwich1: false,
      showOperatorSwich1: false,
      showShopSwich1: false,
      showShopSwichByShop1: false,
      showHide1: false,
      showHideOperator1: false,
      showHideShop1: false,
      showHideShopByShop1: false
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
      this.checkedShop = val
        ? this.conditionData.shopsList.map(item => {
          return item.id;
        })
        : [];
      this.query();
    },
    shopsChange(val) {
      let checkedCount = val.length;
      this.checkAllShops = checkedCount === this.conditionData.shopsList.length;
      this.isIndeterminateShops = checkedCount > 0 && checkedCount < this.conditionData.shopsList.length;
      this.query();
    },
    shopChangeByShop(val) {
      let checkedCount = val.length;
      this.checkAllShopByShop = checkedCount === this.shopListByShop.length;
      this.isIndeterminateShopByShop = checkedCount > 0 && checkedCount < this.shopListByShop.length;
      this.query();
    },
    handleCheckAllShopByShop(val) {
      if (val) {
        this.checkedShopByShop = val
          ? this.shopListByShop.map(item => {
            return item.id;
          })
          : [];
      } else {
        this.checkedShopByShop = [];
        this.checkedShopByShop.push(this.getUser().shop.id);
      }
      this.query();
    },
    swich1() {
      this.className1 = this.className1 === 'el-icon-caret-bottom' ? 'el-icon-caret-top' : 'el-icon-caret-bottom';
      this.showHide1 = this.className1 === 'el-icon-caret-bottom';
      if (!this.showHide1) {
        document.getElementsByClassName('hardGroup1')[0].style.height = 'auto';
      } else {
        document.getElementsByClassName('hardGroup1')[0].style.height = '55px';
      }
    },
    swichOperator1() {
      this.classNameOperator1 = this.classNameOperator1 === 'el-icon-caret-bottom' ? 'el-icon-caret-top' : 'el-icon-caret-bottom';
      this.showHideOperator1 = this.classNameOperator1 === 'el-icon-caret-bottom';
      if (!this.showHideOperator1) {
        document.getElementsByClassName('hardOperatorGroup1')[0].style.height = 'auto';
      } else {
        document.getElementsByClassName('hardOperatorGroup1')[0].style.height = '55px';
      }
    },
    swichShop1() {
      this.classNameShop1 = this.classNameShop1 === 'el-icon-caret-bottom' ? 'el-icon-caret-top' : 'el-icon-caret-bottom';
      this.showHideShop1 = this.classNameShop1 === 'el-icon-caret-bottom';
      if (!this.showHideShop1) {
        document.getElementsByClassName('hardShopGroup1')[0].style.height = 'auto';
      } else {
        document.getElementsByClassName('hardShopGroup1')[0].style.height = '55px';
      }
    },
    swichShopByShop1() {
      this.classNameShopByShop1 = this.classNameShopByShop1 === 'el-icon-caret-bottom' ? 'el-icon-caret-top' : 'el-icon-caret-bottom';
      this.showHideShopByShop1 = this.classNameShopByShop1 === 'el-icon-caret-bottom';
      if (!this.showHideShopByShop1) {
        document.getElementsByClassName('hardShopGroupByShop1')[0].style.height = 'auto';
      } else {
        document.getElementsByClassName('hardShopGroupByShop1')[0].style.height = '55px';
      }
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
            if (this.hardGroupOperatorHeight1 > 62) {
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
    getShopList() {
      if (this.getUser().roleLevel === 'shop') {
        http
          .get(urls.membersMgmt.statisticsAnalysis.findEShops, { shopId: window.top.SHOP_ID || '' })
          .then(data => {
            this.shopListByShop = data.shops;
            this.checkedShopByShop.push(this.getUser().shop.id);
            this.$nextTick(() => {
              this.hardGroupHeight1 = document.getElementsByClassName('hardShopGroupByShop1')[0].offsetHeight;
              if (this.hardGroupHeight1 > 62) {
                this.showShopSwichByShop1 = true;
                this.showHideShopByShop1 = true;
              } else {
                this.showShopSwichByShop1 = false;
                this.showHideShopByShop1 = false;
              }
              this.query();
            });
          })
          .catch(errData => {
            if (errData.errorMessage) {
              this.$message.warning(errData.errorMessage);
            }
          });
      } else {
        let param = {
          companys: this.checkedOperator
        };
        http
          .post('/admin/ecommerce/kpi/condition/json/queryShopsByMultiCompany.jhtml', param)
          .then(data => {
            this.conditionData.shopsList = data.shopDatas;
            this.checkedShop = this.conditionData.shopsList
              ? this.conditionData.shopsList.map(item => {
                return item.id;
              })
              : [];
            this.$nextTick(() => {
              this.hardGroupShopHeight1 = document.getElementsByClassName('hardShopGroup1')[0].offsetHeight;
              if (this.hardGroupShopHeight1 > 62) {
                this.showShopSwich1 = true;
                this.showHideShop1 = true;
              } else {
                this.showShopSwich1 = false;
                this.showHideShop1 = false;
              }
              this.query();
            });
          })
          .catch(error => {
            if (error.errorMessage) {
              this.$message.warning(error.errorMessage);
            }
          });
      }
    },
    franchiseSituationAnalysis() {
      this.title = '加盟情况分析';
      this.showFranchise = true;
      this.showBusiness = false;
      this.showRank = false;
      this.showOperation = false;
      this.showDistribution = false;
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs.franchiseSituationAnalysis.load();
      });
    },
    operationTrendAnalysis() {
      this.title = '运营趋势分析';
      this.showFranchise = false;
      this.showBusiness = false;
      this.showRank = false;
      this.showOperation = true;
      this.showDistribution = false;
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs.operationTrendAnalysis.load();
      });
    },
    storeRankingAnalysis() {
      this.title = '店铺排行榜';
      this.showFranchise = false;
      this.showBusiness = false;
      this.showRank = true;
      this.showOperation = false;
      this.showDistribution = false;
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs.storeRankingAnalysis.load();
      });
    },
    shopDistributionAnalysis() {
      this.title = '店铺分布情况';
      this.showFranchise = false;
      this.showBusiness = false;
      this.showRank = false;
      this.showOperation = false;
      this.showDistribution = true;
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs.shopDistributionAnalysis.load();
      });
    },
    businessDistributionAnalysis() {
      this.title = '业务分布情况';
      this.showFranchise = false;
      this.showBusiness = true;
      this.showRank = false;
      this.showOperation = false;
      this.showDistribution = false;
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs.businessDistributionAnalysis.load();
      });
    },
    init() {
      this.loading = true;
      let params = {
        beginDate: this.beginDate,
        endDate: this.endDate,
        searchShopIds:
          this.getUser().roleLevel !== 'shop'
            ? this.checkedShop.join('&searchShopIds=')
            : this.checkedShopByShop.join('&searchShopIds='),
        viewType: this.viewType
      };
      let paramsArr = [];
      for (let name in params) {
        paramsArr.push(`${name}=${params[name]}`);
      }
      http
        .get('/admin/ecommerce/kpi/summary/stores/summary.jhtml' + '?' + paramsArr.join('&'))
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
    query() {
      this.init();
      this.getGraphDataOfBusiness();
      this.getGraphDataOfDistribution();
      this.getGraphDataOfFranchise();
      this.getGraphDataOfOperation();
      this.getGraphDataOfRank();
      this.params = Object.assign(this.params, { checkedShopByShop: this.checkedShopByShop });
    },
    // 加盟情况分析
    getGraphDataOfFranchise() {
      this.loading = true;
      let params = {
        viewType: this.viewType,
        searchShopIds:
          this.getUser().roleLevel !== 'shop'
            ? this.checkedShop.join('&searchShopIds=')
            : this.checkedShopByShop.join('&searchShopIds='),
        beginDate: this.beginDate,
        endDate: this.endDate
      };
      let paramsArr = [];
      for (let name in params) {
        paramsArr.push(`${name}=${params[name]}`);
      }
      http
        .get('/admin/ecommerce/kpi/table/stores/storeArea.jhtml' + '?' + paramsArr.join('&'))
        .then(data => {
          this.chartDataOfFranchise = this.dataFranchiseFormat(data);
        })
        .catch(errData => {
          this.loading = false;
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    dataFranchiseFormat(data) {
      let tmpData = [];
      let maxValue = 0;
      for (let i = 0; i < data.indicators.length; i++) {
        tmpData.push({
          位置: data.indicators[i].lable,
          数量: data.indicators[i].value
        });
        maxValue = Math.max(maxValue, Number(data.indicators[i].totalCount));
      }
      let tmpStr = JSON.stringify(tmpData);
      let str = tmpStr.replace(/省/g, '');
      str = str.replace(/市/g, '');
      str = str.replace(/自治区/g, '');
      str = str.replace(/维吾尔/g, '');
      str = str.replace(/回族/g, '');
      str = str.replace(/壮族/g, '');
      str = str.replace(/特别行政区/g, '');
      let curData = JSON.parse(str);
      let chartData = {
        type: 'map',
        legendVisible: false,
        data: {
          columns: ['位置', '数量'],
          rows: curData
        },
        maxRangeValue: maxValue || 100,
        settings: {
          selectedMode: 'single',
          dimension: '位置',
          metrics: ['数量'],
          itemStyle: {
            normal: {
              areaColor: '#fff'
            }
          }
        }
      };
      return chartData;
    },
    // 运营趋势分布
    getGraphDataOfOperation() {
      this.loading = true;
      let params = {
        viewType: this.viewType,
        beginDate: this.beginDate,
        endDate: this.endDate,
        searchShopIds:
          this.getUser().roleLevel !== 'shop'
            ? this.checkedShop.join('&searchShopIds=')
            : this.checkedShopByShop.join('&searchShopIds=')
      };
      let paramsArr = [];
      for (let name in params) {
        paramsArr.push(`${name}=${params[name]}`);
      }
      http
        .get('/admin/ecommerce/kpi/graph/store/storesOrderAmount.jhtml' + '?' + paramsArr.join('&'))
        .then(data => {
          this.chartDataOfOperation = this.dataOperationFormat(data);
        })
        .catch(errData => {
          this.loading = false;
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    dataOperationFormat(data) {
      let tmpData = [];
      for (let i = 0; i < data.indicators.length; i++) {
        tmpData.push({
          日期: data.indicators[i].xValue,
          本期: data.indicators[i].yValue,
          同比: data.indicators[i].yoyRate,
          环比: data.indicators[i].momRate
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
          yAxisType: ['normal', 'normal'],
          yAxisName: ['万元', '%'],
          showLine: [this.kpiName[1], this.kpiName[2]]
        }
      };
      return chartData;
    },
    // 店铺排行榜
    getGraphDataOfRank() {
      this.loading = true;
      let params = {
        viewType: this.viewType,
        beginDate: this.beginDate,
        endDate: this.endDate,
        searchShopIds:
          this.getUser().roleLevel !== 'shop'
            ? this.checkedShop.join('&searchShopIds=')
            : this.checkedShopByShop.join('&searchShopIds=')
      };
      let paramsArr = [];
      for (let name in params) {
        paramsArr.push(`${name}=${params[name]}`);
      }
      http
        .get('/admin/ecommerce/kpi/graph/store/storesOrderAmountRanking.jhtml' + '?' + paramsArr.join('&'))
        .then(data => {
          this.chartDataOfRank = this.dataRankFormat(data);
        })
        .catch(errData => {
          this.loading = false;
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    dataRankFormat(data) {
      let tmpData = [];
      for (let i = 0; i < data.indicators.length; i++) {
        tmpData.push({
          店铺: data.indicators[i].xValue,
          金额: data.indicators[i].yValue
        });
      }
      let chartData = {
        legendVisible: false,
        type: 'histogram',
        data: {
          columns: ['店铺', '金额'],
          rows: tmpData
        },
        settings: {
          interval: 'auto',
          rotate: '45',
          yAxisName: ['元']
        }
      };
      return chartData;
    },
    // 店铺分布情况
    getGraphDataOfDistribution() {
      this.loading = true;
      let params = {
        viewType: this.viewType,
        beginDate: this.beginDate,
        endDate: this.endDate,
        searchShopIds:
          this.getUser().roleLevel !== 'shop'
            ? this.checkedShop.join('&searchShopIds=')
            : this.checkedShopByShop.join('&searchShopIds=')
      };
      let paramsArr = [];
      for (let name in params) {
        paramsArr.push(`${name}=${params[name]}`);
      }
      http
        .get('/admin/ecommerce/kpi/graph/store/storeGrade.jhtml' + '?' + paramsArr.join('&'))
        .then(data => {
          this.chartDataOfShop = this.dataDistributionFormat(data);
        })
        .catch(errData => {
          this.loading = false;
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    dataDistributionFormat(data) {
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
    // 业务分布情况
    getGraphDataOfBusiness() {
      this.loading = true;
      let params = {
        viewType: this.viewType,
        beginDate: this.beginDate,
        endDate: this.endDate,
        searchShopIds:
          this.getUser().roleLevel !== 'shop'
            ? this.checkedShop.join('&searchShopIds=')
            : this.checkedShopByShop.join('&searchShopIds=')
      };
      let paramsArr = [];
      for (let name in params) {
        paramsArr.push(`${name}=${params[name]}`);
      }
      http
        .get('/admin/ecommerce/kpi/graph/store/storeOrderType.jhtml' + '?' + paramsArr.join('&'))
        .then(data => {
          this.chartDataOfBusiness = this.dataBusinessFormat(data);
        })
        .catch(errData => {
          this.loading = false;
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    dataBusinessFormat(data) {
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
      this.params = { viewType: this.viewType, beginDate: this.beginDate, endDate: this.endDate, dateType: val.dateType, checkedShopByShop: this.checkedShopByShop };
      this.query();
    }
  },
  computed: {},
  created() {
    if (this.getUser().roleLevel !== 'shop') {
      this.getCompanyList();
    } else {
      this.shopListByShop = [];
      this.getShopList();
    }
  },
  components: {
    BizChart,
    FranchiseSituationAnalysis,
    OperationTrendAnalysis,
    StoreRankingAnalysis,
    ShopDistributionAnalysis,
    BusinessDistributionAnalysis,
    ShowSearchGrid
  }
};
</script>

<style lang="scss">
.shop-static-analysis {
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
    .hardGroup1 {
      display: flex;
      width: calc(100% - 90px);
      flex-flow: wrap;
    }
    .hardOperatorGroup1 {
      display: flex;
      width: calc(100% - 90px);
      flex-flow: wrap;
    }
    .hardShopGroup1 {
      display: flex;
      width: calc(100% - 90px);
      flex-flow: wrap;
    }
    .hardShopGroupByShop1 {
      display: flex;
      width: calc(100% - 90px);
      flex-flow: wrap;
    }
    .hardSeriesGroup1 {
      display: flex;
      width: calc(100% - 90px);
    }
  }
  .swich1 {
    text-align: center;
    font-size: 24px;
    cursor: pointer;
    margin-top: -10px;
  }
  .swichOperator1 {
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
  .swichShopByShop1 {
    text-align: center;
    font-size: 24px;
    cursor: pointer;
    margin-top: -10px;
  }
  .showHideOperator1 {
    height: 55px;
    overflow-y: hidden;
  }
  .showHideShop1 {
    height: 55px;
    overflow-y: hidden;
  }
  .showHideShopByShop1 {
    height: 55px;
    overflow-y: hidden;
  }
  .showHide1 {
    height: 55px;
  }
  .showSeriesHide1 {
    height: 55px;
    overflow-y: hidden;
  }
  .total {
    display: flex;
    .column1 {
      border: 1px solid #d9d9d9;
      padding: 20px;
      width: 350px;
      height: 155px;
      line-height: 40px;
      margin: 0;
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
      margin: 0 20px 0 20px;
      .table-cell {
        font-size: 15px;
      }
      .color-primary {
        font-size: 13px;
        .mom-up {
          display: inline-block;
          /* display: block; */
          width: 0;
          height: 0;
          border-width: 0px 6px 10px;
          border-style: solid;
          border-color: transparent transparent red;
        }
        .mom-down {
          display: inline-block;
          /* display: block; */
          width: 0;
          height: 0;
          border-width: 10px 6px 0px;
          border-style: solid;
          border-color: green transparent transparent;
        }
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
        .mom-up {
          display: inline-block;
          /* display: block; */
          width: 0;
          height: 0;
          border-width: 0px 6px 10px;
          border-style: solid;
          border-color: transparent transparent red;
        }
        .mom-down {
          display: inline-block;
          /* display: block; */
          width: 0;
          height: 0;
          border-width: 10px 6px 0px;
          border-style: solid;
          border-color: green transparent transparent;
        }
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
      width: 50%;
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
  .chart-area-t {
    display: -webkit-box;
    .graph {
      box-shadow: 0 2px 3px rgba(0, 0, 0, 0.1);
      margin-bottom: 20px;
      margin-right: 5px;
      width: 33%;
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
