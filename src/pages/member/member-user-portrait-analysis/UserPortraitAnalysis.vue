<template>
  <div class="user-portrait-analysis">
    <div slot="top">
      <show-search-grid @refreshHandle="refreshHandle" :showViewType="false">
        <div slot="description" class="description-pover">
          <p>会员变化趋势：统计会员各行为特征的变化趋势</p>
          <p>会员属性：统计会员的属性分布</p>
          <p>消费价值：统计会员的消费行为特征</p>
          <p>活跃行为：统计会员的活跃行为特征</p>
        </div>
      </show-search-grid>
    </div>
    <div class="indicators-search" :class="{'showHide1' : showHideOperator}" v-if="getUser.roleLevel !== 'shop'">
      <div class="title">运营商：</div>
      <div class="hardOperatorGroup" :class="{'showHideOperator' : showHideOperator}" ref="operatorGroup">
        <el-checkbox-button v-model="checkAllOperator" @change="handleCheckAllOperator" :indeterminate="isIndeterminateOperator">全部
        </el-checkbox-button>
        <el-checkbox-group v-model="checkedOperator" @change="operatorChange">
          <el-checkbox-button v-for="(condition,index)  in operatorList" :label="condition.id" :key="index" size="mini">
            {{condition.name}}</el-checkbox-button>
        </el-checkbox-group>
      </div>
    </div>
    <div class="swichOperator" v-if="showOperatorSwich">
      <i :class="classNameOperator" @click="swichOperator"></i>
    </div>
    <div class="indicators-search" :class="{'showHide1' : showHideShop}" v-if="getUser.roleLevel !== 'shop'">
      <div class="title">店铺</div>
      <div class="hardShopGroup" :class="{'showHideShop' : showHideShop}" ref="shopGroup">
        <el-checkbox-button v-model="checkAllShops" @change="handleCheckAllShops" :indeterminate="isIndeterminateShops">全部</el-checkbox-button>
        <el-checkbox-group :min="1" v-model="checkedShops" @change="shopsChange">
          <el-checkbox-button v-for="(item,index) in conditionData.shopsList" :label="item.id" :key="index" size="mini">{{item.name}}</el-checkbox-button>
        </el-checkbox-group>
      </div>
    </div>
    <div class="swichShop" v-if="showShopSwich">
      <i :class="classNameShop" @click="swichShop"></i>
    </div>
    <div class="total">
      <div class="column1">
        <div class="table-cell">
          累计会员数
          <div class="color-primary">
            <span class="font">{{summary.total}}</span>人
          </div>
        </div>
      </div>
      <div class="column2">
        <div class="table-cell">
          当期消费会员数
          <div class="color-primary">
            <span class="font">{{Number(summary.consumeMember)}}</span>人
          </div>
          <div class="color-primary">
            环比
            <span :style="summary.consumeMemberMom>0?'color:red':'color:green'">
              <i :class="summary.consumeMemberMom>0?'iconfont biz-icon-i-sh-man-pullup':'iconfont biz-icon-i-sh-man-pulldown'"></i>
              {{summary.consumeMemberMom}}%
            </span>
            同比
            <span :style="summary.consumeMemberYoy>0?'color:red':'color:green'">
              <i :class="summary.consumeMemberYoy>0?'iconfont biz-icon-i-sh-man-pullup':'iconfont biz-icon-i-sh-man-pulldown'"></i>
              {{summary.consumeMemberYoy}}%
            </span>
          </div>
        </div>
      </div>
      <div class="column3">
        <div class="table-cell">
          当期活跃会员数
          <div class="color-primary">
            <span class="font">{{Number(summary.activeMember)}}</span>人
          </div>
          <div class="color-primary">
            环比
            <span :style="summary.activeMemberMom>0?'color:red':'color:green'">
              <i :class="summary.activeMemberMom>0?'iconfont biz-icon-i-sh-man-pullup':'iconfont biz-icon-i-sh-man-pulldown'"></i>
              {{summary.activeMemberMom}}%
            </span>
            同比
            <span :style="summary.activeMemberYoy>0?'color:red':'color:green'">
              <i :class="summary.activeMemberYoy>0?'iconfont biz-icon-i-sh-man-pullup':'iconfont biz-icon-i-sh-man-pulldown'"></i>
              {{summary.activeMemberYoy}}%
            </span>
          </div>
        </div>
      </div>
    </div>
    <div class="chart-area">
      <div class="graph">
        <div class="header">
          <span>会员变化趋势</span>
          <span class="font">新增会员趋势</span>
          <i class="iconfont biz-icon-i-web-fd" @click="genralAnalysis"></i>
        </div>
        <biz-chart :chartData="chartDataOfGeneral" :loading="loading" :showSearch="false"></biz-chart>
      </div>
      <div class="graph">
        <div class="header">
          <span>会员属性</span>
          <span class="font">年龄</span>
          <i class="iconfont biz-icon-i-web-fd" @click="attributeAnalysis"></i>
        </div>
        <biz-chart :chartData="chartDataOfAttribute" :loading="loading" :showSearch="false"></biz-chart>
      </div>
    </div>
    <div class="chart-area">
      <div class="graph">
        <div class="header">
          <span>消费价值</span>
          <span class="font">消费价值</span>
          <i class="iconfont biz-icon-i-web-fd" @click="valueAnalysis"></i>
        </div>
        <biz-chart :chartData="chartDataOfValue" :loading="loading" :showSearch="false"></biz-chart>
      </div>
      <div class="graph">
        <div class="header">
          <span>活跃行为</span>
          <span class="font">活跃程度</span>
          <i class="iconfont biz-icon-i-web-fd" @click="behaviorAnalysis"></i>
        </div>
        <biz-chart :chartData="chartDataOfBehavior" :loading="loading" :showSearch="false"></biz-chart>
      </div>
    </div>
    <el-dialog :visible.sync="dialogVisible" :title="title" width="1200px" append-to-body>
      <GeneralViewAnalysis ref="generalViewAnalysis" v-if="showGenral" :params="params"></GeneralViewAnalysis>
      <AttributeAnalysis ref="attributeAnalysis" v-if="showAttribute" :params="params"></AttributeAnalysis>
      <ValueAnalysis ref="valueAnalysis" v-if="showValue" :params="params"></ValueAnalysis>
      <BehaviorAnalysis ref="behaviorAnalysis" v-if="showBehavior" :params="params"></BehaviorAnalysis>
    </el-dialog>
  </div>
