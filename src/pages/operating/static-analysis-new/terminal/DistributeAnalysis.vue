<template>
  <div class="terminal-distribute-analysis">
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
    <!-- <div class="indicators-search">
      <div class="title">店铺</div>
      <el-checkbox-button v-model="checkAllShops" @change="handleCheckAllShops" :indeterminate="isIndeterminateShops">全部</el-checkbox-button>
      <el-checkbox-group :min="1" v-model="checkedShops" @change="shopsChange">
        <el-checkbox-button v-for="(item,index) in conditionData.shopsList" :label="item.id" :key="index" size="mini">{{item.name}}</el-checkbox-button>
      </el-checkbox-group>
    </div> -->
    <div class="indicators-search">
      <div class="title">终端类型</div>
      <div class="hardShopGroup" :class="{'showHideShop' : showHideShop}" ref="shopGroup">
        <el-checkbox-button v-model="checkAllTerminal" @change="handleCheckAllTerminal" :indeterminate="isIndeterminate">全部</el-checkbox-button>
        <el-tooltip placement="bottom" v-for="(item, index) in conditionData.terminalList" :key="index" :disabled="item.name.length<=10">
          <el-checkbox-group v-model="checkedTerminal" @change="conditionChange">
            <el-checkbox-button :label="item.id.toString()" size="mini">
              {{item.name.length>10?item.name.substr(0, 10)+'...':item.name}}
            </el-checkbox-button>
          </el-checkbox-group>
          <div slot="content">{{ item.name }}</div>
        </el-tooltip>
      </div>
    </div>
    <div class="chart-area">
      <div class="graph">
        <div class="filterSeach">
          <div class="filter-area">
            <el-radio-group @change="indicatorChanged" v-model="indicatorValue" size="mini">
              <el-radio-button label="0">终端分类</el-radio-button>
              <el-radio-button label="1">位置</el-radio-button>
            </el-radio-group>
          </div>
          <div class="type-range">
            <el-radio-group v-model="radioValue" size="mini">
              <el-radio-button label="0">视图</el-radio-button>
              <el-radio-button label="1">列表</el-radio-button>
            </el-radio-group>
          </div>
        </div>
        <div class="content" style="width:35%;float:right;line-height:40px;font-size: 13px" v-show="radioValue==='0'&&indicatorValue==='0'">
          <div v-for="(list,index) in channelLists" :key="index">
            <span :class="'list'+index">
              {{list.lable}}:{{list.value}}个
              占比{{countTotal!==0?((list.value/countTotal)*100).toFixed(2):list.value}}%
            </span>
          </div>
        </div>
         <biz-chart :chartData="chartDataOfClass" :loading="loading" :showSearch="false" v-if="radioValue==='0'&&indicatorValue==='0'"></biz-chart>
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
            v-if="radioValue==='0'&&indicatorValue==='1'"
          ></biz-chart>
        </div>
      <biz-list ref="list" :height="height" :tableData="tableData" style="width: 100%;height:100%" v-show="radioValue==='1'">
          <el-table-column prop="name" label="终端名称"></el-table-column>
          <el-table-column prop="number" label="产品序列号"></el-table-column>
          <el-table-column prop="terminalTypeName" label="终端类型"></el-table-column>
          <el-table-column prop="ownerName" label="所有者"></el-table-column>
          <el-table-column prop="bindCarPn" label="绑定车辆"></el-table-column>
          <el-table-column prop="hardVer" label="硬件版本"></el-table-column>
          <el-table-column prop="softVer" label="软件版本"></el-table-column>
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
import urls from '@/common/urls';
import axios from 'axios';
import { mapGetters } from 'vuex';
import vPinyin from '@/utils/vue-py';
import cityMap from '@/utils/map/china-main-city-map.js';
import echarts from 'echarts/lib/echarts';
import { ExportFileNew } from '@/components/BizUpload';

