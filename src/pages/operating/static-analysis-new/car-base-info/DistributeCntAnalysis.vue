<template>
  <div class="discnt-analysis">
    <div slot="top">
      <show-search-grid @refreshHandle="refreshHandle" :showIntroduce="false" :showViewType="false" ref="search">
        <div slot="description" class="description-pover">
          <p>标签不控制饼状图，其余突变受控制</p>
        </div>
      </show-search-grid>
    </div>
    <!-- <div class="indicators-search">
      <div class="title">运营商：</div>
      <el-checkbox-button v-model="checkAllOperator" @change="handleCheckAllOperator" :indeterminate="isIndeterminateOperator">全部
      </el-checkbox-button>
      <el-checkbox-group v-model="checkedOperator" @change="operatorChange">
        <el-checkbox-button v-for="(condition,index)  in operatorList" :label="condition.id" :key="index" size="mini">
          {{condition.name}}</el-checkbox-button>
      </el-checkbox-group>
    </div>-->
    <div class="indicators-search" v-if="this.getUser().roleLevel !== 'shop'">
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
      <div class="title">车队</div>
      <div class="hardShopGroup1" :class="{'showHideShop1' : showHideShop1}" ref="shopGroup">
        <el-checkbox-button v-model="checkAllFleet" @change="handleCheckAllFleet" :indeterminate="isIndeterminateFleet">全部</el-checkbox-button>
        <el-tooltip placement="bottom" v-for="(item, index) in fleetList" :key="index" :disabled="item.name.length<=10">
          <el-checkbox-group v-model="checkedFleet" @change="fleetChange">
            <el-checkbox-button :label="item.id" size="mini">
              {{item.name.length>10?item.name.substr(0, 10)+'...':item.name}}
            </el-checkbox-button>
          </el-checkbox-group>
          <div slot="content">{{ item.name }}</div>
        </el-tooltip>
      </div>
    </div>
    <div class="indicators-search" :class="{'showHide1' : showHide}">
      <div class="title">品牌</div>
      <div class="hardGroup" :class="{'showHide' : showHide}" ref="brandGroup">
        <el-checkbox-button v-model="checkAllBrand" @change="handleCheckAllBrand" :indeterminate="isIndeterminateBrand">全部</el-checkbox-button>
        <el-tooltip placement="bottom" v-for="(item, index) in brandList" :key="index" :disabled="item.length<=10">
          <el-checkbox-group v-model="checkedBrand" @change="brandChange">
            <el-checkbox-button :label="item" size="mini">
              {{item.length>10?item.substr(0, 10)+'...':item}}
            </el-checkbox-button>
          </el-checkbox-group>
          <div slot="content">{{ item }}</div>
        </el-tooltip>
      </div>
    </div>
    <div class="swich" v-if="showSwich">
      <i :class="className" @click="swich"></i>
    </div>
    <div class="chart-area" v-loading="loading">
      <div class="graph">
        <div class="filterSeach">
          <div class="filter-area">
            <el-radio-group @change="indicatorChanged" v-model="indicatorValue" size="mini">
              <el-radio-button label="carBrandCnt">品牌车系</el-radio-button>
              <el-radio-button label="carPriceCnt">价格</el-radio-button>
              <el-radio-button label="carAgeCnt">车龄</el-radio-button>
              <el-radio-button label="carAddressCnt">位置</el-radio-button>
            </el-radio-group>
          </div>
          <div class="type-range">
            <el-radio-group v-model="radioValue" size="mini">
              <el-radio-button label="0">视图</el-radio-button>
              <el-radio-button label="1">列表</el-radio-button>
            </el-radio-group>
          </div>
        </div>
        <div class="content" style="width:40%;float:right;line-height:40px;font-size: 13px;padding:100px;height:600px;overflow:auto" v-show="radioValue==='0'&&indicatorValue!=='carAddressCnt'">
          <div v-for="(list,index) in channelLists" :key="index">
            <span :class="'list'+index">
              {{list.lable}}:{{list.value}}辆
              占比{{countTotal!==0?((list.value/countTotal)*100).toFixed(2):list.value}}%
            </span>
          </div>
        </div>
        <biz-chart :chartData="chartDataOfBrandSeries" :loading="loading" :showSearch="false" v-if="radioValue==='0'&&indicatorValue==='carBrandCnt'"></biz-chart>
        <biz-chart :chartData="chartDataOfPrice" :loading="loading" :showSearch="false" v-if="radioValue==='0'&&indicatorValue==='carPriceCnt'"></biz-chart>
        <biz-chart :chartData="chartDataOfAge" :loading="loading" :showSearch="false" v-if="radioValue==='0'&&indicatorValue==='carAgeCnt'"></biz-chart>
        <div style="width: 600px;margin:0 auto">
          <biz-chart
            ref="bizChart"
            :chartData="chartData"
            :loading="loading"
            :showSearch="false"
            @buttonClick="buttonClick"
            :showMap="showMap"
            :showMapChart="showMapChart"
            :showBackButton="showBackButton"
            v-if="radioValue==='0'&&indicatorValue==='carAddressCnt'"
          ></biz-chart>
        </div>
      <biz-list ref="list" :height="height" :tableData="tableData" style="width: 100%;height:100%" v-show="radioValue==='1'">
          <el-table-column prop="plateNumber" label="车牌号"></el-table-column>
          <el-table-column prop="ownerName" label="车主"></el-table-column>
          <el-table-column prop="carType" label="品牌车型">
            <template slot-scope="scope">
              {{scope.row.brand}}{{scope.row.carType}}
            </template>
          </el-table-column>
          <el-table-column prop="price" label="车辆价格"></el-table-column>
          <el-table-column prop="carAge" label="车龄"></el-table-column>
          <el-table-column prop="address" label="位置"></el-table-column>
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
import urls from '@/common/urls';
import axios from 'axios';
import { mapGetters } from 'vuex';
import vPinyin from '@/utils/vue-py';
import cityMap from '@/utils/map/china-main-city-map.js';
import echarts from 'echarts/lib/echarts';

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
      chartDataOfPrice: {},
      chartDataOfBrandSeries: {},
      chartDataOfAge: {},
      chartData: {},
      isShow: 'false',
      hardGroupHeight: 0,
      hardGroupHeight1: 0,
      showSwich: true,
      showSwichSeries: false,
      showHide: true,
      showSeriesHide: false,
      showHideShop1: false,
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
      checkedOperator: [],
      operatorList: [],
      checkAllOperator: true,
      isIndeterminateOperator: true,
      checkedShop: [],
      shopList: [],
      checkAllShop: true,
      isIndeterminateShop: true,
      checkedFleet: [],
      fleetList: [],
      checkAllFleet: false,
      isIndeterminateFleet: true,
      checkedBrand: [],
      brandList: [],
      checkAllBrand: true,
      isIndeterminateBrand: true,
      radioValue: '0',
      indicatorValue: 'carBrandCnt',
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
    ...mapGetters(['getUser']),
    operatorChange() {},
    handleCheckAllOperator() {},
    shopChange(val) {
      let checkedCount = val.length;
      this.checkAllFleet = checkedCount === this.shopList.length;
      this.isIndeterminateShop = checkedCount > 0 && checkedCount < this.shopList.length;
      this.query();
    },
    handleCheckAllShop(val) {
      this.checkedShop = val ? this.shopList.map(item => { return item.id; }) : [];
      this.query();
    },
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
      console.log(this.params);
      this.$refs.search.viewType = this.params.viewType || 'month';
      this.$refs.search.date = this.params.dateType || 'month';
      if (this.params.beginDate) {
        this.beginDate = this.params.beginDate;
        this.endDate = this.params.endDate;
        this.$refs.search.defaultDate = [this.params.beginDate, this.params.endDate];
      }
      this.getShopList();
    },
    query() {
      this.getGraphPriceData();
      this.getGraphBrandSeriesData();
      this.getGraphAgeData();
      this.getGraphPositionData();
      this.getTable();
    },
    getShopList() {
      let param = {};
      if (this.getUser().roleLevel === 'shop') {
        this.shopList = [this.getUser().shop || ''];
      } else {
        http
          .get(urls.staticAnalisisi.vehicleShopList, param)
          .then(data => {
            this.shopList = data.stores;
          })
          .catch(errData => {
            if (errData.errorMessage) {
              this.$message.warning(errData.errorMessage);
            }
          });
      }
      this.checkedShop = this.params.checkedShop || [this.shopList[0].id] || [];
      this.getBrandsList();
      this.getfleetList();
    },
    getBrandsList() {
      this.loading = true;
      let param = {
        shopIds: this.checkedShop
      };
      http
        .post(urls.staticAnalisisi.vehicleBrandList, param)
        .then(data => {
          this.loading = false;
          this.brandList = data.brands;
          this.checkedBrand = this.params.checkedBrand || this.brandList || [];
        })
        .catch(error => {
          this.loading = false;
          if (error.errorMessage) {
            this.$message.warning(error.errorMessage);
          }
        });
    },
    getfleetList() {
      this.loading = true;
      let param = {
        shopId: this.checkedShop[0],
        pageNumber: 1,
        pageSize: 1000,
        fleetType: 'group'
      };
      http
        .get('/admin/fleet/json/list.jhtml', param)
        .then(data => {
          this.loading = false;
          this.fleetList = data.content;
          // this.checkedFleet = this.params.checkedFleet || this.fleetList.map(item => { return item.id; }) || [];
          // let checkedCount = this.checkedFleet.length;
          // this.checkAllFleet = checkedCount === this.fleetList.length;
          // this.isIndeterminateFleet = checkedCount > 0 && checkedCount < this.fleetList.length;
          this.getTable();
          this.getGraphBrandSeriesData();
        })
        .catch(error => {
          this.loading = false;
          if (error.errorMessage) {
            this.$message.warning(error.errorMessage);
          }
        });
    },
    indicatorChanged() {
      if (this.indicatorValue === 'carBrandCnt') {
        this.getGraphBrandSeriesData();
      } else if (this.indicatorValue === 'carPriceCnt') {
        this.getGraphPriceData();
      } else if (this.indicatorValue === 'carAgeCnt') {
        this.getGraphAgeData();
      } else {
        this.getGraphPositionData();
      }
      this.getTable();
    },
    getGraphPriceData() {
      this.loading = true;
      let params = {
        indicator: 'carPriceCnt',
        viewType: this.viewType,
        beginDate: this.beginDate,
        endDate: this.endDate,
        shopIds: this.checkedShop,
        fleets: this.checkedFleet,
        brands: this.checkedBrand
      };
      http
        .post('/admin/ecommerce/kpi/car/graph/distribute.jhtml', params)
        .then(data => {
          this.countTotal = 0;
          this.channelLists = data.indicators;
          for (const item of data.indicators) {
            this.countTotal += Number(item.value);
          }
          this.chartDataOfPrice = this.dataFormat(data);
        })
        .catch(errData => {
          this.loading = false;
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    getGraphBrandSeriesData() {
      this.loading = true;
      let params = {
        indicator: 'carBrandCnt',
        viewType: this.viewType,
        beginDate: this.beginDate,
        endDate: this.endDate,
        shopIds: this.checkedShop,
        fleets: this.checkedFleet,
        brands: this.checkedBrand
      };
      http
        .post('/admin/ecommerce/kpi/car/graph/distribute.jhtml', params)
        .then(data => {
          this.countTotal = 0;
          this.channelLists = data.indicators;
          for (const item of data.indicators) {
            this.countTotal += Number(item.value);
          }
          this.chartDataOfBrandSeries = this.dataFormat(data);
        })
        .catch(errData => {
          this.loading = false;
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    getGraphAgeData() {
      this.loading = true;
      let params = {
        indicator: 'carAgeCnt',
        viewType: this.viewType,
        beginDate: this.beginDate,
        endDate: this.endDate,
        shopIds: this.checkedShop,
        fleets: this.checkedFleet,
        brands: this.checkedBrand
      };
      http
        .post('/admin/ecommerce/kpi/car/graph/distribute.jhtml', params)
        .then(data => {
          this.countTotal = 0;
          this.channelLists = data.indicators;
          for (const item of data.indicators) {
            this.countTotal += Number(item.value);
          }
          this.chartDataOfAge = this.dataFormat(data);
        })
        .catch(errData => {
          this.loading = false;
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    getGraphPositionData() {
      this.loading = true;
      let param = {
        indicator: this.indicatorValue,
        shopIds: this.checkedShop,
        fleets: this.checkedFleet,
        brands: this.checkedBrand,
        beginDate: this.beginDate,
        endDate: this.endDate
      };
      http
        .post(urls.staticAnalisisi.vehicleArea, param)
        .then(data => {
          this.charMapData = data.content;
          this.loading = false;
          if (this.level === '3') {
            this.showMap = true;
            this.showMapChart = false;
          }
          this.level = '1';
          this.showBackButton = false;
          this.chartData = this.dataPositionFormat(data.content);
        })
        .catch(error => {
          this.loading = false;
          if (error.errorMessage) {
            this.$message.warning(error.errorMessage);
          }
        });
    },
    dataPositionFormat(data) {
      let tmpData = [];
      let tmpDataByPro = [];
      let maxValue = 0;
      if (data.length === 1) {
        for (const item of data) {
          for (let i = 0; i < item.children.length; i++) {
            tmpDataByPro.push({
              位置: item.children[i].name,
              联网车: Number(item.children[i].netCount),
              未联网车: Number(item.children[i].count)
            });
            maxValue = Math.max(maxValue, Number(item.children[i].totalCount));
          }
        }
      } else {
        for (let i = 0; i < data.length; i++) {
          tmpData.push({
            位置: data[i].name,
            联网车: Number(data[i].netCount),
            未联网车: Number(data[i].count)
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
      let that = this;
      let chartData = {
        type: 'map',
        legendVisible: true,
        data: {
          columns: ['位置', '联网车', '未联网车'],
          rows: curData || []
        },
        maxRangeValue: maxValue || 100,
        settings: {
          position: data.length === 1 ? 'province/' + oneProvince : 'china',
          selectedMode: 'single',
          dimension: '位置',
          metrics: ['联网车', '未联网车'],
          itemStyle: {
            normal: {
              areaColor: '#fff'
            }
          }
        },
        events: {
          legendselectchanged: function(params) {
            let selectKey = Object.keys(params.selected);
            let selectValue = Object.values(params.selected);
            console.log(selectValue, selectKey);
            if (selectValue[0] === false && selectValue[1] === false) {
              that.getGraphPositionData();
            }
          },
          click: v => {
            this.showBackButton = true;
            this.level = '2';
            this.provinceName = v.name;
            let provinceName = vPinyin.chineseToPinYin(v.name);
            let pos = 'province/' + provinceName;
            for (const item of data) {
              if (v.name === item.name) {
                let tmpDataChild = [];
                let maxValueChild = 0;
                for (let i = 0; i < item.children.length; i++) {
                  tmpDataChild.push({
                    位置: item.children[i].name,
                    联网车: Number(item.children[i].netCount),
                    未联网车: Number(item.children[i].count)
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
              data: ['联网车', '未联网车']
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
                name: '联网车',
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
                data: this.initNetCount(name, mapJson)
              },
              {
                name: '未联网车',
                type: 'map',
                map: name,
                smooth: false,
                itemStyle: {
                  normal: {
                    label: { show: true },
                    borderWidth: 1,
                    borderColor: 'gray',
                    color: '#5ab1ef',
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
    initNetCount(name, mapJson) {
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
                      value: item.netCount
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
    },
    getTable() {
      let params = {
        indicator: this.indicatorValue,
        viewType: this.viewType,
        beginDate: this.beginDate,
        endDate: this.endDate,
        shopIds: this.checkedShop,
        fleets: this.checkedFleet,
        brands: this.checkedBrand,
        pageSize: this.pagination.pageSize,
        pageNumber: this.pagination.currentPage
      };
      http
        .post('/admin/ecommerce/kpi/car/table/cars.jhtml', params)
        .then(data => {
          this.tableData = data.dataList;
          this.pagination.total = Number(data.total);
        })
        .catch(errData => {
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
        });
    },
    async exportExcle() {
      let params = {
        indicator: this.indicatorValue,
        viewType: this.viewType,
        beginDate: this.beginDate,
        endDate: this.endDate,
        shopIds: this.checkedShop,
        fleets: this.checkedFleet,
        brands: this.checkedBrand,
        pageSize: this.pagination.pageSize,
        pageNumber: this.pagination.currentPage
      };
      try {
        let response = await axios.post('/admin/ecommerce/kpi/car/export/cars.jhtml', params, { responseType: 'blob' });
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
      this.indicatorChanged();
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
        },
        events: {
          mouseover: v => {
            this.channelLists.forEach((element, index) => {
              if (element.lable === v.name) {
                document.getElementsByClassName('list' + index)[0].style.color = v.color;
                document.getElementsByClassName('list' + index)[0].style.fontSize = '16px';
              }
            });
          },
          mouseout: v => {
            this.channelLists.forEach((element, index) => {
              document.getElementsByClassName('list' + index)[0].style.color = 'black';
              document.getElementsByClassName('list' + index)[0].style.fontSize = '13px';
            });
          }
        }
      };
      return chartData;
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
.discnt-analysis {
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
      flex-flow: wrap;
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
    height: 500px;
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
