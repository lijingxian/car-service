<template>
  <div class="reply-name">

    <!-- 回复窗口 -->
    <el-popover ref="popoverpicture" v-model="show" placement="bottom-end" popper-class="reply-name-popover" :offset="offset" width="430" trigger="click">
      <el-input type="textarea" :rows="2" v-model="input" :placeholder="holder"></el-input>
      <el-button size="mini" @click="reply">回复</el-button>
    </el-popover>
    <span v-popover:popoverpicture class="name">
      <slot></slot>
    </span>
  </div>
</template>

<script>
import CommentService from '@/service/motorists-club-dynamic/dynamicComment';

export default {
  name: 'ReplyName',
  data() {
    return { input: '', offset: 0, show: false };
  },
  mounted() {
    // 动态计算偏移量
    this.offset = this.relative - this.$el.offsetLeft - this.$el.offsetWidth;
  },
  props: {
    name: {
      type: String,
      required: true
    },
    relative: {
      type: Number,
      required: true
    },
    space: Object,
    comment: Object
  },
  computed: {
    holder() {
      return '回复' + this.name;
    }
  },
  methods: {
    reply() {
      if (this.input === '') {
        this.$notify({
          title: '警告',
          message: '评论内容不能为空',
          type: 'warning'
        });
        return;
      }
      let params = {
        spaceId: this.space.id,
        content: this.input,
        spaceCommentId: this.comment ? this.comment.id : ''
      };
      CommentService.reply(
        params,
        data => {
          this.$emit('updated');
          this.show = false;
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
.reply-name {
  height: 100%;
  display: inline-block;
  vertical-align: middle;
}
.reply-name-popover {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  .el-button {
    margin-top: 10px;
  }
  .el-textarea {
    textarea {
      font-family: 'Microsoft YaHei', '\5FAE\8F6F\96C5\9ED1';
    }
  }
}
</style>
