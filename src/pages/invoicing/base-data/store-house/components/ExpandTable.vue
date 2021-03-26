<template>
  <el-table
    ref="expandTable"
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
    :rowClassName="setClassName"
    :cell-class-name="cellClassName"
    :expand-row-keys="expandedRowKeys"
    @expand-change="expandChangeHandler"
    @row-click="rowClickHandler"
    @handleAgent="handleAgent"
    @handleAdmin="handleAdmin"
  >
    <el-table-column type="expand" :label="maxLevel" width="100" :class-name="hasChild==='1'?'cell'+layer:'cell0'+layer" v-if="isSearch">
      <template slot-scope="scope">
        <expand-table
          v-if="scope.row.children.length>0"
          class="expand-table-child"
          :height="'auto'"
          :hasChild="scope.row.hasChild"
          :layer="layer + 1"
          :data="scope.row.children"
          :show-header="false"
          :show-border="false"
          :expand-row-keys="expandedRowKeys"
          @delete="handleDeleteClick"
          @handleAgent="handleAgent"
          @handleAdmin="handleAdmin"
          @expand-change="expandChangeHandler"
          @row-click="rowClickHandler"
        ></expand-table>
      </template>
    </el-table-column>
    <el-table-column label="仓库" prop="name" class-name="first-name">
      <template slot-scope="scope">
        <div style="width:100%">
          <div class="overflow">名称：{{scope.row.name}}
            <el-button slot="reference" size="mini" type="primary" style="border-radius: 10px;font-size:8px;background-color: #ff7300;color: #fff;padding: 5px;" v-if="scope.row.isDefault==='1'">默认</el-button>
          </div>
          <div class="overflow">地址：{{scope.row.address?scope.row.address:'--'}}</div>
        </div>
      </template>
    </el-table-column>
    <el-table-column label="联系信息">
      <template slot-scope="scope">
        <div style="width:100%">
          <div class="overflow">联系人：{{scope.row.contactor?scope.row.contactor:'--'}}</div>
          <div class="overflow">电话：{{scope.row.phone?scope.row.phone:'--'}}</div>
          <div class="overflow">邮箱：{{scope.row.email?scope.row.email:'--'}}</div>
        </div>
      </template>
    </el-table-column>
    <el-table-column label="状态" prop="state" min-width="50px">
      <template slot-scope="scope">
        <span :style="{color: stateColor(scope.row)}">{{scope.row.enabled==='1'?'启用':'停用'}}</span>
      </template>
    </el-table-column>
    <el-table-column prop="tag" label="操作">
      <template slot-scope="scope">
        <el-button type="text" size="mini" v-if="scope.row.grade!=='2'&&hasAuthAdd" @click.stop="handleAgent($event, scope.row)">添加仓库</el-button>
        <el-button type="text" size="mini" v-if="hasAuthDel" @click.stop="handleDeleteClick($event, scope.row)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  name: 'ExpandTable',
  filters: {},
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
      className: ''
    };
  },
  components: {},
  computed: {
    ...mapGetters('Authority', ['currentAuth']),
    hasAuthAdmin() {
      return this.currentAuth.includes('admin:agent.usermanage');
      // return true;
    },
    hasAuthDel() {
      return this.currentAuth.includes('admin:agent.delete');
      // return true;
    },
    hasAuthAdd() {
      return this.currentAuth.includes('admin:agent.add');
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
    stateColor(row) {
      if (row.enabled === '1') {
        return '#11AE17';
      } else {
        return '#FF7300';
      }
    },
    handleDeleteClick(e, row) {
      this.$emit('delete', e, row);
    },
    handleAgent(e, row) {
      this.$emit('handleAgent', e, row);
    },
    handleAdmin(e, row) {
      this.$emit('handleAdmin', e, row);
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
