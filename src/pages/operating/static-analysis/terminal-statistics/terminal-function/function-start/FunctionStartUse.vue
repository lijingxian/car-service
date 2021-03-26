<template>
  <div class="function-start-use">
     <biz-chart :chartData="chartData" :loading="loading" :axisLabelRotate='axisLabelRotate' :showPagination="false" :showViewType="false" @refreshHandle="refreshHandle" @exportExcle="exportExcle">
      <div slot="extraContent" v-if="getUser.roleLevel !== 'shop'">
        <div class="trend-filter">
          <label class="filter-label">运营商</label>
          <div class="biz-select">
            <el-select v-model="companyId" size="small" @change="companChange">
              <el-option v-for="(company,index) in companyList" :key="index" :label="company.label" :value="company.value"></el-option>
            </el-select>
          </div>
          <label class="filter-label">店铺</label>
          <div class="biz-select">
            <el-select v-model="shopId" size="small" @change="shopChange">
              <el-option v-for="(shop,index) in shopList" :key="index" :label="shop.label" :value="shop.value"></el-option>
            </el-select>
          </div>
        </div>
      </div>
      <div slot="indicators">
        <div class="terminal-type">
          <div class="title">终端种类：</div>
          <div class="hardGroup">
            <el-checkbox-button v-model="checkAllChannel" @change="handleCheckAllChannel" :indeterminate="isIndeterminate">全选</el-checkbox-button>
            <el-checkbox-group v-model="checkedChannel" @change="conditionChange">
              <el-checkbox-button v-for="(condition,index) in conditionData.channelList" :label="condition.id.toString()" :key="index" size="mini">{{condition.name}}</el-checkbox-button>
            </el-checkbox-group>
          </div>
        </div>
        <div class="function-type">
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
      </div>
      <div slot="list">
        <biz-list ref="list" :height="height" :tableData="tableData" style="width: 100%">
          <el-table-column prop="terminalType" label="功能点">
          </el-table-column>
          <el-table-column prop="terminalActiveCount" label="功能启用次数">
          </el-table-column>
          <el-table-column prop="terminalActiveCountM" label="环比启用次数">
          </el-table-column>
        </biz-list>
      </div>
      <div slot="description">
        <p>1、功能启用次数：统计期内，选取的功能被启用的次数（即在统计期内有有上报、且计上报数据的次数。）。重复启用则多次计数</p>
        <p>2、环比启用次数：环比数据：即所选统计期（如2018年N月）与上一个连续统计期（如2017年N-1月）的数据比</p>
      </div>
    </biz-chart>
  </div>
</template>

<script>
import BizChart from '@/components/BizChart';
import BizList from '@/components/BizTable/BizList';
import dateTime from '@/utils/dateTime';
import http from '@/common/http';
import urls from '@/common/urls';
import axios from 'axios';
import { mapGetters } from 'vuex';

