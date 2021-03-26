<template>
  <biz-grid class="merchants-mgmt-base-info">
    <biz-save-button slot="top" :operations="operations" @operate="operate">
    </biz-save-button>
    <el-form :rules="rules" ref="form" :model="form" label-width="120px" size="small" v-loading="loading" :disabled="(form.state==='1'||this.state==='3')&&!!id" :inline-message="true">
      <el-form-item label="姓名" prop="name">
        <el-input placeholder="请输入姓名" v-model="form.name" minlength="1" maxlength="20"></el-input>
      </el-form-item>
      <el-form-item label="电话" prop="mobile">
        <el-input placeholder="请输入电话" v-model="form.mobile"></el-input>
      </el-form-item>
      <el-form-item label="电子邮箱" prop="email">
        <el-input placeholder="请输入您的电子邮箱" v-model="form.email"></el-input>
      </el-form-item>
      <el-form-item label="QQ号">
        <el-input placeholder="请输入您的QQ号"
                  v-model="form.qq"></el-input>
      </el-form-item>
      <el-form-item label="微信号">
        <el-input placeholder="请输入您的微信号"
                  v-model="form.wchat"></el-input>
      </el-form-item>
      <el-form-item label="所在区域" prop="areaId">
        <biz-area-select :areaId="form.areaId" @areaChanged="areaChanged">
        </biz-area-select>
      </el-form-item>
      <el-form-item label="申请时间">
        <el-input disabled v-model="form.createDate"></el-input>
      </el-form-item>
      <el-form-item label="合作意向">
        <el-input type="textarea" placeholder="请输入合作意向" v-model="form.cooperationIntention"></el-input>
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="form.state" placeholder="请选择状态" disabled>
          <el-option label="未审核" value="0"></el-option>
          <el-option label="通过" value="1"></el-option>
          <el-option label="未通过" value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="备注信息">
        <el-input type="textarea" placeholder="请输入备注信息" v-model="form.remark"></el-input>
      </el-form-item>
      <el-form-item label="所属运营商">
        <el-select v-model="form.companyId" placeholder="请选择运营商">
          <el-option v-for="company of companies" :key="company.id" :label="company.name" :value="company.id"></el-option>
        </el-select>
      </el-form-item>
      <div class="help">
        *通过电话联系，确认申请信息有效，则“发送资质邮件”，然后点击“通过”；若为虚假消息，则“废弃”该条申请信息。
      </div>
    </el-form>
    <div slot="float">
      <el-dialog title="发送资质邮件" append-to-body :visible.sync="qualificationsDialog" custom-class="qualification-Dialog">
        <el-form :model="qualificationsForm" label-width="120px" size="small">
          <!-- <el-form-item label="已发送邮件次数" v-if="passMailCount&&passMailCount!=='0'">
            {{passMailCount}}次
          </el-form-item> -->
          <el-form-item label="收件人地址">
            <el-input v-model="form.email"></el-input>
          </el-form-item>
          <el-form-item label="邮件标题">
            <el-input v-model="qualificationsForm.subject"></el-input>
          </el-form-item>
          <el-form-item label="邮件内容">
            <biz-editor ref="editor" width="100%" height="400px" :hasImage="false" v-model="qualificationsForm.content"></biz-editor>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button size="small" @click="qualificationsDialog = false">取 消</el-button>
          <el-button size="small" type="primary" @click="sendQualificationsEmail">发送</el-button>
        </div>
      </el-dialog>
      <el-dialog title="认证通过邮件" append-to-body :visible.sync="certificationPassedDialog" custom-class="qualification-Dialog">
        <el-form :model="certificationPassedForm">
          <el-form-item label="已发送邮件次数" v-if="passMailCount&&passMailCount!=='0'">
            {{passMailCount}}次
          </el-form-item>
          <el-form-item label="收件人地址">
            <el-input v-model="form.email"></el-input>
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
        <span>{{form.mobile}}已被注册，请确认是否通过</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisiblePass = false" size="mini">取 消</el-button>
          <el-button type="primary" @click="pass" size="mini">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import BizSaveButton from '@/components/BizSaveButton';
