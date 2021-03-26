// 所有组件都要异步加载
const PurchaseAnalysis = resolve => require(['@/pages/invoicing/static-analysis/purchase/GeneralViewAnalysis'], resolve);
const SaleAnalysis = resolve => require(['@/pages/invoicing/static-analysis/sale/GeneralViewAnalysis'], resolve);
const StoreAnalysis = resolve => require(['@/pages/invoicing/static-analysis/store/GeneralViewAnalysis'], resolve);
const SingleAnalysis = resolve => require(['@/pages/invoicing/static-analysis/single/GeneralViewAnalysis'], resolve);
const FinanceAnalysis = resolve => require(['@/pages/invoicing/static-analysis/finance/GeneralViewAnalysis'], resolve);
const Report = resolve => require(['@/pages/invoicing/static-analysis/report/report'], resolve);
const Nav = resolve => require(['@/pages/invoicing/nav'], resolve);
const enter = [
  {
    path: 'statistics-analysis',
    component: Nav
  },
  // {
  //   path: 'statistics-analysis',
  //   redirect: 'statistics-analysis/purchase'
  // },
  {
    path: 'statistics-analysis/purchase',
    component: PurchaseAnalysis
  },
  {
    path: 'statistics-analysis/sale',
    component: SaleAnalysis
  },
  {
    path: 'statistics-analysis/store',
    component: StoreAnalysis
  },
  {
    path: 'statistics-analysis/single',
    component: SingleAnalysis
  },
  {
    path: 'statistics-analysis/report',
    component: Report
  },
  {
    path: 'statistics-analysis/finance',
    component: FinanceAnalysis
  }
];

export default enter;
