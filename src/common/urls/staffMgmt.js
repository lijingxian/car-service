export default {
  // 查询导航数据
  getNavInfo: '/admin/admin/queryNavigationKpi.jhtml',

  // 获取所有店铺列表
  queryAllShops: '/admin/member/json/findEShops.jhtml',
  // 获取管理员列表
  // getAdminList: '/admin/admin/json/list.jhtml',
  getAdminList: '/admin/admin/mgmt/admins.jhtml',
  // 查看管理员
  // adminSelect: '/admin/admin/json/query.jhtml',
  adminSelect: '/admin/admin/mgmt/admin.jhtml',
  // 打开添加管理员页面
  adminAdd: '/admin/admin/mgmt/admin/init.jhtml',
  // 点保存,管理员创建
  // adminCreate: '/admin/admin/json/create.jhtml',
  adminCreate: '/admin/admin/mgmt/admin.jhtml',
  // 修改管理员信息
  // adminEdit: '/admin/admin/json/update.jhtml',
  adminEdit: '/admin/admin/mgmt/admin.jhtml',
  // 管理员列表里更新管理员状态
  // adminUpdate: '/admin/admin/json/upateState.jhtml',
  adminUpdate: '/admin/admin/mgmt/admin/state.jhtml',
  // 修改管理员密码
  // editPass: '/admin/admin/json/updatePassword.jhtml',
  editPass: '/admin/admin/mgmt/admin/password.jhtml',
  getCompanyList: '/admin/company/json/list.jhtml',
  // 获取店铺列表
  getShopList: '/admin/admin/json/queryShops.jhtml',
  // 获取选中店铺的子店铺列表
  getChildShopList: '/admin/store/childrenShop.jhtml',
  // 获取角色列表
  getAllRoles: '/admin/admin/json/getVisibleRoles.jhtml',
  // 删除管理员
  // adminDelete: '/admin/admin/json/delete.jhtml',
  adminDelete: '/admin/admin/mgmt/admin.jhtml',
  // 获取角色列表
  getRoleList: '/admin/role/json/list.jhtml',
  // 查看角色
  roleSelect: '/admin/role/json/query.jhtml',
  // 初始化添加角色页面
  roleInit: '/admin/role/json/init.jhtml',
  // 添加角色
  roleCreate: '/admin/role/json/create.jhtml',
  // 编辑角色
  roleEdit: '/admin/role/json/update.jhtml',
  // 删除角色
  roleDelete: '/admin/role/json/delete.jhtml',
  // 获取权限列表
  roleGetAuth: '/admin/role/json/getAuthority.jhtml',

  // 角色权限更新NEW
  updateAuth: '/admin/role/json/update/v201901.jhtml',
  // updateAuth: '/admin/role/json/update.jhtml',
  // 查询角色权限
  queryAuth: '/admin/role/json/query/v201901.jhtml',
  // queryAuth: '/admin/role/json/query.jhtml',
  // 获取权限列表
  getAuthList: ''
};
