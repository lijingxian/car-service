const Motorists = resolve =>
  require(['@/pages/member/members-analysis/Motorists'], resolve);
const MotoristGeneralViewAnalysis = resolve =>
  require(['@/pages/member/members-analysis/motorists/GeneralViewAnalysis'], resolve);
const ContentGeneralViewAnalysis = resolve =>
  require(['@/pages/member/members-analysis/content/GeneralViewAnalysis'], resolve);
// 用户画像new
const UserPortraitAnalysis = resolve => require(['@/pages/member/member-user-portrait-analysis/UserPortraitAnalysis'], resolve);
const MemberPortraitAnalysis = resolve => require(['@/pages/member/member-user-portrait-analysis/MemberPortraitAnalysis'], resolve);
let MemberCardtemplateStaticMgmt = resolve =>
  require(['@/pages/member/member-card-template-mgmt/MemberCardTemplateStatic.vue'], resolve);
let MemberCardStaticMgmt = resolve =>
  require(['@/pages/member/members-analysis/member-card/GeneralViewAnalysis'], resolve);
let MemberNav = resolve => require(['@/pages/member/MemberNav.vue'], resolve);
let MemberReport = resolve =>
  require(['@/pages/member/members-analysis/report/MemberReport'], resolve);
let MemberCardReport = resolve =>
  require(['@/pages/member/members-analysis/report/MemberCardReport'], resolve);
const enter = [
  {
    path: '',
    component: MemberNav
  },
  {
    path: 'statistics-analysis',
    component: MemberNav
  },
  // 车友会分析
  {
    path: 'statistics-analysis/motorist',
    component: Motorists
  },
  // 社区统计分析-车友会
  {
    path: 'statistics-analysis/motorist/generalViewAnalysis',
    component: MotoristGeneralViewAnalysis
  },
  // 社区统计分析-内容
  {
    path: 'statistics-analysis/content/generalViewAnalysis',
    component: ContentGeneralViewAnalysis
  },
  // 用户画像new
  {
    path: 'statistics-analysis/user-portrait',
    redirect: 'statistics-analysis/user-portrait/member-portrait'
  },
  {
    path: 'statistics-analysis/user-portrait/member-portrait',
    component: UserPortraitAnalysis
  },
  {
    path: 'statistics-analysis/user-portrait/single-member-portrait',
    component: MemberPortraitAnalysis
  },
  // 会员卡模版统计
  {
    path: 'statistics-analysis/member/member-card-template-static',
    component: MemberCardtemplateStaticMgmt
  },
  // 会员卡统计
  {
    path: 'statistics-analysis/member/member-card-static',
    component: MemberCardStaticMgmt
  },
  // 会员月报
  {
    path: 'statistics-analysis/member/member-report',
    component: MemberReport
  },
  // 会员卡月报
  {
    path: 'statistics-analysis/member/member-card-report',
    component: MemberCardReport
  }
];

export default enter;
