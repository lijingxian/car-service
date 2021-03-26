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
  >
    <el-table-column type="selection" width="50"></el-table-column>
    <el-table-column type="expand" :label="maxLevel" width="100" :class-name="hasChild==='1'?'cell'+layer:'cell0'+layer" v-if="isSearch">
      <template slot-scope="scope">
        <expand-table
          v-if="scope.row.children.length>0"
          class="expand-table-child"
          :height="'auto'"
          :layer="layer + 1"
          :hasChild="scope.row.hasChild"
          :data="scope.row.children"
          :show-header="false"
          :show-border="false"
          :expand-row-keys="expandedRowKeys"
          @delete="deleteFunction"
          @expand-change="expandChangeHandler"
          @row-click="rowClickHandler"
          @selection-change="handleSelectionChange"
          @clickHandle="clickHandle"
        ></expand-table>
      </template>
    </el-table-column>
    <el-table-column prop="name" label="分类名称" class-name="first-category-name">
      <template slot-scope="scope">
        <div style="width:100%">
          <div class="overflow">{{scope.row.name}}</div>
          <div class="overflow" style="font-size:10px">{{scope.row.description?scope.row.description:''}}</div>
        </div>
      </template>
    </el-table-column>
    <el-table-column prop="tags" label="标签">
      <template slot-scope="scope">
        <template v-if="scope.row.storeTags&&scope.row.storeTags.length===0&&scope.row.platformTags&&scope.row.platformTags.length===0">--</template>
        <div class="overflow-style">
          <template v-for="(storeList, index) in scope.row.storeTags">
            {{storeList.name||'--'}}
            <template v-if="index < scope.row.storeTags.length - 1">{{separator}}</template>
          </template>
          <template v-for="(platformList, index) in scope.row.platformTags">
            {{platformList.name||'--'}}
            <template v-if="index < scope.row.platformTags.length - 1">{{separator}}</template>
          </template>
        </div>
      </template>
    </el-table-column>
    <el-table-column prop="isVisibleToStore" label="店铺是否可见分类" class-name="first-category-name" v-if="getUser.roleLevel==='platform'">
      <template slot-scope="scope">
        <div class="switch-container" @click="clickHandle($event)">
          <div class="biz-customcol">{{scope.row.isVisibleToStore?'√':'x'}}</div>
        </div>
      </template>
    </el-table-column>
    <el-table-column prop="isTagEditableToStore" label="店铺是否可编辑分类标签" class-name="first-category-name" v-if="getUser.roleLevel==='platform'">
      <template slot-scope="scope">
        <div class="switch-container" @click="clickHandle($event)">
          <div class="biz-customcol">{{scope.row.isTagEditableToStore?'√':'x'}}</div>
        </div>
      </template>
    </el-table-column>
    <el-table-column prop="isChildEditableToStore" label="店铺是否可添加子分类" class-name="first-category-name" v-if="getUser.roleLevel==='platform'">
      <template slot-scope="scope">
        <div class="switch-container" @click="clickHandle($event)">
          <div class="biz-customcol">{{scope.row.isChildEditableToStore?'√':'x'}}</div>
        </div>
      </template>
    </el-table-column>
    <el-table-column label="操作">
      <template slot-scope="scope">
        <!-- <span v-if="getUser.roleLevel==='shop'&&scope.row.hierarchy==='0'">--</span> -->
        <el-button type="text" size="mini" v-if="scope.row.isChildEditableToStore==='1'" @click.stop="addChildcategory($event,scope.row)">添加子分类</el-button>
        <el-button type="text" size="mini" v-if="getUser.roleLevel!=='shop'||scope.row.hierarchy!=='0'" @click.stop="deleteFunction(scope.row)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  name: 'ExpandTable',
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
      currentLevel: 1,
      className: '',
      selections: [],
      selectionsChild: [],
      separator: '、'
    };
  },
  components: {},
  computed: {
    ...mapGetters(['getUser'])
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
      console.log('row.grade' + this.currentLevel);
      if (expandedRows && expandedRows.length > 0) {
        this.currentLevel = Number(row.grade) + 1;
      } else {
        this.currentLevel = Number(row.grade);
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
    clickHandle(event) {
      this.$emit('clickHandle', event);
    },
    addChildcategory(event, row) {
      this.$emit('addChildcategory', event, row);
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
