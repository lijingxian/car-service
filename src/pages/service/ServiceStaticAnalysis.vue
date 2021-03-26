<template>
  <div class="marketing-statistics-activity-kpi-report">
    <biz-chart :chartData="chartData" :filters="filters" @filterDataChange="filterDataChange" :loading="loading" :pagination="pagination"
      @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange" @refreshHandle="refreshHandle" @exportExcle="exportExcle">
      <div slot="list">
        <biz-list ref="list" :height="height" :tableData="tableData" style="width: 100%" v-if="filters[0].value!=='workSheetCnt'&&filters[0].value!=='workSheetDuration'">
          <el-table-column prop="csAccountName" label="客服人员">
          </el-table-column>
          <el-table-column prop="date" label="日期">
          </el-table-column>
          <el-table-column prop="mobile" label="用户手机号">
          </el-table-column>
          <el-table-column prop="startTime" label="开始时间">
          </el-table-column>
          <el-table-column prop="endTime" label="结束时间">
          </el-table-column>
          <el-table-column prop="length" label="会话时长（分钟）">
          </el-table-column>
          <el-table-column prop="memberScore" label="用户评分（分）">
          </el-table-column>
          <el-table-column prop="managerScore" label="质检评分（分）">
          </el-table-column>
        </biz-list>
        <biz-list ref="list" :height="height" :tableData="tableData" style="width: 100%" v-if="filters[0].value==='workSheetCnt'||filters[0].value==='workSheetDuration'">
          <el-table-column prop="number" label="工单号">
          </el-table-column>
          <el-table-column prop="date" label="日期">
          </el-table-column>
          <el-table-column prop="type" label="工单类型">
          </el-table-column>
          <el-table-column prop="sponsor" label="发起人">
          </el-table-column>
          <el-table-column prop="handler" label="受理人">
          </el-table-column>
          <el-table-column prop="createDate" label="创建日期">
          </el-table-column>
          <el-table-column prop="modifyDate" label="更新日期">
          </el-table-column>
          <el-table-column prop="length" label="处理时长（分钟）">
          </el-table-column>
        </biz-list>
      </div>
      <div slot="description">
        <p>会话数量：统计期内客服会话数量总计</p>
        <p>用户满意度：统计期内客服会话--用户评分平均值</p>
        <p>会话时长：统计期内所有会话时长的平均值</p>
        <p>质检评分：统计期内客服会话--质检评分平均值</p>
        <p>工单数量：统计期内创建的工单数量</p>
        <p>工单处理时长：统计期内工单的处理时长平均值，若工单未完结，结束时间按统计时间计算</p>
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
          value: 'sessionCnt',
          options: [
            { value: 'sessionCnt', label: '会话数量' },
            { value: 'serviceSatisfaction', label: '用户满意度' },
            { value: 'sessionDuration', label: '会话时长' },
            { value: 'managerScore', label: '质检评分' },
            { value: 'workSheetCnt', label: '工单数量' },
            { value: 'workSheetDuration', label: '工单处理时长' }
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
        .get(urls.customerService.statisticsAnalysis.serviceReport, params)
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
        .get(urls.customerService.statisticsAnalysis.serviceTable, params)
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
        .get(urls.customerService.statisticsAnalysis.serviceExport, params)
        .then()
        .catch(data => {
          if (!data.errorMessage && data !== '没有符合条件的数据') {
            let paramsArr = [];
            for (let name in params) {
              paramsArr.push(`${name}=${params[name]}`);
            }
            let linkedUrl =
              `${urls.customerService.statisticsAnalysis.serviceExport}?` +
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
          showLine: [this.kpiName[1], this.kpiName[2]]
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
