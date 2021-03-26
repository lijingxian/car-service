<template>
  <biz-grid class="membership-mgmt__vehicle-info" v-loading="loading">
    <biz-header :operations="operations" @operate="handleOperate" v-if="isEdit">
    </biz-header>
    <el-table :data="tableData" style="width: 100%" height="85%" @selection-change="handleSelectionChange"
      @row-click="handleRowClick" size="small">
      <biz-empty-table slot="empty"></biz-empty-table>
      <el-table-column prop="plateNumber" label="车牌号"></el-table-column>
      <el-table-column prop="type" label="车型"></el-table-column>
      <el-table-column prop="engineNumber" label="发动机号"></el-table-column>
      <el-table-column prop="vin" label="车辆识别代号" min-width="120"></el-table-column>
      <el-table-column prop="title" label="操作" width="80" v-if="ishandler">
        <template slot-scope="scope">
          <el-button type="text" size="mini" @click="rowDeleteClickHandler($event, scope.row)" v-if="isEdit">
            删除
          </el-button>
          <el-button type="text" size="mini" @click="handleRowClick($event, scope.row)" v-if="isEdit">
            编辑
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog class="box-card" :visible.sync="showForm" center append-to-body width="500px">
      <vehicle-base-info-content ref="baseInfo" :itemId="formId" :memberId="itemId" @operationSuccess="handleOperationSuccess"></vehicle-base-info-content>
      <biz-save-button :operations="formOperations" @operate="handleOperate" style="margin-top: 10px;"></biz-save-button>
    </el-dialog>
  </biz-grid>
</template>

<script>
import BizSaveButton from '@/components/BizSaveButton';
import { BizHeader } from '@/components/BizTable';
import { BizGrid } from '@/components/BizGrid';
import BizEmptyTable from '@/components/BizTable/BizEmptyTable';
import { membershipMgmt as service } from '@/common/urls';
import http from '@/common/http';
import { mapGetters } from 'vuex';
import VehicleBaseInfoContent from '@/pages/operating/vehicle-mgmt/vehicle/VehicleBaseInfoContent';

// 基础内容
const dataBase = {
  data: {
    loading: false,
    ishandler: true,
    show: true,
    operations: [
      {
        label: '新增',
        name: 'add',
        type: 'primary'
      }
      // {
      //   label: '删除',
      //   name: 'delete',
      //   type: '',
      //   disabled: true
      // }
    ]
  },
  methods: {
    ...mapGetters(['currentUser']),
    getQueryParams() {
      return {
        shopId: this.currentUser().shop.id,

        userId: this.itemId.id,

        pageSize: 100,
        pageNumber: 1
      };
    },
    query() {
      this.loading = true;

      http
        .get(service.vehicleInfo.list, this.getQueryParams())
        .then(data => {
          this.tableData = data.ownCars;
          this.showForm = false;
          this.show = true;
        })
        .catch(errData => {
          console.log(errData);
          console.log('code错误');
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(() => {
          this.loading = false;
        });
    },

    add() {
      this.initForm();
    },
    delete() {
      if (this.selections && this.selections.length > 0) {
        let ids = [];
        this.selections.forEach(element => {
          ids.push(element.id);
        });
        this.deleteItem(ids);
      } else {
        this.$message('请选择一条数据');
      }
    }
  },
  events: {
    handleOperate(name) {
      this[name]();
    }
  }
};

// Table相关
const dataTable = {
  data: {
    tableData: [],
    selections: []
  },
  methods: {
    deleteItem(ids) {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true;
        let params = { ids: ids };
        http
          .post(service.vehicleInfo.delete, params)
          .then(data => {
            this.$message.success('删除成功');
            this.query();
          })
          .catch(errData => {
            console.log(errData);
            console.log('code错误');
            if (errData.errorMessage) {
              this.$message.warning(errData.errorMessage);
            }
          })
          .finally(() => {
            this.loading = false;
          });
      });
    }
  },
  events: {
    rowDeleteClickHandler(e, row) {
      e.stopPropagation();

      this.deleteItem([row.id]);
    },
    handleRowClick(row) {
      this.initForm(row);
    },
    handleSelectionChange(val) {
      this.operations[1].disabled = true;
      if (val.length > 0) {
        this.operations[1].disabled = false;
      }
      this.selections = val;
    }
  }
};

