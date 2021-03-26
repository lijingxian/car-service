// 所有组件都要异步加载
let MoveCodeMgmt = resolve =>
  require([
    '@/pages/operating/move-code/MoveCodeMgmt.vue'
  ], resolve);

const enter = [
  // 列表
  {
    path: 'move-code',
    component: MoveCodeMgmt
  }
];

export default enter;
