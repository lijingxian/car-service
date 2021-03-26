// 所有组件都要异步加载
const CustomerServiceNav = resolve =>
  require(['@/pages/service/CustomerServiceNav'], resolve);

// 接待管理
const ReceptionMgmt = resolve =>
  require([
    '@/pages/service/smart-to-shop/reception-mgmt/ReceptionMgmt'
  ], resolve);

// 智能到店统计分析
const SmartToShopAnalysis = resolve =>
  require(['@/pages/service/smart-to-shop/StatisticsAnalysis'], resolve);

// 智能到店导航
const SmartToShopNav = resolve =>
  require(['@/pages/operating/federation-mgmt/FederationMgmtNav.vue'], resolve);

// 机器人管理
const RobotMgmt = resolve =>
  require(['@/pages/service/smart-reception/robot-mgmt/RobotMgmt'], resolve);
// 机器人功能
const RobotFunctionMgmt = resolve =>
  require(['@/pages/service/smart-reception/robot-mgmt/RobotFunctionMgmt'], resolve);
// 地图管理
const MapMgmt = resolve =>
  require(['@/pages/service/smart-reception/MapMgmt'], resolve);

const QAMgmt = resolve =>
  require(['@/pages/service/smart-reception/QaMgmt'], resolve);

const ProcessQAMgmt = resolve =>
  require(['@/pages/service/smart-reception/process-qa/ProcessQAMgmt'], resolve);

const UnknowProblem = resolve =>
  require(['@/pages/service/smart-reception/UnknowProblem'], resolve);
const ReviewStaticDetail = resolve =>
  require(['@/pages/service/smart-reception/reception-static/ReviewStaticDetail'], resolve);
const enter = [
  // {
  //   path: 'smart-to-shop',
  //   redirect: 'smart-to-shop/reception-mgmt'
  // },
  // 客服导航
  {
    path: 'smart-to-shop',
    component: SmartToShopNav
  },
  // 接待管理
  {
    path: 'smart-to-shop/reception-mgmt',
    component: ReceptionMgmt
  },
  // 智能到店统计分析
  {
    path: 'smart-to-shop/statistics-analysis',
    component: SmartToShopAnalysis
  },
  {
    path: 'service-mgmt',
    // redirect: 'service-mgmt/online-response'
    component: CustomerServiceNav
  },
  // 智能到店导航
  {
    path: '/cs/smart-to-shop-nav',
    component: SmartToShopNav
  },
  // 机器人管理
  {
    path: 'smart-reception/robot-mgmt',
    component: RobotMgmt
  },
  // 机器人功能
  {
    path: 'smart-reception/robot-function-mgmt',
    component: RobotFunctionMgmt
  },
  // 地图管理
  {
    path: 'smart-reception/map-mgmt',
    component: MapMgmt
  },
  // 智能接待
  {
    path: 'smart-reception',
    component: SmartToShopNav
  },
  // 评价详情
  {
    path: 'smart-reception/reception-static/review-static-detail',
    component: ReviewStaticDetail
  },
  // 问答管理
  {
    path: 'smart-reception/qa-mgmt',
    component: QAMgmt
  },
  // 流程问答
  {
    path: 'smart-reception/process-qa',
    component: ProcessQAMgmt
  },
  // 未知问题
  {
    path: 'smart-reception/unknow-problem',
    component: UnknowProblem
  }
];

export default enter;
