<template>
  <biz-grid class="system-setting-mgmt" v-loading="loading">
    <div slot="top" class="header-button">
      <biz-header :operations="operations" @operate="operate">
      </biz-header>
    </div>
    <div class="basic-setting">
      <el-form ref="form" :rules="rules" :model="form" size="small">
        <el-form-item label="网站名称：" prop="siteName">
          <el-input placeholder="请输入网站名称" v-model="form.siteName" class="input-nomal-width"></el-input>
        </el-form-item>
        <el-form-item label="网站网址：" prop="siteUrl">
          <el-input placeholder="请输入网站网址" v-model="form.siteUrl" class="input-nomal-width"></el-input>
        </el-form-item>
        <el-form-item label="Logo：" prop="logo">
          <biz-avatar-uploader-new v-model="form.logo">
          </biz-avatar-uploader-new>
        </el-form-item>
        <el-form-item label="热门搜索：" prop="hotSearch">
          <el-input placeholder="请输入热门搜索" v-model="form.hotSearch" class="input-nomal-width"></el-input>
        </el-form-item>
        <el-form-item label="平台简介：" prop="introduction">
          <el-input placeholder="请输入平台简介消息" v-model="form.introduction" class="input-nomal-width" type="textarea" :autosize="{ minRows: 4, maxRows: 8}"></el-input>
        </el-form-item>
        <el-form-item label="为您服务：" prop="service">
          <el-input placeholder="请输入为您服务消息" v-model="form.service" class="input-nomal-width" type="textarea" :autosize="{ minRows: 4, maxRows: 8}"></el-input>
        </el-form-item>
        <el-form-item label="热线：" prop="phone">
          <el-input placeholder="请输入热线" v-model="form.phone" class="input-nomal-width"></el-input>
        </el-form-item>
        <el-form-item label="联系地址：" prop="address">
          <el-input placeholder="请输入联系地址" v-model="form.address" class="input-nomal-width"></el-input>
        </el-form-item>
        <el-form-item label="邮政编码：" prop="zipCode">
          <el-input placeholder="请输入邮政编码" v-model="form.zipCode" class="input-nomal-width"></el-input>
        </el-form-item>
        <el-form-item label="E-mail：" prop="email">
          <el-input placeholder="请输入E-mail" v-model="form.email" class="input-nomal-width"></el-input>
        </el-form-item>
        <el-form-item label="备案编号：" prop="certtext">
          <el-input placeholder="请输入备案编号" v-model="form.certtext" class="input-nomal-width"></el-input>
        </el-form-item>
        <el-form-item label="是否网站开启：" prop="isSiteEnabled">
          <el-radio v-model="form.isSiteEnabled" label="true">是</el-radio>
          <el-radio v-model="form.isSiteEnabled" label="false">否</el-radio>
        </el-form-item>
        <el-form-item label="网站关闭消息：" prop="siteCloseMessage">
          <el-input placeholder="请输入网站关闭消息" v-model="form.siteCloseMessage" class="input-nomal-width" type="textarea" :autosize="{ minRows: 8, maxRows: 8}"></el-input>
        </el-form-item>
      </el-form>
    </div>
  </biz-grid>
</template>

<script>
import { BizAvatarUploaderNew } from '@/components/BizForm';
import { BizHeader } from '@/components/BizTable';
import { BizGrid } from '@/components/BizGrid';
import http from '@/common/http';
import urls from '@/common/urls';

export default {
  name: 'BasicSetting',
  data() {
    return {
      operations: [
        {
          label: '保存',
          name: 'save',
          type: 'primary'
        }
      ],
      loading: false,
      form: {
        siteName: '',
        siteUrl: '',
        logo: '',
        hotSearch: '',
        introduction: '',
        service: '',
        address: '',
        phone: '',
        zipCode: '',
        email: '',
        certtext: '',
        isSiteEnabled: 'false',
        siteCloseMessage: ''
      },
      rules: {
        siteName: [{ required: true, message: '请输入网站名称', trigger: 'focus' }],
        siteUrl: [{ required: true, message: '请输入网站地址', trigger: 'focus' }],
        logo: [{ required: true, message: '请输入Logo图片', trigger: 'focus' }],
        siteCloseMessage: [{ required: true, message: '请输入网站关闭消息', trigger: 'focus' }]
      }
    };
  },
  components: {
    BizHeader,
    BizAvatarUploaderNew,
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
        } else {
          return false;
        }
      });
    },
    refresh() {
      let params = {
        type: '0'
      };

      http
        .get(urls.systemSetting.settings, params)
        .then(data => {
          console.log('基本设置', data);
          this.form.service = data.settingList !== undefined ? data.settingList.service : '';
          this.form.introduction = data.settingList !== undefined ? data.settingList.introduction : '';
          this.form.siteName = data.settingList !== undefined ? data.settingList.siteName : '';
          this.form.siteUrl = data.settingList !== undefined ? data.settingList.siteUrl : '';
          this.form.logo = data.settingList !== undefined ? data.settingList.logo : '';
          this.form.hotSearch = data.settingList !== undefined ? data.settingList.hotSearch : '';
          this.form.address = data.settingList !== undefined ? data.settingList.address : '';
          this.form.phone = data.settingList !== undefined ? data.settingList.phone : '';
          this.form.zipCode = data.settingList !== undefined ? data.settingList.zipCode : '';
          this.form.email = data.settingList !== undefined ? data.settingList.email : '';
          this.form.certtext = data.settingList !== undefined ? data.settingList.certtext : '';
          this.form.isSiteEnabled = data.settingList !== undefined ? data.settingList.isSiteEnabled : '';
          this.form.siteCloseMessage = data.settingList !== undefined ? data.settingList.siteCloseMessage : '';
        })
        .catch(() => {})
        .finally(() => {});
    },
    update() {
      let params = {
        service: this.form.service,
        introduction: this.form.introduction,
        siteName: this.form.siteName,
        siteUrl: this.form.siteUrl,
        logo: this.form.logo,
        hotSearch: this.form.hotSearch,
        address: this.form.address,
        phone: this.form.phone,
        zipCode: this.form.zipCode,
        email: this.form.email,
        certtext: this.form.certtext,
        isSiteEnabled: this.form.isSiteEnabled,
        siteCloseMessage: this.form.siteCloseMessage
      };

      http
        .put(urls.systemSetting.querySystemSetting, params)
        .then(data => {
          this.$message({
            title: '成功',
            message: '更新成功',
            type: 'success'
          });
          this.$emit('refreshNotification');
        })
        .catch(error => {
          this.$message({
            title: '警告',
            message: error.errorMessage,
            type: 'warning'
          });
        })
        .finally(() => {});
    },
    clearFormData() {
      this.form.siteName = '';
      this.form.siteUrl = '';
      this.form.logo = '';
      this.form.hotSearch = '';
      this.form.address = '';
      this.form.phone = '';
      this.form.zipCode = '';
      this.form.email = '';
      this.form.certtext = '';
      this.form.isSiteEnabled = 'false';
      this.form.siteCloseMessage = '';
    }
  }
};
</script>

<style lang="scss">
.basic-setting {
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
