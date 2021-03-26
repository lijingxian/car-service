export default {
  // 导航页
  queryNavInfo: '/admin/cs/csNavigation.jhtml',
  // 客服列表
  CSList: '/admin/cs/listCSAccount.jhtml',
  // 当前客服所在群组列表
  MyCSGroup: '/admin/cs/myCsGroups.jhtml',
  // 结束会话客户列表
  EndClientList: '/admin/chat/listSession.jhtml',
  // 通过管理员ID查看客服信息
  csInfoByAdmin: '/admin/cs/csAccountByAdmin.jhtml',

  // 历史记录列表
  HistoryClientList: '/admin/cs/listMember.jhtml',

  // 查询客服相关
  CSQuery: '/admin/cs/csAccount.jhtml',
  // 客户基本信息
  Client: '/admin/member/member.jhtml',
  Host: '/admin/common/imServer.jhtml',

  // 会话质检
  SessionCheckList: '/admin/cs/listCSSessionQuality.jhtml',
  // 查询聊天记录
  ChatList: '/chat/listSessionChat.jhtml',
  // 查询评分
  sessionCount: '/admin/cs/queryCSSessionQuality.jhtml',
  // 主管对会话打分
  SessionScore: '/admin/cs/markCSSession.jhtml',
  // 黑名单列表
  BlackList: '/admin/cs/listBlack.jhtml',
  // 创建黑名单
  CreateBlack: '/admin/cs/black.jhtml',
  // 通过黑名单
  PassBlack: '/admin/cs/passBlacklist.jhtml',
  // 恢复黑名单
  RecoverBlack: '/admin/cs/recoverBlacklist.jhtml',

  // 群组
  // ==============================
  // 群列表
  CSGroupList: '/admin/cs/csGroupManage/csGroups.jhtml',
  // 群
  CSGroup: '/admin/cs/csGroupManage/csGroup.jhtml',

  // 机器人
  // 机器人回复设置
  replySetting: '/admin/cs/reply.jhtml',
  // 知识库类别
  knowledgeType: '/admin/cs/listCSKnowledgeCategory.jhtml',
  // 知识库子类别
  knowledgeSonType: '/admin/cs/listCSKnowledgeCategory.jhtml',
  // 知识库列表
  knowledgeList: '/admin/cs/listCSKnowledge.jhtml',
  // 知识库
  knowledge: '/admin/cs/csKnowledge.jhtml',
  // 导出列表
  ExportKnowledge: '/admin/cs/exportAll.jhtml',
  // 导入列表
  ImportKnowledge: '/admin/cs/importAll.jhtml',

  // 工时管理
  manhour: '/admin/cs/worktime.jhtml',

  // 工单信息条
  WorkSheetInfo: '/admin/cs/cSWorkSheetBox.jhtml',
  // 工单列表
  WorkSheetList: '/admin/cs/listCSWorkSheet.jhtml',
  // 工单基本信息
  WorkSheetBaseInfo: '/admin/cs/csWorkSheet.jhtml',
  // 受理人列表
  WorkSheetSponsorList: '/admin/cs/listCSAccount.jhtml',
  // 受理组列表
  WorkSheetSponsorGroupList: '/admin/cs/listCSGroup.jhtml',
  // 会员列表
  WorkSheetMemberList: '/admin/member/members.jhtml',
  // 工单管理统计分析
  WorkSheetKpi: '/admin/ecommerce/kpi/queryCSWorkSheetKpiReport.jhtml',

  // 智能到店
  SmartToShop: {
    // 智能到店导航
    nav: '/admin/intelligent/queryDayKpi.jhtml',
    // 到点统计->消息条
    statisticsAnalysisQueryInfo: '/admin/intelligent/queryDayKpi.jhtml',
    // 到店统计
    statisticsAnalysisQueryList: '/admin/intelligent/queryKpiList.jhtml',
    // 到店统计导出
    statisticsAnalysisExport: '/admin/intelligent/exportKpiList.jhtml'
  },

  // 接待管理
  ReceptionMgmt: {
    // 接待管理->消息条
    queryInfo: '/admin/intelligent/queryDayKpi.jhtml',
    // 查询列表
    queryList: '/admin/intelligent/list.jhtml',
    // 获取道闸开关
    queryLPR: '/admin/intelligent/getLPRList.jhtml',
    LPRControl: '/admin/intelligent/pccontrol.jhtml',
    accessCommand: '/admin/intelligent/accessCommand.jhtml',
    autoReleaseList: '/admin/intelligentAccess/setting/autoReleaseList.jhtml',
    autoRelease: '/admin/intelligentAccess/setting/autoRelease.jhtml',
    statisticsOwnerCar: '/admin/intelligentAccess/setting/statisticsOwnerCar.jhtml',
    gate: '/admin/intelligentAccess/setting/gate.jhtml',
    message: '/admin/intelligentAccess/setting/message.jhtml',
    messages: '/admin/intelligentAccess/setting/messages.jhtml',
    ranks: '/admin/intelligentAccess/setting//userCard/ranks.jhtml',
    baseInfo: {
      query: '/admin/intelligent/edit.jhtml',
      create: '/admin/intelligent/creat.jhtml',
      update: '/admin/intelligent/update.jhtml',
      updateAutoLeave: '/admin/intelligent/updateAutoLeave.jhtml',
      // 接待人员列表
      queryReceptionList: '/admin/common/listByRole.jhtml',
      // 会员列表
      queryMemberList: '/admin/member/members.jhtml',
      // 会员订单列表
      queryMemberOrderList: '/admin/common/listMemberOrder.jhtml',
      // 新建会员
      createMember: '/admin/member/createMemberByCar.jhtml',
      // 商品列表
      productList: '/admin/order/product/list.jhtml',
      // 新建订单
      createOrder: '/admin/order/orderByAdmin.jhtml',
      // 查询订单列表
      queryOrderList: '/admin/common/listMemberOrder.jhtml'
    },
    // 消息模板设置
    templateSettings: {
      // queryTemplate: '/admin/intelligent/getWelcomeTemplate.jhtml',
      templateData: '/admin/intelligent/message/welcome.jhtml'
      // update: '/admin/intelligent/message/welcome.jhtml'
    }
  },
  // 智能接待
  smartReception: {
    getRobotInfoList: '/admin/reception/robotInfos.jhtml',
    updateRobotInfo: '/admin/reception/robotInfo.jhtml',
    queryRobotInfo: '/admin/reception/robotInfo.jhtml',
    robotKpi: '/admin/reception/robotKpi.jhtml',
    robotRecord: '/admin/reception/robotRecord.jhtml',
    robotRecordDetail: '/admin/reception/robotRecordDetail.jhtml',
    exportRobotRecord: '/admin/reception/exportRobotRecord.jhtml',
    robotMapList: '/admin/reception/robotMaps.jhtml',
    // 查询地图信息
    queryRobotMapSetting: '/admin/reception/robotMapSettings.jhtml',
    // 更新地图信息
    robotMapSetting: '/admin/reception/robotMapSetting.jhtml',
    // 知识库问答管理
    knowledges: '/admin/knowledge/knowledges.jhtml',
    // 知识库问答管理编辑
    knowledgeStock: '/admin/knowledge/knowledge.jhtml',

    importProgress: '/admin/knowledge/importProgress.jhtml',

    robotCommand: '/admin/reception/robotCommand.jhtml'
  },
  statisticsAnalysis: {
    intelligentReport: '/admin/ecommerce/kpi/graph/service/intelligent.jhtml',
    intelligentTable: '/admin/ecommerce/kpi/table/service/intelligent.jhtml',
    intelligentExport: '/admin/ecommerce/kpi/export/service/intelligent.jhtml',
    serviceReport: '/admin/ecommerce/kpi/graph/service/service.jhtml',
    serviceTable: '/admin/ecommerce/kpi/table/service/service.jhtml',
    serviceExport: '/admin/ecommerce/kpi/export/service/service.jhtml'
  },
  // 流程问答
  processQA: {
    list: '/admin/knowledge/flowQAList.jhtml',
    flow: '/admin/knowledge/flowQA.jhtml',
    nodeList: '/admin/knowledge/flowKnowledgeTree.jhtml',
    node: '/admin/knowledge/flowKnowledgeNode.jhtml'
  }
};
