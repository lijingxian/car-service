<template>
  <div class="insurance-company-mgmt">
    <biz-flex-table ref="table" :loading="loading" :operations="operations" @operate="operate" :tableData="tableData"
      :pagination="pagination" @row-click="rowClick" @selection-change="handleSelectionChange" @size-change="handleSizeChange"
      @current-change="handleCurrentChange">
      <el-table-column prop="name" label="小程序名称">
        <div slot-scope="scope">
          <div class="biz-customcol">
            {{scope.row.name}}
          </div>
        </div>
      </el-table-column>
      <el-table-column prop="phoneNumber" label="appId">
        <div slot-scope="scope">
          <div class="biz-customcol">
            {{scope.row.appId}}
          </div>
        </div>
      </el-table-column>
      <el-table-column prop="phoneNumber" label="appSecret">
        <div slot-scope="scope">
          <div class="biz-customcol">
            {{scope.row.appSecret}}
          </div>
        </div>
      </el-table-column>
      <el-table-column prop="comment" label="备注">
        <div slot-scope="scope">
          <div class="biz-customcol">
            {{scope.row.comment}}
          </div>
        </div>
      </el-table-column>
      <el-table-column label="操作">
        <div slot-scope="scope">
          <div class="biz-customcol">
            <el-button type="text" size="mini" @click.stop="deleteRow(scope.row.id)">
              删除
            </el-button>
          </div>
        </div>
      </el-table-column>
    </biz-flex-table>
    <mini-program-mgmt-popup slot="float" :open="openPopup" @close="closePopup" :id="id4Popup" @refreshNotification="refresh"
      @addSuccessNotification="addSuccess"></mini-program-mgmt-popup>
  </div>
</template>

<script>
import { BizFlexTable } from '@/components/BizTable';
import MiniProgramMgmtPopup from './MiniProgramMgmtPopup';
import http from '@/common/http';
export default {
  name: 'InsuranceCompanyMgmt',
  data() {
    return {
      loading: false,
      id4Popup: '',
      openPopup: false,
      multipleSelection: [],
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
          type: 'primary'
        }
      ],
      tableData: [],
      pagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        total: 9
      }
    };
  },
  components: {
    BizFlexTable,
    MiniProgramMgmtPopup
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
      this.getList();
    },
    getList() {
      let params = {
        pageNumber: this.pagination.currentPage,
        pageSize: this.pagination.pageSize
      };
      if (this.openPopup !== true) {
        this.loading = true;
      }
      http
        .get('/admin/wechatMiniProgram/list.jhtml', params)
        .then(data => {
          this.tableData = data.dataList;
          this.pagination.total = Number(data.total);
          this.loading = false;
        })
        .catch(errData => {
          console.log(errData);
          console.log('code错误');
          // if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(() => {
          this.loading = false;
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
            .delete('/admin/wechatMiniProgram/delete.jhtml', params)
            .then(data => {
              this.$message.success('删除成功');
              this.refresh();
            })
            .catch(errData => {
              this.$message.warning(errData.errorMessage);
            })
            .finally(() => {
              this.loading = false;
            });
        })
        .catch(() => {});
    },
    // 添加推荐
    add() {
      this.openPopup = true;
      this.id4Popup = '';
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
      this.id4Popup = row.id;
    },
    closePopup() {
      this.openPopup = false;
      this.id4Popup = '';
    },
    addSuccess(id) {
      this.id4Popup = id;
    }
  }
};
</script>

<style lang="scss">
.insurance-company-mgmt {
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
