<template>
  <div class="single-store-analysis">
    <div class="operator">
      <div class="filter-portrait" v-if="filters.length > 0">
        <biz-filter v-if="filters.length > 0" :filters="filters" @filterDataChange="filterDataChange"></biz-filter>
      </div>
    </div>
    <div class="member-info">
      <div class="header">
        <span>店铺信息</span>
        <span>
          <el-button @click="memberSelected" type="text" size="mini">切换</el-button>
        </span>
      </div>
      <div class="container">
        <div class="header-img">
          <img v-if="shopInfo.head" :src="shopInfo.head" alt />
          <img v-else :src="DefaultAvatar" />
        </div>
        <div class="info-con">
          <div class="base-info" :title="shopInfo.name">店铺名称：{{shopInfo.name}}</div>
          <div class="base-info">所属城市：{{shopInfo.city}}</div>
          <div class="base-info">联系方式：{{shopInfo.phone}}</div>
          <div class="base-info" :title="shopInfo.brands">
            经营品牌：
            <span v-for="(item, index) in shopInfo.brands" :key="index">
              {{item}}
              <i v-if="index < shopInfo.brands.length - 1">{{separator}}</i>
            </span>
          </div>
          <div class="base-info">
            店铺特色：
            <span v-for="(item, index) in shopInfo.tags" :key="index">
              {{item}}
              <i v-if="index < shopInfo.tags.length - 1">{{separator}}</i>
            </span>
          </div>
          <div class="base-info" :title="shopInfo.address">地址：{{shopInfo.address}}</div>
          <div class="dec-info">{{shopInfo.summarize}}</div>
        </div>
        <div class="header-img-qr">
          <img v-if="shopInfo.qrCodePath" :src="shopInfo.qrCodePath" alt style="width: auto;height: auto;max-width: 100px;" />
          <img v-else :src="DefaultAvatar" />
        </div>
      </div>
    </div>
    <div class="graph-container">
      <div class="left-graph">
        <div class="header">
          <span>店铺能力</span>
        </div>
        <biz-chart :chartData="radarChartData" :showSearch="false" :chartHeight="chartHeight" style="padding-bottom:40px;"></biz-chart>
      </div>
      <div class="between-graph">
        <div class="header">
          <span>月订单额趋势</span>
        </div>
        <biz-chart :chartData="timesGraphData" :axisLabelRotate="labelRotate" :showSearch="false" :chartHeight="chartHeight"></biz-chart>
      </div>
      <div class="right-graph">
        <div class="header">
          <span>月订单量趋势</span>
        </div>
        <biz-chart :chartData="amountGraphData" :axisLabelRotate="labelRotate" :showSearch="false" :chartHeight="chartHeight"></biz-chart>
      </div>
    </div>
    <div class="graph-container">
      <div class="left-graph">
        <div class="header">
          <span>文章类型偏好</span>
          <span class="font">文章数：{{readTotalCount}}</span>
        </div>
        <biz-chart :chartData="articlePreferenceGraphData" :showSearch="false" :chartHeight="chartHeight"></biz-chart>
      </div>
      <div class="between-graph">
        <div class="header">
          <span>商品类型分布</span>
          <span class="font">商品量：{{buyTotalCount}}</span>
        </div>
        <biz-chart :chartData="productPreferenceGraphData" :showSearch="false" :chartHeight="chartHeight"></biz-chart>
      </div>
      <div class="right-graph">
        <div class="header">
          <span>店铺满意度分布</span>
          <span class="font">评价人数：{{loginTotalCount}}</span>
        </div>
        <biz-chart :chartData="loginGraphData" :showSearch="false" :chartHeight="chartHeight"></biz-chart>
      </div>
    </div>
    <biz-dialog-selector
      title="选择店铺"
      :visibility.sync="showDialog"
      :appendToBody="true"
      :selectionMode="'single'"
      :isClear="false"
      :loading="dialogLoading"
      :tableData="dialogTableData"
      :pagination="dialogPagination"
      @confirmed="handleConfirmed"
      class="notice-dialog-selector"
    >
      <el-table-column prop="logo" label="店铺logo">
        <template slot-scope="scope">
          <img v-if="scope.row.logo" :src="scope.row.logo" style="width:100px;height:100px;" />
          <img v-else src="@/assets/images/shop-logo.png" />
        </template>
      </el-table-column>
      <el-table-column prop="name" label="店铺名称"></el-table-column>
    </biz-dialog-selector>
  </div>
