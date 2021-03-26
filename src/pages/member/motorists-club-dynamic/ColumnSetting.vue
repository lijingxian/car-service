<template>
  <biz-grid class="column-setting" v-loading="loading">
    <biz-flex-table ref="table" :tableData="tableDataNew" class="table" :checkable="checkable" :operations="operations" @operate="operate">
      <el-table-column prop="name" label="栏目">
      </el-table-column>
      <!-- <el-table-column prop="order" label="排列">
        <template slot-scope="scope">
          <el-input-number v-model="scope.row.order" controls-position="right" @change="handleChange(scope.$index, scope.row)" :min="1" class="rank-style"></el-input-number>
        </template>
      </el-table-column> -->
      <el-table-column prop="isVisible" label="是否可见">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.isVisible"  active-color="#87d068" inactive-color="#d9d9d9" :disabled="scope.row.name==='推荐'" @change="onChange">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column width="120" label="操作">
      <template slot-scope="scope">
        <div class="biz-customcol">
          <el-button type="text" size="mini" @click.stop="scope.row.id===tableDataNew[0].id?'':moveUp(scope.row)">上移</el-button>
          <el-button type="text" size="mini" @click.stop="scope.row.id===tableDataNew[tableDataNew.length-1].id?'':moveDown(scope.row)">下移</el-button>
        </div>
      </template>
    </el-table-column>
    </biz-flex-table>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import { BizFlexTable } from '@/components/BizTable';
import http from '@/common/http';
import urls from '@/common/urls';

export default {
  name: 'column-setting',
  data() {
    return {
      rank: 1,
      loading: false,
      checkable: false,
      tableData: [],
      tableDataNew: [],
      dataList: [],
      operations: [
        {
          label: '保存',
          name: 'save',
          type: 'primary'
        }
      ]
    };
  },
  props: {
    refresh: {
      type: Boolean,
      default: false
    }
  },
  components: { BizFlexTable, BizGrid },
  computed: {
    columnsCorrect() {
      let tableData = this.tableData;
      let len = tableData.length;
      let num;
      for (let i = 0; i < len - 1; i++) {
        for (let j = i + 1; j < len; j++) {
          num = tableData[i].order;
          if (num === tableData[j].order) {
            return false;
          }
        }
      }

      return true;
    }
  },
  watch: {
    refresh(newValue) {
      if (newValue) {
        this.getList();
      }
    }
  },
  methods: {
    operate(name) {
      this[name]();
    },
    moveUp(row) {
      this.loading = true;
      let order = row.order;
      this.tableDataNew.map(item => {
        if (item.id === row.id) {
          this.tableDataNew[this.tableDataNew.indexOf(row)].order = this.tableDataNew[this.tableDataNew.indexOf(row) - 1].order;
          this.tableDataNew[this.tableDataNew.indexOf(row) - 1].order = order;
          this.dataList = [this.tableDataNew[this.tableDataNew.indexOf(row)], this.tableDataNew[this.tableDataNew.indexOf(row) - 1]];
          this.order();
        }
      });
    },
    moveDown(row) {
      this.loading = true;
      let order = row.order;
      this.dataList = [];
      this.tableDataNew.map(item => {
        if (item.id === row.id) {
          this.tableDataNew[this.tableDataNew.indexOf(row)].order = this.tableDataNew[this.tableDataNew.indexOf(row) + 1].order;
          this.tableDataNew[this.tableDataNew.indexOf(row) + 1].order = order;
          this.dataList = [this.tableDataNew[this.tableDataNew.indexOf(row)], this.tableDataNew[this.tableDataNew.indexOf(row) + 1]];
          this.order();
        }
      });
    },
    order() {
      http
        .put('/admin/communityColumn/communityColumnSort.jhtml', this.dataList)
        .then(data => {
          this.getList();
          this.loading = false;
        })
        .catch(ErrorData => {
          this.loading = false;
          this.$message.warning(ErrorData.errorMessage || '操作出现错误');
        });
    },
    showUp(row) {
      if (this.tableDataNew[0] && row.id === this.tableDataNew[0].id) {
        return false;
      } else {
        return true;
      }
    },
    showDown(row) {
      if (this.tableDataNew[0] && row.id === this.tableDataNew[this.tableDataNew.length - 1].id) {
        return false;
      } else {
        return true;
      }
    },
    save() {
      if (!this.columnsCorrect) {
        this.$notify({
          title: '警告',
          message: '排序数值不可重复',
          type: 'warning'
        });
        return;
      }
      this.loading = true;
      let communityColumns = [];
      let obj;
      this.tableData.forEach(element => {
        obj = {};
        obj.id = element.id;
        obj.name = element.name;
        obj.isVisible = element.isVisible ? '1' : '0';
        obj.order = element.order.toString();
        communityColumns.push(obj);
      });
      let param = {
        communityColumns: communityColumns
      };
      http
        .put(urls.motoristsClubDynamic.updateColumn, param)
        .then(data => {
          this.loading = false;
          this.tableData = data.content;
          this.tableData.forEach(element => {
            element.isVisible = element.isVisible === '1';
          });
          this.$message.success('操作成功');
        })
        .catch(error => {
          this.loading = false;
          this.$message.warning(error.errorMessage);
        });
    },
    handleChange(index, row) {
      this.loading = true;
      this.$nextTick(() => {
        this.tableDataHandle();
        this.loading = false;
      });
    },
    tableDataHandle() {
      let tableData = this.tableData;
      let len = tableData.length;
      this.tableDataNew = [];
      for (let i = 0; i < len; i++) {
        for (let j = i + 1; j < len; j++) {
          if (parseInt(tableData[i].order) > parseInt(tableData[j].order)) {
            let temp = tableData[j];
            tableData[j] = tableData[i];
            tableData[i] = temp;
          }
        }
      }
      for (let i = 0; i < len; i++) {
        this.tableDataNew.push(tableData[i]);
      }
      this.$forceUpdate();
    },
    getList() {
      this.loading = true;
      http
        .get(urls.motoristsClubDynamic.communityColumns)
        .then(data => {
          this.loading = false;
          this.tableData = data.content;
          this.tableData.forEach(element => {
            element.isVisible = element.isVisible === '1';
          });
          this.$nextTick(() => {
            this.tableDataHandle();
          });
        })
        .catch(error => {
          this.loading = false;
          this.$message.warning(error.errorMessage);
        });
    },
    onChange() {
      this.tableDataHandle();
    }
  },
  created() {
    this.getList();
  }
};
</script>

<style lang="scss">
.column-setting {
  padding-top: 10px;
  width: 480px;
  .biz-header .biz-header__operation-wrapper {
    float: right;
  }
  .table {
    padding: 0 20px 20px 20px;
    .rank-style {
      width: 110px;
    }
  }
}
</style>
