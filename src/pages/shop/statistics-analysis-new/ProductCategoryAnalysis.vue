<template>
  <div class="product-category-analysis">
    <div class="member-info">
      <div class="header">
        <span>{{ userPortrait.productCateGoryName }}</span>
        <span><el-button @click="memberSelected" type="text" size="mini">切换</el-button></span>
      </div>
      <div class="container">
        <div class="header-img">
          <img v-if="userPortrait.productCateGoryLogo" :src="userPortrait.productCateGoryLogo" alt />
          <img v-else :src="DefaultAvatar" />
        </div>
        <div class="info-con">
          <div class="base-info" :title="userPortrait.totalNum">商品品种：{{ userPortrait.totalNum }}</div>
          <div class="base-info">已上架：{{ userPortrait.marketableNum }}</div>
          <div class="base-info" :title="userPortrait.noMarketableNum">已下架：{{ userPortrait.noMarketableNum }}</div>
        </div>
      </div>
    </div>
    <div class="graph-container">
      <div class="left-graph">
        <div class="header">
          <span>销售趋势</span>
        </div>
        <biz-chart :chartData="lineChartData" :showSearch="false" :chartHeight="chartHeight"></biz-chart>
      </div>
      <div class="right-graph">
        <div class="header">
          <span>商品数量分布</span>
          <span class="font">购买品种：{{ buyTotalCount }}</span>
        </div>
        <biz-chart :chartData="amountGraphData" :showSearch="false" :chartHeight="chartHeight"></biz-chart>
      </div>
    </div>
    <div class="graph-container">
      <div class="left-graph">
        <div class="header">
          <span>销售数量分布</span>
          <span class="font">销售总量：{{ readTotalCount }}</span>
        </div>
        <biz-chart :chartData="saleAmountGraphData" :showSearch="false" :chartHeight="chartHeight"></biz-chart>
      </div>
      <div class="right-graph">
        <div class="header">
          <span>销售金额分布</span>
          <span class="font">销售总额：{{ loginTotalCount }}</span>
        </div>
        <biz-chart :chartData="salePriceGraphData" :showSearch="false" :chartHeight="chartHeight"></biz-chart>
      </div>
    </div>
    <biz-dialog-selector
      title="选择分类"
      :visibility.sync="showDialog"
      :appendToBody="true"
      :selectionMode="'single'"
      :isClear="false"
      :loading="dialogLoading"
      :tableData="curDialogTableData"
      :pagination="dialogPagination"
      @confirmed="handleConfirmed"
      @pageSizeChange="dialogPageSizeChange"
      @currentPageChange="dialogCurrentPageChange"
      class="notice-dialog-selector"
    >
      <el-table-column prop="name" label="分类"> </el-table-column>
      <el-table-column prop="childrenProductCategoryData" label="参数">
        <template slot-scope="scope">
          <template v-for="(parameterGroupDataList, index) in scope.row.parameterGroupDataList">
            {{ parameterGroupDataList.name }}
            <template v-if="index < scope.row.parameterGroupDataList.length - 1">{{ separator }}</template>
          </template>
        </template>
      </el-table-column>
      <el-table-column prop="childrenProductCategoryData" label="规格">
        <template slot-scope="scope">
          <template v-for="(specificationDataList, index) in scope.row.specificationDataList">
            {{ specificationDataList.name }}
            <template v-if="index < scope.row.specificationDataList.length - 1">{{ separator }}</template>
          </template>
        </template>
      </el-table-column>
      <el-table-column prop="shop.name" label="店铺"> </el-table-column>
    </biz-dialog-selector>
  </div>
</template>

<script>
import DefaultAvatar from '@/assets/images/default_user.png';
import dateTime from '@/utils/dateTime';
import http from '@/common/http';
import { mapGetters } from 'vuex';
import BizChart from '@/components/BizChart';
import BizDialogSelector from '@/components/BizDialogSelector';

