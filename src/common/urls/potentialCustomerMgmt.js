export default {
  // 列表页面
  mainPage: {
    // 获取列表
    potentialCustomerList: '/admin/customer/list.jhtml',
    // 获取销售列表
    salesList: '/admin/customer/listSales.jhtml',
    // 删除内容
    potentialCustomer_delete: '/admin/customer/deletenew.jhtml',
    // 废弃
    potentialCustomer_abandon: '/admin/customer/abandoned.jhtml',
    // KPI
    kpi: '/admin/customer/queryDayKpi.jhtml',
    // 分配
    distribute: '/admin/customer/distribute.jhtml',
    // 导出
    export: '/admin/customer/exportConsumer.jhtml'
  },

  // 回访页面
  callbackSetting: {
    // 回访
    callbackSetting: '/admin/customer/visitSettings.jhtml'
  },
  // 意向设置
  intentionSettings: '/admin/customer/intentionSettings.jhtml',
  // 渠道设置
  customerChannels: '/admin/customer/customerChannels.jhtml',
  // 基础信息
  baseInfo: {
    // 获取初始化信息
    addQuery: '/admin/customer/init.jhtml',
    editQuery: '/admin/customer/potentialCustomer.jhtml',

    // 创建会员
    createMember: '/admin/member/createMember.jhtml',

    // 创建
    add: '/admin/customer/potentialCustomer.jhtml',
    // 更新
    update: '/admin/customer/basicInfo.jhtml'
  },

  // 购买意向
  intention: {
    save: '/admin/customer/buyPurpose.jhtml '
  },

  // 回访提醒
  callbackAlert: {
    list: '/admin/customer/alarmRecords.jhtml'
  },

  // 回访记录
  callbackRecord: {
    list: '/admin/customer/visitRecords.jhtml',
    add: '/admin/customer/visitRecord.jhtml',
    update: '/admin/customer/visitRecord.jhtml',
    delete: '/admin/customer/visitRecord.jhtml',

    // 根据回访提醒生成回访记录，并进行编辑
    addCallbackRecord: '/admin/customer/visitRecord/init.jhtml',
    updateCallbackRecord: '/admin/customer/visitRecord.jhtml'
  },

  // 战败
  failure: {
    save: '/admin/customer/failure.jhtml',
    queryBrandList: '/admin/product/listShopBrand.jhtml',
    querySeriesList: '/admin/product/listShopSeries.jhtml',
    queryModeList: '/admin/product/listShopProduct.jhtml'
  },

  // 签约
  sign: {
    planList: '/admin/order/json/getFinancialPlans.jhtml',
    queryModeList: '/admin/order/product/list.jhtml',
    save: '/admin/customer/updatePotentialnew4.jhtml',

    // 创建订单
    saveOrder: '/admin/order/createOrderByAdmin.jhtml',
    // 获取订单列表
    orderList: '/admin/customer/listOrder.jhtml'
  },

  // 试驾
  testDrive: {
    list: '/admin/customer/testDrives.jhtml',
    item: '/admin/customer/testDrive.jhtml',
    update: '/admin/customer/testDrive.jhtml',
    add: '/admin/customer/testDrive.jhtml',
    delete: '/admin/customer/testDrive.jhtml'
  },

  // 统计分析
  statisticsAnalysis: {
    potentialCustomersReport: '/admin/ecommerce/kpi/graph/sales/customer/v2.jhtml',
    potentialCustomersTable: '/admin/ecommerce/kpi/table/sales/customer/v2.jhtml',
    potentialCustomersExport: '/admin/ecommerce/kpi/export/sales/customer/v2.jhtml',
    // potentialCustomersReport: '/admin/ecommerce/kpi/graph/sales/customer.jhtml',
    // potentialCustomersTable: '/admin/ecommerce/kpi/table/sales/customer.jhtml',
    // potentialCustomersExport: '/admin/ecommerce/kpi/export/sales/customer.jhtml',
    potentialSalesReport: '/admin/ecommerce/kpi/graph/sales/sales.jhtml',
    potentialSalesTable: '/admin/ecommerce/kpi/table/sales/sales.jhtml',
    potentialSalesExport: '/admin/ecommerce/kpi/export/sales/sales.jhtml',
    callbackReport: '/admin/ecommerce/kpi/graph/sales/customer/visit.jhtml',
    callbackTable: '/admin/ecommerce/kpi/table/sales/customer/visit.jhtml',
    callbackExport: '/admin/ecommerce/kpi/export/sales/customer/visit.jhtml',
    defeatChannel: '/admin/ecommerce/kpi/graph/sales/customer/defeat/channel.jhtml',
    defeatReason: '/admin/ecommerce/kpi/graph/sales/customer/defeat/reason.jhtml',
    defeatYearOnYear: '/admin/customer/failureReasonChartYearNew.jhtml',
    defeatMonthOnMonth: '/admin/customer/failureCountYear.jhtml',
    defeatReport: '/admin/ecommerce/kpi/graph/sales/customer/defeat.jhtml',
    defeatTable: '/admin/ecommerce/kpi/table/sales/customer/defeat.jhtml',
    defeatExport: '/admin/ecommerce/kpi/export/sales/customer/defeat.jhtml',
    callbackYearOnYear: '/admin/customer/visitChartYear.jhtml',
    callbackMonthOnMonth: '/admin/customer/visitCountYear.jhtml',
    summaryCustomer: '/admin/ecommerce/kpi/summary/sales/customer.jhtml',
    conditionCustomer: '/admin/ecommerce/kpi/condition/sales/customer.jhtml'
  }
};
