<template>
  <biz-grid class="test-drive-agreement">
    <biz-save-button slot="top" :operations="operations" @operate="operate">
    </biz-save-button>
    <el-form ref="form" :rules="rules" :model="form" label-width="100px" size="small" v-loading="loading">
      <el-form-item label="体验协议" prop="protocol">
        <BizAvatarUploaderNew v-model="form.protocol">
        </BizAvatarUploaderNew>
      </el-form-item>
    </el-form>
  </biz-grid>
</template>

<script>
import BizSaveButton from '@/components/BizSaveButton';
import { BizGrid } from '@/components/BizGrid';
import { BizAvatarUploaderNew } from '@/components/BizForm';
import http from '@/common/http';
export default {
  name: 'TestDriveAgreement',
  data() {
    return {
      isCreated: true,
      loading: false,
      list: [],
      operations: [
        {
          label: '保存',
          name: 'save',
          type: 'primary',
          auth: ['admin:testdriveManagment.edit']
        }
      ],
      form: {
        id: '',
        protocol: ''
      },
      rules: {
        protocol: [{ required: true, message: '请上传体验协议', trigger: 'blur' }]
      }
    };
  },
  props: {
    open: {
      type: Boolean,
      default() {
        return false;
      }
    }
  },
  components: { BizSaveButton, BizGrid, BizAvatarUploaderNew },
  created() {},
  computed: {},
  watch: {
    open(newVal, oldVal) {
      if (newVal) {
        this.query();
        this.$refs.form.clearValidate();
      }
    }
  },
  methods: {
    operate(name) {
      this[name]();
    },
    query() {
      http
        .get('/admin/order/testDrive/protocol.jhtml', { shopId: window.top.SHOP_ID || '' })
        .then(data => {
          this.form = Object.assign({}, data.content);
        })
        .catch(errData => {
          console.log(errData);
          console.log('code错误');
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        });
    },
    save() {
      this.$refs.form.validate(valid => {
        if (valid) {
          http
            .post('/admin/order/testDrive/protocol.jhtml', this.form)
            .then(data => {
              this.$message.success('保存成功');
            })
            .catch(errData => {
              console.log(errData);
              console.log('code错误');
              if (errData.errorMessage) this.$message.warning(errData.errorMessage);
            });
        } else {
          return false;
        }
      });
    },
    handleUploadSuccess(url) {
      this.form.protocol = url;
      this.$refs.form.clearValidate(['protocol']);
    }
  }
};
</script>

<style lang="scss">
.test-drive-agreement {
  .el-form {
    margin-top: 40px;
  }
  .biz-save-button {
    margin-top: 5px;
    justify-content: flex-start;
  }
  .el-autocomplete {
    width: 80%;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
}
</style>
