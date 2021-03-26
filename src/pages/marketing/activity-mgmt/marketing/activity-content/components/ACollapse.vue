<template>
  <div class="am-collapse">
    <el-collapse v-model="activeNames"
                 accordion>
      <el-collapse-item :title="title"
                        name="1">
        <slot>
        </slot>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
export default {
  name: 'ACollapse',
  data() {
    return {
      activeNames: ''
    };
  },
  props: {},
  computed: {
    title() {
      if (this.activeNames === '') {
        return '';
      } else {
        return '';
      }
    }
  },
  watch: {},
  methods: {}
};
</script>

<style lang="scss">
.am-collapse {
  .el-collapse {
    // border-width: 0;
    .el-collapse-item__header {
      height: 30px;
      line-height: 30px;
      // border-width: 0;
      .el-collapse-item__arrow {
        line-height: 30px;
      }
    }
    .el-collapse-item__wrap {
      // border-width: 0;
    }
  }
}
</style>
