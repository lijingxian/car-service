<template>
  <div class="tag-selector">
    <el-tag
      v-for="tag in options"
      :key="tag[nameField]"
      :closable="false"
      :disable-transitions="false"
      :type="value.includes(tag[nameField]) ? '' : 'info'"
      size="small"
      @click.native="handleClick(tag, $event)"
    >
      {{tag[nameField]}}
    </el-tag>
  </div>
</template>

<script>
export default {
  name: 'TagSelector',
  data () {
    return {

    };
  },
  props: {
    value: {
      type: Array
    },
    options: {
      type: Array,
      default () {
        return [];
      }
    },
    valueField: {
      type: String,
      default () {
        return 'id';
      }
    },
    nameField: {
      type: String,
      default () {
        return 'name';
      }
    }
  },
  created () {

  },
  methods: {
    handleClick (tag, e) {
      console.log(123);
      const arr = [].concat(this.value);
      const index = arr.indexOf(tag[this.nameField]);
      if (index < 0) {
        arr.push(tag[this.nameField]);
      } else {
        arr.splice(index, 1);
      }

      this.$emit('input', arr);
    }
  },
  watch: {

  }
};
</script>

<style lang="scss">
.tag-selector {
  .el-tag {
    cursor: pointer;
    margin-right: 5px;
  }
}
</style>
