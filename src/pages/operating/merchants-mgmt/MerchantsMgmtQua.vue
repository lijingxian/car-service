<template>
  <div class="merchants-mgmt-qua">
    <div class="title">
      资质信息填写
      <span style="font-size:14px;color:#ff7300;">(请务必填写真实有效信息)</span>
    </div>
    <el-steps :active="active" finish-status="success">
      <el-step title="填写个人信息"></el-step>
      <el-step title="填写企业信息"></el-step>
    </el-steps>
    <el-form size="mini" v-loading="loading" :rules="personalRules" ref="personal" :model="personal" label-width="150px" v-show="isFirst" :inline-message="true">
      <el-form-item label="姓名" prop="name">
        <el-input v-model="personal.name" minlength="1" maxlength="20" placeholder="请输入姓名"></el-input>
      </el-form-item>
      <el-form-item label="身份证号" prop="idCartCode">
        <el-input v-model="personal.idCartCode" placeholder="请输入身份证号"></el-input>
      </el-form-item>
      <el-form-item label="联系电话" prop="mobile">
        <el-input v-model="personal.mobile" placeholder="请输入联系电话"></el-input>
      </el-form-item>
      <el-form-item label="手持身份证正面照片" :required="true">
        <BizAvatarUploaderNew v-model="personal.personImg"></BizAvatarUploaderNew>
      </el-form-item>
      <el-form-item label="身份证正面照片" :required="true">
        <BizAvatarUploaderNew v-model="personal.idCartImgFront"></BizAvatarUploaderNew>
      </el-form-item>
      <el-form-item label="身份证反面照片" :required="true">
        <BizAvatarUploaderNew v-model="personal.idCartImgBack"></BizAvatarUploaderNew>
      </el-form-item>
      <el-form-item label="所在区域" prop="areaId">
        <biz-area-select :areaId="personal.areaId" @areaChanged="areaChanged"></biz-area-select>
      </el-form-item>
      <el-form-item label="详细街道地址" prop="address">
        <el-input type="textarea" v-model="personal.address" placeholder="请输入详细地址"></el-input>
      </el-form-item>
      <el-form-item label="店铺名称" prop="shopName">
        <el-input v-model="personal.shopName" placeholder="请输入店铺名称"></el-input>
      </el-form-item>
      <el-form-item label="主营业务" prop="majorBusiness">
        <el-input type="textarea" v-model="personal.majorBusiness" placeholder="请输入主营业务"></el-input>
      </el-form-item>
      <el-form-item label="提交">
        <el-button type="primary" @click="onSubmitPersonal">提交个人资质</el-button>
        <!-- <el-button v-show="personalId === ''" @click="ignorePersonal">跳过</el-button> -->
      </el-form-item>
    </el-form>
    <el-form size="mini" v-loading="loading" :rules="companyRules" ref="company" :model="company" label-width="140px" v-show="!isFirst">
      <el-form-item label="企业名称" prop="name">
        <el-input placeholder="请输入您的企业名称" v-model="company.name"></el-input>
      </el-form-item>
      <el-form-item label="统一社会信用代码" prop="bussinessLicenseCode">
        <el-input placeholder="请输入18位社会信用代码" v-model="company.bussinessLicenseCode"></el-input>
      </el-form-item>
      <el-form-item label="营业执照所在地" prop="address">
        <el-input type="textarea" placeholder="请输入详细地址" v-model="company.address"></el-input>
      </el-form-item>
      <el-form-item label="营业期限" prop="bussinessLicenseDue">
        <el-date-picker
          type="date"
          :clearable="clearable"
          placeholder="请选择营业期限"
          value-format="yyyy-MM-dd"
          v-model="company.bussinessLicenseDue"
          style="width: 100%;"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="注册资本" prop="registeredCapital">
        <el-input-number placeholder="请输入注册资本" :min="0" v-model="company.registeredCapital"></el-input-number>
      </el-form-item>
      <el-form-item label="营业执照副本扫描件(加盖公章)" :required="true">
        <BizAvatarUploaderNew v-model="company.bussinessLicenseImg"></BizAvatarUploaderNew>
      </el-form-item>
      <el-form-item label="提交">
        <el-button type="primary" :disabled="completed" @click="onSubmitCompany">提交企业资质</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import axios from 'axios';
