<template>
  <biz-grid class="system-setting-mgmt" v-loading="loading">
    <el-tabs v-model="activeTabName" type="card">
      <el-tab-pane label="基本设置" name="basicSetting">
        <BasicSetting @loadingNotification="loadingNotification"></BasicSetting>
      </el-tab-pane>
      <el-tab-pane label="显示设置" name="displaySetting">
        <DisplaySetting></DisplaySetting>
      </el-tab-pane>
      <el-tab-pane label="注册与安全" name="registrationAndSecurity">
        <RegistrationAndSecuritySetting></RegistrationAndSecuritySetting>
      </el-tab-pane>
      <el-tab-pane label="邮件设置" name="emailSetting">
        <EmailSetting></EmailSetting>
      </el-tab-pane>
      <el-tab-pane label="其他设置" name="otherSetting">
        <OtherSetting></OtherSetting>
      </el-tab-pane>
    </el-tabs>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import BasicSetting from './BasicSetting';
import DisplaySetting from './DisplaySetting';
import RegistrationAndSecuritySetting from './RegistrationAndSecuritySetting';
import EmailSetting from './EmailSetting';
import OtherSetting from './OtherSetting';

export default {
  name: 'SystemSettingMgmt',
  data() {
    return {
      loading: false,
      activeTabName: 'basicSetting'
    };
  },
  components: {
    BizGrid,
    BasicSetting,
    DisplaySetting,
    RegistrationAndSecuritySetting,
    EmailSetting,
    OtherSetting
  },
  created() {},
  mounted() {},
  methods: {
    loadingNotification(val) {
      this.loading = val;
    }
  }
};
</script>

<style lang="scss">
.system-setting-mgmt {
  .biz-customcol {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    .el-button {
      margin-right: 10px;
    }
  }
  .delete-btn {
    color: red;
  }
  .selection-column {
    text-align: center;
  }
  .el-tabs--card > .el-tabs__header .el-tabs__nav {
    background-color: #fef3e5;
  }
  .el-tabs__item.is-active {
    color: #ff7300;
    background-color: #fff;
  }
}
</style>
