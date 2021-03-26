<template>
  <div class="article-info" v-loading="loading">
    <biz-save-button slot="top" :operations="operations" @operate="operate">
    </biz-save-button>
    <el-form :rules="rules" ref="form" :model="form" label-width="100px" size="small" :inline-message="true">
      <el-form-item label="车友会" prop="fleetId">
        <el-select v-model="form.fleetId" :disabled="dynamicIdNew!==''" @change="onChange">
          <el-option v-for="motoristsClub of motoristsClubList" :key="motoristsClub.value" :label="motoristsClub.label" :value="motoristsClub.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="栏目" prop="columnSelList">
        <div class="column-style">
          <el-checkbox-group v-model="form.columnSelList" size="small">
            <el-checkbox-button v-for="column in form.columns" :label="column.name" :key="column.id" class="tag-column">{{column.name}}</el-checkbox-button>
          </el-checkbox-group>
        </div>
      </el-form-item>
      <el-form-item label="文章选择" prop="artcleName">
        <div class="select-article">
          <el-input v-model="form.artcleName" placeholder="请选择文章" class="select-input" readonly></el-input>
          <el-button type="primary" small @click="addArticle" :disabled="dynamicIdNew!==''">+</el-button>
        </div>
      </el-form-item>
      <!-- <el-form-item label="标签">
        <el-tag v-for="(tag, index) in form.tagList" :key="index" class="tag-article">{{tag.name}}</el-tag>
      </el-form-item> -->
    </el-form>
    <dynamic-preview :open.sync="previewDialog" :dynamicId="articleId" :author="dynamicAuthorNew">
    </dynamic-preview>
    <el-dialog append-to-body class="dynamic-preview" title="预览" :visible="previewDialogOpen" @close="closePreviewDialog" width="450px">
      <div class="bg" :style="{ background: background}">
        <div class="cpreview">
          <div class="pcontent">
            <div class="title">{{articleInfo.title?articleInfo.title:''}}</div>
            <div class="detail">
              <div class="avater">
                <img :src="this.form.authorData.head||DefaultAvatar" alt="">
              </div>
              <div class="vt">
                <div class="name">{{form.authorData.name?form.authorData.name:''}}</div>
                <div class="time">{{articleInfo.publishDate?articleInfo.publishDate:''}}</div>
              </div>
            </div>
            <div v-html="articleInfo.content?articleInfo.content:''">
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
    <biz-dialog-selector class="selector" title="文章选择" :loading="dialogLoading" selectionMode="single" :isClear="false"
      :visibility.sync="showDialog" :tableData="tableData" :pagination="pagination" @pageSizeChange="handleSizeChange"
      @currentPageChange="handleCurrentChange" @confirmed="confirm">
      <el-table-column prop="title" label="标题">
      </el-table-column>
      <el-table-column prop="shop.name" label="店铺">
      </el-table-column>
      <el-table-column prop="publishDate" label="发布时间">
      </el-table-column>
    </biz-dialog-selector>
  </div>
</template>

<script>
import BizSaveButton from '@/components/BizSaveButton';
import BizDialogSelector from '@/components/BizDialogSelector';
import http from '@/common/http';
import urls from '@/common/urls';
import DynamicService from '@/service/motorists-club-dynamic/motoristsClubDynamic';
import DynamicSer from '@/service/motorists-club-dynamic/dynamic';
import DynamicPreview from '../motorists-club-dynamic/DynamicPreview';
import phoneB from '@/assets/images/iphone-b.png';
import DefaultAvatar from '@/assets/images/default_user.png';

