// 所有组件都要异步加载
// const PurchaseMgmtNav = resolve =>
//   require(['@/pages/invoicing/purchase-mgmt/PurchaseMgmtNav'], resolve);
const PurchaseMgmtNav = resolve =>
  require(['@/pages/invoicing/nav'], resolve);
const PurchaseApplyMgmt = resolve => require(['@/pages/invoicing/purchase-mgmt/purchase-apply/PurchaseApplyMgmt'], resolve);
const PurchaseReturnApplyMgmt = resolve => require(['@/pages/invoicing/purchase-mgmt/purchase-return-apply/PurchaseReturnApplyMgmt'], resolve);
const PurchaseReturnOrderMgmt = resolve => require(['@/pages/invoicing/purchase-mgmt/purchase-return-order/PurchaseReturnOrderMgmt'], resolve);
const PurchaseStatistics = resolve => require(['@/pages/invoicing/purchase-mgmt/purchase-statistics/PurchaseStatistics'], resolve);
const PurchaseOrderMgmtNew = resolve => require(['@/pages/invoicing/purchase-mgmt/purchase-order/OrderMgmt'], resolve);
const routes = [
  // 采购管理导航
  {
    path: '',
    component: PurchaseMgmtNav
  },
  {
    path: 'purchase-apply',
    component: PurchaseApplyMgmt
  },
  {
    path: 'purchase-order-new',
    component: PurchaseOrderMgmtNew
  },
  {
    path: 'purchase-return-apply',
    component: PurchaseReturnApplyMgmt
  },
  {
    path: 'purchase-return-order',
    component: PurchaseReturnOrderMgmt
  },
  {
    path: 'purchase-statistics',
    component: PurchaseStatistics
  }
];

export default routes;
