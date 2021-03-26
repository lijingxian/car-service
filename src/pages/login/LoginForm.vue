<template>
  <div>
    <div class="login-form" v-loading="loading" v-if="isLogin">
      <h3 class="title" v-if="isLogin">请先登录</h3>
      <el-form ref="form" :model="form" label-width="0" @keyup.enter.native="onSubmit">
        <el-form-item v-if="showMobile">
          <el-input v-model="form.userName" auto-complete="on" name="username" placeholder="请输入用户名">
            <i slot="prefix" style="font-size:22px;" class="iconfont biz-icon-yonghuming"></i>
          </el-input>
        </el-form-item>
        <el-form-item v-if="showMobile">
          <el-input v-model="form.password" type="password" placeholder="请输入密码">
            <i slot="prefix" style="font-size:22px;" class="iconfont biz-icon-suo-copy"></i>
          </el-input>
        </el-form-item>
        <el-form-item prop="mobile" v-if="!showMobile">
          <el-input placeholder="请输入手机号" v-model="form.mobile">
            <i slot="prefix" class="iconfont biz-icon-shouji"></i>
          </el-input>
        </el-form-item>
        <el-form-item class="validate" prop="captcha">
          <el-input placeholder="请输入验证码" maxlength="4" v-model="form.captcha"></el-input>
          <div class="valid" @click="getVerificationImg">
            <img :src="form.imgSrc" alt="">
          </div>
        </el-form-item>
        <el-form-item prop="code" v-if="!showMobile"  class="validate">
          <el-input v-model="form.code" placeholder="请输入手机验证码" maxlength="6"></el-input>
          <el-button type="primary" v-show="show" @click="checkMobile" size="mini">获取验证码</el-button>
          <el-button type="primary" disabled v-show="!show" size="mini">{{countTime}}秒后重新获取</el-button>
        </el-form-item>
        <el-form-item class="pwd">
          <el-checkbox v-model="form.rememberMe" label="记住用户名和密码" name="type" v-if="showMobile"></el-checkbox>
          <!-- <el-button type="text" size="small" @click="forgetPwd">忘记密码?</el-button> -->
        </el-form-item>
        <el-form-item>
          <el-button type="primary" round @click="onSubmit">登录</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="text" size="mini" style="float:left" @click="forgetPwd">忘记密码?</el-button>
          <el-button type="text" size="mini" style="float:right" @click="swich"><span v-if="!showMobile">用户名密码登录</span><span v-if="showMobile">手机快捷登录</span></el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="register-dialog" v-if="!isLogin">
      <register ref="register" @load="load"></register>
    </div>
    <el-dialog title="" :visible.sync="dialogAdminVisible" width="30%" append-to-body>
      <span>您的手机号未注册店铺，请先注册</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogAdminVisible = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="confirm" size="mini">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import uuid from '@/utils/uuid';
