<template>
  <div class="dynamic">
    <biz-save-button slot="top" :operations="operations" @operate="operate">
    </biz-save-button>
    <el-form :rules="rules" ref="form" :model="form" label-width="100px" size="small" v-loading="loading" :inline-message="true">
      <el-form-item label="车友会" prop="fleetId">
        <el-select v-model="form.fleetId" :disabled="id!==''" @change="onChange">
          <el-option v-for="motoristsClub of motoristsClubList" :key="motoristsClub.value" :label="motoristsClub.label" :value="motoristsClub.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="标题" prop="dynamicTitle">
        <el-input placeholder="请输入标题（6-30字以内）" :maxlength="30" v-model="form.dynamicTitle" :disabled="id!==''"></el-input>
      </el-form-item>
      <el-form-item label="栏目" prop="columnSelList">
        <div class="column-style">
          <el-checkbox-group v-model="form.columnSelList" size="small">
            <el-checkbox-button v-for="column in form.columns" :label="column.name" :key="column.id" class="tag-column">{{column.name}}</el-checkbox-button>
          </el-checkbox-group>
        </div>
      </el-form-item>
      <!-- <el-form-item label="文章类别">
        <el-select v-model="form.type" @change="onTypeChange">
          <el-option  v-for="(item, index) in form.typeList" :label="item.name" :value="index.toString()" :key="index"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="标签">
        <tag-select ref="tagSelect" :tagList="tagList" :selectedTags="selectedTags" @addSuccess="onAddSuccess"></tag-select>
      </el-form-item> -->
      <el-form-item label="文字描述" v-if="infoType === '2'" prop="dynamicContent">
        <el-input v-model="form.dynamicContent" :disabled="id!==''" :maxlength="100" placeholder="请添加问答描述（选填）" type="textarea"
          :rows="4"></el-input>
      </el-form-item>
      <el-form-item label="图片描述" v-if="infoType === '2'">
        <img-uploader v-model="dynamicImages" :disabled="Boolean(id!==''||dynamicVideos.length)"></img-uploader>
      </el-form-item>
      <el-form-item label="视频描述" v-if="infoType === '2'">
        <product-vr-file-uploader :fileList="dynamicVideos" @upload-success="handleTestDriveUpload" @remove-success="handleTestDriveRemove"
          :disabled="Boolean(id!==''||dynamicImages.length)"></product-vr-file-uploader>
      </el-form-item>
      <div class="publish" v-if="infoType === '0'">
        <biz-editor ref="editor" v-model="form.dynamicContent" width="430px" :hasVideo="true" :disabled="editorDisabled"></biz-editor>
      </div>
    </el-form>
    <el-dialog append-to-body class="dynamic-preview" title="预览" :visible="previewDialogOpen" @close="closePreviewDialog" width="450px">
      <div class="bg" :style="{ background: background}">
        <div class="cpreview">
          <div class="pcontent">
            <div class="title">{{form.dynamicTitle}}</div>
            <div class="detail">
              <div class="avater">
                <img :src="form.authorData.head||DefaultAvatar" alt="">
              </div>
              <div class="vt">
                <div class="name">{{form.authorData.name}}</div>
                <div class="time">{{now}}</div>
              </div>
            </div>
            <div v-html="form.dynamicContent"></div>
            <div style="display:flex;flex-wrap:wrap">
              <div v-for="dynamicImage in dynamicImages" :key="dynamicImage">
                <img :src="dynamicImage" alt="" width="88" height="80" style="padding: 0px 2px">
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import BizSaveButton from '@/components/BizSaveButton';
import DynamicService from '@/service/motorists-club-dynamic/dynamic';
import DynamicSer from '@/service/motorists-club-dynamic/motoristsClubDynamic';
import { BizEditor } from '@/components/BizEditorH';
import phoneB from '@/assets/images/iphone-b.png';
import StrToHtml from '@/utils/StrToHtml.js';
import date from '@/utils/date';
import { mapGetters } from 'vuex';
import DefaultAvatar from '@/assets/images/default_user.png';
import http from '@/common/http';
import urls from '@/common/urls';
import ImgUploader from '@/components/BizForm/BizAvatarUploaderMulti';
import ProductVrFileUploader from './components/ProductVrFileUploader';

