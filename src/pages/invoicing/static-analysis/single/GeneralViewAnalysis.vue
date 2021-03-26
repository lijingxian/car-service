<template>
  <div class="product-portrait-analysis">
    <div slot="top" style="display:flex">
      <show-search-grid @refreshHandle="refreshHandle" :showViewType="false">
        <div slot="description" class="description-pover">
          <p>采购趋势：商品的采购数量、金额变化趋势以及往来方分布情况</p>
          <p>销售趋势：商品的销售数量、金额变化趋势以及往来方分布情况</p>
          <p>库存情况：商品在各仓库分布情况以及入库、出库、盘点情况</p>
        </div>
      </show-search-grid>
      <!-- <div class="filter-portrait" v-if="filters.length > 0">
        <biz-filter v-if="filters.length > 0" :filters="filters" @filterDataChange="filterDataChange"></biz-filter>
      </div> -->
    </div>
    <div class="member-info">
      <div class="header1">
        <span>{{userPortrait.name}}</span>
        <span>
          <el-button @click="memberSelected" type="text" size="mini" style="margin-top: -3px;">切换</el-button>
        </span>
      </div>
      <div class="container">
        <div class="header-img">
          <img v-if="userPortrait.image" :src="userPortrait.image" alt />
          <img v-else :src="defaultImg" />
        </div>
        <div class="info-con">
          <div class="base-info" :title="userPortrait.name">商品分类：{{userPortrait.categoryName}}</div>
          <div class="base-info">品牌：{{userPortrait.brandName}}</div>
          <div class="base-info">系列：{{userPortrait.seriesName}}</div>
          <div class="base-info">商品条码：{{userPortrait.barCode}}</div>
          <div class="base-info">采购价：{{userPortrait.purchasePrice}}</div>
          <div class="base-info">一级代理价：{{userPortrait.wholesalePrice}}</div>
          <div class="base-info">二级代理价：{{userPortrait.agent2Price}}</div>
          <div class="base-info">三级代理价：{{userPortrait.agent3Price}}</div>
        </div>
      </div>
    </div>
    <div class="total">
      <div class="column1">
        <div class="table-cell">
          采购数
          <div class="color-primary"><span class="font">{{summary.purchaseProductNumInc}}</span>件</div>
          <div class="color-primary">
            环比
            <span :style="summary.purchaseProductNumIncMon>0?'color:red':'color:green'"><i
                :class="summary.purchaseProductNumIncMon>0?'iconfont biz-icon-i-sh-man-pullup':'iconfont biz-icon-i-sh-man-pulldown'"></i>{{summary.purchaseProductNumIncMon}}%</span>
            同比
            <span :style="summary.purchaseProductNumIncYoy>0?'color:red':'color:green'"><i
                :class="summary.purchaseProductNumIncYoy>0?'iconfont biz-icon-i-sh-man-pullup':'iconfont biz-icon-i-sh-man-pulldown'"></i>{{summary.purchaseProductNumIncYoy}}%</span>
          </div>
        </div>
      </div>
      <div class="column2">
        <div class="table-cell">
          销售数
          <div class="color-primary"><span class="font">{{summary.salesProductNumInc}}</span>件</div>
          <div class="color-primary">
            环比
            <span :style="summary.salesProductNumIncMon>0?'color:red':'color:green'"><i
                :class="summary.salesProductNumIncMon>0?'iconfont biz-icon-i-sh-man-pullup':'iconfont biz-icon-i-sh-man-pulldown'"></i>{{summary.salesProductNumIncMon}}%</span>
            同比
            <span :style="summary.salesProductNumIncYoy>0?'color:red':'color:green'"><i
                :class="summary.salesProductNumIncYoy>0?'iconfont biz-icon-i-sh-man-pullup':'iconfont biz-icon-i-sh-man-pulldown'"></i>{{summary.salesProductNumIncYoy}}%</span>
          </div>
        </div>
      </div>
      <div class="column3">
        <div class="table-cell">
          库存数
          <div class="color-primary"><span class="font">{{summary.depotProductNumInc}}</span>件</div>
          <div class="color-primary">
            环比
            <span :style="summary.depotProductNumIncMon>0?'color:red':'color:green'"><i
                :class="summary.depotProductNumIncMon>0?'iconfont biz-icon-i-sh-man-pullup':'iconfont biz-icon-i-sh-man-pulldown'"></i>{{summary.depotProductNumIncMon}}%</span>
            同比
            <span :style="summary.depotProductNumIncYoy>0?'color:red':'color:green'"><i
                :class="summary.depotProductNumNumIncYoy>0?'iconfont biz-icon-i-sh-man-pullup':'iconfont biz-icon-i-sh-man-pulldown'"></i>{{summary.depotProductNumIncYoy}}%</span>
          </div>
        </div>
      </div>
    </div>
    <div class="chart-area">
      <div class="graph">
        <div class="header">
          <span>采购趋势</span>
          <i class="iconfont biz-icon-i-web-fd" @click="purchaseAnalysis"></i>
        </div>
        <biz-chart :chartData="purchaseGraphData" :loading="loading" :showSearch="false"></biz-chart>
      </div>
      <div class="graph">
        <div class="header">
          <span>销售趋势</span>
          <i class="iconfont biz-icon-i-web-fd" @click="salesAnalysis"></i>
        </div>
        <biz-chart :chartData="salesGraphData" :loading="loading" :showSearch="false"></biz-chart>
      </div>
    </div>
    <div class="chart-area">
      <div class="graph">
        <div class="header">
          <span>库存情况</span>
          <i class="iconfont biz-icon-i-web-fd" @click="storeAnalysis"></i>
        </div>
        <biz-chart :chartData="storeGraphData" :loading="loading" :showSearch="false"></biz-chart>
      </div>
      <div class="graph">
        <div class="header">
          <span>售后情况</span>
          <span class="font">售后类型</span>
          <i class="iconfont biz-icon-i-web-fd" @click="afterSaleAnalysis"></i>
        </div>
        <biz-chart :chartData="chartDataOfAfterSale" :loading="loading" :showSearch="false"></biz-chart>
      </div>
    </div>
    <el-dialog :visible.sync="dialogVisible" :title="title" width="1200px" append-to-body>
      <PurchaseAnalysis ref="purchaseAnalysis" v-if="showPurchase" :params="params"></PurchaseAnalysis>
      <SalesAnalysis ref="salesAnalysis" v-if="showSales" :params="params"></SalesAnalysis>
      <StoreAllAnalysis ref="storeAnalysis" v-if="showStore" :params="params"></StoreAllAnalysis>
      <AfterSaleAnalysis ref="afterSaleAnalysis" v-if="showAfterSale" :params="params"></AfterSaleAnalysis>
    </el-dialog>
    <biz-dialog-selector title="选择商品" :visibility.sync="showDialog" :appendToBody="true" :selectionMode="'single'"
      :isClear="false" :loading="dialogLoading" :tableData="dialogTableData" :pagination="dialogPagination"
      :filters="dialogFilters" @confirmed="handleConfirmed" @filterDataChange="dialogFilterDataChange"
      class="notice-dialog-selector" @pageSizeChange="dialogPageSizeChange" @currentPageChange="dialogCurrentPageChange">
      <el-table-column width="400" prop="fullName" label="商品名">
        <div slot-scope="scope">
          <div class="biz-two-column">
            <img :src="scope.row.image || defaultImg" :onerror="errorImg" />
            <div class="biz-two-row">
              <div style="margin-left: 10px">编号：{{scope.row.sn}}</div>
              <div style="margin-left: 10px">{{ scope.row.fullName }}</div>
            </div>
          </div>
        </div>
      </el-table-column>
      <el-table-column prop="barCode" label="条码"></el-table-column>
      <el-table-column prop="categoryName" label="分类"></el-table-column>
      <el-table-column prop="price" label="零售价">
        <div slot-scope="scope">
          <span v-if="scope.row.price">￥{{scope.row.price}}</span>
        </div>
      </el-table-column>
      <el-table-column prop="wholesalePrice" label="代理价">
        <div slot-scope="scope">
          <div>{{scope.row.wholesalePrice?'￥'+scope.row.wholesalePrice:'-'}}</div>
          <div>{{scope.row.agent2Price?'￥'+scope.row.agent2Price:'-'}}</div>
          <div>{{scope.row.agent3Price?'￥'+scope.row.agent3Price:'-'}}</div>
        </div>
      </el-table-column>
      <el-table-column prop="purchasePrice" label="采购价">
        <div slot-scope="scope">
          <span v-if="scope.row.purchasePrice">￥{{scope.row.purchasePrice}}</span>
        </div>
      </el-table-column>
      <el-table-column prop="realStock" label="在库库存">
        <div slot-scope="scope">
          <div class="biz-customcol">{{ scope.row.realStock }}</div>
        </div>
      </el-table-column>
      <el-table-column prop="supplier" label="供应商">
        <div slot-scope="scope">{{ scope.row.supplier && scope.row.supplier.name?scope.row.supplier.name:'' }}</div>
      </el-table-column>
      <el-table-column prop="state" label="状态" :formatter="getStatus"></el-table-column>
    </biz-dialog-selector>
  </div>
