<template>
  <div class="vehicle-static-analisis" v-loading="loading">
    <biz-chart
      ref="bizChart"
      :chartData="chartData"
      :showPagination="false"
      :showViewType="false"
      :showTimeRange="false"
      :showDateRange="false"
      :showTimeDate="true"
      :showButton="true"
      @refreshHandle="refreshHandle"
      @exportExcle="exportExcle"
      :showMap="showMap"
      :showMapChart="showMapChart"
      :showBackButton="showBackButton"
      @buttonClick="buttonClick"
      :chartWidth="chartWidth"
    >
      <div slot="indicators">
        <div class="terminal-type" v-if="this.getUser().roleLevel !== 'shop'">
          <div class="title">店铺</div>
          <div class="hardShopGroup">
            <el-checkbox-button v-model="checkAllShops" @change="handleCheckAllShops" :indeterminate="isIndeterminateShops">全选</el-checkbox-button>
            <el-checkbox-group :min="1" v-model="checkedShops" @change="shopsChange">
              <el-checkbox-button v-for="(item,index) in conditionData.shopsList" :label="item.id" :key="index" size="mini">{{item.name}}</el-checkbox-button>
            </el-checkbox-group>
          </div>
        </div>
        <div class="terminal-type">
          <div class="title">品牌</div>
          <div class="hardGroup" :class="{'showHide' : showHide}" ref="brandGroup">
            <el-checkbox-button v-model="checkAllBrand" @change="handleCheckAllBrand" :indeterminate="isBrandIndeterminate">全选</el-checkbox-button>
            <el-checkbox-group v-model="checkedBrand" @change="conditionBrandChange">
              <el-checkbox-button v-for="(condition,index) in conditionData.brandList" :label="condition" :key="index" size="mini">{{condition}}</el-checkbox-button>
            </el-checkbox-group>
          </div>
        </div>
        <div class="swich" v-if="showSwich">
          <i :class="className" @click="swich"></i>
        </div>
        <div class="terminal-type">
          <div class="title">系列</div>
          <div class="hardSeriesGroup" :class="{'showSeriesHide' : showSeriesHide}" ref="seriesGroup">
            <el-checkbox-button v-model="checkAllSeries" @change="handleCheckAllSeries" :indeterminate="isSeriesIndeterminate">全选</el-checkbox-button>
            <el-checkbox-group v-model="checkedSeries" @change="conditionSeriesChange">
              <el-checkbox-button v-for="(condition,index) in conditionData.seriesList" :label="condition" :key="index" size="mini">{{condition}}</el-checkbox-button>
            </el-checkbox-group>
          </div>
        </div>
        <div class="swichSeries" v-if="showSwichSeries">
          <i :class="classSeriesName" @click="swichSeries"></i>
        </div>
      </div>
      <div slot="list">
        <biz-list ref="list" :height="height" :tableData="tableData" :rowKeys="rowKeys" style="width: 100%" class="class-mgmt-tabel">
          <!-- :defaultSort="{prop: 'totalCount', order: 'descending'}" -->
          <!-- <el-table-column type="expand" prop="children">
            <template slot-scope="props">
              <el-table :data="props.row.children" :show-header="false" size="small">
                <el-table-column prop="name" label="地域分布" class-name="first-children-name"></el-table-column>
                <el-table-column prop="totalCount" label="车辆总数"></el-table-column>
                <el-table-column prop="netCount" label="联网车"></el-table-column>
                <el-table-column prop="count" label="未联网车"></el-table-column>
              </el-table>
          </template>
          </el-table-column>-->
          <el-table-column prop="name" label="地域分布"></el-table-column>
          <el-table-column prop="totalCount" label="车辆总数"></el-table-column>
          <el-table-column prop="netCount" label="联网车"></el-table-column>
          <el-table-column prop="count" label="未联网车"></el-table-column>
        </biz-list>
      </div>
      <div slot="description">
        <p>1、联网车：在统计期开始的前30天内[30]、及统计期内，有在服务器内产生过数据的车辆总数（上传过GPS数据/轨迹数据/其他车辆数据等）</p>
        <p>2、未联网车：在统计期开始的前30天内[30]、及统计期内，在服务器内都没有产生过数据的车辆总数（上传过GPS数据/轨迹数据/其他车辆数据等）</p>
      </div>
    </biz-chart>
  </div>
</template>

<script>
import BizChart from '@/components/BizChart';
import BizList from '@/components/BizTable/BizList';
// import dateTime from '@/utils/dateTime';
import vPinyin from '@/utils/vue-py';
import http from '@/common/http';
import urls from '@/common/urls';
import axios from 'axios';
import { mapGetters } from 'vuex';
import cityMap from '@/utils/map/china-main-city-map.js';
import echarts from 'echarts/lib/echarts';
let _ = require('lodash');

