// 所有组件都要异步加载
let MemberNav = resolve => require(['@/pages/member/MemberNav.vue'], resolve);
let MembershipMgmt = resolve => require(['@/pages/member/membership-mgmt/MembershipMgmt.vue'], resolve);
let MemberassetsMgmt = resolve => require(['@/pages/member/membership-mgmt/MemberassetsMgmt.vue'], resolve);
let MotorClubMgmt = resolve => require(['@/pages/member/motor-club-mgmt/MotorClubMgmt.vue'], resolve);
let MotorClubMemberMgmt = resolve => require(['@/pages/member/motor-club-member-mgmt/MotorClubMemberMgmt.vue'], resolve);
// 车友会成员签到
let MotorClubMemberSignUp = resolve => require(['@/pages/member/motor-club-member-mgmt/MotorClubMemberSignUp.vue'], resolve);
let MemberCardMgmt = resolve => require(['@/pages/member/member-card-mgmt/MemberCardList.vue'], resolve);
let MemberCardtemplateMgmt = resolve => require(['@/pages/member/member-card-template-mgmt/MemberCardTemplateList.vue'], resolve);
let CareCardMgmt = resolve => require(['@/pages/member/member-care-mgmt/care-card-mgmt/MemberCareMgmt.vue'], resolve);
let CareCardCategory = resolve => require(['@/pages/member/member-care-mgmt/care-card-category/CategoryMgmt.vue'], resolve);
let MemberCardtemplateStaticMgmt = resolve =>
  require(['@/pages/member/member-card-template-mgmt/MemberCardTemplateStatic.vue'], resolve);
let QuestionAnswerRelease = resolve =>
  require(['@/pages/member/motorists-club-question-answer/QuestionAnswerRelease.vue'], resolve);
let ArticlePublish = resolve => require(['@/pages/member/motorists-club-article/ArticlePublish.vue'], resolve);
let CouponMgmt = resolve => require(['@/pages/member/member-rights/coupon-mgmt/CouponMgmt.vue'], resolve);
let MemberRightsMgmtNew = resolve => require(['@/pages/member/member-rights/member-rights-mgmt/MemberRightsMgmt.vue'], resolve);
let MemberCareTemplate = resolve =>
  require(['@/pages/member/member-care-mgmt/model-mgmt/MemberCareModelMgmt.vue'], resolve);
const enter = [
  // 会籍导航
  {
    path: '',
    component: MemberNav
  },
  // 会籍导航
  {
    path: 'member-card',
    component: MemberNav
  },
  // 会籍管理
  {
    path: 'membership-mgmt',
    component: MembershipMgmt
  },
  // 会员资产
  {
    path: 'memberassets-mgmt',
    component: MemberassetsMgmt
  },
  // 会员卡模版统计
  {
    path: 'member-card/templateStatic',
    component: MemberCardtemplateStaticMgmt
  },
  // 会员卡管理
  {
    path: 'member-card/member-card/:isEdit',
    component: MemberCardMgmt
  },
  // 会员卡体系管理
  {
    path: 'member-card/member/member-card-template/:isEdit',
    component: MemberCardtemplateMgmt
  },
  {
    path: 'member-card/:isEdit/:templateId',
    component: MemberCardMgmt
  },
  // 关怀卡管理
  {
    path: 'member-care-mgmt',
    component: MemberNav
  },
  {
    path: 'member-care-mgmt/care',
    component: CareCardMgmt
  },
  // 关怀卡分类
  {
    path: 'member-care-mgmt/category',
    component: CareCardCategory
  },
  // 关怀卡模板
  {
    path: 'member-care-mgmt/template',
    component: MemberCareTemplate
  },
  // 车友会管理
  {
    path: 'motor-club/fleetMember',
    component: MotorClubMgmt
  },
  {
    path: 'motor-club',
    component: MemberNav
  },
  // 车友会成员管理
  {
    path: 'motor-club/fleetMember/:fleetId',
    component: MotorClubMemberMgmt
  },
  // 车友社区问答发布
  {
    path: 'motor-club/question-answer-release',
    component: QuestionAnswerRelease
  },
  // 车友社区文章发布
  {
    path: 'motor-club/article-publish',
    component: ArticlePublish
  },
  // 车友会成员签到
  {
    path: 'motor-club/signup/:fleetId',
    component: MotorClubMemberSignUp
  },
  // 会员卡体系统计
  {
    path: 'member-card-template-static',
    component: MemberCardtemplateStaticMgmt
  },
  // 卡券管理
  {
    path: 'member-rights-mgmt',
    component: MemberNav
  },
  // 卡券管理
  {
    path: 'member-rights-mgmt/coupon-mgmt',
    component: CouponMgmt
  },
  // 权益管理
  {
    path: 'member-rights-mgmt/rights-mgmt',
    component: MemberRightsMgmtNew
  }
];

export default enter;
