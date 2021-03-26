<template>
  <biz-grid class="recall-words">
    <biz-save-button slot="top" :operations="operations" @operate="operate">
    </biz-save-button>
    <el-form :rules="rules" :model="form" ref="form" label-width="120px" size="small" v-loading="loading" :inline-message="true">
      <el-form-item label="通用开场语音" prop="commonOpeningRemarks">
        <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 8}" v-model="form.commonOpeningRemarks" placeholder="我是您的销售经理小V，我可以为您介绍在售车型、最新优惠，还能预约体验、对比车型，我可是个小百科，你也可以随时对我说：你好小V 唤醒我哦"></el-input>
      </el-form-item>
      <el-form-item label="会员开场语音" prop="memberOpeningRemarks">
        <el-input type="textarea" v-model="form.memberOpeningRemarks" placeholder="欢迎（会员昵称）再次到店，请问这次需要什么帮助？"></el-input>
      </el-form-item>
    </el-form>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import BizSaveButton from '@/components/BizSaveButton';
import http from '@/common/http';
export default {
  name: 'QaMgmtDetail',
  props: {
    itemId: {
      type: String,
      default() {
        return '';
      }
    }
  },
  data() {
    return {
      loading: false,
      videoType: 'video',
      operations: [{ label: '保存', name: 'save', type: 'primary' }],
      rules: {
        commonOpeningRemarks: [{ required: true, message: '请填写通用开场语音', trigger: 'blur' }],
        memberOpeningRemarks: [{ required: true, message: '请填写会员开场语音', trigger: 'blur' }]
      },
      form: this.resetForm()
    };
  },
  components: {
    BizGrid,
    BizSaveButton
  },
  methods: {
    operate(name) {
      this[name]();
    },
    resetForm() {
      return {
        id: '',
        commonOpeningRemarks: '',
        memberOpeningRemarks: ''
      };
    },
    clear() {
      this.form = this.resetForm();
      this.$refs.form.resetFields();
    },
    typeChange() {
      this.form.answer = '';
    },
    save() {
      this.$refs.form.validate((valid, a) => {
        if (valid) {
          if (this.form.id) {
            http
              .put('/admin/reception/receptionSetting.jhtml', this.form)
              .then(data => {
                this.loading = false;
                this.$message.success('更新成功');
                this.$emit('created');
                this.refresh();
              })
              .catch(ErrorData => {
                this.loading = false;
                console.log('ERR_REFRESH: ', ErrorData);
                this.$message.warning(ErrorData.errorMessage);
              });
          } else {
            http
              .post('/admin/reception/receptionSetting.jhtml', this.form)
              .then(data => {
                this.loading = false;
                this.$message.success('保存成功');
                this.$emit('created');
                this.refresh(data.id);
              })
              .catch(ErrorData => {
                this.loading = false;
                console.log('ERR_REFRESH: ', ErrorData);
                this.$message.warning(ErrorData.errorMessage);
              });
          }
        }
      });
    },
    refresh(id) {
      this.loading = true;
      let params = { shopId: window.top.SHOP_ID };
      http
        .get('/admin/reception/receptionSetting.jhtml', params)
        .then(data => {
          this.loading = false;
          this.form = Object.assign(this.resetForm(), data.data);
        })
        .catch(ErrorData => {
          this.loading = false;
          console.log('ERR_REFRESH: ', ErrorData);
          this.$message.warning(ErrorData.errorMessage);
        });
    },
    addProblem() {
      this.form.similarQuestion.push({ name: '' });
    }
  },
  mounted() {
    this.refresh();
  },
  watch: {}
};
</script>

<style lang="scss">
.recall-words {
  .el-radio + .el-radio {
    margin-left: 0px;
  }
  .biz-save-button {
    float: left;
  }
  .el-radio {
    margin-right: 10px;
  }
  .el-form {
    height: 100%;
    overflow: auto;
    padding: 20px;
  }
  .el-select {
    margin-top: 18px;
  }
  .el-form-item__content > :first-child {
    margin-top: 0;
  }
  .transition-box {
    margin-top: 10px;
  }
  .el-checkbox-group .el-checkbox {
    width: 165px;
    margin: 0;
    .el-checkbox__label {
      width: 140px;
      white-space: normal;
    }
  }
  textarea[name='editorValue']{
    display: none;
  }
}
</style>
