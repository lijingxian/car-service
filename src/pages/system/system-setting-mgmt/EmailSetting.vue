<template>
  <biz-grid class="system-setting-mgmt" v-loading="loading">
    <div class="email-setting">
      <div slot="top" class="header-button">
        <biz-header :operations="operations" @operate="operate">
        </biz-header>
      </div>
      <el-form ref="form" :rules="rules" :model="form" size="small">
        <el-form-item label="发件人邮箱：" prop="smtpFromMail">
          <el-input placeholder="请输入发件人邮箱" v-model="form.smtpFromMail" class="input-nomal-width"></el-input>
        </el-form-item>
        <el-form-item label="SMTP服务器地址：" prop="smtpHost">
          <el-input placeholder="请输入SMTP服务器地址" v-model="form.smtpHost" class="input-nomal-width"></el-input>
        </el-form-item>
        <el-form-item label="SMTP服务器端口：" prop="smtpPort">
          <el-input placeholder="请输入SMTP服务器端口" v-model="form.smtpPort" class="input-nomal-width"></el-input>
        </el-form-item>
        <el-form-item label="SMTP用户名：" prop="smtpUsername">
          <el-input placeholder="请输入SMTP用户名" v-model="form.smtpUsername" class="input-nomal-width"></el-input>
        </el-form-item>
        <el-form-item label="SMTP密码：" prop="smtpPassword">
          <el-input placeholder="请输入SMTP密码" v-model="form.smtpPassword" class="input-nomal-width"></el-input>
        </el-form-item>
        <el-form-item label="邮件测试：">
          <el-button type="primary" @click="openEmailTest" v-if="isEmailTest === false">邮件测试</el-button>
          <el-button type="primary" @click="closeEmailTest" v-if="isEmailTest === true">关闭邮件测试</el-button>
        </el-form-item>
      </el-form>
      <el-form ref="form4EmailTest" :rules="rules4EmailTest" :model="form" size="small" v-if="isEmailTest === true">
        <el-form-item label="收件人邮箱：" prop="toMail">
          <el-input placeholder="请输入收件人邮箱" v-model="form4EmailTest.toMail" class="input-nomal-width" type="email"></el-input>
          <el-button type="primary" @click="sendEmail">发送邮件</el-button>
        </el-form-item>
      </el-form>
    </div>
  </biz-grid>
</template>

