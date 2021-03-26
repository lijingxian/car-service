<template>
  <biz-grid class="car-setting" v-loading="loading">
    <biz-header :operations="operations" @operate="handleOperate" v-if="isEdit">
    </biz-header>
    <el-form size="small" label-width="110px" :model="form" :disabled="!isEdit">
      <el-form-item label="自有车辆统计">
        <el-radio v-model="form.recordFlag" label="0">否</el-radio>
        <el-radio v-model="form.recordFlag" label="1">是</el-radio>
      </el-form-item>
    </el-form>
    <el-table :data="tableData" height="100%" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55">
      </el-table-column>
      <el-table-column label="车牌号" prop="plateNumber" width="80px"></el-table-column>
      <el-table-column label="车辆类型" prop="type" :formatter="getType" width="80px"></el-table-column>
      <el-table-column label="状态" prop="isOpen" :formatter="getState" width="50px"></el-table-column>
      <el-table-column label="说明" prop="remarks" width="150px"></el-table-column>
      <el-table-column label="操作" min-width="50">
        <template slot-scope="scope">
          <el-button type="text" size="mini" @click="handleStopClick($event, scope.row)">
            {{scope.row.isOpen==='1'?'停用':'启用'}}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <biz-pagination slot="bottom" :pagination="pagination" @handleSizeChange="handleSizeChange"
      @handleCurrentChange="handleCurrentChange"></biz-pagination>
    <el-dialog class="box-card" :visible.sync="showForm" center append-to-body width="500px" v-loading="formLoading">
      <el-form ref="form" size="small" label-width="110px" :model="formModel" :rules="rules">
        <el-form-item label="车牌号" prop="plateNumber">
          <el-input v-model="formModel.plateNumber" style="width:210px"></el-input>
        </el-form-item>
        <el-form-item label="车辆类型" prop="type">
          <el-select v-model="formModel.type" placeholder="请选择车辆" @change="typeChange">
            <el-option v-for="(types,index) in typeList" :key="index" :label="types.label" :value="types.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="说明">
          <el-input v-model="formModel.remarks" maxlength="100" type="textarea" placeholder="请输入说明"></el-input>
        </el-form-item>
      </el-form>
      <biz-save-button :operations="formOperations" @operate="handleOperate" style="margin-right: 0;">
      </biz-save-button>
    </el-dialog>
  </biz-grid>
</template>

