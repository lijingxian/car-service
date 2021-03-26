<template>
  <div class="hardware-versiton">
     <biz-chart :chartData="chartData" :loading="loading" :pagination="pagination" :showViewType="false"
      @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange" @refreshHandle="refreshHandle" @exportExcle="exportExcle">
      <div slot="extraContent" v-if="getUser.roleLevel !== 'shop'">
        <div class="software-filter">
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
            <el-checkbox-group v-model="checkedChannel" @change="conditionChange">
              <el-checkbox-button v-for="(condition,index) in conditionData.channelList" :label="condition.id.toString()" :key="index" size="mini">{{condition.name}}</el-checkbox-button>
            </el-checkbox-group>
          </div>
        </div>
        <div class="swich" v-if="showSwich"><i :class="className" @click="swich"></i></div>
      </div>
      <div slot="list">
        <biz-list ref="list" :height="height" :tableData="tableData" style="width: 100%">
          <el-table-column prop="terminalType" label="版本号">
          </el-table-column>
          <el-table-column prop="terminalActiveCount" label="本期应用数">
          </el-table-column>
          <el-table-column prop="terminalActiveCountM" label="环比应用数">
          </el-table-column>
        </biz-list>
      </div>
      <div slot="description">
        <p>1、本期应用数：统计期内，对应的的版本应用的数量。即统计期内启用的硬件数，按照硬件版本划分的数量。</p>
        <p>2、环比应用数：环比数据：即所选统计期（如2018年N月）与上一个连续统计期（如2017年N-1月）的数据比</p>
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
  name: 'hardware-versiton',
  data() {
    return {
      loading: false,
      hardGroupHeight: 0,
      chartData: {},
      companyList: [],
      companyId: '',
      shopId: '全部',
      shopList: [],
      showSwich: false,
      showHide: false,
      className: 'el-icon-caret-bottom',
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
      kpiName: ['日期', '本期应用数', '环比应用数']
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
  watch: {},
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
      if (val.length === 2) {
        this.checkedChannel.shift();
      }
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
        let response = await axios.post(urls.terminalMgmt.softExport, params, { responseType: 'blob' });
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
        .get(urls.terminalMgmt.softTypeList, param)
        // .get('http://192.168.50.120:3000/mock/11/admin/ecommerce/kpi/condition/terminal/softVer.jhtml', param)
        .then(data => {
          console.log('软件', data);
          this.loading = false;
          this.conditionData.channelList = data.terminalTypeList;
          if (this.conditionData.channelList.length) {
            this.checkedChannel.push(this.conditionData.channelList[0].id.toString());
          }
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
          this.refreshData();
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
        .post(urls.terminalMgmt.softGraphData, param)
        // .post('http://192.168.50.120:3000/mock/11/admin/ecommerce/kpi/graph/terminal/softVer.jhtml', param)
        .then(data => {
          console.log('硬件图表数据', data);
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
          本期应用数: data.indicators[i].y[0].yValue,
          环比应用数: data.indicators[i].y[0].yMonthOnMonth,
          同比应用数: data.indicators[i].y[0].yYearOnYear
        });
      }
      this.kpiName = ['日期', '本期应用数', '环比应用数', '同比应用数'];
      let chartData = {
        type: 'histogram',
        data: {
          columns: this.kpiName,
          rows: tmpData
        },
        settings: {
          showLine: [this.kpiName[2], this.kpiName[3]],
          yAxisName: '个'
        }
      };
      return chartData;
    },
    getTabelData() {
      this.loading = true;
      let param = this.getParams();
      http
        .post(urls.terminalMgmt.softTabelData, param)
        // .post('http://192.168.50.120:3000/mock/11/admin/ecommerce/kpi/table/terminal/softVer.jhtml', param)
        .then(data => {
          console.log('硬件表格', data);
          this.loading = false;
          this.tableData = data.dataList;
          this.pagination.total = parseInt(data.total);
          this.pagination.currentPage = parseInt(data.pageNumber);
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
.hardware-versiton {
  height: 100%;
  overflow: auto;
  .software-filter{
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
  }
}
</style>
