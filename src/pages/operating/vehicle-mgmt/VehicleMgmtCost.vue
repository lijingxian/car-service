<template>
  <div class="vehicle-mgmt-cost">
    <biz-flex-table ref="table" :filters="filters" :operations="operations" :pagination="pagination" :tableData="tableData"
      :loading="loading" @operate="operateHandler" @size-change="pageSizeChange" @current-change="currentPageChange" @row-click="rowOperationClickHandler"
      @selection-change="selectionChangeHandler" @filter-data-change="filterDataChangeHandler" @sort-change="handleSortChange">
      <el-table-column prop="car.plateNumber" label="车牌号">
      </el-table-column>
      <el-table-column prop="type" label="费用类型" :formatter="typeConverter">
      </el-table-column>
      <el-table-column prop="cost" label="金额">
      </el-table-column>
      <el-table-column prop="member.name" label="申请人" :formatter="formatName">
      </el-table-column>
      <el-table-column prop="verifyState" label="状态" :formatter="stateConverter">
      </el-table-column>
      <el-table-column prop="happenDate" label="申请日期" sortable>
      </el-table-column>
      <el-table-column prop="tag" label="操作" width="130">
        <template slot-scope="scope">
          <el-button v-if="scope.row.needVerify==='1'" type="text" size="mini" @click="rowOperationClickHandler(scope.row)">
            审核
          </el-button>
        </template>
      </el-table-column>
    </biz-flex-table>
    <div slot="float">
      <cost-popup :open="open" :itemId="itemId" @close="open = false;" @operationSuccess="operationSuccess"></cost-popup>
    </div>
  </div>
</template>

<script>
import { BizFlexTable } from '@/components/BizTable';
import CostPopup from './cost/CostPopup';

import service from '@/service/vehicle-mgmt/VehicleMgmtCost';
import { vehicleMgmt } from '@/common/urls';
import http from '@/common/http';

