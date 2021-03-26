export default {
  // -------------------------服务订单Start-----------------------
  // 服务订单列表
  getServicesOrderList: '/admin/businessOrder/list.jhtml',
  // 服务搜索框筛选值
  queryFilters: '/admin/businessOrder/init.jhtml',
  // 基本信息
  queryBusinessOrder: '/admin/businessOrder/query/v201901.jhtml',
  // 服务信息
  listBusinessOrderItem: '/admin/businessOrder/listItem.jhtml',
  // 订阅服务列表
  listBusinessService: '/admin/businessOrder/listService.jhtml',
  // 续费时长
  queryPaymentPattern: '/admin/businessOrder/queryPaymentPattern.jhtml',
  // 鼠标悬浮后显示服务详情
  queryBusinessService: '/admin/businessOrder/queryService.jhtml',
  // 计算支付价格
  calculate: '/admin/businessOrder/calculate.jhtml',
  // 创建服务类型订单
  createBusinessOrder: '/admin/businessOrder/createOrder.jhtml',
  authorityService: '/admin/businessOrder/authorityService.jhtml',
  // 支付宝支付
  alipayPagePay: ' /admin/order/alipay/pagePay.jhtml',

  // 查询支付宝支付
  alipayQuery: ' /admin/order/json/alipayQuery.jhtml',
  // 个人银联支付
  unionGatePay: ' /admin/order/json/unionGatePay.jhtml',

  // 个人查询银联支付
  unionGatePayQuery: ' /admin/order/json/unionGatePayQuery.jhtml',

  // 企业银联支付
  unionB2BPay: ' /admin/order/json/unionB2BPay.jhtml',

  // 企业查询银联支付
  unionB2BPayQuery: ' /admin/order/json/unionB2BPayQuery.jhtml',
  // --------------------------服务订单End-----------------------

  // -------------------------服务管理Start-----------------------
  // 服务管理列表
  listBusinessProduct: '/admin/businessProduct/list.jhtml',
  updateBusinessProductState: '/admin/businessProduct/businessProductState.jhtml',
  deleteBusinessProduct: '/admin/businessProduct/businessProduct.jhtml',
  queryBusinessProduct: '/admin/businessProduct/query.jhtml',
  queryInit: '/admin/businessProduct/init.jhtml',
  createBusinessProduct: '/admin/businessProduct/businessProduct.jhtml',
  updateBusinessProduct: '/admin/businessProduct/businessProduct.jhtml',
  updateBusinessSpecification: '/admin/businessProduct/businessSpecification.jhtml',
  importBusinessProduct: '/admin/businessProduct/importBusiness.jhtml',
  // -------------------------服务管理End-----------------------

  // -------------------------服务规格Start-----------------------
  querySpecification: '/admin/businessProductSpecification/query.jhtml',
  createSpecification: '/admin/businessProductSpecification/specification.jhtml',
  updateSpecification: '/admin/businessProductSpecification/specification.jhtml',
  deleteSpecification: '/admin/businessProductSpecification/specification.jhtml',
  // -------------------------服务规格End-----------------------

  // 服务订购页面 service-order
  getServiceOrders: '/admin/businessOrder/listService/v201901.jhtml',
  // 服务订购详情
  getOrderDetail: '/admin/businessOrder/queryService/v201901.jhtml',
  // 创建订单
  createPlatformOrder: '/admin/businessOrder/createOrder/v201901.jhtml',
  createSmsOrder: '/admin/smsOrder/create/v201901.jhtml',
  // 购买记录
  orderHistory: '/admin/businessOrder/buyRecords.jhtml',
  // 服务分类cascader
  serviceClassifyList: '/admin/businessServiceClassify/businessServiceClassify.jhtml',

  // --------------------------短信管理--------------------------
  getMsgList: '/admin/smsRecord/list.jhtml',
  // 续增
  increase: '/admin/smsRecord/create.jhtml'
};
