<template>
  <div class="vehicle-mgmt-abnormal-statistics">
    <biz-flex-table
      :operations="operations"
      @operate="operate"
      :filters="filters"
      :loading="loading"
      @filter-data-change="filterDataChange"
      :tableData="tableData"
      :pagination="pagination"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :checkable="checkable"
    >
      <!-- 表格内容 -->
      <!-- 车牌号 -->
      <el-table-column width="150" prop="plateNumber" label="车牌号"></el-table-column>
      <!-- 设备号 -->
      <el-table-column width="150" prop="ownerName" label="车主"></el-table-column>
      <!-- 卡号 -->
      <el-table-column width="150" prop="happenDate" label="日期"></el-table-column>
      <!-- 最后上报时间 -->
      <el-table-column min-width="150" prop="content" label="位置"></el-table-column>
    </biz-flex-table>
  </div>
</template>

<script>
import { BizFlexTable } from '@/components/BizTable';

import service from '@/service/vehicle-mgmt/StatisticsAnalysis';

export default {
  name: 'AbnormalStatistics',
  data () {
    return {
      today: '',
      operations: [
        // {label: '搜索', name: 'refresh', type: 'primary'},
        { label: '导出', name: 'export', type: '' }
      ],
      filters: [
        {
          type: 'select',
          label: '车队',
          name: 'carGroup',
          value: '',
          options: []
        },
        {
          type: 'select',
          label: '类型',
          name: 'type',
          value: 'plugin',
          options: [
            {
              value: 'plugin',
              label: '设备插拔'
            },
            {
              value: 'fencein',
              label: '围栏'
            }
          ]
        },
        { type: 'daterange', label: '日期区间：', value: ['2011-11-11', '2012-12-12'] }
      ],
      pagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        // 总条目数
        total: 0
      },
      tableData: [],
      checkable: false,
      loading: false
    };
  },
  methods: {
    operate(name) {
      this[name]();
    },
    // 过滤器发生变动
    filterDataChange(val) {
      this.filters = val;
      this.refresh();
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
    export() {
      let params = {
        fleetName: this.filters[0].value,
        type: this.filters[1].value,
        statisDate: `${this.filters[2].value[0]}-${this.filters[2].value[1]}`,
        treeNodeId: `fleet_${this.filters[0].value}`,
        beginTimeStr: this.filters[2].value[0],
        endTimeStr: this.filters[2].value[1],
        pageSize: this.pagination.pageSize,
        pageNumber: this.pagination.currentPage
      };
      service.abnormalExport(
        params,
        data => {},
        ErrorData => {
          console.log('ERR_EXPORT: ', ErrorData);
        }
      );
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
      this.loading = true;
      let params = {
        treeNodeId: `fleet_${this.filters[0].value}`,
        type: this.filters[1].value,
        beginTimeStr: this.filters[2].value[0],
        endTimeStr: this.filters[2].value[1],
        pageSize: this.pagination.pageSize,
        pageNumber: this.pagination.currentPage
      };
      service.queryAbnormalData(
        params,
        data => {
          this.tableData = data.abnormalStatisticsDatas;
          this.pagination.total = parseInt(data.total);
          this.loading = false;
        },
        ErrorData => {
          this.loading = false;
          console.log('ERR_REFRESH: ', ErrorData);
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
      this.filters[2].value[1] = `${date.getFullYear()}-${date.getMonth() < 9 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1}-${date.getDate() < 10 ? '0' + date.getDate() : date.getDate()}`;
      this.today = this.filters[2].value[1];
      let halfYearAgo = function() {
        let dt = new Date();
        dt.setDate(1);
        return `${dt.getFullYear()}-${dt.getMonth() < 9 ? '0' + (dt.getMonth() + 1) : dt.getMonth() + 1}-${dt.getDate() < 10 ? '0' + dt.getDate() : dt.getDate()}`;
      };
      this.filters[2].value[0] = halfYearAgo();
    }
  },
  mounted() {
    this.queryCarFleet();
  },
  created() {
    this.getFormatDate();
  },
  components: {
    BizFlexTable
  }
};
</script>

<style lang="scss">
.vehicle-mgmt-abnormal-statistics {
  .biz-table-body .biz-pagination {
    justify-content: flex-end;
  }
  .el-pagination {
    margin-right: 100px;
  }
  .biz-table-filter .filter-wrap .biz-select .el-select {
    width: 140px;
  }
}
</style>
