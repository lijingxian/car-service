<template>
  <biz-grid class="communi-mgmt-operator-base-info">
    <biz-save-button slot="top" :operations="operations" @operate="operate">
    </biz-save-button>
    <el-form :rules="rules" :model="form" ref="form" label-width="125px" size="small" v-loading="loading" :inline-message="true">
      <el-form-item label="运营商名称" prop="name">
        <el-input placeholder="请输入运营商名称" v-model="form.name" maxlength="20"></el-input>
      </el-form-item>
      <el-form-item label="电话" prop="phone">
        <el-input placeholder="请输入电话" v-model="form.phone"></el-input>
      </el-form-item>
      <el-form-item label="地址" prop="address">
        <el-input placeholder="请输入运营商详细地址" v-model="form.address"></el-input>
      </el-form-item>
      <el-form-item label="充值接口" prop="recharge">
        <el-input placeholder="请输入充值接口" v-model="form.recharge"></el-input>
      </el-form-item>
      <el-form-item label="通讯卡查询接口" prop="simQuery">
        <el-input placeholder="请输入通讯卡查询接口" v-model="form.simQuery"></el-input>
      </el-form-item>
      <el-form-item label="短信发送接口" prop="smsSend">
        <el-input placeholder="请输入短信发送接口" v-model="form.smsSend"></el-input>
      </el-form-item>
      <el-form-item label="短信用量查询接口" prop="smsQuery">
        <el-input placeholder="请输入短信用量查询接口" v-model="form.smsQuery"></el-input>
      </el-form-item>
    </el-form>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import BizSaveButton from '@/components/BizSaveButton';

import service from '@/service/communi-mgmt/communiOperator';

export default {
  name: 'OperatorBaseInfo',
  props: {
    itemId: {
      type: Object,
      default() {
        return { id: '' };
      }
    }
  },
  data() {
    return {
      loading: false,
      operations: [{ label: '保存', name: 'save', type: 'primary' }],
      rules: {
        name: [
          { required: true, message: '请填写电信运营商名称', trigger: 'blur' }
        ],
        phone: [
          {
            required: false,
            message: '电话号不能少于5位',
            trigger: 'blur',
            min: 5
          },
          { pattern: /^[-0-9]*$/, message: '请输入数字', trigger: 'blur' }
        ]
      },
      form: this.resetForm()
    };
  },
  components: {
    BizGrid,
    BizSaveButton
  },
  methods: {
    operate(name) {
      this[name]();
    },
    resetForm() {
      return {
        name: '',
        phone: '',
        address: '',
        recharge: 'http://',
        simQuery: 'http://',
        smsSend: 'http://',
        smsQuery: 'http://'
      };
    },
    clear() {
      this.form = this.resetForm();
      this.$refs.form.resetFields();
    },
    refresh() {
      this.loading = true;
      let params = this.itemId;
      service.queryBaseInfo(
        params,
        data => {
          this.loading = false;
          Object.assign(this.form, data.content);
        },
        ErrorData => {
          this.loading = false;
          console.log('ERR_REFRESH: ', ErrorData);
          this.$message.warning(ErrorData.errorMessage);
        }
      );
    },
    save() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.submit();
        } else {
          return false;
        }
      });
    },
    submit() {
      if (!this.itemId.id) {
        this.create();
      } else {
        this.update();
      }
    },
    create() {
      this.loading = true;
      let params = Object.assign({}, this.form);
      service.createBaseInfo(
        params,
        data => {
          this.loading = false;
          this.$message.success('操作成功');
        },
        ErrorData => {
          console.log('ERR_CREATE: ', ErrorData.errorMessage);
          this.$message.warning(ErrorData.errorMessage);
        }
      );
    },
    update() {
      this.loading = true;
      let params = Object.assign({}, this.form, this.itemId);
      service.updateBaseInfo(
        params,
        data => {
          this.loading = false;
          this.$message.success('操作成功');
        },
        ErrorData => {
          this.loading = false;
          console.log('ERR_UPDATE: ', ErrorData);
          this.$message.warning(ErrorData.errorMessage);
        }
      );
    },
    showMessage(msg, type) {
      this.$notify({
        message: msg,
        type: type,
        showClose: true
      });
    }
  },
  mounted() {},
  watch: {
    itemId(newVal, oldVal) {
      this.clear();
      if (newVal.id !== '') {
        this.refresh();
      }
    }
  }
};
</script>

<style lang="scss">
.communi-mgmt-operator-base-info {
  .biz-save-button {
    justify-content: flex-start;
  }
  .el-form {
    height: 100%;
    overflow: auto;
    padding-top: 20px;
    padding-right: 20px;
  }
  .el-select {
    margin-top: 18px;
  }
  .el-form-item__content > :first-child {
    margin-top: 0;
  }
  .transition-box {
    margin-top: 10px;
  }
  .el-checkbox-group .el-checkbox {
    width: 165px;
    margin: 0;
    .el-checkbox__label {
      width: 140px;
      white-space: normal;
    }
  }
}
</style>