export default {
  name: 'article-info',
  data() {
    return {
      previewDialogOpen: false,
      dynamicIdNew: '',
      articleId: '',
      DefaultAvatar: DefaultAvatar,
      dynamicAuthorNew: '',
      previewDialog: false,
      background: 'url(' + phoneB + ') no-repeat no-repeat',
      loading: false,
      articleCategoryId: '',
      motoristsClubList: [],
      showDialog: false,
      tableData: [],
      articleInfo: {},
      pagination: {
        pageSize: 10,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        total: 9
      },
      dialogLoading: false,
      form: {
        authorData: {},
        fleetId: '',
        columnSelList: ['推荐'],
        columns: [],
        artcleName: '',
        tagList: []
      },
      rules: {
        columnSelList: [{ required: true, message: '请选择栏目', trigger: 'change' }],
        artcleName: [{ required: true, message: '请选择文章', trigger: 'change' }]
      },
      operations: [
        {
          disabled: false,
          label: '预览',
          name: 'previewDynamic',
          type: ''
        },
        {
          label: '保存',
          name: 'publish',
          type: 'primary'
        }
      ]
    };
  },
  props: {
    dynamicId: {
      type: String
    },
    dynamicAuthor: {
      type: String
    }
  },
  components: {
    BizSaveButton,
    BizDialogSelector,
    DynamicPreview
  },
  computed: {},
  watch: {
    dynamicId(newValue) {
      this.dynamicIdNew = newValue;
      this.articleInfo = {};
      this.articleId = '';
      this.$refs.form.resetFields();
      if (newValue === '' || newValue === '-1') {
        this.clearForm();
        this.form.authorData.head = this.motoristsClubList[0].head;
        this.form.authorData.name = this.motoristsClubList[0].label;
      } else {
        this.refresh();
      }
    },
    dynamicAuthorNew(newValue) {
      this.dynamicAuthorNew = newValue;
    },
    motoristsClubList(newValue) {
      if (newValue && newValue.length > 0) {
        this.form.fleetId = newValue[0].value;
        this.form.authorData.head = newValue[0].head;
        this.form.authorData.name = newValue[0].label;
      }
    }
  },
  methods: {
    closePreviewDialog() {
      this.previewDialogOpen = false;
    },
    clearForm() {
      this.form.fleetId = this.motoristsClubList[0].value;
      this.form.columnSelList = ['推荐'];
      this.form.artcleName = '';
      this.form.authorData = {};
    },
    operate(name) {
      this[name]();
    },
    // 发布文章
    publish() {
      let params;
      this.$refs.form.validate(valid => {
        if (valid) {
          if (this.form.artcleName === '') {
            this.$notify({
              title: '警告',
              message: '请选择发布文章',
              type: 'warning'
            });
            return;
          }
          let arr = [];
          this.form.columnSelList.map(item => {
            this.form.columns.map(element => {
              if (item === element.name) {
                arr.push({ id: element.id, name: element.name });
              }
            });
            this.form.columnSelList = arr;
          });
          // 创建文章
          if (this.dynamicId === '') {
            params = {
              fleet: {
                id: this.form.fleetId
              },
              articleId: this.articleId,
              columnList: this.form.columnSelList
            };
            http
              .post(urls.motoristsClubDynamic.createDynamic, params)
              .then(data => {
                this.$message.success('操作成功');
                this.$emit('refresh');
              })
              .catch(error => {
                this.$message.warning(error.errorMessage);
              });
          } else {
            // 更新文章
            params = {
              articleId: this.articleId,
              fleet: {
                id: this.form.fleetId
              },
              id: this.dynamicIdNew,
              columnList: this.form.columnSelList
            };
            DynamicSer.updateDynamic(
              params,
              data => {
                this.$message.success('操作成功');
                this.$emit('refresh');
              },
              ErrorData => {
                console.log(ErrorData);
              }
            );
          }
        }
      });
    },
    previewDynamic() {
      if (this.articleId) {
        this.getArticleInfo();
      }
      this.previewDialogOpen = true;
    },
    getArticleInfo() {
      let params = {
        articleId: this.articleId
      };
      http
        .get(urls.motoristsClubDynamic.articleInfo, params)
        .then(data => {
          console.log(data);
          this.articleInfo = data.article;
        })
        .catch(error => {
          console.log(error.errorMessage);
        });
    },
    addArticle() {
      this.showDialog = true;
      this.getArticleList();
    },
    handleCurrentChange(val) {
      this.pagination.currentPage = val;
      this.getArticleList();
    },
    rowClick(row) {
      this.$emit('selectArticle', row.id);
    },
    handleSizeChange(val) {
      this.pagination.pageSize = val;
      this.getArticleList();
    },
    getArticleList() {
      this.dialogLoading = true;
      let params = {
        shopId: window.top.SHOP_ID || '',
        categoryId: this.articleCategoryId,
        pageable: {
          pageNumber: this.pagination.currentPage,
          pageSize: this.pagination.pageSize
        }
      };
      http
        .get(urls.motoristsClubDynamic.articleList, params)
        .then(data => {
          this.dialogLoading = false;
          this.tableData = data.articles;
          this.pagination.total = Number(data.total);
        })
        .catch(error => {
          this.dialogLoading = false;
          console.log(error);
        });
    },
    confirm(keys, selection) {
      this.tableData.forEach(element => {
        if (element.id === keys[0]) {
          this.form.artcleName = element.title;
          this.articleId = element.id;
          this.dynamicAuthorNew = this.form.fleetId;
          this.form.tagList = element.tagMapping ? element.tagMapping.tags : [];
          return false;
        }
      });
    },
    // 获取车友会列表
    getMotoristsClub() {
      let params = {
        shopId: window.top.SHOP_ID
      };
      DynamicService.getMotoristsClub(
        params,
        data => {
          this.motoristsClubList = [];
          for (const iterator of data.content) {
            this.motoristsClubList.push({
              value: iterator.id,
              label: iterator.name,
              head: iterator.head
            });
          }
          this.form.fleetId = this.motoristsClubList[0].label;
          this.dynamicAuthorNew = this.form.fleetId;
        },
        ErrorData => {
          console.log(ErrorData);
        }
      );
    },
    onChange(value) {
      this.motoristsClubList.forEach(item => {
        if (item.value === value) {
          this.form.authorData.head = item.head;
          this.form.authorData.name = item.label;
          return false;
        }
      });
    },
    refresh() {
      this.loading = true;
      let params = {
        spaceId: this.dynamicIdNew
      };
      DynamicSer.selectDynamic(
        params,
        data => {
          this.loading = false;
          this.form.fleetId = data.data.fleet ? data.data.fleet.id : '';
          this.fleet = data.data.fleet || {};
          this.dynamicAuthorNew = this.form.fleetId;
          let arr = [];
          data.data.columnList.map(item => {
            arr.push(item.name);
          });
          this.form.columnSelList = arr || [];
          this.form.artcleName = data.data.title;
          this.articleId = data.data.articleId;
          this.form.authorData = data.data.authorData;
        },
        ErrorData => {
          this.loading = false;
          console.log(ErrorData);
        }
      );
    },
    getCategoryList() {
      let params = {
        shopId: window.top.SHOP_ID || ''
      };
      DynamicSer.getArticleTypeList(
        params,
        data => {
          if (data.articleCategorys.length > 1) {
            this.articleCategoryId = data.articleCategorys[0].id;
          }
        },
        ErrorData => {
          console.log(ErrorData);
        }
      );
    },
    getColumns() {
      http
        .get(urls.motoristsClubDynamic.visibleColumns)
        .then(data => {
          this.form.columns = data.content;
        })
        .catch(error => {
          this.$message.warning(error.errorMessage);
        });
    }
  },
  created() {
    this.getColumns();
    this.getCategoryList();
    this.getMotoristsClub();
  }
};
</script>

