<template>
  <div class="store-vehicle-picker">
    <biz-dialog-selector slot="float" title="车辆选择" selectionMode="single" :visibility.sync="showDialog" :loading="dialogLoading"
      :tableData="tableData" :pagination="dialogPagination" :keyField="'id'" :selectionKeys="selectionKeys" :filters="dialogFilters"
      @confirmed="confirmedHandler" @open="openedHandler" @filterDataChange="dialogFilterDataChange" @pageSizeChange="dialogPageSizeChange"
      @currentPageChange="dialogCurrentPageChange" :isClear="false">
      <el-table-column prop="plateNumber" label="车牌号">
      </el-table-column>
      <el-table-column prop="type" label="车型">
      </el-table-column>
      <el-table-column prop="member.name" label="车主">
      </el-table-column>
      <el-table-column prop="member.mobile" label="电话">
      </el-table-column>
      <el-table-column prop="shop.name" label="所属店铺">
      </el-table-column>
    </biz-dialog-selector>
  </div>
</template>

<script>
import BizDialogSelector from './components/BizDialogSelector';
import { membershipMgmt as shop } from '@/common/urls';
import service from '@/service/vehicle-mgmt/Component';
import http from '@/common/http';
import { mapGetters } from 'vuex';
export default {
  name: 'StoreVehiclePicker',
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
    // fleetId: {
    //   type: String
    // },
    all: {
      type: Boolean,
      default() {
        return false;
      }
    },
    shopId: {
      type: String
    }
  },
  data() {
    return {
      showDialog: false,
      dialogLoading: false,
      selectionKeys: [],
      tableData: [],
      dialogPagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        total: 0
      },
      dialogFilters: [
        {
          type: 'select',
          label: '店铺名称',
          name: 'shopName',
          value: '',
          options: []
        },
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
    ...mapGetters(['getUser']),
    textComputed() {
      return '已选择 ' + this.value.length + ' 辆车';
    }
  },
  created() {
    this.queryShopList();
  },
  methods: {
    // getMotorcadeId() {
    //   return this.$route.params.groupId || this.fleetId;
    // },
    queryShopList() {
      http
        .get(shop.mainPage.shopList, {
          shopId: window.top.SHOP_ID || '',
          sourceType: ''
        })
        .then(data => {
          let arr = data.shops;
          arr.map(item => {
            item.value = item.id;
            item.label = item.name;
          });
          arr.unshift({ value: '', label: '全部' });
          this.dialogFilters[0].value = this.shopId;
          this.$set(this.dialogFilters[0], 'options', arr);
        })
        .catch(errData => {
          console.log(errData);
          console.log('code错误');
          // if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        });
    },
    queryVehicles(params) {
      this.dialogLoading = true;

      service.queryVehicles(
        // '/admin/fleet/listAllFleetCar.jhtml',
        '/admin/car/manage/list.jhtml',
        params,
        data => {
          // this.tableData = data.carList;
          this.tableData = data.cars;

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

    clickHandler(e) {
      this.showDialog = true;
    },
    confirmedHandler(selectionKeys, selections) {
      // this.$emit('input', selectionKeys);
      http
        .get('/admin/testDriveMgmt/isTestDriveCar.jhtml', {
          shopId: window.top.SHOP_ID || '',
          carId: selections[0].id
        })
        .then(data => {
          if (data.isTestDriveCar === '1') {
            this.$message.warning('车辆已被添加，不能重复添加');
            return false;
          } else {
            this.showDialog = false;
            this.selectionKeys = selectionKeys;
            console.log('selectionKeys===' + selectionKeys);
            console.log('selections==' + selections[0].plateNumber);
            this.$emit('on-confirm', selectionKeys, selections[0]);
          }
        })
        .catch(errData => {
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        });
    },
    getDialogQueryParams() {
      return {
        pageSize: this.dialogPagination.pageSize,
        pageNumber: this.dialogPagination.currentPage,
        searchValue: this.dialogFilters[1].value,
        // fleetId: this.all ? '' : this.getMotorcadeId(),
        shopId: this.dialogFilters[0].value || ''
      };
    },
    openedHandler() {
      this.dialogPagination.currentPage = 1;
      this.dialogFilters[1].value = '';
      this.dialogFilters[0].value = this.shopId;
      this.queryVehicles(this.getDialogQueryParams());
    },
    dialogFilterDataChange(filters) {
      this.$set(this.dialogPagination, 'currentPage', 1);
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
