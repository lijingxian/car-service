import Vue from 'vue';
import Router from 'vue-router';
import Login from '@/pages/login/Login.vue';
import Customize from '@/pages/home/CustomizeView.vue';
import MoreStatic from '@/pages/home/MoreStatic.vue';
import QrCode from '@/pages/test/QrCode';
import QrCodePay from '@/pages/test/QrCodePay';
import QrCodePayOauth from '@/pages/test/QrCodePayOauth';
import Layout from '@/pages/layout/MainLayout.vue';
import http from '@/common/http';

// 引入vuex
import store from '@/store';

// 引入main路由
import mainChildren from './main';

// 侧栏导航菜单
import sideList from '@/pages/layout/SideList.js';
import Sites from './sites';
import TemplateEditor from './templateEditor';
import IoService from '@/service/customer-service/session-online/imIo';
import IoServiceSys from '@/service/customer-service/session-online/imIoSys';
const ApplyFor = resolve => require(['@/pages/operating/merchants-mgmt/ApplyFor'], resolve);
const DriveHistory = resolve => require(['@/pages/operating/vehicle-mgmt/DriveHistory'], resolve);
const DriveInTime = resolve => require(['@/pages/operating/vehicle-mgmt/DriveInTime'], resolve);
const FaultCarListioner = resolve => require(['@/pages/operating/vehicle-mgmt/FaultCarListioner'], resolve);
const MerchantsMgmtQua = resolve => require(['@/pages/operating/merchants-mgmt/MerchantsMgmtQua'], resolve);
const QrPrint = resolve => require(['@/pages/home/QrcodePrint.vue'], resolve);
const Read = resolve => require(['@/pages/test/Read.vue'], resolve);
Vue.use(Router);
const router = new Router({
  routes: [
    ...Sites,
    ...TemplateEditor,
    {
      path: '/login',
      component: Login
    },
    {
      path: '/customize',
      component: Customize
    },
    {
      path: '/morestatic',
      component: MoreStatic
    },
    {
      path: '/merchants/apply-for',
      component: ApplyFor
    },
    // 二维码
    {
      path: '/qrcode-print',
      component: QrPrint
    },
    {
      path: '/merchants/qua',
      component: MerchantsMgmtQua
    },
    {
      path: '/vehicle/drive-history',
      component: DriveHistory
    },
    {
      path: '/vehicle/drive-in-time',
      component: DriveInTime
    },
    {
      path: '/vehicle/fault-car-listioner',
      component: FaultCarListioner
    },
    {
      path: '/qrPay4Code',
      component: QrCode
    },
    {
      path: '/qrPay4Oauth',
      component: QrCodePayOauth
    },
    {
      path: '/qrPay4Order',
      component: QrCodePay
    },
    {
      path: '/read',
      component: Read
    },
    {
      path: '',
      component: Layout,
      children: mainChildren,
      meta: {
        loginRequired: true
      }
    }
  ]
});
const getCurrentUserUrl = '/admin/common/getCurrent.jhtml';
const getAuthUrl = '/admin/common/listAuthority/v201901.jhtml';

// 获取当前用户信息
async function getCurrent() {
  try {
    let response = await http.get(getCurrentUserUrl, {});
    store.commit('updateUser', response.admin);
    return;
  } catch (error) {
    throw new Error('ERR_GET_CURRENT: ');
  }
}

// 获取权限列表
async function getAuth() {
  try {
    let response = await http.get(getAuthUrl, {});
    if (response.authorities.some(item => item === 'admin:onlineReply') && IoService.socket === null) {
      console.log('IoService.socket === null');
      IoService.connect();
    }
    if (response.authorities.some(item => item === 'admin:service.service.plateForm') && IoServiceSys.socket === null) {
      console.log('IoService.socket === null');
      IoServiceSys.connect();
    }
    store.commit('Authority/updateAuth', response.authorities);
    return;
  } catch (error) {
    throw new Error('ERR_GET_AUTH: ');
  }
}

router.beforeEach(async (to, from, next) => {
  // 当前用户信息
  const currentUser = store.getters.currentUser;

  // 白名单，允许不登录访问
  let whiteRouteList = [
    '/login',
    '/read',
    '/merchants/apply-for',
    '/qrPay4Order',
    '/qrPay4Oauth',
    '/qrPay4Code',
    '/merchants/qua',
    '/site/single-page'
  ];

  let hasCurrentUserInfo = !!currentUser.id;

  // 没登录或者刷新时候清除了vuex
  if (!hasCurrentUserInfo) {
    try {
      await getCurrent();
      await getAuth();
      /**
       * 走到这里说明是登录成功的
       */
      // 如果目标指向登录页, 跳转到主页
      if (to.path === '/login') {
        next({ path: '/' });
        return;
      }
      // 更新左侧菜单
      store.commit('Menu/updateRoutes', { routes: sideList[to.path.split('/')[1]] });
      // 更新激活路由
      store.commit('Menu/updateActivePath', { activePath: to.fullPath });
      next();
      return;
    } catch (error) {
      /**
       * 未登录, getCurrent会失败
       */
      console.warn('未登录');
      if (whiteRouteList.indexOf(to.path) !== -1) {
        next();
        return;
      }
      next({ path: '/login' });
      return;
    }
  } else {
    /**
     * 已登录
     */
    // 防止登录后进入login页
    if (to.path === '/login') {
      next({ path: '/' });
      return;
    } else {
      /**
       * 这里是绝大部分的应用场景，通过顶级功能模块或者左侧菜单点击进入
       */
      // 路由为空或者根路由
      if (!store.getters['Menu/routes'][0] || to.path === '/') {
        // 更新左侧菜单
        store.commit('Menu/updateRoutes', { routes: sideList[to.path.split('/')[1]] });
      }
      // 更新激活路由
      store.commit('Menu/updateActivePath', { activePath: to.fullPath });
    }
  }
  // 无论怎样都要进入下一页面
  next();
});
const originalPush = Router.prototype.push;
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err);
};
export default router;
