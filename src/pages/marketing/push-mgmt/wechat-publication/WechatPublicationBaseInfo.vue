<template>
  <biz-grid class="wechat-publication-base-info">
    <biz-save-button slot="top" :operations="operations" @operate="operate">
    </biz-save-button>
    <el-form :rules="rules" ref="form" :model="form" label-width="100px" size="small" v-loading="loading" :disabled="true" :inline-message="true">
      <el-form-item label="标题" prop="title" :error="errTitle">
        <el-input placeholder="请输入标题" v-model="form.title"></el-input>
      </el-form-item>
      <el-form-item label="作者" prop="author">
        <el-input placeholder="请输入作者" v-model="form.author"></el-input>
      </el-form-item>
      <el-form-item label="原文地址" prop="contentSourceUrl">
        <el-input placeholder="请输入原文地址" v-model="form.contentSourceUrl"></el-input>
      </el-form-item>
      <el-form-item label="摘要" prop="digest">
        <el-input placeholder="请输入摘要" :rows="2" type="textarea" v-model="form.digest"></el-input>
      </el-form-item>
      <biz-editor ref="editor" width="440px" height="550px" v-model="form.content"></biz-editor>
    </el-form>
    <article-preview :previewDialog.sync="previewDialog" :form="form"></article-preview>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import BizSaveButton from '@/components/BizSaveButton';
import { BizEditor } from '@/components/BizEditorH';
import ArticlePreview from '../components/ArticlePreview';

import service from '@/service/content-mgmt/WechatPublication.js';

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
        // {
        //   label: '保存',
        //   name: 'save',
        //   type: 'primary'
        // },
        {
          label: '预览',
          name: 'preview',
          type: ''
        }
      ],
      loading: false,
      form: {
        title: '',
        category: '',
        author: '',
        content: '',
        isPublication: '0',
        isTop: '0',
        titleImage: '',
        summary: '',
        contentSourceUrl: '',
        digest: '',
        seoKeywords: ''
      }
    };
  },
  methods: {
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
      let params = Object.assign({}, this.form);
      // this.loading = true;
      service.updateBaseInfo(
        params,
        data => {
          this.loading = false;
          this.$message({
            message: '更新成功',
            type: 'success',
            showClose: true
          });
          this.refresh();
          this.$emit('created');
        },
        ErrorData => {
          this.loading = false;
          this.$message.warning(ErrorData.errorMessage);
        }
      );
    },
    // 按钮'删除'
    del() {
      // 传入id为单个删除,否则为批量删除
      let ids = Array(this.id);
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let params = {
            ids: ids
          };
          service.delete(
            params,
            data => {
              this.$message.success('操作成功');
              this.refresh();
            },
            ErrorData => {
              this.$message.warning(ErrorData.errorMessage);
              console.log('ERR_DELETE: ', ErrorData);
            }
          );
        })
        .catch();
    },
    // 重置表单
    clear() {
      this.$refs.form.resetFields();
    },
    // 刷新
    refresh() {
      this.clear();
      let params = {
        id: this.id
      };
      service.queryBaseInfo(
        params,
        data => {
          this.loading = false;
          this.form.title = data.content.title;
          this.form.author = data.content.author;
          this.form.isPublication = data.content.isPublication;
          this.form.isTop = data.content.isTop;
          this.form.contentSourceUrl = data.content.contentSourceUrl;
          this.form.digest = data.content.digest;
          this.form.content = data.content.content;
        },
        ErrorData => {
          this.loading = false;
        }
      );
    },
    // 获取类型列表
    queryTypeList() {
      let params = {};
      service.queryTypeList(
        params,
        data => {
          this.categories = data.dataList;
        },
        ErrorData => {}
      );
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
    this.queryTypeList();
    if (this.id) {
      this.refresh();
    } else {
      this.clear();
    }
  },
  components: {
    BizGrid,
    BizSaveButton,
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
