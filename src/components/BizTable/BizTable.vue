<template>
  <div class="biz-table">
    <biz-header :operations="operations" @operate="operate" :filters="filters" @filterDataChange="filterDataChange"  @closeDialogFilter="closeDialogFilter" :views="views" @onSwitch="onViewSwitch"></biz-header>
    <biz-table-body
      ref="table"
      :span-method="spanMethod"
      :height="height"
      :tableData="tableData"
      :pagination="pagination"
      @handleSelectionChange="handleSelectionChange"
      @rowClick="rowClick"
      @handleSizeChange="handleSizeChange"
      @handleCurrentChange="handleCurrentChange"
      @filterChange="filterChange"
      @sort-change="handleSortChange"
      :rowClassName="rowClassNameHandle"
      :rowKeys="rowKeys"
      :expands="expands"
      :expandChange="expandChangeHandle"
    >
      <slot></slot>
    </biz-table-body>
  </div>
</template>

<script>
import BizHeader from './BizHeader';
import BizTableBody from './BizTableBody';

export default {
  name: 'BizTable',
  props: {
    operations: {
      type: Array,
      default: function() {
        return [];
      }
    },
    filters: {
      type: Array,
      default: function() {
        return [];
      }
    },
    pagination: {
      type: Object,
      required: false
    },
    tableData: {
      type: Array,
      default: function() {
        return [];
      }
    },
    views: {
      type: Array,
      default: function() {
        return [];
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
  data() {
    return {
      height: '400'
    };
  },
  components: {
    BizHeader,
    BizTableBody
  },
  created() {
    this.getViewportHeight(this.height);
    // console.warn('BizTable已废弃，请改用BizTable下的BizFlexTable');
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
    operate(name) {
      this.$emit('operate', name);
    },
    filterDataChange(filters) {
      console.log(333);
      this.$emit('filterDataChange', filters);
      this.$emit('filter-data-change', filters);
    },
    handleSelectionChange(selection) {
      this.$emit('handleSelectionChange', selection);
      this.$emit('selection-change', selection);
    },
    rowClick(row, e, column) {
      this.$emit('rowClick', row);
      this.$emit('row-click', row, e, column);
    },
    handleSizeChange(val) {
      this.$emit('handleSizeChange', val);
      this.$emit('size-change', val);
    },
    handleCurrentChange(val) {
      this.$emit('handleCurrentChange', val);
      this.$emit('current-change', val);
    },
    // 计算视口的高度
    getViewportHeight(val) {
      if (val === '400') {
        let height = document.documentElement.clientHeight || window.innerHeight;
        this.height = String(height - 75 - 100);
      } else {
        this.height = val;
      }
    },
    doLayout() {
      this.$refs.table.doLayout();
    },
    filterChange(filters) {
      this.$emit('filterChange', filters);
    },
    closeDialogFilter(filter) {
      console.log(22);
      this.$emit('closeDialogFilter', filter);
    },
    onViewSwitch() {
      this.$emit('onSwitch', name);
    }
  }
};
</script>

<style lang="scss">
.biz-table {
  .header {
    display: flex;
    justify-content: space-between;
    padding-bottom: 10px;
  }
}
</style>
