<template>
  <div class="general-view-analysis-shop">
    <div slot="top">
      <show-search-grid @refreshHandle="refreshHandle" :showIntroduce="false" ref="search"></show-search-grid>
    </div>
    <div class="indicators-search" :class="{'showHide1' : showHideOperator}" v-if="getUser().roleLevel !== 'shop'">
      <div class="title">运营商</div>
      <div class="hardOperatorGroup" :class="{'showHideOperator' : showHideOperator}" ref="operatorGroup">
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
    <div class="swichOperator" v-if="showOperatorSwich">
      <i :class="classNameOperator" @click="swichOperator"></i>
    </div>
    <div class="indicators-search" :class="{'showHide1' : showHideShop}" v-if="getUser().roleLevel !== 'shop'">
      <div class="title">店铺</div>
      <div class="hardShopGroup" :class="{'showHideShop' : showHideShop}" ref="shopGroup">
        <el-checkbox-button v-model="checkAllShops" @change="handleCheckAllShops" :indeterminate="isIndeterminateShops">全部</el-checkbox-button>
        <el-tooltip placement="bottom" v-for="(item, index) in conditionData.shopsList" :key="index" :disabled="item.name.length<=10">
          <el-checkbox-group v-model="checkedShop" @change="shopsChange">
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
    <div class="indicators-search" :class="{'showHide1' : showHideShopByShop}"  v-if="this.getUser().roleLevel === 'shop'">
      <div class="title">店铺</div>
      <div class="hardShopGroupByShop" :class="{'showHideShopByShop' : showHideShopByShop}" ref="shopGroupByShop">
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
    <div class="swichShopByShop" v-if="showShopSwichByShop">
      <i :class="classNameShopByShop" @click="swichShopByShop"></i>
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
        <biz-list ref="list" :height="height" :tableData="tableData" style="width: 100%" v-if="!isShow&&this.filters[0].value==='0'|| this.filters[0].value==='1'">
          <el-table-column prop="companyName" label="运营商名称"></el-table-column>
          <el-table-column prop="sellShopName" label="店铺名称"></el-table-column>
          <el-table-column prop="sn" label="订单编号"></el-table-column>
          <el-table-column prop="amountPaid" label="订单金额"></el-table-column>
          <el-table-column prop="completeDate" label="交易完成时间"></el-table-column>
        </biz-list>
        <biz-list ref="list" :height="height" :tableData="tableData" style="width: 100%" v-if="!isShow&&this.filters[0].value==='2'">
          <el-table-column prop="name" label="会员名称"></el-table-column>
          <el-table-column prop="mobile" label="会员手机号"></el-table-column>
          <el-table-column prop="createDate" label="注册时间"></el-table-column>
          <el-table-column prop="shopName" label="所属店铺"></el-table-column>
        </biz-list>
        <biz-list ref="list" :height="height" :tableData="tableData" style="width: 100%" v-if="!isShow&&this.filters[0].value==='3'">
          <el-table-column prop="plateNumber" label="车牌号"></el-table-column>
          <el-table-column prop="ownerName" label="车主"></el-table-column>
          <el-table-column prop="shopName" label="所属店铺"></el-table-column>
          <el-table-column prop="createDate" label="添加时间"></el-table-column>
        </biz-list>
        <biz-pagination :pagination="pagination" @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange" v-if="!isShow"></biz-pagination>
        <div align="right" v-if="!isShow">
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
import { ExportFileNew } from '@/components/BizUpload';
import ShowSearchGrid from '../components/ShowSearchGrid';
import { mapGetters } from 'vuex';
import axios from 'axios';

