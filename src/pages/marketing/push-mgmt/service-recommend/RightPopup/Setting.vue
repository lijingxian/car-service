<template>
  <biz-grid class="setting" v-loading="loading">
    <biz-save-button slot="top" :operations="operations" @operate="handleOperate"></biz-save-button>
    <el-form ref="form" size="small" label-width="150px" :model="formModel" :rules="rules" :inline-message="true">
      <el-form-item label="账号" prop="thirdPartAccount">
        <el-input v-model="formModel.thirdPartAccount" placeholder="请输入账号"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="thirdPartPassword">
        <el-input v-model="formModel.thirdPartPassword" placeholder="请输入密码"></el-input>
      </el-form-item>
      <el-form-item label="账户ID" prop="thirdPartId">
        <el-input v-model="formModel.thirdPartId" placeholder="请输入账户ID"></el-input>
      </el-form-item>
      <el-form-item label="APPID" prop="appId" v-if="this.thirdType==='0'">
        <el-input v-model="formModel.appId" placeholder="请输APPID"></el-input>
      </el-form-item>
      <el-form-item label="Secret" prop="appSecret" v-if="this.thirdType==='0'">
        <el-input v-model="formModel.appSecret" placeholder="请输入Secret"></el-input>
      </el-form-item>
      <el-form-item label="Access Key Id" prop="ak" v-if="this.thirdType==='1'">
        <el-input v-model="formModel.ak" placeholder="请输入Access Key Id"></el-input>
      </el-form-item>
      <el-form-item label="Secret Access Key" prop="sk" v-if="this.thirdType==='1'">
        <el-input v-model="formModel.sk" placeholder="请输入Secret Access Key"></el-input>
      </el-form-item>
      <el-form-item label="API权限代码" prop="appSecret" v-if="this.thirdType==='2'||this.thirdType==='1'">
        <el-input v-model="formModel.appSecret" placeholder="请输入API权限代码"></el-input>
      </el-form-item>
    </el-form>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import BizSaveButton from '@/components/BizSaveButton';

import http from '@/common/http';
import { mapGetters } from 'vuex';

// 初始化时需要的一些数据
const initData = {
  operations: [
    {
      label: '保存',
      name: 'save',
      type: 'primary'
    }
  ]
};

// 获取默认表单项
const getDefaultModel = () => {
  return {
    id: '',
    type: '',
    name: '',
    thirdPartAccount: '',
    thirdPartPassword: '',
    thirdPartId: '',
    appSecret: '',
    appId: '',
    accessToken: '',
    expiresIn: '',
    refreshToken: '',
    refreshTokenExpiresIn: '',
    ak: '',
    sk: ''
  };
};
// 表单相关信息
const formData = {
  data: {
    loading: false,
    formModel: getDefaultModel()
  },
  events: {
    handleOperate(name) {
      this[name]();
    }
  },
  methods: {
    initModel(model) {
      if (model) {
        this.formModel = Object.assign(this.getDefaultModel(), model);
      } else {
        this.resetModel();
      }

      this.$refs.form.resetFields();
    },
    query(thirdType) {
      this.loading = true;
      http
        .get('/admin/thirdPartAccount/thirdPartAccountInfoList.jhtml', {
          type: thirdType
        })
        .then(data => {
          // 列表
          this.initModel(data.datas[0]);
          this.loading = false;
        })
        .catch(errData => {
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
          this.loading = false;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    resetModel() {
      this.formModel = this.getDefaultModel();
    },
    getDefaultModel() {
      return getDefaultModel();
    },

    getSaveParams() {
      return {
        id: this.formModel.id,
        type: this.thirdType,
        name: this.formModel.name,
        thirdPartAccount: this.formModel.thirdPartAccount,
        thirdPartPassword: this.formModel.thirdPartPassword,
        thirdPartId: this.formModel.thirdPartId,
        appSecret: this.formModel.appSecret,
        appId: this.formModel.appId,
        accessToken: this.formModel.accessToken,
        expiresIn: this.formModel.expiresIn,
        refreshToken: this.formModel.refreshToken,
        refreshTokenExpiresIn: this.formModel.refreshTokenExpiresIn,
        ak: this.formModel.ak,
        sk: this.formModel.sk
      };
    },

    save() {
      this.$refs.form.validate((valid, a) => {
        if (valid) {
          this.loading = true;
          const success = data => {
            this.$message.success('保存成功');
            if (!this.formModel.id) {
              this.formModel.id = data.id;
            }
            this.$emit('operationSuccess', this.formModel.id);
            this.loading = false;
          };
          const failed = errData => {
            if (errData.errorMessage) this.$message.warning(errData.errorMessage);
            this.loading = false;
          };
          const final = data => {
            this.loading = false;
          };

          if (this.formModel.id) {
            http
              .put('/admin/thirdPartAccount/thirdPartAccountInfo.jhtml', this.getSaveParams())
              .then(success)
              .catch(failed)
              .finally(final);
          } else {
            http
              .post('/admin/thirdPartAccount/thirdPartAccountInfo.jhtml', this.getSaveParams())
              .then(success)
              .catch(failed)
              .finally(final);
          }
        } else {
          return false;
        }
      });
    }
  }
};

export default {
  name: 'Setting',
  components: {
    BizSaveButton,
    BizGrid
  },
  data() {
    return {
      ...initData,
      ...formData.data,

      rules: {
        thirdPartAccount: [{ required: true, message: '请输入账户', trigger: 'blur' }],
        thirdPartPassword: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        thirdPartId: [{ required: true, message: '请输入账户ID', trigger: 'blur' }],
        appId: [{ required: true, message: '请输入APPID', trigger: 'blur' }],
        appSecret: [{ required: true, message: '请输入Secret', trigger: 'blur' }],
        ak: [{ required: true, message: '请输入Access Key Id', trigger: 'blur' }],
        sk: [{ required: true, message: '请输入Secret Access Key', trigger: 'blur' }]
      }
    };
  },
  props: {
    thirdType: {
      type: String
    }
  },
  methods: {
    ...mapGetters(['getUser']),

    ...formData.methods,
    ...formData.events
  },
  watch: {},
  created() {}
};
</script>

<style lang="scss">
.setting {
  padding-top: 20px;
  .biz-save-button {
    justify-content: flex-start;
  }
  .biz-scroller {
    .el-checkbox-group {
      .el-checkbox {
        margin-right: 30px;

        &:last-child {
          margin-right: 0;
        }
      }
      .el-checkbox + .el-checkbox {
        margin-left: 0;
      }
    }

    .golden-cudgel {
      transition: height 0.3s;
      height: 518px;
      overflow: hidden;

      &.collapsed {
        height: 32px;
      }
    }
  }
}
</style>
