export default {
  // --------------------------系统设置管理Start-----------------------
  // 查询系统设置
  querySystemSetting: '/admin/settings/setting.jhtml',
  // 更新系统设置
  updateSystemSetting: '/admin/settings/setting.jhtml',
  // 邮件测试
  emailTest: '/admin/settings/mail_test.jhtml',
  // 推荐设置
  settings: '/admin/settings/settings.jhtml',
  // 设置默认推荐配置
  defaultSetting: '/admin/settings/default.jhtml',

  // --------------------------系统设置管理End-----------------------

  // --------------------------品牌管理Start-----------------------
  // 获取品牌列表
  getBrandManageList: '/admin/brand/json/brandList.jhtml',
  // 删除品牌
  deleteBrand: '/admin/brand/json/brand.jhtml',
  // 删除系列
  deleteSeries: '/admin/series/json/series.jhtml',
  // 添加品牌
  createBrand: '/admin/brand/json/brand.jhtml',
  // 添加系列
  createSeries: '/admin/series/json/series.jhtml',
  // 更新品牌
  updateBrand: '/admin/brand/json/brand.jhtml',
  // 更新系列
  updateSeries: '/admin/series/json/series.jhtml',
  // 查询品牌
  query: '/admin/brand/json/brand.jhtml',
  // 查询系列 // 根据品牌获取系列
  querySeries: '/admin/series/json/series.jhtml',
  // 根据首字母获取品牌名称
  queryBrand: '/admin/brand/json/brandListInitial.jhtml',
  // --------------------------品牌管理End-----------------------

  // --------------------------分类管理Start-----------------------
  // 获取平台分类列表
  getPlatformCategoryList: '/admin/product_category/listPlatformCategory.jhtml',
  // 添加平台分类
  savePlatformCategory: '/admin/product_category/platformCategory.jhtml',
  // 删除平台分类
  deletePlatformCategory: '/admin/product_category/platformCategory.jhtml',
  // 更新平台分类
  updatePlatformCategory: '/admin/product_category/platformCategory.jhtml',
  // 获取平台分类
  getPlatformCategory: '/admin/product_category/platformCategory.jhtml',
  // --------------------------分类管理End-----------------------

  // --------------------------地区管理Start-----------------------
  // 获取地区列表
  // getAreaList: '/admin/area/areaList.jhtml',
  getAreaList: '/admin/area/areaListNew.jhtml',
  // 查询地区信息
  queryArea: '/admin/area/area.jhtml',
  // 添加地区信息
  addArea: '/admin/area/area.jhtml',
  // 更新地区信息
  updateArea: '/admin/area/area.jhtml',
  // 删除地区信息
  deleteArea: '/admin/area/area.jhtml',
  // --------------------------地区管理End-----------------------

  // --------------------------产品库Start-----------------------
  // 产品库列表
  getProductList: '/admin/baseData/basicData/list.jhtml',
  // 查询产品库
  queryBasicData: '/admin/baseData/basicData.jhtml',
  // 增加产品库
  createBasicData: '/admin/baseData/basicData.jhtml',
  // 修改产品库
  updateBasicData: '/admin/baseData/basicData.jhtml',
  // 删除产品库
  deleteBasicData: '/admin/baseData/basicData.jhtml',
  // --------------------------产品库End-----------------------

  // --------------------------配送方式管理Start-----------------------
  // 获取配送方式列表
  getShippingMethodList: '/admin/shipping_method/json/list.jhtml',
  // 查询配送方式
  queryShippingMethod: '/admin/shipping_method/ShippingMethod.jhtml',
  // 添加地区信息
  addShippingMethod: '/admin/shipping_method/ShippingMethod.jhtml',
  // 更新地区信息
  updateShippingMethod: '/admin/shipping_method/ShippingMethod.jhtml',
  // 删除地区信息
  deleteShippingMethod: '/admin/shipping_method/ShippingMethod.jhtml',
  // 物流公司列表
  getDeliveryCorpsList: '/admin/shipping_method/listDeliveryCorps.jhtml',
  // --------------------------配送方式管理End-----------------------

  // --------------------------支付方式管理Start-----------------------
  // 获取支付方式列表
  getPaymentMethodList: '/admin/payment_method/json/listPaymentMethods.jhtml',
  // 查询配送方式
  queryPaymentMethod: '/admin/payment_method/json/paymentMethod.jhtml',
  // 更新配送方式
  updatePaymentMethod: '/admin/payment_method/json/paymentMethod.jhtml',
  // --------------------------配送方式管理End-----------------------

  // --------------------------保险公司管理Start-----------------------
  // 获取保险公司列表
  getInsuranceCompanyList: '/admin/insurance/json/list.jhtml',
  // 查询保险公司
  queryInsuranceCompany: '/admin/insurance/insurance.jhtml',
  // 添加保险公司
  addInsuranceCompany: '/admin/insurance/insurance.jhtml',
  // 更新保险公司
  updateInsuranceCompany: '/admin/insurance/insurance.jhtml',
  // 删除保险公司
  deleteInsuranceCompany: '/admin/insurance/insurance.jhtml',
  // --------------------------保险公司管理End-----------------------

  // --------------------------油价管理Start-----------------------
  // 获取油价信息列表
  getOilPriceList: '/admin/oilPrice/json/list.jhtml',
  // 查询油价信息
  queryOilPrice: '/admin/oilPrice/oilPrice.jhtml',
  // 添加油价信息
  addOilPrice: '/admin/oilPrice/oilPrice.jhtml',
  // 更新油价信息
  updateOilPrice: '/admin/oilPrice/oilPrice.jhtml',
  // 删除油价信息
  deleteOilPrice: '/admin/oilPrice/oilPrice.jhtml',
  // 油价一键更新
  oneKeyUpdateOilPrice: '/admin/oilPrice/oneKeyUpdateOilPrice.jhtml',
  // --------------------------油价管理End-----------------------

  // --------------------------存储插件管理Start-----------------------
  // 获取存储插件列表
  getStoragePluginList: '/admin/storage_plugin/json/list.jhtml',
  // 安装存储插件
  installStoragePlugin: '/admin/storage_plugin/json/install.jhtml',
  // 卸载存储插件
  uninstallStoragePlugin: '/admin/storage_plugin/json/uninstall.jhtml',
  // 查询存储插件信息
  queryStoragePlugin: '/admin/storage_plugin/json/storagePlugin.jhtml',
  // 更新存储插件信息
  updateStoragePlugin: '/admin/storage_plugin/json/storagePlugin.jhtml',
  // --------------------------存储插件管理End-----------------------

  // --------------------------微信端口管理Start-----------------------
  // 获取店铺下微信公众号详情
  queryWechatOpen: '/admin/wechatOpen/wechat.jhtml',
  // 更新微信公众号
  updateWechatOpen: '/admin/wechatOpen/wechat.jhtml',

  // 添加微信公众号
  saveWechatOpen: '/admin/wechatOpen/wechat.jhtml',
  // 解绑微信公众号
  unbindWechatOpen: '/admin/wechatOpen/wechat.jhtml',

  // 更新微信公众号名称
  updateWechatOpenName: '/admin/wechatMenu/wechatOpenName.jhtml',
  // 查询公众号菜单
  queryWechatMenu: '/admin/wechatMenu/wechatMenu.jhtml',
  // 更新公众号菜单
  updateWechatMenu: '/admin/wechatMenu/wechatMenu.jhtml',
  // 公众号回复
  messageReplay: '/admin/messageReplay/messageReplay.jhtml',
  // 关注回复
  subscribeReplay: '/admin/messageReplay/subscribeReplay.jhtml',
  // 关键词回复列表
  keywordReplys: '/admin/messageReplay/keywordReplys.jhtml',
  // 关键词回复
  keywordReply: '/admin/messageReplay/keywordReply.jhtml',
  // 获取店铺下微信公众号菜单列表
  getWechatMenu: '/admin/wechatOpen/wechats.jhtml',
  // --------------------------分类管理End-----------------------

  // --------------------------日志管理Start-----------------------
  // 获取日志列表
  getLogList: '/admin/log/log/list.jhtml',
  // 查询日志
  queryLog: '/admin/log/log/log.jhtml',
  // 删除日志
  deleteLog: '/admin/log/log/log.jhtml',
  // 清空日志
  clearLogs: '/admin/log/log/clear.jhtml',
  // --------------------------日志管理End-----------------------

  // --------------------------在线用户管理Start-----------------------
  // 获取在线用户列表
  getOnlineUserList: '/admin/log/dayUserLogin/list.jhtml',
  // --------------------------在线用户管理End-----------------------

  // --------------------------用户登录日志管理Start-----------------------
  // 获取登录日志列表
  getUserLoginList: '/admin/log/userLogin/list.jhtml',
  // --------------------------用户登录日志管理End-----------------------

  // --------------------------基础数据管理Start-----------------------
  // 获取基础数据列表
  getBaseDataList: '/admin/baseData/carType/list.jhtml',
  // 获取基础数据详情
  queryBaseData: '/admin/baseData/carType.jhtml',
  // 添加基础数据
  saveBaseData: '/admin/baseData/carType.jhtml',
  // 更新基础数据
  updateBaseData: '/admin/baseData/carType.jhtml',
  // 删除基础数据
  deleteBaseData: '/admin/baseData/carType.jhtml',
  // 基础数据-通过品牌Id获取系列列表
  getBaseDataSeriesList: '/admin/baseData/carType/getSeries.jhtml',
  // 基础数据-通过系列Id获取其它可选项列表
  getBaseDataOptionList: '/admin/baseData/carType/getOptions.jhtml',
  // 基础数据-通过年款获取型号列表
  getBaseDataTypeList: '/admin/baseData/carType/getTypes.jhtml',
  // --------------------------基础数据管理End-----------------------};

  // --------------------------标签库Start-----------------------
  getTagCategories: '/admin/tagCategory/platformTagCategories.jhtml', // 系统标签分类列表
  getShopTagCategories: '/admin/tagCategory/storeTagCategories.jhtml', // 店铺标签分类列表
  createTagCategories: '/admin/tagCategory/platformTagCategory.jhtml', // 创建系统标签分类
  createShopTagCategories: '/admin/tagCategory/storeTagCategory.jhtml', // 创建店铺标签分类
  tagMgList: '/admin/tag/tagList.jhtml', // 标签管理列表
  deleteTag: '/admin/tag/tag.jhtml', // 删除标签
  tagList: '/admin/tag/tags.jhtml', // 标签分类下标签列表详情
  transfromToPlatform: '/admin/tag/transfromToPlatform.jhtml', // 店铺标签转化为平台标签
  storeTagcategories: '/admin/tag/storeTagcategories.jhtml', // 根据使用场景获取标签分类
  storeTags: '/admin/tag/storeTags.jhtml', // 店铺标签分类下标签列表
  tagMapping: '/admin/tag/tagMapping.jhtml', // 创建标签映射

  getPlatfromTagTree: '/admin/common/platfromTagCategories.jhtml', // 平台标签分类树
  getPlatformTags: '/admin/tag/platformTags.jhtml', // 系统标签列表
  updatePlatFormTag: '/admin/tag/platformTag.jhtml', // 更新系统标签
  getTagsByCategory: '/admin/common/tagsByCategory.jhtml', // 标签列表（根据分类）
  platformTagcategories: '/admin/tag/platformTagcategories.jhtml',
  // --------------------------标签库End-------------------

  // 承诺图标模板
  promiseList: '/admin/promise/platformPromises.jhtml', // 承诺列表
  createPromise: '/admin/promise/platformPromise.jhtml', // 创建承诺

  // 微信链接设置
  menus: '/admin/wechatMenuTemplate/menus.jhtml', // 列表
  menu: '/admin/wechatMenuTemplate/menu.jhtml',

  // 日志
  getLogsList: '/admin/log/logs.jhtml', // 日志列表
  logUpdate: '/admin/log/log.jhtml', // 日志删查

  // 车辆故障码
  carFaultCodeList: '/admin/diagFaultSetting/settings.jhtml', // 列表
  carFaultCodeOperate: '/admin/diagFaultSetting/setting.jhtml', // 增删改查操作
  faultType: '/admin/diagFaultSetting/setting/faultType.jhtml' // 获取故障类型
};
