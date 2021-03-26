<template>
  <div class="vehicletype-distribution">
     <biz-chart :chartData="chartData" :loading="loading" :pagination="pagination" :showViewType="false"
      @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange" @refreshHandle="refreshHandle" @exportExcle="exportExcle">
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
          <div class="title">车系种类：</div>
          <el-checkbox-button v-model="checkAllVehicle" @change="handleCheckAllVehicle" :indeterminate="isIndeterminateVehicle">全选</el-checkbox-button>
          <el-checkbox-group v-model="checkedVehicle" @change="vehicleChange">
            <el-checkbox-button v-for="(condition,index) in conditionData.vehiclelList" :label="condition.id.toString()" :key="index" size="mini">{{condition.name}}</el-checkbox-button>
          </el-checkbox-group>
        </div>
        <div class="terminal-type" v-show="show&&conditionData.channelList.length>0">
          <div class="title">终端种类：</div>
          <el-checkbox-button v-model="checkAllChannel" @change="handleCheckAllChannel" :indeterminate="isIndeterminate">全选</el-checkbox-button>
          <el-checkbox-group v-model="checkedChannel" @change="conditionChange">
            <el-checkbox-button v-for="(condition,index) in conditionData.channelList" :label="condition.id.toString()" :key="index" size="mini">{{condition.name}}</el-checkbox-button>
          </el-checkbox-group>
        </div>
        <div class="swich"><i :class="className" @click="swich"></i></div>
      </div>
      <div slot="list">
        <el-radio-group v-model="vehicleType"  @change="onChangeVehicle">
          <el-radio-button label="按车系"></el-radio-button>
          <el-radio-button label="按终端"></el-radio-button>
        </el-radio-group>
        <biz-list ref="list" :height="height" :tableData="tableData" style="width: 100%" v-if="vehicleType==='按车系'">
          <el-table-column prop="terminalType" label="车型">
          </el-table-column>
          <el-table-column prop="terminalCount" label="会员车量数">
          </el-table-column>
          <el-table-column prop="terminalActiveCount" label="终端安装数">
          </el-table-column>
          <el-table-column prop="terminalType" label="终端启用数">
          </el-table-column>
          <el-table-column prop="terminalCount" label="终端安装数/车型比例">
          </el-table-column>
          <el-table-column prop="terminalActiveCount" label="终端启用/车型比例">
          </el-table-column>
        </biz-list>
        <biz-list ref="list" :height="height" :tableData="tableDataTerminal" style="width: 100%" v-if="vehicleType==='按终端'">
          <el-table-column prop="terminalType" label="车型">
          </el-table-column>
          <el-table-column prop="terminalCount" label="会员车型数">
          </el-table-column>
          <el-table-column prop="terminalActiveCount" label="安装终端类型">
          </el-table-column>
          <el-table-column prop="terminalType" label="终端安装数">
          </el-table-column>
          <el-table-column prop="terminalCount" label="终端启用数">
          </el-table-column>
          <el-table-column prop="terminalActiveCount" label="终端启用/车型比例">
          </el-table-column>
        </biz-list>
      </div>
      <div slot="description">
        <p>1、会员车型数：统计期内，取自店铺内所有会员名下车辆，按照车型分布统计的数量</p>
        <p>2、终端安装数：对应车型中，安装终端的数量，数据需要按终端类型统计</p>
        <p>3、终端启用数：对应车型中，有安装终端的数量。此处取统计期内，有效终端数对应安装的车型信息（有效终端数：在统计期开始的前30天内[30]，后天有产生过数据的设备。上传过GPS数据/轨迹数据/其他车辆数据等）</p>
        <p>4、终端安装数/车型比例=会员车量数/终端安装数*100%</p>
        <p>3、终端启用/车型比例=终端启用数/终端安装数*100%</p>
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
  name: 'vehicletype-distribution',
  data() {
    return {
      loading: false,
      vehicleType: '按车系',
      chartData: {},
      companyList: [],
      companyId: '',
      shopId: '全部',
      shopList: [],
      show: false,
      className: 'el-icon-caret-bottom',
      isIndeterminate: true,
      isIndeterminateVehicle: true,
      checkAllChannel: true,
      checkAllVehicle: true,
      height: '500',
      tableData: [],
      tableDataTerminal: [],
      beginDate: dateTime.getPreThreeMonthDay(),
      endDate: dateTime.today(),
      viewType: 'month',
      checkedChannel: [],
      checkedVehicle: [],
      conditionData: {
        channelList: [],
        vehicleList: []
      },
      pagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        total: 0
      },
      kpiName: ['日期', '终端启用数', '环比启用数']
    };
  },
  props: {},
  components: {
    BizChart,
    BizList
  },
  computed: {
    ...mapGetters(['getUser'])
  },
  methods: {
    onChangeVehicle(val) {
      console.log('val', val);
    },
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
    handleCheckAllVehicle(val) {
      this.checkedVehicle = val
        ? this.conditionData.vehicleList.map(item => {
          return item.id.toString();
        })
        : [];
      this.refreshData();
    },
    swich() {
      this.show = this.className === 'el-icon-caret-bottom';
      this.className = this.className === 'el-icon-caret-bottom' ? 'el-icon-caret-top' : 'el-icon-caret-bottom';
    },
    conditionChange(val) {
      console.log(val);
      let checkedCount = val.length;
      this.checkAllChannel = checkedCount === this.conditionData.channelList.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.conditionData.channelList.length;
      this.refreshData();
    },
    vehicleChange(val) {
      console.log(val);
      let checkedCount = val.length;
      this.checkAllVehicle = checkedCount === this.conditionData.vehicleList.length;
      this.isIndeterminateVehicle = checkedCount > 0 && checkedCount < this.conditionData.vehicleList.length;
      this.refreshData();
    },
    handleSizeChange(val) {
      this.pagination.pageSize = val;
      this.getTabelData();
    },
    handleCurrentChange(val) {
      this.pagination.currentPage = val;
      this.getTabelData();
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
        pageSize: this.pagination.pageSize.toString(),
        pageNumber: this.pagination.currentPage.toString(),
        viewType: this.viewType,
        terminalTypes: this.checkedChannel
      };
      return param;
    },
    async exportExcle() {
      let params = this.getParams();
      try {
        let response = await axios.post(urls.terminalMgmt.trendExport, params, { responseType: 'blob' });
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
        .get(urls.terminalMgmt.terminalTypeList, param)
        // .get('http://192.168.50.120:3000/mock/11/admin/ecommerce/kpi/condition/terminal/trend.jhtml', param)
        .then(data => {
          console.log('趋势', data);
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
        .post(urls.terminalMgmt.trendGraphData, param)
        // .post('http://192.168.50.120:3000/mock/11/admin/ecommerce/kpi/graph/terminal/trend.jhtml', param)
        .then(data => {
          console.log('趋势图表数据', data);
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
      this.kpiName = [];
      for (let i = 0; i < data.indicators.length; i++) {
        tmpData.push({
          日期: data.indicators[i].xValue,
          会员车型数: data.indicators[i].y[0].yValue,
          终端启用数: data.indicators[i].y[0].yMonthOnMonth
        });
      }
      this.kpiName = ['日期', '会员车型数', '终端启用数'];
      let chartData = {
        type: 'histogram',
        data: {
          columns: this.kpiName,
          rows: tmpData
        },
        settings: {
          showLine: [this.kpiName[2]],
          yAxisName: '个'
        }
      };
      return chartData;
    },
    getTabelData() {
      this.loading = true;
      let param = this.getParams();
      http
        .post(urls.terminalMgmt.trendTabelData, param)
        // .post('http://192.168.50.120:3000/mock/11/admin/ecommerce/kpi/table/terminal/trend.jhtml', param)
        .then(data => {
          console.log('趋势表格', data);
          this.loading = false;
          this.tableData = data.dataList;
          this.pagination.total = Number(data.total);
        })
        .catch(error => {
          this.loading = false;
          if (error.errorMessage) {
            this.$message.warning(error.errorMessage);
          }
        });
    },
    refreshData() {
      this.getGraphData();
      this.getTabelData();
    },
    getCompanyList() {
      http
        .get(urls.terminalMgmt.Component_queryOperators)
        .then(data => {
          console.log('运营商', data);
          this.companyList = [];
          if (data.content.length) {
            this.companyList.push({ label: '全部', value: '' });
            this.companyId = '全部';
            data.content.forEach(element => {
              this.companyList.push({ label: element.name, value: element.id });
            });
            console.log('111', this.companyList);
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
          console.log('店铺', data);
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
    }
  },
  created() {
    this.getTerminalTypeList();
    this.getCompanyList();
  }
};
</script>

<style lang="scss">
.vehicletype-distribution {
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
  }
  .terminal-type {
    display: -webkit-box;
    .el-checkbox-button {
      padding: 15px;
    }
    .el-checkbox-button__inner {
      padding: 10px;
      font-size: 12px;
    }
    .title {
      padding: 20px 10px;
      font-size: 12px;
    }
  }
}
</style>
