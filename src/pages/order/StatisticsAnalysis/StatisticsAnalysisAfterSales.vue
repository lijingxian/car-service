<template>
  <div class="potential-kpi-report">
    <biz-chart :chartData="chartData" :filters="filters" @filterDataChange="filterDataChange" :loading="loading" :pagination="pagination"
      @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange" @refreshHandle="refreshHandle" @exportExcle="exportExcle">
      <div slot="indicators">
        <el-table :data="indicatorsData" @header-click="headerClick" size="small">
          <el-table-column label="" prop="name"></el-table-column>
          <el-table-column label="当期订单数" prop="orderCnt" :class-name="indicators.indexOf('orderCnt')!==-1?'yellow':''"></el-table-column>
          <el-table-column label="累计订单数" prop="totalOrderCnt" :class-name="indicators.indexOf('totalOrderCnt')!==-1?'yellow':''"></el-table-column>
          <el-table-column label="当期产值（元）" prop="orderAmount" :class-name="indicators.indexOf('orderAmount')!==-1?'yellow':''"></el-table-column>
          <el-table-column label="累计产值（元）" prop="totalOrderAmount" :class-name="indicators.indexOf('totalOrderAmount')!==-1?'yellow':''"></el-table-column>
          <el-table-column label="当期客户满意度" prop="aftersaleSatisfaction" :class-name="indicators.indexOf('aftersaleSatisfaction')!==-1?'yellow':''"></el-table-column>
          <el-table-column label="当期进厂台次" prop="entryCnt" :class-name="indicators.indexOf('entryCnt')!==-1?'yellow':''"></el-table-column>
          <el-table-column label="累计进厂台次" prop="totalEntryCnt" :class-name="indicators.indexOf('totalEntryCnt')!==-1?'yellow':''"></el-table-column>
        </el-table>
        <div class="indicators-search">
          <div class="title">订单类型：</div>
          <el-checkbox-button v-model="checkAllOrderType" @change="handleCheckAllOrderType" :indeterminate="isIndeterminate">全选</el-checkbox-button>
          <el-checkbox-group v-model="checkedOrderType" @change="conditionChange">
            <el-checkbox-button v-for="(condition,index) in conditionData.orderTypeList" :label="condition.value" :key="index"
              size="mini">{{condition.label}}</el-checkbox-button>
          </el-checkbox-group>
        </div>
        <div class="indicators-search" v-show="show&&tagCategeryList.length>0">
          <div class="title">服务类别：</div>
          <el-checkbox-button v-model="checkAllTagCategery" @change="handleCheckAllTagCategery" :indeterminate="isIndeterminate1">全选</el-checkbox-button>
          <el-checkbox-group v-model="checkedTagCategery" @change="conditionChange1">
            <el-checkbox-button v-for="(condition,index)  in tagCategeryList" :label="condition.id" :key="index" size="mini">{{condition.name}}</el-checkbox-button>
          </el-checkbox-group>
        </div>
        <div class="indicators-search" v-show="show&&tagServiceList.length>0">
          <div class="title">业务类型：</div>
          <el-checkbox-button v-model="checkAllTagService" @change="handleCheckAllTagService" :indeterminate="isIndeterminate2">全选</el-checkbox-button>
          <el-checkbox-group v-model="checkedTagService" @change="conditionChange2">
            <el-checkbox-button v-for="(condition,index) in tagServiceList" :label="condition.id" :key="index" size="mini">{{condition.name}}</el-checkbox-button>
          </el-checkbox-group>
        </div>
        <div class="indicators-search" v-show="show">
          <div class="title">服务顾问：</div>
          <el-checkbox-button v-model="checkAllSalesman" @change="handleCheckAllSalesman" :indeterminate="isIndeterminate3">全选</el-checkbox-button>
          <el-checkbox-group v-model="checkedSalesman" @change="conditionChange3">
            <el-checkbox-button v-for="(condition,index) in conditionData.adminList" :label="condition.id" :key="index" size="mini">{{condition.name}}</el-checkbox-button>
          </el-checkbox-group>
        </div>
        <div class="swich"><i :class="className" @click="swich"></i></div>
      </div>
      <div slot="list">
        <el-radio-group v-model="indicator" @change="indicatorChange" size="small">
          <el-radio-button v-for="(indicator,index) in indicators" :key="index" :label="getLabel(indicator)"></el-radio-button>
        </el-radio-group>
        <el-radio-group v-model="radio" @change="typeChange" size="small">
          <el-radio-button label="按订单类型"></el-radio-button>
          <el-radio-button label="按售后项目"></el-radio-button>
          <el-radio-button label="按服务顾问"></el-radio-button>
        </el-radio-group>
        <biz-list ref="list" :height="height" :tableData="tableData" style="width: 100%">
          <el-table-column prop="label" :label="listType==='0'?'订单类型':listType==='1'?'售后项目':'服务顾问'">
          </el-table-column>
          <el-table-column prop="orderCnt" label="当期订单数">
          </el-table-column>
          <el-table-column prop="totalOrderCnt" label="累计订单数">
          </el-table-column>
          <el-table-column prop="orderAmount" label="当期产值（元）">
          </el-table-column>
          <el-table-column prop="totalOrderAmount" label="累计产值（元）">
          </el-table-column>
          <!-- <el-table-column prop="entryCnt" label="当期进厂台次">
          </el-table-column>
          <el-table-column prop="totalEntryCnt" label="累计进厂台次">
          </el-table-column> -->
          <el-table-column prop="aftersaleSatisfaction" label="当期客户满意度">
          </el-table-column>
        </biz-list>
      </div>
      <div slot="description" class="description-pover">
        <p>当期订单数：统计期内订单状态变更为“交易完成”的订单，订单处理人员归属售后（即系统内售后、售后主管、接待、客服、门卫、救援角色）（服务订单操作“服务”步骤人员角色属性；或产品订单操作“执行”步骤人员角色属性）的数量</p>
        <p>累计订单数：自然年内，截止至统计选择期，订单处理人员归属售后的（服务订单操作“服务”步骤人员角色属性；或产品订单操作“执行”步骤人员角色属性）订单数总计</p>
        <p>当期订售后产值：统计期内订单状态变更为“交易完成”&订单处理人员归属售后（服务订单操作“服务”步骤人员角色属性；或产品订单操作“执行”步骤人员角色属性）的订单的实付金额总计—统计期内退款金额总计</p>
        <p>当期售后产值：统计期内订单状态变更为“交易完成”&订单处理人员归属售后（服务订单操作“服务”步骤人员角色属性；或产品订单操作“执行”步骤人员角色属性）的订单的实付金额总计—统计期内退款金额总计</p>
        <p>当期整车订单数：统计期内订单状态变更为“交易完成”的订单，订单处理人员归属售前、订单内商品包含整车的订单数量</p>
        <p>累计售后产值：自然年内，截止至统计选择期，订单处理人员归属售后（服务订单操作“服务”步骤人员角色属性；或产品订单操作“执行”步骤人员角色属性）的订单净额总计</p>
        <p>当期售后客户满意度：统计期内，有评分的订单内，评分的加权平均值。（取店铺评价分数：服务态度30%，服务速度30%，服务技能40%）</p>
        <p>当期进厂台次：统计期内，智能接待每日进厂台次（去重数、已接待才计入）累计数</p>
        <p>累计进厂台次：自然年内，截止至统计选择期，进厂台次总计</p>
      </div>
    </biz-chart>
  </div>
