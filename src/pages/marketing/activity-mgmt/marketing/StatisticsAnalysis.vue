<template>
  <div class="activity-mgmt-statistics-analysis">
    <div class="top-area">
      <biz-chart :chartData="chartData" :chartWidth="'650px'" :chartHeight="'500px'" :showSearch="false"></biz-chart>
      <div class="sale">
        <div class="sale-title">活动分析指标</div>
        <div class="sale-content">
          <div class="sale-block">
            <h4>拉新数(人):</h4>
            <h4><span>{{newSum}}</span></h4>
          </div>
          <div class="sale-block">
            <h4>参与人数(人):</h4>
            <h4><span>{{activeSum}}</span></h4>
          </div>
          <div class="sale-block">
            <h4>收益数(元):</h4>
            <h4><span>{{incomeSum}}</span></h4>
          </div>
          <div class="sale-block">
            <h4>成功数(次):</h4>
            <h4><span>{{successSum}}</span></h4>
          </div>
        </div>
      </div>
    </div>
    <biz-table-body :tableData="tableData" :pagination="pagination" @handleSelectionChange="handleSelectionChange"
      @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange">
      <el-table-column prop="name" label="活动名称"></el-table-column>
      <el-table-column prop="activityType" :formatter="getType" label="活动类型"></el-table-column>
      <el-table-column prop="beginDate" label="开始时间"></el-table-column>
      <el-table-column prop="endDate" label="结束时间"></el-table-column>
      <el-table-column prop="newcome" label="拉新数(人)"></el-table-column>
      <el-table-column prop="activite" label="参与人次(人次)"></el-table-column>
      <el-table-column prop="income" label="活动收益(元)"></el-table-column>
      <el-table-column prop="isSuccess" label="是否成功">
        <template slot-scope="scope">
          {{scope.row.isSuccess === '0' ? '失败' : '成功'}}
        </template>
      </el-table-column>
    </biz-table-body>
  </div>
</template>

<script>
import BizChart from '@/components/BizChart';
import BizTableBody from '@/components/BizTable/BizTableBody';
import activityMgmtService from '@/service/activity-mgmt/marketing/activityMgmt';

export default {
  name: 'StatisticsAnalysis',
  data() {
    return {
      DATA_LIST: {
        redPacket: '抢红包',
        shake: '摇一摇',
        lottery: '抽奖',
        groupBuying: '拼团购',
        panicBuying: 'N元抢购',
        secKill: '限时秒杀',
        bargain: '帮砍价',
        recommend: '推荐有礼',
        share: '分享有礼',
        activeSum: '活动招募',
        potentialCustomer: '潜客活动'
      },
      DATA_INDEX: {
        redPacket: '0',
        shake: '1',
        lottery: '2',
        groupBuying: '3',
        panicBuying: '4',
        secKill: '5',
        bargain: '6',
        recommend: '7',
        share: '8',
        activeSum: '9',
        potentialCustomer: '11'
      },
      tableData: [],
      pagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        // 总条目数
        total: 0
      },
      newSum: '0',
      activeSum: '0',
      incomeSum: '0',
      successSum: '0',
      params: {},
      multiSelected: [],
      chartData: {
        legendPosition: 'right',
        type: 'pie',
        data: {
          columns: ['type', 'value'],
          rows: []
        },
        settings: {
          radius: [60, 150],
          offsetY: 250
        }
      }
    };
  },
  computed: {},
  methods: {
    formatChartData(data) {
      return this.DATA_LIST[data];
    },
    paramschange(params) {
      // this.params.shopId = params.shopId;
      // this.params.beginTimeStr = params.beginTimeStr;
      // this.params.endTimeStr = params.endTimeStr;
      this.params = Object.assign({}, params);
      this.refresh();
    },
    refresh() {
      this.params.pageSize = this.pagination.pageSize;
      this.params.pageNumber = this.pagination.currentPage;

      activityMgmtService.getStatisticsAnalysis(
        this.params,
        data => {
          this.chartData.data.rows = [];
          for (let name in data) {
            // 19927
            let ifShow =
              this.params.activityType === '' ||
              this.params.activityType === this.DATA_INDEX[name];
            if (this.DATA_LIST[name] && ifShow) {
              this.chartData.data.rows.push({
                type: this.formatChartData(name),
                value: data[name]
              });
            }
          }
          this.tableData = data.statistics;
          this.newSum = data.newSum;
          this.activeSum = data.activeSum;
          this.incomeSum = data.incomeSum;
          this.successSum = data.successSum;
          this.pagination.total = Number(data.total);
        },
        ErrorData => {
          console.log(ErrorData);
        }
      );
    },
    // 分页
    handleSizeChange(val) {
      this.pagination.pageSize = val;
      this.refresh();
    },
    // 跳页
    handleCurrentChange(val) {
      this.pagination.currentPage = val;
      this.refresh();
    },
    // 多选
    handleSelectionChange(val) {
      this.multiSelected = [];
      val.map(row => {
        this.multiSelected = this.multiSelected.concat(row.id);
      });
    },
    getType(row) {
      switch (row.type) {
        case '0':
          return '抢红包';
        case '1':
          return '摇一摇';
        case '2':
          return '抽奖';
        case '3':
          return '拼团购';
        case '4':
          return 'N元抢购';
        case '5':
          return '限时秒杀';
        case '6':
          return '帮砍价';
        case '7':
          return '推荐有礼';
        case '8':
          return '分享有礼';
        case '9':
          return '活动招募';
        case '11':
          return '潜客活动';
        default:
          break;
      }
    }
  },
  components: {
    BizChart,
    BizTableBody
  }
};
</script>

<style lang="scss">
.activity-mgmt-statistics-analysis {
  height: 100%;
  overflow: auto;
  .top-area {
    display: flex;
    flex-flow: row;
    flex-basis: 100%;
    flex-grow: 1;
    height: 500px;
    .chart-area {
      margin-top: 0;
    }
    .sale {
      height: 230px;
      margin-top: 100px;
      margin-left: 80px;
      display: flex;
      flex-flow: column;
      flex-basis: 100%;
      flex-grow: 1;
      font-size: 20px;
      color: #606266;
      font-weight: bold;
      .sale-title {
        height: 35px;
        text-align: center;
        background-color: #ebeef5;
      }
      .sale-content {
        padding: 10px;
        display: flex;
        flex-flow: row;
        flex-wrap: wrap;
        width: 100%;
        height: 100%;
      }
      .sale-block {
        align-items: center;
        width: 50%;
        height: 50%;

        h4 {
          margin: 0;
        }
        span {
          color: #ff7300;
        }
      }
    }
  }
  .biz-table-body .biz-pagination {
    justify-content: flex-end;
  }
  .el-pagination {
    margin-right: 100px;
  }
}
</style>
