// // 所有组件都要异步加载
const CommuniMgmtNav = resolve =>
  require(['@/pages/operating/communi-mgmt/CommuniMgmtNav'], resolve);
const CommuniOperator = resolve =>
  require(['@/pages/operating/communi-mgmt/communi-operator/CommuniOperator'], resolve);
const CardMgmt = resolve =>
  require(['@/pages/operating/communi-mgmt/communi-operator/CardMgmt/CardMgmt'], resolve);
const CommuniCard = resolve =>
  require(['@/pages/operating/communi-mgmt/communi-card/CommuniCard'], resolve);
const StatisticsAnalysis = resolve =>
  require(['@/pages/operating/communi-mgmt/StatisticsAnalysis'], resolve);
const StatisticsAnalysisPackage = resolve =>
  require(['@/pages/operating/communi-mgmt/StatisticsAnalysisPackage'], resolve);
const RechargeRecords = resolve =>
  require(['@/pages/operating/communi-mgmt/RechargeRecords'], resolve);

const enter = [
  // 通讯管理导航
  {
    path: 'communication-mgmt',
    component: CommuniMgmtNav
  },
  // 通讯管理运营商
  {
    path: 'communication-mgmt/operator',
    component: CommuniOperator

  },
  // 通讯管理卡密管理
  {
    path: 'communication-mgmt/operator/card',
    component: CardMgmt
  },
  // 通讯管理通讯卡
  {
    path: 'communication-mgmt/card',
    component: CommuniCard
  },
  // 充值记录
  {
    path: 'communication-mgmt/record',
    component: RechargeRecords
  },
  {
    path: 'communication-mgmt/card-statistics-analysis',
    redirect: 'communication-mgmt/card-statistics-analysis/card'
  },
  // 通讯卡统计分析
  {
    path: 'communication-mgmt/card-statistics-analysis/card',
    component: StatisticsAnalysis
  },
  // 通讯套餐统计分析
  {
    path: 'communication-mgmt/card-statistics-analysis/package',
    component: StatisticsAnalysisPackage
  }
];

export default enter;
