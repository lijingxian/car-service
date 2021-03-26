<template>
  <el-scrollbar wrapClass="s-scrollbar-wrapper">
    <el-menu :default-openeds="openedMenuList" active-text-color="#ff7300" @open="menuOpen" :unique-opened="true">
      <template v-for="(menu, index) of routes">
        <side-menu :menu="menu" v-if="menu.children" :key="index"
          v-show="(currentAuth.indexOf(menu.auth) !== -1 || menu.auth === '') && show(menu)"></side-menu>

        <router-link v-else :target="menu.target" :key="index" :to="menu.path"
          v-show="(currentAuth.indexOf(menu.auth) !== -1 || menu.auth === '') && show(menu)" class="cus-router">
          <el-menu-item-mixin class="side-menu" :index="menu.path" :disabled="menu.disabled" :style="itemStyle">
            <i class="iconfont" :class="menu.icon || ''"></i>
            <span slot="title">{{menu.title}}</span>
          </el-menu-item-mixin>
        </router-link>
      </template>
    </el-menu>
  </el-scrollbar>
</template>

<script>
import SideMenu from './SideMenu';
import ElMenuItemMixin from './components/ElMenuItemMixin';
import { mapGetters } from 'vuex';

export default {
  name: 'SideBar',
  data() {
    return {
      openedMenuList: [],
      itemStyle: {
        // 'padding-left': '20px !important'
      }
    };
  },
  props: {},
  components: { SideMenu, ElMenuItemMixin },
  computed: {
    ...mapGetters('Menu', ['activePath', 'router', 'routes', 'ifRouteListChanged']),
    ...mapGetters('Authority', ['currentAuth']),
    ...mapGetters(['currentUser'])
  },
  watch: {
    // 监控左侧导航栏是否有变更,有变更则重置已展开子菜单列表
    ifRouteListChanged(newVal, oldVal) {
      console.log('侧边导航变更' + newVal);
      this.openedMenuList = [];
    },
    router(newVal, oldVal) {
      console.log('路由变更' + newVal);
    },
    activePath(newVal, oldVal) {
      console.log('activePath=' + newVal);
      console.log('activePathopenedMenuList=' + this.openedMenuList);
      // if (this.openedMenuList.length === 0) {
      //   this.openedMenuList = [newVal];
      // }
    }
  },
  mounted() {
    this.openedMenuList = [this.router];
  },
  methods: {
    menuOpen(key, keyPath) {
      console.log('menuOpen: ', keyPath.join(''));
      // 一级菜单跳转
      console.log(this.openedMenuList);
      this.changeRoute(keyPath.join(''));
    },
    show(menu) {
      if (this.currentUser.roleLevel !== 'shop' && !window.top.SHOP_ID) {
        console.log(menu.title);
        if (
          menu.title === '营销管理' ||
          (menu.title === '数据洞察' && menu.auth !== 'admin:operatorStatistics' && menu.auth !== 'admin:member.statistics') ||
          menu.title === '会员卡' ||
          menu.title === '联盟店铺会员卡' ||
          menu.title === '会员卡体系统计' ||
          menu.title === '会员权益' ||
          menu.title === '车友社区' ||
          menu.title === '维保记录' ||
          menu.title === '预约管理' ||
          menu.title === '救援机构'
        ) {
          return false;
        } else {
          return true;
        }
      }
      return true;
    },
    changeRoute(path) {
      let parent = this.$parent;
      let pPath = '';
      while (parent && parent.$options.componentName !== 'ElMenu') {
        if (parent.$options.componentName === 'ElSubmenu') {
          pPath = parent._self.index + pPath;
        }
        parent = parent.$parent;
      }
      if (
        path === '/system/setting' ||
        path === '/system/product' ||
        path === '/system/operating' ||
        path === '/operating/statistics-analysis' ||
        path === '/order/logistics'
      ) {
        // 获取有权限的路由
        this.routes.map(item => {
          if (item.path === path) {
            let array = [];
            item.children &&
              item.children.map(element => {
                if (this.currentAuth.includes(element.auth)) {
                  array.push(element);
                }
              });
            this.$router.push(path + array[0].path);
          } else if (item.children) {
            item.children.map(child => {
              if (item.path + child.path === path) {
                let array = [];
                child.children.map(element => {
                  if (this.currentAuth.includes(element.auth) || !element.auth) {
                    array.push(element);
                  }
                });
                this.$router.push(path + array[0].path);
              }
            });
          }
        });
      } else {
        this.$router.push(pPath + path);
      }
    }
  }
};
</script>

<style lang="scss">
.s-scrollbar-wrapper.el-scrollbar__wrap {
  height: 100%;
  overflow-x: hidden;
  .iconfont {
    font-size: 30px;
  }
  .router-link-exact-active {
    li {
      color: #ff7300;
    }
  }
  .el-scrollbar__view {
    height: 100%;
    > .el-menu {
      height: 100%;
      padding-top: 20px;
      > .side-menu {
        > .el-submenu__title {
          line-height: 40px;
          height: 40px;
          padding-left: 20px !important;
          span {
            padding-left: 18px;
          }
          // &::after {
          //   content: '';
          //   position: absolute;
          //   transition: all 0.3s;
          //   left: 20px;
          //   top: auto;
          //   bottom: 0;
          //   height: 1px;
          //   width: 210px;
          //   background-color: #e4e4e4;
          // }
        }
        > ul.el-menu.el-menu--inline {
          padding-left: 68px !important;
          background-color: #fff !important;
          .el-menu--inline {
            // padding-left: 48px !important;
            background-color: #fff !important;
          }
          .el-submenu__title {
            font-size: 12px;
          }
        }
      }
      > .side-menu.is-opened {
        > .el-submenu__title {
          line-height: 40px;
          height: 40px;
          &::after {
            content: '';
            height: 0;
          }
        }
      }
      > .cus-router {
        > .el-menu-item {
          line-height: 40px;
          height: 40px;
          span {
            padding-left: 18px;
          }
          // background-color: #f1f1f1 !important;
          // &::after {
          //   content: '';
          //   position: absolute;
          //   left: 20px;
          //   top: auto;
          //   bottom: 0;
          //   height: 1px;
          //   width: 210px;
          //   background-color: #e4e4e4;
          // }
        }
      }
    }
  }
  a,
  a:focus,
  a:hover {
    cursor: pointer;
    color: inherit;
    text-decoration: none;
  }
}
</style>