export default {
  name: 'function-start-use',
  data() {
    return {
      loading: false,
      axisLabelRotate: 0,
      functionList: [],
      checkAllFunction: [],
      checkedVehicleFunction: [],
      isIndeterminateVe: [],
      chartData: {},
      companyList: [],
      companyId: '',
      showHide: false,
      showVehicleSwich: false,
      shopId: '全部',
      shopList: [],
      show: false,
      className: 'el-icon-caret-bottom',
      vehicleClassName: 'el-icon-caret-bottom',
      isIndeterminate: true,
      checkAllChannel: true,
      checkAllVehicle: true,
      height: '500',
      tableData: [],
      beginDate: dateTime.getPreThreeMonthDay(),
      endDate: dateTime.today(),
      viewType: 'month',
      checkedChannel: [],
      checkedVehicle: [],
      conditionData: {
        channelList: []
      },
      kpiName: ['日期', '终端启用次数', '环比启用次数']
    };
  },
  props: {},
  components: {
    BizChart,
    BizList
  },
  computed: {
    ...mapGetters(['getUser']),
    curCheckedChannel() {
      let ary;
      if (this.checkedChannel.length) {
        ary = this.checkedChannel;
      } else {
        ary = this.conditionData.channelList.map(item => {
          return item.id;
        });
      }
      return ary;
    }
  },
  watch: {
    checkedChannel(newValue) {
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
        if (newValue.length > 5) {
          this.axisLabelRotate = 45;
          // if (newValue.length > 10) {
          //   this.$message.warning('选择的功能数必须<=10');
          //   this.checkedVehicleFunction = oldValue;
          // }
        } else {
          this.axisLabelRotate = 0;
        }
      }
    }
  },
  methods: {
    companChange(val) {
      this.companyId = val;
      this.refreshData();
      this.getShopList();
    },
    shopChange(val) {
      this.shopId = val;
      this.refreshData();
    },
    handleCheckAllChannel(val) {
      this.checkedChannel = val
        ? this.conditionData.channelList.map(item => {
          return item.id.toString();
        })
        : [];
      this.refreshData();
    },
    handleCheckAllFunction(val, index) {
      // if (val && this.functionList[index].capacityData.length + this.checkedVehicleFunction.length > 10) {
      //   this.$message.warning('选择的功能数必须<=10');
      //   this.checkAllFunction[index] = false;
      //   return;
      // }
      this.selectFunctionByIndex(val, index);
      this.refreshData();
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
    functionChange(val) {
      this.refreshData();
    },
    swich() {
      this.className = this.className === 'el-icon-caret-bottom' ? 'el-icon-caret-top' : 'el-icon-caret-bottom';
      this.showHide = !this.showHide;
    },
    conditionChange(val) {
      console.log(val);
      let checkedCount = val.length;
      this.checkAllChannel = checkedCount === this.conditionData.channelList.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.conditionData.channelList.length;
      this.refreshData();
    },
    refreshHandle(val) {
      this.viewType = val.viewType;
      this.beginDate = val.date[0];
      this.endDate = val.date[1];
      this.refreshData();
    },
    getParams() {
      let param = {
        companyId: this.companyId !== '全部' ? this.companyId : undefined,
        shopId: this.shopId !== '全部' ? this.shopId : undefined,
        beginDate: this.beginDate,
        endDate: this.endDate,
        viewType: this.viewType,
        terminalTypes: this.curCheckedChannel,
        features: this.checkedVehicleFunction
      };
      return param;
    },
    async exportExcle() {
      let params = this.getParams();
      try {
        let response = await axios.post(urls.terminalMgmt.functionExport, params, { responseType: 'blob' });
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
        return;
      } catch (error) {
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
    getTerminalTypeList() {
      this.loading = true;
      let param = {
        shopId: window.top.SHOP_ID || ''
      };
      http
        .get(urls.terminalMgmt.functionCondition, param)
        .then(data => {
          this.loading = false;
          this.conditionData.channelList = data.terminalTypeList;
          this.handleCheckAllChannel(true);
        })
        .catch(error => {
          this.loading = false;
          if (error.errorMessage) {
            this.$message.warning(error.errorMessage);
          }
        });
    },
    getGraphData() {
      this.loading = true;
      let param = this.getParams();
      http
        .post(urls.terminalMgmt.functionGraph, param)
        .then(data => {
          this.loading = false;
          this.chartData = this.dataFormat(data);
        })
        .catch(error => {
          this.loading = false;
          if (error.errorMessage) {
            this.$message.warning(error.errorMessage);
          }
        });
    },
    dataFormat(data) {
      let tmpData = [];
      for (let i = 0; i < data.indicators.length; i++) {
        tmpData.push({
          日期: data.indicators[i].xValue,
          终端启用次数: data.indicators[i].y[0].yValue,
          环比启用次数: data.indicators[i].y[0].yMonthOnMonth
        });
      }
      let chartData = {
        type: 'histogram',
        data: {
          columns: this.kpiName,
          rows: tmpData
        },
        settings: {
          showLine: [this.kpiName[2]],
          yAxisName: '次'
        }
      };
      return chartData;
    },
    getTabelData() {
      this.loading = true;
      let param = this.getParams();
      http
        .post(urls.terminalMgmt.functionTabel, param)
        .then(data => {
          this.loading = false;
          this.tableData = data.dataList;
        })
        .catch(error => {
          this.loading = false;
          if (error.errorMessage) {
            this.$message.warning(error.errorMessage);
          }
        });
    },
    refreshData() {
      if (this.checkedVehicleFunction.length) {
        this.getGraphData();
        this.getTabelData();
      } else {
        this.chartData = {};
        this.tableData = [];
      }
    },
    getCompanyList() {
      http
        .get(urls.terminalMgmt.Component_queryOperators)
        .then(data => {
          this.companyList = [];
          if (data.content.length) {
            this.companyList.push({ label: '全部', value: '' });
            this.companyId = '全部';
            data.content.forEach(element => {
              this.companyList.push({ label: element.name, value: element.id });
            });
          }
        })
        .catch(error => {
          if (error.errorMessage) {
            this.$message.warning(error.errorMessage);
          }
        });
    },
    getShopList() {
      let param = {
        companyId: this.companyId
      };
      http
        .get(urls.terminalMgmt.BaseInfo_queryShopList, param)
        .then(data => {
          this.shopList = [];
          this.shopId = '全部';
          if (data.shopDatas.length) {
            this.shopList.push({ label: '全部', value: '' });
            data.shopDatas.forEach(element => {
              this.shopList.push({ label: element.name, value: element.id });
            });
          }
        })
        .catch(error => {
          if (error.errorMessage) {
            this.$message.warning(error.errorMessage);
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
          this.functionList.forEach((item, index) => {
            let isIndeterminate = true;
            this.isIndeterminateVe.push(isIndeterminate);
            if (index === 0) {
              this.checkAllFunction.push(true);
              this.selectFunctionByIndex(true, 0);
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
    }
  },
  created() {
    this.getTerminalTypeList();
    this.getCompanyList();
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
.function-start-use {
  height: 100%;
  overflow: auto;
  .trend-filter{
    margin-left: 10px;
    display: flex;
    align-items: center;
    .filter-label{
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
  .function-type{
    @include butStyle;
    .container{
      display: -webkit-box;
      border-bottom: 1px solid #ebeef5;
      .vehicleGroup{
        display: flex;
      }
    }
  }
  .terminal-type {
    display: -webkit-box;
    border-bottom: 1px solid #ebeef5;
    @include butStyle;
    .hardGroup, .vehicleGroup{
      display: flex;
    }
  }
}
</style>
