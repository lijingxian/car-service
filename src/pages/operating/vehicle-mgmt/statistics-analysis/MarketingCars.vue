<template>
  <div class="vehicle-mgmt-marketing-cars">
    <biz-grid>
      <biz-header :operations="operations" @operate="operate" :filters="filters" @filterDataChange="filterDataChange">
      </biz-header>
      <!-- 顶部统计表格 -->
      <analysis-header :headerData="totalData"></analysis-header>
      <biz-table-body ref="table" v-show="filters[1].value === 'control'" :tableData="currentTable" :height="'565'"
        :pagination="pagination" @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange">
        <el-table-column prop="date" label="日期"></el-table-column>
        <el-table-column prop="fence" label="入围栏/出围栏(次)">
          <template slot-scope="scope">
            {{scope.row.fenceinReminder}}/{{scope.row.fenceoutReminder}}
          </template>
        </el-table-column>
        <el-table-column prop="faultTimes" label="故障(次)"></el-table-column>
        <el-table-column prop="collision" label="碰撞(次)"></el-table-column>
        <el-table-column prop="underVoltage" label="欠压(次)"></el-table-column>
        <el-table-column prop="fire" label="点火/熄火(次)">
          <template slot-scope="scope">
            {{scope.row.ignitionTimes}}/{{scope.row.flameoutTimes}}
          </template>
        </el-table-column>
        <el-table-column prop="plug" label="插电/拔出(次)">
          <template slot-scope="scope">
            {{scope.row.pluginDevice}}/{{scope.row.plugoutDevice}}
          </template>
        </el-table-column>
        <el-table-column prop="highTemperature" label="高温(次)"></el-table-column>
        <el-table-column prop="towaway" label="被拖吊(次)"></el-table-column>
      </biz-table-body>
      <biz-table-body ref="table" v-show="filters[1].value === 'drivingAction'" :tableData="currentTable" :height="'565'"
        :pagination="pagination" @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange">
        <el-table-column prop="date" label="日期"></el-table-column>
        <el-table-column prop="drivingActionMap[3]" label="急减速(次)"></el-table-column>
        <el-table-column prop="drivingActionMap[2]" label="急加速(次)"></el-table-column>
        <el-table-column prop="drivingActionMap[7]" label="急转弯(次)"></el-table-column>
        <el-table-column prop="drivingActionMap[5]" label="急刹车(次)"></el-table-column>
        <el-table-column prop="drivingActionMap[9]" label="高转速(次)"></el-table-column>
        <el-table-column prop="drivingActionMap[4]" label="长怠速(次)"></el-table-column>
      </biz-table-body>
      <!-- 时长里程分析 -->
      <biz-chart :chartData="rangeChartData" ref="rangeChart" v-if="filters[1].value === 'miles'" :loading="loading"
        :chartHeight="chartHeight" :showSearch="false"></biz-chart>
      <!-- 油耗分析 -->
      <biz-chart :chartData="oilChartData" ref="oilChart" v-if="filters[1].value === 'oil'" :loading="loading"
        :chartHeight="chartHeight" :showSearch="false"></biz-chart>
    </biz-grid>
  </div>
</template>

<script>
import BizHeader from '@/components/BizTable/BizHeader';
import BizTableBody from '@/components/BizTable/BizTableBody';
import AnalysisHeader from '../component/AnalysisHeader';
import BizChart from '@/components/BizChart';
import { BizGrid } from '@/components/BizGrid';
import service from '@/service/vehicle-mgmt/StatisticsAnalysis';

