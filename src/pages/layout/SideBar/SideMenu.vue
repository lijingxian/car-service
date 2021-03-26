<template>
  <el-submenu :index="menu.path" :disabled="menu.disabled" class="side-menu"
    v-if="(currentAuth.indexOf(menu.auth) !== -1 || menu.auth === '') && show(menu)" @click.native.stop="subMenuClick(menu)">
    <template slot="title">
      <i class="iconfont" :class="menu.icon || ''"></i>
      <span slot="title">{{menu.title}}</span>
    </template>

    <div v-for="(child, index) of menu.children" :key="index" @click="saveMenu(menu)">
      <div v-if="show(child)">
        <side-menu :key="index" :menu="child" :index="menu.path" :style="emptyStyle"
          v-if="(child.children && (currentAuth.indexOf(child.auth) !== -1 || child.auth === ''))"></side-menu>

        <div v-else-if="child.trees && (currentAuth.indexOf(child.auth) !== -1 || child.auth === '')" :style="emptyStyle"
          :key="index" :index="handledIndex(child.path)" style="height: auto;">
          <el-tree :props="defaultProps" :highlight-current="highlightCurrent" :load="loadNode" lazy v-if="title==='联盟管理'"
            @node-click="handleNodeClick">
            <span class="custom-tree-node" slot-scope="{ node, data }">
              <div class="icon">
                <i class="iconfont biz-icon-dianpu" v-if="data.iconSkin==='icon05'"></i>
                <i class="iconfont biz-icon-man" v-if="data.iconSkin==='icon01'"></i>
                <i class="el-icon-plus" v-if="data.iconSkin==='icon09' || data.iconSkin==='icon08'"></i>
              </div>
              <span>{{ node.label }}</span>
            </span>
          </el-tree>
          <el-tree :props="defaultProps" :highlight-current="highlightCurrent" :load="loadNodeCar" lazy v-if="title==='全部车队'"
            @node-click="handleNodeClick">
            <span class="custom-tree-node" slot-scope="{ node, data }">
              <div class="icon">
                <i class="iconfont biz-icon-qiche1" v-if="data.iconSkin==='icon03'"></i>
              </div>
              <span>{{ node.label }}</span>
            </span>
          </el-tree>
          <el-tree :props="defaultProps" :highlight-current="highlightCurrent" :load="loadNodeTag" lazy v-if="title==='标签库'"
            @node-click="handleNodeClick">
            <span class="custom-tree-node" slot-scope="{ node }">
              <span>{{ node.label }}</span>
            </span>
          </el-tree>
          <el-tree :props="defaultProps" :highlight-current="highlightCurrent" :load="loadNodeCard" lazy v-if="title==='会员卡'"
            @node-click="handleNodeClick">
            <span class="custom-tree-node" slot-scope="{ node }">
              <span>{{ node.label }}</span>
            </span>
          </el-tree>
          <el-tree :props="defaultProps" :highlight-current="highlightCurrent" :load="loadNodeUnionCard" lazy
            v-if="title==='联盟店铺会员卡'" @node-click="handleNodeUnionClick">
            <span class="custom-tree-node" slot-scope="{ node }">
              <span>{{ node.label }}</span>
            </span>
          </el-tree>
          <el-tree :props="defaultProps" ref="fleetMemberTree" :highlight-current="highlightCurrent" :load="loadNodeFleetMember"
            lazy v-if="title==='车友会'" @node-click="handleNodeClick">
            <span class="custom-tree-node" slot-scope="{ node }">
              <span>{{ node.label }}</span>
            </span>
          </el-tree>
          <el-tree :props="defaultProps" :highlight-current="highlightCurrent" :load="loadNodeBook" lazy v-if="title==='服务手册'"
            @node-click="handleNodeClick">
            <span class="custom-tree-node" slot-scope="{ node }">
              <span>{{ node.label }}</span>
            </span>
          </el-tree>
          <el-tree :props="defaultProps" :highlight-current="highlightCurrent" :load="loadNodeSysTag" lazy v-if="title==='系统标签库'"
            @node-click="handleNodeClick">
            <span class="custom-tree-node" slot-scope="{ node }">
              <span>{{ node.label }}</span>
            </span>
          </el-tree>
          <el-tree :props="defaultProps" :highlight-current="highlightCurrent" :load="loadNodeTerminal" lazy v-if="title==='终端名称'"
            @node-click="handleNodeClick">
            <span class="custom-tree-node" slot-scope="{ node }">
              <span>{{ node.label }}</span>
            </span>
          </el-tree>
          <el-tree :props="defaultProps" :highlight-current="highlightCurrent" :load="loadNodeTemplateStatic" lazy
            v-if="title==='会员卡体系统计'" @node-click="handleNodeClick">
            <span class="custom-tree-node" slot-scope="{ node }">
              <span>{{ node.label }}</span>
            </span>
          </el-tree>
        </div>

        <router-link v-else-if="currentAuth.indexOf(child.auth) !== -1 || child.auth === ''" :target="child.target" :key="index"
          :to="handledIndex(child.path)">
          <el-menu-item-mixin :index="handledIndex(child.path)" :disabled="menu.disabled" :style="emptyStyle">{{child.title}}
          </el-menu-item-mixin>
        </router-link>
      </div>
    </div>
  </el-submenu>
