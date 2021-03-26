<template>
  <biz-grid class="system-setting-function-defination">
    <biz-header
      slot="top"
      :operations="operations"
      :filters="filters"
      @operate="operate"
      @filter-data-change="filterDataChange">
    </biz-header>
    <expand-table
      ref="expandTable"
      :data="tableData"
      :loading="loading"
      @delete="handleDelete"
      @row-click="handleRowClick">
    </expand-table>
    <el-dialog
      title="功能预览"
      :center="true"
      width="90%"
      :append-to-body="false"
      :visible.sync="showDialog">
      <div class="header">
        <el-radio-group v-model="selectedRole">
          <el-radio label="platform">平台</el-radio>
          <el-radio label="operator">运营商</el-radio>
          <el-radio label="shop">店铺</el-radio>
        </el-radio-group>
        <span class="info">注：黄色表示可用，黑色表示不可用</span>
      </div>
      <canvas id="canvas"></canvas>
    </el-dialog>
    <biz-popup-tabs slot="float" :open="open" @close="open = false" value="first">
      <el-tab-pane label="功能信息" name="first">
        <fun-base-info :itemId="itemId" :pathId="pathId" @refresh="refresh" :open="open"></fun-base-info>
      </el-tab-pane>
    </biz-popup-tabs>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import { BizHeader } from '@/components/BizTable';
import { BizPopupTabs } from '@/components/BizPopup';
import ExpandTable from './components/ExpandTable';
import FunBaseInfo from './FunBaseInfo';
import urls from '@/common/urls';
import http from '@/common/http';
import Tree from './tree';

export default {
  name: 'FunctionDefination',
  data () {
    return {
      open: false,
      loading: false,
      showDialog: false,
      selectedRole: 'platform',
      tree: null,
      itemId: { id: '' },
      pathId: { id: '' },
      operations: [
        { label: '新增', name: 'add', type: 'primary' },
        { label: '刷新', name: 'refresh', type: '' },
        { label: '功能预览', name: 'preview', type: '' }
      ],
      filters: [
        {
          type: 'input',
          label: '',
          placeholder: '请输入功能名称',
          name: 'searchValue',
          value: ''
        }
      ],
      tableData: []
    };
  },
  components: {
    BizGrid,
    BizHeader,
    BizPopupTabs,
    ExpandTable,
    FunBaseInfo
  },
  computed: {
    showAdd() {
      return /function-defination-admin/.test(this.$route.path);
    }
  },
  watch: {
    async showDialog(newVal, oldVal) {
      if (newVal) {
        let res = await http.get('/admin/function/tree.jhtml', {});
        this.tree = new Tree(res.authorityList);
        this.$nextTick(() => {
          this.tree.render(this.selectedRole);
        });
      }
    },
    selectedRole(newVal, oldVal) {
      this.tree.changeRole(newVal, oldVal);
    }
  },
  mounted() {
    if (this.showAdd) {
      this.operations.push({ label: '新增', name: 'add', type: 'primary' });
    }
    this.refresh();
  },
  methods: {
    operate(name) {
      this[name]();
    },
    add() {
      this.itemId = { id: '' };
      this.open = true;
    },
    getAuthPreview() {
      http.get('/admin/function/tree.jhtml', {})
        .then(data => {
          this.tree = new Tree(data.authorityList);
        });
    },
    handleRowClick(row) {
      this.itemId = { id: row.id };
      this.pathId = { id: row.pathId };
      this.open = true;
    },
    filterDataChange(filters) {
      this.getList();
    },
    refresh() {
      this.getList();
    },
    getList() {
      let params = { name: this.filters[0].value };
      http.get(urls.functionDefination.getAllFun, params)
        .then(data => {
          this.tableData = data.authorityList;
        })
        .catch(err => {
          this.$message.warning(err.errorMessage);
        });
    },
    handleDelete(id) {
      this.$confirm('确认删除该功能?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let params = {
          ids: [id]
        };
        http.delete(urls.functionDefination.getFun, params)
          .then(data => {
            this.$message.success('操作成功');
            this.refresh();
          })
          .catch(err => {
            this.$message.warning(err.errorMessage);
          });
      }).catch(() => {});
    },
    preview() {
      this.showDialog = true;
    },
    showMessage(msg, type = 'success') {
      this.$message({
        message: msg,
        type: type,
        showClose: true
      });
    }
  }
};
</script>

<style lang="scss">
.system-setting-function-defination {
  .el-dialog__body {
    display: flex;
    flex-direction: column;
    align-items: center;
    .header {
      width: 100%;
      margin-bottom: 20px;
      .el-radio + .el-radio {
        margin-left: 20px;
      }
      .info {
        margin-left: 10px;
      }
    }
  }
}
</style>
