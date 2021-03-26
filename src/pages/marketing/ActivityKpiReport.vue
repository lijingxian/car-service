<template>
  <div class="marketing-statistics-activity-kpi-report">
    <biz-chart :chartData="chartData" :filters="filters" @filterDataChange="filterDataChange" :loading="loading" :pagination="pagination"
      @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange" @refreshHandle="refreshHandle" @exportExcle="exportExcle">
      <div slot="list">
        <biz-list ref="list" :height="height" :tableData="tableData" style="width: 100%">
          <el-table-column prop="name" label="活动名称">
          </el-table-column>
          <el-table-column prop="beginTime" label="活动开始日期" v-if="filters[1].value==='activityCnt'">
          </el-table-column>
          <el-table-column prop="type" label="活动类型" v-if="filters[1].value==='activityCnt'">
          </el-table-column>
          <el-table-column prop="attendTime" label="参与时间" v-if="filters[1].value==='attendRate'||filters[1].value==='attendCnt'">
          </el-table-column>
          <el-table-column prop="type" label="活动类型" v-if="filters[1].value==='attendRate'||filters[1].value==='attendCnt'">
          </el-table-column>
          <el-table-column prop="beginTime" label="活动开始时间" v-if="filters[1].value==='attendRate'||filters[1].value==='attendCnt'">
          </el-table-column>
          <el-table-column prop="attnedMemberName" label="参与用户" v-if="filters[1].value==='attendRate'||filters[1].value==='attendCnt'">
          </el-table-column>
        </biz-list>
      </div>
      <div slot="description">
        <p>活动次数：活动开始日期在统计期内的活动个数</p>
        <p>活动参与人数：统计期内，参与活动的人数总计</p>
        <p>参与率：统计期内，活动参与人数/活动指定开放会员数*100%</p>
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
            { value: '0', label: '抢红包' },
            { value: '1', label: '摇一摇' },
            { value: '2', label: '抽奖' },
            { value: '3', label: '拼团购' },
            { value: '4', label: 'N元抢购' },
            { value: '5', label: '秒杀' },
            { value: '6', label: '帮砍价' },
            { value: '7', label: '推荐有礼' },
            { value: '8', label: '分享有礼' },
            { value: '9', label: '活动招募' }
          ]
        },
        {
          type: 'select',
          label: '统计指标',
          value: 'activityCnt',
          options: [
            { value: 'activityCnt', label: '活动次数' },
            { value: 'attendCnt', label: '活动参与人数' },
            { value: 'attendRate', label: '参与率' }
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
      MarketingStatistics.getActivityKpi(
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
        .get(urls.marketingStatistics.queryActivityKpiTable, params)
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
        .get(urls.marketingStatistics.marketingExport, params)
        .then()
        .catch(data => {
          if (!data.errorMessage && data !== '没有符合条件的数据') {
            let paramsArr = [];
            for (let name in params) {
              paramsArr.push(`${name}=${params[name]}`);
            }
            let linkedUrl = `${urls.marketingStatistics.marketingExport}?` + paramsArr.join('&');
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
          yAxisType: this.filters[1].value === 'attendRate' ? ['percent'] : ['normal'],
          yAxisName: this.filters[1].value === 'attendRate' ? ['比率'] : this.filters[1].value === 'attendCnt' ? '人' : '次'
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
