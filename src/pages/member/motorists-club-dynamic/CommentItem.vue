<template>
  <div class="comment-item">
    <div class="info">
      <div class="person">
        <div class="avatar">
          <img :src="comment.member.head||DefaultAvatar"
               alt="">
        </div>
        <div class="name-time">
          <div class="name">{{comment.member.nickname}}</div>
          <div class="time">{{comment.publishDate}}</div>
        </div>
      </div>
      <div class="content">
        <span v-html="comment.content"></span>
      </div>
      <div class="content">
        <img :src="images" v-for="images in comment.images" :key="images" width="100px"/>
        <video v-if="comment.videos.length!==0" controls :src="comment.videos[0]" class="content-videos"></video>
      </div>
      <div class="handle">
        <div class="p-btn">
          <i class="iconfont biz-icon-eye"></i>
          <div class="p-number">{{comment.readCount}}</div>
        </div>
        <ReplyName class="p-btn reply-commen"
                   :space="space"
                   :relative="relative"
                   :name="comment.member.nickname||''"
                   @updated="getSpace">
          <i class="iconfont biz-icon-message2"></i>{{comment.commentCount}}
        </ReplyName>
        <div class="p-btn">
          <i class="iconfont"
             @click="thumbsUp"
             :class="zanClass"></i>
          <div class="p-number">{{comment.supportCount}}</div>
        </div>
      </div>
    </div>
    <div class="comments"
         v-if="content.length>0">
      <div class="comment"
           v-for="commentt of content"
           :key="commentt.id">
        <ReplyName class="p-btn"
                   :space="space"
                   :comment="commentt"
                   :relative="relative1"
                   :name="commentt.member.nickname"
                   @updated="getSpace">
          <span class="name">
            {{commentt.member.nickname}}
          </span>
        </ReplyName>
        <span class="content">{{commentt.content}}</span>
      </div>
    </div>
  </div>
</template>

<script>
import ReplyName from './ReplyName';
import CommentService from '@/service/motorists-club-dynamic/dynamicComment';
import DynamicService from '@/service/motorists-club-dynamic/motoristsClubDynamic';
import DefaultAvatar from '@/assets/images/default_user.png';

export default {
  name: 'CommentItem',
  data() {
    return {
      DefaultAvatar: DefaultAvatar,
      input: '',
      content: [],
      relative1: 450
    };
  },
  props: {
    relative: {
      type: Number,
      required: true
    },
    comment: Object,
    space: Object,
    topicTitle: {
      type: String
    }
  },
  computed: {
    spaceId() {
      return this.comment.id;
    },
    zanClass: function() {
      return {
        'biz-icon-dianzan_normal': this.comment.isSupport !== '1',
        active: this.comment.isSupport === '1',
        'biz-icon-dianzan_press': this.comment.isSupport === '1'
      };
    }
  },
  mounted() {
    this.getSpace();
  },
  components: {
    ReplyName
  },
  methods: {
    getSpace() {
      let params = {
        spaceId: this.spaceId,
        pageable: {
          pageNumber: 1,
          pageSize: 100
        }
      };
      CommentService.getCommentList(
        params,
        data => {
          console.log(data);
          this.content = data.content;
          this.$emit('refreshComment');
        },
        ErrorData => {
          console.log(ErrorData);
        }
      );
    },
    // 点赞
    thumbsUp() {
      let params = {
        spaceId: this.spaceId
      };
      DynamicService.thumbsUp(
        params,
        data => {
          this.$emit('change-thumb-up');
        },
        ErrorData => {
          console.log(ErrorData);
        }
      );
    }
  }
};
</script>

<style lang="scss">
.comment-item {
  margin: 15px 0;
  padding: 0 10px;
  .reply-commen{
    cursor: pointer;
  }
  & > .info {
    .content-videos{
      max-width: 500px;
      max-height: 300px;
    }
    .person {
      display: flex;
      align-items: center;
      margin: 0 0 10px 0;
      .avatar {
        display: flex;
        align-items: center;
        img {
          width: 34px;
          height: 34px;
          border-radius: 17px;
        }
      }
      .name-time {
        margin-left: 20px;
        .name {
          font-size: 14px;
          font-weight: bold;
        }
        .time {
          margin-top: 4px;
          font-size: 13px;
          color: #666;
        }
      }
    }
    > .content {
      font-size: 15px;
      margin: 5px 0;
      word-wrap: break-word;
    }
    .content-title{
      color: #ff7300;
    }
    .topic-item {
      color: #f98803;
    }
    .handle {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      .p-btn {
        display: flex;
        align-items: center;
        font-size: 12px;
        margin-right: 40px;
        i {
          line-height: 25px;
          color: #929292;
        }
        .biz-icon-message1,
        .biz-icon-dianzan_normal,
        .biz-icon-dianzan_press {
          &:hover {
            color: #ff7300;
            cursor: pointer;
          }
        }
        .biz-icon-dianzan_normal.active {
          color: #ff7300;
        }
        i.active {
          color: #ff7300;
        }
        .p-number {
          margin-left: 3px;
        }
      }
    }
  }
  & > .comments {
    background-color: #f4f4f4;
    padding: 10px;
    border-radius: 5px;
    .comment {
      font-size: 14px;
      margin: 3px 5px;
      letter-spacing: 1px;
      .name {
        color: #ff7300;
        cursor: pointer;
      }
      .reply {
        margin: 0 1px;
        color: #868686;
      }
      .content {
        color: #868686;
      }
      span {
        display: inline;
      }
    }
  }
}

.comment-item-reply-popover {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  .el-button {
    margin-top: 5px;
  }
}
</style>
