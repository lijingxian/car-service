// 所有组件都要异步加载
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

const AreaMgmt = resolve =>
  require(['@/pages/system/area-mgmt/AreaMgmt'], resolve);
const OilPriceMgmt = resolve =>
  require(['@/pages/system/oil-price-mgmt/OilPriceMgmt'], resolve);

const StoragePluginMgmt = resolve =>
  require(['@/pages/system/storage-plugin-mgmt/StoragePluginMgmt'], resolve);

const FunctionDefination = resolve =>
  require([
    '@/pages/system/system-setting-mgmt/function-defination/FunctionDefination.vue'
  ], resolve);
const GeneralViewAnalysis = resolve => require(['@/pages/system/static-analysis/GeneralViewAnalysis'], resolve);
const enter = [
  // 基本设置
  {
    path: 'setting',
    redirect: 'setting/setting-mgmt'
  },
  // 基本设置
  {
    path: '',
    redirect: 'setting/setting-mgmt'
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
  // 油价表
  {
    path: 'setting/oil-price',
    component: OilPriceMgmt
  },
  // 统计分析
  {
    path: 'static-analysis',
    component: GeneralViewAnalysis
  }
];

export default enter;
