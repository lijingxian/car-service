<template>
  <biz-grid class="key-word-template__base-info" v-loading="loading">
    <biz-save-button slot="top" :operations="operations" @operate="handleOperate"></biz-save-button>
    <el-form ref="form" size="small" label-width="110px" :model="formModel" :rules="rules" :inline-message="true">
      <el-form-item :label="itemId.type==='first'?'样式名称':'模板名称'" prop="name">
        <el-input v-model="formModel.name" placeholder="请输入名称"></el-input>
      </el-form-item>
      <el-form-item label="样式类型" prop="type" v-if="itemId.type==='first'">
        <el-select v-model="formModel.type">
          <el-option v-for="option in options" :key="option.value" :label="option.label" :value="option.value"></el-option>
        </el-select>
      </el-form-item>
      <biz-editor ref="editor" height="622" width="100%" v-model="formModel.content"></biz-editor>
    </el-form>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import BizSaveButton from '@/components/BizSaveButton';
import http from '@/common/http';
import { mapGetters } from 'vuex';
import { BizEditor } from '@/components/BizEditorH';
// 初始化时需要的一些数据
const initData = {
  newTagName: '',
  tableData: [],
  operations: [
    {
      label: '保存',
      name: 'save',
      type: 'primary'
    }
  ],
  options: [
    {
      label: '标题', value: '0'
    },
    {
      label: '正文', value: '1'
    },
    {
      label: '引导', value: '2'
    },
    {
      label: '图文', value: '3'
    },
    {
      label: '布局', value: '4'
    },
    {
      label: '行业', value: '5'
    }
  ]
};

// 获取默认表单项
const getDefaultModel = () => {
  return {
    name: '',
    type: '',
    content: '',
    id: ''
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
    getUrl() {
      if (this.itemId.type === 'first') {
        return '/admin/materialTemplate/style.jhtml';
      } else {
        return '/admin/materialTemplate/material.jhtml';
      }
    },
    query() {
      this.loading = true;
      http
        .get(this.getUrl(), { userId: this.getUser().id, id: this.itemId.id })
        .then(data => {
          // 列表
          this.initModel(data.data);
        })
        .catch(errData => {
          console.log(errData);
          console.log('code错误');
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
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
    save() {
      this.$refs.form.validate((valid, a) => {
        if (valid) {
          if (this.formModel.id) {
            this.loading = true;
            http
              .put(this.getUrl(), Object.assign(this.formModel, { userId: this.getUser().id }))
              .then(data => {
                this.$message.success('保存成功');
                this.$emit('operationSuccess');
              })
              .catch(errData => {
                console.log(errData);
                console.log('code错误');
                if (errData.errorMessage) this.$message.warning(errData.errorMessage);
              })
              .finally(() => {
                this.loading = false;
              });
          } else {
            this.loading = true;
            http
              .post(this.getUrl(), Object.assign(this.formModel, { userId: this.getUser().id }))
              .then(data => {
                this.$message.success('保存成功');
                this.$emit('operationSuccess');
              })
              .catch(errData => {
                console.log(errData);
                console.log('code错误');
                if (errData.errorMessage) this.$message.warning(errData.errorMessage);
              })
              .finally(() => {
                this.loading = false;
              });
          }
        } else {
          return false;
        }
      });
    },
    rowDeleteClickHandler(val) {
      this.formModel.keywords.splice(val.$index, 1);
    }
  }
};

export default {
  name: 'KeyWordBaseInfo',
  components: {
    BizSaveButton,
    BizGrid,
    BizEditor
  },
  data() {
    return {
      ...initData,
      ...formData.data,

      rules: {
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }]
      }
    };
  },
  props: {
    itemId: {
      type: Object,
      default() {
        return { id: '' };
      }
    }
  },
  methods: {
    ...mapGetters(['getUser']),

    ...formData.methods,
    ...formData.events
  },
  watch: {
    itemId(nVal, oVal) {
      if (nVal.id) {
        this.query();
      } else {
        this.initModel();
      }
    }
  },
  created() {
    if (this.itemId.id) this.query();
  }
};
</script>

<style lang="scss">
.key-word-template__base-info {
  padding-top: 20px;
  .biz-save-button {
    justify-content: flex-start;
  }
  .el-form {
    padding-right: 20px;
  }
  .add-tag {
    display: flex;
    padding: 10px 0px 7px 30px;
    .el-input {
      margin-right: 10px;
      font-size: 13px;
      .el-input__inner {
        height: 32px;
        line-height: 32px;
      }
    }
    .el-button--primary {
      padding: 7px 15px;
    }
  }
  .el-form-item.isRequired .el-form-item__label:before {
    content: '*';
    color: #f56c6c;
    margin-right: 4px;
  }
}
</style>
