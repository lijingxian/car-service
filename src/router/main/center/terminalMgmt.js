// 所有组件都要异步加载
let TerminalMgmtNav = resolve =>
  require(['@/pages/operating/terminal-mgmt-new/TerminalMgmtNav.vue'], resolve);
let TerminalMgmtClassPre = resolve =>
  require(['@/pages/operating/terminal-mgmt-new/TerminalMgmtClass.Pre.vue'], resolve);
let TerminalMgmtTerminal = resolve =>
  require(['@/pages/operating/terminal-mgmt-new/TerminalMgmtTerminal.vue'], resolve);
const enter = [
  // 终端管理导航
  {
    path: 'terminal-mgmt',
    component: TerminalMgmtNav
  },
  // 终端类型
  {
    path: 'terminal-mgmt/terminal-type',
    component: TerminalMgmtClassPre
  },
  // 全部终端
  {
    path: 'terminal-mgmt/terminal-all',
    component: TerminalMgmtTerminal
  },
  // 终端详情页面,根据query的不同显示不同的终端
  {
    path: 'terminal-mgmt/terminal-type/:terminalTypeId/:terminalTypeName',
    component: TerminalMgmtTerminal
  },
  // 车辆管理会跳转到这页
  {
    name: 'terminal-mgmt-terminal-search',
    path: 'terminal-mgmt-terminal-search/:terminalTypeId/:terminalTypeName/:terminalNumber?',
    component: TerminalMgmtTerminal
  }
];

export default enter;
