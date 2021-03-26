// 所有组件都要异步加载
const ApproveSettingMgmt = resolve => require(['@/pages/invoicing/setting/approve-setting/ApproveSettingMgmt'], resolve);

const routes = [
  {
    path: 'setting',
    redirect: 'setting/approve-setting'
  },
  {
    path: 'setting/approve-setting',
    component: ApproveSettingMgmt
  }
];

export default routes;
