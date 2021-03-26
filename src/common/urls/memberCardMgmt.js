export default {
  memberCard: {
    getList: '/admin/memberCard/json/list.jhtml', // 会员卡列表
    getMemberCardList: '/admin/memberCard/memberCards.jhtml', // 会员卡列表新
    getIntegralList: '/admin/point/json/list.jhtml', // 积分明细
    getlistUpgrade: '/admin/point/json/listUpgrade.jhtml', // 升级列表
    getlistVbean: '/admin/bean/json/list.jhtml', // V豆明细
    getlistStore: '/admin/deposit/json/list.jhtml', // 储值
    deleteManage: '/admin/memberCard/memberCard.jhtml', // 会员卡删除
    updateVipCardState: '/admin/memberCard/memberCard/state.jhtml', // 启用停用
    createVipCard: '/admin/memberCard/memberCard.jhtml', // 启用停用
    getVipCardGradeInfo: '/admin/memberRank/memberRank.jhtml', // 会员卡等级信息获取
    add: '/admin/point/json/upgrade.jhtml', // 升级保存
    addScore: '/admin/deposit/recharge.jhtml', // 储值保存
    VipCardGrade: '/admin/memberRank/memberRank.jhtml', // 会员卡等级
    deleteVipCardGrade: '/admin/memberRank/memberRank.jhtml', // 删除会员卡等级
    updateVipCardGrade: '/admin/memberRank/memberRank.jhtml', // 更新会员卡等级状态
    memberRankList: '/admin/memberRank/listMemberRank.jhtml', // 会员卡等级列表
    getImageUrl: '/rest/commonFileUpload.jhtml', // 获取图片url
    getVipCardInfo: '/admin/memberCard/memberCard.jhtml', // 获取会员卡详情
    updateGrade: '/admin/point/json/getRank.jhtml', // 根据积分获取等级
    saveVipCard: '/admin/memberCard/json/save.jhtml', // 新增会员卡
    amount: '/admin/memberCard/json/amount.jhtml', // 会员卡总额
    getVipAddInfo: '/admin/memberCard/json/add.jhtml', // 会员卡添加按钮执行的操作
    getVipCardTemplate: '/admin/memberCardTemplate/memberCardTemplate.jhtml', // 会员卡模板信息获取
    deleteTemplate: '/admin/memberCardTemplate/memberCardTemplate.jhtml', // 删除会员卡模板
    updateState: '/admin/memberCardTemplate/json/updateState.jhtml', // 更新会员卡启用停用状态
    updateTemplate: '/admin/memberCardTemplate/memberCardTemplate.jhtml', // 编辑会员卡模板
    getShops: '/admin/memberCardTemplate/json/getApplyShops.jhtml', // 获取适用店铺
    addTemplate: '/admin/memberCardTemplate/memberCardTemplate.jhtml', // 新增会员卡模板
    createBean: '/admin/bean/recharge.jhtml', // 添加V豆
    createPoint: '/admin/point/upgrade.jhtml', // 添加积分
    reduceDeposit: '/admin/deposit/charge.jhtml', // 扣款
    listCardTemplate: '/admin/memberCardTemplate/memberCardTemplatesAndRanks.jhtml', // 查询会员卡模版和等级
    distributeRights: '/admin/rights/distributeRankRights.jhtml', // 更新权益
    distributeAssignedRights: '/admin/rights/distributeAssignedRightsAndCoupon.jhtml', // 发放权益
    queryPeople: '/admin/member/members.jhtml', // 会员列表
    listProduct: '/admin/order/product/list.jhtml',
    setting: '/admin/rewardSet/setting.jhtml',
    listAuthority: '/admin/common/listAuthority/v201901.jhtml',
    memberCardBox: '/admin/memberCard/memberCardBox.jhtml',
    certificate: '/admin/order/voucher/settlement.jhtml',
    statistics: '/admin/memberCard/statistics.jhtml'
  },
  vipRights: {
    getFirstClassifies: '/admin/rights/json/init.jhtml',
    getList: '/admin/rights/json/list.jhtml',
    listDistributeRights: '/admin/rights/listDistributeRights.jhtml',
    get: '/admin/rights/json/query.jhtml',
    add: '/admin/rights/json/create.jhtml',
    edit: '/admin/rights/json/update.jhtml',
    delete: '/admin/rights/json/delete.jhtml',
    rightsCouponList: '/admin/rightscoupon/json/list.jhtml',
    rightsCouponCreate: '/admin/rightscoupon/json/create.jhtml',
    rightsCouponUpdate: '/admin/rightscoupon/json/update.jhtml',
    queryUserRights: '/admin/rights/rightsCoupons.jhtml',
    queryUserCoupons: '/admin/memberCard/myCoupons.jhtml',
    queryRightsCoupon: '/admin/rightscoupon/json/query.jhtml',
    deleteRightscoupon: '/admin/rightscoupon/json/delete.jhtml',
    verification: '/admin/rightscoupon/json/verification.jhtml',
    revoke: '/admin/rightscoupon/rightsCoupon/revoke.jhtml',
    voucher: '/admin/rightscoupon/voucher/verification.jhtml',
    listByRights: '/admin/rightscoupon/listByRights.jhtml',
    issuedList: '/admin/rightscoupon/statistics/issuedList.jhtml',
    usedList: '/admin/rightscoupon/usedList.jhtml'
  }
};
