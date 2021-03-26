// 所有组件都要异步加载
const InsuranceCompanyMgmt = resolve =>
  require([
    '@/pages/system/insurance-company-mgmt/InsuranceCompanyMgmt'
  ], resolve);
const ServiceHandbook = resolve =>
  require(['@/pages/after-sale/service-project/ServiceHandbookSys'], resolve);
const enter = [
  // 基本设置
  {
    path: 'sale',
    redirect: 'sale/insurance-company'
  },
  // 保险公司
  {
    path: 'sale/insurance-company',
    component: InsuranceCompanyMgmt
  },
  // 服务手册
  {
    path: 'sale/booklet',
    component: ServiceHandbook
  }
];

export default enter;
