<template>
  <div class="rescue-org">
    <biz-flex-table :operations="operations" @operate="operate" :tableData="tableData" :pagination="pagination"
      @selection-change="handleSelectionChange" @row-click="rowClick" @size-change="handleSizeChange"
      @current-change="handleCurrentChange">
      <el-table-column prop="memberName" label="救援机构" min-width="120">
        <template slot-scope="scope">
          <div style="width:100%">
            <div class="overflow">
              名称：{{scope.row.name?scope.row.name:'--'}}
            </div>
            <div class="overflow">
              电话：{{scope.row.phone?scope.row.phone:'--'}}
            </div>
            <div class="overflow">
              地址：{{scope.row.address?scope.row.address:'--'}}
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="bussinessLicenseCode" label="营业执照号" min-width="120">
        <template slot-scope="scope">
          <div style="width:100%">
            <div class="overflow">
              {{scope.row.bussinessLicenseCode?scope.row.bussinessLicenseCode:'--'}}
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="registeredCapital" label="注册资金(万元)" min-width="80">
        <template slot-scope="scope">
          <div style="width:100%">
            <div class="overflow">
              {{scope.row.registeredCapital?scope.row.registeredCapital:'--'}}
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="bussinessLicenseCode" label="营业范围" min-width="120">
        <template slot-scope="scope">
          <div style="width:100%">
            <div class="overflow">
              {{scope.row.bussinessScope?scope.row.bussinessScope:'--'}}
            </div>
          </div>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="date" label="操作">
        <div slot-scope="scope">
          <div class="biz-customcol">
            <el-button type="text" class="delete-btn" size="mini" @click.stop="deleteProject(scope.row.id)">
              删除
            </el-button>
          </div>
        </div>
      </el-table-column> -->
    </biz-flex-table>
    <biz-popup-tabs :open="open" v-model="tabName" @close="open = false;">
      <el-tab-pane label="基本信息" name="first">
        <rescue-org-item ref="item" @created="refresh">
        </rescue-org-item>
      </el-tab-pane>
    </biz-popup-tabs>
  </div>
</template>

<script>
import serviceProjectService from '@/service/maintenance/serviceProject';
import { BizPopupTabs } from '@/components/BizPopup';
import { BizFlexTable } from '@/components/BizTable';
import RescueOrgItem from './RescueOrgItem';

export default {
  name: 'RescueOrg',
  data() {
    return {
      tabName: 'first',
      open: false,
      multipleSelection: [],
      operations: [
        {
          label: '新增',
          name: 'add',
          type: 'primary',
          auth: ['admin:cooperaRescueOrg.add']
        },
        {
          disabled: true,
          label: '删除',
          name: 'deleteOperate',
          type: '',
          auth: ['admin:cooperaRescueOrg.delete']
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
        total: 9
      }
    };
  },
  components: {
    BizFlexTable,
    BizPopupTabs,
    RescueOrgItem
  },
  created() {
    this.refresh();
  },
  methods: {
    operate(name) {
      this[name]();
    },
    add() {
      this.$nextTick(() => {
        this.$refs.item.clear();
        this.open = true;
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
      serviceProjectService.deleteRescueOrg(
        params,
        data => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.refresh();
        },
        ErrorData => {
          console.log(ErrorData);
        }
      );
    },
    refresh() {
      let params = {
        shopId: window.top.SHOP_ID || '',
        pageSize: this.pagination.pageSize,
        pageNumber: this.pagination.currentPage
      };
      serviceProjectService.getRescueOrgList(
        params,
        data => {
          this.tableData = data.companyList;
          this.pagination.total = Number(data.total);
        },
        ErrorData => {
          console.log(ErrorData);
        }
      );
    },
    handleSelectionChange(val) {
      this.operations.map(item => {
        if (item.name === 'deleteOperate') {
          item.disabled = true;
        }
      });
      if (val.length > 0) {
        this.operations.map(item => {
          if (item.name === 'deleteOperate') {
            item.disabled = false;
          }
        });
      }
      this.multipleSelection = val;
    },
    rowClick(row) {
      this.open = true;
      this.$refs.item.refresh(row.id);
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
.rescue-org {
}
</style>