<script>
import BizSaveButton from '@/components/BizSaveButton';
import { BizHeader, BizPagination } from '@/components/BizTable';
import { BizGrid } from '@/components/BizGrid';
import { customerService } from '@/common/urls';
import http from '@/common/http';
export default {
  name: 'MemberBaseInfo',
  props: {
    itemId: {
      type: Object,
      default() {
        return { id: '' };
      }
    },
    isEdit: {
      type: Boolean,
      default() {
        return true;
      }
    }
  },
  components: {
    BizHeader,
    BizGrid,
    BizSaveButton,
    BizPagination
  },
  data() {
    return {
      rules: {
        plateNumber: [
          { required: true, message: '请输入车牌号', trigger: 'blur' },
          {
            pattern: /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1,2}[A-Z0-9]{4,5}[A-Z0-9挂学警港澳]{1}$/,
            message: '车牌号格式不正确',
            trigger: 'blur'
          }
        ],
        type: [{ required: true, message: '请选择车牌类型', trigger: 'blur' }]
      },
      loading: false,
      formLoading: false,
      showForm: false,
      totalBean: '',
      // 用户信息
      formModel: {
        plateNumber: '',
        type: '',
        remarks: ''
      },
      form: {
        recordFlag: ''
      },
      operations: [
        {
          label: '新增',
          name: 'add',
          type: 'primary',
          auth: ['admin:reception.edit']
        },
        {
          label: '删除',
          name: 'delete',
          type: '',
          disabled: true,
          auth: ['admin:reception.edit']
        },
        {
          label: '保存',
          name: 'saveForm',
          type: 'primary',
          auth: ['admin:reception.edit']
        }
      ],
      formOperations: [
        {
          label: '取消',
          name: 'cancelForm'
        },
        {
          label: '保存',
          name: 'save',
          type: 'primary'
        }
      ],
      selections: [],
      tableData: [],
      pagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        total: 0
      },
      typeList: [
        { label: '试驾车辆', value: '0' },
        { label: '员工车辆', value: '1' },
        { label: '工程车辆', value: '2' },
        { label: '其他车辆', value: '3' }
      ]
    };
  },
  mounted() {
    this.autoReleaseList();
    this.statisticsOwnerCar();
  },
  methods: {
    // 显示消息提示
    showNotify(msg, type) {
      this.$notify({
        showClose: true,
        message: msg,
        type: type
      });
    },
    handleStopClick(e, row) {
      if (row.isOpen === '0') {
        row.isOpen = '1';
      } else {
        row.isOpen = '0';
      }
      http
        .put(customerService.ReceptionMgmt.autoRelease, row)
        .then(data => {
          this.$message.success('保存成功');
          this.$emit('update');
          this.autoReleaseList();
        })
        .catch(ErrorData => {
          this.$message.warning(ErrorData.errorMessage);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    typeChange() {
      this.$refs.form.clearValidate('type');
    },
    getType(row) {
      switch (row.type) {
        case '0':
          return '试驾车辆';
        case '1':
          return '员工车辆';
        case '2':
          return '工程车辆';
        case '3':
          return '其他车辆';
        default:
          return '';
      }
    },
    getState(row) {
      switch (row.isOpen) {
        case '0':
          return '停用';
        case '1':
          return '启用';
        default:
          return '';
      }
    },
    autoReleaseList() {
      this.loading = true;
      this.showForm = false;
      let params = {
        shopId: window.top.SHOP_ID || '',
        pageNumber: this.pagination.currentPage,
        pageSize: this.pagination.pageSize
      };
      http
        .get(customerService.ReceptionMgmt.autoReleaseList, params)
        .then(data => {
          this.tableData = data.dataList;
          this.pagination.total = Number(data.total);
        })
        .catch(ErrorData => {
          this.$message.warning(ErrorData.errorMessage);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    statisticsOwnerCar() {
      this.loading = true;
      this.showForm = false;
      let params = { shopId: window.top.SHOP_ID || '' };
      http
        .get(customerService.ReceptionMgmt.statisticsOwnerCar, { params })
        .then(data => {
          this.form.recordFlag = data.recordFlag;
        })
        .catch(ErrorData => {
          this.$message.warning(ErrorData.errorMessage);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    handleOperate(name) {
      this[name]();
    },
    handleSelectionChange(val) {
      this.selections = val;
      this.operations[1].disabled = true;
      if (val.length > 0) {
        this.operations[1].disabled = false;
      }
    },
    save() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true;
          http
            .post(customerService.ReceptionMgmt.autoRelease, this.formModel)
            .then(data => {
              this.$message.success('保存成功');
              this.$emit('update');
              this.autoReleaseList();
            })
            .catch(ErrorData => {
              this.$message.warning(ErrorData.errorMessage);
            })
            .finally(() => {
              this.loading = false;
            });
        }
      });
    },
    delete() {
      let ids =
        this.selections.length === 0
          ? []
          : this.selections.map(item => {
            return item.id;
          });
      if (ids.length === 0) {
        this.$message.warning('未选择删除条目');
        return;
      }
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let params = {
          ids: ids
        };
        this.loading = true;
        http
          .delete(customerService.ReceptionMgmt.autoRelease, params)
          .then(data => {
            this.loading = false;
            this.$message.success('删除成功');
            this.autoReleaseList();
          })
          .catch(ErrorData => {
            this.loading = false;
            this.$message.warning(ErrorData.errorMessage);
          });
      });
    },
    saveForm() {
      http
        .put(customerService.ReceptionMgmt.statisticsOwnerCar, this.form)
        .then(data => {
          this.$message.success('保存成功');
          this.$emit('update');
          this.statisticsOwnerCar();
        })
        .catch(ErrorData => {
          this.$message.warning(ErrorData.errorMessage);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    add() {
      this.formModel = {};
      this.showForm = true;
      this.$refs.form.clearValidate();
    },
    handleSizeChange(val) {
      this.pagination.pageSize = val;
      this.autoReleaseList();
    },
    handleCurrentChange(val) {
      this.pagination.currentPage = val;
      this.autoReleaseList();
    },
    cancelForm() {
      this.showForm = false;
    },
    showStorePicker(e) {
      this.showDialog = true;
    }
  }
};
</script>

<style lang="scss">
.car-setting {
  .el-table {
    overflow: auto;
  }
  .el-table-column--selection .cell {
    padding-left: 5px;
    padding-right: 5px;
  }
  .el-table__body-wrapper .is-scrolling-none {
    overflow-x: auto;
  }
  .el-table .cell {
    padding-left: 5px;
    padding-right: 5px;
  }
  .header_bean {
    position: absolute;
    right: 0px;
    top: 10px;
    color: #606266;
    font-size: 14px;
  }
  .el-input-number--small {
    width: 100%;
  }
}
</style>
