// 所有组件都要异步加载
const MerchantsMgmt = resolve => require(['@/pages/operating/merchants-mgmt/MerchantsMgmt'], resolve);
const MerchantsMgmtNav = resolve => require(['@/pages/operating/merchants-mgmt/MerchantsMgmtNav'], resolve);
// const ApplyFor = resolve => require(['@/pages/operating/merchants-mgmt/ApplyFor'], resolve);
// const MerchantsMgmtQua = resolve => require(['@/pages/operating/merchants-mgmt/MerchantsMgmtQua'], resolve);
const enter = [
  // 招商申请管理
  {
    path: 'merchants-mgmt',
    component: MerchantsMgmtNav
  },
  {
    path: 'merchants-mgmt/investment',
    component: MerchantsMgmt
  }
  // // 招商申请基础信息页面
  // {
  //   path: '/apply-for',
  //   redirect: 'merchants-mgmt/apply-for',
  //   component: ApplyFor
  // },
  // {
  //   path: 'merchants-mgmt/apply-for',
  //   component: ApplyFor
  // },
  // // 招商申请个人、企业资质填写页面
  // {
  //   path: '/merchants-mgmt-qua',
  //   redirect: 'merchants-mgmt/qua',
  //   component: MerchantsMgmtQua
  // },
  // {
  //   path: 'merchants-mgmt/qua',
  //   component: MerchantsMgmtQua
  // }
];

export default enter;
