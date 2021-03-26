<template>
  <div class="staff-mgmt-role-mgmt">
    <biz-flex-table :operations="operations" @operate="operate" :filters="filters" @filter-data-change="filterDataChange"
      :tableData="tableData" :pagination="pagination" @row-click="rowClick" @selection-change="handleSelectionChange"
      @size-change="handleSizeChange" @current-change="handleCurrentChange">
      <!-- 表格内容 -->
      <el-table-column prop="name" label="角色名称">
        <template slot-scope="scope">
          {{scope.row.name}}
          <el-popover v-if="scope.row.hierarchy==='0'" placement="bottom-start" trigger="hover" content="系统预置，不支持修改"
            class="button-tshi">
            <el-button slot="reference" size="mini" type="primary" style="border-radius: 10px;font-size:8px;background-color: rgba(247, 247, 247, 1);color: rgba(16, 16, 16, 1);border: 1px solid rgba(217, 217, 217, 1);">预置</el-button>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column prop="type" label="角色类别">
      </el-table-column>
      <!-- <el-table-column prop="level" label="优先级" sortable :sort-method="sort">
      </el-table-column> -->
      <el-table-column prop="description" label="角色描述">
        <template slot-scope="scope">
          <div class="description-cell">
            {{ scope.row.description || '无' }}
          </div>
        </template>
      </el-table-column>
      <!-- 操作 -->
      <el-table-column prop="option" label="操作" width="200">
        <template slot-scope="scope">
          <el-button size="mini" type="text" style="color: red" @click.stop="del(scope.row.id)" v-if="hasAuthDel">
            删除
          </el-button>
        </template>
      </el-table-column>
    </biz-flex-table>
    <biz-popup-tabs :open="open" @close="open = false" v-model="tabName">
      <el-tab-pane label="基本信息" name="first">
        <role-info ref="baseInfo" :id="itemId" @created="refresh"></role-info>
      </el-tab-pane>
    </biz-popup-tabs>
    <biz-popup-tabs :open="openEdit" @close="openEdit = false" v-model="tabName">
      <el-tab-pane label="基本信息" name="first">
        <role-info :id="itemId" @created="refresh"></role-info>
      </el-tab-pane>
      <el-tab-pane label="角色权限" name="second">
        <role-permissions :itemId="selectedId" @created="refresh"></role-permissions>
        <!-- <role-setting :id="itemId" @created="refresh"></role-setting> -->
      </el-tab-pane>
    </biz-popup-tabs>
  </div>
</template>