export default {
  name: 'OperationTrendAnalysis',
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
          value: '0',
          options: [
            { value: '0', label: '营业额' },
            { value: '1', label: '订单量' },
            { value: '2', label: '新增会员数' },
            { value: '3', label: '新增车辆数' }
          ]
        }
      ],
      kpiName: ['本期', '同比', '环比'],
      chartData: {},
      isShow: 'false',
      radioValue: '0',
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
      hardGroupOperatorHeight: 0,
      hardGroupShopHeight: 0,
      hardGroupShopHeight1: 0,
      className: 'el-icon-caret-bottom',
      classNameOperator: 'el-icon-caret-bottom',
      classNameShop: 'el-icon-caret-bottom',
      classNameShopByShop: 'el-icon-caret-bottom',
      showSwich: false,
      showOperatorSwich: false,
      showShopSwich: false,
      showShopSwichByShop: false,
      showHide: false,
      showHideOperator: false,
      showHideShop: false,
      showHideShopByShop: false
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
        this.checkedShopByShop.push(this.shopListByShop[0].id);
      }
      this.query();
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
    swichShopByShop() {
      this.classNameShopByShop = this.classNameShopByShop === 'el-icon-caret-bottom' ? 'el-icon-caret-top' : 'el-icon-caret-bottom';
      this.showHideShopByShop = this.classNameShopByShop === 'el-icon-caret-bottom';
      if (!this.showHideShopByShop) {
        document.getElementsByClassName('hardShopGroupByShop')[0].style.height = 'auto';
      } else {
        document.getElementsByClassName('hardShopGroupByShop')[0].style.height = '55px';
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
      if (this.getUser().roleLevel === 'shop') {
        http
          .get(urls.membersMgmt.statisticsAnalysis.findEShops, { shopId: window.top.SHOP_ID || '' })
          .then(data => {
            this.shopListByShop = data.shops;
            this.checkedShopByShop = this.params.checkedShopByShop;
            this.$nextTick(() => {
              this.hardGroupShopHeight1 = document.getElementsByClassName('hardShopGroupByShop')[0].offsetHeight;
              if (this.hardGroupShopHeight1 > 54) {
                this.showShopSwichByShop = true;
                this.showHideShopByShop = true;
              } else {
                this.showShopSwichByShop = false;
                this.showHideShopByShop = false;
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
              this.hardGroupShopHeight = document.getElementsByClassName('hardShopGroup')[0].offsetHeight;
              if (this.hardGroupShopHeight > 62) {
                this.showShopSwich = true;
                this.showHideShop = true;
              } else {
                this.showShopSwich = false;
                this.showHideShop = false;
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
        this.shopListByShop = [];
        this.checkedShopByShop = [];
        this.getShopList();
      }
    },
    query() {
      this.getGraphData();
      this.getTable();
    },
    indicatorChanged() {
      if (this.radioValue === '0') {
        this.isShow = true;
      } else {
        this.isShow = false;
      }
    },
    getGraphData() {
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
      let urls = '';
      if (this.filters[0].value === '0') {
        urls = '/admin/ecommerce/kpi/graph/store/storesOrderAmount.jhtml';
      } else if (this.filters[0].value === '1') {
        urls = '/admin/ecommerce/kpi/graph/store/storesOrderCount.jhtml';
      } else if (this.filters[0].value === '2') {
        urls = '/admin/ecommerce/kpi/graph/store/storesNewMember.jhtml';
      } else if (this.filters[0].value === '3') {
        urls = '/admin/ecommerce/kpi/graph/store/storesNewCar.jhtml';
      }
      http
        .get(urls + '?' + paramsArr.join('&'))
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
    getTable() {
      let params = {
        viewType: this.viewType,
        beginDate: this.beginDate,
        endDate: this.endDate,
        searchShopIds:
          this.getUser().roleLevel !== 'shop'
            ? this.checkedShop.join('&searchShopIds=')
            : this.checkedShopByShop.join('&searchShopIds='),
        pageSize: this.pagination.pageSize,
        pageNumber: this.pagination.currentPage
      };
      let paramsArr = [];
      for (let name in params) {
        paramsArr.push(`${name}=${params[name]}`);
      }
      let urls = '';
      if (this.filters[0].value === '0') {
        urls = '/admin/ecommerce/kpi/table/stores/orderInfoList.jhtml';
      } else if (this.filters[0].value === '1') {
        urls = '/admin/ecommerce/kpi/table/stores/orderInfoList.jhtml';
      } else if (this.filters[0].value === '2') {
        urls = '/admin/ecommerce/kpi/table/stores/newMemberList.jhtml';
      } else if (this.filters[0].value === '3') {
        urls = '/admin/ecommerce/kpi/table/stores/newCarList.jhtml';
      }
      http
        .get(urls + '?' + paramsArr.join('&'))
        .then(data => {
          this.tableData = data.indicators;
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
        viewType: this.viewType,
        beginDate: this.beginDate,
        endDate: this.endDate,
        searchShopIds: this.getUser().roleLevel !== 'shop' ? this.checkedShop : this.checkedShopByShop,
        pageSize: this.pagination.pageSize,
        pageNumber: this.pagination.currentPage
      };
      let urls = '';
      if (this.filters[0].value === '0') {
        urls = '/admin/ecommerce/kpi/export/stores/exportOrderInfoListStart.jhtml';
      } else if (this.filters[0].value === '1') {
        urls = '/admin/ecommerce/kpi/export/stores/exportOrderInfoListStart.jhtml';
      } else if (this.filters[0].value === '2') {
        urls = '/admin/ecommerce/kpi/export/stores/exportNewMemberListStart.jhtml';
      } else if (this.filters[0].value === '3') {
        urls = '/admin/ecommerce/kpi/export/stores/exportNewCarListStart.jhtml';
      }
      http
        .post(urls, params)
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
        let response = await axios.get('/admin/ecommerce/kpi/export/stores/exportResult.jhtml?taskId=' + this.taskId, { responseType: 'blob' });
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
    filterDataChange(val) {
      this.filters = val;
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
          yAxisType: ['normal', 'normal'],
          yAxisName: this.filters[0].value === '0' ? ['万元', '%'] : this.filters[0].value === '1' ? ['次', '%'] : this.filters[0].value === '2' ? ['人', '%'] : ['辆', '%'],
          showLine: [this.kpiName[1], this.kpiName[2]]
        }
      };
      return chartData;
    }
  },
  computed: {},
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
.general-view-analysis-shop {
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
    .hardShopGroupByShop {
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
  .swichShopByShop {
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
  .showHideShopByShop {
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
