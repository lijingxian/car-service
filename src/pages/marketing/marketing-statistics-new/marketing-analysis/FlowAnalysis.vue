<template>
  <div class="flow-analysis">
    <div slot="top">
      <show-search-grid @refreshHandle="refreshHandle" :showIntroduce="false" ref="search"></show-search-grid>
    </div>
    <div class="indicators-search">
      <div class="title">店铺</div>
      <div class="hardShopGroup1" :class="{'showHideShop1' : showHideShop1}" ref="shopGroup">
        <el-checkbox-button v-model="checkAllShop" @change="handleCheckAllShop" :indeterminate="isIndeterminateShop">全部</el-checkbox-button>
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
    <div class="indicators-search">
      <div class="title">类别</div>
      <el-radio-group v-model="checkedCategory" @change="categoryChange" size="mini">
        <el-radio-button v-for="(condition,index) in categoryList" :label="condition.id" :key="index" size="mini">
          {{condition.name}}</el-radio-button>
      </el-radio-group>
    </div>
    <!-- <div class="indicators-search">
      <div class="title">活动类型</div>
      <el-checkbox-button v-model="checkAllType" @change="handleCheckAllType" :indeterminate="isIndeterminateType">全部</el-checkbox-button>
      <el-checkbox-group v-model="checkedType" @change="typeChange">
        <el-checkbox-button v-for="(condition,index) in typeList" :label="condition.id" :key="index" size="mini">{{condition.name}}</el-checkbox-button>
      </el-checkbox-group>
    </div> -->
    <div class="chart-area" v-loading="loading">
      <div class="graph">
        <div class="filterSeach">
          <div class="filter-area">
            <el-radio-group @change="indicatorChanged" v-model="indicatorValue" size="mini">
              <el-radio-button label="marketingViewNum">访问量</el-radio-button>
              <el-radio-button label="activityIncome" v-if="checkedCategory !== 'ADVERTISE' && checkedCategory !== 'PROMOTION'">活动收益</el-radio-button>
              <el-radio-button label="activityCrowNum" v-if="checkedCategory !== 'ADVERTISE' && checkedCategory !== 'PROMOTION'">参与人数</el-radio-button>
              <!-- <el-radio-button label="2">转发量</el-radio-button> -->
            </el-radio-group>
          </div>
          <div class="type-range">
            <el-radio-group v-model="radioValue" size="mini">
              <el-radio-button label="0">视图</el-radio-button>
              <el-radio-button label="1">列表</el-radio-button>
            </el-radio-group>
          </div>
        </div>
        <biz-chart :chartData="chartData" :loading="loading" :showSearch="false" v-if="radioValue==='0'"></biz-chart>
      <biz-list ref="list" :height="height" :tableData="tableData" style="width: 100%;height:100%" v-show="radioValue==='1'">
          <el-table-column prop="marketingTitle" label="营销内容"></el-table-column>
          <el-table-column prop="marketingCateGoryName" label="类别"></el-table-column>
          <el-table-column prop="marketingType" label="活动类型"></el-table-column>
          <el-table-column prop="shopName" label="店铺"></el-table-column>
          <el-table-column prop="length" label="展示量" v-if="this.indicatorValue==='marketingViewNum'"></el-table-column>
          <el-table-column prop="viewNum" label="阅读量" v-if="this.indicatorValue==='marketingViewNum'"></el-table-column>
          <el-table-column prop="viewNum" label="转发量" v-if="this.indicatorValue==='marketingViewNum'"></el-table-column>
          <el-table-column prop="viewNum" label="点赞量" v-if="this.indicatorValue==='marketingViewNum'"></el-table-column>
          <el-table-column prop="viewNum" label="评论量" v-if="this.indicatorValue==='marketingViewNum'"></el-table-column>
          <el-table-column prop="length" label="收益" v-if="this.indicatorValue!=='marketingViewNum'"></el-table-column>
          <el-table-column prop="length" label="参与人数" v-if="this.indicatorValue!=='marketingViewNum'"></el-table-column>
          <el-table-column prop="length" label="拉新人数" v-if="this.indicatorValue!=='marketingViewNum'"></el-table-column>
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
  name: 'FlowAnalysis',
  data() {
    return {
      loading: false,
      height: '500',
      beginDate: dateTime.getPreThreeMonthDay(),
      endDate: dateTime.today(),
      viewType: 'month',
      showHideShop1: false,
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
      chartData: {},
      isShow: 'false',
      checkedShop: [],
      shopList: [],
      checkAllShop: true,
      isIndeterminateShop: true,
      checkedCategory: 'marketing',
      categoryList: [
        { name: '营销活动', id: 'marketing' },
        { name: '促销活动', id: 'promotion' },
        { name: '线下活动', id: 'localMarketing' },
        { name: '软文宣传', id: 'ADVERTISE' },
        { name: '商品推广', id: 'PROMOTION' }
      ],
      checkAllCategory: true,
      isIndeterminateCategory: true,
      checkedType: [],
      typeList: [],
      checkAllType: true,
      isIndeterminateType: true,
      kpiName: ['本期', '同比', '环比'],
      radioValue: '0',
      indicatorValue: 'marketingViewNum'
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
          this.query();
        })
        .catch(errData => {
          if (errData.errorMessage) {
            this.$message.warning(errData.errorMessage);
          }
        });
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
        marketingCateGory: (this.checkedCategory !== 'ADVERTISE' && this.checkedCategory !== 'PROMOTION') ? this.checkedCategory : '',
        articleType: (this.checkedCategory === 'ADVERTISE' || this.checkedCategory === 'PROMOTION') ? this.checkedCategory : '',
        indicators: [this.indicatorValue],
        viewType: this.viewType,
        shopIds: this.checkedShop,
        beginDate: this.beginDate,
        endDate: this.endDate
      };
      http
        .post('/admin/ecommerce/kpi/marketing/graph/marketing.jhtml', params)
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
    dataFormat(data) {
      let tmpData = [];
      // let rotate = '';
      for (let i = 0; i < data.indicators.length; i++) {
        tmpData.push({
          日期: data.indicators[i].xValue,
          本期: data.indicators[i].yValue,
          同比: data.indicators[i].yYearOnYear,
          环比: data.indicators[i].yMonthOnMonth
        });
      }
      // if (data.indicators.length >= 8) {
      //   rotate = '45';
      // } else {
      //   rotate = '';
      // }
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
          // rotate: rotate
        }
      };
      return chartData;
    },
    getTable() {
      let params = {
        marketingCateGory: (this.checkedCategory !== 'ADVERTISE' && this.checkedCategory !== 'PROMOTION') ? this.checkedCategory : '',
        articleType: (this.checkedCategory === 'ADVERTISE' || this.checkedCategory === 'PROMOTION') ? this.checkedCategory : '',
        indicators: [this.indicatorValue],
        viewType: this.viewType,
        beginDate: this.beginDate,
        endDate: this.endDate,
        shopIds: this.checkedShop,
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
    exportStart() {
      let params = {
        marketingCateGory: (this.checkedCategory !== 'ADVERTISE' && this.checkedCategory !== 'PROMOTION') ? this.checkedCategory : '',
        articleType: (this.checkedCategory === 'ADVERTISE' || this.checkedCategory === 'PROMOTION') ? this.checkedCategory : '',
        indicators: [this.indicatorValue],
        viewType: this.viewType,
        beginDate: this.beginDate,
        endDate: this.endDate,
        shopIds: this.checkedShop,
        pageSize: this.pagination.pageSize,
        pageNumber: this.pagination.currentPage
      };
      http
        .post('/admin/ecommerce/kpi/marketing/export/marketing/exportStart.jhtml', params)
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
        let response = await axios.get('/admin/ecommerce/kpi/marketing/export/marketing/exportResult.jhtml?taskId=' + this.taskId, { responseType: 'blob' });
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
    }
  },
  computed: {},
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
.flow-analysis {
  height: 100%;
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
  .showHideShop1 {
    height: 55px;
    overflow-y: hidden;
  }
  .hardShopGroup1 {
    display: flex;
    width: calc(100% - 90px);
    flex-flow: wrap;
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
