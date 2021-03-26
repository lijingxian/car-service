<template>
  <div class="vehicle-mgmt-payment-analysis">
    <biz-grid>
      <biz-header :operations="operations" @operate="operate" :filters="filters" @filterDataChange="filterDataChange"></biz-header>
      <!-- 顶部统计栏 -->
      <div class="total">
        <div class="table">
          <div class="table-cell">总费用<span class="color-primary">{{total[4] || 0}}</span></div>
          <div class="table-cell">油(电)费<span class="color-primary">{{total[0] || 0}}</span></div>
          <div class="table-cell">产品费<span class="color-primary">{{total[1] || 0}}</span></div>
          <div class="table-cell">服务费<span class="color-primary">{{total[2] || 0}}</span></div>
          <div class="table-cell">其他费用<span class="color-primary">{{total[3] || 0}}</span></div>
        </div>
        单位: 元
      </div>
      <div class="chart-block">
        <div class="chart">
        <div class="chart-title">消费情况分析</div>
        <biz-chart :chartData="expenseAnalysisChartData" @events="events" :chartWidth="chartWidth" :chartHeight="chartHeight" :showSearch="false"></biz-chart>
        </div>
        <div class="chart">
          <div class="chart-title">费用占比分析</div>
          <biz-chart :chartData="expensePropotionChartData" :chartWidth="chartWidth" :chartHeight="chartHeight" :showSearch="false"></biz-chart>
        </div>
        <div class="chart">
          <div class="chart-title">同比分析
          </div>
          <biz-chart :chartData="expenseYearOnYear" :chartWidth="chartWidth" :chartHeight="chartHeight" :showSearch="false"></biz-chart>
          <biz-chart :showSearch="false"></biz-chart>
        </div>
        <div class="chart">
          <div class="chart-title">环比分析
          </div>
          <biz-chart :chartData="expenseMonthOnMonth" :chartWidth="chartWidth" :chartHeight="chartHeight"  :showSearch="false"></biz-chart>
          <biz-chart :showSearch="false"></biz-chart>
        </div>
      </div>
    </biz-grid>
  </div>
</template>

