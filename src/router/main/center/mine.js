// 所有组件都要异步加载
let MineBaseInfo = resolve =>
  require([
    '@/pages/admin/base-info/MineBaseInfo.vue'
  ], resolve);
let MineChangePassword = resolve =>
  require([
    '@/pages/admin/change-password/MineChangePassword.vue'
  ], resolve);

const enter = [
  // 基本信息
  {
    path: '',
    component: MineBaseInfo
  },
  // 基本信息
  {
    path: 'profile',
    component: MineBaseInfo
  },
  // 修改密码
  {
    path: 'change-password',
    component: MineChangePassword
  }
];

export default enter;
