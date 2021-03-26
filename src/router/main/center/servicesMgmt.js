// 所有组件都要异步加载
let ServicesMgmtNav = resolve =>
  require(['@/pages/operating/services-mgmt/ServicesMgmtNav'], resolve);

let ServicesMgmt = resolve =>
  require(['@/pages/operating/services-mgmt/services-mgmt/ServicesMgmt'], resolve);

let ServiceSpecification = resolve =>
  require([
    '@/pages/operating/services-mgmt/services-specification/ServiceSpecification'
  ], resolve);

let ServicesOrder = resolve =>
  require(['@/pages/operating/services-mgmt/services-order/ServicesMgmtOrder'], resolve);
const ServiceSubscribe = resolve =>
  require(['@/pages/operating/services-mgmt/service-subscribe/ServiceSubscribe'], resolve);

let SubscriptionService = resolve =>
  require([
    '@/pages/operating/services-mgmt/services-order/SubscriptionService'
  ], resolve);

let MessageMgmt = resolve =>
  require(['@/pages/operating/services-mgmt/message-mgmt/MessageMgmt.vue'], resolve);

const enter = [
  // 服务定制重定向
  {
    path: 'service-mgmt',
    component: ServicesMgmtNav
  },
  {
    path: 'service-mgmt/manage',
    redirect: 'service-mgmt/manage/manage'
  },
  // 服务管理
  {
    path: 'service-mgmt/manage/manage',
    component: ServicesMgmt
  },
  // 服务规格
  {
    path: 'service-mgmt/specification',
    component: ServiceSpecification
  },
  // 服务订单
  {
    path: 'service-mgmt/manage/order',
    component: ServicesOrder
  },
  // 服务订购
  {
    path: 'service-mgmt/subscribe',
    component: ServiceSubscribe
  },
  // 订阅服务
  {
    path: 'service-mgmt/services/subscription',
    component: SubscriptionService
  },
  // 短信管理
  {
    path: 'service-mgmt/message-mgmt',
    component: MessageMgmt
  }
];

export default enter;
