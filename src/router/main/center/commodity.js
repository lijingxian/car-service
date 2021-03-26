// 所有组件都要异步加载
const ShopMgmtNav = resolve =>
  require(['@/pages/shop/ShopMgmtNav'], resolve);
const CommodityMgmt = resolve =>
  require(['@/pages/shop/commodity/commodity-mgmt/CommodityMgmt'], resolve);

const CategoryMgmt = resolve =>
  require(['@/pages/shop/commodity/category-mgmt/CategoryMgmt'], resolve);

const BrandSeriesMgmt = resolve =>
  require(['@/pages/shop/commodity/brand-series-mgmt/BrandSeriesMgmt'], resolve);

const VBeanHypermarketMgmt = resolve =>
  require(['@/pages/shop/commodity/v-bean-mgmt/VBeanHypermarketMgmt'], resolve);

const enter = [
  // 商品导航
  {
    path: 'commodity-mgmt',
    component: ShopMgmtNav
  },
  // 商品管理
  {
    path: 'commodity-mgmt/commodity',
    component: CommodityMgmt
  },
  // v豆商城管理
  {
    path: 'commodity-mgmt/vbean',
    component: VBeanHypermarketMgmt
  },
  // 品牌管理
  {
    path: 'commodity-mgmt/brand',
    component: BrandSeriesMgmt
  },
  // 商品分类
  {
    path: 'commodity-mgmt/category',
    component: CategoryMgmt
  }
];

export default enter;
