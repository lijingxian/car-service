<template>
  <div class="tag-manager">
    <div class="tag-manager__list" v-show="rawTags.length > 0">
      <el-tag v-for="tag in rawTags" :key="tag[nameField]" :closable="tag.isAttend !== '1'" :disable-transitions="false" :type="tag.type"
        size="small" @close="handleClose(tag, $event)" @click.native="handleClick(tag, $event)">
        {{tag[nameField]}}
      </el-tag>
    </div>
    <!-- <el-input placeholder="请输入内容" v-model="tagName" :maxlength="maxlength">
      <el-button slot="append" @click="appendTag">添加</el-button>
    </el-input> -->
    <el-select v-model="tagName" allow-create filterable placeholder="请选择后点击添加" @change="change">
      <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
      </el-option>
    </el-select>
    <el-button slot="append" @click="appendTag">添加</el-button>
  </div>
</template>

<script>
export default {
  name: 'TagManager',
  data() {
    return {
      tagName: '',
      rawTags: [],
      options: [
        { label: '姓名', value: '姓名' },
        { label: '手机号', value: '手机号' },
        { label: '车牌号', value: '车牌号' },
        { label: '人数', value: '人数' }
      ]
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
      default: 'name'
    },
    removeHandler: {
      type: Function,
      default: null
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
          this.$message.warning('已添加此标签，不能重复添加');
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

      if (this.removeHandler) {
        this.removeHandler(tag, this.rawTags) &&
          this.rawTags.splice(this.rawTags.indexOf(tag), 1);
      } else {
        this.rawTags.splice(this.rawTags.indexOf(tag), 1);
      }

      this.$emit('input', this.rawTags);
    },
    handleClick(tag, e) {
      this.$emit('item-click', tag, e);
    },
    change() {
      this.$emit('change');
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
