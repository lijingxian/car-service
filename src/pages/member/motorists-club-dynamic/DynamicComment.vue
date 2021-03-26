<template>
  <div class="dynamic-comment">
    <div class="comment">
      <div class="title">
        {{title}}
      </div>
      <div class="content" v-html="getContent(comment)">
      </div>
      <el-input type="textarea" :rows="4" ref="elinput" placeholder="请输入评论内容" v-model="comment">
      </el-input>
      <div class="operator">

        <el-popover ref="popover" width="430" placement="bottom-start" trigger="click">
          <i class="iconfont biz-icon-biaoqing" slot="reference">
            <span>表情</span>
          </i>

          <biz-emoji-picker @choosed="chooseEmoji">
          </biz-emoji-picker>
        </el-popover>
        <el-button size="small" @click="reply" type="primary">评论</el-button>
      </div>
    </div>
    <div class="comment-list">
      <div v-for="(comment,index) of commentList" :key="comment.id">
        <dynamic-comment-item @support="support" @deleteComment="deleteComment" @reply="itemReply" :comment.sync="comment" :relative="relative">
        </dynamic-comment-item>
        <div class="line" v-if="!(index+1 === commentList.length)"></div>
      </div>
    </div>
  </div>
</template>

<script>
import BizEmojiPicker from '@/components/BizEmojiPicker';
import emoji from '@/utils/emoji';
import DynamicCommentItem from './DynamicCommentItem';
import CommentService from '@/service/motorists-club-dynamic/dynamicComment';

export default {
  name: 'DynamicComment',
  data() {
    return {
      relative: 450,
      commentList: [],
      comment: '',
      temp: ''
    };
  },
  props: {
    title: String,
    dynamicId: {
      type: String,
      default: ''
    }
  },
  components: {
    BizEmojiPicker,
    DynamicCommentItem
  },
  created() {
    this.getCommentList();
  },
  watch: {
    dynamicId: function(dynamicId) {
      if (!(dynamicId === '')) {
        this.getCommentList();
      }
    }
  },
  methods: {
    operate(name) {
      this[name]();
    },
    getCommentList() {
      let params = {
        spaceId: this.dynamicId,
        pageable: {
          pageNumber: 1,
          pageSize: 100
        }
      };
      CommentService.getCommentList(
        params,
        data => {
          this.commentList = data.content;
          for (let iterator of this.commentList) {
            iterator.content = emoji.transform(iterator.content);
          }
        },
        ErrorData => {
          console.log(ErrorData);
        }
      );
    },
    getContent(content) {
      // let regExp = /\[.*?\]/g;
      // let contentTem = content.replace(regExp, '');
      // if (contentTem) {
      //   return '';
      // } else {
      //   return emoji.transform(content);
      // }
    },
    reply() {
      if (this.comment === '') {
        this.$notify({
          title: '警告',
          message: '评论内容不能为空',
          type: 'warning'
        });
        return;
      }
      let params = {
        spaceId: this.dynamicId,
        content: this.comment,
        spaceCommentId: ''
      };
      CommentService.reply(
        params,
        data => {
          this.comment = '';
          this.getCommentList();
          this.$message.success('评论成功');
          this.$emit('created');
        },
        ErrorData => {
          console.log(ErrorData);
        }
      );
    },
    deleteComment(id) {
      let ids = [];
      ids.push(id);
      let params = {
        ids: ids
      };
      CommentService.deleteCommnet(
        params,
        data => {
          this.$message.success('操作成功');
          this.getCommentList();
          this.$emit('created');
        },
        ErrorData => {
          console.log(ErrorData);
        }
      );
    },
    itemReply(payload) {
      let params = {
        spaceId: this.dynamicId,
        content: payload.content,
        spaceCommentId: payload.id
      };
      CommentService.reply(
        params,
        data => {
          this.$message.success('操作成功');
          this.getCommentList();
          this.$emit('created');
        },
        ErrorData => {
          console.log(ErrorData);
        }
      );
    },
    support(id) {
      let params = {
        spaceCommentId: id
      };
      CommentService.supportComment(
        params,
        data => {
          this.getCommentList();
          this.$emit('created');
        },
        ErrorData => {
          console.log(ErrorData);
        }
      );
    },
    chooseEmoji(val) {
      let start = this.$refs.elinput.$refs.textarea.selectionStart;
      let end = this.$refs.elinput.$refs.textarea.selectionEnd;
      this.comment =
        this.comment.slice(0, start) + val + this.comment.slice(end);
      this.$refs.popover.doClose();
    }
  }
};
</script>

<style lang="scss">
.dynamic-comment {
  margin-right: 20px;
  > .comment {
    padding: 5px 20px;
    .title {
      padding: 10px;
      font-weight: bold;
      color: #1a1a1a;
      font-size: 16px;
    }
    > .operator {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .biz-icon-biaoqing {
        font-size: 24px;
        margin-left: 10px;
        color: #ff7300;
        display: flex;
        align-items: center;
        cursor: pointer;
        span {
          font-size: 14px;
          color: #333;
          font-family: 'Microsoft YaHei', '微软雅黑';
        }
      }
      .el-button {
        margin: 5px;
      }
    }
  }
  .comment-list {
    .comment-item {
      padding: 5px 20px;
    }
    .line {
      height: 2px;
      width: 100%;
      background-color: #eee;
    }
  }
}
</style>
