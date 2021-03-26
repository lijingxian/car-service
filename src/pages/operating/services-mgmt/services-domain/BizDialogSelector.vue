<template>
  <el-dialog class="biz-dialog-selector" :title="title" :visible.sync="dialogVisible" :append-to-body="appendToBody"
    @close="close" @open="open">
    <slot name="top"></slot>
    <biz-flex-table :showTable="showTable" ref="table" :operations="operations" :filters="filters" :tags="tags" :rowKeys="rowKeys"
      :pagination="pagination" :tableData="tableData" :rowClassName="rowClassName" :loading="loading" :memberIds="memberIds"
      :checkable="checkable" @operate="operate" @row-click="rowClick" @filter-data-change="filterDataChange"
      @select-all="handleSelectAll" @select="handleSelectionChange" @size-change="pageSizeChange"
      @current-change="currentPageChange" @cascader-change="cascaderChange" @active-item-change="activeItemChange"
      @sort-change="handleSortChange" :isDepotOutNew="isDepotOutNew" :checkedTable="checkedTable">
      <slot></slot>
    </biz-flex-table>
    <span slot="footer" class="dialog-footer">
      <el-button v-if="isClear" size="small" @click="clear">清除</el-button>
      <el-button size="small" @click="close">取消</el-button>
      <el-button size="small" type="primary" @click="confirmed">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { BizFlexTable } from '@/components/BizTable';

