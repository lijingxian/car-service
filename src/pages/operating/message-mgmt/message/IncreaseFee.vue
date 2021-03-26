<template>
  <biz-grid class="increase-fee">
    <biz-save-button slot="top" :operations="operations" @operate="operate">
    </biz-save-button>
    <el-form :rules="rules" ref="form" :model="form" label-width="120px" size="small" v-loading="loading" :inline-message="true">
      <el-form-item label="短信续增数量" prop="count">
        <el-input placeholder="请输入短信续增数量" v-model="form.count" type="number"></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="remarks">
        <el-input v-model="form.remarks" type="textarea"></el-input>
      </el-form-item>
      <el-form-item label="操作者" prop="operator">
        <el-input v-model="form.operator" disabled></el-input>
      </el-form-item>
    </el-form>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import BizSaveButton from '@/components/BizSaveButton';
import service from '@/service/message-mgmt/messageMgmt';
import { mapGetters } from 'vuex';
export default {
  name: 'IncreaseFee',
  props: {
    itemId: {
      type: String
    }
  },
  components: {
    BizGrid,
    BizSaveButton
  },
  data() {
    return {
      showSetting: false,
      showUnionType: true,
      rules: {
        count: [
          {
            required: true,
            trigger: 'blur',
            validator: (rule, rules, callback) => {
              if (this.form.count === '' || Number(this.form.count) <= 0) {
                callback(new Error('请输入大于0的数字'));
              } else {
                callback();
              }
            }
          }
        ],
        operator: [
          { required: true, trigger: 'blur', message: '操作者不能为空' }
        ]
      },
      // 用户信息
      form: {
        count: '',
        operator: '',
        remarks: ''
      },
      operations: [
        {
          label: '保存',
          name: 'save',
          type: 'primary'
        }
      ],
      loading: false,
      showDialog: false,
      // 红字错误提示
      errorMobile: '',
      errorRole: '',
      errUserName: '',
      errName: ''
    };
  },
  created() {},
  mounted() {
    this.form.operator = this.getUser().realName;
  },
  methods: {
    ...mapGetters(['getUser']),
    operate(name) {
      this[name]();
    },
    // 显示消息提示
    showNotify(msg, type) {
      this.$notify({
        showClose: true,
        message: msg,
        type: type
      });
    },
    save() {
      this.$refs.form.validate((valid, a) => {
        if (valid) {
          service.createSmsRecord(
            this.getSaveParams(),
            data => {
              this.$message.success('保存成功');
              this.form.count = '';
              this.form.remarks = '';
              this.$emit('operationSuccess');
            },
            // result_code 不是100的处理
            ErrorData => {
              this.$message.warning(ErrorData.errorMessage);
            }
          );
        }
      });
    },
    getSaveParams() {
      return {
        count: this.form.count,
        remarks: this.form.remarks
      };
    }
  }
};
</script>

<style lang="scss">
.increase-fee {
  .el-form {
    height: 100%;
    overflow: auto;
    padding-top: 20px;
    padding-right: 20px;
  }
  .el-row {
    margin: 30px;
    font-size: 14px;
  }
  .el-form-item__content > :first-child {
    margin-top: 0;
  }
  .el-checkbox-group .el-checkbox {
    width: 170px;
    margin: 0;
  }
  .el-input--suffix .el-input__inner {
    height: 32px;
    line-height: 32px;
  }
  .grid-content {
    height: 32px;
    line-height: 32px;
  }
}
</style>