import http from '@/common/http';
import Register from './Register';
import axios from 'axios';
export default {
  name: 'login-form',
  data() {
    return {
      count: Math.random(),
      countTime: '',
      uid: '',
      loading: false,
      dialogAdminVisible: false,
      visible: false,
      showMobile: true,
      show: true,
      loginUrl: '/login.jhtml',
      form: {
        captcha: '',
        mobile: '',
        imgSrc: '',
        userName: '',
        password: '',
        captchaId: '',
        code: '',
        validCode: '',
        rememberMe: false
      },
      rules: {
        userName: [{ required: true, message: '请输入用户名', trigger: 'submit' }],
        password: [{ required: true, message: '请输入密码', trigger: 'submit' }],
        captcha: [{ required: true, message: '请输入验证码', trigger: 'submit' }]
      }
    };
  },
  props: {
    isLogin: {
      type: Boolean,
      default: true
    }
  },
  components: {
    Register
  },
  computed: {},
  watch: {},
  mounted() {
    this.getCookie();
    this.getVerificationImg();
  },
  methods: {
    forgetPwd() {
      // 忘记密码则清空cookie
      this.clearCookie();
      this.$emit('forget-pwd');
    },
    swich() {
      this.getVerificationImg();
      this.showMobile = !this.showMobile;
    },
    Register() {
      this.visible = true;
    },
    onSubmit() {
      this.$refs.form.validate(isValid => {
        if (isValid) {
          this.login();
          window.top.SHOP_ID = '';
        }
      });
    },
    confirm() {
      this.dialogAdminVisible = false;
      this.isLogin = false;
      this.$nextTick(() => {
        this.$refs.register.form.mobile = this.form.mobile;
        this.$refs.register.form.userName = 'sj' + this.form.mobile;
        this.$refs.register.form.storeName = '店铺' + this.form.mobile;
      });
    },
    checkMobile() {
      http
        .post('/rest/mobile/checkMobile.jhtml', { mobile: this.form.mobile })
        .then(data => {
          if (data.userId !== '') {
            if (data.type === 'isAdmin') {
              this.dialogAdminVisible = false;
              this.getVerification();
            } else {
              this.dialogAdminVisible = true;
            }
          } else {
            this.dialogAdminVisible = true;
          }
        })
        .catch(errData => {
          this.loading = false;
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        });
    },
    getVerification() {
      let params = {
        uid: this.uid,
        captcha: this.form.captcha,
        clientType: '2',
        methodName: 'SendValidateCode',
        phoneNumber: this.form.mobile,
        type: '4'
      };
      let url = '/rest/member/sendValidateCode.jhtml';
      axios
        .post(url, params)
        .then(response => {
          if (response.data.resultCode === '100') {
            this.form.validCode = response.data.validateCode;
            this.show = true;
            this.getCode();
          } else {
            this.$message({
              message: response.data.errorMessage,
              type: 'warning'
            });
            this.getVerificationImg();
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    getCode() {
      const TIME_COUNT = 60;
      if (!this.timer) {
        this.countTime = TIME_COUNT;
        this.show = false;
        this.timer = setInterval(() => {
          if (this.countTime > 0 && this.count <= TIME_COUNT) {
            this.countTime--;
          } else {
            this.show = true;
            clearInterval(this.timer);
            this.timer = null;
          }
        }, 1000);
      }
    },
    login() {
      if (!this.showMobile && this.form.code !== this.form.validCode) {
        this.$message.warning('请输入正确的验证码');
        return false;
      }
      this.$emit('load', true);
      let params = {
        userName: !this.showMobile ? this.form.mobile : this.form.userName,
        password: !this.showMobile ? '' : btoa(this.form.password),
        longinMethod: !this.showMobile ? 'sms' : 'password',
        captcha: this.form.captcha,
        uid: this.uid,
        validCode: this.form.code
      };
      http
        .post(this.loginUrl, params)
        .then(data => {
          if (this.form.rememberMe && this.form.userName && this.form.password) {
            this.saveCookie();
          } else if (!this.form.rememberMe) {
            this.clearCookie();
          }
          this.$router.push('/');
          console.log('success!');
          this.$emit('load', false);
        })
        .catch(ErrorData => {
          this.$message.warning(ErrorData.errorMessage);
          this.getVerificationImg();
          this.$emit('load', false);
        })
        .finally(() => {});
    },
    load() {
      this.$emit('load', false);
    },
    clearCookie() {
      document.cookie = 'name=;expires=-1';
      document.cookie = 'password=;expires=-1';
    },
    saveCookie() {
      // 保存一个月
      let expireDate = new Date();
      expireDate.setDate(expireDate.getDate() + 30);
      document.cookie = `userName=${this.form.userName};expires=${expireDate.toUTCString()}`;
      document.cookie = `password=${this.form.password};expires=${expireDate.toUTCString()}`;
    },
    getCookie() {
      if (document.cookie) {
        let getUserNameReg = new RegExp(/userName=(.[^;]+)/);
        let getPwdReg = new RegExp(/password=(.[^;]+)/);
        if (document.cookie.match(getUserNameReg) && document.cookie.match(getPwdReg)) {
          this.form.userName = document.cookie.match(getUserNameReg)[1];
          this.form.password = document.cookie.match(getPwdReg)[1];
          this.form.rememberMe = true;
        }
      }
    },
    getVerificationImg() {
      this.uid = uuid.getUuid('xxxxxxxxxxxxxxxx');
      this.count++;
      let params = {
        count: this.count,
        uid: this.uid || '',
        clientType: '2',
        methodName: 'QueryCaptcha'
      };
      let url = '/rest/member/captcha.jhtml?req=' + encodeURIComponent(JSON.stringify(params));
      http
        .get(url)
        .then(data => {
          this.form.imgSrc = 'data:image/png;base64,' + data.captchaImage;
          this.uid = data.uid;
        })
        .catch(errorCode => {});
    },
    showMessage(msg, type) {
      this.$message({
        message: msg,
        type: type || 'info'
      });
    }
  }
};
</script>

<style lang="scss">
.register-dialog {
  margin-top: -35px;
  background-color: #fff;
  width: 480px;
  height: 500px;
  border-radius: 5px;
}
.login-form {
  margin-top: 15px;
  background-color: #fff;
  width: 300px;
  height: 420px;
  border-radius: 5px;
  padding: 10px 25px;
  .title {
    margin-left: 30px;
    font-size: 24px;
    font-weight: 400;
  }
  .el-form-item {
    margin-bottom: 18px;
  }
  i {
    font-size: 24px;
    color: #898989;
  }
  .validate {
    .el-form-item__content {
      display: flex;
      .el-button {
        margin-left: 5px;
      }
      .valid {
        margin-top: 3px;
        height: 33px;
        width: 122px;
        margin-left: 5px;
        cursor: pointer;
      }
    }
  }
  .pwd {
    .el-form-item__content {
      display: flex;
      justify-content: space-between;
      width: 100%;
      &::before,
      &::after {
        content: none;
      }
    }
  }
  .el-button--primary {
    width: 250px;
  }
  .validate {
    .valid {
      display: flex;
      align-items: center;
    }
  }
  .el-input__inner {
    width: 150px;
  }
}
</style>
