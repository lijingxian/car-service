<template>
  <div class="vehicle-mgmt-vehicle__vehicle-picker">
    <biz-dialog-selector
      slot="float"
      :title="title"
      :visibility.sync="showDialog"
      :loading="dialogLoading"
      :tableData="dialogTableData"
      :pagination="dialogPagination"
      :keyField="'id'"
      :selectionKeys="selectionKeys"
      :filters="dialogFilters"

      @confirmed="confirmedHandler"
      @open="openedHandler"

      @filterDataChange="dialogFilterDataChange"
      @pageSizeChange="dialogPageSizeChange"
      @currentPageChange="dialogCurrentPageChange"
    >
      <el-table-column prop="plateNumber" label="车牌号">
      </el-table-column>
      <el-table-column prop="member.name" label="车主">
      </el-table-column>
      <el-table-column prop="member.phone" label="电话">
      </el-table-column>
    </biz-dialog-selector>
  </div>
</template>

<script>
import BizDialogSelector from '@/components/BizDialogSelector';

import service from '@/service/vehicle-mgmt/Component';

export default {
  name: 'VehicleMgmtMemberVehiclePicker',
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
    fleetId: {
      type: String
    },
    title: {
      type: String
    },
    all: {
      type: Boolean,
      default () {
        return false;
      }
    },
    memberIds: {
      type: Array,
      default () {
        return [];
      }
    }
  },
  data () {
    return {
      showDialog: false,
      dialogLoading: false,
      selectionKeys: [],
      dialogTableData: [],
      dialogPagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        total: 0
      },
      dialogFilters: [
        {
          type: 'input',
          label: '',
          placeholder: '请输入用户名/手机号',
          name: 'searchValue',
          value: ''
        }
      ]
    };
  },
  computed: {
    textComputed () {
      return '已选择 ' + this.value.length + ' 辆车';
    }
  },
  methods: {
    getMotorcadeId () {
      return this.$route.params.groupId || this.fleetId;
    },
    queryVehicles (params) {
      this.dialogLoading = true;

      service.queryVehicles(
        '/admin/fleet/listAllFleetCar.jhtml',
        params,
        data => {
          this.dialogTableData = data.carList;

          this.$set(this.dialogPagination, 'total', parseInt(data.total));

          this.dialogLoading = false;
        },
        // result_code 不是100的处理
        ErrorData => {
          console.log(ErrorData);
          console.log('code错误');

          this.dialogLoading = false;
        }
      );
    },

    clickHandler (e) {
      this.showDialog = true;
    },
    confirmedHandler (selectionKeys, selections) {
      // this.$emit('input', selectionKeys);
      this.selectionKeys = selectionKeys;
      this.$emit('on-confirm', selectionKeys);
    },
    getDialogQueryParams () {
      return {
        pageSize: this.dialogPagination.pageSize,
        pageNumber: this.dialogPagination.currentPage,
        searchValue: this.dialogFilters[0].value,
        fleetId: this.all ? '' : this.getMotorcadeId(),
        shopId: window.top.SHOP_ID || ''
      };
    },
    openedHandler () {
      this.dialogPagination.currentPage = 1;
      this.dialogPagination.pageSize = 20;
      this.dialogFilters = [{
        type: 'input',
        label: '',
        placeholder: '请输入车牌号',
        name: 'searchValue',
        value: ''
      }];
      this.queryVehicles(this.getDialogQueryParams());
    },
    dialogFilterDataChange (filters) {
      this.$set(this.dialogPagination, 'currentPage', 1);
      this.queryVehicles(this.getDialogQueryParams());
    },
    dialogPageSizeChange (val) {
      this.$set(this.dialogPagination, 'pageSize', val);
      this.queryVehicles(this.getDialogQueryParams());
    },
    dialogCurrentPageChange (val) {
      this.$set(this.dialogPagination, 'currentPage', val);
      this.queryVehicles(this.getDialogQueryParams());
    }
  }
};
</script>

<style lang="scss">

</style>
