<template>
  <div class="screen-mgmt">
    <biz-flex-table ref="table" v-loading="loading" :operations="operations" @operate="operate" :tableData="tableData" :filters="filters"
      :pagination="pagination" @row-click="rowClick" @selection-change="handleSelectionChange" @size-change="handleSizeChange"
      @current-change="handleCurrentChange">
      <el-table-column prop="name" label="名称">
      </el-table-column>
      <el-table-column prop="type" label="类别">
        <template slot-scope="scope">
          <div class="biz-customcol">
            {{scope.row.type==='0'?'智能到店':scope.row.type==='1'?'透明车间':'品宣视频'}}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="" label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="text" @click.stop="deleteRow(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </biz-flex-table>
    <biz-popup-tabs v-model="tabName" :open="openPopup" @close="openPopup = false;">
      <el-tab-pane label="基本信息" name="baseinfo">
        <BaseInfo ref="baseinfo" :open="openPopup" :id="itemId" @created="refresh">
        </BaseInfo>
      </el-tab-pane>
    </biz-popup-tabs>
  </div>
</template>

<script>
import { BizFlexTable } from '@/components/BizTable';
import { BizPopupTabs } from '@/components/BizPopup';
import http from '@/common/http';
import BaseInfo from './BaseInfo';
export default {
  name: 'WechatUrlMgmt',
  data() {
    return {
      loading: false,
      openPopup: false,
      itemId: '',
      tabName: 'baseinfo',
      multipleSelection: [],
      filters: [],
      operations: [
        {
          label: '新增',
          name: 'add',
          type: 'primary'
        },
        {
          disabled: true,
          label: '删除',
          name: 'deleteList',
          type: ''
        },
        {
          label: '刷新',
          name: 'refresh',
          type: ''
        }
      ],
      tableData: [],
      pagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        total: 0
      }
    };
  },
  components: {
    BizFlexTable,
    BaseInfo,
    BizPopupTabs
  },
  created() {
    this.refresh();
  },
  mounted() {},
  methods: {
    operate(name) {
      this[name]();
    },
    refresh() {
      this.openPopup = false;
      this.getList();
    },
    getList() {
      let params = {
        pageNumber: this.pagination.currentPage,
        pageSize: this.pagination.pageSize
      };
      http
        .get('/admin/advertising/advertisings.jhtml', params)
        .then(data => {
          this.tableData = data.dataList;
          this.pagination.total = Number(data.total);
        })
        .catch(ErrorData => {
          this.$message.warning(ErrorData.errorMessage);
        });
    },
    // 批量操作-删除
    deleteList() {
      let ids = [];
      for (const iterator of this.multipleSelection) {
        ids.push(iterator.id);
      }
      this.delete(ids);
    },
    // 快捷操作-删除
    deleteRow(id) {
      let ids = [];
      ids.push(id);
      this.delete(ids);
    },
    // 后台删除
    delete(ids) {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let params = {
            ids: ids
          };
          http
            .delete('/admin/advertising/advertising.jhtml', params)
            .then(data => {
              this.$message.success('删除成功');
              this.refresh();
            })
            .catch(ErrorData => {
              this.$message.warning(ErrorData.errorMessage);
            });
        })
        .catch(() => {});
    },
    // 添加推荐
    add() {
      this.itemId = '';
      this.openPopup = true;
    },
    handleSelectionChange(val) {
      this.operations[1].disabled = true;
      if (val.length > 0) {
        this.operations[1].disabled = false;
      }
      this.multipleSelection = val;
    },
    handleSizeChange(val) {
      this.pagination.pageSize = val;
      this.refresh();
    },
    handleCurrentChange(val) {
      this.pagination.currentPage = val;
      this.refresh();
    },
    rowClick(row) {
      this.openPopup = true;
      this.itemId = row.id;
    },
    closePopup() {
      this.openPopup = false;
      this.itemId = '';
    },
    addSuccess(id) {
      this.itemId = id;
    }
  }
};
</script>

<style lang="scss">
.screen-mgmt {
  .biz-customcol {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    .el-button {
      margin-right: 10px;
    }
  }
  .delete-btn {
    color: red;
  }
  .selection-column {
    text-align: center;
  }
}
</style>
