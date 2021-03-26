<template>
  <biz-grid class="shop-publicity-article-edit" v-loading="loading">
    <biz-save-button slot="top" :operations="operations" @operate="operate"></biz-save-button>
    <div class="content_class" ref="content">
      <el-form :rules="rules" ref="form" :model="form" label-width="120px" size="small" :disabled="itemState === '1'"
        :inline-message="true">
        <el-form-item label="类型" prop="articleType">
          <el-select v-model="form.helpCenterType" placeholder="请选择类型">
            <el-option value="0" label="推荐文章"></el-option>
            <el-option value="1" label="运营课堂"></el-option>
            <el-option value="2" label="常见问题"></el-option>
          </el-select>
        </el-form-item>
        <div class="single-line">
          <el-form-item label="标题" prop="title">
            <el-input type="textarea" style="width:200px" placeholder="请输入标题" v-model="form.title"></el-input>
          </el-form-item>
        </div>
      </el-form>
      <div class="editor-area">
        <biz-editor-template @templateSelect="templateSelect"></biz-editor-template>
        <!-- <biz-editor ref="editor" width="100%" height="622" :disabled="editorDisabled" v-model="form.content" :hasVideo="true"
          @video-oversize="checkVideo" @video-wrong-format="checkVideo" @openLink="addActive"></biz-editor> -->
        <biz-editor ref="editor" width="100%" height="622" :disabled="editorDisabled" v-model="form.content" :hasVideo="true"></biz-editor>
      </div>
    </div>
    <!-- 预览 -->
    <article-preview :previewDialog.sync="previewDialog" :form="form"></article-preview>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import BizSaveButton from '@/components/BizSaveButton';
