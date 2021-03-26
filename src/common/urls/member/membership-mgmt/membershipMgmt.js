export default {
  // 列表页面
  mainPage: {
    // 获取列表
    list: '/admin/member/members.jhtml',
    // 获取店铺列表
    shopList: '/admin/member/json/findEShops.jhtml',
    // KPI
    kpi: '/admin/member/json/count.jhtml',

    // 删除内容
    delete: '/admin/member/member.jhtml',
    // 切换状态
    switchState: '/admin/member/member/state.jhtml'
  },

  // 基本信息
  baseInfo: {
    query: '/admin/member/member.jhtml',
    create: '/admin/member/member.jhtml',
    update: '/admin/member/member.jhtml'
  },

  // 车辆信息
  vehicleInfo: {
    list: '/admin/car/json/list.jhtml',
    delete: '/admin/car/json/delete.jhtml',
    add: '/admin/car/json/save.jhtml',
    update: '/admin/car/json/update.jhtml',
    deleteItem: '/admin/car/json/delete.jhtml'
  },

  // 实名认证
  certification: {
    query: '/admin/member/idCard.jhtml',
    certify: '/admin/member/idCard.jhtml'
  },
  // 会员卡列表
  memberCardList: '/admin/memberCard/memberCardsByMember.jhtml',
  // 福利列表
  rightsList: '/admin/memberCard/myCouponsByMember.jhtml',
  // 会员动态
  memberNews: '/admin/ecommerce/kpi/summary/member/news.jhtml'
};