<script>
import { BizHeader } from '@/components/BizTable';
import Service from '@/service/system-setting/system-setting-mgmt/systemSettingMgmt';
import { BizGrid } from '@/components/BizGrid';
export default {
  name: 'EmailSetting',
  data() {
    const isEmailValid = (rule, value, callback) => {
      if (this.form4EmailTest.toMail === '') {
        callback(new Error('请输入收件人邮箱'));
      } else {
        let reg = new RegExp(
          '^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$'
        ); // 正则表达式
        // let reg = '/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/';
        if (!reg.test(this.form4EmailTest.toMail)) {
          callback(new Error('请输入有效的邮箱'));
        } else {
          callback();
        }
      }
    };
    return {
      operations: [
        {
          label: '保存',
          name: 'save',
          type: 'primary'
        }
      ],
      loading: false,
      isEmailTest: false,
      form: {
        smtpFromMail: '',
        smtpHost: '',
        smtpPort: '',
        smtpUsername: '',
        smtpPassword: ''
      },
      rules: {
        smtpFromMail: [
          { required: true, message: '请输入发件人邮箱', trigger: 'focus' }
        ],
        smtpHost: [
          { required: true, message: '请输入SMTP服务器地址', trigger: 'focus' }
        ],
        smtpPort: [
          { required: true, message: '请输入SMTP服务器端口', trigger: 'focus' }
        ],
        smtpUsername: [
          { required: true, message: '请输入SMTP用户名', trigger: 'focus' }
        ]
      },
      form4EmailTest: {
        toMail: ''
      },
      rules4EmailTest: {
        toMail: [
          {
            required: true,
            validator: isEmailValid,
            trigger: 'focus'
          }
        ]
      }
    };
  },
  components: {
    BizHeader,
    BizGrid
  },
  props: {},
  watch: {},
  created() {
    this.refresh();
  },
  computed: {},
  methods: {
    operate(name) {
      this[name]();
    },
    save() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.update();
        }
      });
    },
    refresh() {
      let params = {
        name: 'emailSetting'
      };
      Service.query(
        params,
        data => {
          this.form.smtpFromMail =
            data.settingList !== undefined ? data.settingList.smtpFromMail : '';
          this.form.smtpHost =
            data.settingList !== undefined ? data.settingList.smtpHost : '';
          this.form.smtpPort =
            data.settingList !== undefined ? data.settingList.smtpPort : '';
          this.form.smtpUsername =
            data.settingList !== undefined ? data.settingList.smtpUsername : '';
          this.form.smtpPassword =
            data.settingList !== undefined ? data.settingList.smtpPassword : '';
        },
        ErrorData => {
          console.log(ErrorData);
        }
      );
    },
    update() {
      let params = {
        smtpFromMail: this.form.smtpFromMail,
        smtpHost: this.form.smtpHost,
        smtpPort: this.form.smtpPort,
        smtpUsername: this.form.smtpUsername,
        smtpPassword: this.form.smtpPassword
      };
      Service.update(
        params,
        data => {
          this.$message({
            title: '成功',
            message: '更新成功',
            type: 'success'
          });
          this.$emit('refreshNotification');
        },
        ErrorData => {
          this.$message({
            title: '警告',
            message: ErrorData.errorMessage,
            type: 'warning'
          });
        }
      );
    },
    clearFormData() {
      this.form.smtpFromMail = '';
      this.form.smtpHost = '';
      this.form.smtpPort = '';
      this.form.smtpUsername = '';
      this.form.smtpPassword = '';

      this.isEmailTest = false;
      this.form4EmailTest.toMail = '';
    },
    openEmailTest() {
      this.isEmailTest = true;
    },
    closeEmailTest() {
      this.isEmailTest = false;
    },
    sendEmail() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.$refs.form4EmailTest.validate(valid4Test => {
            if (valid4Test) {
              this.emailTest();
            }
          });
        }
      });
    },
    emailTest() {
      let params = {
        smtpFromMail: this.form.smtpFromMail,
        smtpHost: this.form.smtpHost,
        smtpPort: this.form.smtpPort,
        smtpUsername: this.form.smtpUsername,
        toMail: this.form4EmailTest.toMail
      };
      Service.emailTest(
        params,
        data => {
          this.$message({
            title: '成功',
            message: '邮件测试成功',
            type: 'success'
          });
        },
        ErrorData => {
          this.$message({
            title: '警告',
            message: ErrorData.errorMessage,
            type: 'warning'
          });
        }
      );
    }
  }
};
</script>

<style lang="scss">
.email-setting {
  .header-button {
    margin-top: 5px;
    margin-left: 15px;
  }
  .biz-save-button {
    margin-top: 5px;
  }
  .el-input {
    width: 40%;
  }
  .el-form {
    height: 100%;
    overflow: auto;
    padding-top: 20px;
    padding-right: 20px;
    margin-top: 0px;
    margin-left: 0%;
  }
  .el-form-item__label {
    width: 200px;
    text-align: right;
    vertical-align: middle;
    float: left;
    padding: 0 12px 0 0;
  }
  .input-picture-setting {
    width: 100px;
  }
  .input-nomal-width {
    width: 360px;
  }
  .el-checkbox-group .el-checkbox {
    width: 170px;
    margin: 0;
  }
  .el-input--suffix .el-input__inner {
    height: 32px;
    line-height: 32px;
  }
  .el-col {
    width: 200px;
  }
}
</style>
