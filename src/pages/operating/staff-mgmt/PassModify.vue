<template>
  <biz-grid class="staff-mgmt-admin-mgmt-pass-modify">
    <biz-save-button slot="top" :operations="operations" @operate="operate" v-if="isEdit">
    </biz-save-button>
    <el-form :rules="rules" ref="form" :model="form" label-width="120px" size="small" v-loading="loading" :disabled="!isEdit" :inline-message="true">
      <input type="password" name="pwd" v-show="false">
      <el-form-item label="新密码" prop="pass">
        <el-input type="password" auto-complete="off" placeholder="请输入6-16位密码" v-model="form.pass"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="checkpass">
        <el-input type="password" auto-complete="off" placeholder="再次确认密码" v-model="form.checkpass"></el-input>
      </el-form-item>
    </el-form>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import BizSaveButton from '@/components/BizSaveButton';
import AdminMgmtInfo from '@/service/staff-mgmt/adminMgmtInfo';

export default {
  name: 'PassModify',
  components: {
    BizGrid,
    BizSaveButton
  },
  props: {
    id: {
      type: String,
      default: ''
    },
    masterId: {
      type: String,
      default: ''
    },
    isEdit: {
      type: Boolean,
      default () {
        return true;
      }
    }
  },
  data () {
    // 密码校验Start
    let validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else {
        if (this.form.checkpass !== '') {
          this.$refs.form.validateField('checkpass');
        }
        callback();
      }
    };
    let validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.form.pass) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    // 密码校验End
    return {
      operations: [
        {
          label: '保存',
          name: 'save',
          type: 'primary',
          auth: ['admin:admin.edit']
        }
      ],
      form: {
        pass: '',
        checkpass: ''
      },
      rules: {
        pass: [
          { validator: validatePass, trigger: 'blur' },
          { required: true, min: 6, max: 16, message: '长度在6-16个字符', trigger: 'blur' }
        ],
        checkpass: [
          { required: true, validator: validatePass2, trigger: 'blur' }
        ]
      },
      loading: false
    };
  },
  create() {
    this.refresh();
  },
  watch: {
    id(nVal, oVal) {
      this.$refs.form.clearValidate();
    }
  },
  methods: {
    operate(name) {
      this[name]();
    },
    // 显示消息提示
    showMessage(msg, type) {
      this.$notify({
        showClose: true,
        message: msg,
        type: type
      });
    },
    refresh() {
      let params = {
        id: this.id
      };
      this.loading = true;
      AdminMgmtInfo.get(
        params,
        data => {
          this.loading = false;
        },
        ErrorData => {
          this.loading = false;
        }
      );
    },
    // 按钮'保存'
    save() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.update();
        } else {
          return false;
        }
      });
    },
    // 更新密码
    update() {
      let params = {
        id: this.id,
        password: this.form.pass,
        masterId: this.masterId
      };
      this.loading = true;
      AdminMgmtInfo.editPass(
        params,
        data => {
          this.loading = false;
          this.$message.success('操作成功');
          this.form.pass = '';
          this.form.checkpass = '';
        },
        ErrorData => {
          this.loading = false;
          console.log('PASS_MODIFY_ERR: ', ErrorData);
        }
      );
    }
  }
};
</script>

<style lang="scss">
.staff-mgmt-admin-mgmt-pass-modify {
  .biz-save-button {
    justify-content: flex-start;
  }
  .el-form {
    height: 100%;
    overflow: auto;
    padding-top: 20px;
    padding-bottom: 20px;
    padding-right: 20px;
  }
}
</style>
