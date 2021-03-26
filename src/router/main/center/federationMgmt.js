// 所有组件都要异步加载
// 导航页面
let FederationMgmtNav = resolve =>
  require(['@/pages/operating/federation-mgmt/FederationMgmtNav.vue'], resolve);
let FederationMgmt = resolve =>
  require([
    '@/pages/operating/federation-mgmt/FederationMgmtList.vue'
  ], resolve);
let FederationStatisticsAnalysis = resolve =>
  require([
    '@/pages/operating/federation-mgmt/FederationStatisticsAnalysis.vue'
  ], resolve);
const enter = [
  // 联盟管理导航
  {
    path: 'federation-mgmt',
    component: FederationMgmtNav
  },
  // 联盟管理列表
  {
    path: 'federation-mgmt/federation',
    component: FederationMgmt
  },
  // 运营商统计分析
  {
    path: 'federation-mgmt/statistics-analysis',
    component: FederationStatisticsAnalysis
  }
];

export default enter;