export default {
  name: 'MemberProtraitAnalysis',
  data() {
    return {
      curCategoryId: '',
      date: '',
      chartHeight: '100%',
      separator: '、',
      DefaultAvatar: DefaultAvatar,
      userPortrait: [],
      showDialog: false,
      lineChartData: {},
      amountGraphData: {
        legendVisible: false,
        type: 'pie',
        data: {
          columns: ['type', 'value'],
          rows: []
        },
        settings: {
          offsetY: '50%'
        }
      },
      saleAmountGraphData: {
        legendVisible: false,
        type: 'pie',
        data: {
          columns: ['type', 'value'],
          rows: []
        },
        settings: {
          offsetY: '50%'
        }
      },
      salePriceGraphData: {
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
      dialogLoading: true,
      viewType: 'month',
      dialogTableData: [],
      memberMobileData: [],
      beginDate: dateTime.getPreThreeMonthDay(),
      endDate: dateTime.today(),
      curTagName: '',
      memberId: '',
      readTotalCount: 0,
      buyTotalCount: 0,
      loginTotalCount: 0,
      dialogPagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        total: 0
      }
    };
  },
  props: {},
  watch: {
  },
  components: {
    BizChart,
    BizDialogSelector
  },
  computed: {
    curDialogTableData() {
      return this.dialogTableData.slice((this.currentPage - 1) * this.pageSize, this.pageSize);
    }
  },
  methods: {
    ...mapGetters(['getUser']),
    async refresh(categoryId) {
      // this.getMemberInfo(categoryId);
      if (!categoryId) {
        await this.queryCategory();
      } else {
        this.curCategoryId = categoryId;
      }
      this.getCategoryInfo(this.curCategoryId);
      this.getLineGraphData(this.curCategoryId);
      this.getAmountGraphData(this.curCategoryId);
      this.getSalePriceGraphData(this.curCategoryId);
      this.getSaleAmountGraphData(this.curCategoryId);
    },
    queryCategory() {
      this.dialogLoading = true;
      let params = {
        shopId: window.top.SHOP_ID || '',
        pageSize: this.dialogPagination.pageSize,
        pageNumber: this.dialogPagination.currentPage
      };
      return new Promise((resolve, reject) => {
        http
          .get('/admin/json/ShopProduct_category/list.jhtml', params)
          .then(data => {
            this.dialogTableData = data.ProductCategoryManage;
            if (!this.curCategoryId) {
              this.curCategoryId = this.dialogTableData[0].id;
            }
            this.dialogPagination.total = Number(data.ProductCategoryManage.length);
            this.dialogLoading = false;
            resolve();
          })
          .catch(error => {
            if (error.errorMessage) {
              this.$message.warning(error.errorMessage);
            }
            reject(error);
          })
          .finally(() => {});
      });
    },
    getCategoryInfo(categoryId) {
      let param = {
        shopId: window.top.SHOP_ID || '',
        productCateGorys: [categoryId]
      };
      http
        .post('/admin/ecommerce/kpi/product/summary/category.jhtml', param)
        .then(data => {
          this.userPortrait = data.indicators;
        })
        .catch(error => {
          if (error.errorMessage) {
            console.log(error.errorMessage);
          }
        });
    },
    // 销售数量
    getSaleAmountGraphData(categoryId) {
      this.readTotalCount = 0;
      let param = {
        shopId: window.top.SHOP_ID || '',
        type: 'productNumDistribute',
        beginDate: this.beginDate,
        endDate: this.endDate,
        productCateGorys: [categoryId],
        indicators: ['productTypeSafeNumDistribute'],
        viewType: this.viewType
      };
      http
        .post('/admin/ecommerce/kpi/product/graph/product.jhtml', param)
        .then(data => {
          for (const item of data.indicators) {
            this.readTotalCount += Number(item.value);
          }
          this.saleAmountGraphData.data.rows = data.indicators.map(item => {
            return { type: item.lable, value: item.value };
          });
        })
        .catch(error => {
          if (error.errorMessage) {
            this.$message.warning(error.errorMessage);
          }
        });
    },
    // 商品数量
    getAmountGraphData(categoryId) {
      this.buyTotalCount = 0;
      let param = {
        shopId: window.top.SHOP_ID || '',
        type: 'productNumDistribute',
        beginDate: this.beginDate,
        endDate: this.endDate,
        productCateGorys: [categoryId],
        indicators: ['productTypeNumDistribute'],
        viewType: this.viewType
      };
      http
        .post('/admin/ecommerce/kpi/product/graph/product.jhtml', param)
        .then(data => {
          for (const item of data.indicators) {
            this.buyTotalCount += Number(item.value);
          }
          this.amountGraphData.data.rows = data.indicators.map(item => {
            return { type: item.lable, value: item.value };
          });
        })
        .catch(error => {
          if (error.errorMessage) {
            this.$message.warning(error.errorMessage);
          }
        });
    },
    // 销售金额
    getSalePriceGraphData(categoryId) {
      this.loginTotalCount = 0;
      let param = {
        shopId: window.top.SHOP_ID || '',
        type: 'productSafeAnalysis',
        beginDate: this.beginDate,
        endDate: this.endDate,
        productCateGorys: [categoryId],
        indicators: ['productTypeSafeAmountDistribute'],
        viewType: this.viewType
      };
      http
        .post('/admin/ecommerce/kpi/product/graph/product.jhtml', param)
        .then(data => {
          for (const item of data.indicators) {
            this.loginTotalCount += Number(item.value);
          }
          this.salePriceGraphData.data.rows = data.indicators.map(item => {
            return { type: item.lable, value: item.value };
          });
        })
        .catch(error => {
          if (error.errorMessage) {
            this.$message.warning(error.errorMessage);
          }
        });
    },
    // 销售趋势
    getLineGraphData(categoryId) {
      let param = {
        shopId: window.top.SHOP_ID || '',
        type: 'productSafeAnalysis',
        beginDate: this.beginDate,
        endDate: this.endDate,
        productCateGorys: [categoryId],
        indicators: ['productTypeSafeAmountTrend', 'productTypeSafeNumTrend'],
        viewType: this.viewType
      };
      http
        .post('/admin/ecommerce/kpi/product/graph/product.jhtml', param)
        .then(data => {
          this.lineChartData = this.lineFormat(data);
        })
        .catch(error => {
          if (error.errorMessage) {
            this.$message.warning(error.errorMessage);
          }
        });
    },
    lineFormat(data) {
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
    memberSelected() {
      this.showDialog = true;
      this.queryCategory();
    },
    handleConfirmed(selectionKeys, selections) {
      this.showDialog = false;
      this.refresh(selections[0].id);
    },
    dialogPageSizeChange(val) {
      this.dialogPagination.pageSize = val;
      this.queryCategory();
    },
    dialogCurrentPageChange(val) {
      this.dialogPagination.currentPage = val;
      this.queryCategory();
    }
  },
  created() {},
  mounted() {
    this.refresh();
  }
};
</script>

<style lang="scss">
.product-category-analysis {
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
          max-width: 100%;
          max-height: 100%;
          border-radius: 50%;
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
      width: 50%;
      height: 33vw;
      overflow: hidden;
      box-shadow: 0 2px 3px rgba(0, 0, 0, 0.1);
      margin: 20px 10px 10px 10px;
      .font {
        color: #666666;
        font-weight: normal;
        padding: 10px;
      }
      .biz-chart {
        min-width: 50% !important;
        .chart-area {
          margin-top: 0px !important;
          height: 100% !important;
        }
      }
    }
    .right-graph {
      width: 50%;
      height: 33vw;
      overflow: hidden;
      box-shadow: 0 2px 3px rgba(0, 0, 0, 0.1);
      margin: 20px 10px 10px 10px;
      .font {
        color: #666666;
        font-weight: normal;
        padding: 10px;
      }
      .biz-chart {
        min-width: 50% !important;
        .chart-area {
          margin-top: 0px !important;
          height: 100% !important;
        }
      }
    }
  }
}
.notice-dialog-selector {
  .biz-dialog-selector > .el-dialog > .el-dialog__body .biz-pagination {
    display: none;
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
