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
      <el-checkbox-button v-model="checkAllShops" @change="handleCheckAllShops" :indeterminate="isIndeterminateShops">全部
      </el-checkbox-button>
      <el-checkbox-group :min="1" v-model="checkedShops" @change="shopsChange">
        <el-checkbox-button v-for="(item,index) in conditionData.shopsList" :label="item.id" :key="index" size="mini">
          {{item.name}}</el-checkbox-button>
      </el-checkbox-group>
    </div> -->
    <div class="indicators-search">
      <div class="title">终端类型</div>
      <div class="hardShopGroup" :class="{'showHideShop' : showHideShop}" ref="shopGroup">
        <el-checkbox-button v-model="checkAllTerminal" @change="handleCheckAllTerminal" :indeterminate="isIndeterminate">全部
        </el-checkbox-button>
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
      <div class="function-type" v-if="indicatorValue==='2'">
          <div v-for="(item, index) in functionList" :key="index" class="container" v-show="showHide || index === 0">
            <div class="title">{{item.name}}：</div>
            <div class="vehicleGroup">
              <el-checkbox-button v-model="checkAllFunction[index]" @change="handleCheckAllFunction($event, index)" :indeterminate="isIndeterminateVe[index]">全选</el-checkbox-button>
              <el-checkbox-group v-model="checkedVehicleFunction" @change="functionChange">
                <el-checkbox-button v-for="(condition,index) in item.capacityData" :label="condition.name.toString()" :key="index" size="mini">{{condition.name}}</el-checkbox-button>
              </el-checkbox-group>
            </div>
          </div>
          <div class="swich" v-if="functionList.length"><i :class="className" @click="swich"></i></div>
        </div>
    <div class="chart-area">
      <div class="graph">
        <div class="filterSeach">
          <div class="filter-area">
            <el-radio-group @change="indicatorChanged" v-model="indicatorValue" size="mini">
              <el-radio-button label="0">TOP10</el-radio-button>
              <el-radio-button label="1">LAST10</el-radio-button>
              <el-radio-button label="2">时间</el-radio-button>
            </el-radio-group>
          </div>
          <div class="type-range">
            <el-radio-group v-model="radioValue" size="mini">
              <el-radio-button label="0">视图</el-radio-button>
              <el-radio-button label="1">列表</el-radio-button>
            </el-radio-group>
          </div>
        </div>
        <biz-chart :chartData="chartDataOfClass" :loading="loading" :showSearch="false"
          v-if="radioValue==='0'&&indicatorValue!=='2'"></biz-chart>
        <biz-chart :chartData="chartDataOfTime" :loading="loading" :showSearch="false"
          v-if="radioValue==='0'&&indicatorValue==='2'"></biz-chart>
        <biz-list ref="list" :height="height" :tableData="tableData" style="width: 100%"
          v-show="radioValue==='1'&&indicatorValue!=='2'">
          <el-table-column prop="terminalType" label="功能点">
          </el-table-column>
          <el-table-column prop="terminalActiveCount" label="功能启用数">
          </el-table-column>
          <el-table-column prop="terminalActiveCountM" label="环比启用数">
          </el-table-column>
        </biz-list>
        <biz-list ref="list" :height="height" :tableData="tableData" style="width: 100%"
          v-show="radioValue==='1'&&indicatorValue==='2'">
          <el-table-column prop="messageType" label="时间段">
          </el-table-column>
          <el-table-column prop="0-7" label="0-7">
          </el-table-column>
          <el-table-column prop="8-10" label="8-10">
          </el-table-column>
          <el-table-column prop="11-16" label="11-16">
          </el-table-column>
          <el-table-column prop="17-20" label="17-20">
          </el-table-column>
          <el-table-column prop="20-24" label="20-24">
          </el-table-column>
          <el-table-column prop="count" label="小计">
          </el-table-column>
        </biz-list>
        <biz-pagination :pagination="pagination" @size-change="handleSizeChange" @current-change="handleCurrentChange"
          v-show="radioValue==='1'"></biz-pagination>
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
      taskId: '',
      t: '',
      percentage: 0,
      intervalTimes: ['0-7', '8-10', '11-16', '17-20', '20-24'],
      functionList: [],
      checkAllFunction: [],
      checkedVehicleFunction: [],
      isIndeterminateVe: [],
      tableData: [],
      showRecommend: false,
      chartDataOfClass: {},
      chartDataOfTime: {},
      chartData: {},
      isShow: 'false',
      hardGroupHeight: 0,
      hardGroupHeight1: 0,
      showSwich: true,
      showSwichSeries: false,
      showHide: false,
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
      isIndeterminateShops: true,
      checkAllShops: false,
      checkedShops: [],
      checkedTerminal: [],
      checkAllTerminal: true,
      isIndeterminate: true,
      showHideShop: false,
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
  watch: {
    checkedTerminal(newValue) {
      if (newValue) {
        this.getBaseFunction();
      }
    },
    checkAllFunction(newValue, oldValue) {
      // if (newValue) {
      //   if (this.checkedVehicleFunction.length > 10) {
      //     this.$message.warning('选择的功能数必须<=10');
      //     this.checkAllFunction = oldValue;
      //   }
      // }
    },
    checkedVehicleFunction(newValue, oldValue) {
      if (newValue) {
        // if (newValue.length > 10) {
        //   this.$message.warning('选择的功能数必须<=10');
        //   this.checkedVehicleFunction = oldValue;
        // }
      }
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
      if (this.indicatorValue === '0') {
        this.getGraphData();
        this.getTable();
      } else if (this.indicatorValue === '1') {
        this.getGraphLastData();
        this.getTableLast();
      } else {
        this.getGraphTimeData();
        this.getTableTime();
      }
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
    handleCheckAllFunction(val, index) {
      // if (val && this.functionList[index].capacityData.length + this.checkedVehicleFunction.length > 10) {
      //   this.$message.warning('选择的功能数必须<=10');
      //   this.checkAllFunction[index] = false;
      //   return;
      // }
      this.selectFunctionByIndex(val, index);
      this.query();
    },
    selectFunctionByIndex(val, index) {
      this.functionList[index].capacityData.forEach(item => {
        if (val) {
          if (!this.checkedVehicleFunction.includes(item.name)) {
            this.checkedVehicleFunction.push(item.name);
          }
        } else {
          if (this.checkedVehicleFunction.includes(item.name)) {
            this.checkedVehicleFunction.forEach((element, _index) => {
              if (element === item.name) {
                this.checkedVehicleFunction.splice(_index, 1);
              }
            });
          }
        }
      });
    },
    getBaseFunction() {
      let url = '/admin/terminal/queryAbilitiesByTerminalTypes.jhtml?';
      this.curCheckedChannel.forEach((item, index) => {
        if (index !== this.curCheckedChannel.length - 1) {
          url += 'terminalTypes=' + item + '&';
        } else {
          url += 'terminalTypes=' + item;
        }
      });
      http
        .get(url)
        .then(data => {
          this.checkedVehicleFunction = [];
          this.functionList = data.dataList;
          this.checkAllFunction = [];
          this.functionList.forEach((item, index) => {
            let isIndeterminate = false;
            this.isIndeterminateVe.push(isIndeterminate);
            if (index === 0) {
              this.checkAllFunction.push(false);
              this.selectFunctionByIndex(false, 0);
              this.refreshData();
            } else {
              this.checkAllFunction.push(false);
            }
          });
        })
        .catch(error => {
          if (error.errorMessage) {
            console.log(error.errorMessage);
          }
        });
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
            this.checkedTerminal = this.conditionData.terminalList
              ? this.conditionData.terminalList.map(item => {
                return item.id.toString();
              })
              : [];
          }
          this.query();
          this.getBaseFunction();
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
        this.getTable();
      } else if (this.indicatorValue === '1') {
        this.getGraphLastData();
        this.getTableLast();
      } else {
        this.getGraphTimeData();
        this.getTableTime();
      }
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
        .post('/admin/ecommerce/kpi/graph/terminal/topX.jhtml', params)
        .then(data => {
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
    getGraphLastData() {
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
        .post('/admin/ecommerce/kpi/graph/terminal/lastX.jhtml', params)
        .then(data => {
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
    getGraphTimeData() {
      this.loading = true;
      let params = {
        beginDate: this.beginDate,
        endDate: this.endDate,
        viewType: this.viewType,
        terminalTypes: this.curCheckedChannel,
        features: this.checkedVehicleFunction,
        intervalTimes: this.intervalTimes,
        shopId: this.params.shopId || undefined,
        companyId: this.params.companyId || undefined
      };
      http
        .post('/admin/ecommerce/kpi/graph/terminal/time.jhtml', params)
        .then(data => {
          this.chartDataOfTime = this.dataFormatTime(data);
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
        terminalTypes: this.checkedTerminal,
        viewType: this.viewType,
        beginDate: this.beginDate,
        endDate: this.endDate,
        pageSize: this.pagination.pageSize,
        pageNumber: this.pagination.currentPage,
        shopId: this.params.shopId || undefined,
        companyId: this.params.companyId || undefined
      };
      http
        .post('/admin/ecommerce/kpi/table/terminal/topX.jhtml', params)
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
    getTableLast() {
      let params = {
        terminalTypes: this.checkedTerminal,
        viewType: this.viewType,
        beginDate: this.beginDate,
        endDate: this.endDate,
        pageSize: this.pagination.pageSize,
        pageNumber: this.pagination.currentPage,
        shopId: this.params.shopId || undefined,
        companyId: this.params.companyId || undefined
      };
      http
        .post('/admin/ecommerce/kpi/table/terminal/lastX.jhtml', params)
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
    getTableTime() {
      let params = {
        beginDate: this.beginDate,
        endDate: this.endDate,
        viewType: this.viewType,
        terminalTypes: this.curCheckedChannel,
        features: this.checkedVehicleFunction,
        intervalTimes: this.intervalTimes,
        pageSize: this.pagination.pageSize,
        pageNumber: this.pagination.currentPage,
        shopId: this.params.shopId || undefined,
        companyId: this.params.companyId || undefined
      };
      http
        .post('/admin/ecommerce/kpi/table/terminal/time.jhtml', params)
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
        intervalTimes: this.intervalTimes,
        features: this.checkedVehicleFunction,
        viewType: this.viewType,
        beginDate: this.beginDate,
        endDate: this.endDate,
        pageSize: this.pagination.pageSize,
        pageNumber: this.pagination.currentPage,
        shopId: this.params.shopId || undefined,
        companyId: this.params.companyId || undefined
      };
      let url = '/admin/ecommerce/kpi/export/terminal/topX/exportStart.jhtml';
      if (this.indicatorValue === '0') {
        url = '/admin/ecommerce/kpi/export/terminal/topX/exportStart.jhtml';
      } else if (this.indicatorValue === '1') {
        url = '/admin/ecommerce/kpi/export/terminal/lastX/exportStart.jhtml';
      } else {
        url = '/admin/ecommerce/kpi/export/terminal/time/exportStart.jhtml';
      }
      http
        .post(url, params)
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
      let url = '/admin/ecommerce/kpi/export/terminal/topX/exportResult.jhtml?taskId=' + this.taskId;
      if (this.indicatorValue === '0') {
        url = '/admin/ecommerce/kpi/export/terminal/topX/exportResult.jhtml?taskId=' + this.taskId;
      } else if (this.indicatorValue === '1') {
        url = '/admin/ecommerce/kpi/export/terminal/lastX/exportResult.jhtml?taskId=' + this.taskId;
      } else {
        url = '/admin/ecommerce/kpi/export/terminal/time/exportResult.jhtml?taskId=' + this.taskId;
      }
      try {
        let response = await axios.get(url, { responseType: 'blob' });
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
      this.showHide = !this.showHide;
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
    functionChange(val) {
      this.query();
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
      this.kpiName = [];
      for (let i = 0; i < data.indicators.length; i++) {
        tmpData.push({
          日期: data.indicators[i].xValue,
          功能启用数: data.indicators[i].y[0].yValue,
          同比: data.indicators[i].y[0].yoyRate,
          环比: data.indicators[i].y[0].momRate
        });
      }
      this.kpiName = ['日期', '功能启用数', '同比', '环比'];
      let chartData = {
        type: 'histogram',
        data: {
          columns: this.kpiName,
          rows: tmpData
        },
        settings: {
          axisSite: { right: ['同比', '环比'] },
          yAxisType: ['KMB', 'KMB'],
          yAxisName: ['', '%'],
          rotate: '45',
          interval: 'auto',
          showLine: [this.kpiName[2], this.kpiName[3]]
        }
      };
      return chartData;
    },
    dataFormatTime(data) {
      let tmpData = [];
      if (data.indicators.length) {
        let obj;
        for (let i = 0; i < data.indicators[0].y.length; i++) {
          for (let j = 0; j < data.indicators[0].y.length; j++) {
            if (i === j) {
              obj = {};
              obj['时间段'] = data.indicators[0].y[j].indicator;
              tmpData.push(obj);
              break;
            }
          }
        }
        tmpData.forEach((item, index) => {
          data.indicators.forEach(element => {
            item[element.xValue] = element.y[index].yValue;
          });
        });
      }
      let chartData = {
        type: 'histogram',
        data: {
          columns: [],
          rows: tmpData
        },
        settings: {
          stack: {
            user: []
          }
        }
      };
      let arr = ['时间段'];
      chartData.data.columns = arr.concat(this.checkedVehicleFunction);
      chartData.settings.stack.user = this.checkedVehicleFunction;
      console.log('chartData', chartData);
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
    curCheckedChannel() {
      let ary;
      if (this.checkedTerminal.length) {
        ary = this.checkedTerminal;
      } else {
        ary = this.conditionData.terminalList.map(item => {
          return item.id;
        });
      }
      return ary;
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
@mixin butStyle {
  .el-checkbox-button {
    padding: 5px;
  }
  .el-checkbox-button__inner {
    padding: 10px;
    font-size: 12px;
  }
  .title {
    padding: 13px 10px;
    font-size: 12px;
    height: 100%;
  }
}
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
  .function-type{
    @include butStyle;
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
    .container{
      display: -webkit-box;
      border-bottom: 1px solid #ebeef5;
      .vehicleGroup{
        display: flex;
      }
    }
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
