<template>
  <biz-grid class="merchants-mgmt-psn-qua">
    <biz-save-button slot="top" :operations="operations" @operate="operate">
    </biz-save-button>
    <el-form ref="form" :rules="rules" :model="form" label-width="120px" size="small" v-loading="loading" :disabled="form.state==='1'||this.state==='3'" :inline-message="true">
      <el-form-item label="姓名" prop="name">
        <el-input placeholder="请输入姓名" v-model="form.name" minlength="1" maxlength="20"></el-input>
      </el-form-item>
      <el-form-item label="身份证号" prop="idCartCode">
        <el-input placeholder="请输入身份证号" v-model="form.idCartCode"></el-input>
      </el-form-item>
      <el-form-item label="手持身份证" :required="true" :error="form.personImg===''?'请上传所需照片':''">
        <BizAvatarUploaderNew v-model="form.personImg">
        </BizAvatarUploaderNew>
      </el-form-item>
      <el-form-item label="身份证正面" :required="true" :error="form.idCartImgFront===''?'请上传所需照片':''">
        <BizAvatarUploaderNew v-model="form.idCartImgFront">
        </BizAvatarUploaderNew>
      </el-form-item>
      <el-form-item label="身份证反面" :required="true" :error="form.idCartImgBack===''?'请上传所需照片':''">
        <BizAvatarUploaderNew v-model="form.idCartImgBack">
        </BizAvatarUploaderNew>
      </el-form-item>
      <el-form-item label="所在区域" prop="areaId">
        <biz-area-select :areaId="form.areaId" @areaChanged="areaChanged">
        </biz-area-select>
      </el-form-item>
      <el-form-item label="详细街道地址" prop="address">
        <el-input placeholder="请输入详细地址" type="textarea" v-model="form.address"></el-input>
      </el-form-item>
      <el-form-item label="联系电话" prop="mobile">
        <el-input placeholder="请输入电话" v-model="form.mobile"></el-input>
      </el-form-item>
      <el-form-item label="店铺名称" prop="shopName">
        <el-input placeholder="请输入您想申请的店铺名称" v-model="form.shopName"></el-input>
      </el-form-item>
      <el-form-item label="主营业务" prop="majorBusiness">
        <el-input placeholder="请输入您的主营业务" type="textarea" v-model="form.majorBusiness"></el-input>
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
          <biz-editor ref="editor" width="100%" height="400px" v-model="auditFailedEmali.content" :hasImage="false"></biz-editor>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="auditFailedDialog = false">取消</el-button>
        <el-button size="small" type="primary" @click="sendAuditFailedEmail">发送</el-button>
      </div>
    </el-dialog>
    <el-dialog title="提示" :visible.sync="dialogVisiblePass" width="30%" append-to-body>
      <span>{{form.mobile}}已被注册，请确认是否通过</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisiblePass = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="onPassed" size="mini">确 定</el-button>
      </span>
    </el-dialog>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import BizSaveButton from '@/components/BizSaveButton';
