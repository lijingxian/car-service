<template>
  <div class="biz-list" :style="'height:'+height" ref="height">
    <el-table
      size="small"
      ref="table"
      :span-method="spanMethod"
      :height="height"
      :show-summary="showSummary"
      highlight-current-row
      :data="tableData"
      style="width: 100%"
      @sort-change="sortChange"
      @selection-change="handleSelectionChange"
      @row-click="rowClick"
      @filter-change="filterChange"
      :row-class-name="rowClassNameHandle"
      :row-key="rowKeys"
      :expand-row-keys="expands"
      :default-sort="defaultSort"
      @expand-change="expandChangeHandle"
    >
      <biz-empty-table slot="empty"></biz-empty-table>
      <slot></slot>
    </el-table>
  </div>
</template>

<script>
import BizEmptyTable from './BizEmptyTable.vue';
export default {
  name: 'BizList',
  data() {
    return {};
  },
  components: { BizEmptyTable },
  props: {
    height: {
      type: String,
      default: '700px'
    },
    tableData: {
      type: Array,
      default: function() {
        return [];
      }
    },
    showSummary: {
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
    },
    defaultSort: {
      type: Object
    }
  },
  methods: {
    expandChangeHandle(row, expandedRows) {
      return this.expandChange(row, expandedRows);
    },
    rowClassNameHandle({ row, index }) {
      return this.rowClassName({ row, index });
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    handleSelectionChange(val) {
      this.$emit('handleSelectionChange', val);
    },
    // 此处需要过滤掉checkbox的选择事件
    rowClick(row, event, column) {
      if (column.type !== 'selection') {
        this.$emit('rowClick', row, event, column);
      }
    },
    // 此处需注意
    doLayout() {
      this.$nextTick(() => {
        this.$refs.table.doLayout();
      });
    },
    filterChange(filters) {
      this.$emit('filterChange', filters);
    },
    sortChange(params) {
      this.$emit('sort-change', params);
    },
    toggleRowSelection(row, selection) {
      this.$refs.table.toggleRowSelection(row, selection);
    },
    getContainerHeight() {
      if (!this.container) {
        this.container = this.$refs.height;
      }
      return this.container.clientHeight;
    },
    doHeight() {
      this.height = this.getContainerHeight();
      console.log(1);
      if (!this.inited) {
        window.addEventListener('resize', e => {
          this.height = this.getContainerHeight();
        });
      }
    },
    forcedUpdateHeight() {
      this.$refs.table.layout.setHeight(this.getContainerHeight());
    }
  },
  created() {
    // console.warn('BizList已废弃，请改用BizTable下的BizFlexTable');
  },
  mounted() {
    this.inited = true;

    // Element UI 2.2.0版本中导致弹出框中的table不能高度100%显示，以此方式解决
    // 新版本页面添加了0.5s过渡动画,在这期间元素高度为0
    // let that = this;
    // setTimeout(() => {
    //   that.doHeight();
    //   // that.forcedUpdateHeight();
    // }, 1200);
  }
};
</script>

<style lang="scss">
.biz-list {
  .el-table__header {
    .is-leaf {
      padding: 5px 0;
    }
    .el-table-column--selection {
      .cell {
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
    th {
      background-color: rgb(245, 245, 245);
    }
  }
  .el-table--enable-row-hover .el-table__body tr:hover > td {
    background-color: #fef3e5;
  }
  .el-table--striped,
  .el-table {
    .el-table__body-wrapper {
      .el-table-column--selection {
        .cell {
          display: flex;
          justify-content: center;
          align-items: center;
        }
      }
      .biz-customcol {
        display: flex;
        align-items: center;
        .biz-two-row {
          display: flex;
          flex-direction: column;
        }
      }
      tr {
        &:hover > td {
          background-color: #fef3e5;
        }
        &.el-table__row--striped.current-row > td,
        &.current-row > td {
          background-color: #ffd6a0;
        }
      }
    }
  }
}
</style>
