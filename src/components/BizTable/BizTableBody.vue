<template>
  <div class="biz-table-body">
    <el-table :span-method="spanMethod" size="small" ref="table" stripe :height="height" highlight-current-row :data="tableData" border
      tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange" @row-click="rowClick" @filter-change="filterChange"
      @sort-change="handleSortChange" :row-class-name="rowClassNameHandle" :row-key="rowKeys" :expand-row-keys="expands" @expand-change="expandChangeHandle">
      <biz-empty-table slot="empty"></biz-empty-table>
      <slot></slot>
    </el-table>
    <biz-pagination v-if="pagination" :pagination="pagination" @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange">
    </biz-pagination>
  </div>
</template>

<script>
import BizPagination from './BizPagination';
import BizEmptyTable from './BizEmptyTable.vue';

export default {
  name: 'BizTableBody',
  data() {
    return {};
  },
  components: { BizPagination, BizEmptyTable },
  props: {
    height: {
      type: String,
      default: '800'
    },
    tableData: {
      type: Array,
      default: function() {
        return [];
      }
    },
    pagination: {
      type: Object,
      required: false
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
    handleSortChange(column) {
      this.$emit('sort-change', column);
    },
    handleSizeChange(val) {
      this.$emit('handleSizeChange', val);
    },
    handleCurrentChange(val) {
      this.$emit('handleCurrentChange', val);
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
    handleSelectionChange(selection) {
      this.$emit('handleSelectionChange', selection);
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
    }
  },
  created() {
    // console.warn('BizTableBody已废弃，请改用BizTable下的BizFlexTable');
  }
};
</script>

<style lang="scss">
// .biz-table-body {
//   .el-table__header {
//     .is-leaf {
//       padding: 5px 0;
//     }
//     .el-table-column--selection {
//       .cell {
//         display: flex;
//         justify-content: center;
//         align-items: center;
//       }
//     }
//     th {
//       background-color: rgb(245, 245, 245);
//     }
//   }
//   .el-table--enable-row-hover .el-table__body tr:hover > td {
//     background-color: #fef3e5;
//   }
//   .el-table--striped,
//   .el-table {
//     .el-table__body-wrapper {
//       .el-table-column--selection {
//         .cell {
//           display: flex;
//           justify-content: center;
//           align-items: center;
//         }
//       }
//       .biz-customcol {
//         display: flex;
//         align-items: center;
//         .biz-two-row {
//           display: flex;
//           flex-direction: column;
//         }
//       }
//       tr {
//         &:hover > td {
//           background-color: #fef3e5;
//         }
//         &.el-table__row--striped.current-row > td,
//         &.current-row > td {
//           background-color: #ffd6a0;
//         }
//       }
//     }
//   }

//   .biz-pagination {
//     display: flex;
//     justify-content: center;
//   }
// }
</style>
