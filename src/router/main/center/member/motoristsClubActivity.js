// 所有组件都要异步加载
let MotoristsClubActivity = resolve =>
  require([
    '@/pages/member/motorists-club-activity/MotoristsClubActivity.vue'
  ], resolve);

const enter = [
  {
    path: 'motor-club/activity',
    component: MotoristsClubActivity
  }
];

export default enter;
