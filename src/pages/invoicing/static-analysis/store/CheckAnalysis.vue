<template>
  <div class="check-analysis">
    <div slot="top">
      <show-search-grid @refreshHandle="refreshHandle" ref="search">
        <div slot="description" class="description-pover">
          <p>状态：统计盘点单状态分布情况</p>
          <p>盈亏状态：统计盘点单盈亏状态分布</p>
          <p>盘点次数：统计盘点次数变化趋势</p>
        </div>
      </show-search-grid>
    </div>
    <div class="indicators-search" :class="{'showHide2' : showHideStore1}">
      <div class="title">仓库</div>
      <div class="hardStoreGroup1" :class="{'showHideStore1' : showHideStore1}" ref="storeGroup">
        <el-checkbox-button v-model="checkAllStore" @change="handleCheckAllStore" :indeterminate="isIndeterminateStore">全部
        </el-checkbox-button>
        <el-tooltip placement="bottom" v-for="(condition, index) in storeList" :key="index" :disabled="condition.name.length<=10">
          <el-checkbox-group v-model="checkedStore" @change="storeChange">
            <el-checkbox-button :label="condition.id" size="mini">
              {{condition.name.length>10?condition.name.substr(0, 10)+'...':condition.name}}
            </el-checkbox-button>
          </el-checkbox-group>
          <div slot="content">{{ condition.name }}</div>
        </el-tooltip>
      </div>
    </div>
    <!-- <div class="swichStore" v-if="showStoreSwich1">
      <i :class="classNameStore1" @click="swichStore"></i>
    </div> -->
    <div class="indicators-search" :class="{'showHide2' : showHideState1}">
      <div class="title">状态</div>
      <div class="hardStateGroup1" :class="{'showHideState1' : showHideState1}" ref="stateGroup">
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
    <div class="indicators-search">
      <div class="title">类型</div>
        <el-checkbox-button v-model="checkAllSupplier" @change="handleCheckAllSupplier" :indeterminate="isIndeterminateSupplier">全部
        </el-checkbox-button>
        <el-tooltip placement="bottom" v-for="(item, index) in conditionData.supplierList" :key="index" :disabled="item.name.length<=10">
          <el-checkbox-group :min="1" v-model="checkedSupplier" @change="supplierChange">
            <el-checkbox-button :label="item.id" size="mini">
              {{item.name.length>10?item.name.substr(0, 10)+'...':item.name}}
            </el-checkbox-button>
          </el-checkbox-group>
          <div slot="content">{{ item.name }}</div>
        </el-tooltip>
    </div>
    <div class="chart-area" v-loading="loading">
      <div class="graph">
        <div class="filterSeach">
          <div class="filter-area">
            <el-radio-group @change="indicatorChanged" v-model="indicatorValue" size="mini">
              <el-radio-button label="depotInventoryNum">盘点次数</el-radio-button>
              <!-- <el-radio-button label="depotInventoryProductNum">数量</el-radio-button> -->
              <el-radio-button label="depotInventoryStateDist">状态</el-radio-button>
              <el-radio-button label="depotInventoryDepotStateDist">盈亏状态</el-radio-button>
            </el-radio-group>
          </div>
          <div class="type-range">
            <el-radio-group v-model="radioValue" size="mini">
              <el-radio-button label="0">视图</el-radio-button>
              <el-radio-button label="1">列表</el-radio-button>
            </el-radio-group>
          </div>
        </div>
        <div class="content" style="width:40%;float:right;line-height:40px;font-size: 13px;padding:100px;height:600px;overflow:auto" v-show="radioValue==='0'&&(indicatorValue==='depotInventoryStateDist'||indicatorValue==='depotInventoryDepotStateDist')">
          <div v-for="(list,index) in channelLists" :key="index">
            <span :class="'list'+index">
              {{list.lable}}:{{list.value}}单
              占比{{countTotal!==0?((list.value/countTotal)*100).toFixed(2):list.value}}%
            </span>
          </div>
        </div>
        <biz-chart :chartData="chartData" :loading="loading" :showSearch="false" v-if="radioValue==='0'&&(indicatorValue==='depotInventoryNum'||indicatorValue==='depotInventoryProductNum')"></biz-chart>
        <biz-chart :chartData="chartDataOfWork" :loading="loading" :showSearch="false" v-if="radioValue==='0'&&(indicatorValue==='depotInventoryStateDist'||indicatorValue==='depotInventoryDepotStateDist')"></biz-chart>
      <biz-list ref="list" :height="height" :tableData="tableData" style="width: 100%;height:100%" v-show="radioValue==='1'">
          <el-table-column prop="sn" label="编号"></el-table-column>
          <el-table-column prop="depotName" label="仓库"></el-table-column>
          <el-table-column prop="inventoryProductAmount" label="盘点商品种类"></el-table-column>
          <el-table-column prop="profit" label="盈亏"></el-table-column>
          <el-table-column prop="state" label="状态"></el-table-column>
        </biz-list>
        <biz-pagination :pagination="pagination" @size-change="handleSizeChange" @current-change="handleCurrentChange" v-show="radioValue==='1'"></biz-pagination>
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
import axios from 'axios';
import { mapGetters } from 'vuex';
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
      isIndeterminateStore: true,
      checkAllStore: true,
      checkedStore: [],
      isIndeterminateState: true,
      checkAllState: true,
      checkedState: ['0', '1', '2'],
      isIndeterminateSupplier: true,
      checkAllSupplier: true,
      checkedSupplier: ['0', '1', '2'],
      storeList: [],
      hardGroupStoreHeight1: 0,
      classNameStore1: 'el-icon-caret-bottom',
      showStoreSwich1: false,
      showHideStore1: false,
      kpiName: ['本期', '同比', '环比'],
      className: 'el-icon-caret-bottom',
      classSeriesName: 'el-icon-caret-bottom',
      // indicator
      conditionData: {
        stateList: [{ id: '0', name: '盘点中' }, { id: '2', name: '已完成' }, { id: '1', name: '已调整' }],
        supplierList: [{ id: '0', name: '平库' }, { id: '1', name: '盘盈' }, { id: '2', name: '盘亏' }]
      },
      showHideState1: false,
      showStateSwich1: false,
      hardGroupStateHeight1: 0,
      classNameState1: 'el-icon-caret-bottom',
      showHideTemp1: false,
      showTempSwich1: false,
      hardGroupTempHeight1: 0,
      classNameTemp1: 'el-icon-caret-bottom',
      channelLists: [],
      countTotal: 0,
      radioValue: '0',
      indicatorValue: 'depotInventoryNum'
    };
  },
  props: {
    params: {
      type: Object
    }
  },
  methods: {
    ...mapGetters(['getUser']),
    handleCheckAllSupplier(val) {
      this.checkedSupplier = val
        ? this.conditionData.supplierList.map(item => {
          return item.id;
        })
        : [];
      this.query();
    },
    supplierChange(val) {
      let checkedCount = val.length;
      this.checkAllSupplier = checkedCount === this.conditionData.supplierList.length;
      this.isIndeterminateSupplier = checkedCount > 0 && checkedCount < this.conditionData.supplierList.length;
      this.query();
    },
    handleCheckAllStore(val) {
      this.checkedStore = val
        ? this.storeList.map(item => {
          return item.id;
        })
        : [];
      this.query();
    },
    storeChange(val) {
      let checkedCount = val.length;
      this.checkAllStore = checkedCount === this.storeList.length;
      this.isIndeterminateStore = checkedCount > 0 && checkedCount < this.storeList.length;
      this.query();
    },
    handleCheckAllState(val) {
      this.checkedState = val ? this.conditionData.stateList.map(item => { return item.id; }) : [];
      this.query();
    },
    stateChange(val) {
      let checkedCount = val.length;
      this.checkAllState = checkedCount === this.conditionData.stateList.length;
      this.isIndeterminateState = checkedCount > 0 && checkedCount < this.conditionData.stateList.length;
      this.query();
    },
    getStoreList() {
      http
        .get('/admin/invoicing/stock/shopDepots.jhtml')
        .then(data => {
          this.storeList = data.dataList;
          this.checkedStore = this.params.checkedShopDepot || this.storeList.map(item => { return item.id; }) || [];
          let checkedCount = this.checkedStore.length;
          this.checkAllStore = checkedCount === this.storeList.length;
          this.isIndeterminateStore = checkedCount > 0 && checkedCount < this.storeList.length;
          this.$nextTick(() => {
            this.hardGroupStoreHeight1 = document.getElementsByClassName('hardStoreGroup1')[0].offsetHeight;
            if (this.hardGroupStoreHeight1 > 55) {
              this.showStoreSwich1 = true;
              this.showHideStore1 = true;
            } else {
              this.showStoreSwich1 = false;
              this.showHideStore1 = false;
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
    swichStore() {
      this.classNameStore1 = this.classNameStore1 === 'el-icon-caret-bottom' ? 'el-icon-caret-top' : 'el-icon-caret-bottom';
      this.showHideStore = this.classNameStore1 === 'el-icon-caret-bottom';
      if (!this.showHideStore) {
        document.getElementsByClassName('hardStoreGroup')[0].style.height = 'auto';
      } else {
        document.getElementsByClassName('hardStoreGroup')[0].style.height = '55px';
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
      this.getStoreList();
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
      let params = {
        indicators: [this.indicatorValue],
        stateIds: this.checkedState,
        depotIds: this.checkedStore,
        depotStateIds: this.checkedSupplier,
        viewType: this.viewType,
        beginDate: this.beginDate,
        endDate: this.endDate
      };
      if (this.indicatorValue === 'depotInventoryNum' || this.indicatorValue === 'depotInventoryProductNum') {
        http
          .post('/admin/ecommerce/kpi/stock/graph/depotColumn.jhtml', params)
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
      } else {
        http
          .post('/admin/ecommerce/kpi/stock/graph/depotDist.jhtml', params)
          .then(data => {
            this.countTotal = 0;
            this.channelLists = data.indicators;
            for (const item of data.indicators) {
              this.countTotal += Number(item.value);
            }
            this.chartDataOfWork = this.dataFormatWork(data);
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
        indicators: [this.indicatorValue],
        stateIds: this.checkedState,
        depotIds: this.checkedStore,
        depotStateIds: this.checkedSupplier,
        viewType: this.viewType,
        beginDate: this.beginDate,
        endDate: this.endDate,
        pageSize: this.pagination.pageSize,
        pageNumber: this.pagination.currentPage
      };
      http
        .post('admin/ecommerce/kpi/stock/table/stock.jhtml', params)
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
        indicators: [this.indicatorValue],
        stateIds: this.checkedState,
        depotIds: this.checkedStore,
        depotStateIds: this.checkedSupplier,
        viewType: this.viewType,
        beginDate: this.beginDate,
        endDate: this.endDate,
        pageSize: this.pagination.pageSize,
        pageNumber: this.pagination.currentPage
      };
      try {
        let response = await axios.post('/admin/ecommerce/kpi/stock/export/stock.jhtml', params, { responseType: 'blob' });
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
.check-analysis {
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
  .hardStateGroup1 {
    display: flex;
    width: calc(100% - 90px);
  }
  .hardStoreGroup1 {
    display: flex;
    width: calc(100% - 90px);
    flex-flow: wrap;
  }
  .showHide2 {
    height: 55px;
  }
  .swichState1 {
    text-align: center;
    font-size: 24px;
    cursor: pointer;
    margin-top: -10px;
  }
  .swichStore1 {
    text-align: center;
    font-size: 24px;
    cursor: pointer;
    margin-top: -10px;
  }
  .showHideState1 {
    height: 55px;
    overflow-y: hidden;
  }
  .showHideStore1 {
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
