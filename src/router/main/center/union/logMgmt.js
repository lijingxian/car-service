// 所有组件都要异步加载
// 导航页面
const UserLoginLogMgmt = resolve =>
  require(['@/pages/system/user-login-log-mgmt/UserLoginLogMgmt'], resolve);

const InterfaceLog = resolve =>
  require(['@/pages/system/log-mgmt/interfaceLog/InterfaceLog'], resolve);

const AdminOperateLog = resolve =>
  require(['@/pages/system/log-mgmt/adminOperateLog/AdminOperateLog'], resolve);

const UserOperateLog = resolve =>
  require(['@/pages/system/log-mgmt/userOperateLog/UserOperateLog'], resolve);

const TerminalLog = resolve =>
  require(['@/pages/system/log-mgmt/terminalLog/TerminalLog'], resolve);
const LogMgmt = resolve =>
  require(['@/pages/system/log-mgmt/systemLog/LogMgmt'], resolve);

const OnlineUserMgmt = resolve =>
  require(['@/pages/system/online-user-mgmt/OnlineUserMgmt'], resolve);
const enter = [
  // 日志管理
  {
    path: 'log',
    redirect: 'log/log-mgmt'
  },
  // 日志管理
  {
    path: 'log/log-mgmt',
    component: LogMgmt
  },
  // 接口日志
  {
    path: 'log/interface',
    component: InterfaceLog
  },
  // 用户操作日志
  {
    path: 'log/user-operat-log',
    component: UserOperateLog
  },
  // 管理员操作管理
  {
    path: 'log/admin-operate-log',
    component: AdminOperateLog
  },
  // 日志管理
  {
    path: 'log/terminal-log',
    component: TerminalLog
  },
  // 今日登录用户
  {
    path: 'online-user',
    component: OnlineUserMgmt
  },
  // 用户登录日志
  {
    path: 'login-log',
    component: UserLoginLogMgmt
  }
];

export default enter;
