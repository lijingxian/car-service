<template>
  <div class="general-view-analysis-behavior">
    <div slot="top">
      <show-search-grid @refreshHandle="refreshHandle" ref="search">
        <div slot="description" class="description-pover">
          <p>活跃程度：统计期内，会员的活跃程度分布（新用户、活跃用户、已流失用户、防流失用户、其他）</p>
          <p>登录时间：统计期内，会员的登录时间分布（上午、中午、下午、晚上、深夜）</p>
          <p>登录方式：统计期内，会员的登录方式分布（Web、微信小程序、微信公众号、IOS App，Android App）</p>
          <p>登录次数：统计期内，会员的登录次数分布（根据具体情况而定，例如：20次以下，21—50次，51—100次，101—200次，200次以上）</p>
        </div>
      </show-search-grid>
    </div>
    <div class="indicators-search" :class="{'showHide2' : showHideOperator1}" v-if="getUser.roleLevel !== 'shop'">
      <div class="title">运营商：</div>
      <div class="hardOperatorGroup1" :class="{'showHideOperator1' : showHideOperator1}" ref="operatorGroup">
        <el-checkbox-button v-model="checkAllOperator" @change="handleCheckAllOperator" :indeterminate="isIndeterminateOperator">全部
        </el-checkbox-button>
        <el-checkbox-group v-model="checkedOperator" @change="operatorChange">
          <el-checkbox-button v-for="(condition,index)  in operatorList" :label="condition.id" :key="index" size="mini">
            {{condition.name}}</el-checkbox-button>
        </el-checkbox-group>
      </div>
    </div>
    <div class="swichOperator1" v-if="showOperatorSwich1">
      <i :class="classNameOperator1" @click="swichOperator1"></i>
    </div>
    <div class="indicators-search" :class="{'showHide2' : showHideShop1}" v-if="getUser.roleLevel !== 'shop'">
      <div class="title">店铺</div>
      <div class="hardShopGroup1" :class="{'showHideShop1' : showHideShop1}" ref="shopGroup">
        <el-checkbox-button v-model="checkAllShops" @change="handleCheckAllShops" :indeterminate="isIndeterminateShops">全部</el-checkbox-button>
        <el-checkbox-group :min="1" v-model="checkedShops" @change="shopsChange">
          <el-checkbox-button v-for="(item,index) in conditionData.shopsList" :label="item.id" :key="index" size="mini">{{item.name}}</el-checkbox-button>
        </el-checkbox-group>
      </div>
    </div>
    <div class="swichShop1" v-if="showShopSwich1">
      <i :class="classNameShop1" @click="swichShop1"></i>
    </div>
    <div class="indicators-search">
      <div class="title">活跃行为</div>
      <el-checkbox-button v-model="checkAllAbility" @change="handleCheckAllAbility" :indeterminate="isIndeterminateAbility">全部</el-checkbox-button>
      <el-checkbox-group v-model="checkedAbility" @change="abilityChange">
        <el-checkbox-button v-for="(condition,index) in conditionData.abilityList" :label="condition.id" :key="index" size="mini">{{condition.name}}</el-checkbox-button>
      </el-checkbox-group>
    </div>
    <div class="chart-area">
      <div class="graph">
        <div class="filterSeach">
          <div class="filter-area">
            <el-radio-group @change="indicatorChanged" v-model="indicatorValue" size="mini">
              <el-radio-button label="memberActive">活跃程度</el-radio-button>
              <el-radio-button label="loginTime">登录时间</el-radio-button>
              <el-radio-button label="loginWay">登录方式</el-radio-button>
              <el-radio-button label="loginTimes">登录次数</el-radio-button>
            </el-radio-group>
          </div>
          <div class="type-range">
            <el-radio-group v-model="radioValue" size="mini">
              <el-radio-button label="0">视图</el-radio-button>
              <el-radio-button label="1">列表</el-radio-button>
            </el-radio-group>
          </div>
        </div>
        <biz-chart :chartData="chartDataOfHisto" :loading="loading" :showSearch="false" v-if="indicatorValue==='memberActive' && radioValue==='0'"></biz-chart>
        <div style="width:100%" v-if="indicatorValue==='loginTime' && radioValue==='0'">
          <div class="content" style="width:40%;float:right;line-height:40px;font-size: 13px;padding:100px">
            <div v-for="(list,index) in timeLists" :key="index">
              <span :class="'time-list'+index">{{list.lable}}:{{list.value}}人 占比{{timeCountTotal!==0?((list.value/timeCountTotal)*100).toFixed(2):list.value}}%</span>
            </div>
          </div>
          <biz-chart :chartData="chartDataOfLoginTime" :loading="loading" :showSearch="false"></biz-chart>
        </div>
        <div style="width:100%" v-if="indicatorValue==='loginWay' && radioValue==='0'">
          <div class="content" style="width:40%;float:right;line-height:40px;font-size: 13px;padding:100px">
            <div v-for="(list,index) in wayLists" :key="index">
              <span :class="'way-list'+index">{{list.lable}}:{{list.value}}人 占比{{wayCountTotal!==0?((list.value/wayCountTotal)*100).toFixed(2):list.value}}%</span>
            </div>
          </div>
          <biz-chart :chartData="chartDataOfLoginWay" :loading="loading" :showSearch="false"></biz-chart>
        </div>
        <div style="width:100%" v-if="indicatorValue==='loginTimes' && radioValue==='0'">
          <div class="content" style="width:40%;float:right;line-height:40px;font-size: 13px;padding:100px">
            <div v-for="(list,index) in timesLists" :key="index">
              <span :class="'times-list'+index">{{list.lable}}:{{list.value}}人 占比{{timesCountTotal!==0?((list.value/timesCountTotal)*100).toFixed(2):list.value}}%</span>
            </div>
          </div>
          <biz-chart :chartData="chartDataOfLoginTimes" :loading="loading" :showSearch="false"></biz-chart>
        </div>
        <biz-list ref="list" :height="height" :tableData="tableData" style="width: 100%" v-if="radioValue==='1'">
          <el-table-column prop="memberName" label="会员名称"></el-table-column>
          <el-table-column prop="memberMobile" label="会员手机号">
            <template slot-scope="scope">
              <span @click="onClickMobile(scope.row)" class="tel-style" style="color: #ff7300;cursor: pointer;">{{scope.row.memberMobile}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="shopName" label="店铺名称"></el-table-column>
          <el-table-column prop="consumeValue" label="消费价值"></el-table-column>
          <el-table-column prop="tagName" label="活跃程度" v-if="indicatorValue==='memberActive'"></el-table-column>
          <el-table-column prop="clientType" label="登录设备" v-if="indicatorValue==='loginWay'"></el-table-column>
          <el-table-column prop="loginTime" label="登录时间" v-if="indicatorValue==='loginWay'||indicatorValue==='loginTime'"></el-table-column>
          <el-table-column prop="loginTimes" label="登录次数" v-if="indicatorValue==='loginTimes'"></el-table-column>
        </biz-list>
        <biz-pagination :pagination="pagination" @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange" v-if="radioValue==='1'"></biz-pagination>
        <div align="right" v-if="radioValue ==='1'">
          <el-button type="primary" size="mini" @click="exportStart">导出</el-button>
        </div>
      </div>
    </div>
    <export-file-new ref="exportFile" :percentage="percentage" @clearTimeOut="clearTimeOut" @exportExcle="exportExcle"></export-file-new>
  </div>
</template>

<script>
import BizChart from '@/components/BizChart';
import { BizList, BizPagination } from '@/components/BizTable';
import dateTime from '@/utils/dateTime';
import http from '@/common/http';
import urls from '@/common/urls';
import ShowSearchGrid from './components/ShowSearchGrid';
import { mapGetters } from 'vuex';
import axios from 'axios';
import { ExportFileNew } from '@/components/BizUpload';
export default {
  name: 'ValueAnalysis',
  data() {
    return {
      loading: true,
      height: '500',
      total: 0,
      count: 0,
      typeModel: '0',
      taskId: '',
      t: '',
      percentage: 0,
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
      chartDataOfHisto: {},
      chartDataOfLoginTime: {},
      chartDataOfLoginWay: {},
      chartDataOfLoginTimes: {},
      timeLists: [],
      wayLists: [],
      timesLists: [],
      timeCountTotal: 0,
      wayCountTotal: 0,
      timesCountTotal: 0,
      radioValue: '0',
      indicatorValue: 'memberActive',
      isShow: 'false',
      isIndeterminateShops: true,
      checkAllShops: false,
      checkedShops: [],
      conditionData: {
        shopsList: [],
        abilityList: []
      },
      isIndeterminateAbility: true,
      checkAllAbility: true,
      checkedAbility: [],
      isIndeterminateOperator: true,
      checkAllOperator: true,
      checkedOperator: [],
      operatorList: [],
      hardGroupOperatorHeight1: 0,
      hardGroupShopHeight1: 0,
      classNameOperator1: 'el-icon-caret-bottom',
      classNameShop1: 'el-icon-caret-bottom',
      showOperatorSwich1: false,
      showShopSwich1: false,
      showHideOperator1: false,
      showHideShop1: false
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
      this.$refs.search.defaultDate = [dateTime.getPreThreeMonthDay(), dateTime.today()];
      if (this.params.beginDate) {
        this.beginDate = this.params.beginDate;
        this.endDate = this.params.endDate;
        this.$refs.search.defaultDate = [this.params.beginDate, this.params.endDate];
      }
      if (this.getUser.roleLevel !== 'shop') {
        this.operatorList = [];
        this.getCompanyList();
      }
      this.getTags();
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
      this.checkedShops = val
        ? this.conditionData.shopsList.map(item => {
          return item.id;
        })
        : [];
      this.getGraphHistoData();
      this.getLoginTimeGraphData();
      this.getLoginWayGraphData();
      this.getLoginTimesGraphData();
      this.getTable();
    },
    shopsChange(val) {
      let checkedCount = val.length;
      this.checkAllShops = checkedCount === this.conditionData.shopsList.length;
      this.isIndeterminateShops = checkedCount > 0 && checkedCount < this.conditionData.shopsList.length;
      this.getGraphHistoData();
      this.getLoginTimeGraphData();
      this.getLoginWayGraphData();
      this.getLoginTimesGraphData();
      this.getTable();
    },
    handleCheckAllAbility(val) {
      this.checkedAbility = val
        ? this.conditionData.abilityList.map(item => {
          return item.id;
        })
        : [];
      this.getGraphHistoData();
      this.getLoginTimeGraphData();
      this.getLoginWayGraphData();
      this.getLoginTimesGraphData();
      this.getTable();
    },
    abilityChange(val) {
      let checkedCount = val.length;
      this.checkAllAbility = checkedCount === this.conditionData.abilityList.length;
      this.isIndeterminateAbility = checkedCount > 0 && checkedCount < this.conditionData.abilityList.length;
      this.getGraphHistoData();
      this.getLoginTimeGraphData();
      this.getLoginWayGraphData();
      this.getLoginTimesGraphData();
      this.getTable();
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
    getShopList() {
      let param = {
        companys: this.checkedOperator
      };
      http
        .post('/admin/ecommerce/kpi/condition/json/queryShopsByMultiCompany.jhtml', param)
        .then(data => {
          this.conditionData.shopsList = data.shopDatas;
          this.checkedShops = this.checkedShops = this.getUser.shop.id ? [this.getUser.shop.id] : this.conditionData.shopsList.map(item => { return item.id; });
          let checkedCount = this.conditionData.shopsList.length;
          this.checkAllShops = checkedCount === this.checkedShops.length;
          this.isIndeterminateShops = checkedCount > 0 && checkedCount < this.checkedShops.length;
          this.$nextTick(() => {
            this.hardGroupShopHeight1 = document.getElementsByClassName('hardShopGroup1')[0].offsetHeight;
            if (this.hardGroupShopHeight1 > 55) {
              this.showShopSwich1 = true;
              this.showHideShop1 = true;
            } else {
              this.showShopSwich1 = false;
              this.showHideShop1 = false;
            }
          });
          this.getGraphHistoData();
          this.getLoginTimeGraphData();
          this.getLoginWayGraphData();
          this.getLoginTimesGraphData();
          this.getTable();
        })
        .catch(error => {
          if (error.errorMessage) {
            this.$message.warning(error.errorMessage);
          }
        });
    },
    getTags() {
      let params = {
        shopId: window.top.SHOP_ID || '',
        categoryType: '会员标签/流失特征/流失决策'
      };
      http
        .get(urls.systemSetting.storeTags, params)
        .then(data => {
          this.conditionData.abilityList = data.content;
          this.checkedAbility = this.conditionData.abilityList
            ? this.conditionData.abilityList.map(item => {
              return item.id;
            })
            : [];
          this.getGraphHistoData();
          this.getLoginTimeGraphData();
          this.getLoginWayGraphData();
          this.getLoginTimesGraphData();
          this.getTable();
        })
        .catch(errData => {
          if (errData.errorMessage) {
            this.$message.warning(errData.errorMessage);
          }
        });
    },
    indicatorChanged() {
      if (this.indicatorValue === 'memberActive') {
        this.getGraphHistoData();
      } else if (this.indicatorValue === 'loginTime') {
        this.getLoginTimeGraphData();
      } else if (this.indicatorValue === 'loginWay') {
        this.getLoginWayGraphData();
      } else {
        this.getLoginTimesGraphData();
      }
      this.getTable();
    },
    exportStart() {
      let params = {
        indicator: this.indicatorValue,
        viewType: this.viewType,
        beginDate: this.beginDate,
        endDate: this.endDate,
        shopIds: this.getCheckedShopsId,
        activeTagIds: this.checkedAbility,
        pageSize: this.pagination.pageSize,
        pageNumber: this.pagination.currentPage
      };
      http
        .post('/admin/ecommerce/kpi/export/activityDetail/exportStart.jhtml', params)
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
      try {
        let response = await axios.get('/admin/ecommerce/kpi/export/activityDetail/exportResult.jhtml?taskId=' + this.taskId, { responseType: 'blob' });
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
    getGraphHistoData() {
      this.loading = true;
      let params = {
        viewType: this.viewType,
        beginDate: this.beginDate,
        endDate: this.endDate,
        shopIds: this.getCheckedShopsId
      };
      http
        .post('/admin/ecommerce/kpi/graph/member/memberActive.jhtml', params)
        .then(data => {
          this.chartDataOfHisto = this.dataHistoFormat(data);
        })
        .catch(errData => {
          this.loading = false;
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    getLoginTimeGraphData() {
      this.loading = true;
      let params = {
        viewType: this.viewType,
        searchShopIds: this.getCheckedShopsId.join('&searchShopIds='),
        activeTagIds: this.checkedAbility.join('&activeTagIds='),
        beginDate: this.beginDate,
        endDate: this.endDate
      };
      let paramsArr = [];
      for (let name in params) {
        paramsArr.push(`${name}=${params[name]}`);
      }
      http
        .get('/admin/ecommerce/kpi/graph/member/behavior/loginTime.jhtml' + '?' + paramsArr.join('&'))
        .then(data => {
          this.timeCountTotal = 0;
          this.timeLists = data.indicators;
          for (const item of data.indicators) {
            this.timeCountTotal += Number(item.value);
          }
          this.chartDataOfLoginTime = this.dataLoginTimeFormat(data);
        })
        .catch(errData => {
          this.loading = false;
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
        });
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
    getLoginWayGraphData() {
      this.loading = true;
      let params = {
        viewType: this.viewType,
        searchShopIds: this.getCheckedShopsId.join('&searchShopIds='),
        activeTagIds: this.checkedAbility.join('&activeTagIds='),
        beginDate: this.beginDate,
        endDate: this.endDate
      };
      let paramsArr = [];
      for (let name in params) {
        paramsArr.push(`${name}=${params[name]}`);
      }
      http
        .get('/admin/ecommerce/kpi/graph/member/behavior/loginWay.jhtml' + '?' + paramsArr.join('&'))
        .then(data => {
          this.wayCountTotal = 0;
          this.wayLists = data.indicators;
          for (const item of data.indicators) {
            this.wayCountTotal += Number(item.value);
          }
          this.chartDataOfLoginWay = this.dataLoginWayFormat(data);
        })
        .catch(errData => {
          this.loading = false;
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    getLoginTimesGraphData() {
      this.loading = true;
      let params = {
        viewType: this.viewType,
        searchShopIds: this.getCheckedShopsId.join('&searchShopIds='),
        activeTagIds: this.checkedAbility.join('&activeTagIds='),
        beginDate: this.beginDate,
        endDate: this.endDate
      };
      let paramsArr = [];
      for (let name in params) {
        paramsArr.push(`${name}=${params[name]}`);
      }
      http
        .get('/admin/ecommerce/kpi/graph/member/behavior/loginTimes.jhtml' + '?' + paramsArr.join('&'))
        .then(data => {
          this.timesCountTotal = 0;
          this.timesLists = data.indicators;
          for (const item of data.indicators) {
            this.timesCountTotal += Number(item.value);
          }
          this.chartDataOfLoginTimes = this.dataLoginTimesFormat(data);
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
        indicator: this.indicatorValue,
        viewType: this.viewType,
        beginDate: this.beginDate,
        endDate: this.endDate,
        shopIds: this.getCheckedShopsId.join('&shopIds='),
        activeTagIds: this.checkedAbility.join('&activeTagIds='),
        pageSize: this.pagination.pageSize,
        pageNumber: this.pagination.currentPage
      };
      let paramsArr = [];
      for (let name in params) {
        paramsArr.push(`${name}=${params[name]}`);
      }
      http
        .get('/admin/ecommerce/kpi/table/member/activityDetail.jhtml' + '?' + paramsArr.join('&'))
        .then(data => {
          this.tableData = data.content;
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
    refreshHandle(val) {
      this.viewType = val.viewType;
      this.beginDate = val.date[0];
      this.endDate = val.date[1];
      this.getGraphHistoData();
      this.getLoginTimeGraphData();
      this.getLoginWayGraphData();
      this.getLoginTimesGraphData();
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
    dataHistoFormat(data) {
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
        settings: {}
      };
      return chartData;
    },
    dataLoginTimeFormat(data) {
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
            this.timeLists.forEach((element, index) => {
              if (element.lable === v.name) {
                document.getElementsByClassName('time-list' + index)[0].style.color = v.color;
                document.getElementsByClassName('time-list' + index)[0].style.fontSize = '16px';
              }
            });
          },
          mouseout: v => {
            this.timeLists.forEach((element, index) => {
              document.getElementsByClassName('time-list' + index)[0].style.color = 'black';
              document.getElementsByClassName('time-list' + index)[0].style.fontSize = '13px';
            });
          }
        }
      };
      return chartData;
    },
    dataLoginWayFormat(data) {
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
            this.wayLists.forEach((element, index) => {
              if (element.lable === v.name) {
                document.getElementsByClassName('way-list' + index)[0].style.color = v.color;
                document.getElementsByClassName('way-list' + index)[0].style.fontSize = '16px';
              }
            });
          },
          mouseout: v => {
            this.wayLists.forEach((element, index) => {
              document.getElementsByClassName('way-list' + index)[0].style.color = 'black';
              document.getElementsByClassName('way-list' + index)[0].style.fontSize = '13px';
            });
          }
        }
      };
      return chartData;
    },
    dataLoginTimesFormat(data) {
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
            this.timesLists.forEach((element, index) => {
              if (element.lable === v.name) {
                document.getElementsByClassName('times-list' + index)[0].style.color = v.color;
                document.getElementsByClassName('times-list' + index)[0].style.fontSize = '16px';
              }
            });
          },
          mouseout: v => {
            this.timesLists.forEach((element, index) => {
              document.getElementsByClassName('times-list' + index)[0].style.color = 'black';
              document.getElementsByClassName('times-list' + index)[0].style.fontSize = '13px';
            });
          }
        }
      };
      return chartData;
    },
    onClickMobile(row) {
      this.$router.push({
        path: '/member/statistics-analysis/user-portrait/single-member-portrait',
        query: { userId: row.memberId }
      });
    }
  },
  computed: {
    ...mapGetters(['getUser']),
    getCheckedShopsId() {
      let includesShops = this.checkedShops.filter(item => item.indexOf(',') >= 0);
      if (includesShops.length) {
        let ary = includesShops[0].split(',');
        let shop = this.checkedShops.filter(item => item.indexOf(',') < 0);
        ary = ary.concat(shop);
        return ary;
      } else {
        return this.checkedShops;
      }
    }
  },
  created() {},
  components: {
    BizChart,
    BizList,
    ShowSearchGrid,
    BizPagination,
    ExportFileNew
  }
};
</script>

<style lang="scss">
.general-view-analysis-behavior {
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
    .hardOperatorGroup1 {
      display: flex;
      width: calc(100% - 90px);
    }
    .hardShopGroup1 {
      display: flex;
      width: calc(100% - 90px);
    }
  }
  .showHide2 {
    height: 55px;
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
  .showHideOperator1 {
    height: 55px;
    overflow-y: hidden;
  }
  .showHideShop1 {
    height: 55px;
    overflow-y: hidden;
  }
  .chart-area {
    margin-top: 10px;
    .graph {
      box-shadow: 0 2px 3px rgba(0, 0, 0, 0.1);
      margin-bottom: 20px;
      margin-left: 1px;
      width: 100%;
      height: 100%;
      .header {
        height: 40px;
        background-color: #f7f7f7;
        font-size: 13px;
        padding: 10px;
        font-weight: 700;
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
