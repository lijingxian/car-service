<template>
  <div class="marketing-statistics-activity-kpi-report">
    <biz-chart :chartData="chartData" :filters="filters" @filterDataChange="filterDataChange" :loading="loading" :pagination="pagination"
      @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange" @refreshHandle="refreshHandle" @exportExcle="exportExcle">
      <div slot="list">
        <biz-list ref="list" :height="height" :tableData="tableData" style="width: 100%">
          <el-table-column prop="type" label="费用类型">
          </el-table-column>
          <el-table-column prop="happenDate" label="日期">
          </el-table-column>
          <el-table-column prop="cost" label="费用金额(元)">
          </el-table-column>
          <el-table-column prop="plateNumber" label="车牌号">
          </el-table-column>
          <el-table-column prop="fleetName" label="车队">
          </el-table-column>
          <el-table-column prop="driverName" label="驾驶员">
          </el-table-column>
        </biz-list>
      </div>
      <div slot="description">
        <p>总费用：统计期内，所选车队/驾驶员通过审批的所有费用</p>
        <p>油电费用：统计期内，所选车队/驾驶员通过审批的油费、电费、气费</p>
        <p>维修保养费：统计期内，所选车队/驾驶员通过审批的维修费、保养费</p>
        <p>违章罚款费：统计期内，所选车队/驾驶员通过审批的违章罚款费</p>
        <p>保险年检费：统计期内，所选车队/驾驶员通过审批的保险费、年检费</p>
        <p>其他费用：统计期内，所选车队/驾驶员通过审批的车品费、救援费、洗车费、停车费、路桥费、自定义费用</p>
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
import service from '@/service/vehicle-mgmt/StatisticsAnalysis.js';
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
      // 第一个选择框旧值
      oldFilter: '',
      tableData: [],
      filters: [
        {
          type: 'select',
          label: '车队',
          name: 'car',
          value: '',
          options: []
        },
        {
          type: 'select',
          label: '驾驶员',
          name: 'driver',
          value: '',
          options: []
        },
        {
          type: 'select',
          label: '统计指标',
          value: 'totalAmount',
          options: [
            { value: 'totalAmount', label: '总费用' },
            { value: 'oilElectricity', label: '油电气费' },
            { value: 'maintain', label: '维修保养费' },
            { value: 'violation', label: '违章罚款费' },
            { value: 'inspectInsurance', label: '年检保险费' },
            { value: 'othersAmount', label: '其他费用' }
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
        fleetId: this.filters[0].value,
        driverId: this.filters[1].value,
        indicator: this.filters[2].value,
        beginDate: this.beginDate,
        endDate: this.endDate,
        shopId: window.top.SHOP_ID || '',
        pageSize: this.pagination.pageSize,
        pageNumber: this.pagination.currentPage
      };
      http
        .get(urls.staticAnalisisi.expenseGraph, params)
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
        fleetId: this.filters[0].value,
        driverId: this.filters[1].value,
        indicator: this.filters[2].value,
        beginDate: this.beginDate,
        endDate: this.endDate,
        shopId: window.top.SHOP_ID || '',
        pageSize: this.pagination.pageSize,
        pageNumber: this.pagination.currentPage
      };
      http
        .get(urls.staticAnalisisi.expenseTable, params)
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
    // 查询车队列表
    getCarFleet() {
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
    // 根据车队Id查询驾驶员列表
    queryDriverList(fleetId) {
      let params = {
        fleetId: fleetId,
        pageSize: '200'
      };
      service.queryDriverList(
        params,
        data => {
          let tmp = [{ label: '全部', value: '' }];
          data.listFleetDriver.map(driver => {
            tmp.push({ value: driver.id, label: driver.userName });
          });
          this.filters[1].options = tmp;
          this.filters[1].value = this.filters[1].options[0]
            ? this.filters[1].options[0].value
            : '';
          // this.refresh();
        },
        ErrorData => {
          console.log('ERR_GET_DRIVER_LIST: ', ErrorData);
        }
      );
    },
    refreshHandle(val) {
      this.viewType = val.viewType;
      this.beginDate = val.date[0];
      this.endDate = val.date[1];
      this.init();
      this.getTable();
    },
    filterDataChange(value) {
      if (this.oldFilter !== value[0].value) {
        this.queryDriverList(value[0].value);
        this.oldFilter = value[0].value;
      }
      this.filters = value;
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
        fleetId: this.filters[0].value,
        driverId: this.filters[1].value,
        indicator: this.filters[2].value,
        beginDate: this.beginDate,
        endDate: this.endDate
      };
      http
        .get(urls.staticAnalisisi.expenseExport, params)
        .then()
        .catch(data => {
          if (!data.errorMessage && data !== '没有符合条件的数据') {
            let paramsArr = [];
            for (let name in params) {
              paramsArr.push(`${name}=${params[name]}`);
            }
            let linkedUrl =
              `${urls.staticAnalisisi.expenseExport}?` + paramsArr.join('&');
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
          yAxisName: '元'
        }
      };
      return chartData;
    }
  },
  computed: {},
  created() {
    this.getCarFleet();
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
