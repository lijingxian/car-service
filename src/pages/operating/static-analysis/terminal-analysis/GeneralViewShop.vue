<template>
  <div class="general-view-shop-analysis">
    <div slot="top">
      <show-search-grid @refreshHandle="refreshHandle">
        <div slot="description" class="description-pover">
          <p>标签不控制饼状图，其余突变受控制</p>
        </div>
      </show-search-grid>
    </div>
    <div class="indicators-search">
      <div class="title">店铺</div>
      <el-checkbox-button v-model="checkAllShops" @change="handleCheckAllShops" :indeterminate="isIndeterminateShops">全部</el-checkbox-button>
      <el-checkbox-group :min="1" v-model="checkedShops" @change="shopsChange">
        <el-checkbox-button v-for="(item,index) in conditionData.shopsList" :label="item.id" :key="index" size="mini">{{item.name}}</el-checkbox-button>
      </el-checkbox-group>
    </div>
    <div class="indicators-search">
      <div class="title">终端类型：</div>
      <el-checkbox-button v-model="checkAllTerminal" @change="handleCheckAllTerminal" :indeterminate="isIndeterminate">全部</el-checkbox-button>
      <el-checkbox-group v-model="checkedTerminal" @change="conditionChange">
        <el-checkbox-button v-for="(condition,index) in conditionData.terminalList" :label="condition.id.toString()" :key="index" size="mini">{{condition.name}}</el-checkbox-button>
      </el-checkbox-group>
    </div>
    <div class="total">
      <div class="column1">
        <div class="table-cell">
          设备数
          <div class="color-primary">
            <span style="font-size:24px">{{summary.total}}</span>个
          </div>
        </div>
      </div>
      <div class="column2">
        <div class="table-cell">
          已绑定车辆设备数
          <div class="color-primary">
            <span style="font-size:24px">{{summary.bingdCar}}</span>个
          </div>
        </div>
      </div>
      <div class="column3">
        <div class="table-cell">
          在线/离线设备
          <div class="color-primary">
            <span style="font-size:24px">{{summary.online}}/{{summary.offline}}</span>个
          </div>
        </div>
      </div>
    </div>
    <div class="chart-area">
      <div class="graph">
        <div class="header">终端类型</div>
        <div style="width:100%">
          <div class="content" style="width:40%;float:right;line-height:40px;font-size: 13px;">
            <div v-for="(list,index) in terminalLists" :key="index">
              <span :class="'list'+index">{{list.lable}}:{{list.value}}人 占比{{countTotal!==0?(list.value/countTotal)*100:list.value}}%</span>
            </div>
          </div>
          <biz-chart :chartData="chartDataOfTerminal" :loading="loading" :showSearch="false"></biz-chart>
        </div>
      </div>
    </div>
    <div slot="bottom">
      <div class="toggle">
        <div class="toggle-btn" @click="showTableList">
          <div class="text">{{ toggleRecommendTxt }}</div>
          <div class="iconfont biz-icon-i-web-zd1" :class="{ 'rotate-180': showRecommend }"></div>
        </div>
      </div>
      <biz-list ref="list" :height="height" :tableData="tableData" style="width: 100%" v-if="!isShow">
        <el-table-column prop="name" label="终端名称"></el-table-column>
        <el-table-column prop="number" label="产品序列号"></el-table-column>
        <el-table-column prop="terminalTypeName" label="终端类型"></el-table-column>
        <el-table-column prop="ownerName" label="所有者"></el-table-column>
        <el-table-column prop="bindCarPn" label="绑定车辆"></el-table-column>
        <el-table-column prop="hardVer" label="硬件版本"></el-table-column>
        <el-table-column prop="softVer" label="软件版本"></el-table-column>
      </biz-list>
      <biz-pagination :pagination="pagination" @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange" v-if="!isShow"></biz-pagination>
    </div>
  </div>
</template>

<script>
import BizChart from '@/components/BizChart';
import { BizList, BizPagination } from '@/components/BizTable';
import ShowSearchGrid from './components/ShowSearchGrid';
import dateTime from '@/utils/dateTime';
import http from '@/common/http';
import axios from 'axios';
import { mapGetters } from 'vuex';
import urls from '@/common/urls';

