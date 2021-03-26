<template>
  <div class="general-view-analysis-info">
    <div slot="top">
      <show-search-grid @refreshHandle="refreshHandle" :showIntroduce="false" ref="search"></show-search-grid>
    </div>
    <div class="indicators-search">
      <div class="title">订单类型</div>
      <div style="display:flex;width: calc(100% - 90px);flex-flow:wrap">
        <el-checkbox-button v-model="checkAllOrderType" @change="handleCheckAllOrderType" :indeterminate="isIndeterminate">全部</el-checkbox-button>
        <el-tooltip placement="bottom" v-for="(condition,index)  in conditionData.orderTypeList" :key="index" :disabled="condition.label.length<=10">
          <el-checkbox-group v-model="checkedOrderType" @change="conditionChange">
            <el-checkbox-button :label="condition.value" size="mini">
              {{condition.label.length>10?condition.label.substr(0, 10)+'...':condition.label}}</el-checkbox-button>
          </el-checkbox-group>
          <div slot="content">{{ condition.label }}</div>
        </el-tooltip>
      </div>
    </div>
    <div class="chart-area">
      <div class="graph">
        <div class="filterSeach">
          <div class="filter-area"></div>
          <div class="type-range">
            <el-radio-group @change="indicatorChanged" v-model="radioValue" size="mini">
              <el-radio-button label="0">视图</el-radio-button>
              <el-radio-button label="1">列表</el-radio-button>
            </el-radio-group>
          </div>
        </div>
        <biz-chart
          ref="bizChart"
          :chartData="chartData"
          :loading="loading"
          @buttonClick="buttonClick"
          :showBackButton="showBackButton"
          :showSearch="false"
          :showMap="showMap"
          :showMapChart="showMapChart"
          v-if="isShow"
        ></biz-chart>
        <biz-list ref="list" :height="height" :tableData="tableData" style="width: 100%" v-if="!isShow">
          <el-table-column prop="province" label="省份"></el-table-column>
          <el-table-column prop="memberNum" label="人数"></el-table-column>
          <el-table-column prop="percent" label="占比"></el-table-column>
        </biz-list>
        <biz-pagination :pagination="pagination" @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange" v-if="!isShow"></biz-pagination>
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
import dateTime from '@/utils/dateTime';
import http from '@/common/http';
import ShowSearchGrid from '../components/ShowSearchGrid';
import vPinyin from '@/utils/vue-py';
import cityMap from '@/utils/map/china-main-city-map.js';
import echarts from 'echarts/lib/echarts';
import axios from 'axios';
export default {
  name: 'GeneralViewAnalysis',
  data() {
    return {
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
      checkAllOrderType: true,
      isIndeterminate: true,
      checkedOrderType: [],
      conditionData: [
        {
          orderTypeList: []
        }
      ],
      showRecommend: false,
      summary: {},
      kpiName: ['本期', '同比', '环比'],
      chartData: {},
      isShow: 'false',
      radioValue: '0',
      showMap: true,
      showMapChart: false,
      showBackButton: false,
      level: '1',
      provinceName: '',
      hasChildFlg: false,
      charMapData: []
    };
  },
  props: {
    params: {
      type: Object
    }
  },
  methods: {
    handleCheckAllOrderType(val) {
      this.checkedOrderType = val
        ? this.conditionData.orderTypeList.map(item => {
          return item.value;
        })
        : [];
      this.getGraphData();
      this.getTable();
    },
    conditionChange(value) {
      let checkedCount = value.length;
      this.checkAllOrderType = checkedCount === this.conditionData.orderTypeList.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.conditionData.orderTypeList.length;
      this.getGraphData();
      this.getTable();
    },
    load() {
      this.viewType = this.params.viewType || 'month';
      console.log(this.params);
      this.$refs.search.viewType = this.params.viewType || 'month';
      this.$refs.search.date = this.params.dateType || 'month';
      if (this.params.beginDate) {
        this.beginDate = this.params.beginDate;
        this.endDate = this.params.endDate;
        this.$refs.search.defaultDate = [this.params.beginDate, this.params.endDate];
      }
      this.conditionData = [];
      this.getConditionData();
    },
    getConditionData() {
      this.conditionData.orderTypeList = [
        { label: '车品订单', value: 'product' },
        { label: '充值', value: 'deposit' },
        { label: '普通服务', value: 'service' },
        { label: '一键救援', value: 'rescue' },
        { label: '预约维修', value: 'repair' },
        { label: '预约保养', value: 'maintain' },
        { label: '预约置换', value: 'replace' },
        { label: '贷款购车', value: 'loan' },
        { label: '预约体验', value: 'ride' },
        { label: '整车订单', value: 'car' },
        { label: '普通订单', value: 'general' },
        { label: '维修保养订单', value: 'repairAndMaintain' },
        { label: '产品订单', value: 'productAndCar' },
        { label: 'sim卡充值订单', value: 'simRecharge' },
        { label: '平台服务', value: 'businessService' },
        { label: '短信服务', value: 'smsService' },
        { label: '活动招募', value: 'recruit' },
        { label: '优惠券订单', value: 'couponOrder' },
        { label: '打赏订单', value: 'rewardOrder' },
        { label: '店铺账户充值订单', value: 'accountRecharge' }
      ];
      this.checkedOrderType = this.params.checkedOrderType;
      let checkedCount = this.checkedOrderType.length;
      this.checkAllOrderType = checkedCount === this.conditionData.orderTypeList.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.conditionData.orderTypeList.length;
      this.getGraphData();
      this.getTable();
    },
    indicatorChanged() {
      if (this.radioValue === '0') {
        this.isShow = true;
      } else {
        this.isShow = false;
      }
    },
    getGraphData() {
      this.loading = true;
      let params = {
        type: 'crowdRegion',
        orderTypes: this.checkedOrderType,
        viewType: this.viewType,
        indicators: ['crowdRegion'],
        beginDate: this.beginDate,
        endDate: this.endDate,
        shopId: window.top.SHOP_ID || ''
      };
      http
        .post('/admin/ecommerce/kpi/order/graph/order/order.jhtml', params)
        .then(data => {
          this.charMapData = data.indicators;
          this.loading = false;
          if (this.level === '3') {
            this.showMap = true;
            this.showMapChart = false;
          }
          this.level = '1';
          this.showBackButton = false;
          this.chartData = this.dataFormat(data.indicators);
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
        type: 'crowdRegion',
        orderTypes: this.checkedOrderType,
        viewType: this.viewType,
        indicators: ['crowdRegion'],
        beginDate: this.beginDate,
        endDate: this.endDate,
        shopId: window.top.SHOP_ID || '',
        pageSize: this.pagination.pageSize,
        pageNumber: this.pagination.currentPage
      };
      http
        .post('/admin/ecommerce/kpi/order/table/order/order.jhtml', params)
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
        type: 'crowdRegion',
        orderTypes: this.checkedOrderType,
        viewType: this.viewType,
        indicators: ['crowdRegion'],
        beginDate: this.beginDate,
        endDate: this.endDate,
        shopId: window.top.SHOP_ID || '',
        pageSize: this.pagination.pageSize,
        pageNumber: this.pagination.currentPage
      };
      try {
        let response = await axios.post('/admin/ecommerce/kpi/order/export/order/order.jhtml', params, { responseType: 'blob' });
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
      this.getGraphData();
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
    dataFormat(data) {
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
        },
        events: {
          click: v => {
            this.showBackButton = true;
            this.level = '2';
            this.provinceName = v.name;
            let provinceName = vPinyin.chineseToPinYin(v.name);
            let pos = 'province/' + provinceName;
            let tmpStr = JSON.stringify(data);
            let str = tmpStr.replace(/省/g, '');
            str = str.replace(/市/g, '');
            str = str.replace(/自治区/g, '');
            str = str.replace(/维吾尔/g, '');
            str = str.replace(/回族/g, '');
            str = str.replace(/壮族/g, '');
            str = str.replace(/特别行政区/g, '');
            let curData = JSON.parse(str);
            for (const item of curData) {
              if (v.name === item.name) {
                let tmpDataChild = [];
                let maxValueChild = 0;
                for (let i = 0; i < item.children.length; i++) {
                  tmpDataChild.push({
                    位置: item.children[i].name,
                    数量: Number(item.children[i].count)
                  });
                  maxValueChild = Math.max(maxValueChild, Number(item.children[i].totalCount));
                }

                this.chartData.data.rows = tmpDataChild;
                this.chartData.maxRangeValue = maxValueChild || 100;
              }
            }
            this.chartData.settings.position = pos;
            this.getChildFlg(v.name);
            if (this.hasChildFlg === true) {
              this.chartData.events = {
                click: v => {
                  this.level = '3';
                  this.showBackButton = true;
                  this.getCity(v.name);
                }
              };
            } else {
              this.chartData.events = {};
            }
          }
        }
      };
      return chartData;
    },
    getCity(name) {
      this.loading = true;
      this.showMap = false;
      this.showMapChart = true;
      let myChart = null;
      myChart = echarts.init(this.$refs.bizChart.$refs.mapChart);
      let cityId = cityMap[name];
      if (cityId) {
        let url = '/resources/admin/city/' + cityId + '.json';
        axios.get(url, {}).then(response => {
          this.loading = false;
          let mapJson = [];
          mapJson = response.data;
          echarts.registerMap(name, mapJson);
          let maxValue = 0;
          for (let i = 0; i < this.charMapData.length; i++) {
            maxValue = Math.max(maxValue, Number(this.charMapData[i].totalCount));
          }
          const option = {
            visualMap: {
              min: 0,
              max: maxValue || 100,
              text: ['High', 'Low'],
              realtime: false,
              calculable: true,
              inRange: {
                color: ['white', 'yellow', 'orangered']
              }
            },
            tooltip: {
              trigger: 'item',
              formatter: function(params) {
                let res = params.name + '<br/>';
                let myseries = option.series;
                for (let i = 0; i < myseries.length; i++) {
                  for (let j = 0; j < myseries[i].data.length; j++) {
                    if (myseries[i].data[j].name === params.name) {
                      res += myseries[i].name + ' : ' + myseries[i].data[j].value + '</br>';
                    }
                  }
                }
                return res;
              },
              backgroundColor: 'rgba(0,0,0,0.7)'
            },
            legend: {
              orient: 'horizontal',
              left: 'center',
              data: ['数量']
            },
            toolbox: {
              show: true,
              orient: 'vertical',
              left: 'right',
              top: 'center',
              feature: {
                mark: { show: true },
                dataView: { show: true, readOnly: false },
                restore: { show: true },
                saveAsImage: { show: true }
              }
            },
            series: [
              {
                name: '数量',
                type: 'map',
                map: name,
                smooth: false,
                itemStyle: {
                  normal: {
                    label: { show: true },
                    borderWidth: 1,
                    borderColor: 'gray',
                    color: '#19d4ae',
                    areaColor: '#ffffff'
                  },
                  emphasis: { label: { show: true } }
                },
                showLegendSymbol: true,
                data: this.initCount(name, mapJson)
              }
            ]
          };
          myChart.setOption(option);
        });
      }
    },
    initCount(name, mapJson) {
      let mapData = [];
      for (const list of this.charMapData) {
        if (list.children) {
          for (const child of list.children) {
            if (child.children) {
              for (const item of child.children) {
                for (const mapName of mapJson.features) {
                  if (item.name === mapName.properties.name) {
                    mapData.push({
                      name: mapName.properties.name,
                      value: item.count
                    });
                  }
                }
              }
            }
          }
        }
      }
      return mapData;
    },
    getChildFlg(name) {
      for (const item of this.charMapData) {
        if (name === item.name) {
          if (item.children) {
            for (const list of item.children) {
              if (list.children) {
                this.hasChildFlg = true;
              } else {
                this.hasChildFlg = false;
              }
            }
          }
        }
      }
    }
  },
  created() {},
  components: {
    BizChart,
    BizList,
    ShowSearchGrid,
    BizPagination
  }
};
</script>

<style lang="scss">
.general-view-analysis-info {
  height: 100%;
  overflow: auto;
  display: flex;
  flex-direction: column;
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
  .total {
    display: flex;
    margin-top: 20px;
    .column1 {
      border: 1px solid #d9d9d9;
      padding: 20px;
      width: 50%;
      line-height: 40px;
      margin-right: 40px;
      .table-cell {
        font-size: 15px;
      }
      .color-primary {
        font-size: 13px;
      }
    }
    .column2 {
      border: 1px solid #d9d9d9;
      padding: 20px;
      width: 50%;
      line-height: 40px;
      .table-cell {
        font-size: 15px;
      }
      .color-primary {
        font-size: 13px;
      }
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
