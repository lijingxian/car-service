<template>
  <biz-grid class="staff-mgmt-role-permissions">
    <biz-save-button slot="top" :operations="operations" @operate="operate"></biz-save-button>
    <el-tabs type="border-card" v-model="activeTab">
      <el-tab-pane class="role-pane" v-for="(list, index) in authorityList" :key="list.id" :label="list.name" :name="String(index)">
        <el-tree
          ref="tree"
          node-key="id"
          :props="treeProps"
          :data="list.children"
          :default-expanded-keys="selectedKeys"
          show-checkbox></el-tree>
      </el-tab-pane>
    </el-tabs>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import BizSaveButton from '@/components/BizSaveButton';
import http from '@/common/http';
import urls from '@/common/urls';

export default {
  name: 'RoleSetting',
  props: {
    itemId: {
      type: Object,
      default() {
        return { id: '' };
      }
    }
  },
  data () {
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
  watch: {
    itemId(newVal, oldVal) {
      console.log('watched');
      this.activeTab = '0';
      if (newVal.id) {
        this.refresh();
      }
    }
  },
  components: {
    BizSaveButton,
    BizGrid
  },
  computed: {
    id() {
      return this.itemId.id || '';
    }
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
            // 非权限id格式修改, 防止与权限id重复
            // list.id = `+${list.id}`;
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
      const { id } = this;
      let data = null;
      try {
        if (!id) {
          // 新建
          data = await http.get(urls.staffMgmt.roleInit, {});
          this.authorityList = this.formatAuthList(data.authorityList);
        } else {
          let params = { id };
          data = await http.get(urls.staffMgmt.queryAuth, params);
          this.name = data.role.name;
          this.type = data.role.roleTypeData.type;
          this.description = data.role.description;
          this.authorityList = this.formatAuthList(data.authorityList);
          let selectedIds = data.authority.map(auth => {
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
        }
      } catch (e) {
        console.log('ERR_REFRESH: ', e);
        this.$message.warning(e.errorMessage);
      }
    },
    save() {
      let selectedIds = [];
      this.$refs.tree.forEach(vm => {
        selectedIds = selectedIds
          .concat(
            // (leafOnly, includeHalfChecked) 接收两个 boolean 类型的参数，1. 是否只是叶子节点，默认值为 false 2. 是否包含半选节点，默认值为 false
            vm.getCheckedNodes(false, true)
              // .filter(item => {
              //   return !!item.keyword;
              // })
              .map(item => {
                return item.id;
              })
          );
      });
      console.log('selectedIds: ', selectedIds);
      if (!selectedIds.length) {
        this.$message.warning('请选择角色权限');
        return;
      }
      this.submit(selectedIds);
    },
    async submit(selectedIds) {
      const { id, name, type, description } = this;
      let params = {
        name,
        type,
        description,
        authorityIds: selectedIds
      };
      try {
        if (!id) {
          // 创建
          await http.post(urls.staffMgmt.updateAuth, params);
          this.$emit('created');
          this.$message.success('保存成功');
        } else {
          // 更新
          await http.post(urls.staffMgmt.updateAuth, Object.assign(params, { id }));
          this.$emit('created');
          this.$message.success('更新成功');
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
   .biz-save-button {
    justify-content: flex-start;
  }
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
</style>
