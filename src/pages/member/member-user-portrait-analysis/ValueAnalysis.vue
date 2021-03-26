<template>
  <div class="value-analysis">
    <div slot="top">
      <show-search-grid @refreshHandle="refreshHandle" ref="search">
        <div slot="description" class="description-pover">
          <p>消费价值：统计期内，会员的消费价值分布（高端用户、高潜质用户、忠诚用户、理性用户、普通用户）</p>
          <p>消费次数：统计期内，会员的消费次数分布（根据具体情况而定，如20次以下，21-50次，51-100次，101-200次，200次以上）</p>
          <p>消费能力：统计期内，会员的消费能力分布（强、较强、中等、较弱、弱）</p>
          <p>消费品质：统计期内，会员的消费品质分布（高、较高、中等、较低、低）</p>
          <p>价格敏感度：统计期内，会员的价格敏感度分布（高、较高、中等、较低、低）</p>
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
      <div class="title">消费价值</div>
      <el-checkbox-button v-model="checkAllValue" @change="handleCheckAllValue" :indeterminate="isIndeterminateValue">全部</el-checkbox-button>
      <el-checkbox-group v-model="checkedValue" @change="valueChange">
        <el-checkbox-button v-for="(condition,index) in conditionData.valueList" :label="condition.id" :key="index" size="mini">{{condition.name}}</el-checkbox-button>
      </el-checkbox-group>
    </div>
    <div class="chart-area">
      <div class="graph">
        <div class="filterSeach">
          <div class="filter-area">
            <biz-filter :filters="filters" @filterDataChange="filterDataChange"></biz-filter>
          </div>
          <div class="type-range">
            <el-radio-group v-model="radioValue" size="mini">
              <el-radio-button label="0">视图</el-radio-button>
              <el-radio-button label="1">列表</el-radio-button>
            </el-radio-group>
          </div>
        </div>
        <biz-chart :chartData="chartDataOfValue" :loading="loading" :showSearch="false" v-if="radioValue==='0' && this.filters[0].value === 'consumeValue'"></biz-chart>
        <div style="width:100%" v-if="radioValue==='0' && this.filters[0].value !== 'consumeValue'">
          <div class="content" style="width:40%;float:right;line-height:40px;font-size: 13px;padding:100px;height:70vh;overflow:auto">
            <div v-for="(list,index) in chartLists" :key="index">
              <span :class="'list'+index">{{list.lable}}:{{list.value}}人 占比{{countTotal!==0?((list.value/countTotal)*100).toFixed(2):list.value}}%</span>
            </div>
          </div>
          <biz-chart :chartData="chartData" :loading="loading" :showSearch="false"></biz-chart>
        </div>
        <biz-list ref="list" :height="height" :tableData="tableData" style="width: 100%" v-if="radioValue ==='1'">
          <el-table-column prop="memberName" label="会员名称"></el-table-column>
          <el-table-column prop="memberMobile" label="会员手机号">
            <template slot-scope="scope">
              <span @click="onClickMobile(scope.row)" class="tel-style" style="color: #ff7300;cursor: pointer;">{{scope.row.memberMobile}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="shopName" label="所属店铺"></el-table-column>
          <el-table-column prop="tagName" label="活跃行为"></el-table-column>
          <el-table-column prop="consumeValue" label="消费价值" v-if="filters[0].value==='consumeValue'"></el-table-column>
          <el-table-column prop="consumeCount" label="消费次数" v-if="filters[0].value==='orderConsumeTimes'"></el-table-column>
          <el-table-column prop="consumeAbility" label="消费能力" v-if="filters[0].value==='consumeAbility'"></el-table-column>
          <el-table-column prop="consumeQuality" label="消费品质" v-if="filters[0].value==='consumeQuality'"></el-table-column>
          <el-table-column prop="priceSensitivity" label="价格敏感度" v-if="filters[0].value==='priceSensitivity'"></el-table-column>
        </biz-list>
        <biz-pagination :pagination="pagination" @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange" v-if="radioValue ==='1'"></biz-pagination>
        <div align="right" v-if="radioValue ==='1'">
          <el-button type="primary" size="mini" @click="exportStart">导出</el-button>
        </div>
        <export-file-new ref="exportFile" :percentage="percentage" @clearTimeOut="clearTimeOut" @exportExcle="exportExcle"></export-file-new>
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
      radioValue: '0',
      countTotal: 0,
      chartLists: [],
      chartDataOfValue: {},
      chartData: {},
      isShow: 'false',
      filters: [
        {
          type: 'single',
          label: '',
          value: 'consumeValue',
          options: [
            { value: 'consumeValue', label: '消费价值' },
            { value: 'orderConsumeTimes', label: '消费次数' },
            { value: 'consumeAbility', label: '消费能力' },
            { value: 'consumeQuality', label: '消费品质' },
            { value: 'priceSensitivity', label: '价格敏感度' }
          ]
        }
      ],
      isIndeterminateShops: true,
      checkAllShops: false,
      checkedShops: [],
      conditionData: {
        shopsList: [],
        valueList: []
      },
      isIndeterminateOperator: true,
      checkAllOperator: true,
      checkedOperator: [],
      operatorList: [],
      isIndeterminateValue: true,
      checkAllValue: true,
      checkedValue: [],
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
      if (this.filters[0].value === 'consumeValue') {
        this.getGraphValueData();
      } else if (this.filters[0].value === 'orderConsumeTimes') {
        this.getGraphTimesData();
      } else {
        this.getGraphData();
      }
      this.getTable();
    },
    shopsChange(val) {
      let checkedCount = val.length;
      this.checkAllShops = checkedCount === this.conditionData.shopsList.length;
      this.isIndeterminateShops = checkedCount > 0 && checkedCount < this.conditionData.shopsList.length;
      if (this.filters[0].value === 'consumeValue') {
        this.getGraphValueData();
      } else if (this.filters[0].value === 'orderConsumeTimes') {
        this.getGraphTimesData();
      } else {
        this.getGraphData();
      }
      this.getTable();
    },
    handleCheckAllValue(val) {
      this.checkedValue = val
        ? this.conditionData.valueList.map(item => {
          return item.id;
        })
        : [];
      if (this.filters[0].value === 'consumeValue') {
        this.getGraphValueData();
      } else if (this.filters[0].value === 'orderConsumeTimes') {
        this.getGraphTimesData();
      } else {
        this.getGraphData();
      }
      this.getTable();
    },
    valueChange(val) {
      let checkedCount = val.length;
      this.checkAllValue = checkedCount === this.conditionData.valueList.length;
      this.isIndeterminateValue = checkedCount > 0 && checkedCount < this.conditionData.valueList.length;
      if (this.filters[0].value === 'consumeValue') {
        this.getGraphValueData();
      } else if (this.filters[0].value === 'orderConsumeTimes') {
        this.getGraphTimesData();
      } else {
        this.getGraphData();
      }
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
          if (this.filters[0].value === 'consumeValue') {
            this.getGraphValueData();
          } else if (this.filters[0].value === 'orderConsumeTimes') {
            this.getGraphTimesData();
          } else {
            this.getGraphData();
          };
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
        categoryType: '会员标签/消费特征/消费偏好'
      };
      http
        .get(urls.systemSetting.storeTags, params)
        .then(data => {
          this.conditionData.valueList = data.content;
          this.checkedValue = this.conditionData.valueList
            ? this.conditionData.valueList.map(item => {
              return item.id;
            })
            : [];
          if (this.filters[0].value === 'consumeValue') {
            this.getGraphValueData();
          } else if (this.filters[0].value === 'orderConsumeTimes') {
            this.getGraphTimesData();
          } else {
            this.getGraphData();
          }
          this.getTable();
        })
        .catch(errData => {
          if (errData.errorMessage) {
            this.$message.warning(errData.errorMessage);
          }
        });
    },
    exportStart() {
      let params = {
        viewType: this.viewType,
        beginDate: this.beginDate,
        endDate: this.endDate,
        shopIds: this.checkedShops,
        indicator: this.filters[0].value,
        pageSize: this.pagination.pageSize,
        pageNumber: this.pagination.currentPage
      };
      http
        .post('/admin/ecommerce/kpi/export/valueDetail/exportStart.jhtml', params)
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
        let response = await axios.get('/admin/ecommerce/kpi/export/valueDetail/exportResult.jhtml?taskId=' + this.taskId, { responseType: 'blob' });
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
    getGraphValueData() {
      this.loading = true;
      let params = {
        viewType: this.viewType,
        shopIds: this.checkedShops.join('&shopIds='),
        consumeValues: this.checkedValue.join('&consumeValues='),
        indicator: this.filters[0].value,
        beginDate: this.beginDate,
        endDate: this.endDate
      };
      let paramsArr = [];
      for (let name in params) {
        paramsArr.push(`${name}=${params[name]}`);
      }
      http
        .get('/admin/ecommerce/kpi/graph/member/valueAnalyse.jhtml' + '?' + paramsArr.join('&'))
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
    getGraphTimesData() {
      this.loading = true;
      let params = {
        viewType: this.viewType,
        searchShopIds: this.checkedShops.join('&searchShopIds='),
        consumeTagIds: this.checkedValue.join('&consumeTagIds='),
        beginDate: this.beginDate,
        endDate: this.endDate
      };
      let paramsArr = [];
      for (let name in params) {
        paramsArr.push(`${name}=${params[name]}`);
      }
      http
        .get('/admin/ecommerce/kpi/graph/member/value/orderConsumeTimes.jhtml' + '?' + paramsArr.join('&'))
        .then(data => {
          this.countTotal = 0;
          this.chartLists = data.indicators;
          for (const item of data.indicators) {
            this.countTotal += Number(item.value);
          }
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
    getGraphData() {
      if (this.filters[0].value === '0' || this.filters[0].value === '1') {
        return false;
      } else {
        this.loading = true;
        let params = {
          viewType: this.viewType,
          shopIds: this.checkedShops.join('&shopIds='),
          consumeValues: this.checkedValue.join('&consumeValues='),
          indicator: this.filters[0].value,
          beginDate: this.beginDate,
          endDate: this.endDate
        };
        let paramsArr = [];
        for (let name in params) {
          paramsArr.push(`${name}=${params[name]}`);
        }
        http
          .get('/admin/ecommerce/kpi/graph/member/valueAnalyse.jhtml' + '?' + paramsArr.join('&'))
          .then(data => {
            this.countTotal = 0;
            this.chartLists = data.indicators;
            for (const item of data.indicators) {
              this.countTotal += Number(item.value);
            }
            this.chartData = this.dataFormat(data);
          })
          .catch(errData => {
            this.loading = false;
            if (errData.errorMessage) this.$message.warning(errData.errorMessage);
          })
          .finally(data => {
            this.loading = false;
          });
      }
    },
    getTable() {
      let params = {
        indicator: this.filters[0].value,
        viewType: this.viewType,
        beginDate: this.beginDate,
        endDate: this.endDate,
        shopIds: this.checkedShops.join('&shopIds='),
        consumeValues: this.checkedValue.join('&consumeValues='),
        pageSize: this.pagination.pageSize,
        pageNumber: this.pagination.currentPage
      };
      let paramsArr = [];
      for (let name in params) {
        paramsArr.push(`${name}=${params[name]}`);
      }
      http
        .get('/admin/ecommerce/kpi/table/member/valueDetail.jhtml' + '?' + paramsArr.join('&'))
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
    filterDataChange(val) {
      this.filters = val;
      if (this.filters[0].value === 'consumeValue') {
        this.getGraphValueData();
      } else if (this.filters[0].value === 'orderConsumeTimes') {
        this.getGraphTimesData();
      } else {
        this.getGraphData();
      }
      this.getTable();
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
    refreshHandle(val) {
      this.viewType = val.viewType;
      this.beginDate = val.date[0];
      this.endDate = val.date[1];
      if (this.filters[0].value === 'consumeValue') {
        this.getGraphValueData();
      } else if (this.filters[0].value === 'orderConsumeTimes') {
        this.getGraphTimesData();
      } else {
        this.getGraphData();
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
    dataValueFormat(data) {
      let tmpData = [];
      for (let i = 0; i < data.indicators.length; i++) {
        tmpData.push({
          行为: data.indicators[i].lable,
          人数: data.indicators[i].value
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
            this.chartLists.forEach((element, index) => {
              if (element.lable === v.name) {
                document.getElementsByClassName('list' + index)[0].style.color = v.color;
                document.getElementsByClassName('list' + index)[0].style.fontSize = '16px';
              }
            });
          },
          mouseout: v => {
            this.chartLists.forEach((element, index) => {
              document.getElementsByClassName('list' + index)[0].style.color = 'black';
              document.getElementsByClassName('list' + index)[0].style.fontSize = '13px';
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
.value-analysis {
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
