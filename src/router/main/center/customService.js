// 所有组件都要异步加载
// const CustomerServiceNav = resolve =>
//   require(['@/pages/service/CustomerServiceNav'], resolve);
const CustomerServiceNav = resolve =>
  require(['@/pages/service/nav'], resolve);
// 群组管理
const GroupMgmt = resolve =>
  require(['@/pages/service/group-mgmt/GroupMgmt'], resolve);
// 在线会话
const SessionOnline = resolve =>
  require(['@/pages/service/session-online/SessionOnline'], resolve);
// 在线会话-系统
const SessionOnlineSys = resolve =>
  require(['@/pages/service/session-online-sys/SessionOnline'], resolve);
// 会话质检
const SessionCheck = resolve =>
  require(['@/pages/service/session-check/SessionCheck'], resolve);
// 黑名单管理
const BlackList = resolve => require(['@/pages/service/black-list/BlackList'], resolve);
// 工时管理
const ManhourMgmt = resolve =>
  require(['@/pages/service/ManhourMgmt'], resolve);
// 知识库管理
const KnowledgeMgmt = resolve =>
  require(['@/pages/service/robot/KnowledgeMgmt'], resolve);
// 回复设置
const ReplySetting = resolve =>
  require(['@/pages/service/robot/ReplySetting'], resolve);
// 客服管理
const CustomerServiceMgmt = resolve =>
  require(['@/pages/service/cs-mgmt/CustomerServiceMgmt'], resolve);
// 工单管理
const WorkSheetMgmt = resolve =>
  require(['@/pages/service/worksheet-mgmt/WorkSheetMgmt'], resolve);
const StatisticsAnalysisNav = resolve =>
  require(['@/pages/service/nav'], resolve);
// 工单管理统计分析
const StatisticsAnalysis = resolve =>
  require(['@/pages/service/worksheet-mgmt/StatisticsAnalysis'], resolve);

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
  require(['@/pages/service/smart-to-shop/SmartToShopNav'], resolve);

// 机器人管理
const RobotMgmt = resolve =>
  require(['@/pages/service/smart-reception/robot-mgmt/RobotMgmt'], resolve);

// 地图管理
const MapMgmt = resolve =>
  require(['@/pages/service/smart-reception/MapMgmt'], resolve);

const ReceptionStaticAnalysis = resolve =>
  require(['@/pages/service/ReceptionStaticAnalysis'], resolve);

const ServiceStaticAnalysis = resolve =>
  require(['@/pages/service/ServiceStaticAnalysis'], resolve);

const ReceptionStatic = resolve =>
  require(['@/pages/service/smart-reception/ReceptionStatic'], resolve);

const ReceptionStaticDetail = resolve =>
  require(['@/pages/service/smart-reception/ReceptionStaticDetail'], resolve);

const QAMgmt = resolve =>
  require(['@/pages/service/smart-reception/QaMgmt'], resolve);

const ProcessQAMgmt = resolve =>
  require(['@/pages/service/smart-reception/process-qa/ProcessQAMgmt'], resolve);

const UnknowProblem = resolve =>
  require(['@/pages/service/smart-reception/UnknowProblem'], resolve);
const GeneralViewAnalysis = resolve =>
  require(['@/pages/service/static-analysis/GeneralViewAnalysis'], resolve);
const ReviewStaticDetail = resolve =>
  require(['@/pages/service/smart-reception/reception-static/ReviewStaticDetail'], resolve);
const Report = resolve =>
  require(['@/pages/service/static-analysis/report/ServiceReport'], resolve);
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
    path: '',
    // redirect: 'service-mgmt/online-response'
    component: CustomerServiceNav
  },
  // 在线会话
  {
    path: 'service-mgmt/online-response',
    component: SessionOnline
  },
  // 在线会话-系统
  {
    path: 'service-mgmt/online-response-sys',
    component: SessionOnlineSys
  },
  // 客服管理
  {
    path: 'service-mgmt/member',
    component: CustomerServiceMgmt
  },
  // 客服群组管理
  {
    path: 'service-mgmt/group',
    component: GroupMgmt
  },
  // 会话质检
  {
    path: 'service-mgmt/quality',
    component: SessionCheck
  },
  // 黑名单管理
  {
    path: 'service-mgmt/black-list',
    component: BlackList
  },
  // 工时管理
  {
    path: 'service-mgmt/scheduling',
    component: ManhourMgmt
  },
  {
    path: 'worksheet',
    redirect: 'worksheet/worksheet-mgmt'
  },
  // 工单管理
  {
    path: 'worksheet/worksheet-mgmt',
    component: WorkSheetMgmt
  },
  // 工单管理统计分析
  {
    path: 'worksheet/statistics-analysis',
    component: StatisticsAnalysis
  },
  {
    path: 'robot',
    redirect: 'robot/konwledge-base'
  },
  // 机器人回复设置
  {
    path: 'robot/reply',
    component: ReplySetting
  },
  // 机器人知识库管理
  {
    path: 'service-mgmt/konwledge-base',
    component: KnowledgeMgmt
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
  // 地图管理
  {
    path: 'smart-reception/map-mgmt',
    component: MapMgmt
  },
  // 智能接待
  {
    path: 'smart-reception',
    redirect: 'smart-reception/robot-mgmt'
  },
  // 接待统计
  {
    path: 'smart-reception/reception-static',
    component: ReceptionStatic
  },
  // 接待统计详情
  {
    path: 'smart-reception/reception-static/reception-static-detail',
    component: ReceptionStaticDetail
  },
  // 评价详情
  {
    path: 'smart-reception/reception-static/review-static-detail',
    component: ReviewStaticDetail
  },
  // 知识库
  {
    path: 'smart-reception/knowledge',
    redirect: 'smart-reception/knowledge/qa-mgmt'
  },
  // 问答管理
  {
    path: 'smart-reception/knowledge/qa-mgmt',
    component: QAMgmt
  },
  // 流程问答
  {
    path: 'smart-reception/knowledge/process-qa',
    component: ProcessQAMgmt
  },
  // 未知问题
  {
    path: 'smart-reception/knowledge/unknow-problem',
    component: UnknowProblem
  },
  // 统计分析
  {
    path: 'statistics-analysis',
    component: StatisticsAnalysisNav
  },
  // {
  //   path: 'statistics-analysis',
  //   redirect: 'statistics-analysis/generalViewAnalysis'
  // },
  {
    path: 'statistics-analysis/reception',
    component: ReceptionStaticAnalysis
  },
  {
    path: 'statistics-analysis/service',
    component: ServiceStaticAnalysis
  },
  // 统计分析-新
  {
    path: 'statistics-analysis/generalViewAnalysis',
    component: GeneralViewAnalysis
  },
  // 客户分析月报
  {
    path: 'statistics-analysis/report',
    component: Report
  }
];

export default enter;