</template>

<script>
import DefaultAvatar from '@/assets/images/default_user.png';
// import BizFilter from '@/components/BizTable/BizFilter.vue';
import dateTime from '@/utils/dateTime';
import ShowSearchGrid from '../components/ShowSearchGrid';
import http from '@/common/http';
import { mapGetters } from 'vuex';
import BizChart from '@/components/BizChart';
import AfterSaleAnalysis from './AfterSaleAnalysis';
import BizDialogSelector from '@/components/BizDialogSelector';
import PurchaseAnalysis from './PurchaseAnalysis';
import SalesAnalysis from './SalesAnalysis';
import StoreAllAnalysis from './StoreAllAnalysis';
export default {
  name: 'MemberProtraitAnalysis',
  data() {
    return {
      date: '',
      dialogVisible: false,
      loading: false,
      chartHeight: '100%',
      defaultImg: '/resources/admin/images/default/product-default.png',
      errorImg: 'this.src="/resources/admin/images/default/product-default.png"',
      DefaultAvatar: DefaultAvatar,
      kpiName: ['本期', '同比', '环比'],
      userPortrait: [],
      showDialog: false,
      showPurchase: false,
      showSales: false,
      showStore: false,
      showAfterSale: false,
      purchaseGraphData: {},
      salesGraphData: {},
      storeGraphData: {},
      chartDataOfAfterSale: {},
      summary: {},
      title: '',
      filters: [
        {
          type: 'input',
          value: '',
          name: 'search',
          placeholder: '请输入商品名称/点击选中商品'
        }
      ],
      dialogLoading: true,
      dialogTableData: [],
      dialogPagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        total: 0
      },
      dialogFilters: [
        {
          type: 'input',
          label: '',
          placeholder: '请输入编号/名称/条码',
          name: 'searchValue',
          value: ''
        }
      ],
      memberMobileData: [],
      beginDate: dateTime.getPreThreeMonthDay(),
      endDate: dateTime.today(),
      viewType: 'month',
      dateType: 'month',
      productId: '',
      curTagName: '',
      memberId: '',
      agentIds: [],
      supplierIds: [],
      readTotalCount: 0,
      buyTotalCount: 0,
      loginTotalCount: 0,
      separator: '、',
      productName: ''
    };
  },
  props: {},
  params: {},
  watch: {
    showDialog(showDialog) {
      if (!showDialog) {
        this.dialogFilters[0].value = '';
      }
    }
  },
  components: {
    // BizFilter,
    BizChart,
    BizDialogSelector,
    ShowSearchGrid,
    PurchaseAnalysis,
    SalesAnalysis,
    StoreAllAnalysis,
    AfterSaleAnalysis
  },
  computed: {},
  methods: {
    ...mapGetters(['getUser']),
    refresh(id) {
      this.productId = id;
      // this.getProductInfo(id);
      this.getStoreGraphData(id);
      this.getPurchaseGraphData(id);
      this.getSaleGraphData(id);
      this.getGraphAfterSaleData(id);
      this.params = { viewType: this.viewType, beginDate: this.beginDate, endDate: this.endDate, dateType: 'month', productId: this.productId };
    },
    refreshHandle(val) {
      this.viewType = val.viewType;
      this.beginDate = val.date[0];
      this.endDate = val.date[1];
      this.dateType = val.dateType;
      this.params = { viewType: this.viewType, beginDate: this.beginDate, endDate: this.endDate, dateType: 'month', productId: this.productId };
      this.refresh(this.productId);
    },
    purchaseAnalysis() {
      this.title = '采购趋势';
      this.showStore = false;
      this.showSales = false;
      this.showAfterSale = false;
      this.showPurchase = true;
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs.purchaseAnalysis.load();
      });
    },
    salesAnalysis() {
      this.title = '销售趋势';
      this.showStore = false;
      this.showPurchase = false;
      this.showAfterSale = false;
      this.showSales = true;
      this.dialogVisible = true;
      console.log(this.params);
      this.$nextTick(() => {
        this.$refs.salesAnalysis.load();
      });
    },
    storeAnalysis() {
      this.title = '库存趋势';
      this.showPurchase = false;
      this.showSales = false;
      this.showAfterSale = false;
      this.showStore = true;
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs.storeAnalysis.load();
      });
    },
    afterSaleAnalysis() {
      this.title = '售后情况';
      this.showStore = false;
      this.showSales = false;
      this.showPurchase = false;
      this.showAfterSale = true;
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs.afterSaleAnalysis.load();
      });
    },
    queryProducts() {
      this.dialogLoading = true;
      let params = {
        pageSize: this.dialogPagination.pageSize,
        pageNumber: this.dialogPagination.currentPage,
        searchValue: this.dialogFilters[0].value
      };
      http
        .get('/admin/invoicingProduct/stockCenterProducts.jhtml', params)
        .then(data => {
          this.dialogTableData = data.dataList;
          this.dialogPagination.total = Number(data.total);
          this.dialogLoading = false;
        })
        .catch(error => {
          if (error.errorMessage) {
            console.log(error.errorMessage);
          }
        });
    },
    // getProductInfo(id) {
    //   let param = {
    //     shopId: window.top.SHOP_ID || '',
    //     productName: this.productName || ''
    //   };
    //   http
    //     .post('/admin/ecommerce/kpi/single/summary/singleProductDetail.jhtml', param)
    //     .then(data => {
    //       this.userPortrait = data.indicators;
    //       this.init(id);
    //     })
    //     .catch(error => {
    //       if (error.errorMessage) {
    //         console.log(error.errorMessage);
    //       }
    //     });
    // },
    searchByName() {
      let param = {
        shopId: window.top.SHOP_ID || '',
        productName: this.filters[0].value
      };
      http
        .post('/admin/ecommerce/kpi/single/summary/singleProductDetail.jhtml', param)
        .then(data => {
          this.userPortrait = data.indicators;
          this.productName = data.indicators.productName;
          if (data.indicators.productId) {
            this.refresh(data.indicators.productId);
          }
        })
        .catch(error => {
          if (error.errorMessage) {
            console.log(error.errorMessage);
          }
        });
    },
    init(id) {
      this.loading = true;
      let params = {
        indicators: ['purchaseProductNum', 'salesProductNum', 'depotProductNum'],
        beginDate: this.beginDate,
        endDate: this.endDate,
        viewType: this.viewType,
        productId: this.productId || id || ''
      };
      http
        .post('/admin/ecommerce/kpi/single/summary/single.jhtml', params)
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
    getCooperations() {
      let params = {
        cooperationType: '1',
        pageSize: 1000,
        pageNumber: 1
      };
      http
        .get('/admin/cooperationInfo/cooperationInfos.jhtml', params)
        .then(data => {
          this.agentIds = data.dataList.map(item => {
            return item.id;
          });
          this.query();
        })
        .catch(errData => {
          this.loading = false;
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
        });
      let param = {
        cooperationType: '0',
        pageSize: 1000,
        pageNumber: 1
      };
      http
        .get('/admin/cooperationInfo/cooperationInfos.jhtml', param)
        .then(data => {
          this.supplierIds = data.dataList.map(item => {
            return item.id;
          });
          this.query();
        })
        .catch(errData => {
          this.loading = false;
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    getPurchaseGraphData(id) {
      this.readTotalCount = 0;
      let param = {
        shopId: window.top.SHOP_ID || '',
        viewType: this.viewType,
        productId: id || '',
        supplierIds: this.supplierIds,
        indicators: ['purchaseProductNum'],
        beginDate: this.beginDate,
        endDate: this.endDate
      };
      http
        .post('/admin/ecommerce/kpi/purchase/graph/columnGraph.jhtml', param)
        .then(data => {
          this.purchaseGraphData = this.dataFormat(data);
        })
        .catch(error => {
          if (error.errorMessage) {
            this.$message.warning(error.errorMessage);
          }
        });
    },
    getSaleGraphData(id) {
      this.readTotalCount = 0;
      let param = {
        shopId: window.top.SHOP_ID || '',
        viewType: this.viewType,
        productId: id || '',
        agentIds: this.agentIds,
        indicators: ['salesProductNum'],
        beginDate: this.beginDate,
        endDate: this.endDate
      };
      http
        .post('/admin/ecommerce/kpi/purchase/graph/columnGraph.jhtml', param)
        .then(data => {
          this.salesGraphData = this.dataFormat(data);
        })
        .catch(error => {
          if (error.errorMessage) {
            this.$message.warning(error.errorMessage);
          }
        });
    },
    getStoreGraphData(id) {
      let param = {
        shopId: window.top.SHOP_ID || '',
        viewType: this.viewType,
        productId: id || '',
        indicators: ['depotProductDepotDist'],
        beginDate: this.beginDate,
        endDate: this.endDate
      };
      http
        .post('/admin/ecommerce/kpi/stock/graph/depotDist.jhtml', param)
        .then(data => {
          this.storeGraphData = this.dataFormatStore(data);
        })
        .catch(error => {
          if (error.errorMessage) {
            this.$message.warning(error.errorMessage);
          }
        });
    },
    // 售后情况
    getGraphAfterSaleData(id) {
      this.loading = true;
      let params = {
        shopId: window.top.SHOP_ID || '',
        viewType: this.viewType,
        productId: id || '',
        indicators: ['purchaseRefundsType'],
        beginDate: this.beginDate,
        endDate: this.endDate
      };
      http
        .post('/admin/ecommerce/kpi/purchase/graph/columnGraphMults.jhtml', params)
        .then(data => {
          this.chartDataOfAfterSale = this.dataFormatWork(data);
        })
        .catch(errData => {
          this.loading = false;
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
        });
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
          yAxisType: ['KMB', 'KMB'],
          yAxisName: ['', '%'],
          showLine: [this.kpiName[1], this.kpiName[2]]
        }
      };
      return chartData;
    },
    dataFormatStore(data) {
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
        }
      };
      return chartData;
    },
    memberSelected() {
      this.showDialog = true;
      this.curTagName = '';
      this.queryProducts();
    },
    filterDataChange(val) {
      this.filters = val;
      this.searchByName();
    },
    handleConfirmed(selectionKeys, selections) {
      this.showDialog = false;
      this.productName = selections[0].name;
      this.refresh(selections[0].id);
      console.log(selections[0]);
      this.userPortrait = selections[0];
      this.init(selections[0].id);
    },
    dialogFilterDataChange(val) {
      this.dialogFilters = val;
      this.dialogPagination.currentPage = 1;
      this.queryProducts();
    },
    dialogPageSizeChange(val) {
      this.dialogPagination.pageSize = val;
      this.queryProducts();
    },
    dialogCurrentPageChange(val) {
      this.dialogPagination.currentPage = val;
      this.queryProducts();
    },
    getStatus(row) {
      switch (row.state) {
        case '0':
          return '已创建';

        case '1':
          return '已提交';

        case '2':
          return '已上架';

        case '3':
          return '已下架';
        default:
          break;
      }
      return '';
    }
  },
  created() {
    this.getCooperations();
  },
  mounted() {}
};
</script>

