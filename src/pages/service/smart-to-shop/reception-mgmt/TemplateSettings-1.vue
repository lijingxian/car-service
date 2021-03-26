<template>
  <biz-grid class="template-setting" v-loading="loading">
    <biz-header :operations="operations" @operate="handleOperate">
    </biz-header>
    <el-table :data="tableData" height="300" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55">
      </el-table-column>
      <el-table-column label="道闸" prop="plateNumber"></el-table-column>
      <el-table-column label="模版类型" prop="type"></el-table-column>
      <el-table-column label="模版消息" prop="remarks"></el-table-column>
    </el-table>

    <el-card class="box-card" v-show="showForm" style="margin-top: 20px;" v-loading="formLoading">
      <el-form ref="form" size="small" label-width="110px" :model="formModel" :rules="rules">
        <el-form-item label="道闸" prop="plateNumber">
          <el-select placeholder="请选择道闸">
            <el-option label="" value=""></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="模版类型" prop="plateNumber">
          <el-select placeholder="请选择模版类型" disbaled>
            <el-option label="" value=""></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="会员等级" prop="plateNumber">
          <el-select placeholder="请选择会员等级">
            <el-option label="" value=""></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="模版消息">
          <div slot="label">
            模版消息
            <el-button type="text" size="small" v-popover:codePop>
              <i class="iconfont el-icon-question"></i>
            </el-button>
            <el-popover ref="codePop" placement="bottom-start" width="300" trigger="hover" content="不超过30个字，可选择（车牌、等级、会员姓名）进行修改">
            </el-popover>
          </div>
          <el-input v-model="formModel.remarks" maxlength="30" type="textarea" placeholder="请输入模版消息"></el-input>
        </el-form-item>
      </el-form>
      <biz-save-button :operations="formOperations" @operate="handleOperate" style="margin-right: 0;">
      </biz-save-button>
    </el-card>
  </biz-grid>
</template>

<script>
import BizSaveButton from '@/components/BizSaveButton';
import { BizHeader } from '@/components/BizTable';
import { BizGrid } from '@/components/BizGrid';
import { customerService } from '@/common/urls';
import http from '@/common/http';
export default {
  props: {
    itemId: {
      type: Object,
      default() {
        return { id: '' };
      }
    },
    isEdit: {
      type: Boolean,
      default () {
        return true;
      }
    }
  },
  components: {
    BizHeader,
    BizGrid,
    BizSaveButton
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
      operations: [
        {
          label: '新增',
          name: 'add',
          type: 'primary'
        },
        {
          label: '删除',
          name: 'delete',
          type: 'primary'
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
      tableData: []
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
    typeChange() {
      this.$refs.form.clearValidate('type');
    },
    getType(row) {
      switch (row.type) {
        case '0':
          return '体验车辆';
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
    autoReleaseList() {
      this.loading = true;
      this.showForm = false;
      let params = { shopId: window.top.SHOP_ID || '' };
      http
        .get(customerService.ReceptionMgmt.autoReleaseList, params)
        .then(data => {
          this.tableData = data.dataList;
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
      this.$refs.form.clearValidate();
      this.showForm = true;
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
.template-setting {
  padding-top: 20px;
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
