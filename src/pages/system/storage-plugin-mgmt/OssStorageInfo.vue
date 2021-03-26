<template>
  <biz-grid class="oss-storage-info">
    <biz-save-button slot="top" :operations="operations" @operate="operate">
    </biz-save-button>
    <el-form ref="form" :rules="rules" :model="form" label-width="120px" size="small">
      <el-form-item label="ACCESS ID：" prop="accessId">
        <el-input placeholder="请输入ACCESS ID" v-model="form.accessId"></el-input>
      </el-form-item>
      <el-form-item label="ACCESS KEY：" prop="accessKey">
        <el-input placeholder="请输入ACCESS KEY" v-model="form.accessKey"></el-input>
      </el-form-item>
      <el-form-item label="BUCKET名称：" prop="bucketName">
        <el-input placeholder="请输入BUCKET名称" v-model="form.bucketName"></el-input>
      </el-form-item>
      <el-form-item label="URL前缀：" prop="urlPrefix">
        <el-input placeholder="请输入URL前缀" v-model="form.urlPrefix"></el-input>
      </el-form-item>
      <el-form-item label="排序：" prop="order">
        <el-input placeholder="请输入排序" v-model="form.order"></el-input>
      </el-form-item>
      <el-form-item label="启用：" prop="isEnabled">
        <el-switch v-model="form.isEnabled"  active-color="#87d068" inactive-color="#d9d9d9"></el-switch>
      </el-form-item>
    </el-form>
  </biz-grid>
</template>

<script>
import BizSaveButton from '@/components/BizSaveButton';
import { BizGrid } from '@/components/BizGrid';
import Service from '@/service/system-setting/storage-plugin-mgmt/storagePluginMgmt';

export default {
  name: 'OssStorageInfo',
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
        accessId: '',
        accessKey: '',
        bucketName: '',
        urlPrefix: '',
        order: '',
        isEnabled: false
      },
      rules: {
        accessId: [
          { required: true, message: '请输入ACCESS ID', trigger: 'focus' }
        ],
        accessKey: [
          { required: true, message: '请输入ACCESS KEY', trigger: 'focus' }
        ],
        bucketName: [
          { required: true, message: '请输入BUCKET名称', trigger: 'focus' }
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
          this.form.accessId =
            data.pluginConfig !== undefined
              ? data.pluginConfig.attributes !== undefined
                ? data.pluginConfig.attributes.accessId
                : ''
              : '';
          this.form.accessKey =
            data.pluginConfig !== undefined
              ? data.pluginConfig.attributes !== undefined
                ? data.pluginConfig.attributes.accessKey
                : ''
              : '';
          this.form.bucketName =
            data.pluginConfig !== undefined
              ? data.pluginConfig.attributes !== undefined
                ? data.pluginConfig.attributes.bucketName
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
        accessId: this.form.accessId,
        accessKey: this.form.accessKey,
        bucketName: this.form.bucketName,
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
      this.form.accessId = '';
      this.form.accessKey = '';
      this.form.bucketName = '';
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
.oss-storage-info {
  .biz-save-button {
    margin-top: 5px;
    justify-content: flex-start;
  }
  .el-input {
    width: 50%;
  }
}
</style>