import BizAreaSelect from '@/components/BizAreaSelect';
import { BizEditor } from '@/components/BizEditorH';
import MerchantsMgmtInfoService from '@/service/merchants-mgmt/merchantsMgmtBaseInfo';
import http from '@/common/http';
export default {
  name: 'MerchantsMgmtBaseInfo',
  components: { BizSaveButton, BizAreaSelect, BizGrid, BizEditor },
  data() {
    let validateMobile = (rule, value, callback) => {
      let mobile = /^1\d{10}$/;
      if (!mobile.test(value)) {
        callback(new Error('请输入正确的手机号码'));
      } else {
        callback();
      }
    };
    return {
      username: '',
      password: '',
      passMailCount: '',
      loading: false,
      hasKaou: false,
      dialogVisible: false,
      dialogVisiblePass: false,
      kaouCompanyId: '',
      qualificationsDialog: false,
      qualificationsForm: {
        subject: 'V服爱车商务合作申请反馈通知(重要)',
        content: ''
      },
      certificationPassedDialog: false,
      certificationPassedForm: {
        subject: 'V服爱车账号开通通知(重要)',
        content: ''
      },
      companies: [],
      userId: '',
      form: {
        areaId: '1568',
        name: '',
        mobile: '',
        email: '',
        createDate: '',
        cooperationIntention: '',
        state: '0',
        remark: '',
        companyId: '',
        qq: '',
        wchat: ''
      },
      operations: [
        {
          disabled: false,
          label: '废弃',
          name: 'abandoned',
          type: 'danger'
        },
        {
          disabled: false,
          label: '发送资质邮件',
          name: 'openQualificationsEmail',
          type: 'primary'
        },
        {
          disabled: false,
          label: '通过',
          name: 'onPassed',
          type: 'primary'
        },
        {
          disabled: false,
          label: '保存',
          name: 'save',
          type: 'primary'
        }
      ],
      rules: {
        name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        mobile: [{ required: true, message: '请输入电话号码', trigger: 'blur' }, { validator: validateMobile, trigger: 'blur' }],
        email: [
          {
            type: 'email',
            required: true,
            message: '请输入正确的邮箱地址',
            trigger: 'blur'
          }
        ],
        areaId: [{ required: true, message: '请选择', trigger: 'blur' }]
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
    }
  },
  watch: {
    id: function(id) {
      if (id === '') {
        // 新添加的滚动条要到顶部
        this.$refs.form.$el.scrollTop = 0;
        this.form.name = '';
        this.form.mobile = '';
        this.form.investmentState = '0';
        this.form.email = '';
        this.form.createDate = '';
        this.form.state = '0';
        this.form.cooperationIntention = '';
        this.form.remark = '';
        this.form.companyId = this.companies[0].id;
        this.form.areaId = '1568';
        this.form.qq = '';
        this.form.wchat = '';
        this.operations[0].disabled = true;
        this.operations[1].disabled = true;
        this.operations[2].disabled = true;
        this.operations[3].disabled = false;
      } else {
        // this.refresh();
        this.getEmailContent();
      }
    },
    open: function(val) {
      if (val) {
        this.refresh();
        this.$refs.form.clearValidate();
        if (this.id === '') {
          this.operations[0].disabled = true;
          this.operations[1].disabled = true;
          this.operations[2].disabled = true;
          this.operations[3].disabled = false;
        }
      }
    }
  },
  created() {
    // 获取运营商列表
    this.getCompanies();
  },
  computed: {},
  methods: {
    // 注意，此处是为了绑定operate name,所以直接使用了this
    operate(name) {
      this[name]();
    },
    areaChanged(areaId) {
      console.log(areaId);
      this.form.areaId = areaId;
    },
    save() {
      this.$refs.form.validate(valid => {
        this.submit();
      });
    },
    submit() {
      this.$refs.form.validate((valid, a) => {
        if (valid) {
          if (this.id === '') {
            this.create();
          } else {
            this.update();
          }
        }
      });
    },
    checkMobile(mobile) {
      http
        .post('/admin/admin/checkMobile.jhtml', { mobile: mobile })
        .then(data => {
          if (data.userId) {
            this.userId = data.userId;
            this.dialogVisible = true;
          } else {
            this.userId = '';
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
    create() {
      let params = {
        name: this.form.name,
        mobile: this.form.mobile,
        email: this.form.email,
        cooperationIntention: this.form.cooperationIntention,
        remark: this.form.remark,
        companyId: this.form.companyId,
        state: this.form.state,
        areaId: this.form.areaId,
        qq: this.form.qq,
        wchat: this.form.wchat,
        memberId: this.userId
      };
      this.loading = true;
      MerchantsMgmtInfoService.create(
        params,
        data => {
          this.loading = false;
          this.$message.success('操作成功');
          this.$emit('createdSuccess', data.id);
          this.refresh(data.id);
        },
        ErrorData => {
          this.loading = false;
          this.$message.warning(ErrorData.errorMessage);
        }
      );
    },
    update() {
      let params = {
        id: this.id,
        name: this.form.name,
        mobile: this.form.mobile,
        email: this.form.email,
        cooperationIntention: this.form.cooperationIntention,
        remark: this.form.remark,
        companyId: this.form.companyId,
        state: this.form.state,
        areaId: this.form.areaId,
        qq: this.form.qq,
        wchat: this.form.wchat,
        memberId: this.userId
      };
      this.loading = true;
      MerchantsMgmtInfoService.save(
        params,
        data => {
          this.loading = false;
          this.$message.success('操作成功');
          this.$emit('created');
          this.refresh();
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
    refresh(id) {
      let params = {
        id: this.id || id || ''
      };
      this.loading = true;
      MerchantsMgmtInfoService.get(
        params,
        data => {
          this.loading = false;
          this.form.name = data.content.name;
          this.form.mobile = data.content.mobile;
          this.form.investmentState = data.content.investmentState;
          this.form.email = data.content.email;
          this.form.createDate = data.content.createDate;
          this.form.areaId = data.content.areaId;
          this.form.state = data.content.state;
          this.form.cooperationIntention = data.content.cooperationIntention;
          this.form.remark = data.content.remark;
          this.username = data.content.username;
          this.password = data.content.password;
          this.form.qq = data.content.qq;
          this.form.wchat = data.content.wchat;
          this.passMailCount = data.content.passMailCount;
          if (data.content.companyId && data.content.companyId !== '') {
            // 有了运营商ID就正常显示
            this.form.companyId = data.content.companyId;
          } else {
            this.form.companyId = this.companies[0].id;
          }
          this.operations[1].disabled = true;
          this.operations[0].disabled = false;
          this.operations[2].disabled = false;
          this.operations[3].disabled = false;
          // 通过
          if (this.form.state === '1') {
            this.operations[1].disabled = false;
          }
          if (this.state && this.state === '3' && this.id) {
            this.operations[0].disabled = true;
            this.operations[1].disabled = true;
            this.operations[2].disabled = true;
            this.operations[3].disabled = true;
          }
          // 总体通过
          // this.operations[0].disabled = true;
          // if (data.content.totalPassButton === '1') {
          //   this.operations[0].disabled = false;
          // }
        },
        ErrorData => {
          this.loading = false;
          console.log(ErrorData);
        }
      );
    },
    // 通过
    onPassed() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.pass();
        }
      });
    },
    // pass() {
    //   this.dialogVisiblePass = false;
    //   if (!(this.form.investmentState === '2')) {
    //     let params = {
    //       id: this.id,
    //       memberId: this.userId
    //     };
    //     this.loading = true;
    //     MerchantsMgmtInfoService.passed(
    //       params,
    //       data => {
    //         this.loading = false;
    //         this.username = data.username;
    //         this.password = data.password;
    //         this.getEmailContent();
    //         this.openCertificationPassedEmail();
    //         this.$emit('created');
    //       },
    //       ErrorData => {
    //         this.loading = false;
    //         if (ErrorData.errorMessage) this.$message.warning(ErrorData.errorMessage);
    //       }
    //     );
    //   } else {
    //     this.getEmailContent();
    //     this.openCertificationPassedEmail();
    //   }
    // },
    pass() {
      let params = {
        id: this.id,
        name: this.form.name,
        mobile: this.form.mobile,
        email: this.form.email,
        cooperationIntention: this.form.cooperationIntention,
        remark: this.form.remark,
        companyId: this.form.companyId,
        state: '1',
        areaId: this.form.areaId,
        memberId: this.userId
      };
      this.loading = true;
      MerchantsMgmtInfoService.save(
        params,
        data => {
          this.loading = false;
          this.$message.success('操作成功');
          this.$emit('created');
          this.refresh();
        },
        ErrorData => {
          this.loading = false;
          this.$notify({
            title: '操作失败',
            message: ErrorData.errorMessage,
            type: 'warning'
          });
        }
      );
    },
    abandoned() {
      this.$confirm('此操作将废弃该申请, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.onAbandoned();
        })
        .catch(() => {});
    },
    // 废弃
    onAbandoned() {
      let params = {
        id: this.id
      };
      this.loading = true;
      MerchantsMgmtInfoService.abandoned(
        params,
        data => {
          this.loading = false;
          this.$message.success('操作成功');
          this.$emit('onAbandoned');
        },
        ErrorData => {
          this.loading = false;
          console.log(ErrorData);
        }
      );
    },
    getEmailContent() {
      this.qualificationsForm.content =
        '亲爱的用户，您好：<br/><br/>我们收到了您提交的合作申请。感谢您对V服爱车平台的关注与信任，为了更好的体验平台的功能与服务，请您依照以下的步骤进行：<br/><br/>' +
        '1. 请点击以下网址（该链接48小时内有效，若页面空白请复制该链接到浏览器地址栏打开）：<br/>' +
        '<a href="' +
        window.location.origin +
        '/?personalId=&companyId=&investmentId=' +
        this.id +
        '#/merchants/qua">' +
        window.location.origin +
        '/?personalId=&companyId=&investmentId=' +
        this.id +
        '#/merchants/qua' +
        '</a>' +
        '<br/>' +
        '2.提交相关资质证明信息<br/>' +
        '3.审核通过后会为您开通相应的权限<br/><br/>' +
        '烦请注意，本封邮件是由系统发送，请您不要回复。' +
        '如果回复本信，我们无法给您回信。如果您还有其它的问题，请在网页上点击“联系客服中心”，并输入您要反映的问题或意见，或回复carowl@carowl.cn。' +
        '我们会尽快与您联系。<br/><br/>祝您 万事如意<br/><br/>V服爱车团队';
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
    // 打开发送资质邮件dialog
    openQualificationsEmail() {
      this.qualificationsDialog = true;
    },
    // 发送资质邮件
    sendQualificationsEmail() {
      let params = {
        id: this.id,
        toMail: this.form.email,
        subject: this.qualificationsForm.subject,
        content: this.qualificationsForm.content
      };
      this.loading = true;
      MerchantsMgmtInfoService.sendEmail(
        params,
        data => {
          this.loading = false;
          if (data.resultCode === '100') {
            // this.passMailCount = Number(this.passMailCount) + 1;
            this.$message({
              message: '资质邮件发送成功！',
              type: 'success'
            });
          }
        },
        ErrorData => {
          this.loading = false;
          this.$message.warning(ErrorData.errorMessage);
        }
      );
      this.qualificationsDialog = false;
    },
    // 打开认证通过邮件dialog
    openCertificationPassedEmail() {
      this.certificationPassedDialog = true;
    },
    // 认证通过邮件
    sendCertificationPassedEmail() {
      let params = {
        id: this.id,
        toMail: this.form.email,
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
    getCompanies() {
      MerchantsMgmtInfoService.getCompanies(
        data => {
          let companies = [];
          // 接口比较老，需要生成标准数组
          for (let key in data.content) {
            // 检查是否有卡欧
            // if (data.content[key] === '卡欧运营商') {
            //   this.hasKaou = true;
            //   this.kaouCompanyId = key;
            // }
            companies.push({
              id: key,
              name: data.content[key]
            });
          }

          this.companies = companies;
        },
        ErrorData => {
          console.log(ErrorData);
        }
      );
    }
  }
};
</script>

<style lang="scss">
.merchants-mgmt-base-info {
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
    .help {
      color: red;
      padding-top: 10px;
      font-size: 12px;
    }
  }
  .el-date-editor {
    .el-input__inner {
      width: 80%;
    }
  }
}
.qualification-Dialog {
  .vue-ueditor {
    width: 100% !important;
    .view {
      font-size: 14px;
    }
  }
}
</style>
