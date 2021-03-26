// 所有组件都要异步加载
// 注释部分为原内容营销,将要废弃
// const ArticleMgmt = resolve =>
//   require(['@/pages/content-mgmt/article-mgmt/ArticleMgmt'], resolve);
// const CategoryMgmt = resolve =>
//   require(['@/pages/content-mgmt/category-mgmt/CategoryMgmt'], resolve);
// const WechatPublication = resolve =>
//   require(['@/pages/content-mgmt/wechat-Publication/WechatPublication'], resolve);
// // 文章管理编辑
// const ArticleMgmtEdit = resolve =>
//   require(['@/pages/content-mgmt/article-mgmt/ArticleMgmtEdit'], resolve);

// 店铺宣传
const ShopPublicity = resolve =>
  require(['@/pages/marketing/content-mgmt/shop-publicity/ShopPublicity'], resolve);
// 商品推广
const ProductPromotion = resolve =>
  require(['@/pages/marketing/content-mgmt/product-promotion/ProductPromotion'], resolve);
// 文章编辑
// const ArticleEdit = resolve =>
//   require(['@/pages/marketing/content-mgmt/shop-publicity/ShopPublicityArticleEdit'], resolve);

const enter = [
  // 店铺推广
  {
    path: 'marketing-mgmt/shop-publicity',
    component: ShopPublicity
  },
  // 商品宣传
  {
    path: 'marketing-mgmt/product',
    component: ProductPromotion
  }
  // 文章编辑
  // {
  //   path: 'marketing-mgmt/article-edit',
  //   component: ArticleEdit
  // }
];

export default enter;
