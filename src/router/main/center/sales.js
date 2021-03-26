// 所有组件都要异步加载
let SalesNav = resolve => require(['@/pages/sales/nav.vue'], resolve);
// let SalesNav = resolve => require(['@/pages/sales/SalesNav.vue'], resolve);
let PotentialCustomerMgmt = resolve =>
  require([
    '@/pages/sales/potential-customer-mgmt/PotentialCustomerMgmt.vue'
  ], resolve);
let FinacialProgramMgmt = resolve =>
  require([
    '@/pages/sales/financial-program-mgmt/FinacialProgramMgmt.vue'
  ], resolve);
let TestDriveMgmt = resolve =>
  require(['@/pages/sales/test-drive-mgmt/TestDriveMgmt.vue'], resolve);
let TestDriveHistory = resolve =>
  require(['@/pages/sales/test-drive-mgmt/TestDriveMgmt/TestDriveHistory.vue'], resolve);
let FinancialCompanyNav = resolve =>
  require(['@/pages/sales/nav.vue'], resolve);
let FinancialProductNav = resolve =>
  require(['@/pages/sales/nav.vue'], resolve);
// let FinancialCompanyNav = resolve =>
//   require(['@/pages/sales/financial-company-mgmt/FinancialCompanyNav.vue'], resolve);
// let FinancialProductNav = resolve =>
//   require(['@/pages/sales/financial-product-mgmt/FinancialProductNav.vue'], resolve);
let FinancialCompanyMgmt = resolve =>
  require(['@/pages/sales/financial-company-mgmt/financial-company/FinancialCompanyMgmt.vue'], resolve);
let FinancialProductCategory = resolve =>
  require(['@/pages/sales/financial-product-mgmt/financial-product/category-mgmt/CategoryMgmt.vue'], resolve);
let FinancialProductFinancial = resolve =>
  require(['@/pages/sales/financial-product-mgmt/financial-product/financial-mgmt/FinancialMgmt.vue'], resolve);
let FinancialProductInsurance = resolve =>
  require(['@/pages/sales/financial-product-mgmt/financial-product/insurance-mgmt/InsuranceMgmt.vue'], resolve);
let FinanceOrderList = resolve =>
  require(['@/pages/order/FinanceOrderMgmtList.vue'], resolve);
let InsuranceOrderList = resolve =>
  require(['@/pages/order/InsuranceOrderList.vue'], resolve);
let FinancialSysProductNav = resolve =>
  require(['@/pages/sales/nav.vue'], resolve);
// let FinancialSysProductNav = resolve =>
//   require(['@/pages/sales/financial-product-sys-mgmt/FinancialProductNav.vue'], resolve);
let FinancialProductCategorySys = resolve =>
  require(['@/pages/sales/financial-product-sys-mgmt/financial-product/category-mgmt/CategoryMgmt.vue'], resolve);
let FinancialProductFinancialSys = resolve =>
  require(['@/pages/sales/financial-product-sys-mgmt/financial-product/financial-mgmt/FinancialMgmt.vue'], resolve);
let FinancialProductInsuranceSys = resolve =>
  require(['@/pages/sales/financial-product-sys-mgmt/financial-product/insurance-mgmt/InsuranceMgmt.vue'], resolve);
let OrderList = resolve =>
  require(['@/pages/order/OrderMgmtList.vue'], resolve);
// let FinanceOrderList = resolve =>
//   require(['@/pages/order/FinanceOrderMgmtList.vue'], resolve);
let StoreValueMgmt = resolve =>
  require(['@/pages/order/finance-mgmt/store-value-mgmt/StoreValueMgmt.vue'], resolve);
let OrderSupplierMgmt = resolve => require(['@/pages/invoicing/order-supplier/OrderSupplierMgmt'], resolve);
// 潜客统计
let StatisticsNav = resolve =>
  require(['@/pages/sales/nav.vue'], resolve);
let GeneralViewAnalysis = resolve =>
  require([
    '@/pages/sales/statistics-analysis-new/potential/GeneralViewAnalysis.vue'
  ], resolve);
// 销售统计
let GeneralViewAnalysisSale = resolve =>
  require([
    '@/pages/sales/statistics-analysis-new/sale/GeneralViewAnalysis.vue'
  ], resolve);
// 销售月报
let SaleReport = resolve =>
  require([
    '@/pages/sales/statistics-analysis-new/report/SaleReport.vue'
  ], resolve);
// 潜客月报
let PotentialReport = resolve =>
  require([
    '@/pages/sales/statistics-analysis-new/report/PotentialReport.vue'
  ], resolve);
let OrderNav = resolve =>
  require(['@/pages/sales/nav.vue'], resolve);
const enter = [
  // 潜客导航
  {
    path: '',
    component: SalesNav
  },
  // 金融方案
  {
    path: 'finance/plan',
    component: FinacialProgramMgmt
  },
  // 潜客管理
  {
    path: 'potential',
    component: PotentialCustomerMgmt
  },
  {
    path: 'potential/potential',
    component: PotentialCustomerMgmt
  },
  // 试驾管理
  {
    path: 'testDrive',
    redirect: 'testDrive/testDrive'
  },
  {
    path: 'testDrive/testDrive',
    component: TestDriveMgmt
  },
  // {
  //   path: 'statistics-analysis',
  //   redirect: 'statistics-analysis/general'
  // },
  // 试驾轨迹
  {
    path: 'testDrive/testDriveHistory/:trackId',
    component: TestDriveHistory
  },
  // 潜客统计分析
  {
    path: 'statistics-analysis',
    component: StatisticsNav
  },
  // 概览分析
  {
    path: 'statistics-analysis/general',
    component: GeneralViewAnalysis
  },
  // 销售分析
  {
    path: 'statistics-analysis/sale',
    component: GeneralViewAnalysisSale
  },
  // 销售月报
  {
    path: 'statistics-analysis/saleReport',
    component: SaleReport
  },
  // 潜客月报
  {
    path: 'statistics-analysis/potentialReport',
    component: PotentialReport
  },
  // 金融管理导航
  {
    path: 'financeMgmt',
    component: FinancialCompanyNav
  },
  // 金融管理
  // {
  //   path: 'financeMgmt',
  //   redirect: 'financeMgmt/company/mgmt'
  // },
  // 金融机构
  {
    path: 'financeMgmt/company/mgmt',
    component: FinancialCompanyMgmt
  },
  // 金融产品导航
  {
    path: 'financeProduct',
    component: FinancialProductNav
  },
  // 金融产品
  // {
  //   path: 'financeProduct',
  //   redirect: 'financeProduct/category'
  // },
  // 金融产品导航
  {
    path: 'financeSysProduct',
    component: FinancialSysProductNav
  },
  // 产品分类（店铺级）
  {
    path: 'financeProduct/category',
    component: FinancialProductCategory
  },
  // 金融方案（店铺级）
  {
    path: 'financeProduct/finance',
    component: FinancialProductFinancial
  },
  // 保险方案（店铺级）
  {
    path: 'financeProduct/insurance',
    component: FinancialProductInsurance
  },

  // 产品分类（平台级）
  {
    path: 'financeSysProduct/category/sys',
    component: FinancialProductCategorySys
  },
  // 金融方案（平台级）
  {
    path: 'financeSysProduct/finance/sys',
    component: FinancialProductFinancialSys
  },
  // 保险方案（平台级）
  {
    path: 'financeSysProduct/insurance/sys',
    component: FinancialProductInsuranceSys
  },
  {
    path: 'product',
    component: OrderNav
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
  }
];

export default enter;
