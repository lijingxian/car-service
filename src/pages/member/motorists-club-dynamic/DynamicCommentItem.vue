<template>
  <div class="dynamic-comment-item">
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
      <div class="content" v-html="comment.content">
      </div>
      <div class="handle">
        <dynamic-comment-item-reply class="p-btn"
                                    @reply="reply"
                                    :relative="relative"
                                    :name="comment.member.nickname">
          <i class="iconfont biz-icon-message2"></i>
          {{comment.commentCount}}
        </dynamic-comment-item-reply>
        <div class="p-btn">
          <i @click="support"
             :class="{active:comment.isSupport==='1'}"
             class="iconfont biz-icon-dianzan_normal"></i>
          <div class="p-number">{{comment.supportCount}}</div>
        </div>
        <div class="p-btn">
          <i @click="deleteComment"
             class="el-icon-delete"></i>
        </div>
      </div>
      <div class="second-comments"
           v-show="comment.comments">
        <div class="s-comment"
             v-for="sComment of comment.comments"
             :key="sComment.id">
          <div class="s-name">{{sComment.member.nickname}}：</div>
          <div class="s-content">{{sComment.content}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import DynamicCommentItemReply from './DynamicCommentItemReply';
import DefaultAvatar from '@/assets/images/default_user.png';

export default {
  name: 'DynamicCommentItem',
  data() {
    return {
      input: '',
      DefaultAvatar
    };
  },
  props: {
    relative: {
      type: Number,
      required: true
    },
    comment: Object
  },
  components: {
    DynamicCommentItemReply
  },
  methods: {
    reply(content) {
      this.$emit('reply', { id: this.comment.id, content: content });
    },
    support() {
      this.$emit('support', this.comment.id);
    },
    deleteComment() {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$emit('deleteComment', this.comment.id);
        })
        .catch(() => {});
    }
  }
};
</script>

<style lang="scss">
.dynamic-comment-item {
  margin: 15px 0;
  padding: 0 10px;
  & > .info {
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
      img {
        width: 16px;
        height: 16px;
      }
    }
    .handle {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      .p-btn {
        display: flex;
        align-items: center;
        flex-direction: row;
        font-size: 12px;
        margin-right: 40px;
        i {
          line-height: 25px;
        }
        .el-icon-delete,
        .biz-icon-message1,
        .biz-icon-message2,
        .biz-icon-dianzan_normal {
          &:hover {
            color: #ff7300;
            cursor: pointer;
          }
        }
        .biz-icon-dianzan_normal.active {
          color: #ff7300;
        }
        .biz-icon-dianzan_normal.active {
          color: #ff7300;
        }
        .p-number {
          margin-left: 3px;
        }
      }
    }
    > .second-comments {
      background-color: #f5f5f5;
      padding: 10px;
      border-radius: 5px;
      .s-comment {
        font-size: 13px;
        margin: 3px 5px;
        letter-spacing: 1px;
        .s-name {
          color: #ff7300;
          display: inline;
        }
        .s-content {
          color: #868686;
          display: inline;
        }
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