export default {
  name: 'ChannelAnalysis',
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
      showRecommend: false,
      chartDataOfClass: {},
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
      showHideShop: false,
      // indicator
      conditionData: [
        {
          channelList: [],
          brandList: [],
          seriesList: []
        }
      ],
      taskId: '',
      t: '',
      percentage: 0,
      channelLists: [],
      countTotal: 0,
      isIndeterminateShops: true,
      checkAllShops: false,
      checkedShops: [],
      checkedTerminal: [],
      checkAllTerminal: true,
      isIndeterminate: true,
      radioValue: '0',
      indicatorValue: '0',
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
      // this.getShopList();
      this.getTerminalTypeList();
    },
    query() {
      this.getGraphData();
      this.getGraphPositionData();
      this.getTable();
    },
    handleCheckAllShops(val) {
      if (val) {
        this.checkedShops = val
          ? this.conditionData.shopsList.map(item => {
            return item.id;
          })
          : [];
      } else {
        this.checkedShops = [];
        this.checkedShops.push(this.conditionData.shopsList[0].id);
      }
      this.getGraphData();
      this.getTable();
    },
    shopsChange(val) {
      let checkedCount = val.length;
      this.checkAllShops = checkedCount === this.conditionData.shopsList.length;
      this.isIndeterminateShops = checkedCount > 0 && checkedCount < this.conditionData.shopsList.length;
      this.getGraphData();
      this.getTable();
    },
    handleCheckAllTerminal(val) {
      this.checkedTerminal = val
        ? this.conditionData.terminalList.map(item => {
          return item.id.toString();
        })
        : [];
      this.getGraphData();
      this.getGraphPositionData();
      this.getTable();
    },
    conditionChange(value) {
      let checkedCount = value.length;
      this.checkAllTerminal = checkedCount === this.conditionData.terminalList.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.conditionData.terminalList.length;
      this.getGraphData();
      this.getTable();
    },
    getShopList() {
      let params = {
        shopId: window.top.SHOP_ID || ''
      };
      http
        .get(urls.membersMgmt.statisticsAnalysis.findEShops, params)
        .then(data => {
          let ary = [{ id: this.getUser.shop.id, name: this.getUser.shop.name }];
          let obj = {};
          obj.name = '联盟店铺';
          let shopIds = data.shops.filter(item => item.id !== this.getUser.shop.id);
          shopIds = shopIds.map(item => {
            return item.id;
          });
          obj.id = shopIds.toString();
          ary.push(obj);
          this.conditionData.shopsList = this.conditionData.shopsList.concat(ary);
          this.checkedShops.push(this.conditionData.shopsList[0].id);
        })
        .catch(errData => {
          if (errData.errorMessage) {
            this.$message.warning(errData.errorMessage);
          }
        });
    },
    getTerminalTypeList() {
      this.loading = true;
      let param = {
        shopId: window.top.SHOP_ID || ''
      };
      http
        .get(urls.terminalMgmt.areaTypeList, param)
        .then(data => {
          this.loading = false;
          this.conditionData.terminalList = data.terminalTypeList;
          if (this.params.checkedTerminal) {
            this.checkedTerminal = this.params.checkedTerminal;
          } else {
            this.checkedTerminal = this.conditionData.terminalList ? this.conditionData.terminalList.map(item => { return item.id.toString(); }) : [];
          }
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
      if (this.indicatorValue === '0') {
        this.getGraphData();
      } else {
        this.getGraphPositionData();
      }
      this.getTable();
    },
    getGraphData() {
      this.loading = true;
      let params = {
        terminalTypes: this.checkedTerminal,
        viewType: this.viewType,
        beginDate: this.beginDate,
        endDate: this.endDate,
        shopIds: this.checkedShops,
        shopId: this.params.shopId || undefined,
        companyId: this.params.companyId || undefined
      };
      http
        .post('/admin/ecommerce/kpi/graph/terminalTypeDistribute.jhtml', params)
        .then(data => {
          this.channelLists = data.indicators;
          for (const item of data.indicators) {
            this.countTotal += Number(item.value);
          }
          this.chartDataOfClass = this.dataFormat(data);
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
        shopIds: this.checkedShop,
        brands: this.checkedBrand,
        fleets: this.checkedBrand,
        beginDate: this.beginDate,
        endDate: this.endDate,
        shopId: this.params.shopId || undefined,
        companyId: this.params.companyId || undefined
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
        terminalTypes: this.checkedTerminal,
        viewType: this.viewType,
        beginDate: this.beginDate,
        endDate: this.endDate,
        pageSize: this.pagination.pageSize,
        pageNumber: this.pagination.currentPage
      };
      http
        .post('/admin/ecommerce/kpi/table/terminalDistribute.jhtml', params)
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
        terminalTypes: this.checkedTerminal,
        viewType: this.viewType,
        beginDate: this.beginDate,
        endDate: this.endDate,
        pageSize: this.pagination.pageSize,
        pageNumber: this.pagination.currentPage
      };
      http
        .post('/admin/ecommerce/kpi/export/terminalDistribute/exportStart.jhtml', params)
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
        let response = await axios.get('/admin/ecommerce/kpi/export/terminalDistribute/exportResult.jhtml?taskId=' + this.taskId, { responseType: 'blob' });
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
      this.getGraphPositionData();
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
    ShowSearchGrid,
    ExportFileNew
  }
};
</script>

<style lang="scss">
.terminal-distribute-analysis {
  height: 100%;
  overflow: auto;
  align-content: space-between;
  margin: 20px 0px 20px 20px;
  padding-bottom: 20px;
  padding-right: 10px;
  min-width: 560px;
  .indicators-search {
    display: flex;
    .title {
      width: 120px;
    }
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
    .hardShopGroup {
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
  .showHideShop {
    height: 55px;
    overflow-y: hidden;
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
