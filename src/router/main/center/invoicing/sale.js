// 所有组件都要异步加载
const OrderMgmt = resolve => require(['@/pages/invoicing/sale-mgmt/sale-order/SaleMgmt'], resolve);
const ApplyMgmt = resolve => require(['@/pages/invoicing/sale-mgmt/sale-apply/SaleApplyMgmt'], resolve);
const StaticMgmt = resolve => require(['@/pages/invoicing/sale-mgmt/sale-static/SaleStatistics'], resolve);
const SaleMgmtNav = resolve => require(['@/pages/invoicing/nav'], resolve);
// const SaleMgmtNav = resolve => require(['@/pages/invoicing/sale-mgmt/SaleMgmtNav'], resolve);
const AgencyOrderMgmt = resolve => require(['@/pages/invoicing/sale-mgmt/sale-order-agency/SaleMgmt'], resolve);
const AgencyStaticMgmt = resolve => require(['@/pages/invoicing/sale-mgmt/sale-static-agency/SaleStatistics'], resolve);
const OrderAgentMgmtNav = resolve => require(['@/pages/invoicing/nav'], resolve);
// const OrderAgentMgmtNav = resolve => require(['@/pages/invoicing/sale-mgmt/sale-order-agency/OrderAgentMgmtNav'], resolve);
const routes = [
  {
    path: 'sale',
    component: SaleMgmtNav
  },
  {
    path: 'sale/sale-order',
    component: OrderMgmt
  },
  {
    path: 'sale/sale-apply',
    component: ApplyMgmt
  },
  {
    path: 'sale/sale-static',
    component: StaticMgmt
  },
  {
    path: 'sale-agent',
    component: OrderAgentMgmtNav
  },
  {
    path: 'sale-agent/agency-sale-order',
    component: AgencyOrderMgmt
  },
  {
    path: 'sale-agent/static-agency',
    component: AgencyStaticMgmt
  }
];

export default routes;
