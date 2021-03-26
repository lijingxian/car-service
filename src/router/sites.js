// 所有组件都要异步加载
const SiteIndex = resolve => require(['@/pages/sites/SiteIndex'], resolve);
const SiteSinglePage = resolve => require(['@/pages/sites/SiteSinglePage'], resolve);

const enter = [
  // 开发用功能定义页面
  {
    path: '/site/index',
    component: SiteIndex
  },
  {
    path: '/site/single-page',
    component: SiteSinglePage
  }
];

export default enter;