<script>
import BizHeader from '@/components/BizTable/BizHeader';
import BizChart from '@/components/BizChart';
import { BizGrid } from '@/components/BizGrid';
import service from '@/service/vehicle-mgmt/StatisticsAnalysis.js';
export default {
  name: 'PaymentAnalysis',
  data () {
    return {
      today: '',
      total: [],
      // 第一个选择框旧值
      oldFilter: '',
      operations: [
        { label: '查询', name: 'refresh', type: '' },
        { label: '重置', name: 'reset', type: '' }
      ],
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
          type: 'daterange',
          label: '日期区间',
          value: ['2011-11-11', '2012-12-12']
        }
      ],
      chartOption: '',
      // 图表高度
      chartHeight: '470px',
      chartWidth: '500px',
      // 消费情况分析
      expenseAnalysisChartData: {
        type: 'histogram',
        data: {
          columns: ['日期', '油(电)费', '产品费', '服务费', '其他费用', '总费用'],
          rows: [
            // {'日期': '2018-04-04', '油(电)费': 600, '产品费': 487, '服务费': 666, '其他费用': 123},
            // {'日期': '2018-04-04', '油(电)费': 422, '产品费': 684, '服务费': 555, '其他费用': 456},
            // {'日期': '2018-04-04', '油(电)费': 500, '产品费': 348, '服务费': 333, '其他费用': 321},
            // {'日期': '2018-04-04', '油(电)费': 365, '产品费': 664, '服务费': 444, '其他费用': 654},
            // {'日期': '2018-04-04', '油(电)费': 498, '产品费': 227, '服务费': 777, '其他费用': 487},
            // {'日期': '2018-04-04', '油(电)费': 777, '产品费': 314, '服务费': 222, '其他费用': 658}
          ]
        },
        settings: {
          metrics: ['油(电)费', '产品费', '服务费', '其他费用', '总费用'],
          showLine: ['油(电)费', '产品费', '服务费', '其他费用', '总费用'],
          yAxisType: ['normal'],
          yAxisName: ['      消费情况分析']
        }
      },
      // 消费占比分析
      expensePropotionChartData: {
        // legendPosition: 'right',
        type: 'pie',
        data: {
          columns: ['type', 'value'],
          rows: []
        },
        settings: {
          radius: [60, 150],
          offsetY: 250
        }
      },
      // 费用同比分析
      expenseYearOnYear: {
        type: 'histogram',
        data: {
          columns: ['日期', '维修费', '保险费'],
          rows: []
        },
        settings: {
          metrics: ['维修费', '保险费'],
          showLine: ['保险费'],
          yAxisType: ['normal', 'normal'],
          yAxisName: ['维修费', '保险费'],
          axisSite: { right: ['保险费'] }
        }
      },
      // 费用环比分析
      expenseMonthOnMonth: {
        type: 'histogram',
        data: {
          columns: ['日期', '维修费', '保险费'],
          rows: []
        },
        settings: {
          metrics: ['维修费', '保险费'],
          showLine: ['保险费'],
          yAxisType: ['normal', 'normal'],
          yAxisName: ['维修费', '保险费'],
          axisSite: { right: ['保险费'] }
        }
      }
    };
  },
  methods: {
    operate(name) {
      this[name]();
    },
    filterDataChange(value) {
      if (this.oldFilter !== value[0].value) {
        this.queryDriverList(value[0].value);
        this.oldFilter = value[0].value;
      }
      this.filters = value;
      // this.refresh();
    },
    refresh() {
      if (this.filters[2].value[0] > this.today || this.filters[2].value[1] > this.today) {
        this.$message.warning({
          message: '不能选择将来的时间',
          showClose: true
        });
        this.getFormatDate();
        return;
      }
      // 最上方统计数据使用费用占比分析的数据
      // let params = {};
      // service.queryPayment(
      //   params,
      //   data => {},
      //   ErrorData => {}
      // );
      this.queryExpenseAnalysis();
      this.queryExpenseYearOnYear();
      this.queryExpensePropotion();
      this.queryExpenseMonthOnMonth();
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
          this.filters[1].value = this.filters[1].options[0] ? this.filters[1].options[0].value : '';
          // this.refresh();
        },
        ErrorData => {
          console.log('ERR_GET_DRIVER_LIST: ', ErrorData);
        }
      );
    },
    // 查询消费情况分析
    queryExpenseAnalysis() {
      let params = {
        fleetId: this.filters[0].value,
        memberId: this.filters[1].value,
        beginTimeStr: this.filters[2].value[0],
        endTimeStr: this.filters[2].value[1]
      };
      service.queryExpenseAnalysis(
        params,
        data => {
          let tmpRow = [];
          for (let i = 0; i < data.oilElectricity.length; i++) {
            tmpRow.push({
              日期: data.oilElectricity[i].date,
              '油(电)费': data.oilElectricity[i].count,
              产品费: data.product[i].count,
              服务费: data.service[i].count,
              其他费用: data.others[i].count,
              总费用: data.total[i].count
            });
          }
          this.expenseAnalysisChartData.data.rows = tmpRow;
        },
        ErrorData => {
          console.log('ERR_QUERY_EXPENSE_ANALYSIS: ', ErrorData);
        }
      );
    },
    // 查询消费占比分析
    queryExpensePropotion(year, month) {
      let params = {
        fleetId: this.filters[0].value,
        memberId: this.filters[1].value,
        year: year || this.filters[2].value[1].slice(0, 4),
        month: month || this.filters[2].value[1].slice(5, 7)
      };
      service.queryExpensePropotion(
        params,
        data => {
          this.expensePropotionChartData.data.rows = [
            { type: '油(电)费', value: data.oilElectricity },
            { type: '产品费', value: data.product },
            { type: '服务费', value: data.service },
            { type: '其他费用', value: data.others }
          ];
          this.total = [data.oilElectricity, data.product, data.service, data.others, Number(data.oilElectricity) + Number(data.product) + Number(data.service) + Number(data.others)];
        },
        ErrorData => {}
      );
    },
    // 查询消费同比分析
    queryExpenseYearOnYear(year, month) {
      let params = {
        fleetId: this.filters[0].value,
        memberId: this.filters[1].value,
        // 保险费
        carCostType: '4',
        year: year || this.filters[2].value[1].slice(0, 4),
        month: month || this.filters[2].value[1].slice(5, 7)
      };
      service.queryExpenseYearOnYear(
        params,
        data => {
          let row = [
            { 日期: data.lastYear, 保险费: data.lastYearCount },
            { 日期: data.thisYear, 保险费: data.thisYearCount }
          ];
          let params1 = {
            fleetId: this.filters[0].value,
            memberId: this.filters[1].value,
            // 维修费
            carCostType: '6',
            year: this.filters[2].value[1].slice(0, 4),
            month: this.filters[2].value[1].slice(5, 7)
          };
          service.queryExpenseYearOnYear(
            params1,
            data => {
              Object.assign(row[0], { 维修费: data.lastYearCount });
              Object.assign(row[1], { 维修费: data.thisYearCount });
              this.expenseYearOnYear.data.rows = row;
            },
            ErrorData => {}
          );
        },
        ErrorData => {}
      );
    },
    // 环比分析
    queryExpenseMonthOnMonth(year, month) {
      let params = {
        fleetId: this.filters[0].value,
        memberId: this.filters[1].value,
        // 保险费
        carCostType: '4',
        year: year || this.filters[2].value[1].slice(0, 4),
        month: month || this.filters[2].value[1].slice(5, 7)
      };
      service.queryExpenseMonthOnMonth(
        params,
        data => {
          let row = [
            { 日期: data.lastMonth, 保险费: data.lastMonthCount },
            { 日期: data.thisMonth, 保险费: data.thisMonthCount }
          ];
          let params1 = {
            fleetId: this.filters[0].value,
            memberId: this.filters[1].value,
            // 维修费
            carCostType: '6',
            year: this.filters[2].value[1].slice(0, 4),
            month: this.filters[2].value[1].slice(5, 7)
          };
          service.queryExpenseMonthOnMonth(
            params1,
            data => {
              Object.assign(row[0], { 维修费: data.lastMonthCount });
              Object.assign(row[1], { 维修费: data.thisMonthCount });
              this.expenseMonthOnMonth.data.rows = row;
            },
            ErrorData => {}
          );
        },
        ErrorData => {}
      );
    },
    // 获取今天以及30天前的日期
    getFormatDate() {
      let date = new Date();
      this.filters[2].value[1] = `${date.getFullYear()}-${date.getMonth() < 9 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1}-${date.getDate() < 10 ? '0' + date.getDate() : date.getDate()}`;
      this.today = this.filters[2].value[1];
      let halfYearAgo = function() {
        let dt = new Date();
        dt.setDate(1);
        return `${dt.getFullYear()}-${dt.getMonth() < 9 ? '0' + (dt.getMonth() + 1) : dt.getMonth() + 1}-${dt.getDate() < 10 ? '0' + dt.getDate() : dt.getDate()}`;
      };
      this.filters[2].value[0] = halfYearAgo();
    },
    // 图表点击事件
    events(val) {
      let year = val.name.split('-')[0];
      let month = val.name.split('-')[1].length === 1 ? '0' + val.name.split('-')[1] : val.name.split('-')[1];
      this.queryExpensePropotion(year, month);
      this.queryExpenseYearOnYear(year, month);
      this.queryExpenseMonthOnMonth(year, month);
    }
  },
  mounted() {
    this.getCarFleet();
    // this.refresh();
  },
  created() {
    this.getFormatDate();
  },
  components: {
    BizHeader,
    BizChart,
    BizGrid
  }
};
</script>