export default {
  name: 'BizDialogSelector',
  components: {
    BizFlexTable
  },
  props: {
    selectionMode: {
      type: String,
      default() {
        return 'multi';
      }
    },
    // 多选时最大选择数量
    max: {
      type: Number,
      default: 0
    },
    title: {
      require: true,
      type: String,
      default() {
        return ' ';
      }
    },
    visibility: {
      require: true,
      type: Boolean
    },
    appendToBody: {
      default: true,
      type: Boolean
    },
    keyField: {
      type: String,
      default() {
        return 'id';
      }
    },
    isClear: {
      default: true,
      type: Boolean
    },
    rowClassName: {
      type: Function,
      default() {
        return null;
      }
    },
    selectionKeys: {
      type: Array,
      default() {
        return [];
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
    tags: {
      type: Array,
      default() {
        return [];
      }
    },

    loading: {
      type: Boolean,
      default: false
    },
    tableData: {
      type: Array,
      default() {
        return [];
      }
    },
    pagination: {
      type: Object,
      default() {
        return {
          pageSize: 20,
          currentPage: 1,
          pageSizes: [10, 20, 50, 100],
          total: 0
        };
      }
    },
    isDepotOut: {
      type: Boolean,
      default() {
        return false;
      }
    },
    checkTable: {
      type: Array,
      default() {
        return [];
      }
    },
    showTable: {
      type: Boolean,
      default() {
        return true;
      }
    }
  },
  data() {
    return {
      dialogVisible: false,
      // 选中项目的id数组
      innerSelectionKeys: [],
      isDepotOutNew: false,
      checkedTable: [],
      // 选中项目的id对象
      innerSelection: [] // 回显之后的操作显示可能会有问题：比如不翻页的情况下，进行操作，控件无法获取全部的可选项信息
    };
  },
  methods: {
    rowKeys(row) {
      return row.id;
    },
    generateSelectionKeys(selections, row) {
      if (selections.indexOf(row) >= 0) {
        this.innerSelectionKeys.push(row.businessService.id);
        this.innerSelection.push(row);
      } else {
        let index = this.innerSelectionKeys.indexOf(row.businessService.id);
        this.innerSelectionKeys.splice(index, 1);
        this.innerSelection.splice(index, 1);
      }
      // 限制最大选中项数
      // if (this.max > 0) {
      //   if (this.innerSelectionKeys.length > this.max) {
      //     this.innerSelectionKeys.splice(
      //       this.max,
      //       this.innerSelectionKeys.length - this.max
      //     );
      //     this.updateSelection();
      //     this.$message({
      //       message: `最多选中${this.max}项`,
      //       type: 'info',
      //       duration: 1000,
      //       showClose: true
      //     });
      //   }
      // }
    },
    open(e) {
      this.innerSelectionKeys = this.selectionKeys.concat();
      this.$emit('open', false);
    },
    close(e) {
      // 清空选中信息，防止下次打开时有选中状态
      this.innerSelectionKeys = [];
      this.innerSelection = [];
      // this.tableData = [];

      this.$emit('update:visibility', false);
      this.$emit('close', false);
    },
    confirmed() {
      // innerSelectionKeys: ['id', 'id']
      // innerSelection: [{id: 'id'}, {id: 'id'}]
      if (this.innerSelectionKeys.length > 0 || !this.showTable) {
        if (!this.showTable && !/(http|https):\/\/([\w.]+\/?)\S*/.test(this.filters[2].value)) {
          this.$message.warning('必须以http,https开头,且需符合URL规范,检查格式是否正确');
          return;
        }
        this.$emit('confirmed', this.innerSelectionKeys, this.innerSelection);
        this.dialogVisible = false;
      } else {
        this.$message('请选择一项');
      }
    },
    clear() {
      this.tableData.forEach(item => {
        this.$refs.table.toggleRowSelection(item, false);
      });
      this.innerSelectionKeys = [];
      this.innerSelection = [];
    },
    updateSelection() {
      if (this.$refs && this.$refs.table) {
        this.tableData.forEach(item => {
          if (this.innerSelectionKeys.indexOf(item.businessService.id) >= 0) {
            this.$refs.table.toggleRowSelection(item, true);
            if (this.selectionMode === 'single') {
              this.$refs.table.$refs.table.setCurrentRow(item);
              this.innerSelection = [item];
            }
          } else {
            this.$refs.table.toggleRowSelection(item, false);
          }
        });
      }
    },

    operate(name) {
      this.$emit('operate', name);
    },
    filterDataChange(filters) {
      this.$emit('filterDataChange', filters);
    },
    handleSelectAll(selection) {
      if (selection.length === 0) {
        this.tableData.forEach(item => {
          let index = this.innerSelectionKeys.indexOf(item.businessService.id);
          if (index >= 0) this.innerSelectionKeys.splice(index, 1);
        });
      } else {
        this.tableData.forEach(item => {
          let index = this.innerSelectionKeys.indexOf(item.businessService.id);
          if (index < 0) this.innerSelectionKeys.push(item.businessService.id);
        });
      }
      this.$emit('selectionChange', selection);
    },
    handleSelectionChange(selection, row) {
      this.generateSelectionKeys(selection, row);
      this.$emit('selectionChange', selection);
    },
    pageSizeChange(val) {
      this.$emit('pageSizeChange', val);
    },
    currentPageChange(val) {
      this.$emit('currentPageChange', val);
    },
    cascaderChange(val) {
      this.$emit('cascaderChange', val);
    },
    activeItemChange(value) {
      this.$emit('active-item-change', value);
    },
    handleSortChange(column) {
      this.$emit('sort-change', column);
    },
    rowClick(row, event, column) {
      if (this.selectionMode === 'single') {
        this.innerSelectionKeys = [row.businessService.id];
        this.innerSelection = [row];
      }
    }
  },
  watch: {
    visibility(newVal, oldVal) {
      this.dialogVisible = newVal;
      this.isDepotOutNew = this.isDepotOut;
      this.checkedTable = this.checkTable;
    }
  },
  computed: {
    checkable() {
      return this.selectionMode !== 'single';
    }
  },
  created() {},
  updated() {
    this.updateSelection();
  }
};
</script>

<style lang="scss">
$biz-dialog-selector-height: 80;

.biz-dialog-selector {
  .el-input-group {
    width: 295px;
  }
  .el-input__validateIcon {
    display: none;
  }
  > .el-dialog {
    display: flex;
    flex-direction: column;
    width: 70%;
    height: unquote($biz-dialog-selector-height + '%');
    margin: unquote(5 / $biz-dialog-selector-height * 100 + '%') auto !important;

    > .el-dialog__body {
      position: relative;
      flex-grow: 1;
      padding: 0;
      margin: 5px 20px;

      .biz-header {
        box-shadow: none;
        padding: 5px 0;

        // .filter-wrap {
        //   margin: 0;
        // }
      }

      .biz-table {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;

        > .biz-table-body {
          flex-grow: 1;
        }
      }

      .biz-pagination {
        padding-top: 10px;
      }
    }
  }
  // .biz-table-filter .filter-wrap .biz-select .el-select {
  //   width: 240px;
  // }
}
</style>
