<template>
  <div class="general-view-analysis">
    <div slot="top">
      <show-search-grid @refreshHandle="refreshHandle" :showViewType="false">
        <div slot="description" class="description-pover">
          <p>关注：统计关注人数变化情况</p>
          <p>注册：统计注册人数变化情况</p>
          <p>转化：统计转化人数变化情况</p>
          <p>使用：统计使用人数变化情况</p>
          <p>增值：统计增值服务分布情况</p>
        </div>
      </show-search-grid>
    </div>
    <div class="indicators-search" :class="{'showHide2' : showHideShop1}" v-if="conditionData.shopsList.length>1">
      <div class="title">店铺</div>
      <div class="hardShopGroup1" :class="{'showHideShop1' : showHideShop1}" ref="shopGroup">
        <el-checkbox-button v-model="checkAllShops" @change="handleCheckAllShops" :indeterminate="isIndeterminateShops">全部
        </el-checkbox-button>
        <el-checkbox-group :min="1" v-model="checkedShops" @change="shopsChange">
          <el-checkbox-button v-for="(item,index) in conditionData.shopsList" :label="item.id" :key="index" size="mini">
            {{item.name}}</el-checkbox-button>
        </el-checkbox-group>
      </div>
    </div>
    <div class="swichShop1" v-if="showShopSwich1&&conditionData.shopsList.length>1">
      <i :class="classNameShop1" @click="swichShop1"></i>
    </div>
    <div class="total">
      <div class="column1">
        <div class="table-cell">
          新增注册数
          <div class="color-primary"><span class="font">{{summary.a}}</span>人</div>
          <!-- <div class="color-primary">
            环比
            <span :style="summary.orderProductNumIncMon>0?'color:red':'color:green'"><i :class="summary.orderProductNumIncMon>0?'iconfont biz-icon-i-sh-man-pullup':'iconfont biz-icon-i-sh-man-pulldown'"></i>{{summary.orderProductNumIncMon}}%</span>
            同比
            <span :style="summary.orderProductNumIncYoy>0?'color:red':'color:green'"><i :class="summary.orderProductNumIncYoy>0?'iconfont biz-icon-i-sh-man-pullup':'iconfont biz-icon-i-sh-man-pulldown'"></i>{{summary.orderProductNumIncYoy}}%</span>
          </div> -->
        </div>
      </div>
      <div class="column2">
        <div class="table-cell">
          新增转化数
          <div class="color-primary"><span class="font">{{summary.b}}</span>人</div>
          <!-- <div class="color-primary">
            环比
            <span :style="summary.orderAmountPaidIncMon>0?'color:red':'color:green'"><i :class="summary.orderAmountPaidIncMon>0?'iconfont biz-icon-i-sh-man-pullup':'iconfont biz-icon-i-sh-man-pulldown'"></i>{{summary.orderAmountPaidIncMon}}%</span>
            同比
            <span :style="summary.orderAmountPaidIncYoy>0?'color:red':'color:green'"><i :class="summary.orderAmountPaidIncYoy>0?'iconfont biz-icon-i-sh-man-pullup':'iconfont biz-icon-i-sh-man-pulldown'"></i>{{summary.orderAmountPaidIncYoy}}%</span>
          </div> -->
        </div>
      </div>
      <div class="column3">
        <div class="table-cell">
          日活
          <div class="color-primary"><span class="font">{{summary.c}}</span>人</div>
          <!-- <div class="color-primary">
            环比
            <span :style="summary.orderAmountPaidIncMon>0?'color:red':'color:green'"><i :class="summary.orderAmountPaidIncMon>0?'iconfont biz-icon-i-sh-man-pullup':'iconfont biz-icon-i-sh-man-pulldown'"></i>{{summary.orderAmountPaidIncMon}}%</span>
            同比
            <span :style="summary.orderAmountPaidIncYoy>0?'color:red':'color:green'"><i :class="summary.orderAmountPaidIncYoy>0?'iconfont biz-icon-i-sh-man-pullup':'iconfont biz-icon-i-sh-man-pulldown'"></i>{{summary.orderAmountPaidIncYoy}}%</span>
          </div> -->
        </div>
      </div>
    </div>
    <div class="chart-area">
      <div class="graph">
        <div class="header">
          <span>关注</span>
          <span class="font">浏览人数</span>
          <i class="iconfont biz-icon-i-web-fd" @click="genralAnalysis"></i>
        </div>
        <biz-chart :chartData="chartData" :loading="loading" :showSearch="false"></biz-chart>
      </div>
      <div class="graph">
        <div class="header">
          <span>注册</span>
          <span class="font">地域分布</span>
          <i class="iconfont biz-icon-i-web-fd" @click="inComeAnalysis"></i>
        </div>
        <biz-chart :chartData="chartDataOfInCome" :loading="loading" :showSearch="false"></biz-chart>
      </div>
      <div class="graph">
        <div class="header">
          <span>转化</span>
          <span class="font">服务介绍</span>
          <i class="iconfont biz-icon-i-web-fd" @click="appreciationAnalysis"></i>
        </div>
        <biz-chart :chartData="chartDataOfAppreciation" :loading="loading" :showSearch="false"></biz-chart>
      </div>
    </div>
    <div class="chart-area">
      <div class="graph">
        <div class="header">
          <span>使用</span>
          <span class="font">服务订购分布</span>
          <i class="iconfont biz-icon-i-web-fd" @click="carTypeAnalysis"></i>
        </div>
        <biz-chart :chartData="chartDataOfCarType" :loading="loading" :showSearch="false"></biz-chart>
      </div>
      <div class="graph">
        <div class="header">
          <span>增值</span>
          <span class="font">服务介绍</span>
          <i class="iconfont biz-icon-i-web-fd" @click="satisfactionAnalysis"></i>
        </div>
        <biz-chart :chartData="chartDataOfSatisfaction" :loading="loading" :showSearch="false"></biz-chart>
      </div>
    </div>
    <el-dialog :visible.sync="dialogVisible" :title="title" width="1200px" append-to-body>
      <GeneralViewAnalysisInfo ref="generalViewAnalysisInfo" v-if="showGenral" :params="params"></GeneralViewAnalysisInfo>
      <InComeAnalysis ref="inComeAnalysis" v-if="showInCome" :params="params"></InComeAnalysis>
      <AppreciationAnalysis ref="appreciationAnalysis" v-if="showAppreciation" :params="params"></AppreciationAnalysis>
      <CarTypeAnalysis ref="carTypeAnalysis" v-if="showCarType" :params="params"></CarTypeAnalysis>
      <SatisfactionAnalysis ref="satisfactionAnalysis" v-if="showSatisfaction" :params="params"></SatisfactionAnalysis>
    </el-dialog>
  </div>
