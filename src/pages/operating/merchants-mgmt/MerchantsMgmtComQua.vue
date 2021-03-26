<template>
  <biz-grid class="merchants-mgmt-com-qua">
    <biz-save-button slot="top" :operations="operations" @operate="operate">
    </biz-save-button>
    <el-form ref="form" :rules="rules" :model="form" label-width="120px" size="small" :disabled="form.state==='1'||this.state==='3'" :inline-message="true">
      <el-form-item label="企业名称" prop="name">
        <el-input placeholder="请输入企业名称" v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="统一社会信用代码" prop="bussinessLicenseCode">
        <el-input placeholder="请输入18位社会信用代码" v-model="form.bussinessLicenseCode"></el-input>
      </el-form-item>
      <el-form-item label="营业执照所在地" prop="address">
        <el-input type="textarea" v-model="form.address" :rows="2" placeholder="请输入详细地址"></el-input>
      </el-form-item>
      <el-form-item label="营业期限">
        <el-date-picker type="date" :clearable="clearable" placeholder="请选择营业期限" value-format="yyyy-MM-dd" v-model="form.bussinessLicenseDue"
          style="width: 100%;"></el-date-picker>
      </el-form-item>
      <el-form-item label="注册资本" prop="registeredCapital">
        <el-input-number placeholder="请输入注册资本" :min="0" v-model="form.registeredCapital"></el-input-number>
      </el-form-item>
      <el-form-item label="营业执照副本扫描件(加盖公章)" :required="true" :error="form.bussinessLicenseImg===''?'请上传所需照片':''">
        <BizAvatarUploaderNew v-model="form.bussinessLicenseImg">
        </BizAvatarUploaderNew>
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="form.state" disabled>
          <el-option label="未审核" value="0"></el-option>
          <el-option label="通过" value="1"></el-option>
          <el-option label="未通过" value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="备注">
        <el-input type="textarea" placeholder="请输入备注信息" v-model="form.remark"></el-input>
      </el-form-item>
    </el-form>
    <el-dialog slot="float" title="审核未通过邮件" append-to-body :visible.sync="auditFailedDialog" custom-class="qualificationDialog">
      <el-form label-width="90px" size="small">
        <el-form-item label="收件人地址">
          <el-input v-model="email"></el-input>
        </el-form-item>
        <el-form-item label="邮件标题">
          <el-input v-model="auditFailedEmali.subject"></el-input>
        </el-form-item>
        <el-form-item label="邮件内容">
          <biz-editor ref="editor" width="100%" height="400px" :hasImage="false" v-model="auditFailedEmali.content"></biz-editor>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="auditFailedDialog = false">取消</el-button>
        <el-button size="small" type="primary" @click="sendAuditFailedEmail">发送</el-button>
      </div>
    </el-dialog>
    <el-dialog title="认证通过邮件" append-to-body :visible.sync="certificationPassedDialog" custom-class="qualificationDialog">
      <el-form :model="certificationPassedForm" label-width="90px" size="small">
        <el-form-item label="已发送邮件次数" v-if="passMailCount&&passMailCount!=='0'">
          {{passMailCount}}次
        </el-form-item>
        <el-form-item label="收件人地址">
          <el-input v-model="email"></el-input>
        </el-form-item>
        <el-form-item label="邮件标题">
          <el-input v-model="certificationPassedForm.subject"></el-input>
        </el-form-item>
        <el-form-item label="邮件内容">
          <biz-editor ref="editor" width="100%" height="400px" :hasImage="false" v-model="certificationPassedForm.content"></biz-editor>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="certificationPassedDialog = false">取 消</el-button>
        <el-button size="small" type="primary" @click="sendCertificationPassedEmail">发送</el-button>
      </div>
    </el-dialog>
    <el-dialog title="提示" :visible.sync="dialogVisiblePass" width="30%" append-to-body>
      <span>{{form.mobile}}手机号已注册，确定添加此手机号为管理员请点击获取验证码，验证成功后自动添加</span>
      <div class="valid-div">
        <el-input v-model="validImg" placeholder="请输入验证码" size="mini"></el-input>
        <img :src="imgSrc" alt="" @click="getVerificationImg">
      </div>
      <div class="code-div">
        <el-input v-model="code" placeholder="请输入手机验证码" size="mini"></el-input>
        <el-button type="primary" v-show="show" @click="getVerification" size="mini">获取验证码</el-button>
        <el-button type="primary" disabled v-show="!show" size="mini">{{count}}秒后重新获取</el-button>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisiblePass = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="confirm" size="mini">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="提示" :visible.sync="dialogAdminVisible" width="30%" @close="close" append-to-body>
      <span>该用户是其他店铺管理员，确认成为本店铺管理员</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogAdminVisible = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="complete" size="mini">确 定</el-button>
      </span>
    </el-dialog>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import BizSaveButton from '@/components/BizSaveButton';
