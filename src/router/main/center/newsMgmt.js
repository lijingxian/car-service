// 所有组件都要异步加载
// 导航页面
let newsMgmt = resolve =>
  require(['@/pages/message/news-mgmt/NewsMgmtList.vue'], resolve);
let newsMgmtPending = resolve =>
  require(['@/pages/message/news-mgmt/NewsMgmtListPending.vue'], resolve);
let carNewsMgmt = resolve =>
  require(['@/pages/message/news-mgmt/CarNewsMgmtList.vue'], resolve);
let serviceNewsMgmt = resolve =>
  require(['@/pages/message/news-mgmt/ServiceNewsMgmtList.vue'], resolve);
let MessageMgmtSettings = resolve =>
  require(['@/pages/operating/message-mgmt/MessageMgmtSettings.vue'], resolve);
const enter = [
  {
    path: '',
    redirect: 'car/car'
  },
  {
    path: 'car',
    redirect: 'car/car'
  },
  {
    path: 'car/car',
    component: carNewsMgmt
  },
  {
    path: 'service',
    redirect: 'service/service'
  },
  {
    path: 'service/service',
    component: serviceNewsMgmt
  },
  {
    // 车辆消息
    path: 'car/:category',
    component: newsMgmt
  },
  {
    // 事故和故障
    path: 'car/:category/:subCategory',
    component: newsMgmt
  },
  {
    // 服务消息
    path: 'service/:category',
    component: newsMgmt
  },
  {
    // 维保消息
    path: 'service/:category/:subCategory',
    component: newsMgmt
  },
  {
    // 消息列表
    path: 'message-mgmt',
    component: newsMgmt
  },
  {
    // 消息列表
    path: 'message-mgmt-pending',
    component: newsMgmtPending
  },
  // 消息设置
  {
    path: 'settings',
    component: MessageMgmtSettings
  }
];
export default enter;
