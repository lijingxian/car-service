// 所有组件都要异步加载
const DistributorMgmt = resolve => require(['@/pages/shop/shop-rate/distributor-setting/DistributorMgmt.vue'], resolve);
const LogisticsMgmtShop = resolve =>
  require(['@/pages/order/logistics-mgmt/logistics-mgmt-shop/LogisticsMgmt.vue'], resolve);
const ShopAccountMgmt = resolve =>
  require(['@/pages/system/shop-account-mgmt/ShopAccountMgmt'], resolve);
const WechatListMgmt = resolve =>
  require([
    '@/pages/system/wechat-official-account-mgmt/WechatListMgmt'
  ], resolve);
const ScreenProjection = resolve =>
  require([
    '@/pages/system/screen-mgmt/ScreenMgmt'
  ], resolve);
const MoveCodeMgmt = resolve =>
  require([
    '@/pages/operating/move-code/MoveCodeMgmt.vue'
  ], resolve);
let FederationMgmtNav = resolve =>
  require(['@/pages/operating/federation-mgmt/FederationMgmtNav.vue'], resolve);
const routes = [
  // 店铺账户
  {
    path: 'shop',
    component: FederationMgmtNav
  },
  // 配送方式设置
  {
    path: 'shop/product-settings/distributor-setting',
    component: DistributorMgmt
  },
  // 物流管理-shop
  {
    path: 'shop/delivery_shop',
    component: LogisticsMgmtShop
  },
  // 店铺账户
  {
    path: 'shop/shop-account',
    component: ShopAccountMgmt
  },
  // 微信账户
  {
    path: 'shop/wechatList',
    component: WechatListMgmt
  },
  // 电视投屏
  {
    path: 'shop/screen-projection',
    component: ScreenProjection
  },
  {
    path: 'shop/move-code',
    component: MoveCodeMgmt
  }
];

export default routes;
