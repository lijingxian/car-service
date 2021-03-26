<template>
  <div class="vehicle-mgmt-car-speed">
    <biz-grid>
      <biz-header :operations="operations" @operate="operate" :filters="filters" @filterDataChange="filterDataChange"></biz-header>
      <analysis-header :headerData="totalData"></analysis-header>
      <biz-table-body ref="table" v-if="filters[4].value === 'table'" :tableData="currentTableData" :height="'565'" :pagination="pagination"
        @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange">
        <el-table-column prop="date" label="日期"></el-table-column>
        <el-table-column prop="speed" label="车速(km/h)"></el-table-column>
      </biz-table-body>
      <biz-chart :chartData="chartData" :showSearch="false" :loading="loading" v-if="filters[4].value === 'chart'" :chartHeight="chartHeight"></biz-chart>
    </biz-grid>
  </div>
</template>

<script>
import BizHeader from '@/components/BizTable/BizHeader';
import { BizGrid } from '@/components/BizGrid';
import BizTableBody from '@/components/BizTable/BizTableBody';
import AnalysisHeader from '../component/AnalysisHeader';
import BizChart from '@/components/BizChart';

import service from '@/service/vehicle-mgmt/StatisticsAnalysis';

export default {
  name: 'CarSpeed',
  data() {
    return {
      loading: false,
      today: '',
      // filter旧值
      oldFilterValue: '',
      oldSwitchValue: 'chart',
      operations: [{ label: '搜索', name: 'refresh', type: '' }, { label: '导出', name: 'export', type: '' }],
      totalData: {},
      filters: [
        {
          type: 'select',
          label: '车队',
          name: 'fleet',
          value: '',
          options: []
        },
        {
          type: 'select',
          label: '车辆',
          name: 'car',
          value: '',
          options: []
        },
        {
          type: 'input',
          label: '车速(km/h) >=',
          name: 'searchbar',
          value: '0'
        },
        {
          type: 'daterange',
          label: '日期区间：',
          value: ['2011-11-11', '2012-12-12']
        },
        {
          type: 'switch',
          label: '',
          activeValue: 'table',
          inactiveValue: 'chart',
          activeText: '列表统计',
          inactiveText: '图表统计',
          value: 'chart'
        }
      ],
      tableData: [],
      chartData: {
        type: 'histogram',
        data: {
          columns: ['日期', '车速'],
          rows: []
        },
        settings: {
          metrics: ['车速'],
          showLine: ['车速'],
          yAxisType: ['normal'],
          yAxisName: ['    车速(km/h)']
        }
      },
      pagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        // 总条目数
        total: 0
      },
      chartHeight: '560px'
    };
  },
  methods: {
    operate(name) {
      this[name]();
    },
    export() {
      let params = {
        plateNumber: this.filters[1].value,
        speed: this.filters[2].value,
        dateRange: `${this.filters[3].value[0]}-${this.filters[3].value[1]}`
      };
      service.speedExport(params, data => {}, ErrorData => {});
    },
    filterDataChange(value) {
      if (this.oldFilter !== value[0].value) {
        this.getCarList(value[0].value);
        this.oldFilter = value[0].value;
      }
      // if (this.oldSwitchValue !== value[4].value) {
      this.$set(this.operations[1], 'disabled', value[4].value === 'chart');
      // }
      this.filters = value;
    },
    // 分页
    handleSizeChange(val) {
      this.pagination.pageSize = val;
      // this.refresh();
    },
    // 跳页
    handleCurrentChange(val) {
      this.pagination.currentPage = val;
      // this.refresh();
    },
    refresh() {
      if (this.filters[3].value[0] > this.today || this.filters[3].value[1] > this.today) {
        this.$message.warning({
          message: '不能选择将来的时间',
          showClose: true
        });
        this.getFormatDate();
        return;
      }
      let params = {
        treeNodeId: `fleet_${this.filters[0].value}`,
        carId: this.filters[1].value,
        value: this.filters[2].value,
        beginTimeStr: this.filters[3].value[0],
        endTimeStr: this.filters[3].value[1]
      };
      // 查询上半部分表格
      service.querySpeed(
        params,
        data => {
          this.totalData = data.totalData;
        },
        ErrorData => {}
      );
      this.querySpeedChart();
    },
    // 查询车速图表
    querySpeedChart() {
      this.loading = true;
      let params = {
        treeNodeId: `fleet_${this.filters[0].value}`,
        fleetCarId: this.filters[1].value,
        type: 'carSpeed',
        summaryMode: 'date',
        value: this.filters[2].value || '0',
        beginTimeStr: this.filters[3].value[0],
        endTimeStr: this.filters[3].value[1]
      };
      service.queryMarketingCarsChart(
        params,
        data => {
          this.loading = false;
          this.tableData = data.statisticsData;
          this.pagination.total = Number(data.statisticsData.length);
          this.chartData.data.rows = [];
          data.statisticsData.map(data => {
            this.chartData.data.rows.push({
              日期: data.date,
              车速: data.speed
            });
          });
        },
        ErrorData => {
          this.loading = false;
          console.log('ERR_GET_CHART: ', ErrorData);
        }
      );
    },
    // 查询车队列表
    queryCarFleet() {
      let params = {
        fleetType: 'group',
        pageNumber: '1',
        pageSize: '200'
      };
      service.queryFleetList(
        params,
        data => {
          let fleetList = [];
          data.content.map(fleet => {
            fleetList.push({ value: fleet.id, label: fleet.name });
          });
          this.$set(this.filters[0], 'options', fleetList);
          this.filters[0].value = this.filters[0].options[0].value;
          console.log('fleetList: ', this.filters[0]);
        },
        ErrorData => {
          console.log('ERR_GET_FLEET: ', ErrorData);
        }
      );
    },
    // 根据车队Id查询车辆列表
    getCarList(fleetId) {
      let params = {
        fleetId: fleetId,
        pageSize: '200'
      };
      service.queryCarList(
        params,
        data => {
          let tmp = [];
          data.carList.map(car => {
            tmp.push({ value: car.id, label: car.plateNumber });
          });
          this.$set(this.filters[1], 'options', tmp);
          this.filters[1].value = '';
          this.refresh();
        },
        ErrorData => {}
      );
    },
    // 获取今天以及30天前的日期
    getFormatDate() {
      let date = new Date();
      this.filters[3].value[1] = `${date.getFullYear()}-${
        date.getMonth() < 9 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
      }-${date.getDate() < 10 ? '0' + date.getDate() : date.getDate()}`;
      this.today = this.filters[3].value[1];
      let halfYearAgo = function() {
        let dt = new Date();
        dt.setDate(1);
        return `${dt.getFullYear()}-${dt.getMonth() < 9 ? '0' + (dt.getMonth() + 1) : dt.getMonth() + 1}-${
          dt.getDate() < 10 ? '0' + dt.getDate() : dt.getDate()
        }`;
      };
      this.filters[3].value[0] = halfYearAgo();
    }
  },
  mounted() {
    // console.log(this.filters);
    // this.oldFilterValue = this.filters[0].value;
    this.queryCarFleet();
    // this.refresh();
  },
  created() {
    this.getFormatDate();
  },
  watch: {},
  computed: {
    currentTableData() {
      return this.tableData.slice(
        (this.pagination.currentPage - 1) * this.pagination.pageSize,
        this.pagination.currentPage * this.pagination.pageSize
      );
    }
  },
  components: {
    BizHeader,
    BizTableBody,
    BizChart,
    AnalysisHeader,
    BizGrid
  }
};
</script>

<style lang="scss">
.vehicle-mgmt-car-speed {
  height: 100%;
  overflow: auto;
  .el-input-group {
    width: 110px;
  }
  .biz-table-body .biz-pagination {
    justify-content: flex-end;
  }
  .el-pagination {
    margin-right: 100px;
  }
  .biz-table-filter .filter-wrap .biz-select .el-select {
    width: 110px;
  }
  .biz-chart .chart-area {
    margin-top: 0;
  }
  .biz-table-filter .filter-wrap {
    margin-left: 5px;
  }
}
</style>