import { BizEditor, BizEditorTemplate } from '@/components/BizEditorH';
import ArticlePreview from '../../components/ArticlePreview';
import http from '@/common/http';
import DefaultImg from '@/assets/images/commodity/pic_default_none_100.png';
import { mapGetters, mapMutations } from 'vuex';
export default {
  name: 'ShopPublicityArticleEdit',
  props: {
    itemId: {
      type: Object,
      default() {
        return {
          id: ''
        };
      }
    },
    open: {
      type: Boolean,
      default() {
        return false;
      }
    },
    itemState: {
      type: String,
      default() {
        return '0';
      }
    },
    articleType: {
      type: String,
      default() {
        return '';
      }
    }
  },
  data() {
    return {
      editorDisabled: false,
      showActiveDialog: false,
      openedActive: false,
      showTable: true,
      dialogActiveTableData: [],
      tagLists: [],
      active: {},
      selectedTags: [],
      // 获取图片url正则
      reg: new RegExp(/<img [^>]*src=['"]([^'"]+)[^>]*>/, 'i'),
      // dialog start
      dialogLoading: false,
      showDialog: false,
      defaultImg: DefaultImg,
      products: [],
      dialogActivePagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        // 总条目数
        total: 0
      },
      pagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        // 总条目数
        total: 0
      },
      productFilters: [
        {
          type: 'input',
          placeholder: '请输入编号/商品名',
          name: 'searchbar',
          value: ''
        }
      ],
      dialogActiveFilters: [
        {
          type: 'radio',
          label: '链接内容',
          name: 'type',
          value: 'product',
          options: [
            {
              label: '商品',
              value: 'product'
            },
            {
              label: '促销活动',
              value: 'promotion'
            },
            {
              label: '营销活动',
              value: 'marketing'
            },
            {
              label: '软文宣传',
              value: 'article'
            },
            {
              label: '商品推广',
              value: 'shopPublicity'
            },
            {
              label: '外部地址',
              value: ''
            }
          ]
        },
        {
          type: 'input',
          label: '商品',
          placeholder: '请输入商品名称',
          select: [],
          name: 'searchValue',
          value: '',
          class: 'show'
        },
        {
          type: 'inputValue',
          label: '外部地址',
          placeholder: '请输入外部地址',
          name: 'inputValue',
          value: '',
          class: 'hidden'
        }
      ],
      selectedItemKeys: [],
      // 推送设置
      tagName: [],
      tabName: 'first',
      // 预览
      previewDialog: false,
      rules: {
        title: [
          { required: true, message: '请输入标题', trigger: 'blur' },
          { max: 100, message: '标题不要超过100字', trigger: 'blur' }
        ],
        seoTitle: [{ max: 100, message: '原始链接不要超过100字', trigger: 'blur' }],
        seoDescription: [
          { max: 120, message: '摘要最大不超过120字', trigger: 'blur' },
          { required: true, message: '请填写摘要', trigger: 'blur' }
        ],
        author: [{ max: 100, message: '作者不要超过100字', trigger: 'blur' }],
        productList: [{ required: true, message: '请选择商品', trigger: 'blur' }]
      },
      operations: [
        {
          label: '保存',
          name: 'save',
          type: 'primary',
          disabled: false,
          auth: [this.articleType === '1' ? 'admin:articleProduct.edit' : 'admin:article.edit']
        },
        {
          label: '预览',
          name: 'preview',
          type: ''
        }
      ],
      loading: false,
      form: this.getOriginForm(),
      productList: [],
      options: [],
      tagList: ['行业动态', '讲堂', '杂谈'],
      // 预约项目是否显示
      // Editor Start
      isSetting: false,
      editorStyle: {
        height: '700px',
        width: '450px'
      }
      // Eidtor End
    };
  },
  methods: {
    ...mapMutations('ShopPublicity', ['updateArticleType']),
    ...mapGetters(['getUser']),
    onAddSuccess() {
      this.getStoreTags();
    },
    cutstr(str) {
      if (str.length > 50) {
        return str.substr(0, 50) + '...';
      } else {
        return str.substr(0, str.length);
      }
    },
    getType(row) {
      if (this.dialogActiveFilters[0].value === 'promotion') {
        switch (row.typeStr) {
          case '0':
            return '包邮';
          case '1':
            return '优惠券';
          case '2':
            return '促销';
          case '3':
            return '满减';
          case '4':
            return '折扣';
          case '5':
            return '满送';
          case '6':
            return '套餐';
          case '7':
            return '会员价';
          default:
            return '';
        }
      } else if (this.dialogActiveFilters[0].value === 'marketing') {
        switch (row.typeStr) {
          case '0':
            return '抢红包';
          case '1':
            return '摇一摇';
          case '2':
            return '抽奖';
          case '3':
            return '拼团购';
          case '4':
            return 'N元抢购';
          case '5':
            return '限时秒杀';
          case '6':
            return '帮砍价';
          case '7':
            return '推荐有礼';
          case '8':
            return '分享有礼';
          case '9':
            return '活动招募';
          default:
            break;
        }
      }
    },
    getState(row) {
      if (this.dialogActiveFilters[0].value === 'product') {
        switch (row.state) {
          case '0':
            return '已创建';

          case '1':
            return '已提交';

          case '2':
            return '已上架';

          case '3':
            return '已下架';
          default:
            break;
        }
      } else if (this.dialogActiveFilters[0].value === 'shopPublicity') {
        switch (row.state) {
          case '0':
            return '审核中';
          case '1':
            return '审核不通过';
          case '2':
            return '审核通过';
          case '3':
            return '已投放';
        }
      } else {
        switch (row.state) {
          case '0':
            return '已创建';
          case '1':
            return '已发布';
          // case '2':
          //   return '自动审核';
          case '3':
            return '审核通过';
          case '4':
            return '未审核';
        }
      }
    },
    getStateStr(row) {
      if (this.dialogActiveFilters[0].value === 'marketing') {
        switch (row.stateStr) {
          case '0':
            return '未开始';
          case '1':
            if (row.typeStr === '9' && row.attendCount < row.maxPersonCount) {
              return '进行中';
            } else if (row.typeStr === '9' && row.attendCount === row.maxPersonCount) {
              return '已结束';
            } else {
              return '进行中';
            }
          case '2':
            return '已结束';
          case '3':
            return '已创建';
          case '4':
            return '已提交';
          case '5':
            return '已取消';
          default:
            return '';
        }
      } else {
        switch (row.stateStr) {
          case '0':
            return '未开始';
          case '1':
            return '进行中';
          case '2':
            return '已结束';
          case '3':
            return '已创建';
          case '4':
            return '已提交';
          case '5':
            return '已取消';
          default:
            return '';
        }
      }
    },
    // 状态文字颜色
    stateColor(row) {
      if (row.stock > 5) {
        return '#333333';
      } else {
        return '#f56c6c';
      }
    },
    onTypeChange(value) {
      console.log(value);
      this.form.typeList.forEach((item, index) => {
        if (value === index.toString()) {
          this.curTagId = item.id;
          this.getStoreTags();
          return false;
        }
      });
    },
    operate(name) {
      this[name]();
    },
    handleLogoSuccess(url) {
      this.form.titleImage = url;
    },
    setCover(url) {
      this.form.titleImage = url;
    },
    getOriginForm() {
      return {
        typeList: [],
        type: '',
        title: '',
        author: '',
        content: '',
        titleImage: '',
        seoTitle: '',
        seoDescription: '',
        contentUrl: '',
        articleType: '0',
        helpCenterType: '0',
        contentUrlPreview: '',
        productList: [],
        tagList: ['行业动态', '讲堂', '杂谈'],
        state: ''
      };
    },
    // 选中模板
    templateSelect(template) {
      // this.form.content += template;
      console.log(template);
      this.$refs.editor.execCommand('inserthtml', template);
    },
    // 返回
    back() {
      this.updateIfReturn(true);
      this.$router.go(-1);
    },
    // 点击'保存'按钮
    save() {
      if (!this.form.content && this.form.articleType === '0') {
        this.$message.warning({
          message: '请填写文章内容',
          showClose: true
        });
        return;
      }
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
      if (this.itemId.id) {
        this.update();
      } else {
        this.create();
      }
    },
    // 创建
    create() {
      this.loading = true;
      let params = {
        title: this.form.title,
        author: this.form.author,
        content: this.form.content,
        titleImage: this.form.titleImage,
        contentUrl: this.form.contentUrl,
        helpCenterType: this.form.helpCenterType
      };

      http
        .post('/admin/article/article/platformCreate.jhtml', params)
        .then(data => {
          this.loading = false;
          this.$emit('operationSuccess');
          this.$message.success('创建成功');
        })
        .catch(ErrorData => {
          this.loading = false;
          this.$message.warning({
            message: ErrorData.errorMessage,
            showClose: true
          });
        });
    },
    // 更新
    update() {
      let params = {
        title: this.form.title,
        author: this.form.author,
        content: this.form.content,
        titleImage: this.form.titleImage,
        contentUrl: this.form.contentUrl,
        helpCenterType: this.form.helpCenterType,
        id: this.itemId.id
      };
      http
        .put('/admin/article/article/platformUpdate.jhtml', params)
        .then(data => {
          this.loading = false;
          this.$message({
            message: '更新成功',
            type: 'success',
            showClose: true
          });
          this.$emit('created');
        })
        .catch(ErrorData => {
          this.loading = false;
          this.$message.warning({
            message: ErrorData.errorMessage,
            showClose: true
          });
        });
    },
    // 重置表单
    clear() {
      if (this.$refs.form) this.$refs.form.resetFields();
      this.form = this.getOriginForm();
    },
    // 刷新
    refresh() {
      this.form = Object.assign(this.getOriginForm(), this.itemId);
    },
    // 预览
    preview() {
      if (this.form.contentUrl && this.form.articleType === '2') {
        this.form.contentUrlPreview =
          'resources/admin/ecStatic/index.html?#/icar-channel/vr?url=' +
          this.form.contentUrl +
          '&id=' +
          this.form.id +
          '/index.html';
      }
      this.previewDialog = true;
    }
  },
  watch: {
    itemId(val, old) {
      this.clear();
      console.log(this.$refs.form);
      console.log(this.$refs.content);
      this.$refs.content.scrollTop = 0;
      if (val.id) {
        this.refresh();
        this.editorDisabled = true;
      } else {
        this.editorDisabled = false;
        this.operations[0].disabled = false;
      }
    },
    filters0(newValue, oldValue) {
      if (newValue) {
        this.showTable = true;
        this.dialogActiveFilters[2].value = '';
        this.dialogActiveFilters[2].class = 'hidden';
        this.dialogActiveFilters[1].class = 'show';
      } else {
        this.showTable = false;
        this.dialogActiveFilters[1].value = '';
        this.dialogActiveFilters[1].class = 'hidden';
        this.dialogActiveFilters[2].class = 'show';
      }
    },
    filters2(newValue, oldValue) {}
  },
  computed: {
    deleteHtmlTag() {
      return this.active.content.replace(/<[^>]+>|&[^>]+;/g, '').trim(); // 去掉所有的html标签和&nbsp;之类的特殊符合
    },
    filters0() {
      return this.dialogActiveFilters[0].value;
    },
    filters2() {
      return this.dialogActiveFilters[2].value;
    }
  },
  created() {},
  mounted() {},
  components: {
    BizGrid,
    BizSaveButton,
    BizEditor,
    BizEditorTemplate,
    ArticlePreview
  }
};
</script>

