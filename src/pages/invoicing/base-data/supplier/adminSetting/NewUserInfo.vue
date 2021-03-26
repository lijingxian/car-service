<template>
  <biz-grid class="new-user-info">
    <biz-save-button slot="top" :operations="operations" @operate="operate" v-if="isEdit"></biz-save-button>
    <el-form :rules="rules" ref="form" :model="form" label-width="120px" size="small" v-loading="loading" :disabled="!isEdit" :inline-message="true">
      <el-form-item label="手机号" prop="mobile" :error="errorMobile">
        <el-input placeholder="请输入手机号" v-model="form.mobile"></el-input>
      </el-form-item>
      <el-form-item label="用户名" prop="userName" :error="errUserName">
        <el-input placeholder="请输入用户名" v-model="form.userName"></el-input>
      </el-form-item>
      <el-form-item label="姓名" prop="name" :error="errName">
        <el-input placeholder="请输入姓名" v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="性别" prop="gender">
        <el-radio-group v-model="form.gender">
          <el-radio label="0">男</el-radio>
          <el-radio label="1">女</el-radio>
          <el-radio label="2">保密</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="itemId.id ===''" label="密码" prop="pass">
        <input type="password" name="pwd" v-show="false">
        <el-input type="password" auto-complete="off" placeholder="请输入6-16位密码" v-model="form.pass"></el-input>
      </el-form-item>
      <el-form-item v-if="itemId.id ===''" label="确认密码" prop="checkpass">
        <el-input type="password" auto-complete="off" placeholder="再次确认密码" v-model="form.checkpass"></el-input>
      </el-form-item>
      <el-form-item label="头像" prop="head">
        <biz-avatar-uploader-new v-model="form.head"></biz-avatar-uploader-new>
      </el-form-item>
      <el-form-item label="状态" prop="isEnabled">
        <el-switch v-model="form.isEnabled" active-value="1" inactive-value="0" active-color="#ff7300" inactive-color="#d9d9d9"></el-switch>
      </el-form-item>
    </el-form>
    <el-dialog title :visible.sync="dialogVisible" width="30%" append-to-body>
      <span>{{form.mobile}}手机号已注册，确定添加此手机号为管理员请点击获取验证码，验证成功后自动添加</span>
      <div class="valid-div">
        <el-input v-model="validImg" placeholder="请输入验证码" size="mini" maxlength="4"></el-input>
        <img :src="imgSrc" alt @click="getVerificationImg">
      </div>
      <div class="code-div">
        <el-input v-model="code" placeholder="请输入手机验证码" size="mini" maxlength="6"></el-input>
        <el-button type="primary" v-show="show" @click="getVerification" size="mini">获取验证码</el-button>
        <el-button type="primary" disabled v-show="!show" size="mini">{{count}}秒后重新获取</el-button>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="confirm" size="mini">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title :visible.sync="dialogAdminVisible" width="30%" append-to-body>
      <span>该用户是其他店铺管理员，确认成为本店铺管理员</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogAdminVisible = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="create" size="mini">确 定</el-button>
      </span>
    </el-dialog>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import BizSaveButton from '@/components/BizSaveButton';
import { BizAvatarUploaderNew } from '@/components/BizForm';
import AdminMgmtInfo from '@/service/staff-mgmt/adminMgmtInfo';
import http from '@/common/http';
import { mapGetters } from 'vuex';
import uuid from '@/utils/uuid';
import axios from 'axios';

