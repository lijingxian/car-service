export default {
  // 终端导航
  TerminalMgmt_Nav: '/admin/terminal/queryNavigationKpi.jhtml', // /admin/intelligent/queryNavigationKpi.jhtml
  // 用户列表
  Component_queryPeople: '/admin/member/members.jhtml',
  // 所属运营商
  Component_queryOperators: '/admin/company/json/listCompany.jhtml',

  // 终端分类列表
  terminalMgmtClass_query: '/admin/terminal/listTerminalType.jhtml',
  terminalMgmtClass_upload: '/admin/terminal/json/importTerminal.jhtml',

  // 查询当前登录角色权限
  queryAuth: '/admin/common/listAuthority/v201901.jhtml',

  // 获取终端标识列表
  ClassAbilitySetting_querySignList: '/admin/terminal/getTerminalTypeEnum.jhtml',
  // 获取终端能力列表
  ClassAbilitySetting_queryAbilityList: '/admin/terminal/getAbilitylist.jhtml',
  // 查询信息
  ClassAbilitySetting_query: '/admin/terminal/json/queryTerminalType.jhtml',
  // 更新
  ClassAbilitySetting_update: '/admin/terminal/json/updateTerminalType.jhtml',
  // 新增
  ClassAbilitySetting_add: '/admin/terminal/json/createTerminalType.jhtml',
  // 删除
  ClassAbilitySetting_delete: '/admin/terminal/json/deleteTerminalType.jhtml',

  // 查询信息
  AccessSetting_query: '/admin/productLibrary/json/queryConfig.jhtml',
  // 更新
  AccessSetting_update: '/admin/productLibrary/json/updateConfig.jhtml',
  // 新增
  AccessSetting_add: '/admin/productLibrary/json/createConfig.jhtml',

  // 查询信息
  CodingRule_query: '/admin/productLibrary/json/listSnRule.jhtml',
  // 查询规则信息
  CodingRule_queryRule: '/admin/productLibrary/json/querySnRule.jhtml',
  // 删除规则
  CodingRule_deleteRules: '/admin/productLibrary/json/deleteSnRule.jhtml',
  // 更新规则
  CodingRule_updateRule: '/admin/productLibrary/json/updateSnRule.jhtml',
  // 新增规则
  CodingRule_addRule: '/admin/productLibrary/json/createSnRule.jhtml',

  // 查询信息
  TerminalUpdate_query: '/admin/terminal/json/queryTerminalTypeUpgrade.jhtml',
  // 更新
  TerminalUpdate_update: '/admin/terminal/json/updateTerminalTypeUpgrade.jhtml',
  // 新增
  TerminalUpdate_add: '/admin/terminal/json/updateTerminalTypeUpgrade.jhtml',

  // 终端列表
  terminalMgmtTerminal_query: '/admin/terminal/manage/terminals/v20190816.jhtml',
  // 删除
  terminalMgmtTerminal_delete: '/admin/terminal/manage/terminal/v20190816.jhtml',
  // 启用/停用
  terminalMgmtTerminal_switchState: '/admin/terminal/manage/terminal/state.jhtml',
  // 上传
  terminalMgmtTerminal_upload: '/admin/terminal/json/importTerminal.jhtml',
  // 分配
  terminalMgmtTerminal_allocate: '/admin/terminal/distributeTerminal.jhtml',

  // 查询终端类型列表
  BaseInfo_queryTypeList: '/admin/intelligent/json/getTerminalTypeList.jhtml',
  // 查询店铺列表
  BaseInfo_queryShopList: '/admin/admin/json/queryShops.jhtml',
  // 查询位置信息
  // BaseInfo_queryPositionList: '/admin/space/fleet/list.jhtml',
  // 查询信息
  BaseInfo_query: '/admin/intelligent/json/query.jhtml',
  // 更新
  BaseInfo_update: '/admin/intelligent/json/update.jhtml',
  // 新增
  BaseInfo_add: '/admin/intelligent/json/create.jhtml',

  // 查询信息
  BaseInfo_query_new: '/admin/terminal/manage/terminal.jhtml',
  // 更新
  BaseInfo_update_new: '/admin/terminal/manage/terminal.jhtml',
  // 新增
  BaseInfo_add_new: '/admin/terminal/manage/terminal.jhtml',

  // 查询SIM卡信息
  CommunicationInfo_querySimList: '/admin/sim/listIccid.jhtml',
  // 查询信息
  CommunicationInfo_query: '/admin/intelligent/json/listCommInfo.jhtml',
  // 查询通信信息
  CommunicationInfo_queryRule: '/admin/fleetActivity/query.jhtml',
  // 删除通信
  CommunicationInfo_deleteRules: '/admin/intelligent/json/deleteCommInfo.jhtml',
  // 更新通信
  CommunicationInfo_updateRule: '/admin/intelligent/json/updateCommInfo.jhtml',
  // 新增通信
  CommunicationInfo_addRule: '/admin/intelligent/json/createCommInfo.jhtml',

  // 统计分析
  StatisticsAnalysis: '/admin/ecommerce/kpi/queryTerminalKpiReport.jhtml',
  /** 终端统计 **/
  // 终端-趋势 获取终端类型列表
  terminalTypeList: '/admin/ecommerce/kpi/condition/terminal/trend.jhtml',
  // 终端-趋势 获取图表数据
  trendGraphData: '/admin/ecommerce/kpi/graph/terminal/trend.jhtml',
  // 终端-趋势 获取表格数据
  trendTabelData: '/admin/ecommerce/kpi/table/terminal/trend.jhtml',
  // 终端-趋势 导出
  trendExport: '/admin/ecommerce/kpi/export/terminal/trend.jhtml',
  // 终端-地域 获取终端类型列表
  areaTypeList: '/admin/ecommerce/kpi/condition/terminal/area.jhtml',
  // 终端-地域 获取表格数据
  areaTabelData: '/admin/ecommerce/kpi/table/terminal/area.jhtml',
  // 终端-地域 获取图表数据
  areaGraphData: '/admin/ecommerce/kpi/graph/terminal/area.jhtml',
  // 终端-地域 导出
  areaExport: '/admin/ecommerce/kpi/export/terminal/area.jhtml',
  // 终端-硬件 获取终端类型列表
  hardTypeList: '/admin/ecommerce/kpi/condition/terminal/hardVer.jhtml',
  // 终端-硬件 获取表格数据
  hardTabelData: '/admin/ecommerce/kpi/table/terminal/hardVer.jhtml',
  // 终端-硬件 获取图表数据
  hardGraphData: '/admin/ecommerce/kpi/graph/terminal/hardVer.jhtml',
  // 终端-硬件 导出
  hardExport: '/admin/ecommerce/kpi/export/terminal/hardVer.jhtml',
  // 终端-软件 获取终端类型列表
  softTypeList: '/admin/ecommerce/kpi/condition/terminal/softVer.jhtml',
  // 终端-软件 获取表格数据
  softTabelData: '/admin/ecommerce/kpi/table/terminal/softVer.jhtml',
  // 终端-软件 获取图表数据
  softGraphData: '/admin/ecommerce/kpi/graph/terminal/softVer.jhtml',
  // 终端-软件 导出
  softExport: '/admin/ecommerce/kpi/export/terminal/softVer.jhtml',
  // 功能使用-功能启用 条件
  functionCondition: '/admin/ecommerce/kpi/condition/terminal/featureActivity.jhtml',
  // 功能使用-功能启用 图表
  functionGraph: '/admin/ecommerce/kpi/graph/terminal/featureActivity.jhtml',
  // 功能使用-功能启用 列表
  functionTabel: '/admin/ecommerce/kpi/table/terminal/featureActivity.jhtml',
  // 功能使用-功能启用 导出
  functionExport: '/admin/ecommerce/kpi/export/terminal/featureActivity.jhtml',
  // 功能使用-top10功能分布 条件
  topCondition: '/admin/ecommerce/kpi/condition/terminal/topX.jhtml',
  // 功能使用-top10功能分布 图表
  topGraph: '/admin/ecommerce/kpi/graph/terminal/topX.jhtml',
  // 功能使用-top10功能分布 列表
  topTabel: '/admin/ecommerce/kpi/table/terminal/topX.jhtml',
  // 功能使用-top10功能分布 导出
  topExport: '/admin/ecommerce/kpi/export/terminal/topX.jhtml',
  // 功能使用-last10功能分布 条件
  lastCondition: '/admin/ecommerce/kpi/condition/terminal/lastX.jhtml',
  // 功能使用-last10功能分布 图表
  lastGraph: '/admin/ecommerce/kpi/graph/terminal/lastX.jhtml',
  // 功能使用-last10功能分布 列表
  lastTabel: '/admin/ecommerce/kpi/table/terminal/lastX.jhtml',
  // 功能使用-last10功能分布 导出
  lastExport: '/admin/ecommerce/kpi/export/terminal/lastX.jhtml',
  // 功能使用-地域分布 条件
  areaCondition: '/admin/ecommerce/kpi/condition/terminal/featureArea.jhtml',
  // 功能使用-地域分布 图表
  areaGraph: '/admin/ecommerce/kpi/graph/terminal/featureArea.jhtml',
  // 功能使用-地域分布 列表
  areaTabel: '/admin/ecommerce/kpi/table/terminal/featureArea.jhtml',
  // 功能使用-地域分布 导出
  areaExports: '/admin/ecommerce/kpi/export/terminal/featureArea.jhtml',
  // 功能使用-时间分布 条件
  timeCondition: '/admin/ecommerce/kpi/condition/terminal/time.jhtml',
  // 功能使用-时间分布 图表
  timeGraph: '/admin/ecommerce/kpi/graph/terminal/time.jhtml',
  // 功能使用-时间分布 列表
  timeTabel: '/admin/ecommerce/kpi/table/terminal/time.jhtml',
  // 功能使用-时间分布 导出
  timeExport: '/admin/ecommerce/kpi/export/terminal/time.jhtml',

  // 终端能力
  TerminalClassAbility: {
    // 获取能力列表
    abilityList: '/admin/terminal/getAllAbilitys.jhtml',
    // 获取品牌
    brandList: '/admin/common/listBrand.jhtml',
    // 获取车系
    seriesList: '/admin/common/listSeries.jhtml',
    // 获取车型
    modelList: '/admin/common/listTypes.jhtml',

    // 终端能力列表
    list: '/admin/terminal/queryTerminalTypeAbilities.jhtml',
    // 添加终端能力
    add: '/admin/terminal/addTerminalTypeAbilities.jhtml',
    // 更新终端能力
    update: '/admin/terminal/updateTerminalTypeAbilities.jhtml',
    // 删除终端能力
    delete: '/admin/terminal/delTerminalTypeAbilities.jhtml'
  },

  // 基本信息
  BaseInfo: {
    update: '/admin/terminal/updateTerminalType.jhtml',
    add: '/admin/terminal/createTerminalType.jhtml',
    query: '/admin/terminal/queryTerminalType.jhtml',
    signList: '/admin/terminal/getTerminalTypeEnum.jhtml'
  }
};