</template>

<script>
import BizChart from '@/components/BizChart';
// import BizFilter from '@/components/BizTable/BizFilter';
import dateTime from '@/utils/dateTime';
import http from '@/common/http';
import GeneralViewAnalysisInfo from './GeneralViewAnalysisInfo';
import InComeAnalysis from './InComeAnalysis';
import AppreciationAnalysis from './AppreciationAnalysis';
import CarTypeAnalysis from './CarTypeAnalysis';
import SatisfactionAnalysis from './SatisfactionAnalysis';
import ShowSearchGrid from '../components/ShowSearchGrid';
import dateUtil from '@/utils/date';
import { mapGetters } from 'vuex';
export default {
  name: 'GeneralViewAnalysis',
  data() {
    return {
      params: {},
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
      tableData: [],
      hardGroupHeight: 0,
      isIndeterminateShops: true,
      checkAllShops: true,
      checkedShops: [],
      className: 'el-icon-caret-bottom',
      classNameShop1: 'el-icon-caret-bottom',
      showHideShop1: false,
      showShopSwich1: false,
      hardGroupShopHeight1: 0,
      showSwich: false,
      showHide: false,
      showRecommend: false,
      dialogVisible: false,
      showGenral: false,
      showInCome: false,
      showAppreciation: false,
      showCarType: false,
      showSatisfaction: false,
      showConsultant: false,
      title: '概览分析',
      summary: {
        a: '',
        b: '',
        c: ''
      },
      conditionData: {
        shopsList: []
      },
      filters: [
        {
          type: 'single',
          label: '',
          value: 'customerIns',
          options: [
            { value: 'customerIns', label: '新增潜客' },
            { value: 'customerCnt', label: '累计潜客' },
            { value: 'customerDriveIns', label: '新增试驾' },
            { value: 'customerDriveCnt', label: '累计试驾' },
            { value: 'customerVisitIns', label: '当期回访' },
            { value: 'customerVisitRate', label: '当期回访率' },
            { value: 'customerVisitCnt', label: '累计回访' }
          ]
        }
      ],
      kpiName: ['本期', '同比', '环比'],
      chartData: {},
      chartDataOfInCome: {},
      chartDataOfAppreciation: {},
      chartDataOfCarType: {},
      chartDataOfSatisfaction: {},
      chartDataOfConsultant: {},
      isShow: 'false'
    };
  },
  methods: {
    ...mapGetters(['getUser']),
    handleCheckAllShops(val) {
      this.checkedShops = val ? this.conditionData.shopsList.map(item => { return item.id; }) : [this.getUser().shop.id];
      this.query();
    },
    shopsChange(val) {
      let checkedCount = val.length;
      this.checkAllShops = checkedCount === this.conditionData.shopsList.length;
      this.isIndeterminateShops = checkedCount > 0 && checkedCount < this.conditionData.shopsList.length;
      this.params = { viewType: this.viewType, beginDate: this.beginDate, endDate: this.endDate, dateType: val.dateType, checkedShops: this.checkedShops };
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
          this.checkedShops = this.conditionData.shopsList.map(item => {
            return item.id;
          });
          this.$nextTick(() => {
            this.hardGroupShopHeight1 = document.getElementsByClassName('hardShopGroup1')[0].offsetHeight;
            console.log(this.hardGroupShopHeight1);
            if (this.hardGroupShopHeight1 > 55) {
              this.showShopSwich1 = true;
              this.showHideShop1 = true;
            } else {
              this.showShopSwich1 = false;
              this.showHideShop1 = false;
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
    genralAnalysis() {
      this.title = '关注';
      this.showInCome = false;
      this.showAppreciation = false;
      this.showCarType = false;
      this.showSatisfaction = false;
      this.showConsultant = false;
      this.showGenral = true;
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs.generalViewAnalysisInfo.load();
      });
    },
    inComeAnalysis() {
      this.title = '注册';
      this.showGenral = false;
      this.showAppreciation = false;
      this.showCarType = false;
      this.showSatisfaction = false;
      this.showConsultant = false;
      this.showInCome = true;
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs.inComeAnalysis.load();
      });
    },
    appreciationAnalysis() {
      this.title = '转化';
      this.showGenral = false;
      this.showInCome = false;
      this.showCarType = false;
      this.showSatisfaction = false;
      this.showConsultant = false;
      this.showAppreciation = true;
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs.appreciationAnalysis.load();
      });
    },
    carTypeAnalysis() {
      this.title = '使用';
      this.showGenral = false;
      this.showInCome = false;
      this.showAppreciation = false;
      this.showSatisfaction = false;
      this.showConsultant = false;
      this.showCarType = true;
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs.carTypeAnalysis.load();
      });
    },
    satisfactionAnalysis() {
      this.title = '增值';
      this.showGenral = false;
      this.showInCome = false;
      this.showAppreciation = false;
      this.showSatisfaction = true;
      this.showConsultant = false;
      this.showCarType = false;
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs.satisfactionAnalysis.load();
      });
    },
    init() {
      this.loading = true;
      this.getGraphAddRegiesiterData();
      this.getGraphAddZhData();
      this.getGraphAddRhData();
    },
    // 新增注册数
    getGraphAddRegiesiterData() {
      this.loading = true;
      let params = {
        table: ['dw_member_regist'],
        showColumn: [
          {
            formula: 'count(1)',
            as: 'memberRegistCount'
          }
        ],
        filter: {
          and: [
            {
              name: 'create_date',
              value: this.beginDate + ' ' + '00:00:00',
              compare: '>='
            },
            {
              name: 'create_date',
              value: this.endDate + ' ' + '23:59:59',
              compare: '<='
            },
            {
              name: 'shop_id',
              value: this.checkedShops,
              compare: 'in'
            }
          ]
        }
      };
      http
        .post('/admin/statistics/common/statisticsDatas.jhtml', params)
        .then(data => {
          this.summary.a = data.indicators.statisticsRowDatas[0].statisticsColumnDatas[0].columnValue;
        })
        .catch(errData => {
          this.loading = false;
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    // 新增转化数
    getGraphAddZhData() {
      this.loading = true;
      let params = {
        table: ['dw_business_subscribe'],
        showColumn: [
          {
            formula: 'count(DISTINCT shop_id)',
            as: 'num'
          }
        ],
        filter: {
          and: [
            {
              name: 'create_date',
              value: this.beginDate + ' ' + '00:00:00',
              compare: '>='
            },
            {
              name: 'create_date',
              value: this.endDate + ' ' + '23:59:59',
              compare: '<='
            },
            {
              name: 'shop_id',
              value: this.checkedShops,
              compare: 'in'
            }
          ]
        }
      };
      http
        .post('/admin/statistics/common/statisticsDatas.jhtml', params)
        .then(data => {
          console.log(data);
          this.summary.b = data.indicators.statisticsRowDatas[0].statisticsColumnDatas[0].columnValue;
        })
        .catch(errData => {
          this.loading = false;
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    // 新增日活数
    getGraphAddRhData() {
      this.loading = true;
      let params = {
        table: ['dw_operation_log'],
        showColumn: [
          {
            formula: 'count(DISTINCT shop_id)',
            as: 'num'
          }
        ],
        filter: {
          and: [
            {
              name: 'operate_date',
              value: this.beginDate + ' ' + '00:00:00',
              compare: '>='
            },
            {
              name: 'operate_date',
              value: this.endDate + ' ' + '23:59:59',
              compare: '<='
            },
            {
              name: 'shop_id',
              value: this.checkedShops,
              compare: 'in'
            }
          ]
        }
      };
      http
        .post('/admin/statistics/common/statisticsDatas.jhtml', params)
        .then(data => {
          this.summary.c = data.indicators.statisticsRowDatas[0].statisticsColumnDatas[0].columnValue;
        })
        .catch(errData => {
          this.loading = false;
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    // 增值
    getGraphSatisfactionData() {
      this.loading = true;
      let params = {
        group: ['target_name'],
        sort: ['target_name desc'],
        table: ['dw_operation_log'],
        page: {
          pageNum: '1',
          pageSize: '10'
        },
        showColumn: [
          {
            fieldName: 'target_name'
          },
          {
            formula: 'count(1)',
            as: 'num'
          }
        ],
        filter: {
          and: [
            {
              name: 'operate_date',
              value: this.beginDate + ' ' + '00:00:00',
              compare: '>='
            },
            {
              name: 'operate_date',
              value: this.endDate + ' ' + '23:59:59',
              compare: '<='
            },
            {
              name: 'operate_type',
              value: 'view',
              compare: '='
            },
            {
              name: 'biz_code',
              value: 'serviceincrement',
              compare: '='
            },
            {
              name: 'shop_id',
              value: this.checkedShops,
              compare: 'in'
            }
          ]
        }
      };
      http
        .post('/admin/statistics/common/statisticsDatas.jhtml', params)
        .then(data => {
          this.chartDataOfSatisfaction = this.dataSatisfactionFormat(data);
        })
        .catch(errData => {
          this.loading = false;
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    dataSatisfactionFormat(data) {
      let tmpData = [];
      for (let i = 0; i < data.indicators.statisticsRowDatas.length; i++) {
        tmpData.push({
          服务: data.indicators.statisticsRowDatas[i].statisticsColumnDatas[0].columnValue,
          次: data.indicators.statisticsRowDatas[i].statisticsColumnDatas[1].columnValue
        });
      }
      let chartData = {
        type: 'histogram',
        legendVisible: false,
        data: {
          columns: ['服务', '次'],
          rows: tmpData
        },
        settings: {}
      };
      return chartData;
    },
    // 使用
    getGraphCarTypeData() {
      this.loading = true;
      let params = {
        group: ['service_name'],
        sort: ['service_name desc'],
        table: ['dw_business_subscribe'],
        page: {
          pageNum: '1',
          pageSize: '10'
        },
        showColumn: [
          {
            fieldName: 'service_name'
          },
          {
            formula: 'count(1)',
            as: 'num'
          }
        ],
        filter: {
          and: [
            {
              name: 'create_date',
              value: this.beginDate + ' ' + '00:00:00',
              compare: '>='
            },
            {
              name: 'create_date',
              value: this.endDate + ' ' + '23:59:59',
              compare: '<='
            },
            {
              name: 'shop_id',
              value: this.checkedShops,
              compare: 'in'
            }
          ]
        }
      };
      http
        .post('/admin/statistics/common/statisticsDatas.jhtml', params)
        .then(data => {
          this.chartDataOfCarType = this.dataCarTypeFormat(data);
        })
        .catch(errData => {
          this.loading = false;
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    dataCarTypeFormat(data) {
      let tmpData = [];
      for (let i = 0; i < data.indicators.statisticsRowDatas.length; i++) {
        tmpData.push({
          服务: data.indicators.statisticsRowDatas[i].statisticsColumnDatas[0].columnValue,
          次: data.indicators.statisticsRowDatas[i].statisticsColumnDatas[1].columnValue
        });
      }
      let chartData = {
        legendVisible: false,
        type: 'pie',
        data: {
          columns: ['服务', '次'],
          rows: tmpData
        },
        settings: {
          radius: ['20%', '60%'],
          offsetY: '50%'
        }
      };
      return chartData;
    },
    // 注册
    getGraphPieData() {
      this.loading = true;
      let params = {
        group: ['province_name'],
        sort: ['province_name desc'],
        table: ['dw_member_regist'],
        page: {
          pageNum: '1',
          pageSize: '10'
        },
        showColumn: [
          {
            fieldName: 'province_name'
          },
          {
            formula: 'count(1)',
            as: 'num'
          }
        ],
        filter: {
          and: [
            {
              name: 'create_date',
              value: this.beginDate + ' ' + '00:00:00',
              compare: '>='
            },
            {
              name: 'create_date',
              value: this.endDate + ' ' + '23:59:59',
              compare: '<='
            },
            {
              name: 'shop_id',
              value: this.checkedShops,
              compare: 'in'
            }
          ]
        }
      };
      http
        .post('/admin/statistics/common/statisticsDatas.jhtml', params)
        .then(data => {
          this.chartDataOfInCome = this.dataInComeFormat(data);
        })
        .catch(errData => {
          this.loading = false;
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    dataInComeFormat(data) {
      let tmpData = [];
      for (let i = 0; i < data.indicators.statisticsRowDatas.length; i++) {
        tmpData.push({
          服务: data.indicators.statisticsRowDatas[i].statisticsColumnDatas[0].columnValue,
          次: data.indicators.statisticsRowDatas[i].statisticsColumnDatas[1].columnValue
        });
      }
      let chartData = {
        legendVisible: false,
        type: 'pie',
        data: {
          columns: ['服务', '次'],
          rows: tmpData
        },
        settings: {
          radius: ['20%', '60%'],
          offsetY: '50%'
        }
      };
      return chartData;
    },
    // 转化
    getGraphAppreciationData() {
      this.loading = true;
      let params = {
        group: ['target_name'],
        table: ['dw_operation_log'],
        page: {
          pageNum: '1',
          pageSize: '10'
        },
        showColumn: [
          {
            fieldName: 'target_name'
          },
          {
            formula: 'count(1)',
            as: 'num'
          }
        ],
        filter: {
          and: [
            {
              name: 'operate_date',
              value: this.beginDate + ' ' + '00:00:00',
              compare: '>='
            },
            {
              name: 'operate_date',
              value: this.endDate + ' ' + '23:59:59',
              compare: '<='
            },
            {
              name: 'operate_type',
              value: 'view',
              compare: '='
            },
            {
              name: 'biz_code',
              value: 'servicetransform',
              compare: '='
            },
            {
              name: 'shop_id',
              value: this.checkedShops,
              compare: 'in'
            }
          ]
        }
      };
      http
        .post('/admin/statistics/common/statisticsDatas.jhtml', params)
        .then(data => {
          this.chartDataOfAppreciation = this.dataAppreciationFormat(data);
        })
        .catch(errData => {
          this.loading = false;
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    dataAppreciationFormat(data) {
      let tmpData = [];
      for (let i = 0; i < data.indicators.statisticsRowDatas.length; i++) {
        tmpData.push({
          服务: data.indicators.statisticsRowDatas[i].statisticsColumnDatas[0].columnValue,
          次: data.indicators.statisticsRowDatas[i].statisticsColumnDatas[1].columnValue
        });
      }
      let chartData = {
        type: 'histogram',
        legendVisible: false,
        data: {
          columns: ['服务', '次'],
          rows: tmpData
        },
        settings: {}
      };
      return chartData;
    },
    // 关注
    getGraphData() {
      this.loading = true;
      let params = {
        group: ['year_month_name'],
        table: ['dw_operation_log'],
        page: {
          pageNum: '1',
          pageSize: '10'
        },
        showColumn: [
          {
            fieldName: 'year_month_name'
          },
          {
            formula: 'count(1)',
            as: 'num'
          }
        ],
        filter: {
          and: [
            {
              name: 'operate_date',
              value: this.beginDate + ' ' + '00:00:00',
              compare: '>='
            },
            {
              name: 'operate_date',
              value: this.endDate + ' ' + '23:59:59',
              compare: '<='
            },
            {
              name: 'operate_type',
              value: 'view',
              compare: '='
            },
            {
              name: 'biz_code',
              value: 'marketingfollow',
              compare: '='
            },
            {
              name: 'shop_id',
              value: this.checkedShops,
              compare: 'in'
            }
          ]
        }
      };
      http
        .post('/admin/statistics/common/statisticsDatas.jhtml', params)
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
    refreshHandle(val) {
      this.viewType = val.viewType;
      this.beginDate = val.date[0];
      this.endDate = val.date[1];
      this.params = { viewType: this.viewType, beginDate: this.beginDate, endDate: this.endDate, dateType: val.dateType, checkedShops: this.checkedShops };
      this.query();
    },
    filterDataChange(val) {
      this.filters = val;
      this.this.query();
    },
    handleSizeChange(val) {
      this.pagination.pageSize = val;
    },
    handleCurrentChange(val) {
      this.pagination.currentPage = val;
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
    query() {
      this.init();
      this.getGraphData();
      this.getGraphPieData();
      this.getGraphAppreciationData();
      this.getGraphCarTypeData();
      this.getGraphSatisfactionData();
      this.getGraphGeneralData();
      this.params = Object.assign(this.params, { checkedShops: this.checkedShops });
    },
    dataFormat(data) {
      let tmpData = [];
      for (let i = 0; i < data.indicators.statisticsRowDatas.length; i++) {
        tmpData.push({
          日期: data.indicators.statisticsRowDatas[i].statisticsColumnDatas[0].columnValue,
          本期: data.indicators.statisticsRowDatas[i].statisticsColumnDatas[1].columnValue
          // 同比: data.statisticsRowDatas[i].statisticsColumnDatas[0].yoyRate,
          // 环比: data.statisticsRowDatas[i].statisticsColumnDatas[0].momRate
        });
      }
      let chartData = {
        type: 'histogram',
        data: {
          columns: ['日期', this.kpiName[0]],
          rows: tmpData
        },
        settings: {
          // axisSite: { right: ['同比', '环比'] },
          // yAxisType: ['KMB', 'KMB'],
          // yAxisName: ['', '%'],
          // showLine: [this.kpiName[1], this.kpiName[2]]
        }
      };
      return chartData;
    },
    purposeConverter(row) {
      return `${row.purposeBrand} ${row.purposeSeries} ${row.purposeProduct}`;
    },
    createDateConverter(row) {
      if (!row.entryDate) return '';

      let date = new Date(row.entryDate);
      return dateUtil.dateConverter(date);
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
  created() {
    this.getShopList();
  },
  components: {
    BizChart,
    GeneralViewAnalysisInfo,
    InComeAnalysis,
    AppreciationAnalysis,
    CarTypeAnalysis,
    SatisfactionAnalysis,
    // ViewTypeSwich,
    ShowSearchGrid
  }
};
</script>

<style lang="scss">
.general-view-analysis {
  height: 100%;
  overflow: auto;
  margin: 20px 0px 20px 20px;
  padding-bottom: 20px;
  padding-right: 10px;
  min-width: 560px;
  .indicators-search {
    display: -webkit-box;
    height: auto;
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
  .showHideOperator1 {
    height: 55px;
    overflow-y: hidden;
  }
  .showHideShop1 {
    height: 55px;
    overflow-y: hidden;
  }
  .hardShopGroup1 {
    display: flex;
    width: calc(100% - 90px);
  }
  .showHide2 {
    height: 55px;
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
      margin: 0px 20px 0px 0px;
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
