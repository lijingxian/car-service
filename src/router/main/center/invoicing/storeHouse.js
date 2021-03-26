// 所有组件都要异步加载
const StoreHouseMgmtNav = resolve => require(['@/pages/invoicing/nav'], resolve);
// const StoreHouseMgmtNav = resolve => require(['@/pages/invoicing/store-house-mgmt/StoreHouseMgmtNav'], resolve);
const DepotOutMgmt = resolve => require(['@/pages/invoicing/store-house-mgmt/depot-out-mgmt/DepotOutMgmt'], resolve);
const DepotInMgmt = resolve => require(['@/pages/invoicing/store-house-mgmt/depot-in-mgmt/DepotInMgmt'], resolve);
const Inventory = resolve => require(['@/pages/invoicing/store-house-mgmt/inventory/Inventory'], resolve);
const StockStatistics = resolve => require(['@/pages/invoicing/store-house-mgmt/stock-statistics/StockStatistics'], resolve);
const BarCodeMgmt = resolve => require(['@/pages/invoicing/store-house-mgmt/bar-code-mgmt/BarCodeMgmt'], resolve);
const AllottedMgmt = resolve => require(['@/pages/invoicing/store-house-mgmt/allotted-mgmt/AllottedMgmt'], resolve);
const routes = [
  // 仓库管理导航
  {
    path: 'store-house-mgmt',
    component: StoreHouseMgmtNav
  },
  {
    path: 'store-house-mgmt/depot-out-mgmt',
    component: DepotOutMgmt
  },
  {
    path: 'store-house-mgmt/depot-in-mgmt',
    component: DepotInMgmt
  },
  {
    path: 'store-house-mgmt/inventory',
    component: Inventory
  },
  {
    path: 'store-house-mgmt/stock-statistics',
    component: StockStatistics
  },
  {
    path: 'store-house-mgmt/bar-code-mgmt',
    component: BarCodeMgmt
  },
  {
    path: 'store-house-mgmt/allotted-mgmt',
    component: AllottedMgmt
  }
];

export default routes;
