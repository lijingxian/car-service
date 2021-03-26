export default {
  // 营销导航页
  navInfo: '/admin/activity/queryNavigationKpi.jhtml',
  // 创建营销活动模板
  createActivityModel: '/admin/activityTemplate/json/create.jhtml',
  // 更新营销活动模板
  updateActivityModel: '/admin/activityTemplate/json/update.jhtml',
  // 查看营销活动模板
  getActivityModel: '/admin/activityTemplate/json/query.jhtml',
  // 删除营销活动模板
  deleteActivityModel: '/admin/activityTemplate/json/delete.jhtml',
  // 获取营销活动模板列表
  getActivityModelList: '/admin/activityTemplate/json/list.jhtml',

  // 获取添加活动时所需内容
  getInitInfo: '/admin/marketing/queryBasicInfo.jhtml',
  // 获取店铺列表
  getShopList: '/admin/member/json/findEShops.jhtml',

  // 营销活动
  Activity: '/admin/marketing/activity.jhtml',
  // 营销活动列表
  ActivityList: '/admin/marketing/union/listActivity.jhtml',
  // ActivityList: '/admin/marketing/listActivity.jhtml',
  // 搭配活动列表
  matchActivityList: '/admin/marketing/listMatchActivity.jhtml',
  // 奖品列表
  AwardList: '/admin/marketing/listPrize.jhtml',
  // 奖品
  Award: '/admin/marketing/prize.jhtml',
  // 活动参与列表
  ActivityParticipant: '/admin/marketing/listAttend.jhtml',
  // 帮砍价活动用户参与列表
  BKRecord: '/admin/marketing/listWechatAttend.jhtml',
  // 核销
  Verification: '/admin/marketing/verifyCancel.jhtml',
  // 活动内容
  ActivityContent: '/admin/marketing/activityContent.jhtml',
  // 活动通知
  ActivityNotice: '/admin/marketing/notice.jhtml',
  // 线下活动通知
  LocalActivityNotice: '/admin/localMarketing/notice.jhtml',
  // 发送线下活动通知
  PublishLocalActivityNotice: '/admin/localMarketing/sendNotice.jhtml',
  // 发送活动通知
  PublishActivityNotice: '/admin/marketing/sendNotice.jhtml',
  // 活动商品列表
  ActivityProduct: '/admin/marketing/listActivityProduct.jhtml',
  // 提交审核
  Verified: '/admin/auditTarget/auditTarget.jhtml',
  // 通过取消
  Pass: '/admin/auditTarget/audit.jhtml',
  // 发布营销
  Publish: '/admin/marketing/publishActivity.jhtml',
  // 撤回
  Revocation: '/admin/marketing/recallActivity.jhtml',
  // 导出
  exportAttend: '/admin/marketing/exportAttend.jhtml',

  // 促销基本信息查询
  PromotionBaseInfo_query: '/admin/promotion/queryBasicInfo.jhtml',
  // 促销基本信息创建/查询/修改
  PromotionBaseInfo_operate: '/admin/promotion/promotion.jhtml',
  // 促销基本信息创建/查询/修改-admin
  PromotionBaseInfo_operate_admin: '/admin/promotion/platform/promotion.jhtml',
  // 促销商品列表
  PromotionProductList: '/admin/promotion/listProduct.jhtml',
  // 发布促销
  PublishPromotion: '/admin/promotion/publishPromotion.jhtml',
  // 撤回促销
  RevocationPromotion: '/admin/promotion/recallPromotion.jhtml',

  // 发布促销
  PublishPromotionAdmin: '/admin/promotion/platform/publishPromotion.jhtml',
  // 撤回促销
  RevocationPromotionAdmin: '/admin/promotion/platform/recallPromotion.jhtml',

  // 促销内容
  // 查询
  PromotionContent_query: '/admin/promotion/content.jhtml',
  PromotionContent_query_admin: '/admin/promotion/platform/content.jhtml',
  // 查询赠品列表
  PromotionContent_queryGift: '/admin/promotion/listPromotionProduct.jhtml',
  // 查询套餐商品列表
  PromotionContent_queryProduct: '/admin/promotion/listPromotionProduct.jhtml',
  // 根据IDs查询套餐商品
  PromotionContent_queryProductByIds: '/admin/promotion/listPromotionProductByIds.jhtml',

  // 活动统计分析
  StatisticsAnalysis: '/admin/marketing/stasticsActivity.jhtml',
  // 活动KPI
  ActivityKPI: '/admin/marketing/queryMarketingKpi.jhtml',
  // 营销KPI
  PromotionKPI: '/admin/promotion/promotionKpi.jhtml',
  PromotionKPIAdmin: '/admin/promotion/platform/promotionKpi.jhtml',
  // 促销基本信息
  PromotionBaseInfo: '/admin/promotion/queryBasicInfo.jhtml',
  PromotionBaseInfoAdmin: '/admin/promotion/platform/queryBasicInfo.jhtml',
  // 促销统计分析视图
  PromotionKpi: '/admin/promotion/stasticsPromotion.jhtml',
  PromotionKpiAdmin: '/admin/promotion/platform/stasticsPromotion.jhtml',
  // 促销
  PromotionList: '/admin/promotion/union/listPromotion.jhtml',
  // 促销-admin
  PromotionListAdmin: '/admin/promotion/platform/listPromotion.jhtml',
  // 删除
  DeletePromotion: '/admin/promotion/promotion.jhtml',
  // 删除-admin
  DeletePromotionAdmin: '/admin/promotion/platform/promotion.jhtml',
  // 促销参与用户
  PromotionParticipant: '/admin/promotion/listPromotionAttend.jhtml',
  PromotionParticipantAdmin: '/admin/promotion/platform/listPromotionAttend.jhtml',
  // 查询促销活动通知
  PromotionNotice: '/admin/promotion/queryPromotionNotice.jhtml',
  PromotionNoticeAdmin: '/admin/promotion/platform/notice.jhtml',
  // 更新促销活动通知
  UpdataPromotionNotice: '/admin/promotion/notice.jhtml',
  UpdataPromotionNoticeAdmin: '/admin/promotion/platform/notice.jhtm',
  // 发送促销活动通知
  PublishPromotionNotice: '/admin/promotion/sendNotice.jhtml',
  PublishPromotionNoticeAdmin: '/admin/promotion/platform/sendNotice.jhtml',
  // 落地页获取活动content
  SiteContent: '/rest/marketing/queryPotentialActivityContent.jhtml',

  // 线下活动
  LocalList: '/admin/localMarketing/list.jhtml',
  CreateLocalActivity: '/admin/localMarketing/activity.jhtml',
  QueryBasicInfo: '/admin/localMarketing/basicInfo.jhtml',
  itemsList: '/admin/localMarketing/items/list.jhtml',
  backgrounds: '/admin/localMarketing/backgrounds.jhtml',
  localMarketingItem: '/admin/localMarketing/items/item.jhtml',
  prizesList: '/admin/localMarketing/prizes.jhtml',
  prizeItem: '/admin/localMarketing/prize.jhtml',
  attends: '/admin/localMarketing/attends.jhtml',
  exportlocalMarketingAttend: '/admin/localMarketing/exportAttend.jhtml',
  localMarketingStatistics: '/admin/localMarketing/statistics.jhtml',
  configure: '/admin/localMarketing/configure.jhtml',
  bigScreen: '/admin/localMarketing/bigScreen.jhtml',
  lottery: '/admin/localMarketing/lottery.jhtml',
  lotteryStart: '/admin/localMarketing/lottery/start.jhtml',
  lotteryStop: '/admin/localMarketing/lottery/stop.jhtml'
};