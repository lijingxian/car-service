// 所有组件都要异步加载
const BrandSeriesMgmt = resolve =>
  require(['@/pages/system/brand-series-mgmt/BrandSeriesMgmt'], resolve);

const PlatformCategoryMgmt = resolve =>
  require(['@/pages/system/category-mgmt/PlatformCategoryMgmt'], resolve);

const AreaMgmt = resolve =>
  require(['@/pages/system/area-mgmt/AreaMgmt'], resolve);

const SystemSettingMgmt = resolve =>
  require(['@/pages/system/system-setting-mgmt/BasicSetting'], resolve);

const DisplaySettingMgmt = resolve =>
  require(['@/pages/system/system-setting-mgmt/DisplaySetting'], resolve);

const RegistrationAndSecuritySettingMgmt = resolve =>
  require([
    '@/pages/system/system-setting-mgmt/RegistrationAndSecuritySetting'
  ], resolve);

const EmailSettingMgmt = resolve =>
  require(['@/pages/system/system-setting-mgmt/EmailSetting'], resolve);

const RecommendMgmt = resolve =>
  require(['@/pages/system/recommend-mgmt/RecommendMgmt'], resolve);

const ProductMgmt = resolve =>
  require(['@/pages/system/product-mgmt/ProductMgmt'], resolve);

const ShippingMethodMgmt = resolve =>
  require(['@/pages/system/shipping-method-mgmt/ShippingMethodMgmt'], resolve);

const PaymentMethodMgmt = resolve =>
  require(['@/pages/system/payment-method-mgmt/PaymentMethodMgmt'], resolve);

const InsuranceCompanyMgmt = resolve =>
  require([
    '@/pages/system/insurance-company-mgmt/InsuranceCompanyMgmt'
  ], resolve);

const OilPriceMgmt = resolve =>
  require(['@/pages/system/oil-price-mgmt/OilPriceMgmt'], resolve);

const StoragePluginMgmt = resolve =>
  require(['@/pages/system/storage-plugin-mgmt/StoragePluginMgmt'], resolve);

const WechatOfficialAccountMgmt = resolve =>
  require([
    '@/pages/system/wechat-official-account-mgmt/WechatOfficialAccountMgmt'
  ], resolve);
const WechatUrlMgmt = resolve =>
  require([
    '@/pages/system/wechat-official-account-mgmt/WechatUrlMgmt'
  ], resolve);
const WechatListMgmt = resolve =>
  require([
    '@/pages/system/wechat-official-account-mgmt/WechatListMgmt'
  ], resolve);
const ScreenProjection = resolve =>
  require([
    '@/pages/system/screen-mgmt/ScreenMgmt'
  ], resolve);
const CarFaultCode = resolve =>
  require(['@/pages/system/car-fault-code-mgmt/CarFaultCodeMgmt'], resolve);

const IconTemplate = resolve =>
  require(['@/pages/system/icon-template/IconTemplate'], resolve);

const LogMgmt = resolve =>
  require(['@/pages/system/log-mgmt/systemLog/LogMgmt'], resolve);

const OnlineUserMgmt = resolve =>
  require(['@/pages/system/online-user-mgmt/OnlineUserMgmt'], resolve);

const UserLoginLogMgmt = resolve =>
  require(['@/pages/system/user-login-log-mgmt/UserLoginLogMgmt'], resolve);

const InterfaceLog = resolve =>
  require(['@/pages/system/log-mgmt/interfaceLog/InterfaceLog'], resolve);

const AdminOperateLog = resolve =>
  require(['@/pages/system/log-mgmt/adminOperateLog/AdminOperateLog'], resolve);

const UserOperateLog = resolve =>
  require(['@/pages/system/log-mgmt/userOperateLog/UserOperateLog'], resolve);

const TerminalLog = resolve =>
  require(['@/pages/system/log-mgmt/terminalLog/TerminalLog'], resolve);

const BaseDataMgmt = resolve =>
  require(['@/pages/system/base-data-mgmt/BaseDataMgmt'], resolve);

// const TagClassMgmt = resolve =>
//   require(['@/pages/shop/shop-rate/tag-bank-mgmt/TagClassMgmt.vue'], resolve);
const TagMgmt = resolve =>
  require(['@/pages/system/tag/tagMgmt/TagMgmt.vue'], resolve);

const TagClassMgmt = resolve =>
  require(['@/pages/system/tag/classMgmt/ClassMgmt.vue'], resolve);

const QAMgmt = resolve =>
  require(['@/pages/service/smart-reception/QaMgmt'], resolve);

