<template>
  <biz-grid class="add-product">
    <biz-save-button slot="top" :operations="operations" @operate="operate"></biz-save-button>
    <el-form ref="dialogForm" :model="formModel" size="small" label-width="120px" :inline-message="true">
      <div class="fault">
        <el-form-item label="故障码" prop="faultCode">
          <el-input v-model="formModel.faultCode" style="width:180px;"></el-input>
        </el-form-item>
        <el-form-item label="故障描述" prop="faultDescription">
          <el-input v-model="formModel.faultDescription" style="width:180px;"></el-input>
        </el-form-item>
        <el-form-item label="故障类型" prop="faultType">
          <el-select placeholder="请选择" v-model="formModel.faultType" style="width:180px;">
            <el-option v-for="item of faultTypes" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-button type="text" @click.stop="more">更多</el-button>
      </div>
      <div class="fault" v-show="showMore">
        <el-form-item label="spn" prop="faultSpn">
          <el-input v-model="formModel.faultSpn" style="width:180px;"></el-input>
        </el-form-item>
        <el-form-item label="fmi" prop="faultFmi">
          <el-input v-model="formModel.faultFmi" style="width:180px;"></el-input>
        </el-form-item>
        <el-form-item label="dtcm" prop="faultDtcm">
          <el-input v-model="formModel.faultDtcm" style="width:180px;"></el-input>
        </el-form-item>
      </div>
      <el-button
        type="primary"
        @click.stop="faultSelect"
        style="font-size: 12px; border-radius: 3px;padding: 7px 15px;margin-top:10px;float: left;margin-right:20px;margin-bottom:20px"
      >检索</el-button>
    </el-form>
    <biz-list :tableData="dialogTableData" ref="dialogTable" v-show="faultSelectTableVisible" @handleSelectionChange="handleFaultSelectionChange">
      <el-table-column type="selection" width="42" :selectable="isSelected"></el-table-column>
      <el-table-column prop="faultCode" label="故障码"></el-table-column>
      <el-table-column prop="faultDescription" label="故障描述" width="150px" show-overflow-tooltip>
        <template slot-scope="scope">
          <div class="titleClass" :title="scope.row.faultDescription">{{scope.row.faultDescription}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="faultTypeId" label="故障类型" :formatter="getFaultType"></el-table-column>
      <el-table-column prop="faultSpn" label="spn"></el-table-column>
      <el-table-column prop="faultFmi" label="fmi"></el-table-column>
      <el-table-column prop="faultDtcm" label="dtcm"></el-table-column>
    </biz-list>
    <biz-pagination
      v-show="faultDialogPaginationVisible"
      :pagination="dialogPagination"
      @handleSizeChange="handleDialogSizeChange"
      @handleCurrentChange="handleDialogCurrentChange"
    ></biz-pagination>
  </biz-grid>
</template>
<script>
import { BizGrid } from '@/components/BizGrid';
import BizList from '@/components/BizTable/BizList';
import BizSaveButton from '@/components/BizSaveButton';
import { BizPagination } from '@/components/BizTable';
import FaultAlarmSettingService from '@/service/fault-alarm-setting/faultAlarmSetting';
import { mapGetters } from 'vuex';
export default {
  components: {
    BizGrid,
    BizSaveButton,
    BizPagination,
    BizList
  },
  data() {
    return {
      operations: [{ label: '清除', name: 'clear', type: '' }, { label: '保存', name: 'selectOk', type: 'primary' }],
      dialogTableData: [],
      faultTypes: [],
      faultSelectTableVisible: false,
      faultDialogPaginationVisible: false,
      formModel: {
        id: '',
        faultId: '',
        faultCode: '',
        faultDescription: '',
        faultType: '',
        faultSpn: '',
        faultFmi: '',
        faultDtcm: ''
      },
      dialogPagination: {
        pageSize: 10,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        total: 0
      },
      multipleFaultSelection: [],
      faultIds: [],
      showMore: false
    };
  },
  props: {
    productData: {
      type: Array
    }
  },
  computed: {},
  watch: {},
  created() {
    this.getShopFaultTypeList();
    this.faultSelect();
  },
  methods: {
    ...mapGetters(['getUser']),
    operate(name) {
      this[name]();
    },
    getDefaultProductDataModel() {
      return {
        id: '',
        faultId: '',
        faultCode: '',
        faultDescription: '',
        faultType: '',
        faultSpn: '',
        faultFmi: '',
        faultDtcm: ''
      };
    },
    clear() {
      this.formModel = this.getDefaultProductDataModel();
      this.getShopDiagFaultList();
    },
    more() {
      this.showMore = !this.showMore;
      this.formModel.faultSpn = '';
      this.formModel.faultFmi = '';
      this.formModel.faultDtcm = '';
    },
    faultSelect() {
      if (!this.faultSelectTableVisible) {
        this.faultSelectTableVisible = true;
        this.faultDialogPaginationVisible = true;
      } else {
        this.dialogTableData.splice(0, this.dialogTableData.length);
        this.dialogPagination.pageSize = 10;
        this.dialogPagination.currentPage = 1;
        this.dialogPagination.total = 0;
      }

      this.getShopDiagFaultList();
    },
    selectOk() {
      this.faultSelectTableVisible = true;
      this.faultDialogPaginationVisible = true;
      this.addShopFaultSetting();
    },
    refresh() {
      this.getShopFaultTypeList();
    },
    // 添加店铺故障关联设置（高级设置）
    addShopFaultSetting() {
      for (const iterator of this.multipleFaultSelection) {
        this.faultIds.push(iterator.faultId);
      }
      if (this.faultIds.length === 0) {
        this.$message.warning('您还未选中');
        return;
      }
      let params = {
        shopId: window.top.SHOP_ID || '',
        faultIDs: this.faultIds
      };
      FaultAlarmSettingService.addShopFaultSetting(
        params,
        data => {
          this.$message.success('操作成功');
          this.$emit('operationSuccess');
        },
        ErrorData => {
          console.log(ErrorData);
          this.$message.warning(ErrorData.errorMessage);
        }
      );
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
    // 按查询条件，获取故障列表（高级设置）
    getShopDiagFaultList() {
      let params = {
        faultCode: this.formModel.faultCode,
        faultDescription: this.formModel.faultDescription,
        faultTypeId: this.formModel.faultType,
        faultSpn: this.formModel.faultSpn,
        faultFmi: this.formModel.faultFmi,
        faultDtcm: this.formModel.faultDtcm,
        pageNumber: this.dialogPagination.currentPage,
        pageSize: this.dialogPagination.pageSize
      };
      FaultAlarmSettingService.getShopDiagFaultList(
        params,
        data => {
          this.dialogTableData = data.ShopFaultSettingDataList;
          this.dialogPagination.total = Number(data.total);
        },
        ErrorData => {
          console.log(ErrorData);
          console.log('code错误');
        }
      );
    },
    handleFaultSelectionChange(val) {
      this.multipleFaultSelection = val;
    },
    filterDataChange(val) {
      this.getShopFaultSetting();
    },
    handleDialogSizeChange(val) {
      this.dialogPagination.pageSize = val;
      this.getShopDiagFaultList();
    },
    handleDialogCurrentChange(val) {
      this.dialogPagination.currentPage = val;
      this.getShopDiagFaultList();
    },
    isSelected(row) {
      for (const iterator of this.productData) {
        if (
          row.faultCode === iterator.faultCode &&
          row.faultSpn === iterator.faultSpn &&
          row.faultFmi === iterator.faultFmi
        ) {
          return false;
        }
      }
      return true;
    },
    getFaultType(row) {
      let index = this.faultTypes.findIndex(item => item.id === row.faultTypeId);

      // 没找到故障类型
      if (index === -1) {
        return '';
      }

      return this.faultTypes[index].name;
    }
  }
};
</script>
<style lang="scss">
.add-product {
  .biz-save-button {
    justify-content: flex-start;
  }
  .biz-grid {
    padding: 0px;
  }
  .titleClass {
    text-overflow: ellipsis;
    overflow: hidden;
    width: 120px;
    white-space: nowrap;
  }
}
</style>