</template>

<script>
import BizChart from '@/components/BizChart';
import dateTime from '@/utils/dateTime';
import http from '@/common/http';
import urls from '@/common/urls';
import GeneralViewAnalysis from './GeneralViewAnalysis';
import AttributeAnalysis from './AttributeAnalysis';
import ValueAnalysis from './ValueAnalysis';
import BehaviorAnalysis from './BehaviorAnalysis';
import ShowSearchGrid from './components/ShowSearchGrid';
import { mapGetters } from 'vuex';

export default {
  name: 'UserPortraitAnalysis',
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
      showGenral: false,
      showAttribute: false,
      showValue: false,
      showBehavior: false,
      title: '会员变化趋势',
      summary: {},
      kpiName: ['本期', '同比', '环比'],
      chartDataOfGeneral: {},
      chartDataOfAttribute: {},
      chartDataOfValue: {},
      chartDataOfBehavior: {},
      isIndeterminateShops: true,
      checkAllShops: false,
      checkedShops: [],
      conditionData: {
        shopsList: []
      },
      isIndeterminateOperator: true,
      checkAllOperator: true,
      checkedOperator: [],
      operatorList: [],
      hardGroupOperatorHeight: 0,
      hardGroupShopHeight: 0,
      classNameOperator: 'el-icon-caret-bottom',
      classNameShop: 'el-icon-caret-bottom',
      showOperatorSwich: false,
      showShopSwich: false,
      showHideOperator: false,
      showHideShop: false
    };
  },
  methods: {
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
      this.checkedShops = val
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
          this.checkedShops = this.getUser.shop.id ? [this.getUser.shop.id] : this.conditionData.shopsList.map(item => { return item.id; });
          let checkedCount = this.conditionData.shopsList.length;
          this.checkAllShops = checkedCount === this.checkedShops.length;
          this.isIndeterminateShops = checkedCount > 0 && checkedCount < this.checkedShops.length;
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
    query() {
      this.getGraphDataOfGeneral();
      this.getGraphDataOfAttribute();
      this.getGraphDataOfValue();
      this.getGraphDataOfBehavior();
      this.init();
    },
    genralAnalysis() {
      this.title = '会员变化趋势';
      this.showAttribute = false;
      this.showValue = false;
      this.showBehavior = false;
      this.showGenral = true;
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs.generalViewAnalysis.load();
      });
    },
    attributeAnalysis() {
      this.title = '会员属性';
      this.showGenral = false;
      this.showValue = false;
      this.showBehavior = false;
      this.showAttribute = true;
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs.attributeAnalysis.load();
      });
    },
    valueAnalysis() {
      this.title = '消费价值';
      this.showGenral = false;
      this.showAttribute = false;
      this.showBehavior = false;
      this.showValue = true;
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs.valueAnalysis.load();
      });
    },
    behaviorAnalysis() {
      this.title = '活跃行为';
      this.showGenral = false;
      this.showAttribute = false;
      this.showValue = false;
      this.showBehavior = true;
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs.behaviorAnalysis.load();
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
    swichShop() {
      this.classNameShop = this.classNameShop === 'el-icon-caret-bottom' ? 'el-icon-caret-top' : 'el-icon-caret-bottom';
      this.showHideShop = this.classNameShop === 'el-icon-caret-bottom';
      if (!this.showHideShop) {
        document.getElementsByClassName('hardShopGroup')[0].style.height = 'auto';
      } else {
        document.getElementsByClassName('hardShopGroup')[0].style.height = '55px';
      }
    },
    init() {
      this.loading = true;
      let params = {
        beginDate: this.beginDate,
        endDate: this.endDate,
        searchShopIds: this.checkedShops.join('&searchShopIds=')
      };
      let paramsArr = [];
      for (let name in params) {
        paramsArr.push(`${name}=${params[name]}`);
      }
      http
        .get('/admin/ecommerce/kpi/summary/member/summary.jhtml' + '?' + paramsArr.join('&'))
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
    // 会员变化趋势
    getGraphDataOfGeneral() {
      this.loading = true;
      let params = {
        viewType: this.viewType,
        searchShopIds: this.checkedShops.join('&searchShopIds='),
        beginDate: this.beginDate,
        endDate: this.endDate,
        indicator: 'memberIns'
      };
      let paramsArr = [];
      for (let name in params) {
        paramsArr.push(`${name}=${params[name]}`);
      }
      http
        .get('/admin/ecommerce/kpi/graph/member/member.jhtml' + '?' + paramsArr.join('&'))
        .then(data => {
          this.chartDataOfGeneral = this.dataGeneralFormat(data);
        })
        .catch(errData => {
          this.loading = false;
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    dataGeneralFormat(data) {
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
          yAxisName: ['', '%'],
          showLine: [this.kpiName[1], this.kpiName[2]]
        }
      };
      return chartData;
    },
    // 会员属性
    getGraphDataOfAttribute() {
      this.loading = true;
      let params = {
        viewType: this.viewType,
        beginDate: this.beginDate,
        endDate: this.endDate,
        indicator: 'age',
        searchShopIds: this.checkedShops.join('&searchShopIds=')
      };
      let paramsArr = [];
      for (let name in params) {
        paramsArr.push(`${name}=${params[name]}`);
      }
      http
        .get('/admin/ecommerce/kpi/graph/member/attributeDistribution.jhtml' + '?' + paramsArr.join('&'))
        .then(data => {
          this.chartDataOfAttribute = this.dataAttributeFormat(data);
        })
        .catch(errData => {
          this.loading = false;
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    dataAttributeFormat(data) {
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
    // 消费价值
    getGraphDataOfValue() {
      this.loading = true;
      let params = {
        viewType: this.viewType,
        beginDate: this.beginDate,
        endDate: this.endDate,
        shopIds: this.checkedShops
      };
      http
        .post('/admin/ecommerce/kpi/graph/member/consumeValue.jhtml', params)
        .then(data => {
          this.chartDataOfValue = this.dataValueFormat(data);
        })
        .catch(errData => {
          this.loading = false;
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    dataValueFormat(data) {
      let tmpData = [];
      for (let i = 0; i < data.indicators.length; i++) {
        tmpData.push({
          价值: data.indicators[i].xValue,
          人数: data.indicators[i].y[0].yValue
        });
      }
      let chartData = {
        legendVisible: false,
        type: 'histogram',
        data: {
          columns: ['价值', '人数'],
          rows: tmpData
        },
        settings: {
          interval: 'auto',
          rotate: '45'
        }
      };
      return chartData;
    },
    // 活跃行为
    getGraphDataOfBehavior() {
      this.loading = true;
      let params = {
        viewType: this.viewType,
        beginDate: this.beginDate,
        endDate: this.endDate,
        shopIds: this.checkedShops
      };
      http
        .post('/admin/ecommerce/kpi/graph/member/memberActive.jhtml', params)
        .then(data => {
          this.chartDataOfBehavior = this.dataBehaviorFormat(data);
        })
        .catch(errData => {
          this.loading = false;
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    dataBehaviorFormat(data) {
      let tmpData = [];
      for (let i = 0; i < data.indicators.length; i++) {
        tmpData.push({
          行为: data.indicators[i].xValue,
          人数: data.indicators[i].y[0].yValue
        });
      }
      let chartData = {
        legendVisible: false,
        type: 'histogram',
        data: {
          columns: ['行为', '人数'],
          rows: tmpData
        },
        settings: {
          interval: 'auto',
          rotate: '45'
        }
      };
      return chartData;
    },
    refreshHandle(val) {
      this.viewType = val.viewType;
      this.beginDate = val.date[0];
      this.endDate = val.date[1];
      this.params = { viewType: this.viewType, beginDate: this.beginDate, endDate: this.endDate, dateType: val.dateType };
      this.query();
    }
  },
  computed: {
    ...mapGetters(['getUser'])
  },
  created() {
    if (this.getUser.roleLevel !== 'shop') {
      this.getCompanyList();
    } else {
      this.init();
      this.getGraphDataOfGeneral();
      this.getGraphDataOfAttribute();
      this.getGraphDataOfValue();
      this.getGraphDataOfBehavior();
    }
  },
  components: {
    BizChart,
    GeneralViewAnalysis,
    AttributeAnalysis,
    ValueAnalysis,
    BehaviorAnalysis,
    ShowSearchGrid
  }
};
</script>

<style lang="scss">
.user-portrait-analysis {
  height: 100%;
  overflow: auto;
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
    .hardOperatorGroup {
      display: flex;
      width: calc(100% - 90px);
    }
    .hardShopGroup {
      display: flex;
      width: calc(100% - 90px);
    }
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
  .total {
    display: flex;
    .column1 {
      border: 1px solid #d9d9d9;
      padding: 20px;
      width: 350px;
      height: 155px;
      line-height: 40px;
      margin-right: 40px;
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
      margin-right: 40px;
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
