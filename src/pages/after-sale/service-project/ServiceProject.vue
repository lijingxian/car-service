<template>
  <div class="service-project">
    <biz-table :operations="operations" @operate="operate" :tableData="tableData" :pagination="pagination" @handleSelectionChange="handleSelectionChange"
      @rowClick="rowClick" @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange">
      <el-table-column type="selection" width="50">
      </el-table-column>
      <el-table-column prop="name" label="项目">
        <template slot-scope="scope">
          {{scope.row.name?scope.row.name:'--'}}
        </template>
      </el-table-column>
      <el-table-column prop="price" label="价格(元)">
        <template slot-scope="scope">
          {{scope.row.price?scope.row.price:'--'}}
        </template>
      </el-table-column>
      <el-table-column prop="remark" label="描述">
        <template slot-scope="scope">
          {{scope.row.remark?scope.row.remark:'--'}}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <div slot-scope="scope">
          <div class="biz-customcol">
            <el-button type="text" class="delete-btn" size="mini" @click.stop="deleteProject(scope.row.id)">
              删除
            </el-button>
          </div>
        </div>
      </el-table-column>
    </biz-table>
    <biz-popup-tabs :open="open" v-model="tabName" @close="open = false;">
      <el-tab-pane label="基本信息" name="first">
        <service-project-item ref="item" :projectId="projectId" @created="refresh">
        </service-project-item>
      </el-tab-pane>
    </biz-popup-tabs>
    <el-dialog class="service-project-d" title="从平台导入" :visible="dialogVisible" @close="dialogVisible=false" width="700px">
      <el-button size="small" type="primary" @click="save" :disabled="dialogValid">保存</el-button>
      <biz-list :tableData="dialogTableData" @handleSelectionChange="handleDialogSelectionChange" height="500">
        <el-table-column type="selection" width="50">
        </el-table-column>
        <el-table-column prop="name" label="项目">
        </el-table-column>
        <el-table-column prop="price" label="价格(元)">
        </el-table-column>
      </biz-list>
    </el-dialog>
  </div>
</template>

<script>
import serviceProjectService from '@/service/maintenance/serviceProject';
import { BizPopupTabs } from '@/components/BizPopup';
import { BizTable, BizList } from '@/components/BizTable';
import ServiceProjectItem from './ServiceProjectItem';
import { mapGetters } from 'vuex';

export default {
  name: 'ServiceProject',
  data() {
    return {
      user: {},
      projectId: '',
      tabName: 'first',
      tags: [],
      open: false,
      dialogVisible: false,
      dialogValid: true,
      multipleSelection: [],
      multipleDialogSelection: [],
      operations: [
        {
          label: '新增',
          name: 'add',
          type: 'primary'
        },
        {
          label: '删除',
          name: 'deleteOperate',
          type: '',
          disabled: true
        },
        {
          label: '平台导入',
          name: 'getPlatformService',
          type: 'primary'
        }
      ],
      tableData: [],
      dialogTableData: [],
      pagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        total: 9
      }
    };
  },
  components: {
    BizList,
    BizTable,
    BizPopupTabs,
    ServiceProjectItem
  },
  created() {
    this.getInitInfo();
    this.refresh();
  },
  methods: {
    ...mapGetters(['getUser']),
    operate(name) {
      this[name]();
    },
    save() {
      let ids = [];
      for (const iterator of this.multipleDialogSelection) {
        ids.push(iterator.id);
      }
      let params = {
        shopId: window.top.SHOP_ID || '',
        ids: ids
      };
      this.dialogVisible = false;
      serviceProjectService.importFromPlatform(
        params,
        data => {
          this.$message({
            type: 'success',
            message: '导入成功!'
          });
          this.refresh();
        },
        ErrorData => {
          console.log(ErrorData);
          this.$message.warning(ErrorData.errorMessage);
        }
      );
    },
    getInitInfo() {
      this.user = this.getUser();
      if (this.user.roleLevel !== 'shop') {
        this.operations.pop();
      }
    },
    add() {
      this.projectId = '';
      this.$nextTick(() => {
        this.open = true;
        this.$refs.item.clear();
      });
    },
    deleteProject(id) {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let ids = [];
          ids.push(id);
          this.delete(ids);
        })
        .catch(() => {});
    },
    deleteOperate() {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let ids = [];
          for (const iterator of this.multipleSelection) {
            ids.push(iterator.id);
          }
          this.delete(ids);
        })
        .catch(() => {});
    },
    delete(ids) {
      let params = {
        ids: ids
      };
      serviceProjectService.deleteServiceProject(
        params,
        data => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.refresh();
        },
        ErrorData => {
          this.$message({
            type: 'warning',
            message: ErrorData.errorMessage
          });
        }
      );
    },
    refresh() {
      let params = {
        shopId: window.top.SHOP_ID || '',
        pageNumber: this.pagination.currentPage,
        pageSize: this.pagination.pageSize
      };
      serviceProjectService.getServiceProjectList(
        params,
        data => {
          this.tableData = data.appointmentItemList;
          this.pagination.total = Number(data.total);
        },
        ErrorData => {
          console.log(ErrorData);
        }
      );
    },
    getPlatformService() {
      let params = {
        shopId: window.top.SHOP_ID || '',
        pageNumber: '1',
        pageSize: '999'
      };
      serviceProjectService.getPlatformService(
        params,
        data => {
          this.dialogTableData = data.appointmentItemList;
          this.dialogVisible = true;
        },
        ErrorData => {
          console.log(ErrorData);
        }
      );
    },
    handleSelectionChange(val) {
      this.operations[1].disabled = true;
      if (val.length > 0) {
        this.operations[1].disabled = false;
      }
      this.multipleSelection = val;
    },
    handleDialogSelectionChange(val) {
      this.dialogValid = true;
      if (val.length > 0) {
        this.dialogValid = false;
      }
      this.multipleDialogSelection = val;
    },
    rowClick(val) {
      this.projectId = val.id;
      this.$nextTick(() => {
        this.open = true;
        this.$refs.item.refresh();
      });
    },
    handleSizeChange(val) {
      this.pagination.pageSize = val;
      this.refresh();
    },
    handleCurrentChange(val) {
      this.pagination.currentPage = val;
      this.refresh();
    }
  }
};
</script>

<style lang="scss">
.service-project {
  .service-project-d {
    .el-dialog__body {
      padding-top: 10px;
      .biz-list {
        margin-top: 10px;
      }
    }
  }
}
</style>
