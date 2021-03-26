<template>
  <div class="topic-editor">
    <biz-save-button slot="top" :operations="operations" @operate="operate">
    </biz-save-button>
    <el-form ref="form" label-width="100px" size="small" v-loading="loading" :inline-message="true">
      <el-form-item label="车友会">
        <el-select :value="topic.fleet.id" disabled>
          <el-option :label="topic.fleet.name" :value="topic.fleet.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="类型">
        <el-select value='1' disabled>
          <el-option label="车友会话题" value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="话题logo" :required="true">
        <BizAvatarUploaderNew v-model="topic.pic">
        </BizAvatarUploaderNew>
      </el-form-item>
      <el-form-item label="内容">
        <el-input disabled placeholder="请输入话题" v-model="topic.content"></el-input>
      </el-form-item>
      <el-form-item label="置顶">
        <el-radio v-model="topic.isTop" label="1">是</el-radio>
        <el-radio v-model="topic.isTop" label="0">否</el-radio>
      </el-form-item>
      <el-form-item label="导语" prop="topicIntroduction">
        <el-input placeholder="请输入导语" type="textarea" maxlength="100" v-model="topic.introduction"></el-input>
      </el-form-item>
    </el-form>
    <el-dialog append-to-body class="topic-preview" title="预览" :visible="previewDialogOpen" @close="previewDialogOpen = false;"
      width="450px">
      <div class="bg" :style="{ background: background}">
        <div class="cpreview">
          <div class="detail">
            <div class="image">
              <img :src="topic.pic" alt="">
            </div>
            <div class="right">
              <div class="title">
                #{{topic.content}}#
              </div>
              <div class="fleet">
                {{topic.fleet.name}}
              </div>
              <div class="time">
                {{topic.createDatetime}}
              </div>
            </div>
          </div>
          <div class="block"></div>
          <div class="desc">导语：{{topic.introduction}}</div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import BizSaveButton from '@/components/BizSaveButton';
import phoneB from '@/assets/images/iphone-b.png';
import ClubDynamicService from '@/service/motorists-club-dynamic/motoristsClubDynamic';
import { BizAvatarUploaderNew } from '@/components/BizForm';

export default {
  name: 'TopicEditor',
  data() {
    return {
      previewDialogOpen: false,
      loading: false,
      fileData: {
        type: '0'
      },
      background: 'url(' + phoneB + ') no-repeat no-repeat',
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
      ]
    };
  },
  components: {
    BizSaveButton,
    BizAvatarUploaderNew
  },
  props: {
    topic: {}
  },

  methods: {
    operate(name) {
      this[name]();
    },
    handleLogoSuccess(url) {
      this.topic.pic = url;
    },
    save() {
      if (this.topic.pic === '') {
        this.$message.warning('请上传话题logo');
        return;
      }
      let params = {
        isTop: this.topic.isTop,
        id: this.topic.id,
        fleet: {
          id: this.topic.fleet.id
        },
        pic: this.topic.pic,
        content: this.topic.content,
        introduction: this.topic.introduction
      };

      ClubDynamicService.updateTopic(
        params,
        data => {
          this.$message.success('保存成功');
          this.$emit('updateTopic');
          this.$emit('created');
        },
        ErrorData => {
          console.log(ErrorData);
        }
      );
    },
    preview() {
      this.previewDialogOpen = true;
    }
  }
};
</script>

<style lang="scss">
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

.topic-editor {
  .biz-save-button {
    float: left;
  }
  .publish {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    padding: 10px 20px;
    .content {
      width: 100%;
      textarea {
        padding: 5px;
      }
    }
    .el-button {
      margin: 10px;
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
}
</style>