// 获取默认表单项
const getDefaultModel = () => {
  return {
    id: '',
    userName: '',
    name: '',
    gender: '2',
    mobile: '',
    pass: '',
    checkpass: '',
    companyId: '',
    head: '/resources/admin/images/Avatar.png',
    shopId: '',
    isEnabled: '1',
    isMemberConvert: '',
    isManageThisStore: '',
    supplier: []
  };
};
export default {
  name: 'BaseInfo',
  props: {
    itemId: {
      type: Object,
      default() {
        return { id: '' };
      }
    },
    masterId: {
      type: String,
      default() {
        return '';
      }
    },
    isEdit: {
      type: Boolean,
      default() {
        return true;
      }
    }
  },
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
    // 密码校验End
    return {
      defaultAvatar: '/resources/admin/images/Avatar.png',
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
        mobile: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { len: 11, message: '手机号位数错误', trigger: 'blur' },
          {
            pattern: /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/,
            message: '手机号格式错误',
            trigger: 'blur'
          }
        ],
        gender: [{ required: true, message: '请选择性别' }],
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
        checkpass: [{ required: true, validator: validatePass2, trigger: 'blur' }],
        head: [{ required: true, message: '请选择头像' }]
      },
      // 用户信息
      form: getDefaultModel(),
      operations: [
        {
          label: '保存',
          name: 'save',
          type: 'primary'
        }
      ],
      loading: false,
      dialogVisible: false,
      dialogAdminVisible: false,
      show: true,
      role: {
        id: '',
        name: '',
        type: ''
      },
      count: '',
      code: '',
      imgSrc: '',
      validImg: '',
      validCode: '',
      timer: null,
      userId: '',
      // 红字错误提示
      errorMobile: '',
      errUserName: '',
      errName: ''
    };
  },
  components: {
    BizGrid,
    BizSaveButton,
    BizAvatarUploaderNew
  },
  methods: {
    ...mapGetters(['getUser']),
    operate(name) {
      this[name]();
    },
    resetModel() {
      this.form = this.getDefaultModel();
    },
    getDefaultModel() {
      return getDefaultModel();
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
          this.imgSrc = 'data:image/png;base64,' + data.captchaImage;
          this.uid = data.uid;
          // console.log(data);
        })
        .catch(errorCode => {});
    },
    getVerification() {
      let params = {
        uid: this.uid,
        captcha: this.validImg,
        clientType: '2',
        methodName: 'SendValidateCode',
        phoneNumber: this.form.mobile,
        type: '7'
      };
      let url = '/rest/member/sendValidateCode.jhtml';
      axios
        .post(url, params)
        .then(response => {
          if (response.data.resultCode === '100') {
            this.validCode = response.data.validateCode;
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
    // 获取角色列表
    getRole() {
      http
        .get('/admin/role/getRoleByType.jhtml', {
          roleType: 'supplier'
        })
        .then(data => {
          this.role = data.data;
          console.log(this.role);
        })
        .catch(errData => {
          console.log(errData);
          console.log('code错误');
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        });
    },
    // 按钮'保存'
    save() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.getRole();
          this.checkMobile(this.form.mobile);
        } else {
          return false;
        }
      });
    },
    checkMobile(mobile) {
      http
        .post('/admin/admin/checkMobile.jhtml', { mobile: mobile })
        .then(data => {
          if (data.userId !== '') {
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
            this.dialogVisible = true;
          } else {
            this.userId = '';
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
      if (this.validImg === '') {
        this.$message.warning('请输入验证码');
        return false;
      }
      if (this.code === '') {
        this.$message.warning('请输入手机验证码');
        return false;
      }
      if (this.code !== this.validCode) {
        this.$message.warning('请输入正确的验证码');
        return false;
      }
      this.submit();
    },
    submit() {
      this.validCode = '';
      this.code = '';
      this.dialogVisible = false;
      this.create();
    },
    // 新建管理员
    create() {
      let params = {
        id: this.userId,
        head: this.form.head,
        userName: this.form.userName,
        password: this.form.pass,
        mobile: this.form.mobile,
        gender: this.form.gender,
        name: this.form.name,
        nickname: this.form.mobile,
        isEnabled: this.form.isEnabled,
        roleIds: [this.role.id],
        shop: { id: this.getUser().shop.id, name: this.getUser().shop.name },
        compy: { id: this.getUser().compy.id, name: this.getUser().compy.name },
        isMemberConvert: this.form.isMemberConvert,
        isManageThisStore: this.form.isManageThisStore,
        supplier: { id: this.$route.query.cooperationId }
      };
      this.loading = true;
      this.dialogAdminVisible = false;
      AdminMgmtInfo.create(
        params,
        data => {
          this.loading = false;
          this.$emit('operationSuccess', data.AdminData.id, data.AdminData.masterId);
          this.$message.success('管理员创建成功');
        },
        ErrorData => {
          this.loading = false;
          if (ErrorData.resultCode === '1070') {
            this.form.gender = ErrorData.AdminData.gender;
            this.form.head = ErrorData.AdminData.head;
            this.form.id = ErrorData.AdminData.id;
            this.form.isEnabled = ErrorData.AdminData.isEnabled;
            this.form.loginAddress = ErrorData.AdminData.loginAddress;
            this.form.loginDate = ErrorData.AdminData.loginDate;
            this.form.mobile = ErrorData.AdminData.mobile;
            this.form.name = ErrorData.AdminData.name;
            this.form.nickname = ErrorData.AdminData.nickname;
            this.form.userName = ErrorData.AdminData.userName;
            this.form.isManageThisStore = '1';
            this.dialogAdminVisible = true;
          } else {
            this.$message.warning({ message: ErrorData.errorMessage });
            console.log('ERR_CREATE:', ErrorData);
          }
        }
      );
    },
    // 刷新
    refresh() {
      let params = {
        id: this.itemId.id,
        masterId: this.masterId
      };
      this.loading = true;
      AdminMgmtInfo.get(
        params,
        data => {
          this.loading = false;
          this.form.userName = data.admin.userName;
          this.form.name = data.admin.name;
          this.form.mobile = data.admin.mobile;
          this.form.nickname = data.admin.nickname;
          this.form.gender = data.admin.gender;
          this.form.head = data.admin.head || this.defaultAvatar;
          this.form.pass = '';
          this.form.checkpass = '';
          this.form.isEnabled = data.admin.isEnabled;
          this.form.companyId = data.admin.compy ? data.admin.compy.id : '';
          this.isCreate = false;
          this.form.shopId = this.shop = data.admin.shop ? data.admin.shop.id : ''; // 设置店铺初始值
          this.role = {};
          this.form.supplier = data.admin.supplier;
          this.form.agent = data.admin.agent;
          data.admin.roleDatas.map(item => {
            if (item.type === '23') {
              // 管理员所属角色
              this.role.id = item.id;
              this.role.name = item.name;
            }
          });
        },
        ErrorData => {
          this.loading = false;
          console.log('ERR_GET_INFO : ', ErrorData);
        }
      );
    }
  },
  watch: {
    itemId(nVal, oVal) {
      if (nVal.id) {
        this.refresh();
      } else {
        this.resetModel();
      }
    }
  },
  created() {},
  computed: {},
  mounted() {
    this.getRole();
    this.getVerificationImg();
  }
};
</script>

<style lang="scss">
.valid-div {
  display: flex;
  justify-content: flex-start;
  margin-top: 20px;
  .el-input--mini {
    margin-right: 5px;
  }
}
.code-div {
  display: flex;
  justify-content: flex-start;
  margin-top: 20px;
  .el-input--mini {
    margin-right: 5px;
  }
}
.new-user-info {
  .biz-save-button {
    justify-content: flex-start;
  }
  img {
    width: 80px !important;
    height: 80px !important;
  }
  .el-form-item.isRequired .el-form-item__label:before {
    content: '*';
    color: #f56c6c;
    margin-right: 4px;
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
  .el-select.el-select--small {
    width: 100%;
  }
  .el-form-item__content > :first-child {
    margin-top: 0;
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
