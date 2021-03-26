<template>
  <div class="vehicle-mgmt-vehicle__vehicle-picker">
    <el-input placeholder="请输入内容" :value="textComputed" readonly="readonly">
      <el-button slot="append" @click="clickHandler">选择</el-button>
    </el-input>

    <biz-dialog-selector slot="float" title="车辆选择" :visibility.sync="showDialog" :loading="dialogLoading" v-if="motorcadeId"
      :tableData="dialogTableData" :pagination="dialogPagination" :keyField="'id'" :selectionKeys="value" :filters="dialogFilters"
      @confirmed="confirmedHandler" @open="openedHandler" @filterDataChange="dialogFilterDataChange"
      @pageSizeChange="dialogPageSizeChange" @currentPageChange="dialogCurrentPageChange">
      <el-table-column prop="orderNum" label="序号" width="100">
      </el-table-column>
      <el-table-column prop="plateNumber" label="车牌号">
      </el-table-column>
      <el-table-column prop="member.name" label="车主">
      </el-table-column>
      <el-table-column prop="member.phone" label="电话">
      </el-table-column>
    </biz-dialog-selector>
    <biz-dialog-selector slot="float" title="车辆选择" :visibility.sync="showDialog" :loading="dialogLoading" v-if="!motorcadeId"
      :tableData="dialogTableData" :pagination="dialogPagination" :keyField="'id'" :selectionKeys="value" :filters="dialogFilters"
      @confirmed="confirmedHandler" @open="openedHandler" @filterDataChange="dialogFilterDataChange"
      @pageSizeChange="dialogPageSizeChange" @currentPageChange="dialogCurrentPageChange">
      <el-table-column prop="sn" label="车牌号">
      </el-table-column>
      <el-table-column prop="owner" label="车主姓名">
      </el-table-column>
      <el-table-column prop="ownerUuid" label="车主电话">
      </el-table-column>
    </biz-dialog-selector>
  </div>
</template>

<script>
import BizDialogSelector from '@/components/BizDialogSelector';

import service from '@/service/vehicle-mgmt/Component';

export default {
  name: 'VehicleMgmtVehiclePicker',
  components: {
    BizDialogSelector
  },
  model: {
    prop: 'value',
    event: 'input'
  },
  props: {
    value: {
      type: Array
    },
    motorcadeId: {
      type: String,
      required: true
    },
    userId: {
      type: String
    }
  },
  data() {
    return {
      showDialog: false,
      dialogLoading: false,
      dialogTableData: [],
      dialogPagination: {
        pageSize: 1000,
        currentPage: 1,
        pageSizes: [1000],
        total: 0
      },
      dialogFilters: [
        {
          type: 'input',
          label: '',
          placeholder: '请输入姓名/手机号',
          name: 'searchValue',
          value: ''
        }
      ]
    };
  },
  computed: {
    textComputed() {
      return '已选择 ' + this.value.length + ' 辆车';
    }
  },
  methods: {
    queryVehicles(params) {
      this.dialogLoading = true;
      let url = '';
      if (this.motorcadeId) {
        url = '/admin/fence/fleetMonitorItems.jhtml';
      } else {
        url = '/admin/fence/personalMonitorItems.jhtml';
      }
      service.queryVehicles(
        url,
        params,
        data => {
          if (!this.motorcadeId) {
            let dataList = [];
            data.dataList.map(item => {
              if (item.produceType === '0') {
                dataList.push(item);
              }
            });
            this.dialogTableData = dataList;

            this.$set(this.dialogPagination, 'total', parseInt(dataList.length));
          } else {
            this.dialogTableData = data.dataList;
            this.$set(this.dialogPagination, 'total', parseInt(data.dataList.length));
          }
          this.dialogLoading = false;
        },
        // result_code 不是100的处理
        ErrorData => {
          console.log(ErrorData);
          console.log('code错误');
          this.$message.warning(ErrorData.errorMessage);
        }
      );
    },

    clickHandler(e) {
      this.showDialog = true;
    },
    confirmedHandler(selectionKeys, selections) {
      this.$emit('input', selectionKeys);
      this.$emit('on-confirm', selectionKeys);
    },
    getDialogQueryParams() {
      return {
        fleetId: this.motorcadeId,
        userId: this.userId,
        pageSize: this.dialogPagination.pageSize,
        pageNumber: this.dialogPagination.currentPage,
        searchValue: this.dialogFilters[0].value
      };
    },
    openedHandler() {
      this.dialogPagination.currentPage = 1;
      this.dialogPagination.pageSize = 20;
      this.dialogFilters = [
        {
          type: 'input',
          label: '',
          placeholder: '请输入车牌号',
          name: 'searchValue',
          value: ''
        }
      ];
      this.queryVehicles(this.getDialogQueryParams());
    },
    dialogFilterDataChange(filters) {
      this.queryVehicles(this.getDialogQueryParams());
    },
    dialogPageSizeChange(val) {
      this.$set(this.dialogPagination, 'pageSize', val);
      this.queryVehicles(this.getDialogQueryParams());
    },
    dialogCurrentPageChange(val) {
      this.$set(this.dialogPagination, 'currentPage', val);
      this.queryVehicles(this.getDialogQueryParams());
    }
  }
};
</script>

<style lang="scss">
</style>
