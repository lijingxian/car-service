// 所有组件都要异步加载
let OrderViewAnalysis = resolve => require(['@/pages/order/static-analysis/order/GeneralViewAnalysis.vue'], resolve);
let OrderPopulationAnalysis = resolve => require(['@/pages/order/static-analysis/order-population/GeneralViewAnalysis.vue'], resolve);
let OrderAfterSaleAnalysis = resolve => require(['@/pages/order/static-analysis/order-afterSale/GeneralViewAnalysis.vue'], resolve);
let OrderDeliveryAnalysis = resolve => require(['@/pages/order/static-analysis/order-delivery/GeneralViewAnalysis.vue'], resolve);
const GeneralViewAnalysis = resolve =>
  require(['@/pages/shop/statistics-analysis-new/GeneralViewAnalysis'], resolve);

const ProductCategoryAnalysis = resolve =>
  require(['@/pages/shop/statistics-analysis-new/ProductCategoryAnalysis'], resolve);
const SingleProductAnalysis = resolve =>
  require(['@/pages/shop/statistics-analysis-new/SingleProductAnalysis'], resolve);
const Report = resolve =>
  require(['@/pages/operating/static-analysis-new/report/Report'], resolve);
let OrderMgmtNav = resolve =>
  require(['@/pages/operating/nav'], resolve);
const enter = [
  // 订单统计分析-订单分析-新
  {
    path: 'product-statistics/OrderViewAnalysis',
    component: OrderViewAnalysis
  },
  // 订单统计分析-下单人群-新
  {
    path: 'product-statistics/OrderPopulationAnalysis',
    component: OrderPopulationAnalysis
  },
  // 订单统计分析-售后分析-新
  {
    path: 'product-statistics/OrderAfterSaleAnalysis',
    component: OrderAfterSaleAnalysis
  },
  // 订单统计分析-物流-新
  {
    path: 'product-statistics/OrderDeliveryAnalysis',
    component: OrderDeliveryAnalysis
  },
  // 商品统计
  {
    path: 'product-statistics/generalViewAnalysis',
    component: GeneralViewAnalysis
  },
  {
    path: 'product-statistics/productCategoryAnalysis',
    component: ProductCategoryAnalysis
  },
  {
    path: 'product-statistics/singleProductAnalysis',
    component: SingleProductAnalysis
  },
  {
    path: 'product-statistics',
    component: OrderMgmtNav
  },
  // 运营月报
  {
    path: 'product-statistics/report',
    component: Report
  }
];

export default enter;
