<template>
  <biz-grid class="biz-flex-table">
    <biz-header
      slot="top"
      v-if="(operations && operations.length > 0) || (filters && filters.length > 0)"
      :operations="operations"
      :filters="filters"
      :tags="tags"
      @operate="operate"
      @filterDataChange="filterDataChange"
      @closeDialogFilter="closeDialogFilter"
      @cascader-change="cascaderChange"
    >
      <slot name="operation" slot="operation"></slot>
    </biz-header>
    <el-table
      ref="table"
      size="small"
      :height="height"
      :data="tableData"
      v-loading="loading"
      @select="handleSelectChange"
      @select-all="handleSelectAll"
      @selection-change="handleSelectionChange"
      @row-click="rowClick"
      stripe
      border
      highlight-current-row
      tooltip-effect="dark"
      style="width: 100%;"
    >
      <biz-empty-table slot="empty"></biz-empty-table>
      <el-table-column type="selection" width="50" v-if="checkable"></el-table-column>
      <slot></slot>
    </el-table>
    <biz-pagination slot="bottom" v-if="pagination" :pagination="pagination" @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange"></biz-pagination>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import { BizHeader, BizPagination } from '@/components/BizTable';
import BizEmptyTable from './BizEmptyTable';
export default {
  name: 'BizFlexTable',
  components: {
    BizGrid,
    BizHeader,
    BizPagination,
    BizEmptyTable
  },
  data() {
    return {
      height: '100%'
    };
  },
  props: {
    checkable: {
      type: Boolean,
      default: true
    },
    loading: {
      type: Boolean,
      default: true
    },
    operations: {
      type: Array,
      default() {
        return [];
      }
    },
    filters: {
      type: Array,
      default() {
        return [];
      }
    },
    pagination: {
      type: Object
    },
    tableData: {
      type: Array,
      default() {
        return [];
      }
    },
    tags: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  methods: {
    operate(name) {
      this.$emit('operate', name);
    },
    filterDataChange(filters) {
      this.$emit('filterDataChange', filters);
      this.$emit('filter-data-change', filters);
    },
    closeDialogFilter(filter) {
      this.$emit('closeDialogFilter', filter);
    },
    handleSelectChange(val, row) {
      this.$emit('selectChange', val, row);
      this.$emit('select', val, row);
    },
    handleSelectAll(selection) {
      this.$emit('selectAll', selection);
      this.$emit('select-all', selection);
    },
    handleSelectionChange(selection) {
      this.$emit('selectionChange', selection);
      this.$emit('selection-change', selection);
    },
    rowClick(row, e, column) {
      this.$emit('rowClick', row, e, column);
      this.$emit('row-click', row, e, column);
    },
    handleSizeChange(val) {
      this.$emit('pageSizeChange', val);
      this.$emit('size-change', val);
    },
    handleCurrentChange(val) {
      this.$emit('currentPageChange', val);
      this.$emit('current-change', val);
    },
    cascaderChange(val) {
      this.$emit('cascaderChange', val);
      this.$emit('cascader-change', val);
    },
    toggleRowSelection(row, selection) {
      this.$refs.table.toggleRowSelection(row, selection);
    },
    doLayout() {
      this.$nextTick(() => {
        this.$refs.table.doLayout();
      });
    }
  },
  mounted() {},
  created() {
    console.warn('BizFlexTable已废弃，请改用BizTable下的BizFlexTable');
  }
};
</script>

<style lang="scss">
.el-table .cell {
  cursor: pointer;
}
</style>
