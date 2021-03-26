<template>
  <el-dialog class="biz-dialog-selector" :title="title" :visible.sync="dialogVisible" :append-to-body="appendToBody" @close="close" @open="open">
    <biz-flex-table ref="table" :operations="operations" :filters="filters" :tags="tags" :pagination="pagination" :tableData="tableData"
      :loading="loading" :checkable="checkable" @operate="operate" @row-click="rowClick" @filter-data-change="filterDataChange" @select-all="handleSelectAll"
      @select="handleSelectionChange" @size-change="pageSizeChange" @current-change="currentPageChange">
      <slot></slot>
    </biz-flex-table>
    <span slot="footer" class="dialog-footer">
      <el-button size="small" @click="dialogVisible = false">取消</el-button>
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
    selectionKeys: {
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
    }
  },
  data() {
    return {
      dialogVisible: false,
      // 选中项目的id数组
      innerSelectionKeys: [],
      // 选中项目的id对象
      innerSelection: [] // 回显之后的操作显示可能会有问题：比如不翻页的情况下，进行操作，控件无法获取全部的可选项信息
    };
  },
  methods: {
    generateSelectionKeys(selections, row) {
      if (selections.indexOf(row) >= 0) {
        this.innerSelectionKeys.push(row[this.keyField]);
        // this.innerSelection.push(row);
      } else {
        let index = this.innerSelectionKeys.indexOf(row[this.keyField]);
        this.innerSelectionKeys.splice(index, 1);
        // this.innerSelection.splice(index, 1);
      }
    },
    open(e) {
      console.log(this.selectionKeys);
      this.innerSelectionKeys = this.selectionKeys.concat();
      this.$emit('open', false);
    },
    close(e) {
      // 清空选中信息，防止下次打开时有选中状态
      this.innerSelectionKeys = [];
      // this.tableData = [];

      this.$emit('update:visibility', false);
      this.$emit('close', false);
    },
    confirmed() {
      if (this.innerSelectionKeys.length > 0) {
        this.$emit('confirmed', this.innerSelectionKeys, this.innerSelection);
        this.dialogVisible = false;
      } else {
        this.$message('请选择一项');
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
          let index = this.innerSelectionKeys.indexOf(item[this.keyField]);
          if (index >= 0) this.innerSelectionKeys.splice(index, 1);
        });
      } else {
        this.tableData.forEach(item => {
          let index = this.innerSelectionKeys.indexOf(item[this.keyField]);
          if (index < 0) this.innerSelectionKeys.push(item[this.keyField]);
        });
      }
    },
    handleSelectionChange(selection, row) {
      this.generateSelectionKeys(selection, row);
    },
    pageSizeChange(val) {
      this.$emit('pageSizeChange', val);
    },
    currentPageChange(val) {
      this.$emit('currentPageChange', val);
    },
    rowClick(row, event, column) {
      if (this.selectionMode === 'single') {
        this.innerSelectionKeys = [row[this.keyField]];
        this.innerSelection = [row];
      }
    }
  },
  watch: {
    visibility(newVal, oldVal) {
      this.dialogVisible = newVal;
    }
  },
  computed: {
    checkable() {
      return this.selectionMode !== 'single';
    }
  },
  created() {}
};
</script>

<style lang="scss">
$biz-dialog-selector-height: 80;

.biz-dialog-selector {
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

        .filter-wrap {
          margin: 0;
        }
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
}
</style>
