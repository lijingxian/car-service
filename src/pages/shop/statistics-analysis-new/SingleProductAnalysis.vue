<template>
  <div class="single-product-analysis">
    <div class="operator">
      <div class="filter-portrait" v-if="filters.length > 0">
        <biz-filter v-if="filters.length > 0" :filters="filters" @filterDataChange="filterDataChange"></biz-filter>
      </div>
    </div>
    <div class="member-info">
      <div class="header">
        <span>{{ userPortrait.name }}</span>
        <span>
          <el-button @click="memberSelected" type="text" size="mini">切换</el-button>
        </span>
      </div>
      <div class="container">
        <div class="header-img">
          <img v-if="userPortrait.image" :src="userPortrait.image" alt />
          <img v-else :src="DefaultAvatar" />
        </div>
        <div class="info-con">
          <div class="base-info">商品分类：{{ userPortrait.category }}</div>
          <div class="base-info">类型：{{ userPortrait.productType }}</div>
          <div class="base-info">销售价：{{ userPortrait.priceDesp ? '价格面议' : userPortrait.price }}</div>
          <div class="base-info">商品条码：{{ userPortrait.barCode }}</div>
          <div class="base-info">商品重量：{{ userPortrait.weight ? `${userPortrait.weight}kg` : '' }}</div>
        </div>
      </div>
    </div>
    <div class="graph-container">
      <div class="left-graph">
        <div class="header">
          <span>销售趋势</span>
        </div>
        <biz-chart :chartData="saleChartData" :showSearch="false" :chartHeight="chartHeight"></biz-chart>
      </div>
      <div class="between-graph">
        <div class="header">
          <span>转化趋势</span>
        </div>
        <biz-chart :chartData="transformationChartData" :showSearch="false" :chartHeight="chartHeight"></biz-chart>
      </div>
      <div class="right-graph">
        <div class="header">
          <span>售后趋势</span>
        </div>
        <biz-chart :chartData="afterSaleChartData" :showSearch="false" :chartHeight="chartHeight"></biz-chart>
      </div>
    </div>
    <div class="graph-container">
      <div class="left-graph">
        <div class="header">
          <span>评价情况</span>
        </div>
        <biz-chart :chartData="viewChartData" :showSearch="false" :chartHeight="chartHeight"></biz-chart>
      </div>
      <div class="between-graph">
        <div class="header">
          <span>购买人群消费价值</span>
        </div>
        <biz-chart :chartData="consumeValueChartData" :showSearch="false" :chartHeight="chartHeight"></biz-chart>
      </div>
      <div class="right-graph">
        <div class="header">
          <span>购买人群地域</span>
        </div>
        <biz-chart ref="bizChart" :chartData="chartData" :showSearch="false" :showMap="showMap" :showMapChart="showMapChart">
        </biz-chart>
      </div>
    </div>
    <biz-dialog-selector title="选择商品" :visibility.sync="showDialog" :appendToBody="true" :selectionMode="'single'"
      :isClear="false" :loading="dialogLoading" :tableData="dialogTableData" :pagination="dialogPagination"
      :filters="dialogFilters" @confirmed="handleConfirmed" @filterDataChange="dialogFilterDataChange"
      data-single-prod-analysis-dialog class="notice-dialog-selector" @pageSizeChange="dialogPageSizeChange"
      @currentPageChange="dialogCurrentPageChange">
      <el-table-column width="400" prop="fullName" label="商品名">
        <div slot-scope="scope">
          <div class="biz-two-column">
            <img :src="scope.row.image || defaultImg" :onerror="errorImg" />
            <div class="biz-two-row">
              <div style="margin-left: 10px">编号：{{ scope.row.sn }}</div>
              <div style="margin-left: 10px">{{ scope.row.fullName }}</div>
            </div>
          </div>
        </div>
      </el-table-column>
      <el-table-column prop="categoryName" label="分类"> </el-table-column>
      <el-table-column label="品牌" prop="brandName"> </el-table-column>
      <el-table-column prop="sales" label="销量"> </el-table-column>
      <el-table-column prop="state" label="状态" :formatter="getStatus"> </el-table-column>
      <el-table-column prop="shop.name" label="所属店铺"> </el-table-column>
    </biz-dialog-selector>
  </div>
