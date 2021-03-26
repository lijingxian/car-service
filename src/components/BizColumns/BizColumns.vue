<template>
  <el-dialog append-to-body :visible="visible" @close="onClose" title="自定义列" custom-class="biz-columns" width="500px">
    <div class="columns-wrap">
      <biz-flex-table ref="table" :checkable="false" :tableData="tableData" @selection-change="selectionChangeHandler">
        <el-table-column type="selection" width="50" :selectable="getSelectable"></el-table-column>
        <el-table-column label="信息" prop="name"></el-table-column>
        <el-table-column prop="tag" label="排序">
          <template #default="{$index}">
            <el-button icon="el-icon-sort-up" type="text" :disabled="$index===0" @click="onUp($index)"></el-button>
            <el-button icon="el-icon-sort-down" type="text" :disabled="$index===(tableData.length-1)" @click="onBottom($index)"></el-button>
          </template>
        </el-table-column>
      </biz-flex-table>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="onClose">取 消</el-button>
      <el-button type="primary" @click="update">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { BizFlexTable } from '@/components/BizTable';
import http from '@/common/http';
import urls from '@/common/urls';

export default {
  name: 'biz-columns',
  components: {
    BizFlexTable
  },
  props: {
    visible: Boolean,
    tableId: String
  },
  data() {
    return {
      id: '',
      tableName: '',
      selections: [],
      tableData: []
    };
  },
  computed: {},
  watch: {
    visible(visible) {
      if (visible) {
        this.makeRowDisplayable();
      } else {
        this.saveSelection();
      }
    },
    tableId() {
      this.getTableColumns();
    }
  },
  mounted() {
    this.getTableColumns();
  },
  methods: {
    getTableColumns() {
      http
        .get(urls.user.columns, {
          tableId: this.tableId
        })
        .then(data => {
          this.tableData = data.data.columnDatas;
          this.id = data.data.id;
          this.tableName = data.data.tableName;
        });
    },
    getSelectable(value) {
      return value.isEditable;
    },
    selectionChangeHandler(selections) {
      this.selections = selections;
    },
    saveSelection() {
      for (const iterator of this.tableData) {
        iterator.displayable = false;
      }
      for (const iterator of this.selections) {
        this.tableData.find(item => item.id === iterator.id).displayable = true;
      }
    },
    onUp(index) {
      this.tableData[index] = this.tableData.splice(index - 1, 1, this.tableData[index])[0];
    },
    onBottom(index) {
      this.tableData[index] = this.tableData.splice(index + 1, 1, this.tableData[index])[0];
    },
    onClose() {
      this.$emit('update:visible', false);
    },
    update() {
      for (const iterator of this.tableData) {
        iterator.displayable = false;
      }
      for (const iterator of this.selections) {
        this.tableData.find(item => item.id === iterator.id).displayable = true;
      }
      let params = {
        columnDatas: this.tableData,
        id: this.id,
        tableId: this.tableId,
        tableName: this.tableName
      };
      console.log(params);
      http.put(urls.user.columns, params).then(data => {
        this.$emit('update');
        this.$emit('update:visible', false);
      });
    },
    makeRowDisplayable() {
      setTimeout(() => {
        for (const iterator of this.tableData) {
          this.$refs.table.$refs.table.toggleRowSelection(iterator, iterator.displayable);
        }
      }, 20);
    }
  }
};
</script>

<style lang="scss">
.biz-columns {
  .el-dialog__body {
    padding-top: 0;
    padding-bottom: 0;
  }
  .columns-wrap {
    height: 500px;
    position: relative;
    i {
      font-size: 20px;
    }
  }
}
</style>
