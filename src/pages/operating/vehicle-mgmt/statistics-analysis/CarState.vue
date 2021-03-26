<template>
  <biz-grid class="vehicle-mgmt-car-state">
    <biz-flex-table :operations="operations"
    @operate="operate"
    :filters="filters"
    @filter-data-change="filterDataChange"
    :tableData="tableData"
    :pagination="pagination"
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
    :checkable="checkable">
      <!-- 表格内容 -->
      <!-- 车牌号 -->
      <el-table-column width="110" prop="plateNumber" label="车牌号">
      </el-table-column>
      <!-- 设备号 -->
      <el-table-column min-width="120" prop="terminalNumber" label="设备号">
      </el-table-column>
      <!-- 卡号 -->
      <el-table-column min-width="150" prop="simNumber" label="卡号">
      </el-table-column>
      <!-- 最后上报时间 -->
      <el-table-column min-width="150" prop="happenDate" label="最后上报时间">
      </el-table-column>
      <!-- 速度 -->
      <el-table-column min-width="50" prop="speed" label="速度">
      </el-table-column>
      <!-- 设备状态 -->
      <el-table-column width="80" prop="terminalState" label="设备状态">
      </el-table-column>
      <!-- 车辆状态 -->
      <el-table-column width="100" prop="runningStatus" label="车辆状态">
        <!-- <template slot-scope="scope">
          {{scope.row.carState === '0' ? '开启' : '离线/未知'}}
        </template> -->
      </el-table-column>
      <!-- 位置 -->
      <el-table-column width="150" prop="address" label="位置">
        <template slot-scope="scope">
          {{scope.row.address || '--'}}
        </template>
      </el-table-column>
    </biz-flex-table>
  </biz-grid>
</template>

<script>
import { BizFlexTable } from '@/components/BizTable';
import { BizGrid } from '@/components/BizGrid';
import service from '@/service/vehicle-mgmt/StatisticsAnalysis';

export default {
  name: 'CarState',
  data () {
    return {
      operations: [
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
        { type: 'input', placeholder: '请输入设备号/卡号/车牌号', name: 'searchbar', value: '' }
      ],
      pagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        // 总条目数
        total: 0
      },
      tableData: [],
      checkable: false
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
      let fleetName = '';
      this.filters[0].options.map(fleet => {
        if (fleet.value === this.filters[0].value) {
          fleetName = fleet.label;
        }
      });
      let params = {
        fleetName: fleetName
      };
      service.carStateExport(
        params,
        data => {},
        ErrorData => {
          console.log('ERR_EXPORT: ', ErrorData);
        }
      );
    },
    refresh() {
      let params = {
        fleetId: this.filters[0].value,
        value: this.filters[1].value
      };
      service.queryCarStateData(
        params,
        data => {
          this.tableData = data.carStates;
          this.pagination.total = this.tableData.length;
        },
        ErrorData => {
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
          console.log('fleetList: ', this.filters[0]);
        },
        ErrorData => {
          console.log('ERR_GET_FLEET: ', ErrorData);
        }
      );
    }
  },
  mounted() {
    this.queryCarFleet();
    this.refresh();
  },
  components: {
    BizFlexTable,
    BizGrid
  }
};
</script>

<style lang="scss">
.vehicle-mgmt-car-state {
  height: 100%;
  overflow: auto;
  .biz-table-filter .filter-wrap .biz-select .el-select {
    width: 140px;
  }
  .biz-table-body .biz-pagination {
    justify-content: flex-end;
  }
  .el-pagination {
    margin-right: 100px;
  }
}
</style>
