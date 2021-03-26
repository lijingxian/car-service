export default {
  // 收款管理
  payment: {
    // 获取信息条
    queryInfo: '/admin/order/kpi.jhtml',
    // 获取列表
    queryList: '/admin/payment/json/list.jhtml',
    // 删除列表
    delete: '/admin/payment/json/delete.jhtml',
    // 导出
    export: '/admin/payment/json/export.jhtml',
    // 收款管理基本信息
    baseInfo: {
      query: '/admin/payment/json/query.jhtml'
    }
  },
  // 退款管理
  refund: {
    queryInfo: '/admin/order/kpi.jhtml',
    queryList: '/admin/refunds/json/list.jhtml',
    delete: '/admin/refunds/json/delete.jhtml',
    export: '/admin/refunds/json/export.jhtml',
    baseInfo: {
      query: '/admin/refunds/json/query.jhtml'
    }
  },
  // 储值管理
  store: {
    queryInfo: '/admin/order/kpi.jhtml',
    queryList: '/admin/order/list.jhtml',
    export: '/admin/order/export.jhtml',
    baseInfo: {
      // 查询订单信息
      query: '/admin/order/order.jhtml'
    },
    // 商品信息
    productInfo: {
      query: '/admin/order/products.jhtml'
    },
    // 订单进度
    orderLogs: {
      query: '/admin/order/logs.jhtml'
    }
  }
};
