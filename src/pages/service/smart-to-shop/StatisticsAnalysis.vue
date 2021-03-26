<template>
  <div class="smart-to-shop-analysis" v-loading="loading">
    <biz-header :views="views" :filters="filters" :operations="operations" @operate="operate" @filter-data-change="filterDataChange" @on-switch="onSwitch">
    </biz-header>
    <el-table v-if="view === 'table'" ref="table" size="small" stripe border tooltip-effect="dark" style="width: 100%" :height="height"
      :data="currentTableData">
      <!-- 表格内容 -->
      <el-table-column prop="date" label="日期"></el-table-column>
      <el-table-column prop="accessCount" label="到店人数"></el-table-column>
      <el-table-column prop="receptionCount" label="接待人数"></el-table-column>
      <el-table-column prop="memberReceptionCount" label="接待会员数"></el-table-column>
      <el-table-column prop="rate" label="占比"></el-table-column>
      <el-table-column prop="money" label="消费金额"></el-table-column>
    </el-table>
    <biz-pagination v-if="view === 'table'" :pagination="pagination" @size-change="handleSizeChange" @current-change="handleCurrentChange"></biz-pagination>
    <!-- 图表 -->
    <div class="chart-group" v-if="view === 'chart'">
      <biz-chart :chartData="chartData" :chartHeight="chartHeight" :showSearch="false"></biz-chart>
    </div>
  </div>
</template>

<script>
import { BizHeader, BizPagination } from '@/components/BizTable';
import BizChart from '@/components/BizChart';
import { customerService } from '@/common/urls';
import http from '@/common/http';
import dates from '@/utils/date.js';