</template>

<script>
import ElMenuItemMixin from './components/ElMenuItemMixin';
import { mapGetters } from 'vuex';
import http from '@/common/http';

export default {
  name: 'SideMenu',
  data() {
    return {
      expand: false,
      title: '',
      highlightCurrent: true,
      defaultProps: {
        label: 'name',
        children: 'zones',
        isLeaf: 'isLeaf'
      },
      emptyStyle: {
        'padding-left': '0px !important'
      }
    };
  },
  props: {
    menu: Object
  },
  components: { ElMenuItemMixin },
  computed: {
    ...mapGetters('Menu', ['activePath']),
    ...mapGetters('Authority', ['currentAuth']),
    ...mapGetters(['currentUser'])
  },
  watch: {
    activePath(newVal, oldVal) {
      console.log(newVal);
      this.menu.children &&
        this.menu.children.forEach(child => {
          if (this.handledIndex(child.path) === newVal) {
            this.title = this.menu.title;
            let params = {
              storeId: this.currentUser.shop.id,
              hierarchyId: this.currentUser.roleLevel === 'shop' ? '1' : '0',
              companyId: this.currentUser.roleLevel === 'shop' ? '' : '0',
              userId: this.currentUser.id,
              businessKey: child.title + '?' + child.icon + '?' + newVal
            };
            http
              .post('/admin/exhibition/operationRecord.jhtml', params)
              .then(data => {
                console.log('menuClick');
              })
              .catch();
          }
        });
    }
  },
  created() {},
  mounted() {
    this.menu.children &&
      this.menu.children.forEach(child => {
        if (this.handledIndex(child.path) === this.activePath) {
          this.title = this.menu.title;
        }
      });
  },
  methods: {
    saveMenu(item) {
      // console.log('item' + item);
    },
    show(menu) {
      if (this.currentUser.roleLevel !== 'shop' && !window.top.SHOP_ID) {
        console.log(menu.title);
        if (
          (menu.title === '数据洞察' && menu.auth !== 'admin:operatorStatistics' && menu.auth !== 'admin:member.statistics') ||
          menu.title === '维保记录' ||
          menu.title === '预约管理' ||
          menu.title === '推荐管理'
        ) {
          return false;
        } else {
          return true;
        }
      }
      return true;
    },
    // 点击树节点
    handleNodeUnionClick(data, node) {
      if (data.type && data.type === 'userCardTemplate') {
        let id = data.id;
        this.$router.push({
          path: '/member/member-card/template',
          query: { templateId: id, isEdit: 'false' }
        });
      } else if (data.type && data.type === 'userCardTemplateUser') {
        let id = data.pId;
        this.$router.push({
          path: '/member/member-card/' + 'false/' + id
        });
      }
    },
    handleNodeClick(data, node) {
      let pId = '';
      let pType = '';
      let timestamp = Math.round(new Date() / 1000);
      if (data.pId && data.pId.substring(0, 5) === 'store') {
        pId = data.pId.split('_')[1];
        pType = 'store';
      } else if (data.pId && data.pId.substring(0, 8) === 'operator') {
        pId = data.pId.split('_')[1];
        pType = 'operator';
      }
      if (data.id.substring(0, 5) === 'store') {
        let id = data.id.split('_')[1];
        if (this.currentUser.roleLevel !== 'shop') {
          window.SHOP_ID = id;
        }
        this.$router.push({
          path: '/union/federation-mgmt/federation',
          query: { id: id, type: 'store', parent: pId, parentType: pType, timestamp: timestamp }
        });
      } else if (data.id.substring(0, 11) === 'creat_store') {
        this.$router.push({
          path: '/union/federation-mgmt/federation',
          query: { type: 'store', parent: pId, parentType: pType, timestamp: timestamp }
        });
      } else if (data.id.substring(0, 14) === 'creat_operator') {
        this.$router.push({
          path: '/union/federation-mgmt/federation',
          query: { type: 'operator', parent: pId, parentType: pType, timestamp: timestamp }
        });
      } else if (data.id.substring(0, 8) === 'operator') {
        let id = data.id.split('_')[1];
        this.$router.push({
          path: '/union/federation-mgmt/federation',
          query: { id: id, type: 'operator', parent: pId, parentType: pType, timestamp: timestamp }
        });
      } else if (data.id.substring(0, 6) === 'fleet_' && data.iconSkin === 'icon03') {
        let id = data.id.split('_')[1];
        this.$router.push({
          path: '/car/vehicle-mgmt/fleet/' + id
        });
      } else if (data.id.substring(0, 6) === 'fleet_' && data.iconSkin === 'icon04') {
        let id = data.id.split('_')[1];
        this.$router.push({
          path: '/member/motor-club/fleetMember/' + id,
          query: {}
        });
      } else if (data.type && data.type === 'createUserCardTemplate') {
        this.$router.push({
          path: '/member/member-card/template',
          query: { isEdit: 'true' }
        });
      } else if (data.type && data.type === 'userCardTemplate') {
        let id = data.id;
        this.$router.push({
          path: '/member/member-card/template',
          query: { templateId: id, isEdit: 'true' }
        });
      } else if (data.type && data.type === 'userCardTemplateUser') {
        let id = data.pId;
        this.$router.push({
          path: '/member/member-card/' + 'true/' + id,
          query: {}
        });
      } else if (data.type && data.type === 'userCardTemplateStatistics') {
        let id = data.pId;
        this.$router.push({
          path: '/member/member-card/templateStatic',
          query: { templateId: id }
        });
      } else if (data.type && data.type === 'createCarBrand') {
        this.$router.push({
          path: '/after-sale/add-motorcycle-type',
          query: {}
        });
      } else if (data.type && data.type === 'createCarSeries') {
        let brandId = data.brandId;
        this.$router.push({
          path: '/after-sale/add-motorcycle-type',
          query: { brandId: brandId }
        });
      } else if (data.type && data.type === 'createCarType') {
        let brandId = data.brandId;
        let seriesId = data.seriesId;
        this.$router.push({
          path: '/after-sale/add-motorcycle-type',
          query: { brandId: brandId, seriesId: seriesId }
        });
      } else if (data.type && data.type === 'carBrand') {
        let brandId = data.brandId;
        this.$router.push({
          path: '/after-sale/booklet',
          query: { brandId: brandId, type: 'carBrand' }
        });
      } else if (data.type && data.type === 'carSeries') {
        let brandId = data.brandId;
        let seriesId = data.seriesId;
        this.$router.push({
          path: '/after-sale/booklet',
          query: { brandId: brandId, seriesId: seriesId, type: 'carSeries' }
        });
      } else if (data.type && data.type === 'carType') {
        let brandId = data.brandId;
        this.$router.push({
          path: '/after-sale/booklet',
          query: { brandId: brandId, type: 'carType' }
        });
      } else if (data.id.substring(0, 11) === 'tagCategory') {
        let id = data.id.split('_')[1];
        this.$router.push({
          path: '/shop/product-settings/tag/' + id,
          query: {}
        });
      } else if (data.id.substring(0, 12) === 'terminalType') {
        let id = data.id.split('_')[1];
        this.$router.push({
          path: '/operating/terminal-mgmt/terminal-type/' + id + '/' + data.name,
          query: {}
        });
      }
    },
    loadNode(node, resolve) {
      if (node.level === 0) {
        http
          .get('/admin/store/treeNodes/union.jhtml', {})
          .then(data => {
            return resolve(
              data.treeNodes.map(item => {
                return {
                  id: item.id,
                  isLeaf: !item.isParent,
                  name: item.name,
                  pId: item.pId,
                  iconSkin: item.iconSkin
                };
              })
            );
          })
          .catch(errData => {
            console.log(errData);
            console.log('code错误');
            if (errData.errorMessage) {
              this.$message.warning(errData.errorMessage);
            }
          })
          .finally(() => {
            this.loading = false;
          });
      }
      if (node.level >= 1) {
        http
          .get('/admin/store/treeNodes/union.jhtml', { id: node.data.id })
          .then(data => {
            return resolve(
              data.treeNodes.map(item => {
                return {
                  id: item.id,
                  isLeaf: !item.isParent,
                  name: item.name,
                  pId: item.pId,
                  iconSkin: item.iconSkin
                };
              })
            );
          })
          .catch(errData => {
            console.log(errData);
            console.log('code错误');
            if (errData.errorMessage) {
              this.$message.warning(errData.errorMessage);
            }
          })
          .finally(() => {
            this.loading = false;
          });
      }
    },
    loadNodeCar(node, resolve) {
      http
        .get('/admin/common/fleet/treeNodes.jhtml', { treeNodeType: 'group' })
        .then(data => {
          return resolve(
            data.treeNodes.map(item => {
              return {
                id: item.id,
                isLeaf: !item.isParent,
                name: item.name,
                pId: item.pId,
                iconSkin: item.iconSkin
              };
            })
          );
        })
        .catch(errData => {
          console.log(errData);
          console.log('code错误');
          if (errData.errorMessage) {
            this.$message.warning(errData.errorMessage);
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
    loadNodeTemplateStatic(node, resolve) {
      http
        .get('/admin/memberCard/treeNodes/template.jhtml', {})
        .then(data => {
          return resolve(
            data.treeNodes.map(item => {
              return {
                id: item.id,
                isLeaf: item.isParent,
                name: item.name,
                pId: item.pId,
                iconSkin: item.iconSkin,
                type: item.type
              };
            })
          );
        })
        .catch(errData => {
          console.log(errData);
          console.log('code错误');
          if (errData.errorMessage) {
            this.$message.warning(errData.errorMessage);
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
    loadNodeTag(node, resolve) {
      http
        .get('/admin/common/tagCategory/treeNodes.jhtml', {
          hierarchy: 'shop'
        })
        .then(data => {
          return resolve(
            data.treeNodes.map(item => {
              return {
                id: item.id,
                isLeaf: !item.isParent,
                name: item.name,
                pId: item.pId,
                iconSkin: item.iconSkin
              };
            })
          );
        })
        .catch(errData => {
          console.log(errData);
          console.log('code错误');
          if (errData.errorMessage) {
            this.$message.warning(errData.errorMessage);
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
    loadNodeCard(node, resolve) {
      if (node.level === 0) {
        http
          .get('/admin/memberCard/treeNodes.jhtml', {})
          .then(data => {
            return resolve(
              data.treeNodes.map(item => {
                return {
                  id: item.id,
                  isLeaf: !item.isParent,
                  name: item.name,
                  pId: item.pId,
                  iconSkin: item.iconSkin,
                  type: item.type
                };
              })
            );
          })
          .catch(errData => {
            console.log(errData);
            console.log('code错误');
            if (errData.errorMessage) {
              this.$message.warning(errData.errorMessage);
            }
          })
          .finally(() => {
            this.loading = false;
          });
      }
      if (node.level >= 1) {
        http
          .get('/admin/memberCard/treeNodes.jhtml', {
            id: node.data.id,
            type: 'userCardTemplate'
          })
          .then(data => {
            return resolve(
              data.treeNodes.map(item => {
                return {
                  id: item.id,
                  isLeaf: !item.isParent,
                  name: item.name,
                  pId: item.pId,
                  iconSkin: item.iconSkin,
                  type: item.type
                };
              })
            );
          })
          .catch(errData => {
            console.log(errData);
            console.log('code错误');
            if (errData.errorMessage) {
              this.$message.warning(errData.errorMessage);
            }
          })
          .finally(() => {
            this.loading = false;
          });
      }
    },
    loadNodeUnionCard(node, resolve) {
      if (node.level === 0) {
        http
          .get('/admin/memberCard/union/treeNodes.jhtml', {})
          .then(data => {
            return resolve(
              data.treeNodes.map(item => {
                return {
                  id: item.id,
                  isLeaf: !item.isParent,
                  name: item.name,
                  pId: item.pId,
                  iconSkin: item.iconSkin,
                  type: item.type
                };
              })
            );
          })
          .catch(errData => {
            console.log(errData);
            console.log('code错误');
            if (errData.errorMessage) {
              this.$message.warning(errData.errorMessage);
            }
          })
          .finally(() => {
            this.loading = false;
          });
      }
      if (node.level >= 1) {
        http
          .get('/admin/memberCard/union/treeNodes.jhtml', {
            id: node.data.id,
            type: node.data.type
          })
          .then(data => {
            return resolve(
              data.treeNodes.map(item => {
                return {
                  id: item.id,
                  isLeaf: !item.isParent,
                  name: item.name,
                  pId: item.pId,
                  iconSkin: item.iconSkin,
                  type: item.type
                };
              })
            );
          })
          .catch(errData => {
            console.log(errData);
            console.log('code错误');
            if (errData.errorMessage) {
              this.$message.warning(errData.errorMessage);
            }
          })
          .finally(() => {
            this.loading = false;
          });
      }
    },
    loadNodeFleetMember(node, resolve) {
      http
        .get('/admin/common/fleet/treeNodes.jhtml', { treeNodeType: 'circle' })
        .then(data => {
          return resolve(
            data.treeNodes.map(item => {
              return {
                id: item.id,
                isLeaf: !item.isParent,
                name: item.name,
                pId: item.pId,
                iconSkin: item.iconSkin
              };
            })
          );
        })
        .catch(errData => {
          console.log(errData);
          console.log('code错误');
          if (errData.errorMessage) {
            this.$message.warning(errData.errorMessage);
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
    loadNodeBook(node, resolve) {
      if (node.level === 0) {
        http
          .get('/admin/appointmentBooklet/treeNodes.jhtml', {})
          .then(data => {
            return resolve(
              data.treeNodes.map(item => {
                return {
                  id: item.id,
                  isLeaf: !item.isParent,
                  name: item.name,
                  pId: item.pId,
                  iconSkin: item.iconSkin,
                  type: item.type,
                  brandId: item.brandId,
                  seriesId: item.seriesId
                };
              })
            );
          })
          .catch(errData => {
            console.log(errData);
            console.log('code错误');
            if (errData.errorMessage) {
              this.$message.warning(errData.errorMessage);
            }
          })
          .finally(() => {
            this.loading = false;
          });
      }
      if (node.level >= 1) {
        http
          .get('/admin/appointmentBooklet/treeNodes.jhtml', {
            id: node.data.id,
            type: node.data.type
          })
          .then(data => {
            return resolve(
              data.treeNodes.map(item => {
                return {
                  id: item.id,
                  isLeaf: !item.isParent,
                  name: item.name,
                  pId: item.pId,
                  iconSkin: item.iconSkin,
                  type: item.type,
                  brandId: item.brandId,
                  seriesId: item.seriesId
                };
              })
            );
          })
          .catch(errData => {
            console.log(errData);
            console.log('code错误');
            if (errData.errorMessage) {
              this.$message.warning(errData.errorMessage);
            }
          })
          .finally(() => {
            this.loading = false;
          });
      }
    },
    loadNodeSysTag(node, resolve) {
      http
        .get('/admin/common/tagCategory/treeNodes.jhtml', {
          hierarchy: 'platform'
        })
        .then(data => {
          return resolve(
            data.treeNodes.map(item => {
              return {
                id: item.id,
                isLeaf: !item.isParent,
                name: item.name,
                pId: item.pId,
                iconSkin: item.iconSkin
              };
            })
          );
        })
        .catch(errData => {
          console.log(errData);
          console.log('code错误');
          if (errData.errorMessage) {
            this.$message.warning(errData.errorMessage);
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
    loadNodeTerminal(node, resolve) {
      http
        .get('/admin/intelligent/terminalType/treeNodes.jhtml', {})
        .then(data => {
          return resolve(
            data.treeNodes.map(item => {
              return {
                id: item.id,
                isLeaf: !item.isParent,
                name: item.name,
                pId: item.pId,
                iconSkin: item.iconSkin
              };
            })
          );
        })
        .catch(errData => {
          console.log(errData);
          console.log('code错误');
          if (errData.errorMessage) {
            this.$message.warning(errData.errorMessage);
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
    subMenuClick(menu) {
      this.title = menu.title;
      let parent = this.$parent;
      let pPath = '';
      while (parent && parent.$options.componentName !== 'ElMenu') {
        if (parent.$options.componentName === 'ElSubmenu') {
          pPath = parent._self.index + pPath;
        }
        parent = parent.$parent;
      }
      // // 跳转到子菜单的第一个
      // if (menu.path === '/operating/statistics-analysis' || menu.path === '/system/product' || menu.path === '/system/operating') {
      //   let array = [];
      //   menu.children.map(item => {
      //     if (this.currentAuth.includes(item.auth)) {
      //       array.push(item);
      //     }
      //   });
      //   this.$router.push(menu.path + array[0].path);
      // }
      // console.log(menu);
    },
    handledIndex(path = '') {
      // console.log('path' + path);
      let parent = this.$parent;
      let pPath = '';
      while (parent && parent.$options.componentName !== 'ElMenu') {
        if (parent.$options.componentName === 'ElSubmenu') {
          pPath = parent._self.index + pPath;
        }
        parent = parent.$parent;
      }
      return pPath + this.menu.path + path;
    },
    // 判断当前节点路由是否是激活路由
    currentNodeStyle(node) {
      let parent = node.parent;
      let pPath = node.data.path;
      while (parent && parent.data.path) {
        pPath = parent.data.path + pPath;
        parent = parent.parent;
      }
      let munuPath = this.handledIndex('');
      if (munuPath + pPath === this.activePath) {
        return {
          color: '#ff7300'
        };
      }
      return '';
    }
  }
};
</script>

<style lang="scss">
.side-menu.el-submenu {
  .el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content {
    background-color: #ffffff;
    color: #ff7300;
  }
  li {
    background-color: #ffffff;
  }
  .el-icon-plus {
    width: 2px;
    font-size: 12px;
    font-weight: bold;
  }
  .el-submenu__title {
    background-color: #ffffff !important;
    padding-left: 0 !important;
    height: 40px;
    line-height: 40px;
  }

  .el-menu-item {
    background-color: #ffffff !important;
    font-size: 12px;
    line-height: 40px;
    height: 40px;
  }

  .el-tree {
    background: #ffffff;
    margin-left: -10px;
    .iconfont {
      font-size: 16px;
      color: #909399;
    }
    .el-tree__empty-text {
      font-size: 12px;
    }
    .el-tree-node:focus > .el-tree-node__content {
      color: #f9901e;
      background: #ffffff;
    }
    .el-tree-node__content {
      &:hover {
        background: #ffffff;
      }
    }
    .custom-tree-node {
      display: flex;
      align-items: center;
      font-size: 12px;
      > i {
        margin: 0;
      }
      .icon {
        padding: 0px 5px 0px 0px;
      }
      .el-submenu [class^='el-icon-'] {
        margin-right: 0px;
        width: auto;
      }
      span {
        width: 180px;
        text-overflow: ellipsis;
        overflow: hidden;
      }
    }
  }
}
</style>
