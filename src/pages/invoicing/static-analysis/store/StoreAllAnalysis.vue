<template>
  <div class="store-a-analysis">
    <div slot="top">
      <show-search-grid @refreshHandle="refreshHandle" ref="search">
        <div slot="description" class="description-pover">
          <p>商品分类：统计在库商品的分类情况</p>
          <p>库存排行：统计在库商品的排行情况</p>
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
    <!-- <div class="swichStore" v-if="showStoreSwich">
      <i :class="classNameStore" @click="swichStore"></i>
    </div> -->
    <div class="indicators-search" :class="{'showHide2' : showHideClass1}">
      <div class="title">商品分类</div>
      <div class="hardClassGroup1" :class="{'showHideClass1' : showHideClass1}" ref="classGroup">
        <el-checkbox-button v-model="checkAllClass" @change="handleCheckAllClass" :indeterminate="isIndeterminateClass">全部
        </el-checkbox-button>
        <el-tooltip placement="bottom" v-for="(item, index) in conditionData.classList" :key="index" :disabled="item.name.length<=10">
          <el-checkbox-group :min="1" v-model="checkedClass" @change="classChange">
            <el-checkbox-button :label="item.id" size="mini">
              {{item.name.length>10?item.name.substr(0, 10)+'...':item.name}}
            </el-checkbox-button>
          </el-checkbox-group>
          <div slot="content">{{ item.name }}</div>
        </el-tooltip>
      </div>
    </div>
    <!-- <div class="swichClass1" v-if="showClassSwich1">
      <i :class="classNameClass1" @click="swichClass1"></i>
    </div> -->
    <!-- <div class="indicators-search">
      <div class="title">子分类</div>
        <el-checkbox-button v-model="checkAllSupplier" @change="handleCheckAllSupplier" :indeterminate="isIndeterminateSupplier">全部
        </el-checkbox-button>
        <el-checkbox-group :min="1" v-model="checkedSupplier" @change="supplierChange">
          <el-checkbox-button v-for="(item,index) in conditionData.supplierList" :label="item.id" :key="index" size="mini">
            {{item.name}}</el-checkbox-button>
        </el-checkbox-group>
    </div> -->
    <div class="chart-area" v-loading="loading">
      <div class="graph">
        <div class="filterSeach">
          <div class="filter-area">
            <el-radio-group @change="indicatorChanged" v-model="indicatorValue" size="mini">
              <el-radio-button label="depotProductRank">库存排行</el-radio-button>
              <el-radio-button label="depotProductDist">商品分类</el-radio-button>
            </el-radio-group>
          </div>
          <div class="type-range">
            <el-radio-group v-model="radioValue" size="mini">
              <el-radio-button label="0">视图</el-radio-button>
              <el-radio-button label="1">列表</el-radio-button>
            </el-radio-group>
          </div>
        </div>
        <div class="content" style="width:40%;float:right;line-height:40px;font-size: 13px;padding:100px;height:600px;overflow:auto" v-show="radioValue==='0'&&indicatorValue==='depotProductDist'">
          <div v-for="(list,index) in channelLists" :key="index">
            <span :class="'list'+index">
              {{list.lable}}:{{list.value}}单
              占比{{countTotal!==0?((list.value/countTotal)*100).toFixed(2):list.value}}%
            </span>
          </div>
        </div>
        <biz-chart :chartData="chartData" :loading="loading" :showSearch="false" v-if="radioValue==='0'&&indicatorValue!=='depotProductDist'"></biz-chart>
        <biz-chart :chartData="chartDataOfWork" :loading="loading" :showSearch="false" v-if="radioValue==='0'&&indicatorValue==='depotProductDist'"></biz-chart>
      <biz-list ref="list" :height="height" :tableData="tableData" style="width: 100%;height:100%" v-show="radioValue==='1'">
          <el-table-column prop="value0" label="商品名称"></el-table-column>
          <el-table-column prop="value1" label="商品分类"></el-table-column>
          <template v-for="(column,index) in cols" v-if="index<=6">
            <el-table-column :key="index" :label="column.name" :prop="column.value"></el-table-column>
          </template>
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
      cols: [],
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
      isIndeterminateClass: false,
      isIndeterminateTemps: false,
      checkAllClass: true,
      checkedClass: [],
      isIndeterminateStore: true,
      checkAllStore: true,
      checkedStore: [],
      isIndeterminateState: true,
      checkAllState: true,
      checkedState: [],
      isIndeterminateSupplier: true,
      checkAllSupplier: true,
      checkedSupplier: [],
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
        classList: [],
        supplierList: [],
        stateList: []
      },
      showHideClass1: false,
      showClassSwich1: false,
      hardGroupClassHeight1: 0,
      classNameClass1: 'el-icon-caret-bottom',
      showHideTemp1: false,
      showTempSwich1: false,
      hardGroupTempHeight1: 0,
      classNameTemp1: 'el-icon-caret-bottom',
      channelLists: [],
      countTotal: 0,
      radioValue: '0',
      indicatorValue: 'depotProductRank'
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
        ? this.supplierList.map(item => {
          return item.id;
        })
        : [];
    },
    supplierChange(val) {
      let checkedCount = val.length;
      this.checkAllSupplier = checkedCount === this.supplierList.length;
      this.isIndeterminateSupplier = checkedCount > 0 && checkedCount < this.supplierList.length;
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
    handleCheckAllClass(val) {
      this.checkedClass = val ? this.conditionData.classList.map(item => { return item.id; }) : [];
      this.query();
    },
    classChange(val) {
      let checkedCount = val.length;
      this.checkAllClass = checkedCount === this.conditionData.classList.length;
      this.isIndeterminateClass = checkedCount > 0 && checkedCount < this.conditionData.classList.length;
      this.query();
    },
    getClassList() {
      http
        .get('/admin/shopProduct/filter.jhtml', {})
        .then(data => {
          this.conditionData.classList = data.categoryDatas;
          this.checkedClass = this.conditionData.classList.map(item => { return item.id; }) || [];
          let checkedCount = this.checkedClass.length;
          this.checkAllClass = checkedCount === this.conditionData.classList.length;
          this.isIndeterminateClass = checkedCount > 0 && checkedCount < this.conditionData.classList.length;
          this.$nextTick(() => {
            this.hardGroupClassHeight1 = document.getElementsByClassName('hardClassGroup1')[1].offsetHeight;
            console.log(this.hardGroupClassHeight1);
            if (this.hardGroupClassHeight1 > 55) {
              this.showClassSwich1 = true;
              this.showHideClass1 = true;
            } else {
              this.showClassSwich1 = false;
              this.showHideClass1 = false;
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
    swichClass1() {
      this.classNameClass1 = this.classNameClass1 === 'el-icon-caret-bottom' ? 'el-icon-caret-top' : 'el-icon-caret-bottom';
      this.showHideClass1 = this.classNameClass1 === 'el-icon-caret-bottom';
      if (!this.showHideClass1) {
        document.getElementsByClassName('hardClassGroup1')[0].style.height = 'auto';
      } else {
        document.getElementsByClassName('hardClassGroup1')[0].style.height = '55px';
      }
    },
    getChildrenClassList() {
      http
        .get('/admin/shopProduct/productCategorys.jhtml', {})
        .then(data => {
          this.conditionData.supplierList = data.dateList;
          this.query();
        })
        .catch(error => {
          if (error.errorMessage) {
            this.$message.warning(error.errorMessage);
          }
        });
    },
    getStoreList() {
      http
        .get('/admin/invoicing/stock/shopDepots.jhtml')
        .then(data => {
          this.storeList = data.dataList;
          this.checkedStore = this.storeList
            ? this.storeList.map(item => {
              return item.id;
            })
            : [];
          this.checkedStore = this.params.checkedShopDepot;
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
          this.getClassList();
        })
        .catch(error => {
          if (error.errorMessage) {
            this.$message.warning(error.errorMessage);
          }
        });
    },
    swichStore() {
      this.classNameStore = this.classNameStore === 'el-icon-caret-bottom' ? 'el-icon-caret-top' : 'el-icon-caret-bottom';
      this.showHideStore = this.classNameStore === 'el-icon-caret-bottom';
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
      this.getGraphDataTwo();
      this.getTable();
    },
    indicatorChanged() {
      this.getGraphData();
      this.getGraphDataTwo();
      this.getTable();
    },
    getGraphData() {
      this.loading = true;
      let params = {
        categoryIds: this.checkedClass,
        depotIds: this.checkedStore,
        indicators: ['depotProductRank'],
        viewType: this.viewType,
        beginDate: this.beginDate,
        endDate: this.endDate
      };
      http
        .post('/admin/ecommerce/kpi/stock/graph/depotRank.jhtml', params)
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
    getGraphDataTwo() {
      this.loading = true;
      let params = {
        categoryIds: this.checkedClass,
        depotIds: this.checkedStore,
        indicators: ['depotProductDist'],
        viewType: this.viewType,
        beginDate: this.beginDate,
        endDate: this.endDate
      };
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
    },
    getTable() {
      let params = {
        categoryIds: this.checkedClass,
        depotIds: this.checkedStore,
        indicators: ['depotProductRank'],
        viewType: this.viewType,
        beginDate: this.beginDate,
        endDate: this.endDate,
        pageSize: this.pagination.pageSize,
        pageNumber: this.pagination.currentPage
      };
      http
        .post('/admin/ecommerce/kpi/stock/table/stock.jhtml', params)
        .then(data => {
          this.tableData = data.dataList;
          this.cols = data.dataNameList;
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
        categoryIds: this.checkedClass,
        depotIds: this.checkedStore,
        indicators: ['depotProductRank'],
        viewType: this.viewType,
        beginDate: this.beginDate,
        endDate: this.endDate,
        pageSize: this.pagination.pageSize,
        pageNumber: this.pagination.currentPage
      };
      http
        .post('/admin/ecommerce/kpi/stock/export/stock/exportStart.jhtml', params)
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
        let response = await axios.get('/admin/ecommerce/kpi/stock/export/stock/exportResult.jhtml?taskId=' + this.taskId, { responseType: 'blob' });
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
          库存: data.indicators[i].xValue,
          个: data.indicators[i].yValue
        });
      }
      let chartData = {
        legendVisible: false,
        type: 'histogram',
        data: {
          columns: ['库存', '个'],
          rows: tmpData
        },
        settings: {}
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
    ShowSearchGrid,
    ExportFileNew
  }
};
</script>

<style lang="scss">
.store-a-analysis {
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
  .hardClassGroup1 {
    display: flex;
    width: calc(100% - 90px);
    flex-flow: wrap;
  }
  .hardStoreGroup1 {
    display: flex;
    width: calc(100% - 90px);
    flex-flow: wrap;
  }
  .showHide2 {
    height: 55px;
  }
  .swichClass1 {
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
  .showHideClass1 {
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
