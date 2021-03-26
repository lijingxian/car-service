<template>
  <biz-grid class="open-remarks">
    <biz-save-button slot="top" :operations="operations" @operate="operate">
    </biz-save-button>
    <el-form :rules="rules" :model="form" ref="form" label-width="120px" size="small" v-loading="loading" :inline-message="true">
      <el-form-item label="召回时间" prop="recallTime">
        <el-input type="textarea" v-model="form.recallTime" placeholder="45">
          <template slot="append">秒</template>
        </el-input>
      </el-form-item>
      <el-form-item label="召回语音" prop="recallVoice">
        <el-input type="textarea" v-model="form.recallVoice" maxlength="100" placeholder="怎么不理小V了呢，小V还可以为您做很多车型介绍的内容呢"></el-input>
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
  props: {},
  data() {
    return {
      loading: false,
      videoType: 'video',
      itemId: '',
      operations: [{ label: '保存', name: 'save', type: 'primary' }],
      rules: {
        recallTime: [
          { required: true, message: '请填写召回时间', trigger: 'blur' },
          {
            trigger: 'blur',
            validator: (rule, value, callback) => {
              let validate = /^\d+$/;
              if (!validate.test(value)) {
                callback(new Error('请输入正确的时间'));
              } else {
                callback();
              }
            }
          }
        ],
        recallVoice: [
          { required: true, message: '请填写召回语音', trigger: 'blur' }
        ]
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
        recallTime: '',
        recallVoice: ''
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
.open-remarks {
  .biz-save-button {
    float: left;
  }
  .el-radio + .el-radio {
    margin-left: 0px;
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
  textarea[name='editorValue'] {
    display: none;
  }
}
</style>