</template>

<script>
import BizChart from '@/components/BizChart';
import BizList from '@/components/BizTable/BizList';
import dateTime from '@/utils/dateTime';
import urls from '@/common/urls';
import http from '@/common/http';
import axios from 'axios';
export default {
  name: 'ActivityKpiReport',
  data() {
    return {
      today: '',
      loading: true,
      show: false,
      className: 'el-icon-caret-bottom',
      height: '500',
      listType: '0',
      radio: '按订单类型',
      beginDate: dateTime.getPreThreeMonthDay(),
      endDate: dateTime.today(),
      viewType: 'month',
      cities: ['上海', '北京', '广州', '深圳'],
      checkedOrderType: [],
      checkedTagCategery: [],
      tagCategeryList: [],
      tagServiceList: [],
      checkedTagService: [],
      checkedSalesman: [],
      checkAllOrderType: true,
      checkAllTagCategery: false,
      checkAllTagService: false,
      checkAllSalesman: true,
      isIndeterminate: true,
      isIndeterminate1: true,
      isIndeterminate2: true,
      isIndeterminate3: true,
      pagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        total: 0
      },
      tableData: [],
      indicator: '',
      indicators: ['orderCnt'],
      indicatorsData: [],
      conditionData: [],
      filters: [
        // {
        //   type: 'select',
        //   label: '统计指标',
        //   value: 'customerCnt',
        //   options: [
        //     { value: 'customerCnt', label: '潜客总数' },
        //     { value: 'validCustomerCnt', label: '有效潜客数' },
        //     { value: 'customerIns', label: '新增潜客数' },
        //     { value: 'signCustomerIns', label: '新增签约人数' },
        //     { value: 'customerKeepRate', label: '当期留档率' },
        //     { value: 'customerDriveRate', label: '当期试驾率' },
        //     { value: 'customerDealRate', label: '当期成交率' }
        //   ]
        // }
      ],
      kpiName: ['日期', '当前', '同比', '环比'],
      chartData: {}
    };
  },
  methods: {
    getParams() {
      return {
        viewType: this.viewType,
        listType: this.listType,
        indicators: this.indicators,
        beginDate: this.beginDate,
        endDate: this.endDate,
        shop: window.top.SHOP_ID || '',
        pageSize: this.pagination.pageSize,
        pageNumber: this.pagination.currentPage,
        orderTypes: this.checkedOrderType,
        businessCategories: this.checkedTagCategery,
        businessTypes: this.checkedTagService,
        admins: this.checkedSalesman
      };
    },
    swich() {
      this.show = this.className === 'el-icon-caret-bottom';
      this.className = this.className === 'el-icon-caret-bottom' ? 'el-icon-caret-top' : 'el-icon-caret-bottom';
    },
    conditionChange(value) {
      let checkedCount = value.length;
      this.checkAllOrderType = checkedCount === this.conditionData.orderTypeList.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.conditionData.orderTypeList.length;
      if (value.length === 1 && value.indexOf('2') !== -1) {
        this.getTagGategery();
      } else {
        this.checkedTagCategery = [];
        this.tagCategeryList = [];
        this.checkedTagService = [];
        this.tagServiceList = [];
      }
      this.init();
      this.getTable();
      this.getIndicatorsData();
    },
    conditionChange1(value) {
      let checkedCount = value.length;
      this.checkAllTagCategery = checkedCount === this.tagCategeryList.length;
      this.isIndeterminate1 = checkedCount > 0 && checkedCount < this.tagCategeryList.length;
      if (value.length === 1) {
        this.tagCategeryList.map(item => {
          console.log(item.id === value[0]);
          if (item.id === value[0]) {
            this.getTagService(item.id);
          }
        });
      } else {
        this.checkedTagService = [];
        this.tagServiceList = [];
      }
      this.init();
      this.getTable();
      this.getIndicatorsData();
    },
    conditionChange2(value) {
      let checkedCount = value.length;
      this.checkAllTagService = checkedCount === this.tagServiceList.length;
      this.isIndeterminate2 = checkedCount > 0 && checkedCount < this.tagServiceList.length;
      this.init();
      this.getTable();
      this.getIndicatorsData();
    },
    conditionChange3(value) {
      let checkedCount = value.length;
      this.checkAllSalesman = checkedCount === this.conditionData.adminList.length;
      this.isIndeterminate3 = checkedCount > 0 && checkedCount < this.conditionData.adminList.length;
      this.init();
      this.getTable();
      this.getIndicatorsData();
    },
    typeChange(val) {
      this.pagination.currentPage = 1;
      if (val === '按订单类型') {
        this.listType = '0';
      } else if (val === '按售后项目') {
        this.listType = '1';
      } else {
        this.listType = '2';
      }
      this.getTable();
    },
    indicatorChange(val) {
      let indicator = [];
      switch (val) {
        case '当期订单数':
          indicator = ['orderCnt'];
          break;
        case '累计订单数':
          indicator = ['totalOrderCnt'];
          break;
        case '当期产值':
          indicator = ['orderAmount'];
          break;
        case '累计产值':
          indicator = ['totalOrderAmount'];
          break;
        case '当期客户满意度':
          indicator = ['aftersaleSatisfaction'];
          break;
        case '当期进厂台次':
          indicator = ['entryCnt'];
          break;
        case '累计进厂台次':
          indicator = ['totalEntryCnt'];
          break;
        default:
          indicator = ['orderCnt'];
          break;
      }
      let params = {
        viewType: this.viewType,
        listType: this.listType,
        indicators: indicator,
        beginDate: this.beginDate,
        endDate: this.endDate,
        shop: window.top.SHOP_ID || '',
        pageSize: this.pagination.pageSize,
        pageNumber: this.pagination.currentPage,
        orderTypes: this.checkedOrderType,
        businessCategories: this.checkedTagCategery,
        businessTypes: this.checkedTagService,
        admins: this.checkedSalesman
      };
      let paramsArr = [];
      for (let name in params) {
        paramsArr.push(`${name}=${params[name]}`);
      }
      http
        .get(urls.orderMgmt.statisticsAnalysis.tableAftersale, params)
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
    getLabel(val) {
      switch (val) {
        case 'orderCnt':
          return '当期订单数';
        case 'totalOrderCnt':
          return '累计订单数';
        case 'orderAmount':
          return '当期产值';
        case 'totalOrderAmount':
          return '累计产值';
        case 'aftersaleSatisfaction':
          return '当期客户满意度';
        case 'entryCnt':
          return '当期进厂台次';
        case 'totalEntryCnt':
          return '累计进厂台次';
        default:
          break;
      }
    },
    getTagGategery() {
      let params = {
        categoryType: '订单/服务业务类型',
        shopId: window.top.SHOP_ID || ''
      };
      http
        .get('/admin/tag/storeTagcategories.jhtml', params)
        .then(data => {
          this.tagCategeryList = data.content;
        })
        .catch(errData => {
          this.loading = false;
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    getTagService(val) {
      let params = {
        shopId: window.top.SHOP_ID || '',
        tagCategoryId: val
      };
      http
        .get('/admin/tag/storeTags.jhtml', params)
        .then(data => {
          this.tagServiceList = data.content;
        })
        .catch(errData => {
          this.loading = false;
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    init() {
      this.loading = true;
      let params = this.getParams();
      let paramsArr = [];
      for (let name in params) {
        paramsArr.push(`${name}=${params[name]}`);
      }
      http
        .post(urls.orderMgmt.statisticsAnalysis.graphAftersale, params)
        .then(data => {
          this.chartData = this.dataFormat(data);
        })
        .catch(errData => {
          this.loading = false;
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    headerClick(column, event) {
      if (this.indicators.indexOf(column.property) === -1) {
        if (this.indicators.length === 1) {
          this.indicators = [];
          this.indicators.push(column.property);
        } else {
          this.indicators.push(column.property);
        }
      }
      this.getTable();
      this.init();
    },
    handleCheckAllOrderType(val) {
      this.checkedOrderType = val
        ? this.conditionData.orderTypeList.map(item => {
          return item.value;
        })
        : [];
      this.getTable();
      this.init();
      this.getIndicatorsData();
      this.checkedTagCategery = [];
      this.tagCategeryList = [];
      this.checkedTagService = [];
      this.tagServiceList = [];
    },
    handleCheckAllTagCategery(val) {
      this.checkedTagCategery = val
        ? this.tagCategeryList.map(item => {
          return item.name;
        })
        : [];
      this.getTable();
      this.init();
      this.getIndicatorsData();
      this.checkedTagService = [];
      this.tagServiceList = [];
    },
    handleCheckAllTagService(val) {
      this.checkedTagService = val
        ? this.tagServiceList.map(item => {
          return item.name;
        })
        : [];
      this.getTable();
      this.init();
      this.getIndicatorsData();
    },
    handleCheckAllSalesman(val) {
      this.checkedSalesman = val
        ? this.conditionData.adminList.map(item => {
          return item.id;
        })
        : [];
      this.getTable();
      this.init();
      this.getIndicatorsData();
    },
    getIndicatorsData() {
      let params = {
        viewType: this.viewType,
        beginDate: this.beginDate,
        endDate: this.endDate,
        shop: window.top.SHOP_ID || '',
        listType: this.listType,
        indicators: this.indicators,
        orderTypes: this.checkedOrderType,
        businessCategories: this.checkedTagCategery,
        businessTypes: this.checkedTagService,
        admins: this.checkedSalesman,
        pageSize: this.pagination.pageSize,
        pageNumber: this.pagination.currentPage
      };
      http
        .post(urls.orderMgmt.statisticsAnalysis.summaryAftersale, params)
        .then(data => {
          this.indicatorsData = data.indicators;
          this.indicatorsData[0].name = '本期';
          this.indicatorsData[1].name = '环比';
          this.indicatorsData[2].name = '同比';
        })
        .catch(errData => {
          this.loading = false;
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    getConditionData() {
      let params = {
        shopId: window.top.SHOP_ID || ''
      };
      http
        .get(urls.orderMgmt.statisticsAnalysis.conditionAftersale, params)
        .then(data => {
          this.conditionData = data;
          this.checkedOrderType = this.conditionData.orderTypeList
            ? this.conditionData.orderTypeList.map(item => {
              return item.value;
            })
            : [];
          this.checkedSalesman = this.conditionData.adminList
            ? this.conditionData.adminList.map(item => {
              return item.id;
            })
            : [];
          this.getIndicatorsData();
          this.init();
          this.getTable();
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
      let params = this.getParams();
      params.listType = this.listType;
      let paramsArr = [];
      for (let name in params) {
        paramsArr.push(`${name}=${params[name]}`);
      }
      http
        .post(urls.orderMgmt.statisticsAnalysis.tableAftersale, params)
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
    refreshHandle(val) {
      this.viewType = val.viewType;
      this.beginDate = val.date[0];
      this.endDate = val.date[1];
      this.init();
      this.getTable();
      this.getIndicatorsData();
    },
    filterDataChange(val) {
      this.filters = val;
      this.init();
      this.getTable();
      this.getIndicatorsData();
    },
    handleSizeChange(val) {
      this.pagination.pageSize = val;
      this.getTable();
    },
    handleCurrentChange(val) {
      this.pagination.currentPage = val;
      this.getTable();
    },
    // exportExcle() {
    //   this.export();
    // },
    async exportExcle() {
      let params = this.getParams();
      try {
        let response = await axios.post(urls.orderMgmt.statisticsAnalysis.exportAftersale, params, { responseType: 'blob' });
        console.log('response => ', response);
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
    dataFormat(data) {
      let tmpData = [];
      this.kpiName = [];
      for (let i = 0; i < data.indicators.length; i++) {
        tmpData.push({
          日期: data.indicators[i].xValue,
          当期: data.indicators[i].y[0].yValue,
          同比: data.indicators[i].y[0].yYearOnYear,
          环比: data.indicators[i].y[0].yMonthOnMonth
        });
      }
      this.kpiName = ['日期', '当期', '同比', '环比'];
      let chartData = {
        type: 'histogram',
        data: {
          columns: this.kpiName,
          rows: tmpData
        },
        settings: {
          showLine: [this.kpiName[2], this.kpiName[3]],
          yAxisName: (this.indicators.indexOf('orderCnt') !== -1 || this.indicators.indexOf('totalOrderCnt') !== -1) ? '个' : (this.indicators.indexOf('orderAmount') !== -1 || this.indicators.indexOf('totalOrderAmount') !== -1) ? ['万元'] : (this.indicators.indexOf('entryCnt') !== -1 || this.indicators.indexOf('totalEntryCnt') !== -1) ? '次' : ['比率']
        }
      };
      return chartData;
    }
  },
  computed: {},
  created() {
    this.getConditionData();
  },
  components: {
    BizChart,
    BizList
  }
};
</script>

<style lang="scss">
.description-pover {
  max-height: 500px;
  overflow: auto;
}
.potential-kpi-report {
  height: 100%;
  overflow: auto;
  .biz-table-filter .filter-wrap .biz-select .el-select {
    width: 150px;
  }
  .swich {
    text-align: center;
    font-size: 24px;
    cursor: pointer;
  }
  .indicators-search {
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
