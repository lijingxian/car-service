export default {
  // 车辆管理导航
  Vehicle_Nav: '/admin/fleet/queryNavigationKpi.jhtml',
  // 用户列表
  Component_queryPeople: '/admin/member/members.jhtml',
  // 店铺
  Component_queryShops: '/admin/store/findShopAndChild.jhtml',
  // 品牌
  Component_queryBrands: '/admin/common/queryBrand.jhtml',
  // 系列
  Component_querySeries: '/admin/common/querySeries.jhtml',
  // 车型
  Component_queryTypes: '/admin/common/queryTypes.jhtml',

  // 车辆列表
  // ====================
  // 查询提示信息
  VehicleMgmtVehicle_queryAlertInfo: '/admin/car/manage/carBox.jhtml',
  // 车辆列表查询
  VehicleMgmtVehicle_query: '/admin/car/manage/cars/v20190816.jhtml',
  // 车辆列表地图
  VehicleMgmtVehicle_mapList: '/admin/car/manage/listCarMap.jhtml',
  // 车队成员车辆列表
  VehicleMgmtVehicle_queryMotorcadeVehicles: '/admin/fleet/listFleetCar.jhtml',
  // 获取车队成员id集合
  VehicleMgmtVehicle_queryMemberIds: '/admin/fleet/listFleetExistCar.jhtml',
  // 删除
  VehicleMgmtVehicle_delete: '/admin/car/manage/delete/v20190816.jhtml',
  // 删除车队成员
  VehicleMgmtVehicle_deleteMember: '/admin/fleet/fleetCar.jhtml',
  // 上传
  VehicleMgmtVehicle_upload: '/admin/car/static/importCar.jhtml',
  // 添加车队成员
  VehicleMgmtVehicle_addMember: '/admin/fleet/fleetCar.jhtml',
  // 查询所属联盟
  VehicleMgmtVehicle_queryCompanyList: '/admin/member/json/findEShops.jhtml',

  // 车辆基本信息
  // ====================
  // 获取车辆基础信息
  VehicleBaseInfo_query: '/admin/car/manage/query.jhtml',
  // 获取DIM表
  VehicleBaseInfo_queryDimList: '/admin/car/manage/init.jhtml',
  // 获取保险公司列表
  VehicleBaseInfo_queryInsuranceList: '/admin/car/queryInsurance.jhtml',
  // 获取终端列表
  VehicleBaseInfo_queryTerminalList: '/admin/terminal/listByKeyword.jhtml',
  // 获取终端信息
  VehicleBaseInfo_queryTerminalInfo: '/admin/terminal/checkSnAndInput.jhtml',
  // 保存基本信息
  VehicleBaseInfo_update: '/admin/car/manage/update.jhtml',
  VehicleBaseInfo_add: '/admin/car/manage/create.jhtml',

  // 车辆申诉信息
  VehicleBaseInfo_appeals: '/admin/car/appeals.jhtml', // 查询车辆申诉信息列表
  VehicleBaseInfo_appeal: '/admin/car/appeal.jhtml', // 通过车辆申诉信息id查询申诉信息

  // 车辆分享
  // ====================
  // 获取分享列表
  VehicleShare_query: '/admin/car/share/list.jhtml',
  // 添加
  VehicleShare_addRule: '/admin/car/share/create.jhtml',
  // 删除
  VehicleShare_deleteRules: '/admin/car/share/delete.jhtml',
  // 设置是否启用为驾驶员
  VehicleShare_switchStatus: '/admin/car/share/updateState.jhtml',

  // 车辆标定
  // ====================
  // 查询信息
  VehicleDemarcate_query: '/admin/car/queryEcuUpgrade.jhtml',
  // 更新
  VehicleDemarcate_update: '/admin/car/updateEcuUpgrade.jhtml',
  // 新增
  VehicleDemarcate_add: '/admin/car/updateEcuUpgrade.jhtml',

  // 报警信息
  // ====================
  VehicleAlertInfo_query: '/admin/car/queryDmFaultList.jhtml',
  VehicleAlertInfo_errClear: '/admin/car/updateDmFault.jhtml',

  // 数据流
  VehicleDataStream_query: '/admin/dataFlow/listDataFlowParam.jhtml',
  // 数据流控制
  VehicleDataStream_control: '/admin/dataFlow/dataFlowControl.jhtml',
  // 数据流图表查询
  VehicleDataStream_queryChartStream: '/admin/dataFlow/listDataFlow.jhtml',
  // 保存默认数据流选项
  VehicleDataStream_saveDeafult:
    '/admin/dataFlow/saveDefaultDataFlowParam.jhtml',

  // 车况检测
  // ====================
  VehicleStateCheck_query: '/admin/fleetActivity/list.jhtml',
  VehicleStateCheck_queryState: '/admin/car/detection/create.jhtml',
  VehicleStateCheck_check: '/admin/car/detection/result.jhtml',
  VehicleStateCheck_checkDetail: '/admin/car/detection/resultDetail.jhtml',
  VehicleStateCheck_checkExpire: '/admin/car/detection/carCheckExpire.jhtml',

  // 电子围栏
  // ====================
  // 查询围栏列表
  VehicleElecFence_query: '/admin/fence/fences.jhtml',
  // 围栏
  VehicleElecFence_fence: '/admin/fence/fence.jhtml',
  // 显示所有围栏
  VehicleElecFence_showAllFences: '/admin/fence/allFences.jhtml',
  // 驾驶成就
  // ====================
  VehicleDrivingInfo_query: '/admin/car/listAnalysisInfo.jhtml',

  // 行车记录
  // ====================
  VehicleDrivingRecord_query: '/admin/car/listCarRecordInfo.jhtml',
  VehicleDrivingRecord_record: '/admin/car/drivingRecordShot.jhtml',

  // 车队管理
  VehicleMgmtMotorcade_query: '/admin/fleet/json/list.jhtml',

  // 车队基本信息
  MotorcadeBaseInfo_query: '/admin/fleet/fleet.jhtml',
  MotorcadeBaseInfo_motorcade: '/admin/fleet/fleet.jhtml',

  // 公告
  MotorcadeNotice_query: '/admin/fleet/listFleetNotice.jhtml',
  MotorcadeNotice_notice: '/admin/fleet/fleetNotice.jhtml',

  // 费用管理
  // ====================
  // 查询费用列表
  VehicleMgmtCost_query: '/admin/fleet/listFleetCarExpense.jhtml',
  // 查询车牌号列表
  VehicleMgmtCost_queryPlateNumbers: '/admin/fleet/listFleetExistCar.jhtml',
  // 车队驾驶员列表
  VehicleMgmtCost_queryPersonList: '/admin/fleet/listFleetDriver.jhtml',
  // 查询状态列表
  VehicleMgmtCost_queryStateList: '/admin/fleet/listVerifyState.jhtml',
  // 查询消费类型列表
  VehicleMgmtCost_queryTypeList: '/admin/fleet/listCarExpenseType.jhtml',
  // 导出
  VehicleMgmtCost_export: '/admin/fleet/exportFleetCarExpense.jhtml',

  // 费用基本信息
  CostBaseInfo_query: '/admin/fleet/fleetCarExpense.jhtml',
  CostBaseInfo_save: '/admin/fleet/updateVerifyState.jhtml',
  kpi_cost: '/admin/fleet/carExpenseBox.jhtml',

  // 签到管理
  VehicleMgmtSignUp_query: '/admin/fleet/listFleetSign.jhtml',
  // 签到导出
  VehicleMgmtSignUp_export: '/admin/fleet/exportSign.jhtml',
  // KPI
  kpi_signup: '/admin/fleet/signBox.jhtml',

  // 统计分析
  // 运营车辆
  // 查询车队列表
  MarketingCars_queryFleetList: '/admin/fleet/json/list.jhtml',
  // 根据车队id查询车辆列表
  MarketingCars_queryCarList: '/admin/fleet/listFleetCar.jhtml',
  // 根据车队ID查询驾驶员列表
  MarketingCars_queryDriverList: '/admin/fleet/listFleetDriver.jhtml',
  // 查询信息
  MarketingCars_query: '/admin/car/static/queryCarKpi.jhtml',
  // 查询图表
  MarketingCars_queryChart: '/admin/car/static/queryCarChat.jhtml',
  // 运营车辆导出
  MarketingCars_export: '/admin/car/static/carReport.jhtml',
  // 车辆状态
  CarState_query: '/admin/car/static/carStatus.jhtml',
  // 车辆状态导出
  CarState_export: '/admin/car/static/carStatusReport.jhtml',
  // 异常状态查询
  AbnormalStatistics_query: '/admin/car/static/abnormal.jhtml',
  // 异常状态导出
  AbnormalStatistics_export: '/admin/car/static/abnormalCarStatistics.jhtml',
  // 车辆速度查询
  CarSpeed_query: '/admin/car/static/carSpeed.jhtml',
  // 车速图表查询
  CarSpeedChart_query: '/admin/car/static/carSpeedTable.jhtml',
  // 车辆速度导出
  CarSpeed_export: '/admin/car/static/carSpeedReport.jhtml',
  // 车辆费用查询
  CarPayment_query: '',
  // 费用分析->消费情况分析
  CarExpensAnalyze: '/admin/car/static/carExpense.jhtml',
  // 费用分析->费用占比分析
  CarExpensePropotion: '/admin/fleet/carExpenseProportion.jhtml',
  // 费用分析->同比分析
  CarExpenseYearOnYear: '/admin/fleet/carExpenseYearOnYear.jhtml',
  // 费用分析->环比分析
  CarExpenseMonthOnMonth: '/admin/fleet/carExpenseMonthOnMonth.jhtml',

  // 车辆仪表盘
  VehicleInstrument_query: '/admin/car/meter/query.jhtml'
};
