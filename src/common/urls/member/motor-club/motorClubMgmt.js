export default {
  // 列表页面
  listPage: {
    // 获取列表
    list: '/admin/fleet/json/list.jhtml',
    // 删除内容
    delete: '/admin/fleet/delete.jhtml'
  },

  // 基本信息
  baseInfo: {
    // 查询
    query: '/admin/fleet/json/query.jhtml',
    // 查询可添加的成员
    queryMember: '/admin/fleet/json/queryMembers.jhtml',
    // 查询店铺列表
    queryShopList: '/admin/member/json/findEShops.jhtml',
    // 保存
    save: '/admin/fleet/json/createOrUpdate.jhtml'
  },

  // 公告
  notice: {
    list: '/admin/fleet/message/json/list.jhtml',
    add: '/admin/fleet/message/json/create.jhtml',
    delete: '/admin/fleet/message/json/delete.jhtml'
  }
};
