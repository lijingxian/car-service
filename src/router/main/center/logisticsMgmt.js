// 所有组件都要异步加载
// const LogisticsMgmtNav = resolve =>
//   require(['@/pages/order/logistics-mgmt/LogisticsMgmtNav.vue'], resolve);
const DeliveryMgmt = resolve =>
  require(['@/pages/order/logistics-mgmt/delivery-mgmt/DeliveryMgmt.vue'], resolve);
// const LogisticsMgmt = resolve =>
//   require(['@/pages/order/logistics-mgmt/logistics-mgmt/LogisticsMgmt.vue'], resolve);
// const LogisticsMgmtShop = resolve =>
//   require(['@/pages/order/logistics-mgmt/logistics-mgmt-shop/LogisticsMgmt.vue'], resolve);

const enter = [
  // {
  //   path: 'logistics',
  //   component: LogisticsMgmtNav
  // },
  // 发货管理
  {
    path: 'logistics/shipping',
    component: DeliveryMgmt
  }
  // // 物流管理-shop
  // {
  //   path: 'logistics_new/delivery_shop',
  //   component: LogisticsMgmtShop
  // },
  // // 物流管理-platform
  // {
  //   path: 'logistics_new/delivery',
  //   component: LogisticsMgmt
  // }
];

export default enter;
