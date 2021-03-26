<template>
  <el-table
    ref="expandTable"
    class="expand-table"
    size="small"
    tooltip-effect="dark"
    row-key="id"
    style="width: 100%;min-height: 100%;"
    :height="height"
    :border="showBorder"
    v-loading="loading"
    :data="data"
    :show-header="showHeader"
    :expand-row-keys="expandedRowKeys"
    :rowClassName="setClassName"
    @expand-change="expandChangeHandler"
    @row-click="rowClickHandler"
    @selection-change="handleSelectionChange"
    :cell-class-name="cellClassName"
    @moveUp="moveUp"
    @moveDown="moveDown"
  >
    <el-table-column type="expand" :label="maxLevel" width="100" :class-name="hasChild==='1'?'cell'+layer:'cell0'+layer" v-if="isSearch">
      <template slot-scope="scope">
        <expand-table
          v-if="scope.row.childrenProductCategoryDataList.length>0"
          class="expand-table-child"
          :height="'auto'"
          :layer="layer + 1"
          :hasChild="scope.row.hasChild"
          :data="scope.row.childrenProductCategoryDataList"
          :show-header="false"
          :show-border="false"
          :expand-row-keys="expandedRowKeys"
          @delete="deleteFunction"
          @expand-change="expandChangeHandler"
          @row-click="rowClickHandler"
          @selection-change="handleSelectionChange"
          @moveUp="moveUp"
          @moveDown="moveDown"
        ></expand-table>
      </template>
    </el-table-column>
    <el-table-column prop="name" label="分类" class-name="first-category-name">
      <div slot-scope="scope">
        <div class="biz-two-column">
          <img :src="scope.row.logo || DefaultImg" width="32px" height="32px" />
          <div class="biz-two-row">
            <div style="margin-left: 10px">{{ scope.row.name }}</div>
          </div>
        </div>
      </div>
    </el-table-column>
    <el-table-column prop="childrenProductCategoryData" label="参数">
      <template slot-scope="scope">
        <template v-if="scope.row.parameterGroupDataList.length===0">-</template>
        <div class="overlow-style">
          <template v-for="(parameterGroupDataList, index) in scope.row.parameterGroupDataList">
            {{parameterGroupDataList.name||'--'}}
            <template v-if="index < scope.row.parameterGroupDataList.length - 1">{{separator}}</template>
          </template>
        </div>
      </template>
    </el-table-column>
    <el-table-column prop="specificationDataList" label="规格" class-name="first-category-name">
      <template slot-scope="scope">
        <template v-if="scope.row.specificationDataList.length===0">-</template>
        <div class="overflow-style">
          <template v-for="(specificationDataList, index) in scope.row.specificationDataList">
            {{specificationDataList.name||'--'}}
            <template v-if="index < scope.row.specificationDataList.length - 1">{{separator}}</template>
          </template>
        </div>
      </template>
    </el-table-column>
    <el-table-column width="160" label="操作">
      <template #default="scope">
        <biz-column-operation :row="scope.row">
          <el-button type="text" size="mini" @click.stop="scope.$index===0?'':moveUp(scope.row)">上移</el-button>
          <el-button type="text" size="mini" @click.stop="scope.$index===data.length - 1?'':moveDown(scope.row)">下移</el-button>
          <el-button type="text" size="mini" v-if="hasAuthDel" @click.stop="deleteFunction(scope.row)">删除</el-button>
        </biz-column-operation>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import DefaultImg from '@/assets/images/commodity/pic_default_none_100.png';
import ColumnsMixin from '@/common/mixin/ColumnsMixin.js';
import { mapGetters } from 'vuex';
export default {
  name: 'ExpandTable',
  mixins: [ColumnsMixin],
  props: {
    showHeader: { type: Boolean, default: true },
    isSearch: { type: Boolean, default: true },
    hasChild: { type: String, default: '1' },
    data: {
      type: Array,
      default() {
        return [];
      }
    },
    height: { type: String, default: '100%' },
    loading: { type: Boolean, default: false },
    showBorder: { type: Boolean, default: false },
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
      currentLevel: 1,
      className: '',
      selections: [],
      selectionsChild: [],
      DefaultImg: DefaultImg,
      separator: '、'
    };
  },
  components: {},
  computed: {
    ...mapGetters('Authority', ['currentAuth']),
    hasAuthDel() {
      return this.currentAuth.includes('admin:PurchaseSaleStorage.productCategory.delete');
      // return true;
    }
  },
  watch: {},
  mounted() {
    let wheight = document.documentElement.clientHeight || window.innerHeight;
    let height = String(wheight - 205);
    document.querySelectorAll('.el-table__body-wrapper')[0].style.height = height + 'px';
    document.querySelectorAll('.el-table__body-wrapper')[0].style.overflowX = 'hidden';
    document.querySelectorAll('.el-table__body-wrapper')[0].style.overflowY = 'auto';
  },
  updated() {
    this.doLayout();
  },
  methods: {
    setClassName({ row, index }) {
      return row.hasChild > 0 ? 'expand' : 'noexpand';
    },
    cellClassName({ row, column, rowIndex, columnIndex }) {
      return 'row' + row.id;
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
      if (this.className && this.className.split('.')[1] !== 'row' + row.id) {
        document.querySelector(this.className).children[0].children[0].style.color = '#666666';
      }
      this.className = '.row' + row.id;
      document.querySelector(this.className).children[0].children[0].style.color = '#ff7300';
      let temp = [];
      console.log('this.currentLevel' + this.currentLevel);
      console.log('row.treeLevel' + this.currentLevel);
      if (expandedRows && expandedRows.length > 0) {
        this.currentLevel = row.treeLevel;
      } else {
        this.currentLevel = row.treeLevel - 1;
      }
      for (let i = 0; i <= this.currentLevel; i++) {
        temp.push(i + 1);
      }
      this.maxLevel = temp.join(' ');
      console.log(this.$refs.expandTable);
      this.$emit('expand-change', row, expandedRows);
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
  .biz-icon-i-web-dp,
  .biz-icon-i-web-yys {
    font-size: 32px;
    color: #ff7300;
  }
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
