<template>
  <div class="biz-table-statistic">
    <el-tag size="small" v-for="(tag,index) of tags" :type="tag.type" :key="index">{{tag.label}}</el-tag>
  </div>
</template>

<script>
export default {
  name: 'BizTableStatistic',
  data() {
    return {};
  },
  props: {
    tags: {
      type: Array,
      default: function() {
        return [];
      }
    }
  }
};
</script>

<style lang="scss">
.biz-table-statistic {
  display: flex;
  .el-tag {
    margin-right: 10px;
  }
}
</style>
