export default {
  // 查询导航页信息
  queryNavInfo: '/admin/maintenance/queryMaintainNavigation.jhtml',

  // 维保记录及相关页面
  // 获取消息条
  getMaintenanceMsg: '/admin/maintenance/queryMaintainCount.jhtml',
  // 查询维保记录列表
  queryMaintenanceRecords: '/admin/maintenance/queryMaintenanceRecodes.jhtml',
  // 删除维保记录
  deleteRecords: '/admin/maintenance/deleteRecords.jhtml',
  // 查询维保信息
  queryRecords: '/admin/maintenance/queryRecords.jhtml',
  // 创建维保记录
  createRecords: '/admin/maintenance/createRecords.jhtml',
  // 更新维保记录
  updateRecords: '/admin/maintenance/updateRecords.jhtml',
  // 查找历史故障
  searchPastRecords: '/admin/terminal/queryHistoryCarFault.jhtml',
  // 获取提醒设置
  querySettings: '/admin/maintainRemind/query.jhtml',
  // 创建/更新提醒设置
  saveSettings: '/admin/maintainRemind/update.jhtml',

  // 预约管理及相关页面
  // 获取消息条
  getOrderMsg: '/admin/appointment/queryAppointmentCount.jhtml',
  // 查询预约列表
  queryOrderList: '/admin/appointment/queryOrderList.jhtml',
  // 删除预约记录
  deleteOrders: '/admin/appointment/deleteOrders.jhtml',
  // 查询预约记录
  queryOrder: '/admin/appointment/queryOrder.jhtml',
  // 创建预约记录
  createOrders: '/admin/appointment/createOrders.jhtml',
  // 更新预约记录
  updateOrders: '/admin/appointment/updateOrders.jhtml',
  // 获取预约设置
  getOrderSettings: '/admin/appointmentSetting/list.jhtml',
  // 创建预约设置
  createOrderSettings: '/admin/appointmentSetting/create.jhtml',
  // 保存预约设置
  updateOrderSettings: '/admin/appointmentSetting/update.jhtml',
  // 获取车主列表
  queryMemberNameList: '/admin/maintenance/queryMemberList.jhtml',
  // 获取车主名下车牌列表
  queryPlateNameList: '/admin/maintenance/queryPlateNumberList.jhtml',

  // 获取服务项目列表
  serviceProjectList: '/admin/appointmentItem/list.jhtml',
  // 服务项目
  serviceProject: '/admin/appointmentItem/appointmentItem.jhtml',
  // 获取服务项目全部列表
  serviceProjectAllList: '/admin/appointmentItem/findListProduct.jhtml',
  // 平台服务列表
  platformService: '/admin/appointmentItem/findListItem.jhtml',
  // 从平台导入
  importFromPlatform: '/admin/appointmentItem/ImportFromPlatform.jhtml',

  // 服务手册列表
  serviceHandbookList: '/admin/appointmentBooklet/json/listBookletRef.jhtml',
  // 服务手册
  serviceHandbook: '/admin/appointmentBooklet/appointmentBookletRef.jhtml',
  // 导入
  importServiceHandbook: '/admin/appointmentBooklet/importBooklet.jhtml',

  // 车型
  MotorcycleType: '/admin/appointmentBooklet/getBookletCarList.jhtml',
  // 添加车型
  CreateMotorcycleType:
    '/admin/appointmentBooklet/createBookletTreeNodes.jhtml',

  // 机构列表
  RescueOrgList: '/admin/rescueOrganization/findlist.jhtml',
  // 救援机构
  RescueOrg: '/admin/rescueOrganization/rescueOrganization.jhtml',

  // 统计分析
  exportKpiReport: '/admin/ecommerce/kpi/export/aftersale/maintain.jhtml',
  queryKpiTable: '/admin/ecommerce/kpi/table/aftersale/maintain.jhtml',
  queryKpiReport: '/admin/ecommerce/kpi/graph/aftersale/maintain.jhtml',
  exportKpiRepairReport: '/admin/ecommerce/kpi/export/aftersale/repair.jhtml',
  queryKpiRepairTable: '/admin/ecommerce/kpi/table/aftersale/repair.jhtml',
  queryKpiRepairReport: '/admin/ecommerce/kpi/graph/aftersale/repair.jhtml',
  // 根据导入Excle返回的url获取结果
  importFromExcel: '/admin/baseData/importBooklet.jhtml',

  // 从平台导入
  importBooklet: '/admin/appointmentBooklet/json/importBooklet.jhtml',

  // 平台保养列表
  listMaintainBooklet: '/admin/baseData/listMaintainBookletRef.jhtml',

  // 平台查询更新指定手册
  maintainBooklet: '/admin/baseData/maintainBookletRef.jhtml',

  queryBrandList: '/admin/product/listShopBrand.jhtml',
  querySeriesList: '/admin/product/listShopSeries.jhtml',
  queryModeList: '/admin/product/listShopProduct.jhtml',
  listCarType: '/admin/appointmentBooklet/json/listCarType.jhtml',
  baseData: '/admin/baseData/baseData.jhtml',
  bookletShopData: '/admin/appointmentBooklet/bookletShopData.jhtml',
  bookletbaseData: '/admin/appointmentBooklet/bookletbaseData.jhtml',
  queryImportProgress: '/admin/appointmentBooklet/importProgress.jhtml',
  queryImportBaseProgress: '/admin/baseData/importProgress.jhtml'
};
