<template>
  <div class="supplier-analysis-invoice">
    <div slot="top">
      <show-search-grid @refreshHandle="refreshHandle" ref="search">
        <div slot="description" class="description-pover">
          <p>订单数量：统计向代理商销售订单数量情况</p>
          <p>订单金额：统计向代理商销售订单金额情况</p>
        </div>
      </show-search-grid>
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
    <div class="swichShop1" v-if="showShopSwich1">
      <i :class="classNameShop1" @click="swichShop1"></i>
    </div>
    <div class="indicators-search">
      <div class="title">代理商</div>
      <div class="hardShopGroup1"  ref="shopGroup">
        <el-checkbox-button v-model="checkAllSupplier" @change="handleCheckAllSupplier" :indeterminate="isIndeterminateSupplier">全部
        </el-checkbox-button>
        <el-tooltip placement="bottom" v-for="(item,index)  in conditionData.supplierList" :key="index" :disabled="item.name.length<=10">
          <el-checkbox-group :min="1" v-model="checkedSupplier" @change="supplierChange">
            <el-checkbox-button :label="item.id" size="mini">
              {{item.name.length>10?item.name.substr(0, 10)+'...':item.name}}
            </el-checkbox-button>
          </el-checkbox-group>
          <div slot="content">{{ item.name }}</div>
        </el-tooltip>
      </div>
    </div>
    <div class="indicators-search">
      <div class="title">订单状态</div>
      <div class="hardShopGroup1"  ref="shopGroup">
        <el-checkbox-button v-model="checkAllState" @change="handleCheckAllState" :indeterminate="isIndeterminateState">全部
        </el-checkbox-button>
        <el-tooltip placement="bottom" v-for="(item, index) in conditionData.stateList" :key="index" :disabled="item.name.length<=10">
          <el-checkbox-group :min="1" v-model="checkedState" @change="stateChange">
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
              <el-radio-button label="agentOrderNum">订单数量</el-radio-button>
              <el-radio-button label="agentOrderAmount">订单金额</el-radio-button>
              <el-radio-button label="agentPaymentCycle">付款周期</el-radio-button>
              <el-radio-button label="agentProductNum">商品情况</el-radio-button>
              <el-radio-button label="agentShippingCycle">发货周期</el-radio-button>
              <!-- <el-radio-button label="syqk">使用平台情况</el-radio-button> -->
            </el-radio-group>
          </div>
          <div class="type-range">
            <el-radio-group v-model="radioValue" size="mini">
              <el-radio-button label="0">视图</el-radio-button>
              <el-radio-button label="1">列表</el-radio-button>
            </el-radio-group>
          </div>
        </div>
        <div class="content" style="width:40%;float:right;line-height:40px;font-size: 13px;padding:100px;height:600px;overflow:auto" v-show="radioValue==='0'&&indicatorValue==='agentProductNum'">
          <div v-for="(list,index) in channelLists" :key="index">
            <span :class="'list'+index">
              {{list.xValue}}:{{list.y[0].yValue}}个
              占比{{countTotal!==0?((list.y[0].yValue/countTotal)*100).toFixed(2):list.y[0].yValue}}%
            </span>
          </div>
        </div>
        <biz-chart :chartData="chartData" :loading="loading" :showSearch="false" v-if="radioValue==='0'"></biz-chart>
        <biz-list ref="list" :height="height" :tableData="tableData" style="width: 100%" v-show="radioValue==='1'&&(indicatorValue==='agentOrderNum'||indicatorValue==='agentOrderAmount')">
          <el-table-column prop="agentName" label="代理商"></el-table-column>
          <el-table-column prop="orderQuantity" label="订单数量"></el-table-column>
          <el-table-column prop="productQuantity" label="商品数量"></el-table-column>
          <el-table-column prop="amount" label="商品金额"></el-table-column>
          <el-table-column prop="returnQuantity" label="退货数量"></el-table-column>
          <el-table-column prop="returnAmount" label="退货金额"></el-table-column>
        </biz-list>
        <biz-list ref="list" :height="height" :tableData="tableData" style="width: 100%" v-show="radioValue==='1'&&(indicatorValue==='agentPaymentCycle'||indicatorValue==='agentShippingCycle')">
          <el-table-column prop="sn" label="订单编号"></el-table-column>
          <el-table-column prop="state" label="状态"></el-table-column>
          <el-table-column prop="supplierName" label="代理商"></el-table-column>
          <el-table-column prop="" label="商品信息" width="300">
            <template slot-scope="scope">
              <div>
                <div v-for="orderItem in scope.row.orderItems" :key="orderItem.id">
                  {{orderItem.fullName}}
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="returnQuantity" label="商品价格*数量">
            <template slot-scope="scope">
              <div>
                <div v-for="orderItem in scope.row.orderItems" :key="orderItem.id">
                  {{orderItem.price}}*{{orderItem.quantity}}
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="amount" label="金额"></el-table-column>
          <el-table-column prop="paymentCycle" label="付款周期"></el-table-column>
          <el-table-column prop="paymentCount" label="付款次数"></el-table-column>
          <el-table-column prop="shippingCycle" label="发货周期"></el-table-column>
          <el-table-column prop="shippingCount" label="发货次数"></el-table-column>
        </biz-list>
        <biz-list ref="list" :height="height" :tableData="tableData" style="width: 100%" v-show="radioValue==='1'&&indicatorValue==='agentProductNum'">
          <el-table-column prop="supplierName" label="代理商"></el-table-column>
          <el-table-column prop="productName" label="商品名称"></el-table-column>
          <el-table-column prop="barCode" label="商品条码"></el-table-column>
          <el-table-column prop="productQuantity" label="数量"></el-table-column>
          <el-table-column prop="amount" label="金额"></el-table-column>
          <!-- <el-table-column prop="" label="累计数量"></el-table-column>
          <el-table-column prop="" label="累计金额"></el-table-column> -->
        </biz-list>
        <biz-list ref="list" :height="height" :tableData="tableData" style="width: 100%" v-show="radioValue==='1'&&indicatorValue==='syqk'">
          <el-table-column prop="supplierName" label="代理商"></el-table-column>
          <el-table-column prop="orderQuantity" label="登录次数"></el-table-column>
          <el-table-column prop="productQuantity" label="留存时长"></el-table-column>
        </biz-list>
        <biz-pagination :pagination="pagination" @size-change="handleSizeChange" @current-change="handleCurrentChange" v-show="radioValue==='1'"></biz-pagination>
        <div align="right" v-if="radioValue==='1'">
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
import ShowSearchGrid from '../components/ShowSearchGrid';
import dateTime from '@/utils/dateTime';
import http from '@/common/http';
import axios from 'axios';
import { mapGetters } from 'vuex';
import urls from '@/common/urls';
import { ExportFileNew } from '@/components/BizUpload';
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
      taskId: '',
      t: '',
      percentage: 0,
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
      isIndeterminateState: true,
      checkAllState: true,
      checkedState: [],
      isIndeterminateSupplier: true,
      checkAllSupplier: true,
      checkedSupplier: [],
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
      indicatorValue: 'agentOrderNum'
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
    ...mapGetters(['getUser']),
    clearTimeOut() {
      window.clearTimeout(this.t);
    },
    handleCheckAllSupplier(val) {
      this.checkedSupplier = val
        ? this.conditionData.supplierList.map(item => {
          return item.id;
        })
        : [];
    },
    supplierChange(val) {
      let checkedCount = val.length;
      this.checkAllSupplier = checkedCount === this.conditionData.supplierList.length;
      this.isIndeterminateSupplier = checkedCount > 0 && checkedCount < this.conditionData.supplierList.length;
      this.query();
    },
    handleCheckAllState(val) {
      this.checkedState = val
        ? this.conditionData.stateList.map(item => {
          return item.id;
        })
        : [];
      this.query();
    },
    statesChange(val) {
      let checkedCount = val.length;
      this.checkAllState = checkedCount === this.conditionData.stateList.length;
      this.isIndeterminateState = checkedCount > 0 && checkedCount < this.conditionData.stateList.length;
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
          this.checkedShops = this.params.checkedShops || [];
          this.$nextTick(() => {
            this.hardGroupShopHeight1 = document.getElementsByClassName('hardShopGroup1')[3].offsetHeight;
            console.log(this.hardGroupShopHeight1);
            if (this.hardGroupShopHeight1 > 55) {
              this.showShopSwich1 = true;
              this.showHideShop1 = true;
            } else {
              this.showShopSwich1 = false;
              this.showHideShop1 = false;
            }
          });
          this.getSupplierList();
        })
        .catch(error => {
          if (error.errorMessage) {
            this.$message.warning(error.errorMessage);
          }
        });
    },
    getSupplierList() {
      let param = {
        shopIds: this.checkedShops,
        type: '1'
      };
      http
        .post('/admin/ecommerce/kpi/purchase/condition/cooperationInfos.jhtml', param)
        .then(data => {
          this.conditionData.supplierList = data.dataList;
          this.checkedSupplier = this.params.checkedSupplier || (this.conditionData.supplierList
            ? this.conditionData.supplierList.map(item => {
              return item.id;
            })
            : []);
          this.query();
        })
        .catch(error => {
          if (error.errorMessage) {
            this.$message.warning(error.errorMessage);
          }
        });
    },
    getStatesList() {
      let param = {};
      http
        .get('/admin/ecommerce/kpi/purchase/condition/orderStates.jhtml', param)
        .then(data => {
          this.conditionData.stateList = data.orderStates;
          this.checkedState = this.params.checkedState || (this.conditionData.stateList
            ? this.conditionData.stateList.map(item => {
              return item.id;
            })
            : []);
        })
        .catch(error => {
          if (error.errorMessage) {
            this.$message.warning(error.errorMessage);
          }
        });
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
      this.getStatesList();
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
      let url = '/admin/ecommerce/kpi/purchase/graph/columnGraphRank.jhtml';
      if (this.indicatorValue === 'agentProductNum' || this.indicatorValue === 'agentPaymentCycle' || this.indicatorValue === 'agentShippingCycle') {
        url = '/admin/ecommerce/kpi/purchase/graph/columnGraphMults.jhtml';
      }
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
        .post(url, params)
        .then(data => {
          if (this.indicatorValue === 'agentOrderNum' || this.indicatorValue === 'agentOrderAmount') {
            this.chartData = this.dataFormat(data);
          } else if (this.indicatorValue === 'agentProductNum') {
            this.countTotal = 0;
            this.channelLists = data.indicators;
            for (const item of data.indicators) {
              this.countTotal += Number(item.y[0].yValue);
            }
            this.chartData = this.dataFormatWork(data);
          } else {
            this.chartData = this.dataFormatZf(data);
          }
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
        dimensions: this.indicatorValue === 'agentProductNum' ? ['productId', 'relatePartnerId'] : [],
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
        .post('/admin/ecommerce/kpi/purchase/table/purchase.jhtml', params)
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
    exportStart() {
      let params = {
        indicators: [this.indicatorValue],
        dimensions: this.indicatorValue === 'agentProductNum' ? ['productId', 'relatePartnerId'] : [],
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
        .post('/admin/ecommerce/kpi/purchase/export/purchase/exportStart.jhtml', params)
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
        let response = await axios.get('/admin/ecommerce/kpi/purchase/export/purchase/exportResult.jhtml?taskId=' + this.taskId, { responseType: 'blob' });
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
          yAxisType: ['KMB', 'KMB'],
          yAxisName: ['', '%'],
          showLine: [this.kpiName[1], this.kpiName[2]]
        }
      };
      return chartData;
    },
    dataFormatWork(data) {
      let tmpData = [];
      for (let i = 0; i < data.indicators.length; i++) {
        tmpData.push({
          type: data.indicators[i].xValue,
          value: data.indicators[i].y[0].yValue
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
    dataFormatZf(data) {
      let tmpData = [];
      for (let i = 0; i < (data.indicators.length > 10 ? 10 : data.indicators.length); i++) {
        tmpData.push({
          商品: data.indicators[i].xValue,
          天: data.indicators[i].y[3].yValue
        });
      }
      let chartData = {
        legendVisible: false,
        type: 'histogram',
        data: {
          columns: ['商品', '天'],
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
    ExportFileNew
  }
};
</script>

<style lang="scss">
.supplier-analysis-invoice {
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
