// 所有组件都要异步加载
let CreditEvaluationSystemNav = resolve =>
  require(['@/pages/shop/shop-rate/credit-evaluation-system-mgmt/CreditEvaluationSystemNav.vue'], resolve);
let TagClassMgmt = resolve => require(['@/pages/shop/shop-rate/tag-bank-mgmt/TagClassMgmt.vue'], resolve);
let TagGroupMgmt = resolve => require(['@/pages/shop/shop-rate/tag-bank-mgmt/TagGroupMgmt.vue'], resolve);

const enter = [
  {
    path: 'product-settings',
    redirect: 'product-settings/nav'
  },
  // 导航
  {
    path: 'product-settings/nav',
    component: CreditEvaluationSystemNav
  },
  // 标签库分类管理
  {
    path: 'product-settings/tag',
    component: TagClassMgmt
  },
  // 标签分组管理
  {
    name: 'tag-group-mgmt',
    path: 'product-settings/tag/:classId',
    component: TagGroupMgmt
  }
];

export default enter;
