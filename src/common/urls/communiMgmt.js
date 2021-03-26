export default {
  // 通讯卡导航
  Communication_nav: '/admin/telecomOperator/navigation.jhtml',
  // 获取运营商列表
  Operator_queryList: '/admin/telecomOperator/telecomOperators.jhtml',
  // 获取运营商基本信息
  Operator_queryBaseInfo: '/admin/telecomOperator/telecomOperator.jhtml',
  // 创建运营商基本信息
  Operator_createBaseInfo: '/admin/telecomOperator/telecomOperator.jhtml',
  // 更新基本信息
  Operator_updateBaseInfo: '/admin/telecomOperator/telecomOperator.jhtml',
  // 删除基本信息
  Operator_deleteBaseInfo: '/admin/telecomOperator/telecomOperator.jhtml',
  // 获取话费包列表
  Operator_queryRechargeList: '/admin/rechargePackage/list.jhtml',
  // 创建话费包
  Operator_createRechargePackage: '/admin/rechargePackage/create.jhtml',
  // 修改话费包
  Operator_updateRechargePackage: '/admin/rechargePackage/update.jhtml',
  // 删除话费包
  Operator_deleteRechargePackage: '/admin/rechargePackage/delete.jhtml',
  // 通讯管理-运营商-充值卡
  // 查询列表
  Operator_queryCardList: '/admin/rechargeCard/list.jhtml',
  // 创建基本信息
  Operator_crateCardBaseInfo: '/admin/rechargeCard/create.jhtml',
  // 删除
  Operator_deleteCardBaseInfo: '/admin/rechargeCard/delete.jhtml',
  // 导入卡密
  Operator_importCardCode: '/admin/rechargeCard/import.jhtml',

  // 通讯卡
  // 获取通讯卡列表
  Card_queryList: '/admin/sim/list.jhtml',
  // 根据ID获取下级运营商列表
  Card_queryCompanyList: '/admin/company/json/listCompany.jhtml',
  // 获取通讯卡基本信息
  Card_queryBaseInfo: '/admin/sim/query.jhtml',
  // 创建通讯卡基本信息
  Card_createBaseInfo: '/admin/sim/create.jhtml',
  // 更新通讯卡基本信息
  Card_updateBaseInfo: '/admin/sim/update.jhtml',
  // 删除通讯卡
  Card_deleteBaseInfo: '/admin/sim/delete.jhtml',
  // 启用通讯卡
  Card_enable: '/admin/sim/enable.jhtml',
  // 停用通讯卡
  Card_disable: '/admin/sim/disable.jhtml',
  // 发送短信
  Card_sendMsg: '/admin/sim/sendMessage.jhtml',
  // 获取电信运营商列表
  Card_queryTeleOperatorList: '/admin/telecomOperator/telecomOperators.jhtml',
  // 获取所有者列表
  Card_queryOwnerList: '/admin/member/listByCompany.jhtml',
  // 获取充值记录列表
  Card_queryRecordsList: '/admin/sim/rechargeRecord/list.jhtml',
  // 获取消费记录列表
  Card_queryConsumeList: '/admin/sim/listSimConsumeRecord.jhtml',

  // 充值记录
  rechargeRecords: {
    query: '/admin/sim/rechargeRecord/list.jhtml'
  },

  // 统计分析sim卡
  statisticsAnalysis_card: '/admin/ecommerce/kpi/querySimKpiReport.jhtml',
  // 套餐统计分析
  statisticsAnalysis_package: '/admin/ecommerce/kpi/graph/queryRechargePackageKpiReport.jhtml',
  // 套餐分析 获取运营商列表
  statisticsAnalysis_queryCompany: '/admin/telecomOperator/telecomOperators.jhtml',
  // 套餐分析 获取套餐列表
  statisticsAnalysis_queryPackageList: '/admin/rechargePackage/listPackage.jhtml'
};
