// 所有组件都要异步加载

let OrderMgmtNav = resolve =>
  require(['@/pages/order/OrderMgmtNav.vue'], resolve);
let OrderList = resolve =>
  require(['@/pages/order/OrderMgmtList.vue'], resolve);
let FinanceOrderList = resolve =>
  require(['@/pages/order/FinanceOrderMgmtList.vue'], resolve);
let InsuranceOrderList = resolve =>
  require(['@/pages/order/InsuranceOrderList.vue'], resolve);
let StoreValueMgmt = resolve =>
  require(['@/pages/order/finance-mgmt/store-value-mgmt/StoreValueMgmt.vue'], resolve);
let OrderSupplierMgmt = resolve => require(['@/pages/invoicing/order-supplier/OrderSupplierMgmt'], resolve);
let OrderViewAnalysis = resolve => require(['@/pages/order/static-analysis/order/GeneralViewAnalysis.vue'], resolve);
let OrderPopulationAnalysis = resolve => require(['@/pages/order/static-analysis/order-population/GeneralViewAnalysis.vue'], resolve);
let OrderAfterSaleAnalysis = resolve => require(['@/pages/order/static-analysis/order-afterSale/GeneralViewAnalysis.vue'], resolve);
let OrderDeliveryAnalysis = resolve => require(['@/pages/order/static-analysis/order-delivery/GeneralViewAnalysis.vue'], resolve);
const enter = [
  // 订单导航
  // {
  //   path: 'product',
  //   redirect: 'product/nav'
  // },
  {
    path: 'product',
    component: OrderMgmtNav
  },
  // 订单列表
  {
    path: 'product/:orderType/:id?',
    component: OrderList
  },
  // 金融、保险订单
  {
    path: 'product/product/finance/:orderType',
    component: FinanceOrderList
  },
  {
    path: 'product/product/insurance/:orderType',
    component: InsuranceOrderList
  },
  // 储值管理
  {
    path: 'product/store/store/deposit',
    component: StoreValueMgmt
  },
  {
    path: 'product/orderSupplier/orderSupplier/order-supplier',
    component: OrderSupplierMgmt
  },
  // 订单服务
  {
    path: 'service',
    redirect: 'service/service'
  },
  {
    path: 'service/:orderType',
    component: OrderList
  },
  // 订单统计分析-订单分析-新
  {
    path: 'statistics-analysis/OrderViewAnalysis',
    component: OrderViewAnalysis
  },
  // 订单统计分析-下单人群-新
  {
    path: 'statistics-analysis/OrderPopulationAnalysis',
    component: OrderPopulationAnalysis
  },
  // 订单统计分析-售后分析-新
  {
    path: 'statistics-analysis/OrderAfterSaleAnalysis',
    component: OrderAfterSaleAnalysis
  },
  // 订单统计分析-物流-新
  {
    path: 'statistics-analysis/OrderDeliveryAnalysis',
    component: OrderDeliveryAnalysis
  }
];

export default enter;
