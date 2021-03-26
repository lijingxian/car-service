// 所有组件都要异步加载
const OrderMgmt = resolve => require(['@/pages/invoicing/agency-purchase-order/OrderMgmt'], resolve);
const applyMgmt = resolve => require(['@/pages/invoicing/agency-purchase-apply-new/PurchaseApplyMgmt'], resolve);
const staticMgmt = resolve => require(['@/pages/invoicing/agency-purchase-static/PurchaseStatistics'], resolve);
const NavMgmt = resolve => require(['@/pages/invoicing/nav'], resolve);
const routes = [
  {
    path: '',
    component: NavMgmt
  },
  {
    path: 'agency/agency-purchase-order',
    component: OrderMgmt
  },
  {
    path: 'agency/agency-purchase-apply',
    component: applyMgmt
  },
  {
    path: 'agency/agency-purchase-static',
    component: staticMgmt
  }
];

export default routes;
