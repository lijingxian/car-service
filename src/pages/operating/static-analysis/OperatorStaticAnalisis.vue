<template>
  <div class="marketing-statistics-activity-kpi-report">
    <biz-chart :chartData="chartData" :filters="filters" @filterDataChange="filterDataChange" :loading="loading" :pagination="pagination"
      @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange" @refreshHandle="refreshHandle" @exportExcle="exportExcle">
      <div slot="list">
        <biz-list ref="list" :height="height" :tableData="tableData" style="width: 100%">
          <el-table-column prop="companyName" label="运营商名称" v-if="filters[0].value==='comCnt'||filters[0].value==='comIns'||filters[0].value==='comKeepRate'">
          </el-table-column>
          <el-table-column prop="shopName" label="店铺名称" v-if="filters[0].value==='shopCnt'||filters[0].value==='shopIns'||filters[0].value==='shopKeepRate'">
          </el-table-column>
          <el-table-column prop="createDate" label="创建日期">
          </el-table-column>
          <el-table-column prop="companyName" label="所属运营商" v-if="filters[0].value==='shopCnt'||filters[0].value==='shopIns'||filters[0].value==='shopKeepRate'">
          </el-table-column>
          <el-table-column prop="state" label="状态">
          </el-table-column>
        </biz-list>
      </div>
      <div slot="description">
        <p>运营商累计数：统计周期内所处联盟中，所有运营商的总数</p>
        <p>运营商新增数：统计期内，当期运营商累计数-上期运营商累计数</p>
        <p>留存率：统计期内有登录后台行为的新增运营商数量/运营商新增数*100%</p>
        <p>店铺累计数：统计周期内所处联盟中，所有店铺数量</p>
        <p>店铺新增数：统计期内，当期运营商累计数-上期运营商累计数</p>
        <p>店铺留存率：统计期内，有登录后台行为的新增运营商活跃数/运营商新增数*100%</p>
        <p>活跃店铺/运营商数：默认连续1月内，有登录平台行为的店铺/运营商，即算作活跃</p>
        <p>同比数据：即所选统计期（如2018年N月）与去年相同统计期（如2017年N月）数据比</p>
        <p>环比数据：即所选统计期（如2018年N月）与上一个连续统计期（如2017年N-1月）的数据比</p>
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
export default {
  name: 'ActivityKpiReport',
  data() {
    return {
      today: '',
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
      filters: [
        {
          type: 'select',
          label: '统计指标',
          value: 'comCnt',
          options: [
            { value: 'comCnt', label: '运营商累计数' },
            { value: 'comIns', label: '运营商新增数' },
            { value: 'comKeepRate', label: '运营商留存率' }
            // { value: 'shopCnt', label: '店铺累计数' },
            // { value: 'shopIns', label: '店铺新增数' },
            // { value: 'shopKeepRate', label: '店铺留存率' }
          ]
        }
      ],
      kpiName: ['当前', '同比', '环比'],
      chartData: {}
    };
  },
  methods: {
    init() {
      this.loading = true;
      let params = {
        viewType: this.viewType,
        indicator: this.filters[0].value,
        beginDate: this.beginDate,
        endDate: this.endDate,
        shopId: window.top.SHOP_ID || '',
        pageSize: this.pagination.pageSize,
        pageNumber: this.pagination.currentPage
      };
      http
        .get(urls.staticAnalisisi.shopGraphKpi, params)
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
    getTable() {
      let params = {
        viewType: this.viewType,
        indicator: this.filters[0].value,
        beginDate: this.beginDate,
        endDate: this.endDate,
        shopId: window.top.SHOP_ID || '',
        pageSize: this.pagination.pageSize,
        pageNumber: this.pagination.currentPage
      };
      http
        .get(urls.staticAnalisisi.shopTableKpi, params)
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
    },
    filterDataChange(val) {
      this.filters = val;
      this.init();
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
    exportExcle() {
      let params = {
        viewType: this.viewType,
        indicator: this.filters[0].value,
        beginDate: this.beginDate,
        endDate: this.endDate
      };
      http
        .get(urls.staticAnalisisi.shopExportKpi, params)
        .then()
        .catch(data => {
          if (!data.errorMessage && data !== '没有符合条件的数据') {
            let paramsArr = [];
            for (let name in params) {
              paramsArr.push(`${name}=${params[name]}`);
            }
            let linkedUrl =
              `${urls.staticAnalisisi.shopExportKpi}?` +
              paramsArr.join('&');
            // 异步弹出窗口会被Chrome拦截
            window.open(linkedUrl);
            // location.href = linkedUrl;
          } else {
            if (data === '没有符合条件的数据') {
              this.$message.warning('没有符合条件的数据');
            } else {
              this.$message.warning(data.errorMessage);
              console.log('ERR_EXPORT: ', data);
            }
          }
        });
    },
    dataFormat(data) {
      let tmpData = [];
      for (let i = 0; i < data.indicators.length; i++) {
        tmpData.push({
          日期: data.indicators[i].xValue,
          当前: data.indicators[i].yValue,
          同比: data.indicators[i].yYearOnYear,
          环比: data.indicators[i].yMonthOnMonth
        });
      }
      let chartData = {
        type: 'histogram',
        data: {
          columns: ['日期', this.kpiName[0], this.kpiName[1], this.kpiName[2]],
          rows: tmpData
        },
        settings: {
          showLine: [this.kpiName[1], this.kpiName[2]],
          yAxisType: (this.filters[0].value === 'comKeepRate' || this.filters[0].value === 'shopKeepRate') ? ['percent'] : ['normal'],
          yAxisName: (this.filters[0].value === 'comKeepRate' || this.filters[0].value === 'shopKeepRate') ? ['比率'] : ['个']
        }
      };
      return chartData;
    }
  },
  computed: {},
  created() {
    this.init();
    this.getTable();
  },
  components: {
    BizChart,
    BizList
  }
};
</script>

<style lang="scss">
.marketing-statistics-activity-kpi-report {
  height: 100%;
  overflow: auto;
  .biz-table-filter .filter-wrap .biz-select .el-select {
    width: 150px;
  }
}
</style>
