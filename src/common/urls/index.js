import maintenance from './maintenance';
import marketingStatistics from './marketingStatistics';
import merchantsMgmt from './merchantsMgmt';
import motoristsClubDynamic from './motoristsClubDynamic';
import motoristsClubActivity from './motoristsClubActivity';
import staffMgmt from './staffMgmt';
import terminalMgmt from './terminalMgmt';
import recommendMgmt from './recommendMgmt';
import vehicleMgmt from './vehicleMgmt';
import activityMgmt from './activityMgmt';
import federationMgmt from './federationMgmt';
import messageMgmt from './messageMgmt';
import commodity from './commodity';
import contentMgmt from './contentMgmt';
import shopRate from './shopRate';
import customerService from './customerService';
import communiMgmt from './communiMgmt';
import global from './global';
import potentialCustomerMgmt from './potentialCustomerMgmt';
import testDriveMgmt from './testDriveMgmt';
import faultAlarmSetting from './faultAlarmSetting';
import orderMgmt from './orderMgmt';
import newsMgmt from './newsMgmt';
import membersMgmt from './membersMgmt';
import memberCardMgmt from './memberCardMgmt';
import finacialProgramMgmt from './finacialProgramMgmt';
import logisticsMgmt from './logisticsMgmt';
import systemSetting from './systemSetting';
import mineBaseInfo from './mineBaseInfo';
import financeMgmt from './financeMgmt';
import servicesMgmt from './servicesMgmt';
import pushMgmt from './pushMgmt';
// 会员模块
import motorClubMgmt from './member/motor-club/motorClubMgmt';
import motorClubMemberMgmt from './member/motor-club/motorClubMemberMgmt';
import membershipMgmt from './member/membership-mgmt/membershipMgmt';
import memberCareMgmt from './memberCareMgmt';
// 卡券管理
import couponMgmt from './member/member-rights/couponMgmt';
// 权益管理
import memberRightsMgmt from './member/member-rights/memberRightsMgmt';

// 营销模块
import serviceRecommend from './marketing/push-mgmt/serviceRecommend';
import staticAnalisisi from './operating/staticAnalisisi';

// 系统
import shippingMethodMgmt from './system/shippingMethodMgmt';
import functionDefination from './system/functionDefination';

// 店铺
import shop from './shop';

// 进销存
import invoicing from './invoicing';

// 财务
import finance from './finance';

// 商城
import hypermarketMgmt from './hypermarket';

// 建站
import site from './site';

// 用户
import user from './user';

export default Object.assign(
  {
    user,
    customerService,
    maintenance,
    marketingStatistics,
    merchantsMgmt,
    motoristsClubDynamic,
    motoristsClubActivity,
    staffMgmt,
    terminalMgmt,
    recommendMgmt,
    vehicleMgmt,
    activityMgmt,
    federationMgmt,
    messageMgmt,
    commodity,
    contentMgmt,
    shopRate,
    communiMgmt,
    global,
    potentialCustomerMgmt,
    testDriveMgmt,
    faultAlarmSetting,
    orderMgmt,
    newsMgmt,
    membersMgmt,
    couponMgmt,
    memberRightsMgmt,
    finacialProgramMgmt,
    logisticsMgmt,
    systemSetting,
    motorClubMgmt,
    motorClubMemberMgmt,
    mineBaseInfo,
    membershipMgmt,
    financeMgmt,
    serviceRecommend,
    servicesMgmt,
    staticAnalisisi,
    pushMgmt,
    memberCardMgmt,
    memberCareMgmt,
    shippingMethodMgmt,
    functionDefination,
    invoicing,
    finance,
    hypermarketMgmt,
    site
  },
  shop
);

// 方便模块获取自己的那部分url，减少代码体积
export {
  customerService,
  maintenance,
  marketingStatistics,
  merchantsMgmt,
  motoristsClubDynamic,
  motoristsClubActivity,
  staffMgmt,
  terminalMgmt,
  recommendMgmt,
  vehicleMgmt,
  activityMgmt,
  federationMgmt,
  messageMgmt,
  commodity,
  contentMgmt,
  shopRate,
  communiMgmt,
  global,
  potentialCustomerMgmt,
  testDriveMgmt,
  faultAlarmSetting,
  orderMgmt,
  newsMgmt,
  membersMgmt,
  couponMgmt,
  memberRightsMgmt,
  finacialProgramMgmt,
  logisticsMgmt,
  systemSetting,
  motorClubMgmt,
  motorClubMemberMgmt,
  mineBaseInfo,
  membershipMgmt,
  financeMgmt,
  serviceRecommend,
  servicesMgmt,
  pushMgmt,
  memberCardMgmt,
  staticAnalisisi,
  shippingMethodMgmt,
  functionDefination,
  shop,
  invoicing,
  finance,
  hypermarketMgmt,
  site,
  user
};
