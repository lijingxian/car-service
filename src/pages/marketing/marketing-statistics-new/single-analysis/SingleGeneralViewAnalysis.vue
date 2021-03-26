<template>
  <div class="product-portrait-analysis">
    <div slot="top" style="display:flex">
      <show-search-grid @refreshHandle="refreshHandle" :showViewType="false">
        <div slot="description" class="description-pover">
          <p>效果分析：统计营销活动/资讯的效果</p>
          <p>转化分析：统计活动/资讯的转化情况</p>
          <p>人群分析：统计营销活动/资讯的阅读或参与人群特性</p>
        </div>
      </show-search-grid>
      <!-- <div class="filter-portrait" v-if="filters.length > 0">
        <biz-filter v-if="filters.length > 0" :filters="filters" @filterDataChange="filterDataChange"></biz-filter>
      </div> -->
    </div>
    <div class="member-info">
      <div class="header1">
        <span>{{userPortrait.name || userPortrait.title }}</span>
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
          <div class="base-info">活动类型/资讯类别： <span v-if="dialogFilters[0].value==='product'">{{userPortrait.categoryName}}</span>
          <span
            v-if="dialogFilters[0].value==='promotion'||dialogFilters[0].value==='marketing'">{{getType(userPortrait)||'促销'}}</span></div>
          <div class="base-info">所属店铺：
          <span v-if="dialogFilters[0].value==='product'||dialogFilters[0].value==='shopPublicity'">{{userPortrait.shop?userPortrait.shop.name:''}}</span>
          <span v-if="dialogFilters[0].value==='promotion'">{{userPortrait.shopData?userPortrait.shopData.name:''}}</span>
          <span v-if="dialogFilters[0].value==='marketing'">{{userPortrait.shopname}}</span>
          <span v-if="dialogFilters[0].value==='article'">{{userPortrait.author}}</span></div>
          <div class="base-info">发布时间：{{userPortrait.publishDate}}</div>
          <div class="base-info">活动开始时间：{{userPortrait.beginDate}}</div>
          <div class="base-info">活动结束时间：{{userPortrait.endDate}}</div>
        </div>
      </div>
    </div>
    <div class="chart-area" v-if="dialogFilters[0].value === 'article'">
      <div class="graph" style="width:100%">
        <div class="header">
          <span>效果分析</span>
          <span class="font">阅读量</span>
          <i class="iconfont biz-icon-i-web-fd" @click="viewNumAnalysis"></i>
        </div>
        <biz-chart :chartData="viewNumGraphData" :loading="loading" :showSearch="false"></biz-chart>
      </div>
    </div>
    <div class="chart-area">
      <div class="graph">
        <div class="header">
          <span>转化分析</span>
          <i class="iconfont biz-icon-i-web-fd" @click="marketingGeneralViewAnalysis"></i>
        </div>
        <biz-chart :chartData="storeGraphData" :loading="loading" :showSearch="false"></biz-chart>
      </div>
      <div class="graph">
        <div class="header">
          <span>人群分析</span>
          <span class="font">性别</span>
          <i class="iconfont biz-icon-i-web-fd" @click="flowAnalysis"></i>
        </div>
        <biz-chart :chartData="fansGraphData" chartHeight="calc(32vw - 40px)" :loading="loading" :showSearch="false"></biz-chart>
      </div>
    </div>
    <el-dialog :visible.sync="dialogVisible" :title="title" width="1200px" append-to-body>
      <MarketingGeneralViewAnalysis ref="marketingGeneralViewAnalysis" v-if="showGeneralView" :params="params">
      </MarketingGeneralViewAnalysis>
      <ActivityEffectAnalysis ref="viewNumAnalysis" v-if="showActivity" :params="params"></ActivityEffectAnalysis>
      <FlowAnalysis ref="flowAnalysis" v-if="showFlow" :params="params"></FlowAnalysis>
    </el-dialog>
    <biz-dialog-selector title="选择" :visibility.sync="showDialog" :appendToBody="true" :selectionMode="'single'"
      :isClear="false" :loading="dialogLoading" :tableData="dialogTableData" :pagination="dialogPagination"
      :filters="dialogFilters" @confirmed="handleConfirmed" @filterDataChange="dialogFilterDataChange"
      class="notice-dialog-selector" @pageSizeChange="dialogPageSizeChange" @currentPageChange="dialogCurrentPageChange">
     <el-table-column label="名称" prop="">
        <div slot-scope="scope">
          <span v-if="dialogFilters[0].value==='product'">{{scope.row.name}}</span>
          <span v-if="dialogFilters[0].value!=='product'">{{scope.row.title}}</span>
        </div>
      </el-table-column>
      <el-table-column label="类型" prop=""
        v-if="dialogFilters[0].value==='product'||dialogFilters[0].value==='marketing'">
        <div slot-scope="scope">
          <span v-if="dialogFilters[0].value==='product'">{{scope.row.categoryName}}</span>
          <span
            v-if="dialogFilters[0].value==='marketing'">{{getType(scope.row)}}</span>
        </div>
      </el-table-column>
      <el-table-column label="店铺" prop="">
        <div slot-scope="scope">
          <span v-if="dialogFilters[0].value==='shopPublicity'">{{scope.row.author}}</span>
          <span v-if="dialogFilters[0].value==='product'">{{scope.row.shop.name}}</span>
          <span v-if="dialogFilters[0].value==='promotion'">{{scope.row.shopData.name}}</span>
          <span v-if="dialogFilters[0].value==='marketing'">{{scope.row.shopname}}</span>
          <span v-if="dialogFilters[0].value==='article'">{{scope.row.author}}</span>
        </div>
      </el-table-column>
      <el-table-column label="状态"
        :formatter="dialogFilters[0].value==='marketing'||dialogFilters[0].value==='promotion'?getStateStr:getState"
        :prop="dialogFilters[0].value==='marketing'||dialogFilters[0].value==='promotion'?'stateStr':'state'">
      </el-table-column>
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
import BizDialogSelector from '@/components/BizDialogSelector';
import MarketingGeneralViewAnalysis from './MarketingGeneralViewAnalysis';
import ActivityEffectAnalysis from './ActivityEffectAnalysis';
import FlowAnalysis from './FlowAnalysis';
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
      showGeneralView: false,
      showActivity: false,
      showFlow: false,
      viewNumGraphData: {},
      fansGraphData: {},
      storeGraphData: {},
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
          type: 'radio',
          label: '链接内容',
          name: 'type',
          value: 'product',
          options: [
            {
              label: '商品',
              value: 'product'
            },
            {
              label: '促销活动',
              value: 'promotion'
            },
            {
              label: '营销活动',
              value: 'marketing'
            },
            {
              label: '软文宣传',
              value: 'article'
            },
            {
              label: '商品推广',
              value: 'shopPublicity'
            }
          ]
        },
        {
          type: 'input',
          label: '商品',
          placeholder: '请输入商品名称',
          select: [],
          name: 'searchValue',
          value: '',
          class: 'show'
        }
      ],
      memberMobileData: [],
      beginDate: dateTime.getPreThreeMonthDay(),
      endDate: dateTime.today(),
      viewType: 'month',
      dateType: 'month',
      itemId: '',
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
    // showDialog(showDialog) {
    //   if (!showDialog) {
    //     this.dialogFilters[0].value = '';
    //   }
    // }
  },
  components: {
    // BizFilter,
    BizDialogSelector,
    BizChart,
    MarketingGeneralViewAnalysis,
    ActivityEffectAnalysis,
    FlowAnalysis,
    ShowSearchGrid
  },
  computed: {},
  methods: {
    ...mapGetters(['getUser']),
    getType(row) {
      if (this.dialogFilters[0].value === 'promotion') {
        switch (row.typeStr) {
          case '0':
            return '包邮';
          case '1':
            return '优惠券';
          case '2':
            return '促销';
          case '3':
            return '满减';
          case '4':
            return '折扣';
          case '5':
            return '满送';
          case '6':
            return '套餐';
          case '7':
            return '会员价';
          default:
            return '';
        }
      } else if (this.dialogFilters[0].value === 'marketing') {
        switch (row.typeStr) {
          case '0':
            return '抢红包';
          case '1':
            return '摇一摇';
          case '2':
            return '抽奖';
          case '3':
            return '拼团购';
          case '4':
            return 'N元抢购';
          case '5':
            return '限时秒杀';
          case '6':
            return '帮砍价';
          case '7':
            return '推荐有礼';
          case '8':
            return '分享有礼';
          case '9':
            return '活动招募';
          default:
            break;
        }
      }
    },
    getState(row) {
      if (this.dialogFilters[0].value === 'product') {
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
      } else if (this.dialogFilters[0].value === 'shopPublicity') {
        switch (row.state) {
          case '0':
            return '审核中';
          case '1':
            return '审核不通过';
          case '2':
            return '审核通过';
          case '3':
            return '已投放';
        }
      } else {
        switch (row.state) {
          case '0':
            return '已创建';
          case '1':
            return '已发布';
          // case '2':
          //   return '自动审核';
          case '3':
            return '审核通过';
          case '4':
            return '未审核';
        }
      }
    },
    getStateStr(row) {
      if (this.dialogFilters[0].value === 'marketing') {
        switch (row.stateStr) {
          case '0':
            return '未开始';
          case '1':
            if (row.typeStr === '9' && row.attendCount < row.maxPersonCount) {
              return '进行中';
            } else if (row.typeStr === '9' && row.attendCount === row.maxPersonCount) {
              return '已结束';
            } else {
              return '进行中';
            }
          case '2':
            return '已结束';
          case '3':
            return '已创建';
          case '4':
            return '已提交';
          case '5':
            return '已取消';
          default:
            return '';
        }
      } else {
        switch (row.stateStr) {
          case '0':
            return '未开始';
          case '1':
            return '进行中';
          case '2':
            return '已结束';
          case '3':
            return '已创建';
          case '4':
            return '已提交';
          case '5':
            return '已取消';
          default:
            return '';
        }
      }
    },
    refresh(id) {
      this.itemId = id;
      // this.getProductInfo(id);
      this.getStoreGraphData(id);
      if (this.dialogFilters[0].value === 'article') {
        this.getViewNumGraphData(id);
      } else {
        this.viewNumGraphData = {};
      }
      this.getFansGraphData(id);
      this.params = {
        viewType: this.viewType,
        beginDate: this.beginDate,
        endDate: this.endDate,
        dateType: 'month',
        itemId: this.itemId
      };
    },
    refreshHandle(val) {
      this.viewType = val.viewType;
      this.beginDate = val.date[0];
      this.endDate = val.date[1];
      this.dateType = val.dateType;
      this.params = {
        viewType: this.viewType,
        beginDate: this.beginDate,
        endDate: this.endDate,
        dateType: 'month',
        itemId: this.itemId
      };
      this.refresh(this.itemId);
    },
    marketingGeneralViewAnalysis() {
      this.title = '转化分析';
      this.showGeneralView = true;
      this.showActivity = false;
      this.showFlow = false;
      this.showHeatRanking = false;
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs.marketingGeneralViewAnalysis.load();
      });
    },
    viewNumAnalysis() {
      this.title = '效果分析';
      this.showGeneralView = false;
      this.showActivity = true;
      this.showFlow = false;
      this.showHeatRanking = false;
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs.viewNumAnalysis.load();
      });
    },
    flowAnalysis() {
      this.title = '人群分析';
      this.showGeneralView = false;
      this.showActivity = false;
      this.showFlow = true;
      this.showHeatRanking = false;
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs.flowAnalysis.load();
      });
    },
    queryProducts() {
      let params = {
        searchValue: this.dialogFilters[1].value,
        shopId: window.top.SHOP_ID || '',
        pageNumber: this.dialogPagination.currentPage,
        pageSize: this.dialogPagination.pageSize
      };
      this.dialogLoading = true;
      let url = '/admin/product/union/list.jhtml';
      if (this.dialogFilters[0].value === 'product') {
        this.dialogFilters[1].placeholder = '请输入商品名称';
        url = '/admin/product/union/list.jhtml';
      } else if (this.dialogFilters[0].value === 'promotion') {
        this.dialogFilters[1].placeholder = '请输入活动名称';
        url = '/admin/promotion/union/listPromotion.jhtml';
      } else if (this.dialogFilters[0].value === 'marketing') {
        this.dialogFilters[1].placeholder = '请输入活动名称';
        url = '/admin/marketing/union/listActivity.jhtml';
      } else if (this.dialogFilters[0].value === 'article') {
        this.dialogFilters[1].placeholder = '请输入文章名称';
        url = '/admin/article/articles.jhtml';
        this.$set(params, 'articleType', '0');
      } else if (this.dialogFilters[0].value === 'shopPublicity') {
        this.dialogFilters[1].placeholder = '请输入标题';
        url = 'admin/article/articles.jhtml';
        // this.$set(params, 'position', '0');
        this.$set(params, 'articleType', '1');
      }
      http
        .get(url, params)
        .then(data => {
          this.dialogLoading = false;
          if (this.dialogFilters[0].value === 'shopPublicity') {
            this.dialogTableData = data.content;
          } else {
            this.dialogTableData = data.content;
          }
          this.dialogPagination.total = Number(data.total);
        })
        .catch(ErrorData => {
          this.dialogLoading = false;
          this.$message.warning(ErrorData.errorMessage || '操作错误');
        });
    },
    init(id) {
      this.loading = true;
      let params = {
        indicators: ['purchaseProductNum', 'salesProductNum', 'depotProductNum'],
        beginDate: this.beginDate,
        endDate: this.endDate,
        viewType: this.viewType,
        itemId: this.itemId || id || ''
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
    getViewNumGraphData(id) {
      this.readTotalCount = 0;
      let param = {
        marketingCateGory: 'article',
        shopId: window.top.SHOP_ID || '',
        viewType: this.viewType,
        id: id || '',
        indicators: ['marketingViewNum'],
        beginDate: this.beginDate,
        endDate: this.endDate
      };
      http
        .post('/admin/ecommerce/kpi/marketing/graph/marketing.jhtml', param)
        .then(data => {
          this.viewNumGraphData = this.dataFormat(data);
        })
        .catch(error => {
          if (error.errorMessage) {
            this.$message.warning(error.errorMessage);
          }
        });
    },
    getFansGraphData(id) {
      this.readTotalCount = 0;
      let param = {
        shopId: window.top.SHOP_ID || '',
        viewType: this.viewType,
        itemId: id || '',
        agentIds: this.agentIds,
        indicators: ['fansGender'],
        beginDate: this.beginDate,
        endDate: this.endDate
      };
      http
        .post('/admin/ecommerce/kpi/marketing/graph/marketing.jhtml', param)
        .then(data => {
          this.fansGraphData = this.dataFormatWork(data);
        })
        .catch(error => {
          if (error.errorMessage) {
            this.$message.warning(error.errorMessage);
          }
        });
    },
    getStoreGraphData(id) {
      this.loading = true;
      let params = {
        shopIds: this.checkAllShop,
        beginDate: this.beginDate,
        endDate: this.endDate,
        indicatorReqs: [
          {
            tables: ['esmarketing'],
            calcs: ['count(1)'],
            name: 'marketingVisitNum'
          },
          {
            tables: ['esmarketingattend'],
            calcs: ['count(1)'],
            name: 'marketingAttend'
          }
        ],
        viewType: this.viewType,
        id: this.id
      };
      http
        .post('/admin/statistics/common/summary.jhtml', params)
        .then(data => {
          this.storeGraphData = this.dataFormatStore(data);
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
          // radius: [60, 150],
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
      let tmpData = [
        {
          状态: '访问人数',
          数值: data.indicators.marketingVisitNum.increase
        },
        { 状态: '参与人数', 数值: data.indicators.marketingAttend.increase }
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
    memberSelected() {
      this.showDialog = true;
      this.curTagName = '';
      this.queryProducts();
    },
    filterDataChange(val) {
      this.filters = val;
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
  created() {},
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
