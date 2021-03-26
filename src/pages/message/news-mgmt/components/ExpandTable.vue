<template>
  <div style="height:100%">
    <el-table ref='expandTable' class="expand-table" size="small" tooltip-effect="dark" row-key="messageId"
      style="width: 100%;min-height: 100%;" :height="height" :border="showBorder" v-loading="loading" :data="data"
      :show-header="showHeader" :expand-row-keys="expandedRowKeys" :rowClassName="setClassName" @expand-change="expandChangeHandler"
      @row-click="rowClickHandler" @selection-change="handleSelectionChange" :cell-class-name="cellClassName"
      @deleteCategory="deleteCategory">
      <!-- <el-table-column type="selection" width="50"></el-table-column> -->
      <el-table-column type="expand" width="100">
        <template slot-scope="scope">
          <expand-table v-if="scope.row.childrenList.length>0" class="expand-table-child" :height="'auto'"
            :layer="layer + 1" :mergeFlg="scope.row.mergeFlg"  :data="scope.row.childrenList" :show-header="false" :show-border="false"
            :expand-row-keys="expandedRowKeys" @deleteCategory="deleteCategory" @expand-change="expandChangeHandler"
            @row-click="rowClickHandler" @selection-change="handleSelectionChange">
          </expand-table>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="消息">
        <template slot-scope="scope">
          <div>
            <div>{{scope.row.typeName}}</div>
            <div class="overflow-style">{{scope.row.content}}</div>
            <div class="overflow-style yellow" @click.stop="getMap(scope.row)">{{scope.row.address || '--'}}</div>
            <div class="overflow-style">{{scope.row.sendTime || '--'}}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="childrenProductCategoryData" label="车辆">
        <template slot-scope="scope">
          <div>
            <div>{{scope.row.carPlateNumber}}</div>
            <div class="overflow-style">车主：{{ scope.row.car.member ? scope.row.car.member.name : '--' }}</div>
            <div class="overflow-style">电话：{{ scope.row.car.member ? scope.row.car.member.mobile : '--' }}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column width="160" label="操作">
        <template slot-scope="scope">
            <el-button type="text" size="mini" @click.stop="deleteCategory(scope.row)" v-if="hasAuthDel">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :visible.sync="dialogVisiable" @close="dialogVisiable=false" append-to-body>
      <biz-location-map v-model="point" ref="map"></biz-location-map>
    </el-dialog>
  </div>
</template>

<script>
import { BizLocationMap } from '@/components/BizLocationMap';
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
    mergeFlg: { type: String, default: '1' },
    data: {
      type: Array,
      default() {
        return [];
      }
    },
    pagination: {
      type: Object,
      required: false
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
      separator: '/',
      className: '',
      selections: [],
      selectionsChild: [],
      dialogVisiable: false,
      point: {
        lng: '',
        lat: '',
        address: ''
      }
    };
  },
  components: { BizLocationMap },
  computed: {
    ...mapGetters('Authority', ['currentAuth']),
    hasAuthDel() {
      // return true;
      return this.currentAuth.includes('admin:productCategory.delete');
    }
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
    getMap(row) {
      this.point.lng = row.longitude;
      this.point.lat = row.latitude;
      this.point.address = row.address;
      this.dialogVisiable = true;
      this.$nextTick(() => {
        this.$refs.map.init();
      });
    },
    handleSizeChange(val) {
      this.$emit('handleSizeChange', val);
    },
    handleCurrentChange(val) {
      this.$emit('handleCurrentChange', val);
    },
    setClassName({ row, index }) {
      return row.mergeFlg > 0 ? 'expand' : 'noexpand';
    },
    cellClassName({ row, column, rowIndex, columnIndex }) {
      return 'row' + row.messageId;
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
      if (this.className && this.className.split('.')[1] !== 'row' + row.messageId) {
        document.querySelector(this.className).children[0].children[0].style.color = '#666666';
      }
      this.className = '.row' + row.messageId;
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
        query: { parentId: row.messageId, type: row.userType }
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
  .overflow-style {
    display: -webkit-box !important;
    overflow: hidden;
    white-space: normal !important;
    text-overflow: ellipsis;
    word-wrap: break-word;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
  }
  .yellow {
    color:#ff7300;
    cursor: pointer;
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
