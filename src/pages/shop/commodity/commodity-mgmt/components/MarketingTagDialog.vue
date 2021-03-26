<template>
  <el-dialog class="base-marketing-tag" title="选择标签" :visible.sync="dialogVisible" :append-to-body="true" @close="close">
    <div class="recommend-group">
      <el-tag v-for="tag of recommendMarketTags" :key="tag.id" type="info" size="mini" @click="addRecommendMarketTag(tag)">{{ tag.name }}</el-tag>
    </div>
    <div class="tag-group">
      <el-tag v-for="tag of totalTags" :key="tag.id" closable size="mini" @close="removeMarketTag(tag.id)">{{ tag.name }}</el-tag>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button size="small" @click="dialogVisible = false">取消</el-button>
      <el-button size="small" type="primary" @click="confirmed">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'BaseMarketingTag',
  components: {},
  props: {
    visibility: {
      require: true,
      type: Boolean
    },
    tags: {
      require: true,
      type: Array,
      default() {
        return [];
      }
    },
    recommendMarketTags: {
      require: true,
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      dialogVisible: false,
      tagsCopy: [],
      addTags: []
    };
  },
  computed: {
    totalTags() {
      return this.tagsCopy.concat(this.addTags);
    }
  },
  watch: {
    visibility(visibility) {
      this.dialogVisible = visibility;
      if (visibility) {
        this.tagsCopy = this.tags.slice(0);
      }
    }
  },
  created() {},
  methods: {
    addRecommendMarketTag(tag) {
      for (const iterator of this.totalTags) {
        if (iterator.name === tag.name) {
          this.$message.warning('该标签已存在，请重新选择');
          return;
        }
      }
      this.addTags.push(tag);
    },
    removeMarketTag(id) {
      let index = this.addTags.findIndex(tag => {
        return tag.id === id;
      });
      if (index !== -1) {
        this.addTags.splice(index, 1);
      }

      index = this.tagsCopy.findIndex(tag => {
        return tag.id === id;
      });
      if (index !== -1) {
        this.tagsCopy.splice(index, 1);
      }
    },
    close() {
      this.$emit('update:visibility', false);
    },
    confirmed() {
      this.$emit('update:visibility', false);
      this.$emit('selected-tag', this.totalTags);
    }
  }
};
</script>

<style lang="scss">
.base-marketing-tag {
  .el-tag {
    margin-right: 5px;
    margin-bottom: 10px;
    cursor: pointer;
  }
  .recommend-group {
    margin: 0 10px 10px 0;
    padding: 7px 12px;
    border: 1px solid #f4f2f2;
    border-radius: 4px;
  }
}
</style>