</template>

<script>
import DefaultAvatar from '@/assets/images/shop-logo.png';
import BizFilter from '@/components/BizTable/BizFilter.vue';
import dateTime from '@/utils/dateTime';
import http from '@/common/http';
import { mapGetters } from 'vuex';
import BizChart from '@/components/BizChart';
import BizDialogSelector from '@/components/BizDialogSelector';

export default {
  name: 'SingleStoreAnalysis',
  data() {
    return {
      date: '',
      chartHeight: '100%',
      labelRotate: 45,
      DefaultAvatar: DefaultAvatar,
      shopInfo: [],
      showDialog: false,
      timesGraphData: {},
      amountGraphData: {},
      articlePreferenceGraphData: {
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
      radarChartData: {},
      productPreferenceGraphData: {
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
      loginGraphData: {
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
      dialogPagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        // 总条目数
        total: 0
      },
      filters: [
        {
          type: 'input',
          value: '',
          name: 'search',
          placeholder: '请输入店铺名称'
        }
      ],
      dialogLoading: true,
      dialogTableData: [],
      memberMobileData: [],
      beginDate: dateTime.getPreThreeMonthDay(),
      endDate: dateTime.today(),
      curTagName: '',
      memberId: '',
      readTotalCount: 0,
      buyTotalCount: 0,
      loginTotalCount: 0,
      separator: '、'
    };
  },
  props: {},
  watch: {},
  components: {
    BizFilter,
    BizChart,
    BizDialogSelector
  },
  computed: {},
  methods: {
    ...mapGetters(['getUser']),
    refresh(id) {
      this.getMemberInfo(id);
      this.getTimesGraphData(id);
      this.getAmountGraphData(id);
      this.getLoginGraphData(id);
      this.getArticlePreferenceGraphData(id);
      this.getProductPreferenceGraphData(id);
      this.getRadarGraphData(id);
    },
    queryMembers() {
      this.dialogLoading = true;
      let params = {};
      http
        .get('/admin/admin/manageShops.jhtml', params)
        .then(data => {
          this.dialogTableData = data.dataList;
          this.dialogPagination.total = data.dataList.length;
          this.dialogLoading = false;
        })
        .catch(errData => {
          errData.errorMessage !== '店铺不存在' && this.$message.warning(errData.errorMessage);
          this.dialogLoading = false;
        });
    },
    getMemberInfo(id) {
      let param = {
        shopId: window.top.SHOP_ID || id || ''
      };
      http
        .get('/admin/ecommerce/kpi/summary/single/store.jhtml', param)
        .then(data => {
          this.shopInfo = data.shop;
        })
        .catch(error => {
          if (error.errorMessage) {
            console.log(error.errorMessage);
          }
        });
    },
    searchByName() {
      let param = {
        searchValue: this.filters[0].value
      };
      http
        .get('/admin/store/queryStoreByName.jhtml', param)
        .then(data => {
          this.memberMobileData = data.store;
          this.refresh(this.memberMobileData.id);
        })
        .catch(error => {
          if (error.errorMessage) {
            this.$message.warning(error.errorMessage);
          }
        });
    },
    // 文章偏好
    getArticlePreferenceGraphData(id) {
      this.readTotalCount = 0;
      let param = {
        shopId: window.top.SHOP_ID || id || ''
      };
      http
        .get('/admin/ecommerce/kpi/graph/single/storeArticlePreference.jhtml', param)
        .then(data => {
          for (const item of data.indicators) {
            this.readTotalCount += Number(item.value);
          }
          this.articlePreferenceGraphData.data.rows = data.indicators.map(item => {
            return { type: item.lable, value: item.value };
          });
        })
        .catch(error => {
          if (error.errorMessage) {
            this.$message.warning(error.errorMessage);
          }
        });
    },
    // 商品类型
    getProductPreferenceGraphData(id) {
      this.buyTotalCount = 0;
      let param = {
        shopId: window.top.SHOP_ID || id || ''
      };
      http
        .get('/admin/ecommerce/kpi/graph/single/storeProducePreference.jhtml', param)
        .then(data => {
          for (const item of data.indicators) {
            this.buyTotalCount += Number(item.value);
          }
          this.productPreferenceGraphData.data.rows = data.indicators.map(item => {
            return { type: item.lable, value: item.value };
          });
        })
        .catch(error => {
          if (error.errorMessage) {
            this.$message.warning(error.errorMessage);
          }
        });
    },
    // 店铺满意度
    getLoginGraphData(id) {
      this.loginTotalCount = 0;
      let param = {
        shopId: window.top.SHOP_ID || id || ''
      };
      http
        .get('/admin/ecommerce/kpi/graph/single/storeReviewPreference.jhtml', param)
        .then(data => {
          for (const item of data.indicators) {
            this.loginTotalCount += Number(item.value);
          }
          this.loginGraphData.data.rows = data.indicators.map(item => {
            return { type: item.lable, value: item.value };
          });
        })
        .catch(error => {
          if (error.errorMessage) {
            this.$message.warning(error.errorMessage);
          }
        });
    },
    // 店铺能力
    getRadarGraphData(id) {
      let param = {
        shopId: window.top.SHOP_ID || id || ''
      };
      http
        .get('/admin/ecommerce/kpi/graph/single/storeAbility.jhtml', param)
        .then(data => {
          this.radarChartData = this.radarFormat(data);
        })
        .catch(error => {
          if (error.errorMessage) {
            this.$message.warning(error.errorMessage);
          }
        });
    },
    radarFormat(data) {
      let tmpData = [];
      let a = [];
      let b = [];
      for (let i = 0; i < data.indicators.length; i++) {
        b.push(data.indicators[i].lable);
        tmpData.push({
          店铺能力: '店铺能力',
          [data.indicators[i].lable]: data.indicators[i].value
        });
      }
      a.push(Object.assign(...tmpData));
      console.log(Object.assign(...tmpData));
      let radarChartData = {
        type: 'radarShop',
        data: {
          columns: ['店铺能力'].concat(b),
          rows: a, // 多个对象放在一个对象里
          data: data.indicators
        },
        settings: {}
      };
      return radarChartData;
    },
    // 月订单额
    getTimesGraphData(id) {
      let param = {
        shopId: window.top.SHOP_ID || id || ''
      };
      http
        .get('/admin/ecommerce/kpi/graph/single/storeOrderAmount.jhtml', param)
        .then(data => {
          this.timesGraphData = this.dataTimesFormat(data);
        })
        .catch(error => {
          if (error.errorMessage) {
            this.$message.warning(error.errorMessage);
          }
        });
    },
    dataTimesFormat(data) {
      let tmpData = [];
      for (let i = 0; i < data.indicators.length; i++) {
        tmpData.push({
          日期: data.indicators[i].xValue,
          订单额: data.indicators[i].yValue
        });
      }
      let chartData = {
        legendVisible: false,
        type: 'histogram',
        data: {
          columns: ['日期', '订单额'],
          rows: tmpData
        },
        settings: {}
      };
      return chartData;
    },
    // 月订单量
    getAmountGraphData(id) {
      let param = {
        shopId: window.top.SHOP_ID || id || ''
      };
      http
        .get('/admin/ecommerce/kpi/graph/single/storeOrderCount.jhtml', param)
        .then(data => {
          this.amountGraphData = this.dataAmountFormat(data);
        })
        .catch(error => {
          if (error.errorMessage) {
            this.$message.warning(error.errorMessage);
          }
        });
    },
    dataAmountFormat(data) {
      let tmpData = [];
      for (let i = 0; i < data.indicators.length; i++) {
        tmpData.push({
          日期: data.indicators[i].xValue,
          订单量: data.indicators[i].yValue
        });
      }
      let chartData = {
        legendVisible: false,
        type: 'histogram',
        data: {
          columns: ['日期', '订单量'],
          rows: tmpData
        },
        settings: {}
      };
      return chartData;
    },
    memberSelected() {
      this.showDialog = true;
      this.curTagName = '';
      this.queryMembers();
    },
    filterDataChange(val) {
      this.filters = val;
      this.searchByName();
    },
    handleConfirmed(selectionKeys, selections) {
      this.showDialog = false;
      this.refresh(selections[0].id);
    }
  },
  created() {},
  mounted() {
    this.refresh();
  }
};
</script>

<style lang="scss">
.single-store-analysis {
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
      height: 140px;
      display: flex;
      padding: 10px;
      .header-img {
        width: 80px;
        height: 80px;
        margin-right: 50px;
        img {
          width: auto;
          height: auto;
          max-width: 100px;
          // max-height: 100%;
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
        width: 80%;
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
        margin-left: auto;
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
        margin-left: auto;
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
        margin-left: auto;
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
