export default {
  // 导航页
  navInfo: '/admin/order/queryNavigationKpi.jhtml',
  // 统计分析
  statisticsAnalysis: {
    queryOrderKpiReport: '/admin/ecommerce/kpi/graph/order/order.jhtml',
    queryOrderKpiTable: '/admin/ecommerce/kpi/table/order/order.jhtml',
    orderKpiExport: '/admin/ecommerce/kpi/export/order/order.jhtml',
    sales: '',
    summaryAftersale: '/admin/ecommerce/kpi/summary/order/afterSale.jhtml',
    conditionAftersale: '/admin/ecommerce/kpi/condition/order/afterSale.jhtml',
    tableAftersale: '/admin/ecommerce/kpi/table/order/afterSale.jhtml',
    graphAftersale: '/admin/ecommerce/kpi/graph/order/afterSale.jhtml',
    exportAftersale: '/admin/ecommerce/kpi/export/order/afterSale.jhtml'
  },
  // 订单管理
  orderMgmt: {
    list: '/admin/order/list.jhtml',
    order: '/admin/order/order.jhtml',
    service: '/admin/order/service.jhtml',
    close: '/admin/order/close.jhtml',
    confirm: '/admin/order/confirm.jhtml',
    payment: '/admin/order/payment.jhtml',
    shipping: '/admin/order/shipping.jhtml',
    options: '/admin/order/options.jhtml',
    carOptions: '/admin/order/carOptions.jhtml',
    addOrderItems: '/admin/order/orderItems.jhtml',
    rescuers: '/admin/order/rescuers.jhtml',
    rescuerSetting: '/admin/order/rescuerSetting.jhtml',
    rescueOrderLogs: '/admin/order/rescueOrderLogs.jhtml',
    rescuerDispath: '/admin/order/rescuerDispath.jhtml',
    listAdminByRole: '/admin/common/roleAdmins.jhtml', // 获取角色对应的管理员
    listExistCardTemplate: '/admin/memberCard/availableMemberCards.jhtml', // 获取会员卡体系列表
    viewProducts: '/admin/order/products.jhtml', // 查看商品信息
    viewOrderlogs: '/admin/order/logs.jhtml', // 查看订单进度
    viewOrderRefunds: '/admin/order/refunds.jhtml', // 售后进度
    refundsAudit: '/admin/order/refunds.jhtml', // 拒绝，同意退货
    invoiceInfoDefault: '/admin/invoiceInfo/defaultInvoiceInfo.jhtml', // 用户默认发票信息
    invoiceByOrder: '/admin/invoice/invoiceByOrder.jhtml', // 订单发票
    invoice: '/admin/invoice/invoice.jhtml', // 发票CURD
    invoiceDetail: '/admin/invoice/invoiceDetail.jhtml', // invoice替代（2019年3月18日）
    invoiceMail: '/admin/invoice/invoiceMail.jhtml', // 废弃（2019年3月18日）
    queryInvoiceDetailByOrderID:
      '/admin/invoice/queryInvoiceDetailByOrderID.jhtml', // invoiceDetailByOrder替代（2019年3月18日）
    brands: '/admin/product/listShopBrand.jhtml',
    series: '/admin/product/listShopSeries.jhtml',
    types: '/admin/product/listShopProduct.jhtml',
    getFinancialPlans: '/admin/order/financialPlans.jhtml',
    loanTerms: '/admin/order/loanTerms.jhtml',
    memberList: '/admin/member/members.jhtml',
    createMember: '/admin/member/createMember.jhtml',
    repairMaintainHistory: '/admin/order/repairMaintainHistory.jhtml',
    export: '/admin/order/export.jhtml',
    queryOrderKpi: '/admin/order/kpi.jhtml',
    certificate: '/admin/order/voucher/settlement.jhtml',
    listProductByTestDrive: '/rest/product/testDriveProducts.jhtml'
  },
  // 订单管理
  purchaseOrderMgmt: {
    list: '/admin/order/list.jhtml',
    order: '/admin/purchaseOrderManage/order.jhtml',
    service: '/admin/purchaseOrderManage/service.jhtml',
    close: '/admin/purchaseOrderManage/close.jhtml',
    confirm: '/admin/purchaseOrderManage/confirm.jhtml',
    payment: '/admin/purchaseOrderManage/payment.jhtml',
    shipping: '/admin/purchaseOrderManage/shipping.jhtml',
    options: '/admin/order/options.jhtml',
    carOptions: '/admin/order/carOptions.jhtml',
    addOrderItems: '/admin/purchaseOrderManage/orderItems.jhtml',
    rescuers: '/admin/order/rescuers.jhtml',
    rescuerSetting: '/admin/order/rescuerSetting.jhtml',
    rescueOrderLogs: '/admin/order/rescueOrderLogs.jhtml',
    rescuerDispath: '/admin/order/rescuerDispath.jhtml',
    listAdminByRole: '/admin/common/roleAdmins.jhtml', // 获取角色对应的管理员
    listExistCardTemplate: '/admin/memberCard/availableMemberCards.jhtml', // 获取会员卡体系列表
    viewProducts: '/admin/purchaseOrderManage/products.jhtml', // 查看商品信息
    viewOrderlogs: '/admin/purchaseOrderManage/logs.jhtml', // 查看订单进度
    viewOrderRefunds: '/admin/invoicing/purchase/refunds/refundsByOrderId.jhtml', // 售后进度
    refundsAudit: '/admin/invoicing/purchase/refunds/refunds/audit.jhtml', // 拒绝，同意退货
    invoiceInfoDefault: '/admin/invoiceInfo/defaultInvoiceInfo.jhtml', // 用户默认发票信息
    invoiceByOrder: '/admin/invoice/purchaseOrder/invoiceByOrder.jhtml', // 订单发票
    invoice: '/admin/invoice/purchaseOrder/invoice.jhtml', // 发票CURD
    invoiceDetail: '/admin/invoice/invoiceDetail.jhtml', // invoice替代（2019年3月18日）
    invoiceMail: '/admin/invoice/invoiceMail.jhtml', // 废弃（2019年3月18日）
    queryInvoiceDetailByOrderID:
      '/admin/invoice/queryInvoiceDetailByOrderID.jhtml', // invoiceDetailByOrder替代（2019年3月18日）
    brands: '/admin/product/listShopBrand.jhtml',
    series: '/admin/product/listShopSeries.jhtml',
    types: '/admin/product/listShopProduct.jhtml',
    getFinancialPlans: '/admin/order/financialPlans.jhtml',
    loanTerms: '/admin/order/loanTerms.jhtml',
    memberList: '/admin/member/members.jhtml',
    createMember: '/admin/member/createMember.jhtml',
    repairMaintainHistory: '/admin/order/repairMaintainHistory.jhtml',
    export: '/admin/order/export.jhtml',
    queryOrderKpi: '/admin/order/kpi.jhtml',
    certificate: '/admin/purchaseOrder/voucher/settlement.jhtml',
    listProductByTestDrive: '/rest/product/testDriveProducts.jhtml'
  }
};
