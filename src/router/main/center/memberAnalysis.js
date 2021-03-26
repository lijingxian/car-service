const Motorists = resolve =>
  require(['@/pages/member/members-analysis/Motorists'], resolve);
const MotoristGeneralViewAnalysis = resolve =>
  require(['@/pages/member/members-analysis/motorists/GeneralViewAnalysis'], resolve);
const ContentGeneralViewAnalysis = resolve =>
  require(['@/pages/member/members-analysis/content/GeneralViewAnalysis'], resolve);
// 用户画像new
const UserPortraitAnalysis = resolve => require(['@/pages/member/member-user-portrait-analysis/UserPortraitAnalysis'], resolve);
const MemberPortraitAnalysis = resolve => require(['@/pages/member/member-user-portrait-analysis/MemberPortraitAnalysis'], resolve);

const enter = [
  {
    path: 'statistics-analysis',
    redirect: 'statistics-analysis/user-portrait'
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
  }
];

export default enter;
