// 所有组件都要异步加载
const MarketingMgmtNav = resolve =>
  require(['@/pages/marketing/activity-mgmt/MarketingMgmtNav'], resolve);

const ActivityMgmt = resolve =>
  require(['@/pages/marketing/activity-mgmt/marketing/ActivityMgmt'], resolve);

const PromotionMgmt = resolve =>
  require(['@/pages/marketing/activity-mgmt/promotion/PromotionMgmt'], resolve);

const PromotionMgmtAdmin = resolve =>
  require(['@/pages/marketing/activity-mgmt/promotion-admin/PromotionMgmt'], resolve);

const EventMgmt = resolve =>
  require(['@/pages/marketing/activity-mgmt/event/EventMgmt'], resolve);

const ActivityMgmtModelMgmt = resolve =>
  require([
    '@/pages/marketing/activity-mgmt/marketing/model-mgmt/ActivityMgmtModelMgmt'
  ], resolve);

const enter = [
  // 营销管理导航
  {
    path: 'marketing-mgmt',
    component: MarketingMgmtNav
  },
  // 营销管理导航
  {
    path: '',
    component: MarketingMgmtNav
  },
  // 营销活动管理
  {
    path: 'marketing-mgmt/activity',
    component: ActivityMgmt
  },
  // 营销活动模板管理
  {
    path: 'template/activity',
    component: ActivityMgmtModelMgmt
  },
  // 营销活动模板管理
  {
    path: 'template',
    component: MarketingMgmtNav
  },
  // 促销活动
  {
    path: 'marketing-mgmt/promotion',
    component: PromotionMgmt
  },
  // 促销活动-平台
  {
    path: 'marketing-mgmt/promotion/admin',
    component: PromotionMgmtAdmin
  },
  // 线下活动
  {
    path: 'marketing-mgmt/event',
    component: EventMgmt
  }
];

export default enter;
