export default {
  // 列表页面
  listPage: {
    // 获取列表
    list: '/admin/fleet/json/listFleetMember.jhtml',
    // 删除内容
    delete: '/admin/fleet/json/deleteFleetMember.jhtml',
    // 查询可添加的成员
    queryMember: '/admin/fleet/json/queryMembers.jhtml',
    // 添加成员
    addMember: '/admin/fleet/json/addFleetMember.jhtml'
  },
  // 车友会签到
  signUp: {
    // 列表
    query: '/admin/fleet/listFleetSign.jhtml',
    // 导出
    export: '/admin/fleet/exportSign.jhtml',
    // 消息
    queryInfo: '/admin/fleet/signBox.jhtml'
  }
};
