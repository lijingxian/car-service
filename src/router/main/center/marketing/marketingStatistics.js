// 所有组件都要异步加载
const CouponKpiReport = resolve =>
  require(['@/pages/marketing/CouponKpiReport'], resolve);
const ActivityKpiReport = resolve =>
  require(['@/pages/marketing/ActivityKpiReport'], resolve);
const PromotionKpiReport = resolve =>
  require(['@/pages/marketing/PromotionKpiReport'], resolve);
const ContentKpiReport = resolve =>
  require(['@/pages/marketing/ContentKpiReport'], resolve);
const MarketingAnalysis = resolve =>
  require(['@/pages/marketing/marketing-statistics-new/marketing-analysis/MarketingStatisticsAnalysis'], resolve);
const ChannelAnalysis = resolve =>
  require(['@/pages/marketing/marketing-statistics-new/channel-analysis/ChannelStatisticsAnalysis'], resolve);
const FansAnalysis = resolve =>
  require(['@/pages/marketing/marketing-statistics-new/fans-analysis/FansStatisticsAnalysis'], resolve);
const SingleAnalysis = resolve =>
  require(['@/pages/marketing/marketing-statistics-new/single-analysis/SingleGeneralViewAnalysis'], resolve);
const MarketingMgmtNav = resolve =>
  require(['@/pages/marketing/activity-mgmt/MarketingMgmtNav'], resolve);
const Report = resolve =>
  require(['@/pages/marketing/marketing-statistics-new/report/MarketingReport'], resolve);
const enter = [
  {
    path: 'statistics-analysis',
    component: MarketingMgmtNav
  },
  // 优惠券统计
  {
    path: 'statistics-analysis/coupon',
    component: CouponKpiReport
  },
  // 活动营销统计
  {
    path: 'statistics-analysis/activity',
    component: ActivityKpiReport
  },
  // 促销活动统计
  {
    path: 'statistics-analysis/promotion',
    component: PromotionKpiReport
  },
  // 内容营销统计
  {
    path: 'statistics-analysis/content',
    component: ContentKpiReport
  },
  // 营销分析
  {
    path: 'statistics-analysis/marketing-analysis',
    component: MarketingAnalysis
  },
  // 渠道分析
  {
    path: 'statistics-analysis/channel-analysis',
    component: ChannelAnalysis
  },
  // 粉丝分析
  {
    path: 'statistics-analysis/fans-analysis',
    component: FansAnalysis
  },
  // 营销月报
  {
    path: 'statistics-analysis/report',
    component: Report
  },
  // 单内容
  {
    path: 'statistics-analysis/single',
    component: SingleAnalysis
  }
];

export default enter;