import MerchantsMgmtComQuaService from '@/service/merchants-mgmt/merchantsMgmtComQua';
import MerchantsMgmtInfoService from '@/service/merchants-mgmt/merchantsMgmtBaseInfo';
import verify from '@/utils/verify';
import { BizEditor } from '@/components/BizEditorH';
import { BizAvatarUploaderNew } from '@/components/BizForm';
import uuid from '@/utils/uuid';
import http from '@/common/http';
import axios from 'axios';
export default {
  name: 'MerchantsMgmtComQua',
  components: { BizSaveButton, BizGrid, BizAvatarUploaderNew, BizEditor },
  data() {
    let validateUSCC = (rule, value, callback) => {
      if (!verify.isUnifiedSocialCreditCode(value)) {
        callback(new Error('请输入正确的统一社会信用代码'));
      } else {
        callback();
      }
    };
    let checkPrice = (rule, value, callback) => {
      if (isNaN(value)) {
        callback(new Error('请输入数字值'));
      } else {
        if (value < 0) {
          callback(new Error('必须输入正数'));
        } else {
          callback();
        }
      }
    };
    return {
      auditFailedDialog: false,
      isCreated: false,
      clearable: false,
      dialogVisiblePass: false,
      dialogAdminVisible: false,
      show: true,
      count: '',
      code: '',
      imgSrc: '',
      validImg: '',
      validCode: '',
      timer: null,
      isManageThisStore: '',
      updateId: '',
      email: '',
      memberId: '',
      passMailCount: '',
      certificationPassedDialog: false,
      certificationPassedForm: {
        subject: 'V服爱车账号开通通知(重要)',
        content: ''
      },
      form: {
        fileData: {
          type: '0'
        },
        name: '',
        mobile: '',
        bussinessLicenseCode: '',
        bussinessLicenseImg: '',
        address: '',
        bussinessLicenseDue: '',
        registeredCapital: '',
        state: '0',
        remark: ''
      },
      operations: [
        {
          disabled: false,
          label: '废弃',
          name: 'onAbandoned',
          type: 'danger'
        },
        {
          disabled: false,
          label: '审核未通过邮件',
          name: 'auditFailed',
          type: 'primary'
        },
        {
          disabled: false,
          label: '通过',
          name: 'onPassed',
          type: 'primary'
        },
        {
          label: '完成',
          name: 'complete',
          type: 'primary',
          disabled: true
        },
        {
          disabled: false,
          label: '保存',
          name: 'save',
          type: 'primary'
        }
      ],
      auditFailedEmali: {
        subject: 'V服爱车信息审核反馈通知(重要)',
        content: ''
      },
      rules: {
        name: [{ required: true, message: '请输入企业名称', trigger: 'blur' }],
        bussinessLicenseCode: [
          {
            required: true,
            message: '请输入统一社会信用代码',
            trigger: 'blur'
          },
          { validator: validateUSCC, trigger: 'blur' }
        ],
        address: [{ required: true, message: '请输入营业执照所在地', trigger: 'blur' }],
        registeredCapital: [
          { required: true, message: '请输入注册资本', trigger: 'blur' },
          { validator: checkPrice, trigger: 'blur' }
        ]
      }
    };
  },
  props: {
    id: {
      type: String,
      default: ''
    },
    open: {
      type: Boolean,
      default: false
    },
    state: {
      type: String,
      default: ''
    },
    mobile: {
      type: String,
      default: ''
    }
    // email: {
    //   type: String,
    //   default: ''
    // }
  },
  watch: {
    id: function(id) {
      if (id === '') {
      } else {
        // this.refresh();
        this.getEmailContent();
      }
    },
    open: function(val) {
      if (val) {
        this.refresh();
      }
    }
  },
  created() {
    this.getVerificationImg();
  },
  methods: {
    // 审核未通过
    auditFailed() {
      this.getEmailContent();
      this.auditFailedDialog = true;
    },
    close() {
      this.isManageThisStore = '';
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
          // console.log(data);
          this.uid = data.uid;
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
      this.complete();
    },
    complete() {
      this.dialogAdminVisible = false;
      this.dialogVisiblePass = false;
      MerchantsMgmtInfoService.passed(
        { id: this.id, memberId: this.memberId, isManageThisStore: this.isManageThisStore },
        data => {
          this.loading = false;
          this.username = data.username;
          this.password = data.password;
          this.getEmailContent();
          this.openCertificationPassedEmail();
          this.$emit('created');
        },
        ErrorData => {
          this.loading = false;
          this.isManageThisStore = '';
          if (ErrorData.memberId) {
            this.memberId = ErrorData.memberId;
            this.dialogVisiblePass = true;
          } else if (ErrorData.resultCode === '1070') {
            this.dialogAdminVisible = true;
            this.isManageThisStore = '1';
          } else {
            if (ErrorData.errorMessage) this.$message.warning(ErrorData.errorMessage);
          }
          // if (ErrorData.errorMessage) this.$message.warning(ErrorData.errorMessage);
        }
      );
    },
    // 打开认证通过邮件dialog
    openCertificationPassedEmail() {
      this.certificationPassedDialog = true;
    },
    // 认证通过邮件
    sendCertificationPassedEmail() {
      let params = {
        id: this.id,
        toMail: this.email,
        subject: this.certificationPassedForm.subject,
        content: this.certificationPassedForm.content
      };
      this.loading = true;
      MerchantsMgmtInfoService.sendEmail(
        params,
        data => {
          this.passMailCount = Number(this.passMailCount) + 1;
          this.$message({
            message: '认证通过邮件发送成功！',
            type: 'success'
          });
          this.loading = false;
        },
        ErrorData => {
          this.loading = false;
          console.log(ErrorData);
        }
      );
      this.qualificationsDialog = false;
    },
    sendAuditFailedEmail() {
      let params = {
        id: this.id,
        toMail: this.email,
        subject: this.auditFailedEmali.subject,
        content: this.auditFailedEmali.content
      };
      this.loading = true;
      MerchantsMgmtInfoService.sendEmail(
        params,
        data => {
          this.$message({
            message: '邮件发送成功！',
            type: 'success'
          });

          this.loading = false;
        },
        ErrorData => {
          this.loading = false;
          console.log(ErrorData);
        }
      );
      this.qualificationsDialog = false;
    },
    getEmailContent() {
      this.auditFailedEmali.content =
        '亲爱的用户，您好：<br/><br/>经我方工作人员核实，您所提交的相关信息暂未通过平台审核，还需要对以下内容进行修正：<br/><br/>' +
        '以下为样例：<br/><br/>' +
        '1. 手持身份证信息不清楚<br/>' +
        '2. 营业执照复印件没有加盖公章<br/>' +
        '3. 请点击以下网址更新您的相关材料（该链接48小时内有效，若页面空白请复制该链接到浏览器地址栏打开）：<br/>' +
        '<a href="' +
        window.location.origin +
        '/?personalId=&investmentId=' +
        this.id +
        '&companyId=' +
        this.updateId +
        '#/merchants/qua">' +
        window.location.origin +
        '/?personalId=&investmentId=' +
        this.id +
        '&companyId=' +
        this.updateId +
        '#/merchants/qua' +
        '</a>' +
        '<br/><br/>祝您 万事如意<br/><br/>V服爱车团队';
      this.certificationPassedForm.content =
        '亲爱的用户，您好：<br/><br/>我们很高兴的通知您，您所提交的相关信息已通过平台的审核，现已为您开通平台使用账号。<br/>' +
        '1. V服爱车平台地址<br/>' +
        window.location.origin +
        '<br/>' +
        '2. 输入平台为您分配的账号，开始您的V服之旅<br/>' +
        '用户名：' +
        this.username +
        '<br/>' +
        '密码：' +
        this.password +
        '<br/>' +
        '3. 如您在使用过程中遇到任何问题，或要反馈您的宝贵意见和建议，请拔打400电话：400-6556-119。<br/><br/>' +
        '祝您 万事如意<br/><br/>V服爱车团队';
    },
    // 通过
    onPassed() {
      this.$refs.form.validate((valid, a) => {
        if (valid) {
          let params = {
            id: this.updateId,
            investmentId: this.id,
            name: this.form.name,
            bussinessLicenseCode: this.form.bussinessLicenseCode,
            address: this.form.address,
            bussinessLicenseImg: this.form.bussinessLicenseImg,
            bussinessLicenseDue: this.form.bussinessLicenseDue,
            registeredCapital: this.form.registeredCapital,
            remark: this.form.remark,
            state: '1'
          };
          this.loading = true;
          MerchantsMgmtComQuaService.save(
            params,
            async data => {
              this.loading = false;
              this.$notify({
                title: '成功',
                message: '更新成功',
                type: 'success',
                duration: 1500
              });
              await this.refresh();
              this.$emit('created');
            },
            ErrorData => {
              this.loading = false;
              this.$notify({
                title: '更新失败',
                message: ErrorData.errorMessage,
                type: 'warning'
              });
            }
          );
        }
      });
    },
    // 废弃
    onAbandoned() {
      this.$confirm('此操作将废弃该申请, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let params = {
            id: this.id
          };
          this.loading = true;
          MerchantsMgmtComQuaService.abandoned(
            params,
            data => {
              this.$message.success('操作成功');
              this.$emit('onAbandoned');
            },
            ErrorData => {
              this.loading = false;
              this.$message.warning(ErrorData.errorMessage);
            }
          );
        })
        .catch(() => {});
    },
    // 注意，此处是为了绑定operate name,所以直接使用了this
    operate(name) {
      this[name]();
    },
    areaChanged(areaId) {
      this.areaId = areaId;
    },
    handleBussinessLicenseImgSuccess(url) {
      this.form.bussinessLicenseImg = url;
    },
    save() {
      if (this.form.bussinessLicenseImg === '') {
        return;
      }

      this.$refs.form.validate(valid => {
        if (valid) {
          this.submit();
        } else {
          return false;
        }
      });
    },
    submit() {
      this.$refs.form.validate((valid, a) => {
        if (valid) {
          if (this.isCreated) {
            this.create();
          } else {
            this.update();
          }
        }
      });
    },
    create() {
      let params = {
        investmentId: this.id,
        name: this.form.name,
        bussinessLicenseCode: this.form.bussinessLicenseCode,
        address: this.form.address,
        bussinessLicenseImg: this.form.bussinessLicenseImg,
        bussinessLicenseDue: this.form.bussinessLicenseDue,
        registeredCapital: this.form.registeredCapital,
        remark: this.form.remark,
        state: this.form.state
      };
      this.loading = true;
      MerchantsMgmtComQuaService.create(
        params,
        data => {
          this.loading = false;
          this.isCreated = false;
          this.$message.success('操作成功');
          this.refresh();
        },
        ErrorData => {
          this.loading = false;
          this.$message.warning(ErrorData.errorMessage);
        }
      );
    },
    update() {
      let params = {
        id: this.updateId,
        investmentId: this.id,
        name: this.form.name,
        bussinessLicenseCode: this.form.bussinessLicenseCode,
        address: this.form.address,
        bussinessLicenseImg: this.form.bussinessLicenseImg,
        bussinessLicenseDue: this.form.bussinessLicenseDue,
        registeredCapital: this.form.registeredCapital,
        remark: this.form.remark,
        state: this.form.state
      };
      this.loading = true;
      MerchantsMgmtComQuaService.save(
        params,
        async data => {
          this.loading = false;
          this.$message.success('操作成功');
          await this.refresh();
          // 通过
          if (this.form.state === '1') {
            this.$emit('updateState');
          }
        },
        ErrorData => {
          this.loading = false;
          this.$notify({
            title: '更新失败',
            message: ErrorData.errorMessage,
            type: 'warning'
          });
        }
      );
    },
    refresh() {
      this.$refs.form.clearValidate();
      let params = {
        investmentId: this.id
      };
      this.loading = true;
      MerchantsMgmtComQuaService.get(
        params,
        data => {
          // 滚动条到顶部
          this.$refs.form.$el.scrollTop = 0;
          this.form.name = data.content.name || '';
          this.form.mobile = data.content.personalMobile || '';
          this.form.bussinessLicenseCode = data.content.bussinessLicenseCode || '';
          this.form.bussinessLicenseImg = data.content.bussinessLicenseImg || '';
          this.form.bussinessLicenseDue = data.content.bussinessLicenseDue || '';
          this.form.registeredCapital = data.content.registeredCapital || '';
          this.form.address = data.content.address || '';
          this.form.remark = data.content.remark || '';
          this.form.state = data.content.state || '0';
          this.passMailCount = data.content.passMailCount || '';
          this.updateId = data.content.id || '';
          this.loading = false;
          if (data.content.id) {
            this.isCreated = false;
          } else {
            this.isCreated = true;
          }
          this.email = data.content.email;
          this.operations[3].disabled = true;
          this.operations[1].disabled = false;
          this.operations[0].disabled = false;
          this.operations[2].disabled = false;
          this.operations[4].disabled = false;
          // 通过
          if (data.content.totalPassButton === '1') {
            this.operations[3].disabled = false;
          }
          if (this.state && this.state === '3') {
            this.operations[0].disabled = true;
            this.operations[1].disabled = true;
            this.operations[2].disabled = true;
            this.operations[3].disabled = true;
            this.operations[4].disabled = true;
          }
          if (data.content.state && data.content.state === '1') {
            this.operations[1].disabled = true;
          }
        },
        ErrorData => {
          this.loading = false;

          // create
          if (ErrorData.resultCode === '900' || ErrorData.resultCode === '886') {
            this.isCreated = true;
            this.form.name = '';
            this.form.bussinessLicenseCode = '';
            this.form.address = '';
            this.form.bussinessLicenseImg = '';
            this.form.registeredCapital = '';
            this.form.remark = '';
            this.form.state = '0';
          }
        }
      );
    }
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
.merchants-mgmt-com-qua {
  height: 100%;
  padding: 15px;
  .biz-save-button {
    justify-content: flex-start;
  }
  .el-form {
    height: 100%;
    overflow: auto;
    padding-bottom: 100px;
    padding-right: 20px;
    .el-textarea {
      font-size: 13px;
    }
  }
  .el-date-editor {
    .el-input__inner {
      width: 80%;
    }
  }
}
.qualificationDialog {
  .vue-ueditor {
    width: 100% !important;
    .view {
      font-size: 14px;
    }
  }
}
</style>
