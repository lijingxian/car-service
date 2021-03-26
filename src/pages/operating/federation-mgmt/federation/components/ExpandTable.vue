<template>
  <el-table ref='expandTable' class="expand-table" size="small" row-key="id"
    style="width: 100%;min-height: 100%;" :height="height" :border="showBorder" v-loading="loading" :data="data"
    :show-header="showHeader" :expand-row-keys="expandedRowKeys" :rowClassName="setClassName" @expand-change="expandChangeHandler"
    @row-click="rowClickHandler" @selection-change="handleSelectionChange" @addOperator="addOperator" @addStore="addStore"
    :cell-class-name="cellClassName">
    <!-- <el-table-column type="selection" width="50"></el-table-column> -->
    <el-table-column type="expand" :label="maxLevel" width="100" :class-name="hasChild==='1'?'cell'+layer:'cell0'+layer"
      v-if="isSearch">
      <template slot-scope="scope">
        <expand-table v-if="scope.row.childUsers.length>0" class="expand-table-child" :height="'auto'" :layer="layer + 1"
          :hasChild="scope.row.hasChild" :data="scope.row.childUsers" :show-header="false" :show-border="false"
          :expand-row-keys="expandedRowKeys" @delete="deleteFunction" @expand-change="expandChangeHandler"
          @row-click="rowClickHandler" @selection-change="handleSelectionChange" @addOperator="addOperator" @addStore="addStore">
        </expand-table>
      </template>
    </el-table-column>
    <el-table-column label="运营商/店铺" prop="name" min-width="160">
      <template slot-scope="scope">
        <div style="display:flex;width:100%;align-items:center">
          <i class="iconfont biz-icon-i-web-dp" v-if="scope.row.userType === 'store'"></i><i class="iconfont biz-icon-i-web-yys"
            v-if="scope.row.userType === 'operator'"></i>
          <div>
            <div class="overflow">{{ scope.row.name }}</div>
            <div class="overflow">{{ scope.row.phone }}</div>
            <div class="overflow">{{ scope.row.address }}</div>
          </div>
        </div>
      </template>
    </el-table-column>
    <!-- <el-table-column label="地址" prop="address" min-width="120">
      <template slot-scope="scope">
        <div style="width:100%">
          <div class="overflow">
            {{ scope.row.address }}
          </div>
        </div>
      </template>
    </el-table-column>
    <el-table-column label="电话" prop="phone" min-width="80">
      <template slot-scope="scope">
        <div style="width:100%">
          <div class="overflow">
            {{ scope.row.phone }}
          </div>
        </div>
      </template>
    </el-table-column> -->
    <el-table-column label="状态" prop="isEnabled" min-width="50">
      <template slot-scope="scope">
        <span :style="{color: stateColor(scope.row)}">{{ scope.row.isEnabled==='1'?'启用':'停用'}}</span>
      </template>
    </el-table-column>
    <el-table-column label="创建日期" prop="createDate" min-width="80">
      <template slot-scope="scope">
        <div style="width:100%">
          <div class="overflow">
            {{ scope.row.createDate }}
          </div>
        </div>
      </template>
    </el-table-column>
    <el-table-column label="操作" width="100">
      <template #default="scope">
        <biz-column-operation :row="scope.row">
          <el-button type="text" size="mini" @click.stop="deleteFunction(scope.row)" v-if="hasAuthDelete">
            删除
          </el-button>
          <el-button type="text" size="mini" @click.stop="adminMgmt(scope.row)" v-if="hasAuthUser">
            用户管理
          </el-button>
          <el-button type="text" size="mini" @click.stop="addOperator(scope.row)" v-show="scope.row.userType==='operator'" v-if="hasAuthAdd">
            新增运营商
          </el-button>
          <el-button type="text" size="mini" @click.stop="addStore(scope.row)" v-if="hasAuthAdd">
            新增店铺
          </el-button>
        </biz-column-operation>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { mapGetters } from 'vuex';
import ColumnsMixin from '@/common/mixin/ColumnsMixin.js';
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
      selectionsChild: []
    };
  },
  components: {},
  computed: {
    ...mapGetters('Authority', ['currentAuth']),
    hasAuthEdit() {
      // return true;
      return this.currentAuth.includes('admin:union.manage.edit');
    },
    hasAuthDelete() {
      // return true;
      return this.currentAuth.includes('admin:union.manage.delete');
    },
    hasAuthAdd() {
      // return true;
      return this.currentAuth.includes('admin:union.manage.add');
    },
    hasAuthUser() {
      // return true;
      return this.currentAuth.includes('admin:union.manage.usermanage');
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
    stateColor(row) {
      if (row.isEnabled === '1') {
        return '#11AE17';
      } else {
        return '#FF7300';
      }
    },
    handleSelectionChange(val) {
      this.selections = val;
      this.$emit('selection-change', val);
    },
    addOperator(row) {
      this.$emit('addOperator', row);
    },
    addStore(row) {
      this.$emit('addStore', row);
    },
    adminMgmt(row) {
      if (row.userType === 'operator') {
        window.SHOP_ID = '';
        window.Company_ID = row.id;
      } else {
        window.SHOP_ID = row.id;
        window.Company_ID = '';
      }
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
