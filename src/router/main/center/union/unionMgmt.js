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
let AbilityRatingMgmt = resolve =>
  require(['@/pages/shop/shop-rate/credit-evaluation-system-mgmt/AbilityRatingMgmt.vue'], resolve);
let PromiseMgmt = resolve => require(['@/pages/shop/shop-rate/credit-evaluation-system-mgmt/PromiseMgmt.vue'], resolve);
let RecommendSystemMgmt = resolve =>
  require(['@/pages/shop/shop-rate/credit-evaluation-system-mgmt/RecommendSystemMgmt.vue'], resolve);
const MerchantsMgmt = resolve => require(['@/pages/operating/merchants-mgmt/MerchantsMgmt'], resolve);
const MerchantsMgmtNav = resolve => require(['@/pages/operating/merchants-mgmt/MerchantsMgmtNav'], resolve);
const enter = [
  // 联盟管理导航
  {
    path: '',
    component: FederationMgmtNav
  },
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
  },
  {
    path: 'federation-mgmt/product-settings/shop-rate',
    redirect: 'federation-mgmt/product-settings/shop-rate/ability'
  },
  // 联盟-能力评价体系设置
  {
    name: 'ability-rating-system-mgmt',
    path: 'federation-mgmt/product-settings/shop-rate/ability',
    component: AbilityRatingMgmt
  },
  // 联盟-承诺体系设置
  {
    name: 'promise-system-mgmt',
    path: 'federation-mgmt/product-settings/shop-rate/promise',
    component: PromiseMgmt
  },
  // 联盟-推荐体系设置
  {
    name: 'recommend-system-mgmt',
    path: 'federation-mgmt/product-settings/shop-rate/recommend',
    component: RecommendSystemMgmt
  },
  // 招商申请管理
  {
    path: 'merchants-mgmt',
    component: MerchantsMgmtNav
  },
  {
    path: 'federation-mgmt/merchants-mgmt/investment',
    component: MerchantsMgmt
  }
];

export default enter;