export default {
  name: 'Dynamic',
  data() {
    let validateTitle = (rule, value, callback) => {
      if (this.id === '' && (value.length < 6 || value.length > 30)) {
        callback(new Error('长度限6-30字以内'));
      } else {
        callback();
      }
    };
    return {
      editorDisabled: false,
      curTagId: '',
      tagList: [],
      selectedTags: [],
      authorName: '',
      isCreated: false,
      DefaultAvatar: DefaultAvatar,
      member: {},
      now: '',
      fleet: {},
      previewDialogOpen: false,
      background: 'url(' + phoneB + ') no-repeat no-repeat',
      editorStyle: {
        height: '300px',
        width: '428px'
      },
      categoryList: [],
      loading: false,
      fileData: {
        type: '0'
      },
      dynamicVideos: [],
      dynamicImages: [],
      form: {
        typeList: [],
        authorData: {},
        columnSelList: ['推荐'],
        columns: [],
        fleetId: '',
        type: '0',
        dynamicTitle: '',
        dynamicContent: '',
        topicLogoImageUrl: '',
        articleCategoryId: ''
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
      ],
      rules: {
        fleetId: [{ required: true, message: '请选择车友会', trigger: 'change' }],
        dynamicTitle: [{ required: true, validator: validateTitle, trigger: 'change' }],
        columnSelList: [{ required: true, message: '请选择栏目', trigger: 'change' }]
      },
      pictureList: [],
      isDynamic: true,
      textarea: '',
      checked: false,
      toolbars: [
        [
          {
            name: 'bold',
            title: '加粗',
            type: 'toolbtn',
            status: 'checked'
          },
          {
            name: 'italic',
            title: '斜体',
            type: 'toolbtn',
            status: 'checked'
          },
          {
            name: 'underline',
            title: '下划线',
            type: 'toolbtn',
            status: ''
          }
        ]
      ]
    };
  },
  props: {
    id: {
      type: String,
      default: ''
    },
    author: {
      type: String,
      default: ''
    },
    motoristsClubList: {
      type: Array
    },
    infoType: {
      type: String,
      default: '0'
    }
  },
  components: {
    BizSaveButton,
    BizEditor,
    ImgUploader,
    ProductVrFileUploader
  },
  created() {
    this.getColumns();
    this.getCategoryList();
    this.getMember();
    this.getNow();
    this.getStoreTagcategories();
  },
  watch: {
    motoristsClubList(newVaule) {
      if (newVaule.length > 0) {
        this.form.fleetId = newVaule[0].value;
        this.form.authorData.head = newVaule[0].head;
        this.form.authorData.name = newVaule[0].label;
      }
    },
    id(id) {
      this.$refs.form.resetFields();
      if (id === '') {
        this.clearForm();
        console.log('this.motoristsClubList[0]', this.motoristsClubList[0]);
        this.form.authorData.head = this.motoristsClubList[0].head;
        this.form.authorData.name = this.motoristsClubList[0].label;
        this.getStoreTagcategories();
        this.editorDisabled = false;
      } else {
        this.getColumns();
      }
    },
    author(newValue) {
      this.authorName = newValue;
    }
  },
  computed: {
    ...mapGetters(['getUser']),
    getUeditorType() {
      if (this.infoType === '2') {
        return 'standard';
      }
      return 'video';
    },
    activedFleet() {
      for (const iterator of this.motoristsClubList) {
        if (iterator.value === this.form.fleetId) {
          return iterator;
        }
      }
      return {
        label: ''
      };
    }
  },
  methods: {
    handleTestDriveUpload(res, file, fileList) {
      if (res.resultCode === '100') {
        let arr = [];
        arr.push({ name: res.urls[0], url: res.urls[0] });
        this.dynamicVideos = arr;
      }
    },
    handleTestDriveRemove(file, fileList) {
      this.dynamicVideos = [];
    },
    onAddSuccess() {
      this.getStoreTags();
    },
    onTypeChange(value) {
      this.form.typeList.forEach((item, index) => {
        if (value === index.toString()) {
          this.curTagId = item.id;
          this.getStoreTags();
          return false;
        }
      });
    },
    getStoreTags() {
      let param = {
        shopId: window.top.SHOP_ID || '',
        tagCategoryId: this.curTagId
      };
      http
        .get(urls.systemSetting.storeTags, param)
        .then(data => {
          this.tagList = data.content;
        })
        .catch(error => {
          console.log(error.errorMessage);
        });
    },
    getStoreTagcategories() {
      let param = {
        categoryType: '资讯文章/内容分类',
        shopId: window.top.SHOP_ID || ''
      };
      http
        .get(urls.systemSetting.storeTagcategories, param)
        .then(data => {
          this.form.typeList = data.content;
          if (this.form.typeList.length) {
            this.form.type = '0';
            this.curTagId = this.form.typeList[0].id;
          } else {
            this.form.type = '无数据';
            this.curTagId = '';
          }
          this.getStoreTags();
        })
        .catch(error => {
          console.log(error.errorMessage);
        });
    },
    onChange(value) {
      this.motoristsClubList.forEach(item => {
        if (item.value === value) {
          this.form.authorData.head = item.head;
          this.form.authorData.name = item.label;
        }
      });
    },
    clearForm() {
      this.form.fleetId = this.motoristsClubList[0].value;
      this.form.dynamicTitle = '';
      this.form.dynamicContent = '';
      this.form.type = '';
      this.isCreated = true;
      this.form.articleCategoryId = '';
      this.form.columnSelList = ['推荐'];
      this.form.typeList = [];
      this.tagList = [];
      this.selectedTags = [];
      this.dynamicImages = [];
      this.dynamicVideos = [];
      this.$nextTick(() => {
        this.isCreated = false;
      });
    },
    getNow() {
      this.now = date.nowDate();
    },
    getMember() {
      this.member = this.getUser;
    },
    // 预览车友会动态
    previewDynamic() {
      this.previewDialogOpen = true;
      if (this.id === '') {
        this.authorName = this.activedFleet ? this.activedFleet.label : '';
      }
    },
    closePreviewDialog() {
      this.previewDialogOpen = false;
    },
    operate(name) {
      this[name]();
    },
    publish() {
      this.$refs.form.validate(valid => {
        if (valid) {
          console.log(this.form.columnSelList);
          let arr = [];
          this.form.columnSelList.map(item => {
            this.form.columns.map(element => {
              if (item === element.name) {
                arr.push({ id: element.id, name: element.name });
              }
            });
            this.form.columnSelList = arr;
          });
          switch (this.infoType) {
            // 动态
            case '0':
              if (this.id === '') {
                if (this.form.dynamicContent === '') {
                  this.$notify({
                    title: '警告',
                    message: '请输入动态正文',
                    type: 'warning'
                  });
                  return;
                }
                this.publishDynamic();
              } else {
                this.updateDynamic();
                // this.tagMapping('1');
              }
              break;
            // 问答
            case '2':
              if (this.id === '') {
                this.publishTopic();
              } else {
                this.updateTopic();
                // this.tagMapping('2');
              }
              break;
            default:
              break;
          }
        }
      });
    },
    updateTopic() {
      let params = {
        id: this.id,
        fleet: {
          id: this.form.fleetId
        },
        content: this.form.dynamicContent,
        columnList: this.form.columnSelList,
        images: this.dynamicImages,
        videos: this.dynamicVideos.length ? [this.dynamicVideos[0].url] : []
      };

      DynamicSer.updateTopic(
        params,
        data => {
          this.$message.success('保存成功');
          this.$emit('updateTopic');
          this.$emit('created');
        },
        ErrorData => {
          this.$message.warning(ErrorData.errorMessage);
        }
      );
    },
    // 发布问答
    publishTopic() {
      let params = {
        title: this.form.dynamicTitle,
        content: this.form.dynamicContent,
        fleet: {
          id: this.form.fleetId
        },
        columnList: this.form.columnSelList,
        images: this.dynamicImages,
        videos: this.dynamicVideos.length ? [this.dynamicVideos[0].url] : []
      };

      http
        .post(urls.motoristsClubDynamic.createTopic, params)
        .then(data => {
          this.$message.success('操作成功');
          this.$emit('created');
          // this.tagMapping('2', data.id);
        })
        .catch(error => {
          this.$message.warning(error.errorMessage);
        });
    },
    tagMapping(type, id = '') {
      let param = {
        type: type,
        tags: this.$refs.tagSelect.getCurSelectedTags(),
        category: this.form.typeList.length ? this.form.typeList[parseInt(this.form.type)].name : ''
      };
      param.refId = id !== '' ? id : this.id;
      http
        .post(urls.systemSetting.tagMapping, param)
        .then(data => {
          console.log('映射成功');
        })
        .catch(error => {
          console.log(error.errorMessage);
        });
    },
    // 发布动态
    publishDynamic() {
      // 此处需要检查图片或者视频的删除情况
      this.dynamicImages = StrToHtml.textToImageSrc(this.form.dynamicContent);
      this.dynamicVideos = StrToHtml.textToVideoSrc1(this.form.dynamicContent);
      let videos = StrToHtml.contentToVideoSrc(this.form.dynamicContent);
      this.dynamicVideos = this.dynamicVideos.concat(videos);

      let params = {
        fleet: {
          id: this.form.fleetId
        },
        title: this.form.dynamicTitle,
        content: this.form.dynamicContent,
        images: this.dynamicImages,
        videos: this.dynamicVideos,
        columnList: this.form.columnSelList
      };
      http
        .post(urls.motoristsClubDynamic.createDynamic, params)
        .then(data => {
          this.$message.success('操作成功');
          this.$emit('created');
          // this.tagMapping('1', data.id);
        })
        .catch(error => {
          this.$message.warning(error.errorMessage);
        });
    },
    // 更新动态
    updateDynamic() {
      // 此处需要检查图片或者视频的删除情况
      this.dynamicImages = StrToHtml.textToImageSrc(this.form.dynamicContent);
      this.dynamicVideos = StrToHtml.textToVideoSrc1(this.form.dynamicContent);
      let videos = StrToHtml.contentToVideoSrc(this.form.dynamicContent);
      this.dynamicVideos = this.dynamicVideos.concat(videos);

      let params = {
        id: this.id,
        fleet: {
          id: this.form.fleetId
        },
        title: this.form.dynamicTitle,
        content: this.form.dynamicContent,
        images: this.dynamicImages,
        videos: this.dynamicVideos,
        columnList: this.form.columnSelList
      };
      DynamicService.updateDynamic(
        params,
        data => {
          this.$message.success('操作成功');
          this.$emit('created');
        },
        ErrorData => {
          console.log(ErrorData);
          this.$message.warning(ErrorData.errorMessage);
        }
      );
    },
    emojiChoosed(key) {
      this.textarea = this.textarea.concat(key);
    },
    pictureUploadSuccess(response, file, fileList) {
      this.pictureList = fileList;
    },
    pictureRemoveSuccess(file, fileList) {
      this.pictureList = fileList;
    },
    beyondLimit() {
      this.$message({
        message: '最多只能上传9张图片',
        type: 'warning'
      });
    },
    typeChange(value) {
      if (value === '2') {
        this.getCategoryList();
      }
      this.operations[0].disabled = true;
      if (value === '0' || value === '1') {
        this.operations[0].disabled = false;
      }
    },
    getCategoryList() {
      let params = {
        shopId: window.top.SHOP_ID || ''
      };
      DynamicService.getArticleTypeList(
        params,
        data => {
          this.categoryList = data.articleCategorys;
          if (this.categoryList.length > 1) {
            this.form.articleCategoryId = this.categoryList[0].id;
          }
        },
        ErrorData => {
          console.log(ErrorData);
        }
      );
    },
    getTagMapping(type, id) {
      this.selectedTags = [];
      let param = {
        refId: id,
        type: type
      };
      http
        .get(urls.systemSetting.tagMapping, param)
        .then(data => {
          console.log('查看映射信息', data);
          if (data.data.tags && data.data.tags.length) {
            this.selectedTags = data.data.tags;
          }

          if (data.data.category) {
            this.form.typeList.forEach((item, index) => {
              if (item.name === data.data.category) {
                this.form.type = index.toString();
              }
            });
          } else {
            if (this.form.typeList.length) {
              this.form.type = '0';
            } else {
              this.form.type = '无数据';
            }
          }
          this.curTagId = this.form.typeList.length ? this.form.typeList[parseInt(this.form.type)].id : '';
          this.getStoreTags();
        })
        .catch(error => {
          console.log(error.errorMessage);
        });
    },
    refresh(id) {
      let params;
      let curId;
      if (id) {
        curId = id;
      } else {
        curId = this.id;
      }
      this.loading = true;
      if (this.infoType === '2') {
        this.dynamicVideos = [];
        this.dynamicImages = [];
        // this.getTagMapping('2', curId);
        console.log('选择问答');
        params = {
          topicId: curId
        };
        this.isCreated = true;
        DynamicSer.selectTopic(
          params,
          data => {
            this.loading = false;
            this.form.authorData = data.data.authorData || {};
            this.form.dynamicContent = data.data.content || '';
            this.dynamicImages = data.data.images || [];
            this.form.fleetId = data.data.fleet ? data.data.fleet.id : '无';
            this.fleet = data.data.fleet || {};
            this.form.dynamicTitle = data.data.title;
            let arr = [];
            data.data.columnList.map(item => {
              arr.push(item.name);
            });
            this.form.columnSelList = arr || [];
            if (data.data.videos.length > 0) {
              this.dynamicVideos.push({ name: data.data.videos[0], url: data.data.videos[0] });
            }
            this.$nextTick(() => {
              this.isCreated = false;
            });
          },
          ErrorData => {
            this.loading = false;
            this.$nextTick(() => {
              this.isCreated = false;
            });
            console.log(ErrorData);
          }
        );
      } else {
        // this.getTagMapping('1', curId);
        console.log('选择动态');
        params = {
          spaceId: curId
        };
        this.isCreated = true;
        DynamicService.selectDynamic(
          params,
          data => {
            this.loading = false;
            this.form.authorData = data.data.authorData || {};
            this.form.dynamicContent = data.data.content || '';
            this.form.fleetId = data.data.fleet ? data.data.fleet.id : '无';
            this.fleet = data.data.fleet || {};
            this.form.dynamicTitle = data.data.title;
            let arr = [];
            data.data.columnList.map(item => {
              arr.push(item.name);
            });
            this.form.columnSelList = arr || [];
            this.$nextTick(() => {
              this.isCreated = false;
            });
            this.editorDisabled = true;
          },
          ErrorData => {
            this.loading = false;
            console.log(ErrorData);
          }
        );
      }
    },
    getColumns() {
      http
        .get(urls.motoristsClubDynamic.visibleColumns)
        .then(data => {
          this.form.columns = data.content;
        })
        .catch(error => {
          console.log(error.errorMessage);
        });
    }
  }
};
</script>

