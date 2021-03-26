<template>
  <div class="biz-pagination">
    <el-pagination
      :page-sizes="pageSizes"
      :page-size="pagination.pageSize"
      :total="pagination.total"
      :current-page="pagination.currentPage"
      :pager-count="pagination.pagerCount||7"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      layout="total, prev, pager, next, sizes, jumper"
    ></el-pagination>
  </div>
</template>

<script>
export default {
  name: 'BizPagination',
  props: {
    pagination: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      pageSizes: [10, 20, 50, 100],
      pageSize: 20
    };
  },
  methods: {
    handleSizeChange(val) {
      this.$emit('handleSizeChange', val);
      this.$emit('size-change', val);
    },
    handleCurrentChange(val) {
      this.$emit('handleCurrentChange', val);
      this.$emit('current-change', val);
    },

    initData () {
      this.pageSizes = this.pagination.pageSizes || [10, 20, 50, 100];
      this.pageSize = this.pagination.pageSize || 20;
    }
  },
  watch: {
    pagination (val) {
      if (val.pageSizes) {
        this.initData();
      }
    }
  },
  created () {
    this.initData();
  }
};
</script>

<style lang="scss">
.biz-pagination {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
</style>