<style lang="scss">
.vehicle-mgmt-payment-analysis {
  height: 100%;
  overflow:auto;
  .biz-header {
    width: 100%;
    .filter-wrap .biz-select .el-select {
      width: 140px;
    }
  }

  .biz-chart{
    min-width: 0;
  }
  .total {
    width: 100%;
    height: 100px;
    margin: 20px 0;
    color: #606266;
    font-size: 14px;
    // font-weight: bold;
    display: flex;
    justify-content: center;
    align-items: flex-end;
    .table {
      width: 1000px;
      height: 100%;
      display: flex;
      font-size: 16px;
      line-height: 40px;
      margin: 0 10px;
      padding: 15px 0;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
      .table-cell {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        flex-basis: 100%;
        border-right: 2px solid #ebeef5;
        .color-primary {
        // display: inline-block;
        padding: 0 5px;
        color: #ff7300;
        font-size: 26px;
        font-weight: bold;
        }
      }
      .table-cell:last-child {
        border-right: none;
      }
    }
  }
  .chart-block {
    width: 1100px;
    margin: 0 auto;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    .chart {
      width: 500px;
      height: 500px;
      margin: 15px;
      .chart-title {
        display: flex;
        justify-content: space-between;
        padding-left: 5px;
        border-left: 5px solid #ff7300;
        .el-select {
          height: 20px;
        }
      }
    }
    .biz-chart .chart-area {
      margin-top: 0;
    }
  }
  .chart-title-selector-label {
    margin-right: 5px;
    font-size: 14px;
    color: #606266;
  }
}
</style>