export default {
  name: 'MarketingCars',
  data() {
    return {
      loading: false,
      today: '',
      operations: [{ label: '搜索', name: 'refresh', type: '' }, { label: '导出', name: 'export', type: '' }],
      filters: [
        {
          type: 'select',
          label: '车队',
          name: 'driver',
          value: '',
          options: []
        },
        {
          type: 'select',
          label: '类型',
          name: 'type',
          value: 'oil',
          options: [
            {
              value: 'control',
              label: '管控分析'
            },
            {
              value: 'drivingAction',
              label: '驾驶行为分析'
            },
            {
              value: 'miles',
              label: '时长里程分析'
            },
            {
              value: 'oil',
              label: '油耗分析'
            }
          ]
        },
        { type: 'daterange', label: '日期区间：', value: ['2011-11-11', '2012-12-12'] }
      ],
      tableData: [],
      rangeChartData: {
        type: 'histogram',
        data: {
          columns: ['日期', '行驶里程', '行驶时长'],
          rows: []
        },
        settings: {
          metrics: ['行驶里程', '行驶时长'],
          showLine: ['行驶里程', '行驶时长'],
          yAxisType: ['normal', 'normal'],
          yAxisName: ['       行驶里程(km)', '行驶时长(h)'],
          axisSite: { right: ['行驶时长(h)'] }
        }
      },
      oilChartData: {
        type: 'histogram',
        data: {
          columns: ['日期', '总油耗(L)'],
          rows: []
        },
        settings: {
          metrics: ['总油耗'],
          showLine: ['总油耗'],
          yAxisType: ['normal'],
          yAxisName: [' 总油耗(L)']
        }
      },
      pagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        // 总条目数
        total: 0
      },
      chartHeight: '560px',
      // 获取到的全部数据
      totalData: {}
    };
  },
  methods: {
    operate(name) {
      this[name]();
    },
    export() {
      let params = {
        fleetName: !this.$route.query.terminalId ? this.filters[0].value || '' : '',
        type: this.filters[1].value || '',
        summaryMode: 'date',
        dateRange: `${this.filters[2].value[0] || ''}-${this.filters[2].value[1] || ''}`
      };
      service.marketingCarsExport(params, data => {}, ErrorData => {});
    },
    filterDataChange(value) {
      this.filters = value;
      if (this.$route.query.id) {
        this.refresh(this.$route.query.id);
      }
      // if (this.filters[1].value === 'miles') {
      //   this.$nextTick(() => {
      //     this.$refs.rangeChart.$refs.chart.echarts.resize();
      //   });
      // }
      // if (this.filters[1].value === 'oil') {
      //   this.$nextTick(() => {
      //     this.$refs.oilChart.$refs.chart.echarts.resize();
      //   });
      // }
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
    refresh(id) {
      if (!id) {
        id = this.$route.query.id;
      }
      if (this.filters[2].value[0] > this.today || this.filters[2].value[1] > this.today) {
        this.$message.warning({
          message: '不能选择将来的时间',
          showClose: true
        });
        this.getFormatDate();
        return;
      }
      let params = {
        fleetId: !this.$route.query.terminalId ? (id ? '' : this.filters[0].value) : '',
        carId: !this.$route.query.terminalId ? id || '' : '',
        terminalId: this.$route.query.terminalId,
        type: this.filters[1].value || '',
        beginTimeStr: this.filters[2].value[0] || '',
        endTimeStr: this.filters[2].value[1] || ''
      };
      this.loading = true;
      service.queryMarketingCarsData(
        params,
        data => {
          this.totalData = data.totalData;
          this.loading = false;
        },
        ErrorData => {
          this.loading = false;
        }
      );
      let newParams = {
        treeNodeId: !this.$route.query.terminalId ? (id ? '' : `fleet_${this.filters[0].value}`) : '',
        terminalId: this.$route.query.terminalId,
        fleetCarId: !this.$route.query.terminalId ? id || '' : '',
        type: this.filters[1].value || '',
        summaryMode: 'date',
        beginTimeStr: this.filters[2].value[0] || '',
        endTimeStr: this.filters[2].value[1] || ''
      };
      this.loading = true;
      service.queryMarketingCarsChart(
        newParams,
        data => {
          this.loading = false;
          this.tableData = data.statisticsData;
          this.pagination.total = data.statisticsData.length;
          this.rangeChartData.data.rows = [];
          this.oilChartData.data.rows = [];
          data.statisticsData.map(data => {
            this.rangeChartData.data.rows.push({
              日期: data.date,
              行驶里程: data.totalMilesOriginal,
              行驶时长: data.driveTimesOriginal
            });
            this.oilChartData.data.rows.push({ 日期: data.date, 总油耗: data.totalOil });
          });
        },
        ErrorData => {
          this.loading = false;
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
          // this.refresh();
        },
        ErrorData => {
          console.log('ERR_GET_FLEET: ', ErrorData);
        }
      );
    },
    // 获取今天以及30天前的日期
    getFormatDate() {
      let date = new Date();
      this.filters[2].value[1] = `${date.getFullYear()}-${
        date.getMonth() < 9 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
      }-${date.getDate() < 10 ? '0' + date.getDate() : date.getDate()}`;
      this.today = this.filters[2].value[1];
      let halfYearAgo = function() {
        let dt = new Date();
        dt.setDate(1);
        return `${dt.getFullYear()}-${dt.getMonth() < 9 ? '0' + (dt.getMonth() + 1) : dt.getMonth() + 1}-${
          dt.getDate() < 10 ? '0' + dt.getDate() : dt.getDate()
        }`;
      };
      this.filters[2].value[0] = halfYearAgo();
    }
  },
  mounted() {
    if (this.$route.query.id) {
      let id = this.$route.query.id;
      let plateNumber = this.$route.query.plateNumber;
      this.filters[0].label = '车牌号';
      this.filters[0].value = id;
      this.filters[0].options = [{ value: id, label: plateNumber }];
      // this.refresh(id);
    }
    if (this.$route.query.terminalId) {
      let id = this.$route.query.terminalId;
      let number = this.$route.query.number;
      this.filters[0].label = '设备序列号';
      this.filters[0].value = id;
      this.filters[0].options = [{ value: id, label: number }];
      // this.refresh(id);
    } else {
      this.queryCarFleet();
    }
    // this.refresh();
  },
  created() {
    this.getFormatDate();
  },
  computed: {
    currentTable() {
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
.vehicle-mgmt-marketing-cars {
  height: 100%;
  overflow: auto;
  .biz-table-body .biz-pagination {
    justify-content: flex-end;
  }
  .el-pagination {
    margin-right: 100px;
  }
  .biz-table-filter .filter-wrap .biz-select .el-select {
    width: 140px;
  }
  .biz-table-filter .filter-wrap .biz-date-range .el-date-editor--daterange.el-input__inner {
    width: 240px;
  }
  .biz-chart .chart-area {
    margin-top: 0;
  }
}
</style>
