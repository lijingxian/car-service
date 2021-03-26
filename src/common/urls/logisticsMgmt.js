export default {
  // 发货管理
  delivery: {
    // 查询列表
    queryList: '/admin/shipping/json/list.jhtml',
    // 页面提示语
    queryInfo: '/admin/order/kpi.jhtml',
    // 导出
    export: '/admin/shipping/json/export.jhtml',
    // 删除
    delete: '/admin/shipping/json/delete.jhtml',
    // 基本信息
    baseInfo: {
      query: '/admin/shipping/json/query.jhtml'
    },
    queryShippingVoucher: '/admin/order/voucher/shipping.jhtml',
    queryShippingVoucherPurchase: '/admin/purchaseOrder/voucher/settlement.jhtml'
  },
  // 物流管理
  logistics: {
    // 查询列表
    queryList: '/admin/delivery_corp/json/list.jhtml',
    // 页面提示语
    queryInfo: '/admin/order/kpi.jhtml',
    // 删除
    delete: '/admin/delivery_corp/json/delete.jhtml',
    baseInfo: {
      query: '/admin/delivery_corp/json/query.jhtml',
      update: '/admin/delivery_corp/json/update.jhtml',
      create: '/admin/delivery_corp/json/create.jhtml'
    }
  }
};
