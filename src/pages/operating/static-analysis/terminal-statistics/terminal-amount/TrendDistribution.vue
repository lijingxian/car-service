<template>
  <div class="trend-distribution">
     <biz-chart :chartData="chartData" :loading="loading" :pagination="pagination" :showViewType="false" :axisLabelRotate='axisLabelRotate'
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
          <div class="title">终端种类：</div>
          <div class="hardGroup" :class="{'showHide' : showHide}">
            <el-checkbox-button v-model="checkAllChannel" @change="handleCheckAllChannel" :indeterminate="isIndeterminate">全选</el-checkbox-button>
            <el-checkbox-group v-model="checkedChannel" @change="conditionChange">
              <el-checkbox-button v-for="(condition,index) in conditionData.channelList" :label="condition.id.toString()" :key="index" size="mini">{{condition.name}}</el-checkbox-button>
            </el-checkbox-group>
          </div>
        </div>
        <div class="swich" v-if="showSwich"><i :class="className" @click="swich"></i></div>
      </div>
      <div slot="list">
        <biz-list ref="list" :height="height" :tableData="tableData" style="width: 100%">
          <el-table-column prop="terminalType" label="终端类型">
          </el-table-column>
          <el-table-column prop="terminalCount" label="终端总数">
          </el-table-column>
          <el-table-column prop="terminalActiveCount" label="终端启用数">
          </el-table-column>
        </biz-list>
      </div>
      <div slot="description">
        <p>1、终端总数：终端列表中，启用状态的设备总数</p>
        <p>2、终端启用数：在统计期开始的前30天内[30]、及统计期内，有产生过数据的设备总数。上传过GPS数据/轨迹数据/其他车辆数据等环比启用数：环比数据：即所选统计期（如2018年N月）与上一个连续统计期（如2017年N-1月）的数据比</p>
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
  name: 'trend-distribution',
  data() {
    return {
      loading: false,
      axisLabelRotate: 0,
      hardGroupHeight: 0,
      chartData: {},
      companyList: [],
      showSwich: false,
      showHide: false,
      companyId: '',
      shopId: '全部',
      shopList: [],
      show: false,
      className: 'el-icon-caret-bottom',
      isIndeterminate: true,
      checkAllChannel: true,
      height: '500',
      tableData: [],
      beginDate: dateTime.getPreThreeMonthDay(),
      endDate: dateTime.today(),
      viewType: 'month',
      checkedChannel: [],
      conditionData: {
        channelList: []
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
    swich() {
      this.className = this.className === 'el-icon-caret-bottom' ? 'el-icon-caret-top' : 'el-icon-caret-bottom';
      this.showHide = this.className === 'el-icon-caret-bottom';
      if (!this.showHide) {
        document.getElementsByClassName('hardGroup')[0].style.height = this.hardGroupHeight + 'px';
      } else {
        document.getElementsByClassName('hardGroup')[0].style.height = '55px';
      }
    },
    conditionChange(val) {
      console.log(val);
      let checkedCount = val.length;
      this.checkAllChannel = checkedCount === this.conditionData.channelList.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.conditionData.channelList.length;
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
        .get(urls.terminalMgmt.terminalTypeList, param)
        .then(data => {
          this.loading = false;
          this.conditionData.channelList = data.terminalTypeList;
          this.handleCheckAllChannel(true);
          this.$nextTick(() => {
            this.hardGroupHeight = document.getElementsByClassName('hardGroup')[0].offsetHeight;
            if (this.hardGroupHeight > 55) {
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
    getGraphData() {
      this.loading = true;
      let param = this.getParams();
      http
        .post(urls.terminalMgmt.trendGraphData, param)
        .then(data => {
          this.loading = false;
          this.chartData = this.dataFormat(data);
          if (data.indicators.length > 5) {
            this.axisLabelRotate = 45;
          } else {
            this.axisLabelRotate = 0;
          }
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
          终端启用数: data.indicators[i].y[0].yValue,
          环比启用数: data.indicators[i].y[0].yMonthOnMonth
        });
      }
      this.kpiName = ['日期', '终端启用数', '环比启用数'];
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
        .then(data => {
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
    }
  },
  created() {
    this.getTerminalTypeList();
    this.getCompanyList();
  }
};
</script>

<style lang="scss">
.trend-distribution {
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
  .showHide{
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
    .hardGroup{
      display: flex;
    }
  }
}
</style>
