// 所有组件都要异步加载

let OrderMgmtNav = resolve =>
  require(['@/pages/operating/nav'], resolve);
let OrderList = resolve =>
  require(['@/pages/order/OrderMgmtList.vue'], resolve);
let FinanceOrderList = resolve =>
  require(['@/pages/order/FinanceOrderMgmtList.vue'], resolve);
let InsuranceOrderList = resolve =>
  require(['@/pages/order/InsuranceOrderList.vue'], resolve);
let StoreValueMgmt = resolve =>
  require(['@/pages/order/finance-mgmt/store-value-mgmt/StoreValueMgmt.vue'], resolve);
let OrderSupplierMgmt = resolve => require(['@/pages/invoicing/order-supplier/OrderSupplierMgmt'], resolve);
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
    path: 'product/finance/finance/:orderType',
    component: FinanceOrderList
  },
  // 金融、保险订单
  {
    path: 'product/insurance/insurance/:orderType',
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
  }
];

export default enter;
