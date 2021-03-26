// 所有组件都要异步加载
const PlatformAccountMgmt = resolve =>
  require(['@/pages/system/platform-account-mgmt/PlatformAccountMgmt'], resolve);

const ShippingMethodMgmt = resolve =>
  require(['@/pages/system/shipping-method-mgmt/ShippingMethodMgmt'], resolve);
const PaymentMethodMgmt = resolve =>
  require(['@/pages/system/payment-method-mgmt/PaymentMethodMgmt'], resolve);
const LogisticsMgmt = resolve =>
  require(['@/pages/order/logistics-mgmt/logistics-mgmt/LogisticsMgmt.vue'], resolve);
const WechatUrlMgmt = resolve =>
  require([
    '@/pages/system/wechat-official-account-mgmt/WechatUrlMgmt'
  ], resolve);
const IconTemplate = resolve =>
  require(['@/pages/system/icon-template/IconTemplate'], resolve);
const MiniProgram = resolve =>
  require(['@/pages/system/mini-program/MiniProgramMgmt'], resolve);
const enter = [
  // 基本设置
  {
    path: 'product',
    redirect: 'product/platform-account'
  },
  // 店铺账户(平台)
  {
    path: 'product/platform-account',
    component: PlatformAccountMgmt
  },
  // 支付方式
  {
    path: 'product/payment-method',
    component: PaymentMethodMgmt
  },
  // 配送方式
  {
    path: 'product/shipping-method',
    component: ShippingMethodMgmt
  },
  // 物流管理-platform
  {
    path: 'product/delivery',
    component: LogisticsMgmt
  },
  // 微信链接设置
  {
    path: 'product/wechat-url',
    component: WechatUrlMgmt
  },
  // 承诺图标模版
  {
    path: 'product/icon-template',
    component: IconTemplate
  },
  // 小程序设置
  {
    path: 'product/mini-program',
    component: MiniProgram
  }

];

export default enter;
