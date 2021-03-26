<template>
  <biz-grid class="staff-mgmt-role-permissions">
    <biz-save-button slot="top" :operations="operations" @operate="operate"></biz-save-button>
    <el-tabs type="border-card" v-model="activeTab">
      <el-tab-pane class="role-pane" v-for="(list, index) in authorityList" :key="list.id" :label="list.name" :name="String(index)">
        <el-tree ref="tree" node-key="id" :props="treeProps" :data="list.children" :default-expanded-keys="selectedKeys"
          show-checkbox></el-tree>
      </el-tab-pane>
    </el-tabs>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import BizSaveButton from '@/components/BizSaveButton';
import http from '@/common/http';

export default {
  name: 'RoleSetting',
  data() {
    return {
      treeProps: {
        label: 'name',
        children: 'children'
      },
      activeTab: '0',
      name: '',
      type: '',
      description: '',
      selectedKeys: [],
      authorityList: [],
      operations: [{ label: '保存', name: 'save', type: 'primary' }],
      loading: false
    };
  },
  props: {
    id: {
      type: String,
      default: ''
    },
    tabSelection: {
      type: String
    }
  },
  watch: {
    tabSelection(val) {
      if (val === 'four') {
        if (this.id !== '') {
          this.refresh();
        }
      }
    }
  },
  components: {
    BizSaveButton,
    BizGrid
  },
  methods: {
    operate(name) {
      this[name]();
    },
    showMessage(msg, type = 'success') {
      this.$message({
        showClose: true,
        message: msg,
        type: type
      });
    },
    formatAuthList(authList) {
      let listCopy = authList.concat();
      const formatList = listArr => {
        listArr.forEach(list => {
          if (!list.keyword) {
            // 非权限id格式修改, 方式与权限id重复
            list.id = `+${list.id}`;
          }
          let children = [];
          let childArr = ['child', 'authorities', 'subAuthority'];
          for (let index in childArr) {
            if (list[childArr[index]]) {
              children = children.concat(list[childArr[index]]);
              delete list[childArr[index]];
            }
          }
          if (children.length) {
            list.children = children;
            formatList(list.children);
          }
        });
      };
      formatList(authList);
      return listCopy;
    },
    async refresh() {
      let data = null;
      try {
        let params = { id: this.id };
        data = await http.get('/admin/businessProduct/query/v201901.jhtml', params);
        this.authorityList = this.formatAuthList(data.authorityList);
        let selectedIds = data.serviceAuthorityDatas.map(auth => {
          return auth.id;
        });
        this.selectedKeys = selectedIds;
        // 只勾选已选中节点, 不选中子节点
        this.$nextTick(() => {
          selectedIds.forEach(id => {
            this.$refs.tree.forEach(vm => {
              if (vm.getNode(id)) {
                vm.setChecked(id, true);
              }
            });
          });
        });
      } catch (e) {
        // this.showMessage(e.errorMessage, 'warning');
      }
    },
    save() {
      let selectedIds = [];
      this.$refs.tree.forEach(vm => {
        selectedIds = selectedIds.concat(
          vm
            .getCheckedNodes()
            .filter(item => {
              return !!item.keyword;
            })
            .map(item => {
              return item.id;
            })
        );
      });
      console.log('selectedIds: ', selectedIds);
      if (!selectedIds.length) {
        this.$message.warning('请选择定制服务');
        return;
      }
      this.submit(selectedIds);
    },
    async submit(selectedIds) {
      let params = {
        id: this.id,
        businessService: {
          fucntions: selectedIds
        }
      };
      try {
        if (this.id) {
          // 更新
          await http.put('/admin/businessProduct/authority/v201901.jhtml', params);
          this.$message.success('保存成功');
          this.$emit('operationSuccess');
        } else {
          await http.post('/admin/businessProduct/authority/v201901.jhtml', params);
          this.$message.success('保存成功');
          this.$emit('operationSuccess');
        }
      } catch (e) {
        this.$message.warning(e.errorMessage);
      }
    }
  }
};
</script>

<style lang="scss">
.staff-mgmt-role-permissions.biz-grid {
  padding: 5px;
  .biz-grid__content {
    .el-tabs--border-card {
      & > .el-tabs__header {
        background-color: #fff;
      }
      & > .el-tabs__content {
        padding: 15px;
        overflow: auto;
      }
    }
  }
}
.staff-mgmt-role-permissions {
  .biz-save-button {
    justify-content: flex-start;
  }
}
</style>
