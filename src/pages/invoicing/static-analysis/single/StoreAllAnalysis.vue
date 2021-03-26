<template>
  <div class="store-all-analysis">
    <div slot="top">
      <show-search-grid @refreshHandle="refreshHandle" ref="search">
        <div slot="description" class="description-pover">
          <p>仓库：统计商品库存在各仓库分布情况</p>
          <p>入库：统计商品入库情况</p>
          <p>出库：统计商品出库情况</p>
          <p>盈亏：统计商品盘点盈亏情况</p>
        </div>
      </show-search-grid>
    </div>
    <div class="indicators-search">
      <div class="title">仓库</div>
      <div class="hardStoreGroup1" ref="storeGroup">
        <el-checkbox-button v-model="checkAllStore" @change="handleCheckAllStore" :indeterminate="isIndeterminateStore">全部
        </el-checkbox-button>
        <el-checkbox-group v-model="checkedStore" @change="storeChange">
          <el-checkbox-button v-for="(condition,index)  in storeList" :label="condition.id" :key="index" size="mini">
            {{condition.name}}</el-checkbox-button>
        </el-checkbox-group>
      </div>
    </div>
    <div class="chart-area" v-loading="loading">
      <div class="graph">
        <div class="filterSeach">
          <div class="filter-area">
            <el-radio-group @change="indicatorChanged" v-model="indicatorValue" size="mini">
              <el-radio-button label="depotProductDepotDist">仓库</el-radio-button>
              <el-radio-button label="depotInProductNum">入库</el-radio-button>
              <el-radio-button label="depotOutProductNum">出库</el-radio-button>
              <el-radio-button label="depotInventoryProductDepotState">盈亏</el-radio-button>
            </el-radio-group>
          </div>
          <div class="type-range">
            <el-radio-group v-model="radioValue" size="mini">
              <el-radio-button label="0">视图</el-radio-button>
              <el-radio-button label="1">列表</el-radio-button>
            </el-radio-group>
          </div>
        </div>
        <div class="content"
          style="width:40%;float:right;line-height:40px;font-size: 13px;padding:100px;height:600px;overflow:auto"
          v-show="radioValue==='0'&&(indicatorValue==='depotInventoryDepotStateDist'||indicatorValue==='depotProductDepotDist')">
          <div v-for="(list,index) in channelLists" :key="index">
            <span :class="'list'+index">
              {{list.lable}}:{{list.value}}个
              占比{{countTotal!==0?((list.value/countTotal)*100).toFixed(2):list.value}}%
            </span>
          </div>
        </div>
        <biz-chart :chartData="chartData" :loading="loading" :showSearch="false" v-if="radioValue==='0'"></biz-chart>
        <biz-list ref="list" :height="height" :tableData="tableData" style="width: 100%"
          v-show="radioValue==='1'&&(indicatorValue==='depotInProductNum'||indicatorValue==='depotOutProductNum')">
          <el-table-column prop="sn" label="订单编号"></el-table-column>
          <el-table-column prop="itemDatas[0].depotedQuantity" label="商品数量"></el-table-column>
          <el-table-column prop="relatePartnerName" label="往来方"></el-table-column>
          <el-table-column prop="businessType" label="业务类型"></el-table-column>
          <el-table-column prop="state" label="状态"></el-table-column>
        </biz-list>
        <biz-list ref="list" :height="height" :tableData="tableData" style="width: 100%"
          v-show="radioValue==='1'&&indicatorValue==='depotProductDepotDist'">
          <el-table-column prop="productSn" label="商品编号"></el-table-column>
          <el-table-column prop="value0" label="商品名称"></el-table-column>
          <template v-for="(column,index) in cols" v-if="index<=6">
            <el-table-column :key="index" :label="column.name" :prop="column.value"></el-table-column>
          </template>
        </biz-list>
        <biz-list ref="list" :height="height" :tableData="tableData" style="width: 100%"
          v-show="radioValue==='1'&&indicatorValue==='depotInventoryProductDepotState'">
          <el-table-column prop="sn" label="商品编号"></el-table-column>
          <el-table-column prop="depotName" label="仓库"></el-table-column>
          <el-table-column prop="profit" label="盈亏"></el-table-column>
          <el-table-column prop="state" label="状态"></el-table-column>
        </biz-list>
        <biz-pagination :pagination="pagination" @size-change="handleSizeChange" @current-change="handleCurrentChange"
          v-show="radioValue==='1'"></biz-pagination>
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
      cols: [],
      showRecommend: false,
      chartDataOfWork: {},
      chartData: {},
      isShow: 'false',
      isIndeterminateStore: true,
      checkAllStore: true,
      checkedStore: [],
      isIndeterminateState: true,
      storeList: [],
      kpiName: ['本期', '同比', '环比'],
      channelLists: [],
      countTotal: 0,
      radioValue: '0',
      indicatorValue: 'depotProductDepotDist'
    };
  },
  props: {
    params: {
      type: Object
    }
  },
  methods: {
    ...mapGetters(['getUser']),
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
          this.checkedStore =
            this.params.checkedStore ||
            this.storeList.map(item => {
              return item.id;
            }) ||
            [];
          let checkedCount = this.storeList.length;
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
      if (this.indicatorValue !== 'depotProductDepotDist') {
        this.getGraphData();
      } else {
        this.getGraphDataTwo();
      }
      this.getTable();
    },
    indicatorChanged() {
      if (this.indicatorValue !== 'depotProductDepotDist') {
        this.getGraphData();
      } else {
        this.getGraphDataTwo();
      }
      this.getTable();
    },
    getGraphData() {
      this.loading = true;
      let params = {
        productId: this.params.productId,
        depotIds: this.checkedStore,
        indicators: [this.indicatorValue],
        viewType: this.viewType,
        beginDate: this.beginDate,
        endDate: this.endDate
      };
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
    },
    getGraphDataTwo() {
      this.loading = true;
      let params = {
        productId: this.params.productId,
        depotIds: this.checkedStore,
        indicators: [this.indicatorValue],
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
          this.chartData = this.dataFormatWork(data);
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
        productId: this.params.productId,
        depotIds: this.checkedStore,
        indicators: [this.indicatorValue],
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
    async exportExcle() {
      let params = {
        productId: this.params.productId,
        depotIds: this.checkedStore,
        indicators: [this.indicatorValue],
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
      if (this.indicatorValue !== 'depotProductDepotDist') {
        this.getGraphData();
      } else {
        this.getGraphDataTwo();
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
.store-all-analysis {
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
      width: 100%;
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
  }
  .hardStoreGroup1 {
    display: flex;
    width: calc(100% - 90px);
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
