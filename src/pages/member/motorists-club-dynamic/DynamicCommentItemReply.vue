<template>
  <div class="dynamic-comment-item-reply">

    <!-- 回复窗口 -->
    <el-popover ref="popoverpicture" placement="bottom-end" popper-class="dynamic-comment-item-reply-popover" :offset="offset" width="430"
      trigger="click" @show="clearInput">
      <el-input type="textarea" :rows="2" v-model="input" :placeholder="holder"></el-input>
      <el-button @click="reply" size="mini">回复</el-button>
    </el-popover>
    <span v-popover:popoverpicture class="name">
      <slot></slot>
    </span>
  </div>
</template>

<script>
export default {
  name: 'DynamicCommentItemReply',
  data() {
    return { input: '', offset: 0 };
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
    }
  },
  components: {},
  computed: {
    holder() {
      return '回复' + this.name;
    }
  },
  methods: {
    clearInput() {
      this.input = '';
    },
    reply() {
      if (this.input === '') {
        this.$notify({
          title: '警告',
          message: '内容不能为空',
          type: 'warning'
        });
        return;
      }
      this.$emit('reply', this.input);
      this.$refs.popoverpicture.doClose();
    }
  }
};
</script>

<style lang="scss">
.dynamic-comment-item-reply {
  height: 100%;
  display: inline-block;
  vertical-align: middle;
}
.dynamic-comment-item-reply-popover {
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
