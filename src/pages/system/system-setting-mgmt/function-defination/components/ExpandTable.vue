<template>
  <el-table
    ref='expandTable'
    class="expand-table"
    size="small"
    tooltip-effect="dark"
    row-key="id"
    style="width: 100%;min-height: 100%;"
    height="auto"
    :border="showBorder"
    v-loading="loading"
    :data="data"
    :show-header="showHeader"
    :expand-row-keys="expandedRowKeys"
    @expand-change="expandChangeHandler"
    @row-click="rowClickHandler">
    <el-table-column type="expand">
      <template slot-scope="scope">
        <expand-table
          v-if="scope.row.subAuthority"
          :layer="layer + 1"
          :data="scope.row.subAuthority"
          :show-header="false"
          :show-border="false"
          :expand-row-keys="expandedRowKeys"
          @delete="deleteFunction"
          @expand-change="expandChangeHandler"
          @row-click="rowClickHandler">
        </expand-table>
      </template>
    </el-table-column>
    <el-table-column label="功能" prop="name">
      <template slot-scope="scope">
        {{ formatTreeLayer(scope.row.name, layer) }}
      </template>
    </el-table-column>
    <el-table-column label="平台可用" prop="isPlatform">
      <template slot-scope="scope">
        {{ scope.row.isPlatform | formatToMark }}
      </template>
    </el-table-column>
    <el-table-column label="运营商可用" prop="isOperator">
      <template slot-scope="scope">
        {{ scope.row.isOperator | formatToMark }}
      </template>
    </el-table-column>
    <el-table-column label="店铺可用" prop="isShop">
      <template slot-scope="scope">
        {{ scope.row.isShop | formatToMark }}
      </template>
    </el-table-column>
    <el-table-column label="操作">
      <template slot-scope="scope">
        <el-button type="text" size="mini" @click.stop="deleteFunction(scope.row.id)">
          删除
        </el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  name: 'ExpandTable',
  filters: {
    // 将0, 1修改为'√', 'X'
    // true, false
    formatToMark(value) {
      if (isNaN(value)) return value;
      return !Number(value) ? 'X' : '√';
    }
  },
  props: {
    showHeader: { type: Boolean, default: true },
    data: { type: Array, default() { return []; } },
    loading: { type: Boolean, default: false },
    showBorder: { type: Boolean, default: true },
    layer: { type: Number, default: 0 },
    expandedRowKeys: { type: Array, default() { return []; } }
  },
  data () {
    return {
    };
  },
  components: {},
  computed: {
  },
  watch: {},
  mounted() {},
  updated() {
    this.doLayout();
  },
  methods: {
    doLayout() {
      document.querySelectorAll('.el-table__body-wrapper').forEach(el => {
        el.style.height = 'auto';
      });
    },
    formatTreeLayer(name, layer) {
      let arr = [];
      if (layer) {
        arr.push(new Array(layer).fill('|').join(' '));
        arr.push('--');
      }
      arr.push(name);
      return arr.join('');
    },
    expandChangeHandler(row, expandedRows) {
      this.doLayout();
      this.$emit('expand-change', ...arguments);
    },
    rowClickHandler(row) {
      this.$emit('row-click', row);
    },
    deleteFunction(id) {
      this.$emit('delete', id);
    }
  }
};
</script>

<style lang="scss">
.expand-table {
  .el-table__expanded-cell[class*=cell] {
    padding: 0;
    border: none;
  }
}
</style>
