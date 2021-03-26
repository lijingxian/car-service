// 所有组件都要异步加载
// 店铺统计分析
let ShopStaticAnalysis = resolve =>
  require(['@/pages/operating/static-analysis-new/shop-analysis/ShopStaticAnalysis.vue'], resolve);
let SingleStoreAnalysis = resolve =>
  require(['@/pages/operating/static-analysis-new/shop-analysis/SingleStoreAnalysis.vue'], resolve);
const ReceptionStatic = resolve =>
  require(['@/pages/service/smart-reception/ReceptionStatic'], resolve);

const ReceptionStaticDetail = resolve =>
  require(['@/pages/service/smart-reception/ReceptionStaticDetail'], resolve);
const SmartToShopStatic = resolve =>
  require(['@/pages/service/smart-to-shop/GeneralViewAnalysis'], resolve);
const SmartToShopNav = resolve =>
  require(['@/pages/operating/federation-mgmt/FederationMgmtNav.vue'], resolve);
const enter = [
  {
    path: 'statistics-analysis',
    component: SmartToShopNav
  },
  {
    path: 'statistics-analysis/shop-analysis',
    component: ShopStaticAnalysis
  },
  {
    path: 'statistics-analysis/single-shop-analysis',
    component: SingleStoreAnalysis
  },
  // 接待统计
  {
    path: 'statistics-analysis/reception-static',
    component: ReceptionStatic
  },
  // 接待统计详情
  {
    path: 'statistics-analysis/reception-static/reception-static-detail',
    component: ReceptionStaticDetail
  },
  // 智能到店统计
  {
    path: 'statistics-analysis/smart-to-shop',
    component: SmartToShopStatic
  }
];

export default enter;