export default {
  name: 'GeneralViewShopAnalysis',
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
      kpiName: ['本期', '同比', '环比'],
      chartDataOfTerminal: {},
      summary: {},
      isShow: 'false',
      // indicator
      terminalLists: [],
      countTotal: 0,
      isIndeterminateShops: true,
      checkAllShops: false,
      checkedShops: [],
      conditionData: [
        {
          terminalList: [],
          shopsList: []
        }
      ],
      checkedTerminal: [],
      checkAllTerminal: true,
      isIndeterminate: true
    };
  },
  methods: {
    init() {
      let params = {
        beginDate: this.beginDate,
        endDate: this.endDate,
        terminalTypeIds: this.checkedTerminal.join('&terminalTypeIds='),
        searchShopIds: this.getCheckedShopsId.join('&searchShopIds=')
      };
      let paramsArr = [];
      for (let name in params) {
        paramsArr.push(`${name}=${params[name]}`);
      }
      http
        .get('/admin/ecommerce/kpi/summary/terminal/storeTerminal/summary.jhtml' + '?' + paramsArr.join('&'))
        .then(data => {
          this.summary = data.indicators;
        })
        .catch(errData => {
          this.loading = false;
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
        });
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
          this.checkedTerminal = this.conditionData.terminalList
            ? this.conditionData.terminalList.map(item => {
              return item.id.toString();
            })
            : [];
          this.getGraphData();
          this.getTable();
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
      let params = {
        viewType: this.viewType,
        beginDate: this.beginDate,
        endDate: this.endDate,
        terminalTypeIds: this.checkedTerminal.join('&terminalTypeIds='),
        searchShopIds: this.getCheckedShopsId.join('&searchShopIds=')
      };
      let paramsArr = [];
      for (let name in params) {
        paramsArr.push(`${name}=${params[name]}`);
      }
      http
        .get('/admin/ecommerce/kpi/graph/terminal/terminalType/storeCount.jhtml' + '?' + paramsArr.join('&'))
        .then(data => {
          this.terminalLists = data.indicators;
          for (const item of data.indicators) {
            this.countTotal += Number(item.value);
          }
          this.chartDataOfTerminal = this.dataFormat(data);
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
      this.loading = true;
      let params = {
        viewType: this.viewType,
        beginDate: this.beginDate,
        endDate: this.endDate,
        terminalTypeIds: this.checkedTerminal.join('&terminalTypeIds='),
        searchShopIds: this.getCheckedShopsId.join('&searchShopIds='),
        pageSize: this.pagination.pageSize,
        pageNumber: this.pagination.currentPage
      };
      let paramsArr = [];
      for (let name in params) {
        paramsArr.push(`${name}=${params[name]}`);
      }
      http
        .get('/admin/ecommerce/kpi/table/terminal/terminalType/storeCount.jhtml' + '?' + paramsArr.join('&'))
        .then(data => {
          this.tableData = data.dataList;
          this.pagination.total = Number(data.total);
          this.loading = false;
        })
        .catch(errData => {
          this.loading = false;
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
        });
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
      this.getTable();
    },
    conditionChange(value) {
      let checkedCount = value.length;
      this.checkAllTerminal = checkedCount === this.conditionData.terminalList.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.conditionData.terminalList.length;
      this.getGraphData();
      this.getTable();
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
            this.terminalLists.forEach((element, index) => {
              if (element.lable === v.name) {
                document.getElementsByClassName('list' + index)[0].style.color = v.color;
                document.getElementsByClassName('list' + index)[0].style.fontSize = '16px';
              }
            });
          },
          mouseout: v => {
            this.terminalLists.forEach((element, index) => {
              document.getElementsByClassName('list' + index)[0].style.color = 'black';
              document.getElementsByClassName('list' + index)[0].style.fontSize = '13px';
            });
          }
        }
      };
      return chartData;
    },
    async exportExcle() {
      let params = {
        searchShopIds: this.getCheckedShopsId.join('&searchShopIds='),
        beginDate: this.beginDate,
        endDate: this.endDate,
        pageSize: this.pagination.pageSize.toString(),
        pageNumber: this.pagination.currentPage.toString(),
        viewType: this.viewType,
        terminalTypeIds: this.checkedTerminal.join('&terminalTypeIds=')
      };
      let paramsArr = [];
      for (let name in params) {
        paramsArr.push(`${name}=${params[name]}`);
      }
      try {
        let response = await axios.post(
          '/admin/ecommerce/kpi/export/terminal/terminalType/storeCount.jhtml' + '?' + paramsArr.join('&'),
          {
            responseType: 'blob'
          }
        );
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
    ...mapGetters(['getUser']),
    getCheckedShopsId() {
      let includesShops = this.checkedShops.filter(item => item.indexOf(',') >= 0);
      if (includesShops.length) {
        let ary = includesShops[0].split(',');
        let shop = this.checkedShops.filter(item => item.indexOf(',') < 0);
        ary = ary.concat(shop);
        return ary;
      } else {
        return this.checkedShops;
      }
    },
    toggleRecommendTxt() {
      if (this.showRecommend) {
        return '收起明细';
      }
      return '查看明细';
    }
  },
  created() {
    this.getShopList();
    this.getTerminalTypeList();
    this.init();
  },
  components: {
    BizChart,
    BizList,
    BizPagination,
    ShowSearchGrid
  }
};
</script>

<style lang="scss">
.general-view-shop-analysis {
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
    }
  }
  .total {
    display: flex;
    margin-top: 20px;
    .column1 {
      border: 1px solid #d9d9d9;
      padding: 20px;
      width: 350px;
      height: 155px;
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
      width: 350px;
      height: 155px;
      line-height: 40px;
      margin-right: 40px;
      .table-cell {
        font-size: 15px;
      }
      .color-primary {
        font-size: 13px;
      }
    }
    .column3 {
      border: 1px solid #d9d9d9;
      padding: 20px;
      width: 350px;
      height: 155px;
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
        margin-top: 10px;
        .type-range {
          float: right;
        }
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