const UnknowProblem = resolve =>
  require(['@/pages/service/smart-reception/UnknowProblem'], resolve);

const FunctionDefination = resolve =>
  require([
    '@/pages/system/system-setting-mgmt/function-defination/FunctionDefination.vue'
  ], resolve);

const ServiceHandbook = resolve =>
  require(['@/pages/after-sale/service-project/ServiceHandbookSys'], resolve);

const ApproveSettingMgmt = resolve => require(['@/pages/invoicing/setting/approve-setting/ApproveSettingMgmt'], resolve);
const ProcessSettingPurchase = resolve => require(['@/pages/invoicing/setting/process-setting/ProcessSettingPurchase'], resolve);
const SaleSetting = resolve => require(['@/pages/invoicing/setting/process-setting-new/SaleSetting'], resolve);
const PurchaseSetting = resolve => require(['@/pages/invoicing/setting/process-setting-new/PurchaseSetting'], resolve);
const ShippingSetting = resolve => require(['@/pages/invoicing/setting/process-setting-new/ShippingSetting'], resolve);
let AbilityRatingMgmt = resolve =>
  require(['@/pages/shop/shop-rate/credit-evaluation-system-mgmt/AbilityRatingMgmt.vue'], resolve);
let PromiseMgmt = resolve => require(['@/pages/shop/shop-rate/credit-evaluation-system-mgmt/PromiseMgmt.vue'], resolve);
let RecommendSystemMgmt = resolve =>
  require(['@/pages/shop/shop-rate/credit-evaluation-system-mgmt/RecommendSystemMgmt.vue'], resolve);
let DistributorMgmt = resolve => require(['@/pages/shop/shop-rate/distributor-setting/DistributorMgmt.vue'], resolve);
let ShopProfileSetting = resolve =>
  require([
    '@/pages/marketing/content-mgmt/shop-publicity/ShopProfileSetting.vue'
  ], resolve);
const ShopAccountMgmt = resolve =>
  require(['@/pages/system/shop-account-mgmt/ShopAccountMgmt'], resolve);
const PlatformAccountMgmt = resolve =>
  require(['@/pages/system/platform-account-mgmt/PlatformAccountMgmt'], resolve);
const PushAuditSetting = resolve =>
  require(['@/pages/system/push-audit-setting/PushAuditSetting'], resolve);
const LogisticsMgmt = resolve =>
  require(['@/pages/order/logistics-mgmt/logistics-mgmt/LogisticsMgmt.vue'], resolve);
const LogisticsMgmtShop = resolve =>
  require(['@/pages/order/logistics-mgmt/logistics-mgmt-shop/LogisticsMgmt.vue'], resolve);