<style lang="scss">
.article-info {
  padding: 20px;
  .biz-save-button {
    justify-content: flex-start;
  }
  .biz-dialog-selector > .el-dialog {
    width: 50%;
  }
  .tag-article {
    margin: 2px;
  }
  .column-style {
    .tag-column {
      margin: 5px;
      border-radius: 0;
    }
    .el-checkbox-button__inner {
      border-left: 1px solid #dcdfe6;
      border-radius: 0;
      border-color: #dcdfe6;
    }
    .el-checkbox-button.is-checked .el-checkbox-button__inner {
      border-color: #ff7300;
    }
  }
  .selector {
    .biz-dialog-selector > .el-dialog {
      width: 50%;
    }
  }
  .select-article {
    display: flex;
    align-items: center;

    .select-input {
      width: 80%;
    }
  }

  .dynamic-preview {
    .bg {
      margin: 0 auto;
      position: relative;
      width: 390px;
      height: 653px;
      .cpreview {
        overflow: auto;
        position: absolute;
        padding: 10px;
        width: 354px;
        height: 500px;
        top: 76px;
        left: 18px;
        outline: none;
        background-color: #fff;
        &::-webkit-scrollbar {
          width: 8px;
        }
        &::-webkit-scrollbar-track {
          -webkit-border-radius: 2em;
          -moz-border-radius: 2em;
          border-radius: 2em;
        }
        &::-webkit-scrollbar-thumb {
          background-color: #c2c2c2;
          -webkit-border-radius: 2em;
          -moz-border-radius: 2em;
          border-radius: 2em;
        }
        .pcontent {
          word-wrap: break-word;
          .title {
            color: #000;
            font-size: 18px;
            font-weight: 700;
          }
          .detail {
            display: flex;
            align-items: center;
            .avater {
              margin: 5px;
            }
            img {
              width: 50px;
              height: 50px;
              border-radius: 25px;
            }
          }
        }
      }
    }
  }
}
</style>
