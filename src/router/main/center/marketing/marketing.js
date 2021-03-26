// 所有组件都要异步加载
let ServiceRecommend = resolve =>
  require([
    '@/pages/marketing/push-mgmt/service-recommend/ListPage.vue'
  ], resolve);
let WechatPublication = resolve =>
  require([
    '@/pages/marketing/push-mgmt/wechat-publication/WechatPublication.vue'
  ], resolve);
let WechatCreateNew = resolve =>
  require([
    '@/pages/marketing/push-mgmt/wechat-publication/WechatCreateNew.vue'
  ], resolve);

// 营销模板
let KeyWordTemplate = resolve =>
  require([
    '@/pages/marketing/marketing-template/key-word-template/KeyWordTemplate.vue'
  ], resolve);
const MarketingMgmtNav = resolve =>
  require(['@/pages/marketing/activity-mgmt/MarketingMgmtNav'], resolve);
let MaterialTemplate = resolve =>
  require([
    '@/pages/marketing/material-template/MaterialTemplate.vue'
  ], resolve);
const enter = [
  {
    path: 'recommend',
    component: MarketingMgmtNav
  },
  {
    path: 'recommend/vfu',
    redirect: 'recommend/vfu/service-recommend'
  },
  {
    path: 'recommend/headline',
    redirect: 'recommend/headline/head-line'
  },
  {
    path: 'recommend/baidu',
    redirect: 'recommend/baidu/baidu-info'
  },
  // 消息推送
  // ==============================
  // 微信推送: 先定义的优先级高
  {
    path: 'recommend/vfu/wechat/wechat',
    component: WechatPublication
  },

  // 新建微信发布
  {
    path: 'recommend/wechat-create',
    component: WechatCreateNew
  },
  {
    path: 'recommend/service-recommend',
    component: ServiceRecommend
  },
  // type表示推送管理类型
  {
    path: 'recommend/vfu/:type',
    component: ServiceRecommend
  },
  // 头条
  {
    path: 'recommend/headline/:type',
    component: ServiceRecommend
  },
  // 百度
  {
    path: 'recommend/baidu/:type',
    component: ServiceRecommend
  },
  // 关键词模板
  {
    path: 'template/marketing-template/key-word',
    component: KeyWordTemplate
  },
  // 素材模板
  {
    path: 'template/material-template',
    component: MaterialTemplate
  }
];

export default enter;
