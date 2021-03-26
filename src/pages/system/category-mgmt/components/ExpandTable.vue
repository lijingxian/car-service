<template>
  <el-table ref='expandTable' class="expand-table" size="small" tooltip-effect="dark" row-key="id"
    style="width: 100%;min-height: 100%;" :height="height" :border="showBorder" v-loading="loading" :data="data"
    :show-header="showHeader" :expand-row-keys="expandedRowKeys" :rowClassName="setClassName" @expand-change="expandChangeHandler"
    @row-click="rowClickHandler" @selection-change="handleSelectionChange" :cell-class-name="cellClassName"
    @deleteCategory="deleteCategory" @moveUp="moveUp" @moveDown="moveDown">
    <!-- <el-table-column type="selection" width="50"></el-table-column> -->
    <el-table-column type="expand" :label="maxLevel" width="100">
      <template slot-scope="scope">
        <expand-table v-if="scope.row.childrenProductCategoryDataList.length>0" class="expand-table-child" :height="'auto'"
          :layer="layer + 1" :data="scope.row.childrenProductCategoryDataList" :show-header="false" :show-border="false"
          :expand-row-keys="expandedRowKeys" @deleteCategory="deleteCategory" @moveUp="moveUp" @moveDown="moveDown"
          @expand-change="expandChangeHandler" @row-click="rowClickHandler" @selection-change="handleSelectionChange">
        </expand-table>
      </template>
    </el-table-column>
    <el-table-column prop="name" label="分类">
    </el-table-column>
    <el-table-column prop="childrenProductCategoryData" label="参数">
      <template slot="header">
        <div slot="label">
          参数
          <el-button type="text" size="small" v-popover:parameter>
            <i class="iconfont el-icon-question"></i>
          </el-button>
          <el-popover ref="parameter" placement="bottom-start" width="300" trigger="hover">
            <p>参数用于用户端商品详细页面展示商品信息</p>
          </el-popover>
        </div>
      </template>
      <template slot-scope="scope">
        <template v-for="(parameterGroupDataList, index) in scope.row.parameterGroupDataList">
          {{parameterGroupDataList.name||'--'}}
          <template v-if="index < scope.row.parameterGroupDataList.length - 1">{{separator}}</template>
        </template>
      </template>
    </el-table-column>
    <!-- <el-table-column prop="childrenProductCategoryData" label="属性">
      <template slot="header">
        <div slot="label">
          属性
          <el-button type="text" size="small" v-popover:attribute>
            <i class="iconfont el-icon-question"></i>
          </el-button>
          <el-popover ref="attribute" placement="bottom-start" width="300" trigger="hover">
            <p>属性用于用户端商品列表页面进行商品检索</p>
          </el-popover>
        </div>
      </template>
      <template slot-scope="scope">
        <template v-for="(attributeDataList, index) in scope.row.attributeDataList">
          {{attributeDataList.name}}
          <template v-if="index < scope.row.attributeDataList.length - 1">{{separator}}</template>
        </template>
      </template>
    </el-table-column> -->
    <el-table-column prop="childrenProductCategoryData" label="规格">
      <template slot="header">
        <div slot="label">
          规格
          <el-button type="text" size="small" v-popover:specification>
            <i class="iconfont el-icon-question"></i>
          </el-button>
          <el-popover ref="specification" placement="bottom-start" width="300" trigger="hover">
            <p>规格 是依据顾客的购买习惯而独立出来的一种商品的特殊属性；商品规格不同，可能会有不同的价格。如一款车有红色、黑色、白色3种颜色，消费者可以选择任一颜色进行购买，这里的颜色被称为规格</p>
          </el-popover>
        </div>
      </template>
      <template slot-scope="scope">
        <template v-for="(specificationDataList, index) in scope.row.specificationDataList">
          {{specificationDataList.name||'--'}}
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
  computed: {},
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
    },
    adminMgmt(row) {
      this.$router.push({
        path: '/oa/staff-mgmt/admin',
        query: { parentId: row.id, type: row.userType }
      });
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
