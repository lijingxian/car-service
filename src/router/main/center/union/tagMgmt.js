// 所有组件都要异步加载
// 导航页面
const TagMgmt = resolve =>
  require(['@/pages/system/tag/tagMgmt/TagMgmt.vue'], resolve);

const TagClassMgmt = resolve =>
  require(['@/pages/system/tag/classMgmt/ClassMgmt.vue'], resolve);
let FederationMgmtNav = resolve =>
  require(['@/pages/operating/federation-mgmt/FederationMgmtNav.vue'], resolve);
const enter = [
  {
    path: 'system/tag',
    component: FederationMgmtNav
  },
  {
    path: 'system/tag/tagMgmt',
    component: TagMgmt
  },
  {
    path: 'shop/tag',
    component: FederationMgmtNav
  },
  {
    path: 'shop/tag/tagMgmt',
    component: TagMgmt
  },
  // 标签库分类管理
  {
    path: 'system/tag/tagClass',
    component: TagClassMgmt
  },
  // 标签库分类管理
  {
    path: 'shop/tag/tagClass',
    component: TagClassMgmt
  }
];

export default enter;
