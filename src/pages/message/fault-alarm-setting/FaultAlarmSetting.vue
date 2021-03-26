<template>
  <div class="fault-alarm-setting">
    <biz-flex-table
      ref="table"
      :operations="operations"
      :tableData="tableData"
      :loading="loading"
      @operate="operate"
      :pagination="pagination"
      @selection-change="handleSelectionChange"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    >
      <el-table-column prop="faultCode" label="故障码">
        <template slot-scope="scope">
          {{scope.row.faultCode||'--'}}
        </template>
      </el-table-column>
      <el-table-column prop="faultDescription" label="故障描述" width="680">
        <template slot-scope="scope">
          {{scope.row.faultCode||'--'}}
        </template>
      </el-table-column>
      <el-table-column prop="faultTypeId" label="故障类型" :formatter="getFaultType"></el-table-column>
      <el-table-column prop="faultSpn" label="spn">
        <template slot-scope="scope">
          {{scope.row.faultSpn||'--'}}
        </template>
      </el-table-column>
      <el-table-column prop="faultFmi" label="fmi">
        <template slot-scope="scope">
          {{scope.row.faultFmi||'--'}}
        </template>
      </el-table-column>
      <el-table-column prop="faultDtcm" label="dtcm">
        <template slot-scope="scope">
          {{scope.row.faultDtcm||'--'}}
        </template>
      </el-table-column>
      <el-table-column prop="tag" label="操作" width="130">
        <template slot-scope="scope">
          <el-button type="text" size="mini" @click="deleteHandlerLevel(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </biz-flex-table>
    <biz-popup-tabs :open="open" @close="open=false" v-model="tabName">
      <el-tab-pane label="选择商品" name="info">
        <product-info ref="info" :productData="productData" @operationSuccess="operationSuccess"></product-info>
      </el-tab-pane>
    </biz-popup-tabs>
    <biz-popup-tabs :open="openSetting" @close="openSetting=false" v-model="tabName">
      <el-tab-pane label="详细信息" name="baseinfo">
        <base-info></base-info>
      </el-tab-pane>
    </biz-popup-tabs>
  </div>
</template>

<script>
import { BizFlexTable } from '@/components/BizTable';
import { BizPopupTabs } from '@/components/BizPopup';
import ProductInfo from './AddProduct';
import BaseInfo from './Setting';
import FaultAlarmSettingService from '@/service/fault-alarm-setting/faultAlarmSetting';
import { mapGetters } from 'vuex';

export default {
  name: 'FaultAlarmSetting',
  data() {
    return {
      tabName: 'info',
      itemId: '',
      open: false,
      openSetting: false,
      tableData: [],
      faultTypes: [],
      multipleSelection: [],
      productData: [],
      operations: [
        {
          label: '新增',
          name: 'addFault',
          type: 'primary'
        },
        {
          disabled: true,
          label: '删除',
          name: 'deleteList',
          type: ''
        },
        {
          label: '设置',
          name: 'setting',
          type: ''
        }
      ],
      loading: false,
      pagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        total: 0
      },
      rules: {}
    };
  },
  components: { BizFlexTable, BizPopupTabs, ProductInfo, BaseInfo },
  created() {
    this.refresh();
    this.getShopFaultTypeList();
  },
  computed: {},
  methods: {
    ...mapGetters(['getUser']),
    operate(name) {
      this[name]();
    },
    operationSuccess() {
      this.open = false;
      this.refresh();
    },
    addFault() {
      this.tabName = 'info';
      this.open = true;
      this.productData = this.tableData;
      console.log(this.productData);
      this.$refs.info.clear();
    },
    setting() {
      this.tabName = 'baseinfo';
      this.openSetting = true;
    },
    refresh() {
      this.getShopFaultSetting();
    },
    // 获取店铺故障关联设置（高级设置）
    getShopFaultSetting() {
      let params = {
        shopId: window.top.SHOP_ID || '',
        pageNumber: this.pagination.currentPage,
        pageSize: this.pagination.pageSize
      };
      FaultAlarmSettingService.getShopFaultSetting(
        params,
        data => {
          this.tableData = data.ShopFaultSettingData.faultArray;
          this.pagination.total = Number(data.total);
        },
        ErrorData => {
          console.log(ErrorData);
          console.log('code错误');
        }
      );
    },
    // 批量操作-删除店铺故障关联设置（高级设置）
    deleteList() {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let ids = [];
          console.log(this.multipleSelection);
          for (const iterator of this.multipleSelection) {
            ids.push(iterator.id);
          }
          let params = {
            ids: ids
          };
          FaultAlarmSettingService.deleteShopFaultSetting(
            params,
            data => {
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.refresh();
            },
            ErrorData => {
              this.$message.warning(ErrorData.errorMessage);
            }
          );
        })
        .catch(() => {});
    },
    // 快捷操作-删除店铺故障关联设置（高级设置）
    deleteHandlerLevel(id) {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let ids = [];
          ids.push(id);
          let params = {
            ids: ids
          };
          FaultAlarmSettingService.deleteShopFaultSetting(
            params,
            data => {
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.refresh();
            },
            ErrorData => {
              this.$message.warning(ErrorData.errorMessage);
            }
          );
        })
        .catch(() => {});
    },
    handleSelectionChange(val) {
      this.operations[1].disabled = true;
      if (val.length > 0) {
        this.operations[1].disabled = false;
      }
      this.multipleSelection = val;
    },
    handleSizeChange(val) {
      this.pagination.pageSize = val;
      this.getShopFaultSetting();
    },
    handleCurrentChange(val) {
      this.pagination.currentPage = val;
      this.getShopFaultSetting();
    },
    // 按查询条件，获取故障类型列表（高级设置）
    getShopFaultTypeList() {
      let params = {
        shopId: window.top.SHOP_ID || ''
      };
      FaultAlarmSettingService.getShopFaultTypeList(
        params,
        data => {
          this.faultTypes = data.faultTypeList;
        },
        ErrorData => {
          console.log(ErrorData);
          console.log('code错误');
        }
      );
    },
    getFaultType(row) {
      let index = this.faultTypes.findIndex(item => item.id === row.faultTypeId);

      // 没找到故障类型
      if (index === -1) {
        return '--';
      }

      return this.faultTypes[index].name;
    }
  },
  watch: {}
};
</script>

<style lang="scss">
.fault-alarm-setting {
  .biz-popup .popup-content {
    width: 700px;
  }
  .biz-save-button {
    margin-top: 10px;
  }
}
</style>
