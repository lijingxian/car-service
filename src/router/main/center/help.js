// 所有组件都要异步加载
let HelpCenter = resolve =>
  require([
    '@/pages/admin/help/HelpCenter.vue'
  ], resolve);

const enter = [
  {
    path: '',
    component: HelpCenter
  }
];

export default enter;