import BizAreaSelect from '@/components/BizAreaSelect';
import verify from '@/utils/verify';
import { BizAvatarUploaderNew } from '@/components/BizForm';

export default {
  data: function() {
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

    let validateUSCC = (rule, value, callback) => {
      if (!verify.isUnifiedSocialCreditCode(value)) {
        callback(new Error('请输入正确的统一社会信用代码'));
      } else {
        callback();
      }
    };
    return {
      loading: false,
      completed: false,
      clearable: false,
      active: 0,
      isFirst: true,
      isInit: true,
      fileData: {
        type: '0'
      },
      personal: {
        name: '',
        idCartCode: '',
        mobile: '',
        areaId: '1568',
        personImg: '',
        idCartImgFront: '',
        idCartImgBack: '',
        address: '',
        shopName: '',
        majorBusiness: '',
        remark: '',
        state: '0'
      },
      company: {
        name: '',
        bussinessLicenseCode: '',
        bussinessLicenseImg: '',
        address: '',
        bussinessLicenseDue: '',
        registeredCapital: 0,
        remark: '',
        state: '0'
      },
      investmentId: '',
      personalId: '',
      companyId: '',
      isCreated: true,
      personalRules: {
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
      },
      companyRules: {
        registeredCapital: [{ required: true, message: '请输入注册资本', trigger: 'blur' }],
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
        bussinessLicenseDue: [{ required: true, message: '请输入营业期限', trigger: 'blur' }]
      }
    };
  },
  created() {
    this.getParams();
  },
  components: {
    BizAreaSelect,
    BizAvatarUploaderNew
  },
  methods: {
    getParams() {
      // 邀请Id
      this.investmentId = this.getQueryString('investmentId') || '';
      this.personalId = this.getQueryString('personalId') || '';
      this.companyId = this.getQueryString('companyId') || '';
      if (this.personalId !== '') {
        this.isCreated = false;
        this.getPersonalInfo();
      }

      if (this.companyId !== '') {
        this.isCreated = false;
        this.isFirst = false;
        this.active++;
        this.getCompanyInfo();
      }
    },
    handlePersonImgSuccess(url) {
      this.personal.personImg = url;
    },
    handleIdCartImgFrontSuccess(url) {
      this.personal.idCartImgFront = url;
    },
    handleIdCartImgBackSuccess(url) {
      this.personal.idCartImgBack = url;
    },
    handleBussinessLicenseImgSuccess(url) {
      this.company.bussinessLicenseImg = url;
    },
    areaChanged(areaId) {
      this.personal.areaId = areaId;
    },
    next() {
      if (this.active++ > 2) this.active = 0;
    },
    getQueryString(name) {
      let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
      let r = window.location.search.substr(1).match(reg);
      if (r != null) return unescape(r[2]);
      return null;
    },
    ignorePersonal() {
      this.active++;
      this.isFirst = false;
    },
    onSubmitPersonal() {
      if (this.personal.personImg === '' || this.personal.idCartImgFront === '' || this.personal.idCartImgBack === '') {
        this.$message({
          message: '请上传所需资质照片',
          type: 'warning'
        });
        return;
      }

      this.$refs.personal.validate(valid => {
        if (valid) {
          this.submitPersonal();
        } else {
          return false;
        }
      });
    },
    submitPersonal() {
      let params = {
        name: this.personal.name,
        idCartCode: this.personal.idCartCode,
        personImg: this.personal.personImg,
        idCartImgFront: this.personal.idCartImgFront,
        idCartImgBack: this.personal.idCartImgBack,
        areaId: this.personal.areaId,
        address: this.personal.address,
        mobile: this.personal.mobile,
        shopName: this.personal.shopName,
        majorBusiness: this.personal.majorBusiness,
        remark: this.personal.remark,
        state: this.personal.state
      };

      if (!this.isCreated) {
        params.id = this.personalId;
      } else {
        params.investmentId = this.investmentId;
      }

      let url = this.isCreated ? '/personalInfo/create.jhtml' : '/personalInfo/update.jhtml';

      axios
        .get(url, {
          params: params
        })
        .then(response => {
          if (response.data.resultCode === '100') {
            this.$message({
              message: '恭喜您，个人信息提交成功！',
              type: 'success'
            });

            if (this.isCreated) {
              this.active++;
              this.isFirst = false;
            }
          }

          if ('errorMessage' in response.data) {
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
    onSubmitCompany() {
      if (this.company.bussinessLicenseImg === '') {
        this.$message({
          message: '请填写所需资质照片',
          type: 'warning'
        });
        return;
      }

      this.$refs.company.validate(valid => {
        if (valid) {
          this.submitCompany();
        } else {
          return false;
        }
      });
    },
    submitCompany() {
      let params = {
        name: this.company.name,
        registeredCapital: this.company.registeredCapital,
        bussinessLicenseCode: this.company.bussinessLicenseCode,
        bussinessLicenseImg: this.company.bussinessLicenseImg,
        address: this.company.address,
        bussinessLicenseDue: this.company.bussinessLicenseDue,
        remark: ''
      };

      if (!this.isCreated) {
        params.id = this.companyId;
      } else {
        params.investmentId = this.investmentId;
      }

      let url = this.isCreated ? '/enterpriseInfo/create.jhtml' : '/enterpriseInfo/update.jhtml';

      axios
        .get(url, {
          params: params
        })
        .then(response => {
          if (response.data.resultCode === '100') {
            this.$message({
              message: '恭喜您，企业信息提交成功！',
              type: 'success'
            });
            if (this.isCreated) {
              this.active++;
            }
          }

          if ('errorMessage' in response.data) {
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
    getPersonalInfo() {
      let params = {
        investmentId: this.investmentId
      };
      this.loading = true;
      axios
        .get('/rest/investment/personalInfo.jhtml', {
          params: params
        })
        .then(response => {
          let data = response.data;
          if (response.data.resultCode === '100') {
            this.personal.name = data.content.name;
            this.personal.mobile = data.content.mobile;
            this.personal.idCartCode = data.content.idCartCode;
            this.personal.personImg = data.content.personImg;
            this.personal.idCartImgFront = data.content.idCartImgFront;
            this.personal.idCartImgBack = data.content.idCartImgBack;
            this.personal.areaId = data.content.areaId;
            this.personal.address = data.content.address;
            this.personal.shopName = data.content.shopName;
            this.personal.majorBusiness = data.content.majorBusiness;
            this.personal.remark = data.content.remark;
            this.personal.state = data.content.state;
            this.updateId = data.content.id;
          }

          if ('errorMessage' in response.data) {
            this.$message({
              message: response.data.errorMessage,
              type: 'warning'
            });
          }
          this.loading = false;
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    getCompanyInfo() {
      let params = {
        investmentId: this.investmentId
      };
      this.loading = true;
      axios
        .get('/rest/investment/enterpriseInfo.jhtml', {
          params: params
        })
        .then(response => {
          let data = response.data;
          if (response.data.resultCode === '100') {
            this.company.name = data.content.name;
            this.company.bussinessLicenseCode = data.content.bussinessLicenseCode;
            this.company.bussinessLicenseImg = data.content.bussinessLicenseImg;
            this.company.bussinessLicenseDue = data.content.bussinessLicenseDue;
            this.company.registeredCapital = data.content.registeredCapital;
            this.company.address = data.content.address;
            this.company.remark = data.content.remark;
            this.company.state = data.content.state;
          }
          if ('errorMessage' in response.data) {
            this.$message({
              message: response.data.errorMessage,
              type: 'warning'
            });
          }
          this.loading = false;
        })
        .catch(function(error) {
          console.log(error);
        });
    }
  }
};
</script>

<style lang="scss">
.merchants-mgmt-qua {
  height: 100%;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 100px;
  background-color: #fff;

  .title {
    font-size: 22px;
    margin: 20px 0;
  }

  .el-steps {
    width: 500px;
    margin-bottom: 100px;
  }

  .el-form {
    margin-right: 200px;
    width: 500px;
  }
}
</style>