const enter = [
  {
    path: 'setting',
    component: SystemSettingMgmt
  },
  {
    path: '/system/tag',
    redirect: '/system/tag/tagClass'
  },
  {
    path: '/system/tag/tagMgmt',
    component: TagMgmt
  },
  {
    path: '/shop/tag',
    redirect: '/shop/tag/tagClass'
  },
  {
    path: '/shop/tag/tagMgmt',
    component: TagMgmt
  },
  {
    path: 'product',
    redirect: 'product/category'
  },
  {
    path: 'service',
    redirect: 'service/knowledge/qa-mgmt'
  },
  {
    path: 'log',
    redirect: 'log/log-mgmt'
  },
  // 基本设置
  {
    path: 'setting/setting-mgmt',
    component: SystemSettingMgmt
  },
  // 显示设置
  {
    path: 'setting/display-mgmt',
    component: DisplaySettingMgmt
  },
  // 注册与安全
  {
    path: 'setting/registrationAndSecurity-mgmt',
    component: RegistrationAndSecuritySettingMgmt
  },
  // 邮件设置
  {
    path: 'setting/email-mgmt',
    component: EmailSettingMgmt
  },
  // 邮件设置
  {
    path: 'setting/recommend-mgmt',
    component: RecommendMgmt
  },
  // 地区管理
  {
    path: 'setting/area-mgmt',
    component: AreaMgmt
  },
  // 存储插件
  {
    path: 'setting/storage-plugin',
    component: StoragePluginMgmt
  },
  // 功能定制
  {
    path: 'setting/function-defination',
    component: FunctionDefination
  },
  // 店铺账户
  {
    path: 'setting/shop-account',
    component: ShopAccountMgmt
  },
  // 店铺账户(平台)
  {
    path: 'setting/platform-account',
    component: PlatformAccountMgmt
  },
  // 品牌管理
  {
    path: 'product/brand-mgmt',
    component: BrandSeriesMgmt
  },
  // 分类库
  {
    path: 'product/category',
    component: PlatformCategoryMgmt
  },
  // 产品库
  {
    path: 'product/product',
    component: ProductMgmt
  },
  // 基础数据
  {
    path: 'product/base-data',
    component: BaseDataMgmt
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
  // 物流管理-shop
  {
    path: 'product/delivery_shop',
    component: LogisticsMgmtShop
  },
  // 物流管理-platform
  {
    path: 'product/delivery',
    component: LogisticsMgmt
  },
  // 油价表
  {
    path: 'service/oil-price',
    component: OilPriceMgmt
  },
  // 保险公司
  {
    path: 'service/insurance-company',
    component: InsuranceCompanyMgmt
  },
  // 车辆故障码
  {
    path: 'service/carFault-code',
    component: CarFaultCode
  },
  // 服务手册
  {
    path: 'service/booklet',
    component: ServiceHandbook
  },
  // 微信端口设置
  {
    path: 'operating/wechat',
    component: WechatOfficialAccountMgmt
  },
  // 微信端口设置
  {
    path: 'operating/wechatList',
    component: WechatListMgmt
  },
  // 微信链接设置
  {
    path: 'operating/wechat-url',
    component: WechatUrlMgmt
  },
  // 电视投屏
  {
    path: 'operating/screen-projection',
    component: ScreenProjection
  },
  // 承诺图标模版
  {
    path: 'operating/icon-template',
    component: IconTemplate
  },
  // 标签库分类管理
  {
    path: '/system/tag/tagClass',
    component: TagClassMgmt
  },
  // 标签库分类管理
  {
    path: '/shop/tag/tagClass',
    component: TagClassMgmt
  },
  // // 标签分组管理
  // {
  //   path: 'operating/tag/tagClass/:classId',
  //   component: TagGroupMgmt
  // },
  // 日志管理
  {
    path: 'log/log-mgmt',
    component: LogMgmt
  },
  // 接口日志
  {
    path: 'log/interface',
    component: InterfaceLog
  },
  // 用户操作日志
  {
    path: 'log/user-operat-log',
    component: UserOperateLog
  },
  // 管理员操作管理
  {
    path: 'log/admin-operate-log',
    component: AdminOperateLog
  },
  // 日志管理
  {
    path: 'log/terminal-log',
    component: TerminalLog
  },
  // 今日登录用户
  {
    path: 'online-user',
    component: OnlineUserMgmt
  },
  // 用户登录日志
  {
    path: 'login-log',
    component: UserLoginLogMgmt
  },
  // 知识库
  {
    path: 'service/knowledge',
    redirect: 'service/knowledge/qa-mgmt'
  },
  // 问答管理
  {
    path: 'service/knowledge/qa-mgmt',
    component: QAMgmt
  },
  // 未知问题
  {
    path: 'service/knowledge/unknow-problem',
    component: UnknowProblem
  },
  {
    path: 'product/approve-setting',
    component: ApproveSettingMgmt
  },
  {
    path: 'product/process-setting',
    redirect: 'product/process-setting/sale-setting'
  },
  {
    path: 'product/process-setting/sale',
    component: SaleSetting
  },
  {
    path: 'product/process-setting/purchase',
    component: ProcessSettingPurchase
  },
  {
    path: 'product/process-setting/sale-setting',
    component: SaleSetting
  },
  {
    path: 'product/process-setting/purchase-setting',
    component: PurchaseSetting
  },
  {
    path: 'product/process-setting/shipping-setting',
    component: ShippingSetting
  },
  {
    path: 'operating/product-settings/shop-profile-setting',
    component: ShopProfileSetting
  },
  {
    path: 'operating/product-settings/shop-rate',
    redirect: 'operating/product-settings/shop-rate/ability'
  },
  // 联盟-能力评价体系设置
  {
    name: 'ability-rating-system-mgmt',
    path: 'operating/product-settings/shop-rate/ability',
    component: AbilityRatingMgmt
  },
  // 联盟-承诺体系设置
  {
    name: 'promise-system-mgmt',
    path: 'operating/product-settings/shop-rate/promise',
    component: PromiseMgmt
  },
  // 联盟-推荐体系设置
  {
    name: 'recommend-system-mgmt',
    path: 'operating/product-settings/shop-rate/recommend',
    component: RecommendSystemMgmt
  },
  // 配送方式设置
  {
    path: 'product/product-settings/distributor-setting',
    component: DistributorMgmt
  },
  // 推荐审核设置
  {
    path: 'product/push-audit-setting',
    component: PushAuditSetting
  }
  // {
  //   path: 'setting',
  //   redirect: 'setting/tag'
  // },
];

export default enter;
