<template>
  <div class="tag-panel">
    <el-input
      v-model="tagName"
      class="tag-panel__input"
      placeholder="请输入关键词，按回车添加新标签"
      :maxlength="maxlength"
      v-if="hasInput"

      @keyup.native.enter="handleSubmit"
    >
      <el-button slot="append" @click="handleSubmit">添加</el-button>
    </el-input>
    <div class="tag-manager__list" v-show="tags.length > 0">
      <el-tag
        v-for="(tag, index) in tags"
        :key="index"
        v-show="!excluded.includes(tag[nameField])"

        :closable="false"
        :disable-transitions="false"
        :type="tag.type"
        size="small"

        @click.native="handleClick(tag, $event)"
      >
        {{tag[nameField]}}
      </el-tag>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TagManager',
  data () {
    return {
      tagName: ''
    };
  },
  props: {
    maxlength: {
      type: Number,
      default() {
        return 20;
      }
    },
    nameField: {
      type: String,
      default () {
        return 'name';
      }
    },
    tags: {
      type: Array,
      default () {
        return [];
      }
    },
    excluded: {
      type: Array,
      default () {
        return [];
      }
    },
    hasInput: {
      type: Boolean,
      default () {
        return true;
      }
    }
  },
  created () {

  },
  methods: {
    resetTagName () {
      this.tagName = '';
    },
    handleSubmit () {
      if (this.tagName) {
        this.$emit('submit', this.tagName);
      }
    },
    clear () {
      this.tagName = '';
    },
    handleClick (tag, e) {
      this.$emit('item-click', tag, e);
    }
  },
  watch: {

  }
};
</script>

<style lang="scss">
.tag-panel {
  border: 1px solid #dcdfe6;
  border-radius: 5px;
  padding: 10px;

  .tag-manager__list {
    margin-top: 10px;

    .el-tag {
      margin-right: 10px;
      cursor: pointer;
    }
  }
}
</style>
