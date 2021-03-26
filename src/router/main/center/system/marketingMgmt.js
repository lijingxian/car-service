const PlatformCategoryMgmt = resolve =>
  require(['@/pages/system/category-mgmt/PlatformCategoryMgmt'], resolve);
const ProductMgmt = resolve =>
  require(['@/pages/system/product-mgmt/ProductMgmt'], resolve);
const BrandSeriesMgmt = resolve =>
  require(['@/pages/system/brand-series-mgmt/BrandSeriesMgmt'], resolve);
const PushAuditSetting = resolve =>
  require(['@/pages/system/push-audit-setting/PushAuditSetting'], resolve);
const enter = [
  // 基本设置
  {
    path: 'operating',
    redirect: 'operating/category'
  },
  // 分类库
  {
    path: 'operating/category',
    component: PlatformCategoryMgmt
  },
  // 产品库
  {
    path: 'operating/product',
    component: ProductMgmt
  },
  // 品牌管理
  {
    path: 'operating/brand-mgmt',
    component: BrandSeriesMgmt
  },
  // 推荐审核设置
  {
    path: 'operating/push-audit-setting',
    component: PushAuditSetting
  }
];

export default enter;
