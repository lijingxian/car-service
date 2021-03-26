// 所有组件都要异步加载
const ProcessSetting = resolve => require(['@/pages/invoicing/nav'], resolve);
const SaleSetting = resolve => require(['@/pages/invoicing/setting/process-setting-new/SaleSetting'], resolve);
const PurchaseSetting = resolve => require(['@/pages/invoicing/setting/process-setting-new/PurchaseSetting'], resolve);
const ShippingSetting = resolve => require(['@/pages/invoicing/setting/process-setting-new/ShippingSetting'], resolve);
const enter = [
  {
    path: 'process-setting',
    component: ProcessSetting
  },
  // {
  //   path: 'process-setting',
  //   redirect: 'process-setting/sale-setting'
  // },
  {
    path: 'process-setting/sale-setting',
    component: SaleSetting
  },
  {
    path: 'process-setting/purchase-setting',
    component: PurchaseSetting
  },
  {
    path: 'process-setting/shipping-setting',
    component: ShippingSetting
  }
];

export default enter;
