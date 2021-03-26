<template>
  <div class="login-forget-pwd">
    <div v-if="!showPwd">
      <h3 class="title">忘记密码</h3>
      <el-form ref="form"
              :model="form"
              label-width="0"
              :rules="rules"
              @keyup.enter.native="onSubmit">
        <el-form-item prop="mobile">
          <el-input v-model="form.mobile" placeholder="请输入手机号">
            <i slot="prefix"
              class="iconfont biz-icon-shouji"></i>
          </el-input>
        </el-form-item>
        <el-form-item  prop="captcha" class="validate">
        <el-input v-model="form.captcha" placeholder="请输入验证码" maxlength="4"></el-input>
        <div class="valid"><img :src="form.imgSrc" alt="" @click="getVerificationImg"></div>
      </el-form-item>
        <el-form-item class="validate"
                      prop="validateCode">
          <el-input placeholder="请输入手机验证码"
                    v-model="form.validateCode"></el-input>
          <el-button type="primary" v-show="show" @click="getVerification" size="mini">获取验证码</el-button>
        <el-button type="primary" disabled v-show="!show" size="mini">{{count}}秒后重新获取</el-button>
        </el-form-item>
        <el-form-item class="pwd">
          <el-button type="text" size="small" @click="returnLogin">返回登录</el-button>
        </el-form-item>
        <el-form-item class="submit">
          <el-button type="primary"
                    round
                    @click="next">下一步</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div v-if="showPwd">
      <h3 class="title">设置密码</h3>
      <el-form :rules="rules" ref="form" :model="form" label-width="0" size="small" :inline-message="true">
        <input type="password" name="pwd" v-show="false">
        <el-form-item  prop="pass">
          <el-input type="password" auto-complete="off" placeholder="请输入6-16位密码" v-model="form.pass"></el-input>
        </el-form-item>
        <el-form-item  prop="checkpass">
          <el-input type="password" auto-complete="off" placeholder="再次确认密码" v-model="form.checkpass"></el-input>
        </el-form-item>
        <el-form-item class="pwd">
          <el-button type="text" size="small" @click="returnLogin">返回登录</el-button>
        </el-form-item>
        <el-form-item class="submit">
          <el-button type="primary"
                    round
                    @click="onSubmit">确定</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import uuid from '@/utils/uuid';
import http from '@/common/http';
import axios from 'axios';
import { mapMutations } from 'vuex';
export default {
  name: 'login-forget-pwd',
  data() {
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
    return {
      show: true,
      showPwd: false,
      uid: '',
      count: '',
      timer: '',
      form: {
        captcha: '',
        imgSrc: '',
        mobile: '',
        validateCode: '',
        validCode: '',
        pass: '',
        checkpass: ''
      },
      rules: {
        mobile: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { len: 11, message: '手机号位数错误', trigger: 'blur' },
          { pattern: /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/, message: '手机号格式错误', trigger: 'blur' }
        ],
        validateCode: [
          { required: true, message: '请输入短信验证码', trigger: 'submit' },
          { type: 'string', max: 10, message: '验证码不得超过10位', trigger: 'blur' },
          { pattern: /^[0-9]*$/, message: '请输入数字', trigger: 'blur' }
        ],
        pass: [
          { validator: validatePass, trigger: 'blur' },
          { required: true, min: 6, max: 16, message: '长度在6-16个字符', trigger: 'blur' }
        ],
        checkpass: [
          { required: true, validator: validatePass2, trigger: 'blur' }
        ]
      }
    };
  },
  props: {},
  components: {},
  computed: {},
  watch: {},
  mounted() {
    this.getVerificationImg();
  },
  methods: {
    ...mapMutations(['updateUser']),
    onSubmit() {
      this.$refs.form.validate(isValid => {
        if (isValid) {
          this.login();
        }
      });
    },
    next() {
      if (this.form.validCode === this.form.validateCode) {
        this.showPwd = true;
      } else {
        this.$message.warning('请输入正确的手机验证码');
        return false;
      }
    },
    login() {
      let params = {
        userName: this.form.mobile,
        longinMethod: 'sms',
        captcha: this.form.captcha,
        uid: this.uid
      };
      http
        .post('/login.jhtml', params)
        .then(data => {
          this.getUser();
        })
        .catch(ErrorData => {
          this.$message.warning(ErrorData.errorMessage);
          this.getVerificationImg();
          this.$emit('load', false);
        })
        .finally(() => {});
    },
    getUser() {
      let params = {};
      http
        .get('/admin/common/getCurrent.jhtml', params)
        .then(data => {
          this.update(data.admin.id);
        })
        .catch(ErrorData => {
          this.$message.warning(ErrorData.errorMessage);
          this.getVerificationImg();
          this.$emit('load', false);
        })
        .finally(() => {});
    },
    // 更新密码
    update(id) {
      let params = {
        id: id,
        password: this.form.pass
      };
      this.loading = true;
      http
        .put('/admin/admin/mgmt/admin/password.jhtml', params)
        .then(data => {
          this.$message.success('修改成功');
          this.logOut();
        })
        .catch(ErrorData => {
          this.$message.warning(ErrorData.errorMessage);
          this.getVerificationImg();
          this.$emit('load', false);
        })
        .finally(() => {});
    },
    logOut() {
      window.top.SHOP_ID = '';
      http
        .post('/admin/logout.jhtml', {})
        .then(data => {
          this.$router.push({ path: '/login' });
        })
        .catch(ErrorData => {
          this.$message.warning(ErrorData.errorMessage);
          console.log(ErrorData);
        });
    },
    getVerificationImg() {
      this.uid = uuid.getUuid('xxxxxxxxxxxxxxxx');
      let params = {
        uid: this.uid,
        clientType: '2',
        methodName: 'QueryCaptcha'
      };
      let url = '/rest/member/captcha.jhtml?req=' + encodeURIComponent(JSON.stringify(params));
      http
        .get(url)
        .then(data => {
          this.form.imgSrc = 'data:image/png;base64,' + data.captchaImage;
          // console.log(data);
          this.uid = data.uid;
        })
        .catch(errorCode => {});
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
    // 发送验证码
    getCode() {
      const TIME_COUNT = 60;
      if (!this.timer) {
        this.count = TIME_COUNT;
        this.show = false;
        this.timer = setInterval(() => {
          if (this.count > 0 && this.count <= TIME_COUNT) {
            this.count--;
          } else {
            this.show = true;
            clearInterval(this.timer);
            this.timer = null;
          }
        }, 1000);
      }
    },
    returnLogin() {
      this.$refs.form.resetFields();
      this.$emit('return-login');
    }
  }
};
</script>

<style lang="scss">
.login-forget-pwd {
  margin-top: 15px;
  background-color: #fff;
  width: 300px;
  height: 400px;
  border-radius: 5px;
  padding: 10px 25px;
  .title {
    margin-left: 30px;
    font-size: 24px;
    font-weight: 400;
  }
  .el-form {
    // height: 301px;
    padding-top: 0px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
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
    margin-top: 25px;
    .el-form-item__content {
      display: flex;
      justify-content: flex-end;
      width: 100%;
      &::before, &::after {
        content: none;
      }
    }
  }
  .submit {
    .el-button--primary {
      width: 250px;
    }
  }
  .validate {
    .valid {
      display: flex;
      align-items: center;
    }
  }
}
</style>