import BizAreaSelect from '@/components/BizAreaSelect';
import MerchantsMgmtPsnQuaService from '@/service/merchants-mgmt/merchantsMgmtPsnQua';
import MerchantsMgmtInfoService from '@/service/merchants-mgmt/merchantsMgmtBaseInfo';
import { BizAvatarUploaderNew } from '@/components/BizForm';
import { BizEditor } from '@/components/BizEditorH';
import http from '@/common/http';
export default {
  name: 'MerchantsMgmtPsnQua',
  components: {
    BizSaveButton,
    BizAreaSelect,
    BizGrid,
    BizAvatarUploaderNew,
    BizEditor
  },
  data() {
    let validateMobile = (rule, value, callback) => {
      let mobile = /^1\d{10}$/;
      if (!mobile.test(value)) {
        callback(new Error('请输入正确的手机号码'));
      } else {
        callback();
      }
    };
    let validateIdCart = (rule, value, callback) => {
      let validate = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
      if (!validate.test(value)) {
        callback(new Error('请输入正确的身份证'));
      } else {
        callback();
      }
    };
    return {
      auditFailedDialog: false,
      loading: false,
      isCreated: false,
      dialogVisiblePass: false,
      updateId: '',
      email: '',
      userId: '',
      form: {
        name: '',
        idCartCode: '',
        personImg: '',
        idCartImgFront: '',
        idCartImgBack: '',
        areaId: '',
        address: '',
        mobile: '',
        shopName: '',
        majorBusiness: '',
        state: '0',
        remark: '',
        fileData: {
          type: '0'
        }
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
          name: 'pass',
          type: 'primary'
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
        name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        idCartCode: [
          { required: true, message: '请输入身份证号码', trigger: 'blur' },
          { validator: validateIdCart, trigger: 'blur' }
        ],
        mobile: [{ required: true, message: '请输入电话号码', trigger: 'blur' }, { validator: validateMobile, trigger: 'blur' }],
        areaId: [{ required: true, message: '请选择', trigger: 'blur' }],
        address: [{ required: true, message: '请输入街道地址', trigger: 'blur' }],
        shopName: [{ required: true, message: '请输入店铺名称', trigger: 'blur' }],
        majorBusiness: [{ required: true, message: '请输入主营业务', trigger: 'blur' }]
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
  methods: {
    // 审核未通过
    auditFailed() {
      this.getEmailContent();
      this.auditFailedDialog = true;
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
    handlePersonImgSuccess: function(url) {
      this.form.personImg = url;
    },
    handleIdCartImgFrontSuccess: function(url) {
      this.form.idCartImgFront = url;
    },
    handleIdCartImgBackSuccess: function(url) {
      this.form.idCartImgBack = url;
    },
    areaChanged(areaId) {
      this.form.areaId = areaId;
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
        '/?companyId=&investmentId=' +
        this.id +
        '&personalId=' +
        this.updateId +
        '#/merchants/qua">' +
        window.location.origin +
        '/?companyId=&investmentId=' +
        this.id +
        '&personalId=' +
        this.updateId +
        '#/merchants/qua' +
        '</a>' +
        '<br/><br/>祝您 万事如意<br/><br/>V服爱车团队';
    },
    // 通过
    pass() {
      if (this.form.personImg === '' || this.form.idCartImgFront === '' || this.form.idCartImgBack === '') {
        return;
      }

      this.$refs.form.validate(valid => {
        if (valid) {
          http
            .post('/admin/admin/checkMobile.jhtml', { mobile: this.form.mobile })
            .then(data => {
              if (data.userId) {
                this.userId = data.userId;
                this.dialogVisiblePass = true;
              } else {
                this.userId = '';
                this.onPassed();
              }
            })
            .catch(errData => {
              this.loading = false;
              if (errData.errorMessage) this.$message.warning(errData.errorMessage);
            })
            .finally(data => {
              this.loading = false;
            });
        } else {
          return false;
        }
      });
    },
    onPassed() {
      let params = {
        id: this.updateId,
        investmentId: this.id,
        name: this.form.name,
        idCartCode: this.form.idCartCode,
        personImg: this.form.personImg,
        idCartImgFront: this.form.idCartImgFront,
        idCartImgBack: this.form.idCartImgBack,
        areaId: this.form.areaId,
        address: this.form.address,
        mobile: this.form.mobile,
        shopName: this.form.shopName,
        majorBusiness: this.form.majorBusiness,
        remark: this.form.remark,
        state: '1'
      };
      this.loading = true;

      MerchantsMgmtPsnQuaService.save(
        params,
        async data => {
          this.loading = false;
          this.$message.success('操作成功');
          await this.refresh();
          this.$emit('created', this.form.mobile);
          this.dialogVisiblePass = false;
        },
        ErrorData => {
          this.loading = false;
          this.$notify({
            title: '操作失败',
            message: ErrorData.errorMessage,
            type: 'warning'
          });
          this.dialogVisiblePass = false;
        }
      );
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
          MerchantsMgmtPsnQuaService.abandoned(
            params,
            data => {
              this.$message.success('操作成功');
              this.$emit('onAbandoned');
            },
            ErrorData => {
              this.loading = false;
              this.$message.warning(ErrorData.errorMessage);
              console.log(ErrorData);
            }
          );
        })
        .catch(() => {});
    },
    // 注意，此处是为了绑定operate name,所以直接使用了this
    operate(name) {
      this[name]();
    },
    save() {
      if (this.form.personImg === '' || this.form.idCartImgFront === '' || this.form.idCartImgBack === '') {
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
      if (this.isCreated) {
        this.create();
      } else {
        this.update();
      }
    },
    create() {
      let params = {
        investmentId: this.id,
        name: this.form.name,
        idCartCode: this.form.idCartCode,
        personImg: this.form.personImg,
        idCartImgFront: this.form.idCartImgFront,
        idCartImgBack: this.form.idCartImgBack,
        areaId: this.form.areaId,
        address: this.form.address,
        mobile: this.form.mobile,
        shopName: this.form.shopName,
        majorBusiness: this.form.majorBusiness,
        remark: this.form.remark,
        state: this.form.state
      };
      this.loading = true;
      MerchantsMgmtPsnQuaService.create(
        params,
        data => {
          this.isCreated = false;
          this.loading = false;
          this.$message.success('操作成功');
          this.refresh();
        },
        ErrorData => {
          this.loading = false;
          this.$message.warning(ErrorData.errorMessage);
        }
      );
    },
    update: function() {
      let params = {
        id: this.updateId,
        investmentId: this.id,
        name: this.form.name,
        idCartCode: this.form.idCartCode,
        personImg: this.form.personImg,
        idCartImgFront: this.form.idCartImgFront,
        idCartImgBack: this.form.idCartImgBack,
        areaId: this.form.areaId,
        address: this.form.address,
        mobile: this.form.mobile,
        shopName: this.form.shopName,
        majorBusiness: this.form.majorBusiness,
        remark: this.form.remark,
        state: this.form.state
      };
      this.loading = true;

      MerchantsMgmtPsnQuaService.save(
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
      let params = {
        investmentId: this.id
      };
      this.loading = true;
      // 滚动条到顶部
      this.$refs.form.$el.scrollTop = 0;
      MerchantsMgmtPsnQuaService.get(
        params,
        data => {
          this.form.name = data.content.name || '';
          this.form.mobile = data.content.mobile || '';
          this.form.idCartCode = data.content.idCartCode || '';
          this.form.personImg = data.content.personImg || '';
          this.form.idCartImgFront = data.content.idCartImgFront || '';
          this.form.idCartImgBack = data.content.idCartImgBack || '';
          this.form.areaId = data.content.areaId || '';
          this.form.address = data.content.address || '';
          this.form.shopName = data.content.shopName || '';
          this.form.majorBusiness = data.content.majorBusiness || '';
          this.form.remark = data.content.remark || '';
          this.form.state = data.content.state || '0';
          this.updateId = data.content.id || '';
          this.email = data.content.email || '';
          this.operations[1].disabled = false;
          this.operations[0].disabled = false;
          this.operations[2].disabled = true;
          this.operations[3].disabled = false;
          if (this.state && this.state === '3') {
            this.operations[0].disabled = true;
            this.operations[1].disabled = true;
            this.operations[2].disabled = true;
            this.operations[3].disabled = true;
          }
          if (data.content.state && data.content.state === '1') {
            this.operations[1].disabled = true;
          }
          if (data.content.name) {
            this.operations[2].disabled = false;
          }
          if (data.content.id) {
            this.isCreated = false;
          } else {
            this.isCreated = true;
          }
          this.loading = false;
        },
        ErrorData => {
          this.loading = false;
          console.log(ErrorData);
          // create
          if (ErrorData.resultCode === '900') {
            this.isCreated = true;
            this.form.name = '';
            this.form.mobile = '';
            this.form.idCartCode = '';
            this.form.personImg = '';
            this.form.idCartImgFront = '';
            this.form.idCartImgBack = '';
            this.form.address = '';
            this.form.shopName = '';
            this.form.majorBusiness = '';
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
.merchants-mgmt-psn-qua {
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
