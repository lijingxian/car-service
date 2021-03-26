// 所有组件都要异步加载
const BaseDataNav = resolve => require(['@/pages/invoicing/nav'], resolve);
// const BaseDataNav = resolve => require(['@/pages/invoicing/base-data/BaseDataNav'], resolve);
const CommodityMgmt = resolve => require(['@/pages/invoicing/base-data/product/CommodityMgmt'], resolve);
const StoreHouseMgmt = resolve => require(['@/pages/invoicing/base-data/store-house/StoreHouseMgmt'], resolve);
const SupplierMgmt = resolve => require(['@/pages/invoicing/base-data/supplier/SupplierMgmt'], resolve);
const SettlementAccountMgmt = resolve => require(['@/pages/invoicing/base-data/settlement-account/SettlementAccountMgmt'], resolve);
const InvoicingCategoryMgmt = resolve => require(['@/pages/invoicing/base-data/category/InvoicingCategoryMgmt'], resolve);
const SupplierAdminSetting = resolve => require(['@/pages/invoicing/base-data/supplier/adminSetting/AdminSetting'], resolve);
const AgentAdminSetting = resolve => require(['@/pages/invoicing/base-data/agent/adminSetting/AdminSetting'], resolve);
const AgentMgmt = resolve => require(['@/pages/invoicing/base-data/agent/AgentMgmt'], resolve);
const BrandSeriesMgmt = resolve =>
  require(['@/pages/invoicing/base-data/brand-series-mgmt/BrandSeriesMgmt'], resolve);

const routes = [
  // 基础数据导航
  {
    path: 'base-data',
    component: BaseDataNav
  },
  {
    path: 'base-data/product',
    component: CommodityMgmt
  },
  {
    path: 'base-data/store-house',
    component: StoreHouseMgmt
  },
  {
    path: 'base-data/supplier',
    component: SupplierMgmt
  },
  {
    path: 'base-data/agent',
    component: AgentMgmt
  },
  {
    path: 'base-data/supplier/admin-setting',
    component: SupplierAdminSetting
  },
  {
    path: 'base-data/agent/admin-setting',
    component: AgentAdminSetting
  },
  {
    path: 'base-data/settlement-account',
    component: SettlementAccountMgmt
  },
  {
    path: 'base-data/category',
    component: InvoicingCategoryMgmt
  },
  {
    path: 'base-data/brand',
    component: BrandSeriesMgmt
  }
];

export default routes;