<script>
import { BizFlexTable } from '@/components/BizTable';
import RoleMgmt from '@/service/staff-mgmt/roleMgmt';
import RoleInfo from './RoleInfo';
import RolePermissions from './RolePermissions';
import { BizPopupTabs } from '@/components/BizPopup';
import StaffMgmt from '@/service/staff-mgmt/staffMgmt.js';
import { mapGetters } from 'vuex';
export default {
  name: 'RoleMgmt',
  data() {
    return {
      operations: [
        { label: '新增', name: 'add', type: 'primary' },
        { label: '删除', name: 'del', type: '', disabled: true }
      ],
      originData: [],
      pagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        // 总条目数
        total: 0
      },
      multiSelected: [],
      itemId: '',
      selectedId: { id: '' },
      open: false,
      openEdit: false,
      tabName: 'first',
      filters: [
        {
          type: 'select',
          placeholder: '请选择角色',
          label: '角色类别',
          value: '',
          options: []
        },
        {
          type: 'input',
          placeholder: '请输入角色名称',
          name: 'searchbar',
          value: ''
        }
      ]
    };
  },
  methods: {
    operate(name) {
      this[name]();
    },
    // 搜索
    filterDataChange(val) {
      this.pagination.currentPage = 1;
      this.refresh();
    },
    getRoleList() {
      RoleMgmt.init(
        {},
        data => {
          this.filters[0].options = [{ label: '全部', value: '' }].concat(
            data.types.map(item => {
              return { label: item.name, value: item.type };
            })
          );
        },
        ErrorData => {
          this.$message.warning(ErrorData.errorMessage);
        }
      );
    },
    getKpi() {
      let params = {
        params: ''
      };
      StaffMgmt.getNavInfo(params, data => {
        let msg = '您当前已有' + data.data.roleCount + '种角色啦，当前已有角色不满足使用要求的话可自定义新增哦';
        this.$message({
          customClass: 'motorists-club-activity__kpi',
          showClose: true,
          message: msg,
          duration: 3000
        });
      });
    },
    // 显示消息提示
    showMessage(msg, type) {
      this.$message({
        showClose: true,
        message: msg,
        type: type
      });
    },
    // 多选
    handleSelectionChange(val) {
      this.operations[1].disabled = true;
      if (val.length > 0) {
        this.operations[1].disabled = false;
      }
      this.multiSelected = [];
      val.map(row => {
        this.multiSelected = this.multiSelected.concat(row.id);
      });
    },
    // 分页
    handleSizeChange(val) {
      this.pagination.pageSize = val;
    },
    // 跳页
    handleCurrentChange(val) {
      this.pagination.currentPage = val;
    },
    // 添加
    add() {
      this.itemId = '';
      this.tabName = 'first';
      this.openEdit = false;
      this.open = true;
      this.$refs.baseInfo.$refs.form.resetFields();
    },
    // 编辑
    rowClick(row) {
      // this.$router.push({ path: `/oa/staff-mgmt/role-edit`, query: { id: `${row.id}` } });
      this.itemId = row.id;
      this.selectedId = { id: row.id };
      this.open = false;
      this.openEdit = true;
    },
    // 删除
    del(id) {
      let ids = id ? Array(id) : this.multiSelected.length === 0 ? [] : this.multiSelected;
      if (ids.length === 0) {
        this.$message.warning('未选择删除条目');
        return;
      }
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let params = {
          ids: ids
        };
        RoleMgmt.delete(
          params,
          data => {
            this.$message.success('操作成功');
            this.refresh();
          },
          ErrorData => {
            this.$message.warning(ErrorData.errorMessage);
          }
        );
      });
    },
    // 刷新
    refresh() {
      let params = {
        roleType: this.filters[0].value,
        keyword: this.filters[1].value
      };
      RoleMgmt.getList(
        params,
        data => {
          this.originData = data.roleList;
          this.pagination.total = Number(data.totalCount);
        },
        ErrorData => {
          console.log('ERR_REFRESH: ', ErrorData);
          this.$message.warning(ErrorData.errorMessage);
        }
      );
    },
    // 排序
    sort(a, b) {
      return Number(a.level - b.level);
    }
  },
  mounted() {
    this.refresh();
    this.getKpi();
    this.getRoleList();
  },
  computed: {
    // 表格当前页显示内容
    tableData() {
      let currentPage = this.pagination.currentPage;
      let pageSize = this.pagination.pageSize;
      return this.originData.slice((currentPage - 1) * pageSize, currentPage * pageSize);
    },
    ...mapGetters('Authority', ['currentAuth']),
    hasAuthDel() {
      return true;
      // return this.currentAuth.includes('admin:role.delete');
    }
  },
  components: {
    BizFlexTable,
    RoleInfo,
    RolePermissions,
    BizPopupTabs
  }
};
</script>

<style lang="scss">
.el-popover {
  font-size: 12px;
}
.staff-mgmt-role-mgmt {
  .biz-table-body .biz-pagination {
    justify-content: flex-end;
  }
  .button-tshi {
    .el-button--mini {
      padding: 5px;
      margin-left: 5px;
    }
  }
  .description-cell {
    // 文本溢出显示省略号
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
  }
  .el-pagination {
    margin-right: 100px;
  }
}
</style>
