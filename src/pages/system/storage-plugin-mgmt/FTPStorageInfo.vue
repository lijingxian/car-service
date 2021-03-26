<template>
  <biz-grid class="ftp-storage-info">
    <biz-save-button slot="top" :operations="operations" @operate="operate">
    </biz-save-button>
    <el-form ref="form" :rules="rules" :model="form" label-width="120px" size="small">
      <el-form-item label="FTP主机：" prop="host">
        <el-input placeholder="请输入FTP主机" v-model="form.host"></el-input>
      </el-form-item>
      <el-form-item label="FTP端口：" prop="port">
        <el-input placeholder="请输入FTP端口" v-model="form.port"></el-input>
      </el-form-item>
      <el-form-item label="用户名：" prop="username">
        <el-input placeholder="请输入用户名" v-model="form.username"></el-input>
      </el-form-item>
      <el-form-item label="密码：" prop="password">
        <el-input placeholder="请输入密码" v-model="form.password"></el-input>
      </el-form-item>
      <el-form-item label="URL前缀：" prop="urlPrefix">
        <el-input placeholder="请输入URL前缀" v-model="form.urlPrefix"></el-input>
      </el-form-item>
      <el-form-item label="排序：" prop="order">
        <el-input placeholder="请输入排序" v-model="form.order"></el-input>
      </el-form-item>
      <el-form-item label="启用：" prop="isEnabled">
        <el-switch v-model="form.isEnabled" inactive-color="#d9d9d9"  active-color="#87d068"></el-switch>
      </el-form-item>
    </el-form>
  </biz-grid>
</template>

<script>
import BizSaveButton from '@/components/BizSaveButton';
import { BizGrid } from '@/components/BizGrid';
import Service from '@/service/system-setting/storage-plugin-mgmt/storagePluginMgmt';

export default {
  name: 'FTPStorageInfo',
  data() {
    return {
      operations: [
        {
          label: '保存',
          name: 'save',
          type: 'primary'
        }
      ],
      form: {
        host: '',
        port: '',
        username: '',
        password: '',
        urlPrefix: '',
        order: '',
        isEnabled: false
      },
      rules: {
        host: [{ required: true, message: '请输入FTP主机', trigger: 'focus' }],
        port: [{ required: true, message: '请输入FTP端口', trigger: 'focus' }],
        username: [
          { required: true, message: '请输入用户名', trigger: 'focus' }
        ],
        urlPrefix: [
          { required: true, message: '请输入URL前缀', trigger: 'focus' }
        ]
      }
    };
  },
  components: {
    BizSaveButton,
    BizGrid
  },
  props: {
    id: {
      type: String,
      default: ''
    },
    open: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    open(val) {
      if (!val) {
        this.clearFormData();
      } else {
        this.refresh();
      }
    }
  },
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
        id: this.id
      };
      Service.query(
        params,
        data => {
          this.form.order =
            data.pluginConfig !== undefined ? data.pluginConfig.order : '';
          this.form.isEnabled =
            data.pluginConfig !== undefined
              ? data.pluginConfig.isEnabled === 'true'
              : false;
          this.form.host =
            data.pluginConfig !== undefined
              ? data.pluginConfig.attributes !== undefined
                ? data.pluginConfig.attributes.host
                : ''
              : '';
          this.form.port =
            data.pluginConfig !== undefined
              ? data.pluginConfig.attributes !== undefined
                ? data.pluginConfig.attributes.port
                : ''
              : '';
          this.form.username =
            data.pluginConfig !== undefined
              ? data.pluginConfig.attributes !== undefined
                ? data.pluginConfig.attributes.username
                : ''
              : '';
          this.form.password =
            data.pluginConfig !== undefined
              ? data.pluginConfig.attributes !== undefined
                ? data.pluginConfig.attributes.password
                : ''
              : '';
          this.form.urlPrefix =
            data.pluginConfig !== undefined
              ? data.pluginConfig.attributes !== undefined
                ? data.pluginConfig.attributes.urlPrefix
                : ''
              : '';
        },
        ErrorData => {
          console.log(ErrorData);
        }
      );
    },
    update() {
      let params = {
        id: this.id,
        host: this.form.host,
        port: this.form.port,
        username: this.form.username,
        password: this.form.password,
        urlPrefix: this.form.urlPrefix,
        isEnabled: this.form.isEnabled,
        order: this.form.order
      };
      Service.update(
        params,
        data => {
          this.$message.success('操作成功');
          this.$emit('refreshNotification');
        },
        ErrorData => {
          this.$message.warning(ErrorData.errorMessage);
        }
      );
    },
    clearFormData() {
      this.form.host = '';
      this.form.port = '';
      this.form.username = '';
      this.form.password = '';
      this.form.urlPrefix = '';
      this.form.order = '';
      this.form.isEnabled = false;
    },
    getDefaultDeliveryCorps() {
      return [
        {
          id: '',
          name: ''
        }
      ];
    }
  }
};
</script>

<style lang="scss">
.ftp-storage-info {
  .biz-save-button {
    margin-top: 5px;
    justify-content: flex-start;
  }
  .el-input {
    width: 50%;
  }
}
</style>
