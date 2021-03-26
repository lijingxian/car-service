<template>
  <biz-grid class="biz-flex-table">
    <biz-header
      slot="top"
      v-if="(operations && operations.length > 0) || (filters && filters.length > 0)"
      :operations="operations"
      :filters="filters"
      :tags="tags"
      @operate="handleOperate"
      @input-option-change="handleInputOptionChange"
      @filter-data-change="handleFilterDataChange"
      @closeDialogFilter="closeDialogFilter"
      @on-switch="handleSwitch"
      @cascader-change="handleCascaderChange"
      :views="views"
      @onSwitch="onViewSwitch"
      @active-item-change="activeItemChange"
    >
      <slot name="operation" slot="operation"></slot>
    </biz-header>
    <el-table
      ref="table"
      v-if="showTable"
      size="small"
      :height="height"
      :data="tableData"
      :show-summary="showSummary"
      v-loading="loading"
      highlight-current-row
      @select="handleSelectChange"
      @select-all="handleSelectAll"
      @selection-change="handleSelectionChange"
      @row-click="handleRowClick"
      @sort-change="handleSortChange"
      tooltip-effect="dark"
      style="width: 100%;"
      :span-method="spanMethod"
      :row-class-name="rowClassNameHandle"
      :row-key="rowKeys"
      :expand-row-keys="expands"
      @expand-change="expandChangeHandle"
      @moveUp="moveUp"
      @moveDown="moveDown"
    >
      <biz-empty-table slot="empty"></biz-empty-table>
      <el-table-column type="selection" width="60" v-if="checkable" :selectable="selectable"></el-table-column>
      <slot></slot>
    </el-table>
    <biz-pagination slot="bottom" v-if="pagination&&showTable" :pagination="pagination" @size-change="handleSizeChange" @current-change="handleCurrentChange"></biz-pagination>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import BizHeader from './BizHeader';
import BizPagination from './BizPagination';
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
    return {};
  },
  props: {
    height: {
      type: String,
      default() {
        return '99%';
      }
    },
    checkable: {
      type: Boolean,
      default() {
        return true;
      }
    },
    showSummary: {
      type: Boolean,
      default() {
        return false;
      }
    },
    loading: {
      type: Boolean,
      default() {
        return false;
      }
    },
    showTable: {
      type: Boolean,
      default() {
        return true;
      }
    },
    memberIds: {
      type: Array,
      default() {
        return [];
      }
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
    views: {
      type: Array,
      default: function() {
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
    },
    isDepotOutNew: {
      type: Boolean,
      default() {
        return false;
      }
    },
    checkedTable: {
      type: Array,
      default() {
        return [];
      }
    },
    isMergeInvoice: {
      type: Boolean,
      default() {
        return false;
      }
    },
    spanMethod: Function,
    rowClassName: {
      type: Function,
      default() {
        return null;
      }
    },
    rowKeys: {
      type: Function,
      default() {
        return null;
      }
    },
    expands: {
      type: Array,
      default() {
        return null;
      }
    },
    expandChange: {
      type: Function,
      default() {
        return null;
      }
    }
  },
  methods: {
    expandChangeHandle(row, expandedRows) {
      return this.expandChange(row, expandedRows);
    },
    rowClassNameHandle({ row, index }) {
      return this.rowClassName({ row, index });
    },
    handleOperate(name) {
      this.$emit('operate', name);
    },
    handleInputOptionChange(filters) {
      this.$emit('input-option-change', filters);
    },
    handleFilterDataChange(filters) {
      console.log(222);
      this.$emit('filter-data-change', filters);
    },
    closeDialogFilter(filter) {
      console.log(22);
      this.$emit('closeDialogFilter', filter);
    },
    handleSelectChange(val, row) {
      this.$emit('select', val, row);
    },
    handleSelectAll(selection) {
      this.$emit('select-all', selection);
    },
    handleSelectionChange(selection) {
      this.$emit('selection-change', selection);
    },
    handleRowClick(row, e, column) {
      this.$emit('row-click', row, e, column);
    },
    handleSizeChange(val) {
      this.$emit('size-change', val);
    },
    handleCurrentChange(val) {
      this.$emit('current-change', val);
      this.$refs.table.bodyWrapper.scrollTop = 0;
    },
    handleSwitch(val) {
      this.$emit('on-switch', val);
    },
    handleSortChange(column) {
      this.$emit('sort-change', column);
    },
    handleCascaderChange(value) {
      this.$emit('cascader-change', value);
    },
    activeItemChange(value) {
      this.$emit('active-item-change', value);
    },
    selectable(value) {
      if (this.checkedTable.length > 0) {
        for (const item of this.checkedTable) {
          if (value.id === item.id) {
            return false;
          }
        }
      }
      // 库存
      if (value.realStock && this.isDepotOutNew) {
        return value.realStock > 0;
      }
      // 剩余库存
      if (value.availableStock && !value.realStock) {
        return value.availableStock > 0;
      }
      // 合并发票
      // if ((value.invoiceId && this.isMergeInvoice) || value.state === '6') {
      //   return false;
      // }
      if (value.unionConfig) {
        return value.unionConfig.editable === '1';
        // } else if (value.availableStock) {
        //   return value.availableStock > 0;
      } else if (this.memberIds.length > 0) {
        return this.memberIds.indexOf(value.id) < 0;
      } else {
        return true;
      }
    },
    toggleRowSelection(row, selection) {
      this.$refs.table.toggleRowSelection(row, selection);
    },
    doLayout() {
      this.$nextTick(() => {
        this.$refs.table.doLayout();
      });
    },
    getContainerHeight() {
      if (!this.container) {
        this.container = this.$el.querySelector('.biz-grid__content');
      }
      return this.container.clientHeight;
    },
    doHeight() {
      this.height = this.getContainerHeight();

      if (!this.inited) {
        window.addEventListener('resize', e => {
          this.height = this.getContainerHeight();
        });
      }
    },
    forcedUpdateHeight() {
      this.$refs.table.layout.setHeight(this.getContainerHeight());
    },
    onViewSwitch(name) {
      this.$emit('onSwitch', name);
    },
    moveUp(row) {
      this.$emit('moveUp', row);
    },
    moveDown(row) {
      this.$emit('moveDown', row);
    }
  },
  computed: {},
  mounted() {
    this.inited = true;
    // let that = this;
    // setTimeout(() => {
    //   that.doHeight();
    // }, 1200);
  }
};
</script>

<style lang="scss">
.biz-flex-table {
  .has-gutter {
    .gutter {
      display: table-cell !important;
    }
  }
}
.el-table .cell {
  cursor: pointer;
}
.el-table .disabled-row .cell {
  opacity: 0.3;
}
</style>