export default {
  name: 'SmartToShopAnalysis',
  data() {
    return {
      height: '700',
      chartHeight: '600px',
      // 视图
      view: 'table',
      views: [
        {
          actived: true,
          class: 'iconfont biz-icon-liebiaoshitu',
          name: 'table'
        },
        {
          actived: false,
          class: 'iconfont biz-icon-tongjishitu',
          name: 'chart'
        }
      ],
      operations: [
        { label: '导出', name: 'export', type: 'primary', disabled: false }
      ],
      filters: [
        {
          type: 'select',
          value: 'month',
          label: '查看类型',
          options: [
            { label: '月', value: 'month' },
            { label: '天', value: 'day' }
          ]
        },
        {
          type: 'daterange',
          value: [dates.halfYearAgo(), dates.nowDate()],
          label: '日期区间'
        }
      ],
      loading: false,
      tableData: [],
      // 图表Strat
      chartData: {},
      // 图表End
      multiSelected: [],
      pagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        // 总条目数
        total: 0
      },
      // 侧栏
      open: false,
      tabName: 'first'
    };
  },
  components: {
    BizPagination,
    BizHeader,
    BizChart
  },
  methods: {
    operate(name) {
      this[name]();
    },
    export() {
      let params = {
        dateType: this.filters[0].value,
        beginDate: this.filters[2]
          ? this.filters[2].value[0]
          : this.filters[1].value[0],
        endDate: this.filters[2]
          ? this.filters[2].value[1]
          : this.filters[1].value[1]
      };
      let paramUrl = [];
      for (let name in params) {
        paramUrl.push(`${name}=${params[name]}`);
      }
      let linkedUrl =
        `${customerService.SmartToShop.statisticsAnalysisExport}?` +
        paramUrl.join('&');
      console.log('url: ', linkedUrl);
      window.open(linkedUrl);
    },
    dateConverter(date) {
      return dates.dateConverter(new Date(date));
    },
    resize() {
      this.$nextTick(() => {
        let height =
          document.documentElement.clientHeight || window.innerHeight;
        this.height = String(height - 82);
      });
    },
    // 视图切换
    onSwitch(name) {
      switch (name) {
        case 'table':
          this.views[0].actived = true;
          this.views[1].actived = false;
          this.view = 'table';
          break;
        case 'chart':
          this.views[0].actived = false;
          this.views[1].actived = true;
          this.view = 'chart';
          break;
        default:
          break;
      }
    },
    filterDataChange(val) {
      this.chartData = this.formatToChart(this.tableData);
      this.refresh();
    },
    handleSizeChange(pageSize) {
      this.pagination.pageSize = pageSize;
      // this.refresh();
    },
    handleCurrentChange(pageNumber) {
      this.pagination.currentPage = pageNumber;
      // this.refresh();
    },
    // 刷新
    refresh() {
      let begin = new Date(this.filters[this.filters.length - 1].value[0]);
      let end = new Date(this.filters[this.filters.length - 1].value[1]);
      if (
        this.view === 'chart' &&
        (this.filters[0].value === 'month' &&
          (begin.getFullYear() === end.getFullYear() &&
            begin.getMonth() === end.getMonth()))
      ) {
        this.$message({
          message: '按月查询时起止时间请选择不同月份',
          showClose: true,
          type: 'warning'
        });
        this.filters[0].value = 'day';
        return;
      }
      if (
        this.view === 'chart' &&
        (this.filters[2].value[0] > this.today ||
          this.filters[2].value[1] > this.today)
      ) {
        this.$message.warning({
          message: '不能选择将来的时间',
          showClose: true
        });
        this.filters[0].value = 'month';
        this.getFormatDate();
        return;
      }
      if (
        this.view === 'chart' &&
        (this.filters[0].value === 'day' &&
          (begin.getFullYear() !== end.getFullYear() ||
            begin.getMonth() !== end.getMonth()))
      ) {
        this.$message({
          showClose: true,
          message: '按日查询时开始与结束日期应在同一个月',
          type: 'warning'
        });
        this.filters[0].value = 'month';
        return;
      }
      this.pagination = {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        // 总条目数
        total: 0
      };
      this.loading = true;
      let params = {
        dateType: this.filters[0].value,
        beginDate: this.filters[2]
          ? this.filters[2].value[0]
          : this.filters[1].value[0],
        endDate: this.filters[2]
          ? this.filters[2].value[1]
          : this.filters[1].value[1]
      };
      http
        .get(customerService.SmartToShop.statisticsAnalysisQueryList, params)
        .then(data => {
          this.loading = false;
          this.tableData = this.formatToList(data.data);
          this.chartData = this.formatToChart(this.tableData);
          this.pagination.total = Number(this.tableData.length);
        })
        .catch(ErrorData => {
          this.loading = false;
          this.$message({
            showClose: true,
            message: ErrorData.errorMessage,
            type: 'warning'
          });
          console.log('ERR_INIT: ', ErrorData);
        });
    },
    // 转换为列表数据
    formatToList(data) {
      let tmp = [];
      for (let name in data) {
        tmp.push(Object.assign({ date: name }, data[name]));
      }
      return tmp;
    },
    // 转换为图表数据
    formatToChart(data) {
      let tmpData = [];
      for (let i = 0; i < data.length; i++) {
        tmpData.push({
          日期:
            this.filters[0].value === 'day'
              ? data[i].date.slice(5, 10)
              : data[i].date,
          [this.kpiName[0]]: data[i][this.filters[1].value],
          [this.kpiName[1]]: Number(data[i].rate.slice(0, -1)) / 100
        });
      }
      let chartData = {
        type: 'histogram',
        data: {
          columns: ['日期', this.kpiName[0], this.kpiName[1]],
          rows: tmpData
        },
        settings: {
          metrics: [
            this.kpiName[0],
            this.filters[1].value === 'money' ? '' : this.kpiName[1]
          ],
          showLine: this.kpiName[1],
          yAxisType: ['normal', 'percent'],
          yAxisName: [
            this.kpiName[0],
            this.filters[1].value === 'money' ? '' : this.kpiName[1]
          ]
        }
      };
      if (this.filters[1].value === 'receptionCount') {
        this.$set(chartData.settings, 'axisSite', { right: [this.kpiName[1]] });
      }
      return chartData;
    },
    showMessage(msg, type) {
      this.$message({
        message: msg,
        type: type,
        showClose: true
      });
    }
  },
  created() {},
  mounted() {
    this.resize();
    http
      .get(customerService.SmartToShop.statisticsAnalysisQueryList, {})
      .then(data => {
        this.showMessage(
          `查看近期到店情况，可生成报表或进行图表分析。上次统计时间：${
            data.lastTime
          }`,
          'info'
        );
      })
      .catch();
    this.refresh();
  },
  computed: {
    currentTableData() {
      return this.tableData.slice(
        (this.pagination.currentPage - 1) * this.pagination.pageSize,
        this.pagination.currentPage * this.pagination.pageSize
      );
    },
    kpiName: function() {
      if (this.filters[1].value === 'money') {
        return ['  消费金额'];
      } else {
        return ['  接待人数', '会员占比'];
      }
    }
  },
  watch: {
    view(newVal, oldVal) {
      // this.refresh();
      // this.operations[0].disabled = newVal === 'chart';
      let filter = {
        type: 'select',
        value: 'receptionCount',
        label: '统计指标',
        options: [
          { label: '接待人数', value: 'receptionCount' },
          { label: '消费金额', value: 'money' }
        ]
      };
      this.filters.length === 3
        ? this.filters.splice(1, 1)
        : this.filters.splice(1, 0, filter);
    }
  }
};
</script>

<style lang="scss">
.smart-to-shop-analysis {
  .chart-group {
    margin-top: 20px;
    display: flex;
    flex-wrap: wrap;
    .chart-block {
      .chart-title {
        margin-left: 30px;
        display: flex;
        justify-content: space-between;
        padding-left: 5px;
        border-left: 5px solid #ff7300;
        .el-select {
          height: 20px;
        }
      }
    }
    .biz-chart {
      // min-width: 0;
      width: 100%;
      .chart-area {
        margin-top: 0;
      }
    }
  }
}
</style>
