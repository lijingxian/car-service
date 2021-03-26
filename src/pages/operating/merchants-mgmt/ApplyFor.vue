<template>
  <div class="apply-for">
    <img class="head" src="~@/assets/images/apply-for.png">
    <img class="title" src="~@/assets/images/pic.png" alt="">
    <el-form :rules="rules" ref="form" :model="form" label-width="120px" size="small" :inline-message="true" v-loading="loading">
      <!-- <el-form-item label="姓名" prop="name">
        <el-input placeholder="请输入您的姓名" v-model="form.name"></el-input>
      </el-form-item> -->
      <el-form-item label="手机" prop="mobile" :error="errorMobile">
        <el-input placeholder="请输入手机号" v-model="form.mobile" @change="mobileChange"></el-input>
      </el-form-item>
      <el-form-item label="验证码" prop="captcha" class="validate">
        <el-input v-model="form.captcha" placeholder="请输入验证码" size="mini" maxlength="4"></el-input>
        <div class="valid"><img :src="form.imgSrc" alt="" @click="getVerificationImg"></div>
      </el-form-item>
      <el-form-item label="手机验证码" prop="code" :error="errorMobile">
        <el-input v-model="form.code" placeholder="请输入手机验证码" size="mini" maxlength="6"></el-input>
        <el-button type="primary" v-show="show" @click="getVerification" size="mini" style="margin-left:5px">获取验证码</el-button>
        <el-button type="primary" disabled v-show="!show" size="mini" style="margin-left:5px">{{count}}秒后重新获取</el-button>
      </el-form-item>
      <el-form-item label="用户名" prop="userName" :error="errUserName">
        <el-input placeholder="请输入用户名" v-model="form.userName"></el-input>
      </el-form-item>
      <el-form-item label="店铺名称" prop="storeName">
        <el-input placeholder="请输入店铺名称" v-model="form.storeName"></el-input>
      </el-form-item>
      <el-form-item label="所在区域">
         <el-cascader :options="options" :change-on-select="true" v-model="areas" @change="areaChange" style="width:100%"></el-cascader>
      </el-form-item>
      <el-form-item label="服务" prop="domains">
        <el-checkbox-group v-model="form.domains">
          <el-checkbox v-for="item in domainList" :key="item.id" :label="item.id">{{ item.name }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <!-- <el-form-item label="电子邮箱" prop="email">
        <el-input placeholder="请输入您的电子邮箱" v-model="form.email"></el-input>
      </el-form-item>
      <el-form-item label="QQ号">
        <el-input placeholder="请输入您的QQ号" v-model="form.qq"></el-input>
      </el-form-item>
      <el-form-item label="微信号">
        <el-input placeholder="请输入您的微信号" v-model="form.wchat"></el-input>
      </el-form-item>
      <el-form-item label="所在区域" prop="areaId">
        <biz-area-select :areaId="form.areaId" @areaChanged="areaChanged">
        </biz-area-select>
      </el-form-item>
      <el-form-item label="合作意向">
        <el-input type="textarea" placeholder="此处填入合作意向" v-model="form.cooperationIntention"></el-input>
      </el-form-item> -->
      <el-form-item>
        <el-button class="submit" type="primary" @click="save">立即申请</el-button>
      </el-form-item>
      <el-dialog title="" :visible.sync="dialogVisible" width="30%" append-to-body>
        <span>{{form.mobile}}手机号已注册，确定添加此手机号为管理员请点击获取验证码，验证成功后自动添加</span>
        <!-- <div class="valid-div">
          <el-input v-model="validImg" placeholder="请输入验证码" size="mini" maxlength="4"></el-input>
          <img :src="imgSrc" alt="" @click="getVerificationImg">
        </div>
        <div class="code-div">
          <el-input v-model="code" placeholder="请输入手机验证码" size="mini" maxlength="6"></el-input>
          <el-button type="primary" v-show="show" @click="getVerification" size="mini">获取验证码</el-button>
          <el-button type="primary" disabled v-show="!show" size="mini">{{count}}秒后重新获取</el-button>
        </div> -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false" size="mini">取 消</el-button>
          <el-button type="primary" @click="confirm" size="mini">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog title="" :visible.sync="dialogAdminVisible" width="30%" append-to-body>
        <span>该用户是其他店铺管理员，确认成为本店铺管理员</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogAdminVisible = false" size="mini">取 消</el-button>
          <el-button type="primary" @click="create" size="mini">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog title="" :visible.sync="dialogSuccess" width="30%" append-to-body>
        <span>免费试用申请提交成功，使用手机号登录即可免费试用。</span>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="toLink" size="mini">确 定</el-button>
        </span>
      </el-dialog>
    </el-form>
  </div>
</template>

<script>
import uuid from '@/utils/uuid';
import http from '@/common/http';
import axios from 'axios';
import urls from '@/common/urls';

export default {
  name: 'ApplyFor',
  components: {},
  data() {
    // 密码校验Start
    let validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else {
        if (this.form.confirmPassword !== '') {
          this.$refs.form.validateField('confirmPassword');
        }
        callback();
      }
    };
    let validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.form.password) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    let validateDomains = (rule, value, callback) => {
      if (value.length === 0) {
        callback(new Error('请选择一个领域'));
      } else {
        callback();
      }
    };
    // 密码校验End
    return {
      defaultAvatar: '/resources/admin/images/Avatar.png',
      id: '',
      masterId: '',
      rules: {
        userName: [
          { required: true, message: '用户名不能为空', trigger: 'blur' },
          {
            pattern: /^[0-9a-zA-Z]+$/,
            message: '用户名只能为数字或字母',
            trigger: 'blur'
          },
          { min: 4, max: 20, message: '长度在4-20位', trigger: 'blur' }
        ],
        name: [
          {
            required: true,
            message: '姓名不能为空',
            trigger: 'blur'
          },
          { max: 20, message: '长度不能大于20位', trigger: 'blur' }
        ],
        gender: [{ required: true, message: '请选择性别' }],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { len: 11, message: '手机号位数错误', trigger: 'blur' },
          {
            pattern: /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/,
            message: '手机号格式错误',
            trigger: 'blur'
          }
        ],
        pass: [
          { validator: validatePass, trigger: 'blur' },
          {
            required: true,
            min: 6,
            max: 16,
            message: '长度在6-16个字符',
            trigger: 'blur'
          }
        ],
        confirmPassword: [{ required: true, validator: validatePass2, trigger: 'blur' }],
        captcha: [{ required: true, message: '请输入验证码', trigger: 'blur' }],
        code: [{ required: true, message: '请输入手机验证码', trigger: 'blur' }],
        storeName: [{ required: true, message: '请输入店铺名称', trigger: 'blur' }],
        domains: [{ validator: validateDomains, trigger: 'blur' }, { required: true, message: '请选择一个领域', trigger: 'blur' }]
      },
      // 登录用户是否为管理员(0:不是,1:是)
      isOperatorAdminFlg: '',
      domainList: [],
      options: [],
      cityList: [],
      areas: ['1508', '1567'],
      // 用户信息
      form: {
        userName: '',
        domainList: [],
        name: '',
        id: '',
        // 性别(0: 男, 1: 女, 2: 未知)
        gender: '',
        mobile: '',
        password: '',
        confirmPassword: '',
        province: '',
        city: '',
        code: '',
        captcha: '',
        imgSrc: '',
        validCode: '',
        storeName: '',
        head: '/resources/admin/images/Avatar.png',
        domains: [],
        companyId: '',
        shopId: '',
        isEnabled: '1',
        isMemberConvert: '',
        isManageThisStore: '',
        areaId: ''
      },
      operations: [
        {
          label: '保存',
          name: 'save',
          type: 'primary'
        }
      ],
      count: '',
      code: '',
      imgSrc: '',
      captcha: '',
      validCode: '',
      domians: [],
      timer: null,
      loading: false,
      dialogVisible: false,
      dialogAdminVisible: false,
      dialogSuccess: false,
      isCreate: true,
      show: true,
      userId: '',
      // 红字错误提示
      errorMobile: '',
      errorRole: '',
      errUserName: '',
      errName: '',
      currentCompany: {}
    };
  },
  mounted() {
    this.getVerificationImg();
    this.getDomains();
    this.getProvince();
  },
  methods: {
    operate(name) {
      this[name]();
    },
    mobileChange() {
      if (!this.form.userName) {
        this.form.userName = 'sj' + this.form.mobile;
      }
      if (!this.form.storeName) {
        this.form.storeName = '店铺' + this.form.mobile;
      }
    },
    handleAreaChanged(areaId, cityId, provinceId) {
      console.log(222);
      this.form.areaId = areaId;
      this.form.province = provinceId;
      this.form.city = cityId;
    },
    getDomains() {
      http.get('/rest/businessServiceDomain/domainList.jhtml', {})
        .then(data => {
          this.domainList = data.content;
          this.form.domains = [data.content[0].id];
          data.content.forEach(element => {
            if (element.name === '门店运营') {
              this.form.domains = [element.id];
            }
          });
        })
        .catch();
    },
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
        type: '9'
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
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    // 显示消息提示
    showNotify(msg, type) {
      this.$notify({
        showClose: true,
        message: msg,
        type: type
      });
    },
    getProvince() {
      http
        .get(urls.merchantsMgmt.areaList)
        .then(data => {
          this.options = data.areaDatas;
          for (const item of data.areaDatas) {
            item.label = item.name;
            item.value = item.id;
            if (item.children) {
              for (const child of item.children) {
                child.label = child.name;
                child.value = child.id;
              }
            }
          }
          this.areaChange(['1508']);
        })
        .catch(errData => {
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(() => {});
    },
    areaChange(val) {
      console.log(111);
      http
        .get(urls.merchantsMgmt.areaList, { parentId: val.length === 2 ? val[1] : val[0] })
        .then(data => {
          console.log(this.options);
          if (data.areaDatas.length) {
            // this.options = data.areaDatas;
            for (const item of data.areaDatas) {
              item.label = item.name;
              item.value = item.id;
            }
          }
          for (const iterator of this.options) {
            if (val[0] === iterator.value) {
              if (val.length === 1) {
                this.$set(iterator, 'children', data.areaDatas.map(item => {
                  return {
                    label: item.name,
                    value: item.id
                  };
                }));
              }
              for (const child of iterator.children) {
                if (child.value === val[1]) {
                  if (val.length === 2) {
                    this.$set(child, 'children', data.areaDatas.map(item => {
                      return {
                        label: item.name,
                        value: item.id
                      };
                    }));
                  }
                }
              }
            }
          }
          // this.areas = ['1508', '1567'];
          console.log(this.options);
        })
        .catch(errData => {
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(() => {});
    },
    getAreas() {
      http
        .get('/rest/area/cityList.jhtml', {})
        .then(data => {
          this.options = data.areas;
          for (const item of data.areas) {
            item.label = item.name;
            item.value = item.id;
            if (item.children) {
              for (const child of item.children) {
                child.label = child.name;
                child.value = child.id;
              }
            }
          }
        })
        .catch(errData => {
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(() => {});
    },
    // 按钮'保存'
    save() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.checkMobile(this.form.mobile);
        } else {
          return false;
        }
      });
    },
    checkMobile(mobile) {
      http
        .post('/rest/mobile/checkMobile.jhtml', { mobile: this.form.mobile })
        .then(data => {
          if (data.userId !== '') {
            if (data.type === 'isAdmin') {
              this.dialogVisible = false;
              this.dialogAdminVisible = true;
            } else {
              this.dialogAdminVisible = false;
              this.dialogVisible = true;
            }
            this.userId = data.userId;
            this.form.id = data.userId;
            this.form.userName = data.memberData.userName;
            this.form.nickname = data.memberData.nickname;
            this.form.name = data.memberData.name || this.form.name;
            this.form.gender = data.memberData.gender;
            this.form.mobile = data.memberData.mobile;
            this.form.head = data.memberData.head;
            this.form.isEnabled = data.memberData.enableState;
            this.form.isMemberConvert = '1';
          } else {
            this.form.isMemberConvert = '';
            this.form.isManageThisStore = '';
            this.submit();
          }
        })
        .catch(errData => {
          this.loading = false;
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    confirm() {
      if (this.form.captcha === '') {
        this.$message.warning('请输入验证码');
        return false;
      }
      if (this.form.code === '') {
        this.$message.warning('请输入手机验证码');
        return false;
      }
      if (this.form.code !== this.form.validCode) {
        this.$message.warning('请输入正确的验证码');
        return false;
      }
      this.submit();
    },
    submit() {
      this.create();
    },
    // 新建管理员
    create() {
      if (this.areas && this.areas.length > 0) {
        this.form.areaId = this.areas[0];
      } else {
        this.form.areaId = '';
      }
      this.loading = true;
      this.dialogAdminVisible = false;
      Object.assign(this.form, { uid: this.uid, activityId: this.$route.query.activityId });
      http
        .post('/rest/ddd/store/registerStore.jhtml', this.form)
        .then(data => {
          this.loading = false;
          this.$message.success('注册成功');
          this.$router.push('/?isFree=true');
          console.log('success!');
          this.$emit('load', false);
        })
        .catch(ErrorData => {
          this.$message.warning({ message: ErrorData.errorMessage });
          console.log('ERR_CREATE:', ErrorData);
        })
        .finally(data => {
          this.loading = false;
        });
    }
  }
};
</script>

<style lang="scss">
.apply-for {
  display: flex;
  align-items: center;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  .head {
    width: 100%;
  }
  .title {
    padding: 40px 0px;
    margin: 0 auto;
  }
  .el-form {
    margin-top: 40px;
    margin: 0 auto;
    width: 550px;
    .imgSrc{
      float: right;
      height: 20px;
      margin-right: 100px;
      margin-top: 2px;
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
    .submit {
      margin-left: 140px;
      margin-bottom: 100px;
      width: 90px;
    }
  }
}
</style>
