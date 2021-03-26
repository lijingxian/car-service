<template>
  <biz-grid class="icon-temp-info" v-loading="loading">
    <biz-save-button slot="top" :operations="operations" @operate="operateHandler" class="save-button">
    </biz-save-button>
    <el-form :rules="rules" :model="form" size="small" ref="form">
      <el-form-item label="承诺名称：" prop="name">
        <el-input placeholder="请输入承诺名称" v-model="form.name" class="input-nomal-width"></el-input>
      </el-form-item>
      <el-form-item label="承诺图标：" prop="icon">
        <biz-avatar-uploader-new v-model="form.icon">
        </biz-avatar-uploader-new>
      </el-form-item>
      <el-form-item label="承诺描述：">
        <el-input placeholder="请输入承诺描述" v-model="form.description" type="textarea" :autosize="{ minRows: 4, maxRows: 8}" class="input-nomal-width"></el-input>
      </el-form-item>
    </el-form>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import BizSaveButton from '@/components/BizSaveButton';
import { BizAvatarUploaderNew } from '@/components/BizForm';
import http from '@/common/http';
import urls from '@/common/urls';

export default {
  name: 'icon-temp-info',
  data() {
    let checkIcon = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请上传承诺图标'));
      }
      return callback();
    };
    return {
      loading: false,
      operations: [
        {
          label: '保存',
          name: 'save',
          type: 'primary'
        }
      ],
      form: {
        name: '',
        icon: '',
        description: ''
      },
      rules: {
        name: [{ required: true, message: '请输入承诺名称', trigger: 'blur' }],
        icon: [{ required: true, validator: checkIcon, trigger: 'blur' }]
      }
    };
  },
  props: {
    itemId: {
      type: String,
      default() {
        return '';
      }
    }
  },
  components: { BizSaveButton, BizGrid, BizAvatarUploaderNew },
  computed: {
    templateIcon() {
      return this.form.icon;
    }
  },
  watch: {
    templateIcon() {
      this.$refs.form.validate();
    },
    itemId(newValue, oldValue) {
      console.log('id', newValue);
      if (newValue) {
        this.getInfo();
      } else {
        this.clearInfo();
      }
    }
  },
  methods: {
    operateHandler() {
      this.$refs.form.validate(valid => {
        console.log(this.itemId);
        if (valid) {
          if (this.itemId) {
            this.updateInfo();
          } else {
            this.addInfo();
          }
        } else {
          return false;
        }
      });
    },
    clearInfo() {
      this.form.name = '';
      this.form.icon = '';
      this.form.description = '';
    },
    getInfo() {
      this.loading = true;
      let param = {
        id: this.itemId
      };

      http
        .get(urls.systemSetting.createPromise, param)
        .then(data => {
          let curData = data.data;
          this.loading = false;
          this.form.name = curData.name;
          this.form.icon = curData.icon;
          this.form.description = curData.description;
        })
        .catch(error => {
          this.loading = false;
          this.$message({
            title: '警告',
            message: error.errorMessage,
            type: 'warning'
          });
        })
        .finally(() => {});
    },
    updateInfo() {
      this.loading = true;
      let param = {
        id: this.itemId,
        name: this.form.name,
        description: this.form.description,
        icon: this.form.icon
      };

      http
        .put(urls.systemSetting.createPromise, param)
        .then(data => {
          this.loading = false;
          this.$message({
            title: '成功',
            message: '更新成功',
            type: 'success'
          });
          this.$emit('operationSuccess');
        })
        .catch(error => {
          this.loading = false;
          this.$message({
            title: '警告',
            message: error.errorMessage,
            type: 'warning'
          });
        })
        .finally(() => {});
    },
    addInfo() {
      console.log('123');
      this.loading = true;
      let param = {
        name: this.form.name,
        description: this.form.description,
        icon: this.form.icon
      };

      http
        .post(urls.systemSetting.createPromise, param)
        .then(data => {
          this.loading = false;
          this.$message({
            title: '成功',
            message: '创建成功',
            type: 'success'
          });
          this.$emit('operationSuccess');
        })
        .catch(error => {
          this.loading = false;
          this.$message({
            title: '警告',
            message: error.errorMessage,
            type: 'warning'
          });
        })
        .finally(() => {});
    }
  }
};
</script>

<style lang="scss">
.icon-temp-info {
  .biz-save-button {
    justify-content: flex-start;
  }
  .save-button {
    margin-top: 10px;
  }
  .el-input {
    width: 40%;
  }
  .el-form {
    height: 100%;
    overflow: auto;
    padding: 10px;
    margin-top: 0px;
    margin-left: 0%;
  }
  .el-form-item__label {
    vertical-align: middle;
    float: left;
    padding: 0 12px 0 0;
    width: 100px;
    text-align: right;
  }
  .input-picture-setting {
    width: 100px;
  }
  .input-nomal-width {
    width: 360px;
  }
}
</style>
