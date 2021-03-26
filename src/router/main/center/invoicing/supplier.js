// 所有组件都要异步加载
const OrderSupplierMgmt = resolve => require(['@/pages/invoicing/order-supplier/OrderSupplierMgmt'], resolve);
const StaticSupplierMgmt = resolve => require(['@/pages/invoicing/static-supplier/SaleStatistics'], resolve);
const CommodityMgmt = resolve => require(['@/pages/invoicing/product-supplier/CommodityMgmt'], resolve);
const OrderSupplierMgmtNav = resolve => require(['@/pages/invoicing/nav'], resolve);
const ProductSupplierMgmtNav = resolve => require(['@/pages/invoicing/nav'], resolve);
const routes = [
  {
    path: '',
    component: OrderSupplierMgmtNav
  },
  {
    path: 'supplier/product',
    component: ProductSupplierMgmtNav
  },
  {
    path: 'supplier/order-supplier',
    component: OrderSupplierMgmt
  },
  {
    path: 'supplier/static-supplier',
    component: StaticSupplierMgmt
  },
  {
    path: 'supplier/product/product-supplier',
    component: CommodityMgmt
  }
];

export default routes;