export default {
  name: 'VehicleMgmtCost',
  components: {
    BizFlexTable,
    CostPopup
  },
  props: {},
  data() {
    return {
      // 控件
      itemId: { id: '' },
      classId: '',
      selections: [],

      // 右侧弹窗
      open: false,
      needVerify: '0',
      // Table相关
      loading: false,
      tableData: [],
      pagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        total: 0
      },
      operations: [
        {
          label: '导出',
          name: 'exportOperate',
          type: ''
        },
        {
          label: '返回',
          name: 'goBack',
          type: ''
        }
      ],
      filters: [
        {
          type: 'select',
          label: '车牌号',
          name: 'searchValue',
          value: '',
          options: []
        },
        {
          type: 'select',
          label: '费用类型',
          name: 'searchValue',
          value: '',
          options: []
        },
        {
          type: 'select',
          label: '申请人',
          name: 'searchValue',
          value: '',
          options: []
        },
        {
          type: 'select',
          label: '状态',
          name: 'searchValue',
          value: '',
          options: []
        },
        {
          type: 'daterange',
          label: '时间',
          name: 'searchValue',
          value: ''
        }
      ],
      sortData: {}
    };
  },
  methods: {
    // 格式化申请人
    formatName(row, column) {
      return row.member.name || row.member.nickname;
    },
    // 返回上一页
    goBack() {
      this.$router.go(-1);
    },
    isMotorcadeMode() {
      if (this.$route.params.groupId) return true;
      else return false;
    },
    getMotorcadeId() {
      return this.$route.params.groupId;
    },
    operationSuccess() {
      this.open = false;
      this.query();
    },
    operateHandler(name) {
      this[name]();
    },
    pageSizeChange(val) {
      this.pagination.pageSize = val;
      this.pagination.currentPage = 1;
      this.query();
    },
    currentPageChange(val) {
      this.pagination.currentPage = val;
      this.query();
    },
    rowOperationClickHandler(model) {
      this.itemId = { id: model.id, needVerify: model.needVerify };
      this.needVerify = model.needVerify;
      this.open = true;
    },
    selectionChangeHandler(val) {
      this.selections = val;
    },
    filterDataChangeHandler() {
      this.pagination = {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        total: 0
      };
      this.query();
    },
    handleSortChange(column) {
      this.sortData = {
        column: column.prop,
        sort: column.order ? (column.order === 'ascending' ? 'asc' : 'desc') : undefined
      };

      this.query();
    },

    typeConverter(row) {
      if (this.filters[1].options.length > 0) {
        return this.filters[1].options[Number(row.type) + 1] ? this.filters[1].options[Number(row.type) + 1].label : '';
      } else {
        return row.type;
      }
    },
    stateConverter(row) {
      if (this.filters[3].options.length > 0) {
        return this.filters[3].options[Number(row.verifyState) + 1].label;
      } else {
        return row.verifyState;
      }
    },

    getQueryParams() {
      return {
        pageNumber: this.pagination.currentPage,
        pageSize: this.pagination.pageSize,
        carId: this.filters[0].value,
        fleetId: this.getMotorcadeId(),
        carCostType: this.filters[1].value,
        memberId: this.filters[2].value,
        state: this.filters[3].value,
        beginDate: this.filters[4].value[0],
        endDate: this.filters[4].value[1],
        orderProperty: this.sortData.column,
        orderDirection: this.sortData.sort
      };
    },
    query() {
      service.query(
        this.getQueryParams(),
        data => {
          this.tableData = data.content;

          this.$set(this.pagination, 'total', Number.parseInt(data.total));
        },
        // result_code 不是100的处理
        ErrorData => {
          console.log(ErrorData);
          console.log('code错误');
        }
      );
    },
    queryPlateNumbers() {
      service.queryPlateNumbers(
        this.getQueryParams(),
        data => {
          let arr = [{ value: '', label: '全部' }];
          data.content.forEach(item => {
            arr.push({ value: item.id, label: item.plateNumber });
          });
          this.$set(this.filters[0], 'options', arr);
        },
        // result_code 不是100的处理
        ErrorData => {
          console.log(ErrorData);
          console.log('code错误');
        }
      );
    },
    queryStateList() {
      service.queryStateList(
        this.getQueryParams(),
        data => {
          data.content.unshift({ value: '', label: '全部' });
          this.$set(this.filters[3], 'options', data.content);
        },
        // result_code 不是100的处理
        ErrorData => {
          console.log(ErrorData);
          console.log('code错误');
        }
      );
    },
    queryPersonList() {
      service.queryPersonList(
        {
          fleetId: this.getMotorcadeId()
        },
        data => {
          data.listFleetDriver.map(item => {
            item.label = item.name;
            item.value = item.id;
          });
          data.listFleetDriver.unshift({ value: '', label: '全部' });
          this.$set(this.filters[2], 'options', data.listFleetDriver);
        },
        // result_code 不是100的处理
        ErrorData => {
          console.log(ErrorData);
          console.log('code错误');
        }
      );
    },
    queryTypeList() {
      service.queryTypeList(
        {},
        data => {
          data.content.unshift({ value: '', label: '全部' });
          this.$set(this.filters[1], 'options', data.content);
        },
        // result_code 不是100的处理
        ErrorData => {
          console.log(ErrorData);
          console.log('code错误');
        }
      );
    },
    exportOperate() {
      let ids = this.selections.map(selection => {
        return selection.id;
      });
      service.export(Object.assign({}, this.getQueryParams(), { ids: ids }));
    },

    queryKPI() {
      http
        .get(vehicleMgmt.kpi_cost, { fleetId: this.getMotorcadeId() })
        .then(data => {
          this.$message({
            customClass: 'motorists-club-activity__kpi',
            showClose: true,
            message: `今日新增费用审核${data.count}条，未审核记录共${data.noExamine}条 `,
            duration: 3000
          });
        })
        .catch(errData => {
          console.log(errData);
          console.log('code错误');
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        });
    }
  },
  created() {
    this.queryStateList();
    this.queryTypeList();
    this.queryPlateNumbers();
    this.queryPersonList();
    this.query();
  },
  mounted() {
    this.queryKPI();
  }
};
</script>

<style lang="scss">
</style>
