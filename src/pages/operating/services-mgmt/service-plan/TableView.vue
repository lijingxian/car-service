<template>
  <el-table
    class="service-order-table-view"
    size="small"
    ref="table"
    stripe
    height="100%"
    border
    highlight-current-row
    :data="data"
    tooltip-effect="dark"
    style="width: 100%"
    v-on="$listeners">
    <biz-empty-table slot="empty"></biz-empty-table>
    <slot></slot>
  </el-table>
</template>

<script>
import BizEmptyTable from '@/components/BizTable/BizEmptyTable.vue';

export default {
  name: 'TableView',
  props: {
    data: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data () {
    return {
    };
  },
  components: {
    BizEmptyTable
  },
  computed: {
  },
  watch: {
  },
  mounted() {
  },
  methods: {
  }
};
</script>

<style lang="scss">
</style>
