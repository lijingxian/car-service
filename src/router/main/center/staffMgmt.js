// 所有组件都要异步加载

let StaffMgmtNav = resolve => require(['@/pages/operating/staff-mgmt/StaffMgmtNav.vue'], resolve);
let AdminMgmt = resolve => require(['@/pages/operating/staff-mgmt/AdminMgmt.vue'], resolve);
let RoleMgmt = resolve => require(['@/pages/operating/staff-mgmt/RoleMgmt.vue'], resolve);
let RoleEdit = resolve => require(['@/pages/operating/staff-mgmt/RoleEdit.vue'], resolve);

const enter = [
  // 员工管理导航
  {
    path: 'staff-mgmt',
    component: StaffMgmtNav
  },
  // 用户管理
  {
    path: 'staff-mgmt/admin',
    component: AdminMgmt
  },
  // 角色管理
  {
    path: 'staff-mgmt/role',
    component: RoleMgmt
  },
  // 角色编辑
  {
    path: 'staff-mgmt/role-edit',
    component: RoleEdit
  }
];

export default enter;
