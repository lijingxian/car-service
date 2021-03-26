// 所有组件都要异步加载

let MotoristsClubDynamic = resolve =>
  require(['@/pages/member/motorists-club-dynamic/MotoristsClubDynamic.vue'], resolve);

const enter = [
  {
    path: 'motor-club/dynamic',
    component: MotoristsClubDynamic
  }
];

export default enter;
