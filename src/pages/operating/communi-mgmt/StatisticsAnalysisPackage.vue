<template>
  <div class="communicating-card-kpi-report">
    <biz-chart :chartData="chartData" :filters="filters" :showSearch="false" @filterDataChange="filterDataChange" :loading="loading" :chartHeight="chartHeight"></biz-chart>
  </div>
</template>

<script>
import BizChart from '@/components/BizChart';
import service from '@/service/communi-mgmt/statisticsAnalysis';

export default {
  name: 'ActivityKpiReport',
  data() {
    return {
      today: '',
      oldCompanyValue: '',
      chartHeight: '600px',
      loading: true,
      filters: [
        {
          type: 'select',
          label: '查看类型',
          value: 'month',
          options: [{ value: 'day', label: '按日' }, { value: 'month', label: '按月' }]
        },
        {
          type: 'select',
          label: '运营商',
          value: '',
          options: []
        },
        {
          type: 'select',
          label: '套餐',
          value: '',
          options: [{ value: '', label: '全部' }]
        },
        {
          type: 'select',
          label: '统计指标',
          value: 'price',
          options: [{ value: 'price', label: '销售额' }, { value: 'count', label: '销量' }, { value: 'profit', label: '利润' }]
        },
        {
          type: 'daterange',
          label: '日期区间：',
          value: ['2011-11-11', '2012-12-12']
        }
      ],
      chartData: {}
    };
  },
  methods: {
    init() {
      let begin = new Date(this.filters[4].value[0]);
      let end = new Date(this.filters[4].value[1]);
      if (
        this.filters[0].value === 'month' &&
        (begin.getFullYear() === end.getFullYear() && begin.getMonth() === end.getMonth())
      ) {
        this.$message({
          message: '按月查询时起止时间请选择不同月份',
          showClose: true,
          type: 'warning'
        });
        this.filters[0].value = 'day';
        return;
      }
      if (this.filters[4].value[0] > this.today || this.filters[4].value[1] > this.today) {
        this.$message.warning({
          message: '不能选择将来的时间',
          showClose: true
        });
        this.filters[0].value = 'month';
        this.getFormatDate();
        return;
      }
      if (this.filters[0].value === 'day' && (begin.getFullYear() !== end.getFullYear() || begin.getMonth() !== end.getMonth())) {
        this.$message({
          showClose: true,
          message: '按日查询时开始与结束日期应在同一个月',
          type: 'warning'
        });
        this.filters[0].value = 'month';
        return;
      }
      this.loading = true;
      let params = {
        timeType: this.filters[0].value,
        telecomOperatorId: this.filters[1].value,
        rechargePackageId: this.filters[2].value,
        kpi: this.filters[3].value,
        beginDate: this.filters[4].value[0] ? this.filters[4].value[0] : '',
        endDate: this.filters[4].value[1] ? this.filters[4].value[1] : ''
      };
      service.queryPackage(
        params,
        data => {
          this.loading = false;
          this.chartData = this.dataFormat(data);
        },
        ErrorData => {
          this.loading = false;
          if (ErrorData.resultCode === '779') {
            this.filters[0].value = 'month';
          }
          this.$message({
            showClose: true,
            message: ErrorData.errorMessage,
            type: 'warning'
          });
          console.log('ERR_INIT: ', ErrorData);
        }
      );
    },
    // 查询运营商列表
    queryCompanyList() {
      let params = {
        pageNumber: 1,
        pageSize: 1000
      };
      service.queryCompany(
        params,
        data => {
          this.filters[1].options = data.content.map(company => {
            return { value: company.id, label: company.name };
          });
          this.filters[1].value = this.filters[1].options[0].value;
          this.oldCompanyValue = this.filters[1].value;
          this.queryPackageList();
        },
        ErrorData => {
          this.$message({
            showClose: true,
            message: ErrorData.errorMessage,
            type: 'warning'
          });
          console.log('ERR_QUERY_COMPANY: ', ErrorData);
        }
      );
    },
    queryPackageList() {
      let params = {
        telecomOperatorId: this.filters[1].value
      };
      service.queryPackageList(
        params,
        data => {
          let pakcageAll = [{ value: '', label: '全部' }];
          this.filters[2].options = pakcageAll.concat(
            data.dataList.map(pack => {
              return { value: pack.id, label: pack.name };
            })
          );
          // this.init();
        },
        ErrorData => {
          this.$message({
            showClose: true,
            message: ErrorData.errorMessage,
            type: 'warning'
          });
          console.log('ERR_QUERY_PACKAGE: ', ErrorData);
        }
      );
    },
    filterDataChange(val) {
      if (this.oldCompanyValue !== val[1].value) {
        // 这里会触发一次change
        this.filters[2].value = '';
        this.queryPackageList();
        this.init();
        this.oldCompanyValue = val[1].value;
      } else {
        this.init();
      }
    },
    // 格式化数据
    dataFormat(data) {
      let tmpData = [];
      for (let i = 0; i < data.histogram.length; i++) {
        tmpData.push({
          日期: this.filters[0].value === 'day' ? data.histogram[i].refDate.slice(5, 10) : data.histogram[i].refDate,
          [this.kpiName[0]]: data.histogram[i].value,
          [this.kpiName[1]]: data.lineChat.length === 0 ? '' : data.lineChat[i].value === '0' ? '0' : data.lineChat[i].value
        });
      }
      let chartData = {
        type: 'histogram',
        data: {
          columns: ['日期', this.kpiName[0], this.kpiName[1]],
          rows: tmpData
        },
        settings: {
          metrics: [this.kpiName[0], data.lineChat.length === 0 ? '' : this.kpiName[1]],
          showLine: this.kpiName[1],
          yAxisType: ['normal', 'normal'],
          yAxisName: [this.kpiName[0], data.lineChat.length === 0 ? '' : this.kpiName[1]]
        }
      };
      if (this.filters[0].value === 'month') {
        chartData.settings.axisSite = { right: [this.kpiName[1]] };
      }
      return chartData;
    },
    // 获取今天以及六个月前的日期
    getFormatDate() {
      let date = new Date();
      this.filters[4].value[1] = `${date.getFullYear()}-${
        date.getMonth() < 9 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
      }-${date.getDate() < 10 ? '0' + date.getDate() : date.getDate()}`;
      this.today = this.filters[4].value[1];
      let halfYearAgo = function() {
        let dt = new Date();
        dt.setMonth(dt.getMonth() - 6);
        return `${dt.getFullYear()}-${dt.getMonth() < 9 ? '0' + (dt.getMonth() + 1) : dt.getMonth() + 1}-${
          dt.getDate() < 10 ? '0' + dt.getDate() : dt.getDate()
        }`;
      };
      this.filters[4].value[0] = halfYearAgo();
    }
  },
  computed: {
    kpiName: function() {
      if (this.filters[3].value === 'price') {
        return ['  销售额', '累计销售额'];
      }
      if (this.filters[3].value === 'count') {
        return ['  销量', '累计销量'];
      }
      if (this.filters[3].value === 'profit') {
        return ['  利润', '累计利润'];
      }
      return [];
    }
  },
  created() {
    this.getFormatDate();
    this.queryCompanyList();
    // this.oldCompanyValue = this.filters[1].value;
  },
  mounted() {
    this.$message.info({
      message: '可在此处了解通讯卡套餐的销售,盈利情况',
      showClose: true
    });
  },
  components: {
    BizChart
  }
};
</script>

<style lang="scss">
.communicating-card-kpi-report {
  height: 100%;
  overflow: auto;
  .biz-table-filter .filter-wrap .biz-select .el-select {
    width: 150px;
  }
}
</style>
