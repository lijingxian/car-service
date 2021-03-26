// 所有组件都要异步加载
const MapTest = resolve =>
  require(['@/pages/list-car-map/listCarMap.vue'], resolve);

const FenceMap = resolve =>
  require(['@/pages/list-car-map/fenceMap.vue'], resolve);
const enter = [
  {
    path: '/map-test',
    component: MapTest
  },
  {
    path: '/fence-map',
    component: FenceMap
  }
];

export default enter;