<style lang="scss">
.dynamic {
  .biz-popup .popup-content .el-tabs .el-tabs__content {
    overflow-y: auto;
  }
  .biz-save-button {
    justify-content: flex-start;
  }
  .column-style {
    display: inline-block;
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
  .el-form {
    height: 100%;
    overflow: auto;
    padding-bottom: 20px;
    padding-right: 30px;
    .biz-editor {
      padding-left: 0;
    }
  }
  .logo-uploader {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    width: 178px;
    &:hover {
      border-color: #409eff;
    }
    .avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 178px;
      height: 178px;
      line-height: 178px;
      text-align: center;
    }
    .logo {
      width: 178px;
      height: 178px;
      display: block;
    }
  }
  .publish {
    .editor-label {
      display: block;
      color: #606266;
      font-size: 14px;
    }
    padding-left: 40px;
    .content {
      textarea {
        padding: 5px;
      }
    }
    .footer {
      display: flex;
      align-items: center;
      button {
        display: flex;
        align-items: center;
        span {
          margin-left: 5px;
          color: #989898;
          font-size: 14px;
        }
      }
      .iconfont {
        font-size: 20px;
      }
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
          // background-color: red;
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
.topic-preview {
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
        // background-color: red;
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
      .detail {
        display: flex;
        .image {
          width: 120px;
          height: 120px;
          img {
            width: auto;
            height: auto;
            max-width: 100%;
            max-height: 100%;
          }
        }
        .right {
          .title {
            font-weight: 600;
          }
          .fleet,
          .time {
            font-size: 13px;
          }
        }
      }
      .block {
        height: 10px;
        width: 100%;
        background-color: #efeef4;
        margin: 20px 0;
      }
      .desc {
        font-weight: 500;
      }
    }
  }
}
.dynamic-popover-picture {
  .el-upload-list__item {
    width: 120px;
    height: 120px;
    .el-progress {
      width: 100px;
      height: 100px;
      .el-progress-circle {
        width: 100px !important;
        height: 100px !important;
      }
    }
  }
  .el-upload {
    width: 120px;
    height: 120px;
  }
}
</style>
