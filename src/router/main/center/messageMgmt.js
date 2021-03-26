// 所有组件都要异步加载
let MessageMgmtSys = resolve =>
  require(['@/pages/operating/message-mgmt/MessageMgmtSys.vue'], resolve);
let MessageMgmtStore = resolve =>
  require(['@/pages/operating/message-mgmt/MessageMgmtStore.vue'], resolve);
let MessageMgmtPackage = resolve =>
  require(['@/pages/operating/message-mgmt/MessageMgmtPackage.vue'], resolve);
let MessageMgmtOrder = resolve =>
  require(['@/pages/operating/message-mgmt/MessageMgmtOrder.vue'], resolve);
let MessageMgmtRecharge = resolve =>
  require(['@/pages/operating/message-mgmt/MessageMgmtRecharge.vue'], resolve);
const enter = [
  {
    // 短信管理（系统）
    path: 'service-mgmt/message-platform',
    component: MessageMgmtSys
  },
  {
    // 短信管理（店铺）
    path: 'service-mgmt/message',
    component: MessageMgmtStore
  },
  {
    // 套餐管理
    path: 'service-mgmt/message(-platform)?/package',
    component: MessageMgmtPackage
  },
  {
    // 短信订单
    path: 'service-mgmt/message(-platform)?/order',
    component: MessageMgmtOrder
  },
  {
    // 订单充值
    path: 'service-mgmt/message(-platform)?/recharge',
    component: MessageMgmtRecharge
  }
];

export default enter;
