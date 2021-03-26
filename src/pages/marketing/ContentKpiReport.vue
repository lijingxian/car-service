<template>
  <div class="marketing-statistics-activity-kpi-report">
    <biz-chart :chartData="chartData" :filters="filters" @filterDataChange="filterDataChange" :loading="loading" :pagination="pagination"
      @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange" @refreshHandle="refreshHandle" @exportExcle="exportExcle">
      <div slot="list">
        <biz-list ref="list" :height="height" :tableData="tableData" style="width: 100%" v-if="filters[1].value==='articleIns'||filters[1].value==='totalArticleCnt'||filters[1].value==='readIns'||filters[1].value==='totalReadCnt'">
          <el-table-column prop="name" label="文章名称">
          </el-table-column>
          <el-table-column prop="date" label="发布时间">
          </el-table-column>
          <el-table-column prop="shopName" label="店铺名称">
          </el-table-column>
          <el-table-column prop="incRead" label="新增阅读数">
          </el-table-column>
          <el-table-column prop="totalRead" label="累计阅读数">
          </el-table-column>
        </biz-list>
        <biz-list ref="list" :height="height" :tableData="tableData" style="width: 100%" v-if="filters[1].value==='followIns'||filters[1].value==='totalFollowCnt'">
          <el-table-column prop="name" label="店铺名称">
          </el-table-column>
          <el-table-column prop="date" label="统计时间">
          </el-table-column>
          <el-table-column prop="incAttend" label="新增关注数">
          </el-table-column>
          <el-table-column prop="totalAttend" label="累计关注数">
          </el-table-column>
        </biz-list>
      </div>
      <div slot="description">
        <p>新增文章数：统计期内，选定内容类型，发布的文章数</p>
        <p>累计文章数：截止统计期末，选定内容类型，已发布文章总数</p>
        <p>新增阅读数：统计期内，公众号文章/店铺宣传文章增加阅读数量</p>
        <p>累计阅读数：本周新增关注截止统计期末，公众号文章/店铺宣传文章累计阅读数</p>
        <p>新增关注数：统计期内，公众号文章/店铺新增关注人数</p>
        <p>累计关注数：截止统计期末，公众号文章/店铺累计关注人数</p>
      </div>
    </biz-chart>
  </div>
</template>

<script>
import BizChart from '@/components/BizChart';
import MarketingStatistics from '@/service/marketing-statistics/marketingStatistics';
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
          label: '活动类型',
          value: '',
          options: [
            { value: '', label: '全部' },
            { value: 'article', label: '店铺文章' }
          ]
        },
        {
          type: 'select',
          label: '统计指标',
          value: 'articleIns',
          options: [
            { value: 'articleIns', label: '新增文章数' },
            { value: 'totalArticleCnt', label: '累计文章数' },
            { value: 'readIns', label: '新增阅读数' },
            { value: 'totalReadCnt', label: '累计阅读数' },
            { value: 'followIns', label: '新增关注数' },
            { value: 'totalFollowCnt', label: '累计关注数' }
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
        type: this.filters[0].value,
        viewType: this.viewType,
        indicator: this.filters[1].value,
        beginDate: this.beginDate,
        endDate: this.endDate,
        shopId: window.top.SHOP_ID || '',
        pageSize: this.pagination.pageSize,
        pageNumber: this.pagination.currentPage
      };
      MarketingStatistics.getContentKpi(
        params,
        data => {
          this.loading = false;
          this.chartData = this.dataFormat(data);
        },
        ErrorData => {
          this.loading = false;
          this.$message.warning({
            showClose: true,
            message: ErrorData.errorMessage
          });
          console.log('ERR_INIT: ', ErrorData);
        }
      );
    },
    getTable() {
      let params = {
        type: this.filters[0].value,
        viewType: this.viewType,
        indicator: this.filters[1].value,
        beginDate: this.beginDate,
        endDate: this.endDate,
        shopId: window.top.SHOP_ID || '',
        pageSize: this.pagination.pageSize,
        pageNumber: this.pagination.currentPage
      };
      http
        .get(urls.marketingStatistics.queryContentKpiTable, params)
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
        type: this.filters[0].value,
        viewType: this.viewType,
        indicator: this.filters[1].value,
        beginDate: this.beginDate,
        endDate: this.endDate
      };
      http
        .get(urls.marketingStatistics.contentExport, params)
        .then()
        .catch(data => {
          if (!data.errorMessage && data !== '没有符合条件的数据') {
            let paramsArr = [];
            for (let name in params) {
              paramsArr.push(`${name}=${params[name]}`);
            }
            let linkedUrl =
              `${urls.marketingStatistics.contentExport}?` +
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
          yAxisName: ['个']
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
