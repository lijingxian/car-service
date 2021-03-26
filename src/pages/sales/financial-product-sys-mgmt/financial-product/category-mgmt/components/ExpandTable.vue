<template>
  <el-table ref='expandTable' class="expand-table" size="small" tooltip-effect="dark" row-key="id"
    style="width: 100%;min-height: 100%;" :height="height" :border="showBorder" v-loading="loading" :data="data"
    :show-header="showHeader" :expand-row-keys="expandedRowKeys" :rowClassName="setClassName" @expand-change="expandChangeHandler"
    @row-click="rowClickHandler" @selection-change="handleSelectionChange" :cell-class-name="cellClassName"
    @deleteCategory="deleteCategory" @moveUp="moveUp" @moveDown="moveDown">
    <el-table-column type="expand" :label="maxLevel" width="100">
      <template slot-scope="scope">
        <expand-table v-if="scope.row.childrenProductCategoryDataList.length>0" class="expand-table-child" :height="'auto'"
          :layer="layer + 1" :data="scope.row.childrenProductCategoryDataList" :show-header="false" :show-border="false"
          :expand-row-keys="expandedRowKeys" @deleteCategory="deleteCategory" @expand-change="expandChangeHandler"
          @row-click="rowClickHandler" @selection-change="handleSelectionChange" @moveUp="moveUp" @moveDown="moveDown">
        </expand-table>
      </template>
    </el-table-column>
    <el-table-column prop="name" label="分类名称">
    </el-table-column>
    <el-table-column prop="type" label="分类类型" :formatter="typeFormatter">
    </el-table-column>
    <el-table-column prop="childrenProductCategoryDataList" label="参数">
      <template slot-scope="scope">
        <template v-for="(parameterGroupDataList, index) in scope.row.parameterGroupDataList">
          {{parameterGroupDataList.name}}
          <template v-if="index < scope.row.parameterGroupDataList.length - 1">{{separator}}</template>
        </template>
      </template>
    </el-table-column>
    <el-table-column prop="childrenProductCategoryDataList" label="属性">
      <template slot-scope="scope">
        <template v-for="(attributeDataList, index) in scope.row.attributeDataList">
          {{attributeDataList.name}}
          <template v-if="index < scope.row.attributeDataList.length - 1">{{separator}}</template>
        </template>
      </template>
    </el-table-column>
    <el-table-column prop="childrenProductCategoryDataList" label="规格">
      <template slot-scope="scope">
        <template v-for="(specificationDataList, index) in scope.row.specificationDataList">
          {{specificationDataList.name}}
          <template v-if="index < scope.row.specificationDataList.length - 1">{{separator}}</template>
        </template>
      </template>
    </el-table-column>
    <el-table-column width="160" label="操作">
      <template #default="scope">
        <biz-column-operation :row="scope.row">
          <el-button type="text" size="mini" @click.stop="scope.row.id===data[0].id?'':moveUp(scope.row)">上移</el-button>
          <el-button type="text" size="mini" @click.stop="scope.row.id===data[data.length-1].id?'':moveDown(scope.row)">下移
          </el-button>
          <el-button type="text" size="mini" @click.stop="deleteCategory(scope.row)">删除</el-button>
        </biz-column-operation>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { mapGetters } from 'vuex';
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
    hasChild: { type: String, default: '1' },
    data: {
      type: Array,
      default() {
        return [];
      }
    },
    height: { type: String, default: '100%' },
    loading: { type: Boolean, default: false },
    showBorder: { type: Boolean, default: true },
    layer: { type: Number, default: 0 },
    expandedRowKeys: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      maxLevel: '1',
      separator: '、',
      className: '',
      selections: [],
      selectionsChild: []
    };
  },
  components: {},
  computed: {
    ...mapGetters('Authority', ['currentAuth'])
  },
  watch: {},
  mounted() {
    let wheight = document.documentElement.clientHeight || window.innerHeight;
    let height = String(wheight - 185);
    document.querySelectorAll('.el-table__body-wrapper')[0].style.height = height + 'px';
    document.querySelectorAll('.el-table__body-wrapper')[0].style.overflowX = 'hidden';
    document.querySelectorAll('.el-table__body-wrapper')[0].style.overflowY = 'auto';
  },
  updated() {
    this.doLayout();
  },
  methods: {
    typeFormatter(row) {
      switch (row.type) {
        case 'finance':
          return '金融';
        case 'carInsurance':
          return '车险';
        case 'extensionInsurance':
          return '延保';
        case 'travelInsurance':
          return '旅行';
        case 'propertyInsurance':
          return '财产';
        case 'healthInsurance':
          return '健康';
        case 'lifeInsurance':
          return '人寿';
        default:
          break;
      }
    },
    setClassName({ row, index }) {
      return row.childrenProductCategoryDataList && row.childrenProductCategoryDataList.length > 0 ? 'expand' : 'noexpand';
    },
    cellClassName({ row, column, rowIndex, columnIndex }) {
      return 'row' + row.id;
    },
    showUp(row) {
      if (this.data[0] && row.id === this.data[0].id) {
        return false;
      } else {
        return true;
      }
    },
    showDown(row) {
      if (this.data[0] && row.id === this.data[this.data.length - 1].id) {
        return false;
      } else {
        return true;
      }
    },
    doLayout() {
      document.querySelectorAll('.expand-table-child .el-table__body-wrapper').forEach(el => {
        el.style.height = 'auto';
      });
      document.querySelectorAll('.el-table__expand-icon').forEach(el => {
        el.children[0].className = 'iconfont biz-icon-i-web-zk1';
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
      let temp = [];
      if (row.treeLevel > 0) {
        for (let i = 0; i <= row.treeLevel; i++) {
          temp.push(i + 1);
        }
        this.maxLevel = temp.join(' ');
      }
      if (this.className && this.className.split('.')[1] !== 'row' + row.id) {
        document.querySelector(this.className).children[0].children[0].style.color = '#666666';
      }
      this.className = '.row' + row.id;
      document.querySelector(this.className).children[0].children[0].style.color = '#ff7300';
      if (expandedRows && expandedRows.length === 0) {
        this.maxLevel = '1';
      }
      console.log(this.$refs.expandTable);
      this.$emit('expand-change', row);
    },
    rowClickHandler(row) {
      this.$emit('row-click', row);
    },
    deleteFunction(row) {
      this.$emit('delete', row);
    },
    handleSelectionChange(val) {
      this.selections = val;
      this.$emit('selection-change', val);
    },
    deleteCategory(row) {
      this.$emit('deleteCategory', row);
    },
    moveUp(row) {
      this.$emit('moveUp', row);
    },
    moveDown(row) {
      this.$emit('moveDown', row);
    }
  }
};
</script>

<style lang="scss">
.expand-table-child {
  .noexpand {
    .el-table__expand-icon {
      visibility: hidden;
    }
  }
  .el-table__expanded-cell[class*='cell'] {
    padding: 0;
    border: none;
  }
}
.expand-table {
  .noexpand {
    .el-table__expand-icon {
      visibility: hidden;
    }
  }
  .el-table__expanded-cell[class*='cell'] {
    padding: 0;
    border: none;
  }
  .cell1 {
    .cell {
      padding-left: 20px !important;
    }
  }
  .cell2 {
    .cell {
      padding-left: 30px !important;
    }
  }
  .cell3 {
    .cell {
      padding-left: 40px !important;
    }
  }
  .cell4 {
    .cell {
      padding-left: 50px !important;
    }
  }
  .cell5 {
    .cell {
      padding-left: 60px !important;
    }
  }
  .cell6 {
    .cell {
      padding-left: 70px !important;
    }
  }
  .cell01 {
    .cell {
      padding-left: 20px !important;
      display: none;
    }
  }
  .cell02 {
    .cell {
      padding-left: 30px !important;
      display: none;
    }
  }
  .cell03 {
    .cell {
      padding-left: 40px !important;
      display: none;
    }
  }
  .cell04 {
    .cell {
      padding-left: 50px !important;
      display: none;
    }
  }
  .cell05 {
    .cell {
      padding-left: 60px !important;
      display: none;
    }
  }
  .cell06 {
    .cell {
      padding-left: 70px !important;
      display: none;
    }
  }
}
</style>
