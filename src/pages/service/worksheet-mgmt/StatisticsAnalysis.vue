<template>
 <div class="work-sheet-mgmt-statistics-analysis">
   <biz-chart :chartData="chartData" :filters="filters" @filterDataChange="filterDataChange" :loading="loading" :chartHeight="chartHeight" :showSearch="false"></biz-chart>
 </div>
</template>

<script>
import BizChart from '@/components/BizChart';
import service from '@/service/customer-service/workSheetMgmt.js';
import { mapGetters } from 'vuex';
export default {
  name: 'WorkSheetStatisticsAnalysis',
  data () {
    return {
      today: '',
      // 监控数据筛选类型是否变化
      watchType: '',
      chartHeight: '600px',
      loading: true,
      filters: [
        {
          type: 'select',
          label: '查看类型',
          value: 'month',
          options: [
            { value: 'day', label: '按日' },
            { value: 'month', label: '按月' }
          ]
        },
        {
          type: 'select',
          label: '数据筛选',
          value: 'group',
          options: [
            { value: 'group', label: '群组' },
            { value: 'individual', label: '个人' }
          ]
        },
        {
          type: 'select',
          label: '',
          value: '',
          options: []
        },
        {
          type: 'select',
          label: '统计指标',
          value: 'sessionCount',
          options: [
            { value: 'sessionCount', label: '会话数量' },
            { value: 'sessionDuration', label: '会话时长' },
            { value: 'workSheetCount', label: '工单数量' }
          ]
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
    ...mapGetters(['getUser']),
    // 获取受理人列表
    querySponsorList() {
      let params = {
        pageSize: 200,
        storeId: this.getUser().shop.id,
        hierarchyId: '1'
      };
      service.querySponsorList(
        params,
        data => {
          this.filters[2].options = data.content.map(data => {
            return { value: data.id, label: data.nickname };
          });
          this.filters[2].value = this.filters[2].options[0].value;
          this.init();
        },
        ErrorData => {}
      );
    },
    // 获取受理组列表
    querySponsorGroupList() {
      let params = {
        pageSize: 200
      };
      service.querySponsorGroupList(
        params,
        data => {
          this.filters[2].options = data.content.map(data => {
            return { value: data.id, label: data.name };
          });
          this.filters[2].value = this.filters[2].options[0].value;
          this.init();
        },
        ErrorData => {}
      );
    },
    // 查询统计数据
    init() {
      let begin = new Date(this.filters[4].value[0]);
      let end = new Date(this.filters[4].value[1]);
      if (this.filters[0].value === 'month' && (begin.getFullYear() === end.getFullYear() && begin.getMonth() === end.getMonth())) {
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
        this.$message(
          {
            showClose: true,
            message: '按日查询时开始与结束日期应在同一个月',
            type: 'warning'
          }
        );
        this.filters[0].value = 'month';
        return;
      }
      this.loading = true;
      let params = {
        kpiCategory: 'csWorkSheet',
        kpiType: this.filters[3].value,
        dateType: this.filters[0].value,
        accountId: this.filters[1].value === 'individual' ? this.filters[2].value : '',
        groupId: this.filters[1].value === 'group' ? this.filters[2].value : '',
        beginDate: this.filters[4].value[0],
        endDate: this.filters[4].value[1]
      };
      service.queryKpi(
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
    filterDataChange(val) {
      if (this.watchType !== this.filters[1].value) {
        if (this.filters[1].value === 'group') {
          this.querySponsorGroupList();
        } else if (this.filters[1].value === 'individual') {
          this.querySponsorList();
        }
        this.watchType = this.filters[1].value;
      } else {
        this.init();
      }
    },
    // 根据统计指标返回不同值
    formatByFilterType(value) {
      console.log('filter: ', this.filters[3].value);
      if (this.filters[3].value === 'sessionCount') {
        return value / 100;
      } else {
        return value;
      }
    },
    // 格式化数据
    dataFormat(data) {
      let tmpData = [];
      for (let i = 0; i < data.histogram.length; i++) {
        tmpData.push({
          日期: this.filters[0].value === 'day' ? data.histogram[i].xValue.slice(5, 10) : data.histogram[i].xValue,
          [this.kpiName[0]]: data.histogram[i].yValue,
          [this.kpiName[1]]: data.lineChat.length === 0 ? '' : (data.lineChat[i].yValue === '0' ? '0' : this.formatByFilterType(data.lineChat[i].yValue))
        });
      }
      let chartData = {
        type: 'histogram',
        data: {
          columns: ['日期', this.kpiName[0], this.kpiName[1]],
          rows: tmpData
        },
        settings: {
          metrics: [this.kpiName[0], data.lineChat.length === 0 || this.filters[0].value === 'day' ? '' : this.kpiName[1]],
          showLine: this.kpiName[1],
          yAxisType: ['normal', this.rightYAxisType],
          yAxisName: [this.kpiName[0], data.lineChat.length === 0 || this.filters[0].value === 'day' ? '' : this.kpiName[1]]
        }
      };
      if (data.lineChat.length !== 0) {
        chartData.settings.axisSite = { right: [this.kpiName[1]] };
      }
      return chartData;
    },
    // 获取今天以及六个月前的日期
    getFormatDate() {
      let date = new Date();
      this.filters[4].value[1] = `${date.getFullYear()}-${date.getMonth() < 9 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1}-${date.getDate() < 10 ? '0' + date.getDate() : date.getDate()}`;
      this.today = this.filters[4].value[1];
      let halfYearAgo = function() {
        let dt = new Date();
        dt.setMonth(dt.getMonth() - 6);
        return `${dt.getFullYear()}-${dt.getMonth() < 9 ? '0' + (dt.getMonth() + 1) : dt.getMonth() + 1}-${dt.getDate() < 10 ? '0' + dt.getDate() : dt.getDate()}`;
      };
      this.filters[4].value[0] = halfYearAgo();
    }
  },
  computed: {
    kpiName: function() {
      if (this.filters[3].value === 'sessionCount') {
        return ['  会话数量', '客户满意度'];
      }
      if (this.filters[3].value === 'sessionDuration') {
        return ['  会话时长', '质检评分'];
      }
      if (this.filters[3].value === 'workSheetCount') {
        return ['  工单数量', '工单处理时长(分钟)'];
      }
      return [];
    },
    rightYAxisType() {
      if (this.filters[3].value === 'sessionCount') {
        return 'percent';
      } else {
        return 'normal';
      }
    }
  },
  mounted() {
    this.$message({
      message: '选择需要统计的时间和指标种类，对客服工作全面实时掌握',
      showClose: true
    });
  },
  created() {
    this.getFormatDate();
    this.watchType = this.filters[1].value;
    this.querySponsorGroupList();
  },
  components: {
    BizChart
  }
};
</script>

<style lang="scss">
.work-sheet-mgmt-statistics-analysis {
  height: 100%;
  overflow: auto;
  .biz-table-filter .filter-wrap .biz-select .el-select {
    width: 150px;
  }
}
</style>
