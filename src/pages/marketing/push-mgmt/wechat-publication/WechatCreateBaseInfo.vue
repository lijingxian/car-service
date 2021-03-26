<template>
  <biz-grid class="wechat-publication-base-info">
    <biz-save-button slot="top" :operations="operations" @operate="operate">
    </biz-save-button>
    <el-form :rules="rules" ref="form" :model="form" label-width="100px" size="small" v-loading="loading" :inline-message="true">
      <el-form-item label="标题" prop="title" :error="errTitle">
        <el-input placeholder="请输入标题" v-model="form.title"></el-input>
      </el-form-item>
      <el-form-item label="作者" prop="author">
        <el-input placeholder="请输入作者" v-model="form.author"></el-input>
      </el-form-item>
      <el-form-item label="原文地址" prop="seoTitle">
        <el-input placeholder="请输入原文地址" v-model="form.seoTitle"></el-input>
      </el-form-item>
      <el-form-item label="摘要" prop="seoDescription">
        <el-input placeholder="请输入摘要" type="textarea" :rows="2" v-model="form.seoDescription"></el-input>
      </el-form-item>
      <el-form-item label="封面图片">
        <biz-avatar-uploader-new v-model="form.titleImage"></biz-avatar-uploader-new>
      </el-form-item>
      <biz-editor ref="editor" width="440px" height="550px" v-model="form.content"></biz-editor>
    </el-form>
    <article-preview :previewDialog.sync="previewDialog" :form="form"></article-preview>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import BizSaveButton from '@/components/BizSaveButton';
// 单张上传
import { BizAvatarUploaderNew } from '@/components/BizForm';
import { BizEditor } from '@/components/BizEditorH';
import ArticlePreview from '../components/ArticlePreview';

import { contentMgmt } from '@/common/urls';
import http from '@/common/http';

export default {
  name: 'ArticleMgmtBaseInfo',
  props: {
    // 是否显示设置项
    ifShowConfig: {
      type: Boolean,
      default: true
    },
    itemId: {
      type: Object,
      default() {
        return { id: '' };
      }
    }
  },
  data() {
    return {
      id: '',
      // 预览
      previewDialog: false,
      // 标题错误信息
      errTitle: '',
      // 分类下拉菜单
      categories: [],
      rules: {
        title: [{ required: true, message: '请输入标题', trigger: 'blur' }]
        // category: [{ required: true, message: '请选择类别', trigger: 'blur' }],
        // author: [{ required: true, message: '请输入作者', trigger: 'blur' }]
      },
      operations: [
        {
          label: '保存',
          name: 'save',
          type: 'primary'
        },
        {
          label: '预览',
          name: 'preview',
          type: ''
        }
      ],
      loading: false,
      form: this.getOriginForm()
    };
  },
  methods: {
    getOriginForm() {
      return {
        title: '',
        author: '',
        content: '',
        titleImage: '',
        seoTitle: '',
        seoDescription: '',
        seoKeywords: ''
      };
    },
    operate(name) {
      this[name]();
    },
    handleLogoSuccess(url) {
      this.form.titleImage = url;
    },
    // 返回
    back() {
      this.$router.go(-1);
    },
    // 点击'保存'按钮
    save() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.submit();
        } else {
          return false;
        }
      });
    },
    // 提交
    submit() {
      let params = Object.assign({}, this.itemId, this.form);
      http.put(contentMgmt.ArticleMgmt_updateBaseInfo, params)
        .then(data => {
          this.loading = false;
          this.$message({
            message: '更新成功',
            type: 'success',
            showClose: true
          });
          this.refresh();
          this.$emit('update');
        })
        .catch(ErrorData => {
          this.loading = false;
          this.$message.warning(ErrorData.errorMessage);
        });
    },
    // 重置表单
    clear() {
      this.form = this.getOriginForm();
      this.$refs.form.resetFields();
    },
    // 刷新
    refresh() {
      this.clear();
      let params = {
        id: this.id
      };
      http.get(contentMgmt.ArticleMgmt_queryBaseInfo, params)
        .then(data => {
          this.loading = false;
          this.form = Object.assign(this.getOriginForm(), data.article);
        })
        .catch(ErrorData => {
          this.loading = false;
        });
    },
    // 预览
    preview() {
      this.previewDialog = true;
    },
    checkVideo(msg) {
      this.$message(msg);
    }
  },
  watch: {
    itemId(newVal, oldVal) {
      this.id = this.itemId.id;
      this.refresh();
    }
  },
  computed: {
    categoryClass() {
      let tmp = {};
      this.categories.map(cate => {
        if (cate.id === this.form.category) {
          tmp = cate;
        }
      });
      return tmp;
    }
  },
  created() {},
  mounted() {
    if (this.id) {
      this.refresh();
    } else {
      this.clear();
    }
  },
  components: {
    BizGrid,
    BizSaveButton,
    BizAvatarUploaderNew,
    BizEditor,
    ArticlePreview
  }
};
</script>

<style lang="scss">
.wechat-publication-base-info {
  overflow: auto;
  .biz-save-button {
    justify-content: flex-start;
  }
  .el-form {
    overflow: auto;
    padding: 20px;
  }
  .el-select {
    margin-top: 18px;
  }
  .el-select.el-select--small {
    width: 100%;
  }
  .el-form-item__content > :first-child {
    margin-top: 0;
  }
  .el-checkbox-group .el-checkbox {
    width: 165px;
    margin: 0;
    .el-checkbox__label {
      width: 140px;
      white-space: normal;
    }
  }
}
</style>
