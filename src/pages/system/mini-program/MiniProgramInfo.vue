<template>
  <biz-grid class="insurance-company-info">
    <biz-save-button slot="top" :operations="operations" @operate="operate">
    </biz-save-button>
    <el-form ref="form" :rules="rules" :model="form" label-width="120px" size="small">
      <el-form-item label="小程序名称：" prop="name">
        <el-input placeholder="请输入公司名称" v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="AppID：" prop="appId">
        <el-input placeholder="请输入AppID" v-model="form.appId"></el-input>
      </el-form-item>
      <el-form-item label="AppSecret：" prop="appSecret">
        <el-input placeholder="请输入AppSecret" v-model="form.appSecret"></el-input>
      </el-form-item>
      <el-form-item label="小程序码图片" prop="qrCodePath">
        <BizAvatarUploaderNew v-model="form.qrCodePath">
        </BizAvatarUploaderNew>
      </el-form-item>
      <el-form-item label="备注" prop="comment">
        <el-input placeholder="请输入备注" v-model="form.comment"></el-input>
      </el-form-item>
    </el-form>
  </biz-grid>
</template>

<script>
import BizSaveButton from '@/components/BizSaveButton';
import { BizGrid } from '@/components/BizGrid';
import http from '@/common/http';
export default {
  name: 'MiniProgramInfo',
  data() {
    return {
      operations: [
        {
          label: '保存',
          name: 'save',
          type: 'primary'
        }
      ],
      form: this.getDefaultModel(),
      rules: {
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        appId: [{ required: true, message: '请输入AppID', trigger: 'blur' }],
        appSecret: [{ required: true, message: '请输入AppSecret', trigger: 'blur' }]
      },
      editorStyle: {
        height: '190px',
        width: '350px'
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
    id(Val) {
      if (this.open === true) {
        this.refresh();
      }
    },
    open(val) {
      if (!val) {
        this.form = this.getDefaultModel();
      } else {
        this.$refs.form.clearValidate();
        if (this.id === '') {
          this.refresh();
        }
      }
    }
  },
  created() {},
  computed: {},
  methods: {
    operate(name) {
      this[name]();
    },
    uploadSuccess() {
      this.$refs.form.clearValidate('qrCodePath');
    },
    save() {
      this.$refs.form.validate(valid => {
        if (valid) {
          if (this.id === '') {
            this.add();
          } else {
            this.update();
          }
        } else {
          return false;
        }
      });
    },
    refresh() {
      let params = {
        id: this.id
      };
      http
        .get('/admin/wechatMiniProgram/queryById.jhtml', params)
        .then(data => {
          this.form = Object.assign(this.getDefaultModel(), data.data);
        })
        .catch(errData => {
          console.log(errData);
          console.log('code错误');
          // if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    add() {
      http
        .post('/admin/wechatMiniProgram/create.jhtml', this.form)
        .then(data => {
          this.$message.success('操作成功');
          this.$emit('refreshNotification');
          this.$emit('addSuccessNotification', data.id);
        })
        .catch(errData => {
          console.log(errData);
          console.log('code错误');
          // if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    update() {
      http
        .put('/admin/wechatMiniProgram/update.jhtml', this.form)
        .then(data => {
          this.$message.success('操作成功');
          this.$emit('refreshNotification');
          this.$emit('addSuccessNotification', data.id);
        })
        .catch(errData => {
          console.log(errData);
          console.log('code错误');
          // if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    getDefaultModel() {
      return {
        name: '',
        appId: '',
        appSecret: '',
        qrCodePath: '',
        comment: ''
      };
    }
  }
};
</script>

<style lang="scss">
.insurance-company-info {
  .biz-save-button {
    margin-top: 5px;
    justify-content: flex-start;
  }
  .el-input {
    width: 50%;
  }
}
</style>
