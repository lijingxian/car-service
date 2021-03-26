<template>
  <div class="general-view-analysis">
    <div slot="top">
      <show-search-grid @refreshHandle="refreshHandle" ref="search">
        <div slot="description" class="description-pover">
          <p>新增会员数：统计期内，新增加的会员数量</p>
          <p>会员留存率：统计期内新增会员数，有登录行为的会员数量比率。新增用户中登录用户数/新增用户数*100%。需根据统计周期来变化计算规则，日留存率、周留存率、月留存率</p>
          <p>活跃会员数：统计期内登录过APP 的会员数量，根据统计周期有日活、周活、月活</p>
          <p>会员活跃率：统计期内，活跃会员数/会员累计数*100%</p>
          <p>消费会员数：统计期内，有消费行为的会员数量</p>
          <p>会员复购率：统计期内，消费次数大于等于2次的会员数/消费会员数*100%</p>
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
        <biz-chart :chartData="chartData" :loading="loading" :showSearch="false" v-if="isShow"></biz-chart>
        <biz-list ref="list" :height="height" :tableData="tableData" style="width: 100%" v-if="!isShow">
          <el-table-column prop="mobile" label="手机号"></el-table-column>
          <el-table-column prop="createDate" label="创建日期" :formatter="createDateConverter"></el-table-column>
          <el-table-column prop="name" label="客户"></el-table-column>
          <el-table-column prop="userSource" label="用户来源" v-if="filters[0].value==='memberIns'||filters[0].value==='memberKeepRate'"></el-table-column>
          <el-table-column prop="tagName" label="活跃程度" v-if="filters[0].value==='activityQuantity'||filters[0].value==='activityRate'"></el-table-column>
          <el-table-column prop="orderConsumeTimes" label="消费次数" v-if="filters[0].value==='orderConsumeMemberCount'||filters[0].value==='activityConversionRate'||filters[0].value==='activityRepeatPurchaseRate'"></el-table-column>
        </biz-list>
        <biz-pagination :pagination="pagination" @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange" v-if="!isShow"></biz-pagination>
        <div align="right" v-if="!isShow">
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
import BizFilter from '@/components/BizTable/BizFilter';
import dateTime from '@/utils/dateTime';
import http from '@/common/http';
import urls from '@/common/urls';
import ShowSearchGrid from './components/ShowSearchGrid';
import dateUtil from '@/utils/date';
import { mapGetters } from 'vuex';
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
      pagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        total: 0
      },
      taskId: '',
      t: '',
      percentage: 0,
      tableData: [],
      summary: {},
      filters: [
        {
          type: 'single',
          label: '',
          value: 'memberIns',
          options: [
            { value: 'memberIns', label: '新增会员数' },
            { value: 'memberKeepRate', label: '会员留存率' },
            { value: 'activityQuantity', label: '活跃会员数' },
            { value: 'activityRate', label: '会员活跃率' },
            { value: 'orderConsumeMemberCount', label: '消费会员数' },
            // { value: 'activityConversionRate', label: '会员转化率' },
            { value: 'activityRepeatPurchaseRate', label: '会员复购率' }
          ]
        }
      ],
      kpiName: ['本期', '同比', '环比'],
      chartData: {},
      isShow: 'false',
      radioValue: '0',
      isIndeterminateShops: true,
      checkAllShops: true,
      checkedShops: [],
      conditionData: {
        shopsList: []
      },
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
      if (this.filters[0].value === 'memberIns' || this.filters[0].value === 'memberKeepRate') {
        this.getGraphData();
      } else if (this.filters[0].value === 'activityQuantity' || this.filters[0].value === 'activityRate') {
        this.getGraphActiveData();
      } else if (this.filters[0].value === 'orderConsumeMemberCount') {
        this.getGraphLineData();
      } else {
        this.getGraphLineRateData();
      }
      this.getTable();
    },
    indicatorChanged() {
      if (this.radioValue === '0') {
        this.isShow = true;
      } else {
        this.isShow = false;
      }
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
      this.getGraphData();
      this.getGraphActiveData();
      this.getGraphLineData();
      this.getGraphLineRateData();
      this.getTable();
    },
    shopsChange(val) {
      let checkedCount = val.length;
      this.checkAllShops = checkedCount === this.conditionData.shopsList.length;
      this.isIndeterminateShops = checkedCount > 0 && checkedCount < this.conditionData.shopsList.length;
      this.getGraphData();
      this.getGraphActiveData();
      this.getGraphLineData();
      this.getGraphLineRateData();
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
          this.checkedShops = this.getUser.shop.id ? [this.getUser.shop.id] : this.conditionData.shopsList.map(item => { return item.id; });
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
          this.getGraphData();
          this.getGraphActiveData();
          this.getGraphLineData();
          this.getGraphLineRateData();
          this.getTable();
        })
        .catch(error => {
          if (error.errorMessage) {
            this.$message.warning(error.errorMessage);
          }
        });
    },
    createDateConverter(row) {
      if (!row.createDate) return '';

      let date = new Date(row.createDate);
      return dateUtil.dateConverter(date);
    },
    getGraphData() {
      this.loading = true;
      let params = {
        viewType: this.viewType,
        indicator: this.filters[0].value,
        searchShopIds: this.checkedShops.join('&searchShopIds='),
        beginDate: this.beginDate,
        endDate: this.endDate
      };
      let paramsArr = [];
      for (let name in params) {
        paramsArr.push(`${name}=${params[name]}`);
      }
      http
        .get('/admin/ecommerce/kpi/graph/member/member.jhtml' + '?' + paramsArr.join('&'))
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
    getGraphActiveData() {
      this.loading = true;
      let params = {
        viewType: this.viewType,
        indicator: this.filters[0].value,
        beginDate: this.beginDate,
        endDate: this.endDate,
        shopIds: this.checkedShops.join('&shopIds=')
      };
      let paramsArr = [];
      for (let name in params) {
        paramsArr.push(`${name}=${params[name]}`);
      }
      http
        .get('/admin/ecommerce/kpi/graph/member/activityAnalyse.jhtml' + '?' + paramsArr.join('&'))
        .then(data => {
          this.chartData = this.dataLineFormat(data);
        })
        .catch(errData => {
          this.loading = false;
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    getGraphLineData() {
      this.loading = true;
      let params = {
        viewType: this.viewType,
        indicator: this.filters[0].value,
        beginDate: this.beginDate,
        endDate: this.endDate,
        searchShopIds: this.checkedShops.join('&searchShopIds=')
      };
      let paramsArr = [];
      for (let name in params) {
        paramsArr.push(`${name}=${params[name]}`);
      }
      http
        .get('/admin/ecommerce/kpi/graph/member/value/orderConsumeMemberCount.jhtml' + '?' + paramsArr.join('&'))
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
    getGraphLineRateData() {
      this.loading = true;
      let params = {
        viewType: this.viewType,
        indicator: this.filters[0].value,
        beginDate: this.beginDate,
        endDate: this.endDate,
        shopIds: this.checkedShops.join('&searchShopIds=')
      };
      let paramsArr = [];
      for (let name in params) {
        paramsArr.push(`${name}=${params[name]}`);
      }
      http
        .get('/admin/ecommerce/kpi/graph/member/consumeAnalyse.jhtml' + '?' + paramsArr.join('&'))
        .then(data => {
          this.chartData = this.dataLineRateFormat(data);
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
        indicator: this.filters[0].value,
        viewType: this.viewType,
        beginDate: this.beginDate,
        endDate: this.endDate,
        searchShopIds: this.checkedShops.join('&searchShopIds='),
        pageSize: this.pagination.pageSize,
        pageNumber: this.pagination.currentPage
      };
      let paramsArr = [];
      for (let name in params) {
        paramsArr.push(`${name}=${params[name]}`);
      }
      http
        .get('/admin/ecommerce/kpi/table/member/membersByAttribute.jhtml' + '?' + paramsArr.join('&'))
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
    exportStart() {
      let params = {
        indicator: this.filters[0].value,
        viewType: this.viewType,
        beginDate: this.beginDate,
        endDate: this.endDate,
        summaryType: '0',
        searchShopIds: this.checkedShops,
        pageSize: this.pagination.pageSize,
        pageNumber: this.pagination.currentPage
      };
      http
        .post('/admin/ecommerce/kpi/export/exportStart.jhtml', params)
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
        let response = await axios.get('/admin/ecommerce/kpi/export/exportResult.jhtml?taskId=' + this.taskId, { responseType: 'blob' });
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
      this.getGraphActiveData();
      this.getGraphLineData();
      this.getGraphLineRateData();
      this.getTable();
    },
    filterDataChange(val) {
      this.filters = val;
      if (this.filters[0].value === 'memberIns' || this.filters[0].value === 'memberKeepRate') {
        this.getGraphData();
      } else if (this.filters[0].value === 'activityQuantity' || this.filters[0].value === 'activityRate') {
        this.getGraphActiveData();
      } else if (this.filters[0].value === 'orderConsumeMemberCount') {
        this.getGraphLineData();
      } else {
        this.getGraphLineRateData();
      }
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
    dataLineRateFormat(data) {
      let tmpData = [];
      for (let i = 0; i < data.indicators.length; i++) {
        tmpData.push({
          日期: data.indicators[i].xValue,
          本期: data.indicators[i].y[0].yValue,
          同比: data.indicators[i].y[0].yoyRate,
          环比: data.indicators[i].y[0].momRate
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
          yAxisName: ['%', '%'],
          showLine: [this.kpiName[1], this.kpiName[2]]
        }
      };
      return chartData;
    },
    dataFormat(data) {
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
          yAxisName: ['%', '%'],
          showLine: [this.kpiName[1], this.kpiName[2]]
        }
      };
      let chartData1 = {
        type: 'histogram',
        data: {
          columns: ['日期', this.kpiName[0], this.kpiName[1], this.kpiName[2]],
          rows: tmpData
        },
        settings: {
          axisSite: { right: ['同比', '环比'] },
          yAxisType: ['normal'],
          yAxisName: ['人', '%'],
          showLine: [this.kpiName[1], this.kpiName[2]]
        }
      };
      if (this.filters[0].value === 'memberKeepRate') {
        return chartData;
      } else {
        return chartData1;
      }
    },
    dataLineFormat(data) {
      let tmpData = [];
      for (let i = 0; i < data.indicators.length; i++) {
        tmpData.push({
          日期: data.indicators[i].xValue,
          本期: data.indicators[i].y[0].yValue,
          同比: data.indicators[i].y[0].yoyRate,
          环比: data.indicators[i].y[0].momRate
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
          yAxisName: ['%', '%'],
          showLine: [this.kpiName[1], this.kpiName[2]]
        }
      };
      let chartData1 = {
        type: 'histogram',
        data: {
          columns: ['日期', this.kpiName[0], this.kpiName[1], this.kpiName[2]],
          rows: tmpData
        },
        settings: {
          axisSite: { right: ['同比', '环比'] },
          yAxisType: ['normal'],
          yAxisName: ['人', '%'],
          showLine: [this.kpiName[1], this.kpiName[2]]
        }
      };
      if (this.filters[0].value === 'activityRate') {
        return chartData;
      } else {
        return chartData1;
      }
    }
  },
  computed: {
    ...mapGetters(['getUser'])
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
.general-view-analysis {
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
      height: 100%;
      width: 100%;
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
}
</style>