<style lang="scss">
.activeDialog {
  width: 1200px;
  overflow: hidden;
  .biz-table-filter .filter-wrap {
    margin: 0px 0px 10px 0px !important;
  }
}
.shop-publicity-article-edit {
  .biz-save-button {
    justify-content: flex-start;
  }
  .el-form {
    .el-form-item.isRequired .el-form-item__label:before {
      content: '*';
      color: #f56c6c;
      margin-right: 4px;
    }
    width: 900px;
    // min-height: 280px;
    overflow: auto;
    padding-top: 20px;
    padding-right: 20px;
    .el-select {
      margin-top: 18px;
    }
    .active-content {
      display: flex;
      border: 1px solid #c1c1c1;
      width: 400px;
      height: 80px;
      padding: 5px;
      cursor: pointer;
      justify-content: space-between;
      span {
        display: block;
        line-height: 20px;
      }
      .title {
        font-weight: bold;
        font-size: 14px;
      }
    }
    .el-form-item__content > :first-child {
      margin-top: 0;
    }
    .el-input--small {
      width: 215px;
    }
    .single-line {
      .el-input--small {
        width: 400px;
      }
    }
    .tag-select-shop,
    .shop-type {
      width: 400px;
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
  }
  // 图片预览
  .el-upload-list.el-upload-list--picture-card {
    display: flex;
    flex-wrap: wrap;
  }
  .content_class {
    height: 100%;
    overflow: auto;
  }
  .el-upload-list--picture-card .el-upload-list__item {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    width: 300px;
    height: 100px;
    .detail_info {
      margin-left: 20px;
    }
  }
  .el-upload-list--picture-card .el-upload-list__item-thumbnail {
    width: auto;
    height: auto;
    max-width: 100%;
    max-height: 100%;
  }
  .avatar-uploader {
    cursor: pointer;
    width: 100px;
    height: 100px;
    text-align: center;
    position: relative;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    position: relative;
    overflow: hidden;
    &:hover {
      border-color: #409eff;
    }
    .el-upload--text {
      width: 100%;
      height: 100%;
    }
    .avatar-uploader-icon {
      line-height: 100px;
      font-size: 28px;
      color: #8c939d;
      text-align: center;
    }
    .avatar {
      width: 100%;
      height: 100%;
      display: block;
      img {
        width: auto;
        height: auto;
        max-width: 100%;
        max-height: 100%;
      }
    }
    .operate {
      position: absolute;
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;
      cursor: default;
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      opacity: 0;
      transition: all 0.3s;
      .el-icon-zoom-in,
      .el-icon-plus {
        margin: 0 5px;
      }
      &:hover {
        background-color: rgba(0, 0, 0, 0.5);
        opacity: 1;
        .el-icon-zoom-in,
        .el-icon-plus {
          cursor: pointer;
        }
      }
    }
  }
  .editor-area {
    display: flex;
    width: 900px;
    height: 742px;
    margin-left: 20px;
    margin-right: 20px;
    margin-bottom: 20px;
    .edui-default .edui-editor {
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
    }
    .content-mgmt-biz-editor .quill-editor .ql-toolbar {
      border-top-left-radius: 0;
    }
    .content-mgmt-biz-editor .quill-editor .ql-container {
      border-bottom-left-radius: 0;
    }
  }
}
</style>