<style lang="scss">
.product-portrait-analysis {
  height: 100%;
  padding-bottom: 20px;
  padding-right: 10px;
  min-width: 560px;
  overflow: auto;
  margin: 20px 0px 20px 20px;
  color: rgb(96, 98, 102);
  font-size: 14px;
  .search-property {
    width: 80%;
    display: flex;
    justify-content: space-between;
    .el-input--prefix .el-input__inner {
      height: 35px;
    }
  }
  .total {
    display: flex;
    margin-top: 20px;
    .column1 {
      border: 1px solid #d9d9d9;
      padding: 20px;
      width: 350px;
      height: 155px;
      line-height: 40px;
      margin: 0px 20px 0px 10px;
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
      margin: 0px 0px 0px 20px;
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
    .column3 {
      border: 1px solid #d9d9d9;
      padding: 20px;
      width: 350px;
      height: 155px;
      line-height: 40px;
      margin: 0px 5px 0px 20px;
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
  }
  .chart-area {
    margin-top: 10px;
    display: flex;
    .graph {
      box-shadow: 0 2px 3px rgba(0, 0, 0, 0.1);
      margin-bottom: 20px;
      margin-right: 5px;
      width: 49%;
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
  .header1 {
    background-color: #f7f7f7;
    height: 40px;
    font-weight: 700;
    justify-content: flex-start;
    display: flex;
    span:first-child {
      padding: 10px;
      display: block;
      font-weight: bold;
      float: left;
    }
    .time-portrait {
      float: right;
    }
  }
  .filter-portrait {
    float: right;
    margin-bottom: 10px;
    display: flex;
  }
  .operator {
    padding: 10px;
  }
  .member-info {
    margin: 10px;
    width: 98%;
    box-shadow: 0 2px 3px rgba(0, 0, 0, 0.1);
    clear: both;
    .container {
      width: 98%;
      height: 120px;
      display: flex;
      padding: 10px;
      .header-img {
        width: 80px;
        height: 80px;
        margin-right: 50px;
        margin-top: 10px;
        img {
          width: auto;
          height: auto;
          max-width: 100%;
          max-height: 100%;
        }
        .wrapper {
          margin-left: 56px;
          position: relative;
          .gender {
            .iconfont {
              position: absolute;
              left: 8px;
              bottom: -2px;
              font-size: 24px;
            }

            .male {
              color: #2069cb;
            }
            .female {
              color: #f935d1;
            }
            .none {
              color: #ff7300;
            }
          }
        }
      }
      .info-con {
        width: 100%;
        .base-info {
          width: 33%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          height: 30px;
          float: left;
          text-align: left;
          line-height: 30px;
        }
        .dec-info {
          float: left;
          width: 100%;
          line-height: 30px;
          -webkit-text-fill-color: darkgray;
        }
      }
    }
  }
  .graph-container {
    width: 100%;
    display: flex;
    .left-graph {
      width: 33%;
      height: 22vw;
      box-shadow: 0 2px 3px rgba(0, 0, 0, 0.1);
      margin: 20px 10px 10px 10px;
      .font {
        color: #666666;
        font-weight: normal;
        padding: 10px;
      }
      .biz-chart {
        min-width: 33% !important;
        .chart-area {
          margin-top: 0px !important;
          height: 100% !important;
        }
      }
    }
    .between-graph {
      width: 33%;
      height: 22vw;
      box-shadow: 0 2px 3px rgba(0, 0, 0, 0.1);
      margin: 20px 10px 10px 10px;
      .font {
        color: #666666;
        font-weight: normal;
        padding: 10px;
      }
      .biz-chart {
        min-width: 33% !important;
        .chart-area {
          margin-top: 0px !important;
          height: 100% !important;
        }
      }
    }
    .right-graph {
      width: 33%;
      height: 22vw;
      box-shadow: 0 2px 3px rgba(0, 0, 0, 0.1);
      margin: 20px 10px 10px 10px;
      .font {
        color: #666666;
        font-weight: normal;
        padding: 10px;
      }
      .biz-chart {
        min-width: 33% !important;
        .chart-area {
          margin-top: 0px !important;
          height: 100% !important;
        }
      }
    }
  }
}
.notice-dialog-selector {
  .biz-two-column {
    display: flex;
    img {
      width: 100px;
      height: 100px;
    }
    .biz-two-row {
      display: flex;
      flex-direction: column;
      justify-content: center;
      .titleClass {
        text-overflow: ellipsis;
        overflow: hidden;
        width: 100px;
        white-space: nowrap;
      }
    }
  }
  .customer-info {
    img {
      float: left;
      width: 40px;
      height: 40px;
      border-radius: 50%;
    }
    .wrapper {
      margin-left: 56px;
      position: relative;
      .gender {
        .iconfont {
          position: absolute;
          left: -28px;
          bottom: -2px;
          font-size: 24px;
        }

        .male {
          color: #2069cb;
        }
        .female {
          color: #f935d1;
        }
        .none {
          color: #ff7300;
        }
      }
    }
  }
  .platform-tags {
    display: block;
    float: left;
  }
  .show-more {
    color: coral;
  }
}
</style>
