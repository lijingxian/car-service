<template>
  <biz-grid class="cs-reply-setting">
    <biz-save-button slot="top" :operations="operations" @operate="operate"></biz-save-button>
    <el-form ref="form" :rules="rules" size="small" :model="form" label-position="left" label-width="110px" :inline-message="true">
      <el-form-item label="欢迎语" prop="welcom">
        <el-input placeholder="请输入欢迎语" type="textarea" :rows="2" v-model="form.welcom"></el-input>
      </el-form-item>
      <el-form-item label="默认回复" prop="hello">
        <el-input placeholder="请输入默认回复" type="textarea" :rows="2" v-model="form.hello"></el-input>
      </el-form-item>
      <el-form-item label="重复回复" prop="replying">
        <el-input placeholder="请输入重复回复" type="textarea" :rows="2" v-model="form.replying"></el-input>
      </el-form-item>
    </el-form>
  </biz-grid>
</template>
<script>
import BizSaveButton from '@/components/BizSaveButton';
import { BizGrid } from '@/components/BizGrid';
import RobotService from '@/service/customer-service/robot/robot';

export default {
  name: 'ReplySetting',
  data() {
    return {
      operations: [{ label: '保存', name: 'save', type: 'primary', auth: ['admin:knowledgeBase.edit'] }],
      form: {
        hello: '',
        replying: '',
        welcom: ''
      },
      rules: {
        welcom: [
          { required: true, message: '请输入欢迎语', trigger: 'blur' },
          { min: 0, max: 100, message: '长度在 100个字符之内', trigger: 'blur' }
        ],
        hello: [
          { required: true, message: '请输入默认回复', trigger: 'blur' },
          { min: 0, max: 100, message: '长度在 100个字符之内', trigger: 'blur' }
        ],
        replying: [
          { required: true, message: '请输入重复回复', trigger: 'blur' },
          { min: 0, max: 100, message: '长度在 100个字符之内', trigger: 'blur' }
        ]
      }
    };
  },
  components: { BizGrid, BizSaveButton },
  created() {
    this.getReplySetting();
  },
  mounted() {
    this.$message({
      showClose: true,
      message: '对接入的机器人进行欢迎语、默认回复、重复回复的语句设置',
      type: 'info'
    });
  },
  methods: {
    operate(name) {
      this[name]();
    },
    save() {
      this.$refs.form.validate(valid => {
        if (!valid) {
          return;
        }
        let params = {
          hello: this.form.hello,
          replying: this.form.replying,
          welcom: this.form.welcom
        };
        RobotService.saveReplySetting(
          params,
          data => {
            this.$message({
              type: 'success',
              message: '保存成功!'
            });
            this.getReplySetting();
          },
          ErrorData => {
            console.log(ErrorData);
            this.$message.warning(ErrorData.errorMessage);
          }
        );
      });
    },
    getReplySetting() {
      let params = {
        shopId: window.top.SHOP_ID || ''
      };
      RobotService.getReplySetting(
        params,
        data => {
          this.form.hello = data.data.hello;
          this.form.replying = data.data.replying;
          this.form.welcom = data.data.welcom;
        },
        ErrorData => {
          console.log(ErrorData);
        }
      );
    }
  }
};
</script>

<style lang="scss">
.cs-reply-setting {
  padding-top: 20px;
  .biz-save-button {
    justify-content: flex-start;
  }
  .el-form--label-left .el-form-item__label {
    text-align: right;
  }
}
</style>
