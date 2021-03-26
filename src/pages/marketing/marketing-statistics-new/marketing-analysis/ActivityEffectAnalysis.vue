<template>
  <div class="activity-effect-analysis">
    <div slot="top">
      <show-search-grid @refreshHandle="refreshHandle" :showIntroduce="false" ref="search"></show-search-grid>
    </div>
    <div class="indicators-search">
      <div class="title">店铺</div>
      <div class="hardShopGroup1" :class="{'showHideShop1' : showHideShop1}" ref="shopGroup">
        <el-checkbox-button v-model="checkAllShop" @change="handleCheckAllShop" :indeterminate="isIndeterminateShop">全部
        </el-checkbox-button>
        <el-tooltip placement="bottom" v-for="(item, index) in shopList" :key="index" :disabled="item.name.length<=10">
          <el-checkbox-group v-model="checkedShop" @change="shopChange">
            <el-checkbox-button :label="item.id" size="mini">
              {{item.name.length>10?item.name.substr(0, 10)+'...':item.name}}
            </el-checkbox-button>
          </el-checkbox-group>
          <div slot="content">{{ item.name }}</div>
        </el-tooltip>
      </div>
    </div>
    <!-- <div class="indicators-search">
      <div class="title">类别</div>
      <el-radio-group v-model="checkedCategory" @change="categoryChange" size="mini">
        <el-radio-button v-for="(condition,index) in categoryList" :label="condition.id" :key="index" size="mini">
          {{condition.name}}</el-radio-button>
      </el-radio-group>
    </div> -->
    <!-- <div class="indicators-search">
      <div class="title">活动类型</div>
      <el-checkbox-button v-model="checkAllType" @change="handleCheckAllType" :indeterminate="isIndeterminateType">全部
      </el-checkbox-button>
      <el-checkbox-group v-model="checkedType" @change="typeChange">
        <el-checkbox-button v-for="(condition,index) in typeList" :label="condition.id" :key="index" size="mini">
          {{condition.name}}</el-checkbox-button>
      </el-checkbox-group>
    </div> -->
    <div class="chart-area" v-loading="loading">
      <div class="graph">
        <div class="filterSeach">
          <div class="filter-area">
            <el-radio-group @change="indicatorChanged" v-model="indicatorValue" size="mini">
              <el-radio-button label="activity">营销转化</el-radio-button>
              <el-radio-button label="promotion">促销转化</el-radio-button>
              <el-radio-button label="article">软文转化</el-radio-button>
              <el-radio-button label="product">商品推广转化</el-radio-button>
            </el-radio-group>
          </div>
          <!-- <div class="type-range">
            <el-radio-group v-model="radioValue" size="mini">
              <el-radio-button label="0">视图</el-radio-button>
              <el-radio-button label="1">列表</el-radio-button>
            </el-radio-group>
          </div> -->
        </div>
        <biz-chart :chartData="chartData" :loading="loading" :showSearch="false" v-show="radioValue==='0'&&!showDefault"></biz-chart>
        <img :src="yx" v-show="radioValue==='0'&&indicatorValue==='activity'&&showDefault">
        <img :src="cx" v-show="radioValue==='0'&&indicatorValue==='promotion'&&showDefault">
      <biz-list ref="list" :height="height" :tableData="tableData" style="width: 100%;height:100%" v-show="radioValue==='1'">
          <el-table-column prop="marketingTitle" label="营销内容"></el-table-column>
          <el-table-column prop="marketingCateGoryName" label="类别"></el-table-column>
          <el-table-column prop="marketingType" label="类型"></el-table-column>
          <el-table-column prop="shopName" label="店铺"></el-table-column>
          <el-table-column prop="amount" label="收益"></el-table-column>
          <el-table-column prop="crowNum" label="参与人数"></el-table-column>
          <el-table-column prop="newSum" label="拉新人数"></el-table-column>
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
import yx from '@/assets/images/yx.png';
import cx from '@/assets/images/cx.png';
export default {
  name: 'ActivityEffectAnalysis',
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
      yx: yx,
      cx: cx,
      tableData: [],
      chartData: {},
      chartData1: {},
      chartData2: {},
      chartData3: {},
      isShow: 'false',
      checkedShop: [],
      shopList: [],
      showDefault: false,
      checkAllShop: true,
      isIndeterminateShop: true,
      showHideShop1: false,
      checkedCategory: 'marketing',
      categoryList: [
        { name: '营销', id: 'marketing' },
        { name: '促销', id: 'promotion' },
        { name: '线下活动', id: 'localMarketing' }
        // { name: '文章', id: 'article' }
      ],
      checkAllCategory: true,
      isIndeterminateCategory: true,
      checkedType: [],
      typeList: [],
      checkAllType: true,
      isIndeterminateType: true,
      kpiName: ['本期', '同比', '环比'],
      radioValue: '0',
      indicatorValue: 'activity'
    };
  },
  props: {
    params: {
      type: Object
    }
  },
  methods: {
    ...mapGetters(['getUser']),
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
      this.getShopList();
    },
    shopChange(val) {
      let checkedCount = val.length;
      this.checkAllShop = checkedCount === this.shopList.length;
      this.isIndeterminateShop = checkedCount > 0 && checkedCount < this.shopList.length;
      this.query();
    },
    handleCheckAllShop(val) {
      this.checkedShop = val
        ? this.shopList.map(item => {
          return item.id;
        })
        : [];
      this.query();
    },
    categoryChange(val) {
      let checkedCount = val.length;
      this.checkAllCategory = checkedCount === this.categoryList.length;
      this.isIndeterminateCategory = checkedCount > 0 && checkedCount < this.categoryList.length;
      this.query();
    },
    handleCheckAllCategory(val) {
      this.checkedCategory = val
        ? this.categoryList.map(item => {
          return item.id;
        })
        : [];
      this.getTypeList();
    },
    typeChange(val) {
      let checkedCount = val.length;
      this.checkAllType = checkedCount === this.typeList.length;
      this.isIndeterminateType = checkedCount > 0 && checkedCount < this.typeList.length;
      this.query();
    },
    handleCheckAllType(val) {
      this.checkedType = val
        ? this.typeList.map(item => {
          return item.id;
        })
        : [];
      this.query();
    },
    getShopList() {
      let param = {
        sourceType: '5'
      };
      http
        .get('/admin/member/json/findEShops.jhtml', param)
        .then(data => {
          this.shopList = data.shops;
          this.checkedShop = this.params.checkedShop || [];
          let checkedCount = this.checkedShop.length;
          this.checkAllShop = checkedCount === this.shopList.length;
          this.isIndeterminateShop = checkedCount > 0 && checkedCount < this.shopList.length;
          this.query();
        })
        .catch(error => {
          if (error.errorMessage) {
            this.$message.warning(error.errorMessage);
          }
        });
    },
    // 获取类别筛选项
    getCategoryList() {
      let params = {};
      http
        .get('', params)
        .then(data => {
          this.categoryList = data.dataList;
          this.getTypeList();
        })
        .catch(errData => {
          if (errData.errorMessage) {
            this.$message.warning(errData.errorMessage);
          }
        });
    },
    // 获取活动类型(与类别联动)
    getTypeList() {
      let params = {};
      http
        .get('', params)
        .then(data => {
          this.typeList = data.dataList;
        })
        .catch(errData => {
          if (errData.errorMessage) {
            this.$message.warning(errData.errorMessage);
          }
        });
    },
    query() {
      this.getGraphData();
      // this.getTable();
    },
    indicatorChanged() {
      this.getGraphData();
      // this.getTable();
    },
    getGraphData() {
      this.loading = true;
      let params = '';
      let params1 = '';
      let params2 = '';
      let params3 = '';
      // 訪問
      if (this.indicatorValue === 'activity') {
        params = {
          table: [
            'dw_operation_log'
          ],
          showColumn: [
            {
              formula: 'count(1)',
              as: 'num'
            }
          ],
          filter: {
            and: [
              {
                name: 'operate_date',
                value: this.beginDate,
                compare: '>='
              },
              {
                name: 'operate_date',
                value: this.endDate,
                compare: '<='
              },
              {
                name: 'operate_type',
                value: 'view',
                compare: '='
              },
              {
                name: 'shop_id',
                value: this.checkedShop,
                compare: 'in'
              },
              {
                or: [
                  {
                    name: 'biz_code',
                    value: 'marketing',
                    compare: '='
                  },
                  {
                    name: 'biz_code',
                    value: 'marketingfollow',
                    compare: '='
                  }
                ]
              }
            ]
          }
        };
        // 參與人數
        params1 = {
          table: [
            'dw_marketing_attend'
          ],
          showColumn: [
            {
              formula: 'count(1)',
              as: 'num'
            }
          ],
          filter: {
            and: [
              {
                name: 'attend_date',
                value: this.beginDate,
                compare: '>='
              },
              {
                name: 'attend_date',
                value: this.endDate,
                compare: '<='
              },
              {
                name: 'shop_id',
                value: this.checkedShop,
                compare: 'in'
              }
            ]
          }
        };
      };
      if (this.indicatorValue === 'promotion') {
        // 訪問人數
        params = {
          table: [
            'dw_operation_log'
          ],
          showColumn: [
            {
              formula: 'count(1)',
              as: 'num'
            }
          ],
          filter: {
            and: [
              {
                name: 'operate_date',
                value: this.beginDate,
                compare: '>='
              },
              {
                name: 'operate_date',
                value: this.endDate,
                compare: '<='
              },
              {
                name: 'operate_type',
                value: 'view',
                compare: '='
              },
              {
                name: 'shop_id',
                value: this.checkedShop,
                compare: 'in'
              },
              {
                name: 'biz_code',
                value: 'promotion',
                compare: '='
              }
            ]
          }
        };
        // 下單人數
        params1 = {
          table: [
            'dw_promotion_attend'
          ],
          showColumn: [
            {
              formula: 'count(1)',
              as: 'num'
            }
          ],
          filter: {
            and: [
              {
                name: 'attend_date',
                value: this.beginDate,
                compare: '>='
              },
              {
                name: 'attend_date',
                value: this.endDate,
                compare: '<='
              },
              {
                name: 'shop_id',
                value: this.checkedShop,
                compare: 'in'
              }
            ]
          }
        };
        // 付款人數
        params2 = {
          table: [
            'dw_promotion_attend'
          ],
          showColumn: [
            {
              formula: 'count(1)',
              as: 'num'
            }
          ],
          filter: {
            and: [
              {
                name: 'attend_date',
                value: this.beginDate,
                compare: '>='
              },
              {
                name: 'attend_date',
                value: this.endDate,
                compare: '<='
              },
              {
                name: 'shop_id',
                value: this.checkedShop,
                compare: 'in'
              },
              {
                name: 'payment_status',
                value: '2',
                compare: '='
              }
            ]
          }
        };
      }
      if (this.indicatorValue === 'article') {
        // 访问人数
        params = {
          table: [
            'dw_operation_log'
          ],
          showColumn: [
            {
              formula: 'count(1)',
              as: 'num'
            }
          ],
          filter: {
            and: [
              {
                name: 'operate_date',
                value: this.beginDate,
                compare: '>='
              },
              {
                name: 'operate_date',
                value: this.endDate,
                compare: '<='
              },
              {
                name: 'shop_id',
                value: this.checkedShop,
                compare: 'in'
              },
              {
                name: 'operate_type',
                value: 'view',
                compare: '='
              },
              {
                name: 'biz_type',
                value: 'ARTICLE',
                compare: '='
              }
            ]
          }
        };
        // 转发人数
        params1 = {
          table: [
            'dw_operation_log'
          ],
          showColumn: [
            {
              formula: 'count(1)',
              as: 'num'
            }
          ],
          filter: {
            and: [
              {
                name: 'operate_date',
                value: this.beginDate,
                compare: '>='
              },
              {
                name: 'operate_date',
                value: this.endDate,
                compare: '<='
              },
              {
                name: 'shop_id',
                value: this.checkedShop,
                compare: 'in'
              },
              {
                name: 'operate_type',
                value: 'share',
                compare: '='
              },
              {
                name: 'biz_type',
                value: 'ARTICLE',
                compare: '='
              }
            ]
          }
        };
      }
      if (this.indicatorValue === 'product') {
        // 访问人数
        params = {
          table: [
            'dw_operation_log'
          ],
          showColumn: [
            {
              formula: 'count(1)',
              as: 'num'
            }
          ],
          filter: {
            and: [
              {
                name: 'operate_date',
                value: this.beginDate,
                compare: '>='
              },
              {
                name: 'operate_date',
                value: this.endDate,
                compare: '<='
              },
              {
                name: 'shop_id',
                value: this.checkedShop,
                compare: 'in'
              },
              {
                name: 'operate_type',
                value: 'view',
                compare: '='
              },
              {
                name: 'biz_type',
                value: 'PRODUCTARTICLE',
                compare: '='
              }
            ]
          }
        };
        // 访问商品人数
        params1 = {
          table: [
            'dw_operation_log'
          ],
          showColumn: [
            {
              formula: 'count(1)',
              as: 'num'
            }
          ],
          filter: {
            and: [
              {
                name: 'operate_date',
                value: this.beginDate,
                compare: '>='
              },
              {
                name: 'operate_date',
                value: this.endDate,
                compare: '<='
              },
              {
                name: 'shop_id',
                value: this.checkedShop,
                compare: 'in'
              },
              {
                name: 'operate_type',
                value: 'view',
                compare: '='
              },
              {
                name: 'biz_code',
                value: 'product',
                compare: '='
              }
            ]
          }
        };
        // 下单人数
        params2 = {
          table: [
            'dw_order'
          ],
          showColumn: [
            {
              formula: 'count(1)',
              as: 'num'
            }
          ],
          filter: {
            and: [
              {
                name: 'complete_date',
                value: this.beginDate,
                compare: '>='
              },
              {
                name: 'complete_date',
                value: this.endDate,
                compare: '<='
              }
            ]
          }
        };
        // 付款人数
        params3 = {
          table: [
            'dw_order'
          ],
          showColumn: [
            {
              formula: 'count(1)',
              as: 'num'
            }
          ],
          filter: {
            and: [
              {
                name: 'complete_date',
                value: this.beginDate,
                compare: '>='
              },
              {
                name: 'complete_date',
                value: this.endDate,
                compare: '<='
              },
              {
                name: 'payment_status',
                value: '2',
                compare: '='
              }
            ]
          }
        };
      }
      http
        .post('admin/statistics/common/statisticsDatas.jhtml', params)
        .then(data => {
          this.chartData1 = data;
        })
        .catch(errData => {
          this.loading = false;
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
        });
      http
        .post('admin/statistics/common/statisticsDatas.jhtml', params1)
        .then(data => {
          this.chartData2 = data;
          if (!params2) {
            this.chartData = this.dataFormat(this.chartData1, this.chartData2);
          }
        })
        .catch(errData => {
          this.loading = false;
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
        });
      params2 && http
        .post('admin/statistics/common/statisticsDatas.jhtml', params2)
        .then(data => {
          this.chartData3 = data;
          if (!params3) {
            this.chartData = this.dataFormat(this.chartData1, this.chartData2, this.chartData3);
          }
        })
        .catch(errData => {
          this.loading = false;
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
        });
      params3 && http
        .post('admin/statistics/common/statisticsDatas.jhtml', params3)
        .then(data => {
          this.chartData = this.dataFormat(this.chartData1, this.chartData2, this.chartData3, data);
        })
        .catch(errData => {
          this.loading = false;
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    dataFormat(data, data1, data2, data3) {
      let tmpData = [];
      console.log(1111);
      this.showDefault = false;
      if (this.indicatorValue === 'promotion') {
        tmpData = [
          {
            状态: '访问人数',
            数值: data.indicators.statisticsRowDatas[0].statisticsColumnDatas[0].columnValue
          },
          { 状态: '下单人数', 数值: data1.indicators.statisticsRowDatas[0].statisticsColumnDatas[0].columnValue },
          { 状态: '付款人数', 数值: data2.indicators.statisticsRowDatas[0].statisticsColumnDatas[0].columnValue }
        ];
        if (data.indicators.statisticsRowDatas[0].statisticsColumnDatas[0].columnValue === '0' && data1.indicators.statisticsRowDatas[0].statisticsColumnDatas[0].columnValue === '0' && data2.indicators.statisticsRowDatas[0].statisticsColumnDatas[0].columnValue === '0') {
          this.showDefault = true;
        }
      } else if (this.indicatorValue === 'activity') {
        tmpData = [
          {
            状态: '访问人数',
            数值: data.indicators.statisticsRowDatas[0].statisticsColumnDatas[0].columnValue
          },
          { 状态: '参与人数', 数值: data1.indicators.statisticsRowDatas[0].statisticsColumnDatas[0].columnValue }
        ];
        if (data.indicators.statisticsRowDatas[0].statisticsColumnDatas[0].columnValue === '0' && data1.indicators.statisticsRowDatas[0].statisticsColumnDatas[0].columnValue === '0') {
          this.showDefault = true;
        }
      } else if (this.indicatorValue === 'article') {
        tmpData = [
          {
            状态: '访问人数',
            数值: data.indicators.statisticsRowDatas[0].statisticsColumnDatas[0].columnValue
          },
          { 状态: '转发人数', 数值: data1.indicators.statisticsRowDatas[0].statisticsColumnDatas[0].columnValue }
        ];
      } else if (this.indicatorValue === 'product') {
        tmpData = [
          {
            状态: '访问推广',
            数值: data.indicators.statisticsRowDatas[0].statisticsColumnDatas[0].columnValue
          },
          { 状态: '访问商品', 数值: data1.indicators.statisticsRowDatas[0].statisticsColumnDatas[0].columnValue },
          { 状态: '下单', 数值: data2.indicators.statisticsRowDatas[0].statisticsColumnDatas[0].columnValue },
          { 状态: '付款', 数值: data3.indicators.statisticsRowDatas[0].statisticsColumnDatas[0].columnValue }
        ];
      }
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
    getTable() {
      let params = {
        marketingCateGory: this.checkedCategory,
        indicators: [this.indicatorValue],
        viewType: this.viewType,
        shopIds: this.checkedShop,
        beginDate: this.beginDate,
        endDate: this.endDate,
        pageSize: this.pagination.pageSize,
        pageNumber: this.pagination.currentPage
      };
      http
        .post('/admin/ecommerce/kpi/marketing/table/marketing.jhtml', params)
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
        marketingCateGory: this.checkedCategory,
        indicators: [this.indicatorValue],
        shopIds: this.checkedShop,
        viewType: this.viewType,
        beginDate: this.beginDate,
        endDate: this.endDate,
        pageSize: this.pagination.pageSize,
        pageNumber: this.pagination.currentPage
      };
      try {
        let response = await axios.post('/admin/ecommerce/kpi/marketing/export/marketing.jhtml', params, {
          responseType: 'blob'
        });
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
      // this.getTable();
    },
    handleSizeChange(val) {
      this.pagination.pageSize = val;
      // this.getTable();
    },
    handleCurrentChange(val) {
      this.pagination.currentPage = val;
      // this.getTable();
    }
  },
  computed: {},
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
.activity-effect-analysis {
  height: 100%;
  align-content: space-between;
  margin: 20px 0px 20px 20px;
  padding-bottom: 20px;
  padding-right: 10px;
  .indicators-search {
    display: -webkit-box;
    .el-checkbox-button {
      padding: 15px;
    }
    .el-radio-button {
      padding: 15px 0px;
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
    .showHideShop1 {
      height: 55px;
      overflow-y: hidden;
    }
    .hardShopGroup1 {
      display: flex;
      width: calc(100% - 90px);
      flex-flow: wrap;
    }
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
        display: flex;
        justify-content: space-between;
        margin: 10px 0px;
      }
    }
  }
  .swich {
    text-align: center;
    font-size: 24px;
    cursor: pointer;
    margin-top: -10px;
  }
  .swichSeries {
    text-align: center;
    font-size: 24px;
    cursor: pointer;
    margin-top: -10px;
  }
  .showHide {
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
