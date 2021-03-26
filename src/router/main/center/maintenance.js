// 所有组件都要异步加载
// const NavPage = resolve =>
//   require(['@/pages/after-sale/MaintenanceNav'], resolve);
const NavPage = resolve =>
  require(['@/pages/after-sale/nav'], resolve);
const RecordsList = resolve =>
  require(['@/pages/after-sale/maintenance-records/RecordsList'], resolve);
const NotificationSettings = resolve =>
  require([
    '@/pages/after-sale/maintenance-records/NotificationSettings'
  ], resolve);
const OrderNav = resolve =>
  require(['@/pages/after-sale/nav'], resolve);
const OrderMgmt = resolve =>
  require(['@/pages/after-sale/order-mgmt/OrderMgmt'], resolve);

const ServiceProject = resolve =>
  require(['@/pages/after-sale/service-project/ServiceProject'], resolve);
const RescueOrg = resolve =>
  require(['@/pages/after-sale/service-project/RescueOrg'], resolve);
const ServiceHandbook = resolve =>
  require(['@/pages/after-sale/service-project/ServiceHandbook'], resolve);
const AddMotorcycleType = resolve =>
  require(['@/pages/after-sale/service-project/AddMotorcycleType'], resolve);
let OrderList = resolve =>
  require(['@/pages/order/OrderMgmtList.vue'], resolve);
let FinanceOrderList = resolve =>
  require(['@/pages/order/FinanceOrderMgmtList.vue'], resolve);
let InsuranceOrderList = resolve =>
  require(['@/pages/order/InsuranceOrderList.vue'], resolve);
let StoreValueMgmt = resolve =>
  require(['@/pages/order/finance-mgmt/store-value-mgmt/StoreValueMgmt.vue'], resolve);
let OrderSupplierMgmt = resolve => require(['@/pages/invoicing/order-supplier/OrderSupplierMgmt'], resolve);
const AnalysisNav = resolve =>
  require(['@/pages/after-sale/nav'], resolve);
const AfterViewAnalysis = resolve =>
  require(['@/pages/after-sale/static-analysis/GeneralViewAnalysis'], resolve);
const Report = resolve =>
  require(['@/pages/after-sale/static-analysis/report/Report'], resolve);
const enter = [
  // // 导航页
  // {
  //   path: '',
  //   redirect: 'maintenance/nav'
  // },
  {
    path: '',
    component: NavPage
  },
  // 维保记录
  {
    path: 'maintenance',
    component: RecordsList
  },
  // 提醒设置(废弃)
  {
    path: '/maintenance/notification-settings',
    component: NotificationSettings
  },
  // 预约管理
  {
    path: 'appointment',
    component: OrderMgmt
  },
  // 服务项目
  {
    path: 'service',
    component: ServiceProject
  },
  // 合作救援机构
  {
    path: 'service/rescue',
    component: RescueOrg
  },
  // 服务手册
  {
    path: 'booklet',
    component: ServiceHandbook
  },
  // 添加车型
  {
    path: 'add-motorcycle-type',
    component: AddMotorcycleType
  },
  // 统计分析
  {
    path: 'statistics-analysis',
    component: AnalysisNav
  },
  {
    path: 'statistics-analysis',
    redirect: 'statistics-analysis/aftersale'
  },
  // 统计分析
  {
    path: 'statistics-analysis/aftersale',
    component: AfterViewAnalysis
  },
  // 售后月报
  {
    path: 'statistics-analysis/report',
    component: Report
  },
  // 订单列表
  {
    path: 'product',
    component: OrderNav
  },
  {
    path: 'product',
    redirect: 'product/product'
  },
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
  }
];

export default enter;
