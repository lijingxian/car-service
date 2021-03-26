<template>
  <div class="topic">
    <div class="publish">
      <div class="editor">
        <biz-editor v-model="form.dynamicContent" width="450px" :hasVideo="true">
        </biz-editor>
      </div>
      <el-button size="small" @click="publish" type="primary">发布</el-button>
    </div>
    <div class="topic-detail">
      <div class="header">
        <div class="avatar">
          <img :src="(topic.authorData&&topic.authorData.head)||DefaultAvatar" alt="">
        </div>
        <div class="right-detail">
          <div class="title">#{{topic.title}}#</div>
          <div class="from">
            <div class="name">{{topic.creator.nickname}}</div>
            <div class="detail">{{topic.createDatetime}}</div>
          </div>
        </div>
      </div>
      <div class="content">
        {{topic.introduction}}
      </div>
    </div>
    <div class="comment-list">
      <div v-for="(comment,index) of spaces" :key="comment.id">
        <comment-item @change-thumb-up="changeThumbUp" :comment="comment" :space="comment" :relative="relative" @refreshComment="updateTopic" :topicTitle="topic.title">
        </comment-item>
        <div class="line" v-if="!(index+1 === spaces.length)"></div>
      </div>
    </div>
  </div>
</template>

<script>
import CommentItem from './CommentItem';
import StrToHtml from '@/utils/StrToHtml.js';
import { BizEditor } from '@/components/BizEditorH';
import http from '@/common/http';
import urls from '@/common/urls';
import DefaultAvatar from '@/assets/images/default_user.png';

export default {
  name: 'Topic',
  data() {
    return {
      DefaultAvatar: DefaultAvatar,
      relative: 460,
      textarea: '',
      dynamicVideos: [],
      form: {
        fleetId: '',
        type: '0',
        dynamicTitle: '',
        dynamicContent: '',
        topicContent: '',
        topicLogoImageUrl: '',
        topicIntroduction: '',
        articleCategoryId: ''
      }
    };
  },
  components: {
    CommentItem,
    BizEditor
  },
  props: {
    topic: Object,
    spaces: Array
  },
  computed: {
    dynamicImages() {
      let images = [];
      images = StrToHtml.textToImageSrc(this.form.dynamicContent);
      return images;
    }
  },
  watch: {
    spaces(val) {
      if (val && val.length) {
        val.forEach(comment => {
          let content = comment.content.split('#')[1];
          let reg = new RegExp(`#${content}#`, 'g');
          comment.content = comment.content.replace(reg, `<span style="color:#ff7300;">#${content}#</span>`);
        });
      }
    },
    topic(newVal, oldVal) {
      if (newVal.fleet && newVal.fleet.id) {
        this.form.dynamicContent = '';
        this.form.fleetId = newVal.fleet.id;
      }
    }
  },
  methods: {
    operate(name) {
      this[name]();
    },
    updateTopic() {
      this.$emit('updateTopic');
    },
    // 发布问答
    publish() {
      // 此处需要检查视频的删除情况
      this.dynamicVideos = StrToHtml.textToVideoSrc1(this.form.dynamicContent);

      let params = {
        fleet: {
          id: this.form.fleetId
        },
        title: this.form.dynamicTitle,
        content: `<a style="color:#ff7300;" href="#/community/qa/${this.topic.id}">#${this.topic.title}#</a>` + this.form.dynamicContent,
        images: this.dynamicImages,
        videos: this.dynamicVideos,
        topics: [this.topic]
      };
      http
        .post(urls.motoristsClubDynamic.createDynamic, params)
        .then(data => {
          this.$message.success('操作成功');
          this.$emit('updateTopic');
          this.form.dynamicContent = '';
        })
        .catch(error => {
          this.$message.warning(error.errorMessage);
        });
    },
    changeThumbUp() {
      this.$emit('change-thumb-up');
    }
  }
};
</script>

<style lang="scss">
.topic {
  .publish {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    padding: 10px 20px;
    .editor {
      width: 100%;
      textarea {
        padding: 5px;
      }
    }
    .el-button {
      margin: 10px;
    }
  }
  > .topic-detail {
    padding-bottom: 20px;
    border-bottom: #eee solid 10px;
    .header {
      display: flex;
      margin-bottom: 10px;
      padding: 0 30px;
      .avatar {
        width: 55px;
        margin-right: 10px;
        img {
          width: 50px;
          height: 50px;
        }
      }
      .right-detail {
        .title {
          font-size: 16px;
          color: #ff7300;
          margin-bottom: 7px;
          cursor: pointer;
        }
        .from {
          display: flex;
          align-items: center;
          .name {
            font-size: 14px;
            margin-right: 10px;
          }
          .detail {
            color: #808080;
            font-size: 12px;
          }
        }
        .content {
          font-size: 14px;
          font-weight: 400px;
          color: #333;
        }
      }
    }
    > .content {
      padding: 0 30px;
      color: #868686;
      font-size: 14px;
    }
  }
  .comment-list {
    .comment-item {
      padding: 0 30px;
    }
    .line {
      height: 2px;
      width: 100%;
      background-color: #eee;
    }
    margin-bottom: 150px;
  }
}
</style>