export default {
  name: 'VehicleStaticAnalisis',
  data() {
    return {
      expands: [],
      loading: false,
      hardGroupHeight: 0,
      hardGroupHeight1: 0,
      chartData: {},
      chartWidth: '80%',
      showSwich: false,
      showSwichSeries: false,
      showHide: false,
      showSeriesHide: false,
      shopId: '全部',
      show: false,
      className: 'el-icon-caret-bottom',
      classSeriesName: 'el-icon-caret-bottom',
      isIndeterminateShops: true,
      isBrandIndeterminate: true,
      isSeriesIndeterminate: false,
      checkAllBrand: true,
      checkAllSeries: true,
      showMap: true,
      showMapChart: false,
      showBackButton: false,
      level: '1',
      provinceName: '',
      height: '500',
      tableData: [],
      beginDate: '',
      checkAllShops: false,
      checkedShops: [],
      checkedBrand: [],
      checkedSeries: [],
      conditionData: {
        shopsList: [],
        brandList: [],
        seriesList: []
      },
      hasChildFlg: false
    };
  },
  props: {},
  components: {
    BizChart,
    BizList
  },
  computed: {},
  watch: {},
  mounted() {},
  methods: {
    ...mapGetters(['getUser']),
    load(tree, treeNode, resolve) {
      this.tableData.map(item => {
        resolve([item.children]);
      });
    },
    rowKeys(row) {
      return row.name + row.fullName;
    },
    // setClassName({ row, index }) {
    //   return row.expand ? 'expand' : 'noexpand';
    // },
    // expandChange(row, expandedRows) {
    //   this.expands = expandedRows.map(item => {
    //     return item.name;
    //   });
    // },
    shopsChange(val) {
      let checkedCount = val.length;
      this.checkAllShops = checkedCount === this.conditionData.shopsList.length;
      this.isIndeterminateShops = checkedCount > 0 && checkedCount < this.conditionData.shopsList.length;
      this.getTabelData();
    },
    handleCheckAllShops(val) {
      if (val) {
        this.checkedShops = val
          ? this.conditionData.shopsList.map(item => {
            return item.id;
          })
          : [];
        this.getTabelData();
      } else {
        this.checkedShops = [];
        this.checkedShops.push(this.conditionData.shopsList[0].id);
      }
    },
    handleCheckAllBrand(val) {
      this.checkedBrand = val ? this.conditionData.brandList : [];
      this.showSeriesHide = false;
      this.getSeriesList();
    },
    handleCheckAllSeries(val) {
      this.checkedSeries = val ? this.conditionData.seriesList : [];
      this.getTabelData();
    },
    swich() {
      this.className = this.className === 'el-icon-caret-bottom' ? 'el-icon-caret-top' : 'el-icon-caret-bottom';
      this.showHide = this.className === 'el-icon-caret-bottom';
      if (!this.showHide) {
        document.getElementsByClassName('hardGroup')[0].style.height = this.hardGroupHeight + 'px';
      } else {
        document.getElementsByClassName('hardGroup')[0].style.height = '55px';
      }
    },
    swichSeries() {
      this.classSeriesName = this.classSeriesName === 'el-icon-caret-bottom' ? 'el-icon-caret-top' : 'el-icon-caret-bottom';
      this.showSeriesHide = this.classSeriesName === 'el-icon-caret-bottom';
      if (!this.showSeriesHide) {
        document.getElementsByClassName('hardSeriesGroup')[0].style.height = this.hardGroupHeight1 + 'px';
      } else {
        document.getElementsByClassName('hardSeriesGroup')[0].style.height = '55px';
      }
    },
    conditionBrandChange(val) {
      let checkedCount = val.length;
      this.checkAllBrand = checkedCount === this.conditionData.brandList.length;
      this.isBrandIndeterminate = checkedCount > 0 && checkedCount < this.conditionData.brandList.length;
      this.getSeriesList();
    },
    conditionSeriesChange(val) {
      let checkedCount = val.length;
      this.checkAllSeries = checkedCount === this.conditionData.seriesList.length;
      this.isSeriesIndeterminate = checkedCount > 0 && checkedCount < this.conditionData.seriesList.length;
      this.getTabelData();
    },
    refreshHandle(val) {
      this.beginDate = val.date;
      this.getTabelData();
    },
    getParams() {
      let param = {
        shopIds: this.checkedShops,
        brands: this.checkedBrand,
        serieses: this.checkedSeries,
        beginDate: this.beginDate
      };
      return param;
    },
    async exportExcle() {
      this.loading = true;
      let params = this.getParams();
      try {
        let response = await axios.post(urls.staticAnalisisi.vehicleExport, params, { responseType: 'blob' });
        const blob = new Blob([response.data], { type: 'application/vnd.ms-excel' });
        const fileName = decodeURI(response.headers['content-disposition'].split('filename=')[1]);
        let elink = document.createElement('a');
        elink.download = fileName.match(/"(\S*)"/)[1];
        elink.style.display = 'none';
        elink.href = URL.createObjectURL(blob);
        document.body.appendChild(elink);
        elink.click();
        URL.revokeObjectURL(elink.href); // 释放URL 对象
        document.body.removeChild(elink);
        this.loading = false;
        return;
      } catch (error) {
        this.loading = false;
        throw new Error(error);
      }
    },
    showMessage(msg, type) {
      this.$notify({
        message: msg,
        type: type,
        showClose: true
      });
    },
    getBrandsList() {
      this.loading = true;
      let param = {
        shopIds: this.checkedShops
      };
      http
        .post(urls.staticAnalisisi.vehicleBrandList, param)
        .then(data => {
          this.loading = false;
          this.conditionData.brandList = data.brands;
          this.checkedBrand = this.conditionData.brandList ? this.conditionData.brandList : [];
          this.getSeriesList();
          this.$nextTick(() => {
            this.hardGroupHeight = document.getElementsByClassName('hardGroup')[0].offsetHeight;
            if (this.hardGroupHeight > 56) {
              this.showSwich = true;
              this.showHide = true;
            } else {
              this.showSwich = false;
              this.showHide = false;
            }
          });
        })
        .catch(error => {
          this.loading = false;
          if (error.errorMessage) {
            this.$message.warning(error.errorMessage);
          }
        });
    },
    getSeriesList() {
      this.loading = true;
      let param = {
        shopIds: this.checkedShops,
        brands: this.checkedBrand
      };
      http
        .post(urls.staticAnalisisi.vehicleSeriesList, param)
        .then(data => {
          this.loading = false;
          this.conditionData.seriesList = data.serieses;
          this.checkedSeries = this.conditionData.seriesList ? this.conditionData.seriesList : [];
          this.getTabelData();
          this.$refs.seriesGroup.style.height = 'auto';
          this.showSeriesHide = false;
          this.$nextTick(() => {
            // if (!this.showSeriesHide) {
            this.hardGroupHeight1 = this.$refs.seriesGroup.offsetHeight;
            // }
            if (this.conditionData.seriesList.length > 0 && this.hardGroupHeight1 > 56) {
              this.$refs.seriesGroup.style.height = '55px';
              this.classSeriesName = 'el-icon-caret-bottom';
              this.showSwichSeries = true;
              this.showSeriesHide = true;
            } else {
              this.showSwichSeries = false;
              this.showSeriesHide = false;
            }
          });
        })
        .catch(error => {
          this.loading = false;
          if (error.errorMessage) {
            this.$message.warning(error.errorMessage);
          }
        });
    },
    getGraphData(data) {
      if (this.level === '3') {
        this.showMap = true;
        this.showMapChart = false;
      }
      this.level = '1';
      this.showBackButton = false;
      this.chartData = this.dataFormat(data);
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
        data: {
          columns: ['位置', '联网车', '未联网车'],
          rows: curData
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
              that.getGraphData();
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
            this.getTabelData(v.name);
            this.getChildFlg(v.name);
            if (this.hasChildFlg === true) {
              this.chartData.events = {
                click: v => {
                  this.level = '3';
                  this.showBackButton = true;
                  this.getCity(v.name);
                  this.getCityTable(v.name);
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
          for (let i = 0; i < this.tableData.length; i++) {
            maxValue = Math.max(maxValue, Number(this.tableData[i].totalCount));
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
      for (const item of this.tableData) {
        for (const mapName of mapJson.features) {
          if (item.name === mapName.properties.name) {
            mapData.push({
              name: mapName.properties.name,
              value: item.count
            });
          }
        }
      }
      return mapData;
    },
    initNetCount(name, mapJson) {
      let mapData = [];
      for (const item of this.tableData) {
        for (const mapName of mapJson.features) {
          if (item.name === mapName.properties.name) {
            mapData.push({
              name: mapName.properties.name,
              value: item.netCount
            });
          }
        }
      }
      return mapData;
    },
    getTabelData(name) {
      this.loading = true;
      let param = this.getParams();
      http
        .post(urls.staticAnalisisi.vehicleArea, param)
        .then(data => {
          this.loading = false;
          if (!name) {
            if (data.content.length > 1) {
              this.tableData = data.content;
            } else {
              let table = [];
              for (const item of data.content) {
                if (item.children) {
                  for (const tableTw of item.children) {
                    if (tableTw.children) {
                      table.push({
                        children: tableTw.children,
                        name: tableTw.name,
                        count: tableTw.count,
                        totalCount: tableTw.totalCount,
                        netCount: tableTw.netCount
                      });
                    } else {
                      table.push({
                        name: tableTw.name,
                        count: tableTw.count,
                        totalCount: tableTw.totalCount,
                        netCount: tableTw.netCount
                      });
                    }
                  }
                } else {
                  table.push({
                    name: item.name,
                    count: item.count,
                    totalCount: item.totalCount,
                    netCount: item.netCount
                  });
                }
                this.tableData = table;
              }
            }
            this.getGraphData(data.content);
          } else {
            let tableChild = [];
            for (const list of data.content) {
              if (name === list.name) {
                if (list.children) {
                  for (const tableTw2 of list.children) {
                    if (tableTw2.children) {
                      tableChild.push({
                        children: tableTw2.children,
                        name: tableTw2.name,
                        count: tableTw2.count,
                        totalCount: tableTw2.totalCount,
                        netCount: tableTw2.netCount
                      });
                    } else {
                      tableChild.push({
                        name: tableTw2.name,
                        count: tableTw2.count,
                        totalCount: tableTw2.totalCount,
                        netCount: tableTw2.netCount
                      });
                    }
                  }
                } else {
                  tableChild.push({
                    name: list.name,
                    count: list.count,
                    totalCount: list.totalCount,
                    netCount: list.netCount
                  });
                }
                this.tableData = tableChild;
              } else {
                this.tableData = tableChild;
              }
            }
          }

          this.tableData = _.orderBy(this.tableData, ['totalCount'], ['desc']);
        })
        .catch(error => {
          this.loading = false;
          if (error.errorMessage) {
            this.$message.warning(error.errorMessage);
          }
        });
    },
    getChildFlg(name) {
      for (const item of this.tableData) {
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
    getCityTable(name) {
      let table = [];
      for (const item of this.tableData) {
        if (item.name === name) {
          if (item.children) {
            for (const child of item.children) {
              table.push({
                name: child.name,
                count: child.count,
                totalCount: child.totalCount,
                netCount: child.netCount
              });
            }
          } else {
            table.push({
              name: item.name,
              count: item.count,
              totalCount: item.totalCount,
              netCount: item.netCount
            });
          }
        }
      }
      this.tableData = table;
    },
    buttonClick() {
      if (this.level === '2') {
        this.level = '1';
        this.tableData = [];
        this.getTabelData();
        this.showBackButton = false;
      } else if (this.level === '3') {
        this.level = '2';
        this.showMap = true;
        this.showMapChart = false;
        this.getTabelData(this.provinceName);
      } else {
      }
    },
    getShopList() {
      let param = {};
      if (this.getUser().roleLevel === 'shop') {
        this.conditionData.shopsList = [this.getUser().shop || ''];
        this.checkedShops.push(this.conditionData.shopsList[0].id);
      } else {
        http
          .get(urls.staticAnalisisi.vehicleShopList, param)
          .then(data => {
            this.conditionData.shopsList = data.stores;
            this.checkedShops.push(this.conditionData.shopsList[0].id);
          })
          .catch(errData => {
            if (errData.errorMessage) {
              this.$message.warning(errData.errorMessage);
            }
          });
      }
      this.getBrandsList();
    }
  },
  created() {
    this.getShopList();
  }
};
</script>

<style lang="scss">
.vehicle-static-analisis {
  height: 100%;
  overflow: auto;
  .el-table__body-wrapper {
    overflow: auto;
  }
  .geographical-filter {
    margin-left: 10px;
    display: flex;
    align-items: center;
    .filter-label {
      white-space: nowrap;
      margin-right: 5px;
      font-size: 14px;
      color: #606266;
    }
    .biz-select {
      margin-right: 10px;
      .el-select {
        width: 100px;
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
  .showSeriesHide {
    height: 55px;
    overflow-y: hidden;
  }
  .terminal-type {
    display: -webkit-box;
    .el-checkbox-button {
      margin: 10px 5px;
    }
    .el-checkbox-button__inner {
      padding: 10px;
      font-size: 12px;
    }
    .title {
      padding: 20px 10px;
      font-size: 12px;
      height: 100%;
    }
    .hardShopGroup {
      display: flex;
    }
    .hardGroup {
      display: flex;
    }
    .hardSeriesGroup {
      display: flex;
    }
  }
  .el-button--text {
    margin-left: auto !important;
    margin-right: 100px;
  }
  .noexpand {
    .el-table__expand-icon {
      visibility: hidden;
    }
  }

  .class-mgmt-tabel {
    .el-table__expanded-cell[class*='cell'] {
      padding: 10px 0 10px 50px;
    }
  }
  .first-children-name {
    .el-table__expand-icon {
      display: none;
    }
  }
}
</style>
