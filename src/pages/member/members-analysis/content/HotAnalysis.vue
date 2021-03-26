<template>
  <div class="hot-analysis">
    <div slot="top">
      <show-search-grid @refreshHandle="refreshHandle" :showIntroduce="false" ref="search">
        <div slot="description" class="description-pover">
          <p>标签不控制饼状图，其余突变受控制</p>
        </div>
      </show-search-grid>
    </div>
    <div class="indicators-search" :class="{'showHideFleet' : showHideFleet}">
      <div class="title">车友会</div>
      <div class="hardGroupFleet" :class="{'showHideFleet' : showHideFleet}" ref="fleetGroup">
        <el-checkbox-button v-model="checkAllFleet" @change="handleCheckAllFleet" :indeterminate="isIndeterminateFleet">全部
        </el-checkbox-button>
        <el-tooltip placement="bottom" v-for="(condition,index)  in fleetList" :key="index" :disabled="condition.name.length<=10">
          <el-checkbox-group v-model="checkedFleet" @change="fleetChange">
            <el-checkbox-button :label="condition.id" size="mini">
              {{condition.name.length>10?condition.name.substr(0, 10)+'...':condition.name}}</el-checkbox-button>
          </el-checkbox-group>
          <div slot="content">{{ condition.name }}</div>
        </el-tooltip>
      </div>
    </div>
    <div class="swich" v-if="showSwichFleet">
      <i :class="className" @click="swichFleet"></i>
    </div>
    <div class="indicators-search">
      <div class="title">类型</div>
      <el-radio-group v-model="checkedBrand" @change="brandChange" size="mini">
        <el-radio-button v-for="(condition,index)  in brandList" :label="condition.id" :key="index" size="mini">{{condition.name}}</el-radio-button>
      </el-radio-group>
    </div>
    <div class="chart-area" v-loading="loading">
      <div class="graph">
        <div class="filterSeach">
          <div class="filter-area">
            <el-radio-group @change="indicatorChanged" v-model="indicatorValue" size="mini">
              <el-radio-button label="viewTop">阅读排行</el-radio-button>
              <el-radio-button label="commentTop">评论排行</el-radio-button>
              <el-radio-button label="likeTop">点赞排行</el-radio-button>
              <!-- <el-radio-button label="carAddressIns">分享排行</el-radio-button>
              <el-radio-button label="carAddressIns">平均停留排行</el-radio-button> -->
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
          <el-table-column prop="shopName" label="店铺名称"></el-table-column>
          <el-table-column prop="fleet" label="车友会"></el-table-column>
          <el-table-column prop="name" label="标题"></el-table-column>
          <el-table-column prop="repostType" label="类型"></el-table-column>
          <el-table-column prop="readCount" label="阅读量" v-if="indicatorValue==='viewTop'">
            <template slot-scope="scope">{{scope.row.readCount?scope.row.readCount:scope.row.supportCount?scope.row.supportCount:scope.row.commentCount}}</template>
          </el-table-column>
          <el-table-column prop="readCount" label="点赞数" v-if="indicatorValue==='likeTop'"></el-table-column>
          <el-table-column prop="readCount" label="评论数" v-if="indicatorValue==='commentTop'"></el-table-column>
          <!-- <el-table-column prop="address" label="转发量"></el-table-column>
          <el-table-column prop="address" label="平均停留时长"></el-table-column> -->
        </biz-list>
        <biz-pagination :pagination="pagination" @size-change="handleSizeChange" @current-change="handleCurrentChange" v-show="radioValue==='1'"></biz-pagination>
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
      showRecommend: false,
      chartData: {},
      isShow: 'false',
      hardGroupHeight: 0,
      hardGroupHeight1: 0,
      showSwich: true,
      showSwichSeries: false,
      showHide: true,
      showSeriesHide: false,
      className: 'el-icon-caret-bottom',
      classSeriesName: 'el-icon-caret-bottom',
      // indicator
      conditionData: [
        {
          channelList: [],
          brandList: [],
          seriesList: []
        }
      ],
      channelLists: [],
      countTotal: 0,
      checkedShop: [],
      shopList: [],
      checkAllShop: true,
      isIndeterminateShop: true,
      showHideFleet: false,
      showSwichFleet: false,
      checkedFleet: [],
      fleetList: [],
      checkAllFleet: true,
      isIndeterminateFleet: true,
      checkedBrand: '',
      brandList: [{ id: 'FLEET', name: '动态' }, { id: 'TOPIC', name: '问答' }, { id: 'ARTICLE', name: '文章' }],
      checkAllBrand: true,
      isIndeterminateBrand: true,
      radioValue: '0',
      indicatorValue: 'viewTop',
      showMap: true,
      showMapChart: false,
      showBackButton: false,
      level: '1',
      provinceName: '',
      hasChildFlg: false,
      charMapData: [],
      kpiName: ['本期', '同比', '环比']
    };
  },
  props: {
    params: {
      type: Object
    }
  },
  methods: {
    ...mapGetters(['getUser']),
    fleetChange(val) {
      let checkedCount = val.length;
      this.checkAllFleet = checkedCount === this.fleetList.length;
      this.isIndeterminateFleet = checkedCount > 0 && checkedCount < this.fleetList.length;
      this.query();
    },
    handleCheckAllFleet(val) {
      this.checkedFleet = val ? this.fleetList.map(item => { return item.id; }) : [];
      this.query();
    },
    brandChange(val) {
      let checkedCount = val.length;
      this.checkAllBrand = checkedCount === this.brandList.length;
      this.isIndeterminateBrand = checkedCount > 0 && checkedCount < this.brandList.length;
      this.query();
    },
    handleCheckAllBrand(val) {
      this.checkedBrand = val ? this.brandList.map(item => { return item; }) : [];
      this.query();
    },
    load() {
      this.viewType = this.params.viewType || 'month';
      this.checkedBrand = this.params.checkedBrand || 'FLEET';
      console.log(this.params);
      this.$refs.search.viewType = this.params.viewType || 'month';
      this.$refs.search.date = this.params.dateType || 'month';
      this.$refs.search.defaultDate = [dateTime.getPreThreeMonthDay(), dateTime.today()];
      if (this.params.beginDate) {
        this.beginDate = this.params.beginDate;
        this.endDate = this.params.endDate;
        this.$refs.search.defaultDate = [this.params.beginDate, this.params.endDate];
      }
      this.getfleetList();
    },
    query() {
      this.getGraphData();
      this.getTable();
    },
    getfleetList() {
      this.loading = true;
      let param = {
        pageNumber: 1,
        pageSize: 1000,
        fleetType: 'circle'
      };
      http
        .get('/admin/fleet/json/list.jhtml', param)
        .then(data => {
          this.loading = false;
          this.fleetList = data.content;
          this.checkedFleet = this.params.checkedFleet || this.fleetList.map(item => { return item.id; }) || [];
          let checkedCount = this.checkedFleet.length;
          this.checkAllFleet = checkedCount === this.fleetList.length;
          this.isIndeterminateFleet = checkedCount > 0 && checkedCount < this.fleetList.length;
          this.$nextTick(() => {
            this.hardGroupFleetHeight = document.getElementsByClassName('hardGroupFleet')[0].offsetHeight;
            console.log(this.hardGroupFleetHeight);
            if (this.hardGroupFleetHeight > 54) {
              this.showSwichFleet = true;
              this.showHideFleet = true;
            } else {
              this.showSwichFleet = false;
              this.showHideFleet = false;
            }
          });
          this.query();
        })
        .catch(error => {
          this.loading = false;
          if (error.errorMessage) {
            this.$message.warning(error.errorMessage);
          }
        });
    },
    indicatorChanged() {
      this.getGraphData();
      this.getTable();
    },
    swichFleet() {
      this.className = this.className === 'el-icon-caret-bottom' ? 'el-icon-caret-top' : 'el-icon-caret-bottom';
      this.showHideFleet = this.className === 'el-icon-caret-bottom';
      if (!this.showHideFleet) {
        document.getElementsByClassName('hardGroupFleet')[0].style.height = 'auto';
      } else {
        document.getElementsByClassName('hardGroupFleet')[0].style.height = '55px';
      }
    },
    getGraphData() {
      this.loading = true;
      let params = {
        indicators: [this.indicatorValue],
        viewType: this.viewType,
        beginDate: this.beginDate,
        endDate: this.endDate,
        shopIds: this.checkedShop,
        fleets: this.checkedFleet,
        repostType: this.checkedBrand
      };
      http
        .post('/admin/ecommerce/kpi/friend/graph/fleet.jhtml', params)
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
      for (let i = 0; i < data.indicators.length; i++) {
        tmpData.push({
          日期: data.indicators[i].xValue,
          数量: data.indicators[i].yValue
          // 同比: data.indicators[i].yoyRate,
          // 环比: data.indicators[i].momRate
        });
      }
      let chartData = {
        type: 'histogram',
        data: {
          columns: ['日期', '数量'],
          rows: tmpData
        },
        settings: {}
      };
      return chartData;
    },
    getTable() {
      let params = {
        indicators: [this.indicatorValue],
        viewType: this.viewType,
        beginDate: this.beginDate,
        endDate: this.endDate,
        shopIds: this.checkedShop,
        fleets: this.checkedFleet,
        repostType: this.checkedBrand,
        pageSize: this.pagination.pageSize,
        pageNumber: this.pagination.currentPage
      };
      http
        .post('/admin/ecommerce/kpi/friend/table/fleet.jhtml', params)
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
        indicators: [this.indicatorValue],
        viewType: this.viewType,
        beginDate: this.beginDate,
        endDate: this.endDate,
        shopIds: this.checkedShop,
        fleets: this.checkedFleet,
        repostType: this.checkedBrand,
        pageSize: this.pagination.pageSize,
        pageNumber: this.pagination.currentPage
      };
      try {
        let response = await axios.post('/admin/ecommerce/kpi/friend/export/fleet.jhtml', params, { responseType: 'blob' });
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
    swich() {
      this.className = this.className === 'el-icon-caret-bottom' ? 'el-icon-caret-top' : 'el-icon-caret-bottom';
      this.showHide = this.className === 'el-icon-caret-bottom';
      if (!this.showHide) {
        document.getElementsByClassName('hardGroup')[0].style.height = 'auto';
      } else {
        document.getElementsByClassName('hardGroup')[0].style.height = '55px';
      }
    },
    buttonClick() {
      if (this.level === '2') {
        this.level = '1';
        this.showBackButton = false;
      } else if (this.level === '3') {
        this.level = '2';
        this.showMap = true;
        this.showMapChart = false;
      } else {
      }
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
.hot-analysis {
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
    .hardGroupFleet {
      display: flex;
      width: calc(100% - 90px);
      flex-flow: wrap;
    }
  }
  .chart-area {
    margin-top: 10px;
    .graph {
      width: 100%;
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
  .showHideFleet {
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