</template>

<script>
import DefaultAvatar from '@/assets/images/default_user.png';
import BizFilter from '@/components/BizTable/BizFilter.vue';
import dateTime from '@/utils/dateTime';
import http from '@/common/http';
import urls from '@/common/urls';
import { mapGetters } from 'vuex';
import BizChart from '@/components/BizChart';
import BizDialogSelector from '@/components/BizDialogSelector';
import vPinyin from '@/utils/vue-py';

export default {
  name: 'MemberProtraitAnalysis',
  data() {
    return {
      curProductId: '',
      errorImg: 'this.src="/resources/admin/images/default/product-default.png"',
      date: '',
      chartHeight: '100%',
      viewType: 'month',
      DefaultAvatar: DefaultAvatar,
      userPortrait: {},
      showDialog: false,
      saleChartData: {},
      transformationChartData: {},
      afterSaleChartData: {},
      viewChartData: {
        legendVisible: false,
        type: 'pie',
        data: {
          columns: ['type', 'value'],
          rows: []
        },
        settings: {
          radius: ['20%', '60%'],
          offsetY: '50%'
        }
      },
      consumeValueChartData: {
        legendVisible: false,
        type: 'pie',
        data: {
          columns: ['type', 'value'],
          rows: []
        },
        settings: {
          radius: ['20%', '60%'],
          offsetY: '50%'
        }
      },
      chartData: {},
      filters: [
        {
          type: 'input',
          value: '',
          name: 'search',
          placeholder: '请输入商品名称/商品编号'
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
      defaultImg: '/resources/admin/images/default/product-default.png',
      dialogFilters: [
        {
          type: 'input',
          label: '',
          placeholder: '请输入商品名称/商品编号',
          name: 'searchValue',
          value: ''
        }
      ],
      memberMobileData: [],
      beginDate: dateTime.getPreThreeMonthDay(),
      endDate: dateTime.today(),
      curTagName: '',
      memberId: '',
      visitData: '0',
      separator: '、',
      showMap: true,
      showMapChart: false,
      showBackButton: false,
      level: '1',
      charMapData: []
    };
  },
  props: {},
  watch: {
    showDialog(showDialog) {
      if (!showDialog) {
        this.dialogFilters[1].value = '';
      }
    }
  },
  components: {
    BizFilter,
    BizChart,
    BizDialogSelector
  },
  computed: {},
  methods: {
    ...mapGetters(['getUser']),
    async refresh(id) {
      if (id) {
        this.curProductId = id;
      } else {
        await this.queryProductList();
      }
      this.getProductInfo(this.curProductId);
      this.getSaleGraphData(this.curProductId);
      this.getTransformationGraphData(this.curProductId);
      this.getAfterSaleGraphData(this.curProductId);
      this.getViewGraphData(this.curProductId);
      this.getConsumeValueGraphData(this.curProductId);
      this.getCrowRegionGraphData(this.curProductId);
    },
    queryProductList(searchValue) {
      this.dialogLoading = true;
      let params = {
        pageSize: this.dialogPagination.pageSize,
        pageNumber: this.dialogPagination.currentPage,
        searchValue: searchValue || this.dialogFilters[0].value
      };
      return new Promise((resolve, reject) => {
        http
          .get('/admin/product/union/list.jhtml', params)
          .then(data => {
            this.dialogTableData = data.content;
            if (!this.curProductId || searchValue) {
              this.curProductId = this.dialogTableData[0].id;
            }
            this.dialogPagination.total = Number(data.total);
            this.dialogLoading = false;
            resolve();
          })
          .catch(error => {
            if (error.errorMessage) {
              console.log(error.errorMessage);
            }
            reject(error);
          });
      });
    },
    getProductInfo(id) {
      let param = {
        shopId: window.top.SHOP_ID || '',
        id
      };
      http
        .get('/admin/shopProduct/shopProductBasicInfo.jhtml', param)
        .then(data => {
          this.userPortrait = data.productBasicInfoData;
          this.userPortrait.category = data.productCategoryTree.find(i => i.id === data.productBasicInfoData.categoryId).name;
          this.userPortrait.productType = data.productTypes.find(i => i.id === data.productBasicInfoData.productType).name;
          // this.init(id);
        })
        .catch(error => {
          if (error.errorMessage) {
            console.log(error.errorMessage);
          }
        });
    },
    searchByMobile() {
      console.log(1111);
      let param = {
        mobile: this.filters[0].value,
        shopId: window.top.SHOP_ID || ''
      };
      http
        .get(urls.membersMgmt.statisticsAnalysis.searchMemberMobile, param)
        .then(data => {
          this.memberMobileData = data.memberData;
          this.refresh(this.memberMobileData.id);
        })
        .catch(error => {
          if (error.errorInfo) {
            this.$message.warning(error.errorInfo);
          }
        });
    },
    // 销售趋势
    getSaleGraphData(prodId) {
      let param = {
        shopId: window.top.SHOP_ID || '',
        type: 'productSafeAnalysis',
        indicators: ['singleProductSafeAmountTrend', 'singleProductSafeNumTrend'],
        viewType: this.viewType,
        beginDate: this.beginDate,
        endDate: this.endDate,
        productId: prodId || this.curProductId
      };
      http
        .post('/admin/ecommerce/kpi/product/graph/product.jhtml', param)
        .then(data => {
          this.saleChartData = this.saleFormat(data);
        })
        .catch(error => {
          if (error.errorMessage) {
            this.$message.warning(error.errorMessage);
          }
        });
    },
    getTransformationGraph(prodId) {
      let param = {
        shopId: window.top.SHOP_ID || '',
        type: 'productTransformationAnalysis',
        indicators: ['consumeNum ', 'paymentNum'],
        viewType: this.viewType,
        beginDate: this.beginDate,
        endDate: this.endDate,
        productId: prodId || this.curProductId
      };
      http
        .post('/admin/ecommerce/kpi/product/graph/product.jhtml', param)
        .then(data => {
          this.transformationChartData = this.transformationFormat(data);
        })
        .catch(error => {
          if (error.errorMessage) {
            this.$message.warning(error.errorMessage);
          }
        });
    },
    // 转化趋势
    getTransformationGraphData(prodId) {
      let param = {
        table: ['dw_operation_log'],
        showColumn: [
          {
            formula: 'count(1)',
            as: 'productVisitNum'
          }
        ],
        filter: {
          and: [
            {
              name: 'shop_id',
              value: [this.getUser().shop.id],
              compare: 'in'
            },
            {
              name: 'target_id',
              value: prodId || this.curProductId,
              compare: '='
            },
            {
              name: 'biz_code',
              value: 'product',
              compare: '='
            },
            {
              name: 'operate_date',
              value: this.beginDate + ' ' + '00:00:00',
              compare: '>='
            },
            {
              name: 'operate_date',
              value: this.endDate + ' ' + '23:59:59',
              compare: '<='
            }
          ]
        }
      };
      http
        .post('/admin/statistics/common/statisticsDatas.jhtml', param)
        .then(data => {
          this.visitData = data.indicators.statisticsRowDatas[0].statisticsColumnDatas[0].columnValue;
          this.getTransformationGraph(prodId);
        })
        .catch(error => {
          if (error.errorMessage) {
            this.$message.warning(error.errorMessage);
          }
        });
    },
    // 售后趋势
    getAfterSaleGraphData(prodId) {
      let param = {
        shopId: window.top.SHOP_ID || '',
        type: 'productServiceAnalysis',
        indicators: ['singleProductAfterSafeNumTrend', 'singleProductAfterSafeAmountTrend'],
        viewType: this.viewType,
        beginDate: this.beginDate,
        endDate: this.endDate,
        productId: prodId || this.curProductId
      };
      http
        .post('/admin/ecommerce/kpi/product/graph/product.jhtml', param)
        .then(data => {
          this.afterSaleChartData = this.afterSaleFormat(data);
        })
        .catch(error => {
          if (error.errorMessage) {
            this.$message.warning(error.errorMessage);
          }
        });
    },
    saleFormat(data) {
      let tmpData = [];
      for (let i = 0; i < data.indicators.length; i++) {
        tmpData.push({
          日期: data.indicators[i].xValue,
          销售额: data.indicators[i].y[0].yValue,
          销售量: data.indicators[i].y[1].yValue
        });
      }
      let chartData = {
        type: 'line',
        data: {
          columns: ['日期', '销售额', '销售量'],
          rows: tmpData
        },
        settings: {
          yAxisName: ['万元', '件'],
          axisSite: { right: ['销售量'] }
        }
      };
      return chartData;
    },
    transformationFormat(data) {
      console.log(data);
      let tmpData = [
        {
          状态: '浏览人数',
          数值: this.visitData
        },
        { 状态: '购买人数', 数值: data.indicators[0].y[0].yValue },
        { 状态: '付款人数', 数值: data.indicators[0].y[1].yValue }
      ];
      let chartData = {
        type: 'funnel',
        data: {
          columns: ['状态', '数值'],
          rows: tmpData
        },
        settings: {}
      };
      return chartData;
    },
    afterSaleFormat(data) {
      let tmpData = [];
      for (let i = 0; i < data.indicators.length; i++) {
        tmpData.push({
          日期: data.indicators[i].xValue,
          售后次数: data.indicators[i].y[0].yValue,
          售后金额: data.indicators[i].y[1].yValue
        });
      }
      let chartData = {
        type: 'line',
        data: {
          columns: ['日期', '售后次数', '售后金额'],
          rows: tmpData
        },
        settings: {
          yAxisName: ['次', '万元'],
          axisSite: { right: ['售后金额'] }
        }
      };
      return chartData;
    },
    getViewGraphData(prodId) {
      let param = {
        shopId: window.top.SHOP_ID || '',
        type: 'orderSatisfactionTop',
        orderTypes: ['product'],
        indicators: ['satisfaction'],
        viewType: this.viewType,
        beginDate: this.beginDate,
        endDate: this.endDate,
        productId: prodId || this.curProductId
      };
      http
        .post('/admin/ecommerce/kpi/order/graph/order/order.jhtml', param)
        .then(data => {
          this.viewChartData.data.rows = data.indicators.map(item => {
            return { type: item.xValue, value: item.y[1].yValue };
          });
        })
        .catch(error => {
          if (error.errorMessage) {
            this.$message.warning(error.errorMessage);
          }
        });
    },
    getConsumeValueGraphData(prodId) {
      let param = {
        shopId: window.top.SHOP_ID || '',
        type: 'productCrowdAnalysis',
        indicators: ['singleProductConsumeValue'],
        viewType: this.viewType,
        beginDate: this.beginDate,
        endDate: this.endDate,
        productId: prodId || this.curProductId
      };
      http
        .post('/admin/ecommerce/kpi/product/graph/product.jhtml', param)
        .then(data => {
          this.consumeValueChartData.data.rows = data.indicators.map(item => {
            return { type: item.lable, value: item.value };
          });
        })
        .catch(error => {
          if (error.errorMessage) {
            this.$message.warning(error.errorMessage);
          }
        });
    },
    getCrowRegionGraphData(id) {
      this.loginTotalCount = 0;
      let param = {
        shopId: window.top.SHOP_ID || '',
        // type: 'singleProductCrowRegionDistribute',
        indicators: ['singleProductCrowdRegion'],
        viewType: this.viewType,
        beginDate: this.beginDate,
        endDate: this.endDate,
        productId: id || this.curProductId
      };
      http
        .post('/admin/ecommerce/kpi/product/graph/product.jhtml', param)
        .then(data => {
          this.charMapData = data.indicators;
          if (this.level === '3') {
            this.showMap = true;
            this.showMapChart = false;
          }
          this.level = '1';
          this.showBackButton = false;
          this.chartData = this.crowRegionFormat(data.indicators);
        })
        .catch(error => {
          if (error.errorMessage) {
            this.$message.warning(error.errorMessage);
          }
        });
    },
    crowRegionFormat(data) {
      let tmpData = [];
      let tmpDataByPro = [];
      let maxValue = 0;
      if (data.length === 1) {
        for (const item of data) {
          for (let i = 0; i < item.children.length; i++) {
            tmpDataByPro.push({
              位置: item.children[i].name,
              数量: Number(item.children[i].count)
            });
            maxValue = Math.max(maxValue, Number(item.children[i].totalCount));
          }
        }
      } else {
        for (let i = 0; i < data.length; i++) {
          tmpData.push({
            位置: data[i].name,
            数量: Number(data[i].count)
          });
          maxValue = Math.max(maxValue, Number(data[i].totalCount));
        }
      }
      let tmpStr = JSON.stringify(tmpData);
      let str = tmpStr.replace(/省/g, '');
      str = str.replace(/市/g, '');
      str = str.replace(/自治区/g, '');
      str = str.replace(/维吾尔/g, '');
      str = str.replace(/回族/g, '');
      str = str.replace(/壮族/g, '');
      str = str.replace(/特别行政区/g, '');
      let curData = JSON.parse(str);
      if (data.length === 1) {
        curData = tmpDataByPro;
      } else {
        curData = JSON.parse(str);
      }

      let oneProvince = vPinyin.chineseToPinYin(data.length > 0 ? data[0].name : []);

      let chartData = {
        type: 'map',
        legendVisible: false,
        data: {
          columns: ['位置', '数量'],
          rows: curData || []
        },
        maxRangeValue: maxValue || 100,
        settings: {
          position: data.length === 1 ? 'province/' + oneProvince : 'china',
          selectedMode: 'single',
          dimension: '位置',
          metrics: ['数量'],
          itemStyle: {
            normal: {
              areaColor: '#fff'
            }
          }
        }
      };
      return chartData;
    },
    memberSelected() {
      this.showDialog = true;
      this.queryProductList();
    },
    async filterDataChange(val) {
      // this.filters = val;
      // this.refresh(val.id);
      await this.queryProductList(val[0].value);
      this.refresh(this.curProductId);
    },
    handleConfirmed(selectionKeys, selections) {
      this.showDialog = false;
      this.refresh(selections[0].id);
    },
    dialogFilterDataChange(val) {
      this.dialogFilters = val;
      this.dialogPagination.currentPage = 1;
      this.queryProductList();
    },
    dialogPageSizeChange(val) {
      this.dialogPagination.pageSize = val;
      this.queryProductList();
    },
    dialogCurrentPageChange(val) {
      this.dialogPagination.currentPage = val;
      this.queryProductList();
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
  created() {},
  mounted() {
    this.refresh();
  }
};
</script>

<style lang="scss">
.single-product-analysis {
  width: 100%;
  height: 100%;
  overflow: auto;
  color: #606266;
  font-size: 14px;
  overflow-x: hidden;
  .header {
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
        img {
          width: auto;
          height: auto;
          object-fit: cover;
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
        height: calc(100% - 40px);
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
        height: calc(100% - 40px);
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
        height: calc(100% - 40px);
        .chart-area {
          margin-top: 0px !important;
          height: 100% !important;
        }
      }
    }
  }
}
.notice-dialog-selector[data-single-prod-analysis-dialog] {
  .biz-two-column {
    display: flex;
    .biz-two-row {
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
  }
  img {
    width: 40px;
    height: 40px;
  }
}
</style>
