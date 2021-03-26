<template>
  <div class="tag-manager">
    <div class="tag-manager__list" v-show="rawTags.length > 0">
      <el-tag v-for="tag in rawTags" :key="tag[nameField]" :closable="tag.isAttend !== '1' || closable" :disable-transitions="false"
        :type="tag.type" size="small" @close="handleClose(tag, $event)" @click.native="handleClick(tag, $event)">
        {{tag[nameField]}}
      </el-tag>
    </div>
    <el-input placeholder="请输入内容" v-model="tagName" :maxlength="maxlength">
      <el-button slot="append" @click="appendTag">添加</el-button>
    </el-input>
  </div>
</template>

<script>
export default {
  name: 'TagManager',
  data() {
    return {
      tagName: '',
      rawTags: []
    };
  },
  props: {
    value: {
      type: Array
    },
    maxlength: {
      type: Number,
      default() {
        return 20;
      }
    },
    nameField: {
      type: String,
      default() {
        return 'content';
      }
    },
    removeHandler: {
      type: Function,
      default() {
        return null;
      }
    },
    closable: {
      type: Boolean,
      default() {
        return false;
      }
    }
  },
  created() {
    this.rawTags = this.value || [];
  },
  methods: {
    hasOne(name) {
      for (let tag of this.rawTags) {
        if (tag[this.nameField] === name) return true;
      }
      return false;
    },
    resetTagName() {
      this.tagName = '';
    },
    appendTag() {
      if (this.tagName) {
        if (this.hasOne(this.tagName)) {
          this.resetTagName();
          return;
        }

        let obj = {};
        obj[this.nameField] = this.tagName;
        this.rawTags.push(obj);

        this.resetTagName();

        this.$emit('input', this.rawTags);
      }
    },
    handleClose(tag, e) {
      e.stopPropagation();
      console.log(tag);
      if (this.removeHandler) {
        // this.removeHandler(tag, this.rawTags) && this.rawTags.splice(this.rawTags.indexOf(tag), 1);
        this.rawTags.splice(this.rawTags.indexOf(tag), 1);
      } else {
        this.rawTags.splice(this.rawTags.indexOf(tag), 1);
      }
      console.log('this.rawTags' + this.rawTags);
      this.$emit('input', this.rawTags);
    },
    handleClick(tag, e) {
      this.$emit('item-click', tag, e);
    }
  },
  watch: {
    value(newValue) {
      this.rawTags = newValue || [];
    }
  }
};
</script>

<style lang="scss">
.tag-manager {
  > .tag-manager__list {
    margin-bottom: 10px;

    > .el-tag {
      margin-right: 5px;
    }
  }
}
</style>