// 表单相关
const dataForm = {
  data: {
    showForm: false,
    formId: { id: '' },
    formOperations: [
      {
        label: '取消',
        name: 'cancelForm'
      },
      {
        label: '保存',
        name: 'saveForm',
        type: 'primary'
      }
    ]
  },
  methods: {
    initForm(model) {
      if (model) this.formId = { id: model.id, carShipId: model.carshipId };
      else this.formId = { id: '' };

      this.showForm = true;
    },

    cancelForm() {
      this.showForm = false;
      this.show = true;
    },
    saveForm() {
      let params = this.$refs.baseInfo.getSaveParams();
      params.userId = this.itemId.id;
      params.carSales = this.$refs.baseInfo.getSaveParams().carSalesData;
      params.carQualityAssurance = this.$refs.baseInfo.getSaveParams().carQualityAssurance;
      params.car = {
        id: params.id,
        plateNumber: params.plateNumber,
        brand: params.brand,
        series: params.series,
        type: params.type,
        shop: params.shop,
        state: params.state,
        onTime: params.onTime,
        isCV: params.isCV,
        trafficControl: params.trafficControl,
        remarks: params.remarks,
        drivingRange: params.drivingRange,
        carshipId: params.carshipId,
        vin: params.vin,
        engineNumber: params.engineNumber,
        bodyColor: params.bodyColor,
        plateColor: params.plateColor,
        fuelGrade: params.fuelGrade,
        transmissionType: params.transmissionType,
        dischargeStandard: params.dischargeStandard,
        productionTime: params.productionTime,
        terminals: params.terminals,
        carLicense: params.carLicense
      };
      this.formId.id &&
        http
          .post(service.vehicleInfo.update, params)
          .then(data => {
            this.$message.success('保存成功');
            this.query();
          })
          .catch(errData => {
            console.log(errData);
            console.log('code错误');
            if (errData.errorMessage) {
              this.$message.warning(errData.errorMessage);
            }
          })
          .finally(() => {
            this.loading = false;
          });
      !this.formId.id &&
        http
          .post(service.vehicleInfo.add, params)
          .then(data => {
            this.$message.success('保存成功');
            this.query();
          })
          .catch(errData => {
            console.log(errData);
            console.log('code错误');
            if (errData.errorMessage) {
              this.$message.warning(errData.errorMessage);
            }
          })
          .finally(() => {
            this.loading = false;
          });
    }
  },
  events: {
    handleOperationSuccess() {
      this.query();
    }
  }
};

export default {
  name: 'MembershipMgmtVehicleInfo',
  components: {
    BizHeader,
    BizGrid,
    BizSaveButton,
    VehicleBaseInfoContent,
    BizEmptyTable
  },
  props: {
    itemId: {
      type: Object,
      default() {
        return {
          id: ''
        };
      }
    },
    isEdit: {
      type: Boolean,
      default() {
        return true;
      }
    },
    alertId: {
      type: Object,
      default() {
        return {
          id: ''
        };
      }
    }
  },
  data() {
    return {
      ...dataBase.data,
      ...dataTable.data,
      ...dataForm.data
    };
  },
  methods: {
    ...dataBase.methods,
    ...dataBase.events,

    ...dataTable.methods,
    ...dataTable.events,

    ...dataForm.methods,
    ...dataForm.events
  },
  watch: {
    itemId(nVal, oVal) {
      if (nVal.id) {
        this.query();
      }
    },
    alertId(val) {
      if (val.id) {
        // 根据回访提醒获取回访记录的默认值
        this.getCallbackInfo(val);
      }
    }
  },
  created() {
    if (this.itemId.id) this.query();
  }
};
</script>

<style lang="scss">
.membership-mgmt__vehicle-info {
  .el-table .cell {
    flex-wrap: wrap;
  }
  .biz-header .biz-header__operation-wrapper {
    float: left;
  }
  .box-card {
    .biz-save-button {
      margin-right: 0;
    }
    .el-card__body {
      padding: 3px
    }
  }
}
</style>
