import responseHandle from '@/common/error/responseHandle';
import axios from 'axios';
import urls from '@/common/urls';

export default {
  // 获取列表
  getList(params, success, fail) {
    axios
      .get(urls.memberCardMgmt.memberCard.getMemberCardList, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 获取权益列表
  getRightsList(params, success, fail) {
    axios
      .get(urls.memberCardMgmt.vipRights.getList, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },

  listDistributeRights(params, success, fail) {
    axios
      .get(urls.memberCardMgmt.vipRights.listDistributeRights, {
        params: params
      })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 获取等级和模版列表
  listCardTemplate(params, success, fail) {
    axios
      .get(urls.memberCardMgmt.memberCard.listCardTemplate, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 获取V豆列表
  getlistVbean(params, success, fail) {
    axios
      .get(urls.memberCardMgmt.memberCard.getlistVbean, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 获取积分列表
  getIntegralList(params, success, fail) {
    axios
      .get(urls.memberCardMgmt.memberCard.getIntegralList, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 获取商品列表
  listProduct(params, success, fail) {
    axios
      .get(urls.memberCardMgmt.memberCard.listProduct, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 获取权益券列表
  queryUserRights(params, success, fail) {
    axios
      .get(urls.memberCardMgmt.vipRights.queryUserRights, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 获取用户优惠券列表
  queryUserCoupons(params, success, fail) {
    axios
      .get(urls.memberCardMgmt.vipRights.queryUserCoupons, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 获取权益券列表
  listByRights(params, success, fail) {
    axios
      .get(urls.memberCardMgmt.vipRights.listByRights, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 获取会员卡详情
  getVipCardInfo(params, success, fail) {
    axios
      .get(urls.memberCardMgmt.memberCard.getVipCardInfo, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 获取会员卡模版
  getVipCardTemplate(params, success, fail) {
    axios
      .get(urls.memberCardMgmt.memberCard.getVipCardTemplate, {
        params: params
      })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 获取会员卡等级
  memberRankList(params, success, fail) {
    axios
      .get(urls.memberCardMgmt.memberCard.memberRankList, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 获取会员奖励设置
  setting(params, success, fail) {
    axios
      .get(urls.memberCardMgmt.memberCard.setting, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 更新会员奖励设置
  settingUpdate(params, success, fail) {
    axios
      .post(urls.memberCardMgmt.memberCard.setting, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 获取会员
  queryPeople(params, success, fail) {
    axios
      .get(urls.memberCardMgmt.memberCard.queryPeople, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 删除卡
  delete(params, success, fail) {
    axios
      .delete(urls.memberCardMgmt.memberCard.deleteManage, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 核销
  verification(params, success, fail) {
    axios
      .post(urls.memberCardMgmt.vipRights.verification, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 更新会员卡模版
  updateTemplate(params, success, fail) {
    axios
      .put(urls.memberCardMgmt.memberCard.updateTemplate, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 创建会员卡模版
  createTemplate(params, success, fail) {
    axios
      .post(urls.memberCardMgmt.memberCard.updateTemplate, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 删除会员卡模版
  delTemplate(params, success, fail) {
    axios
      .delete(urls.memberCardMgmt.memberCard.updateTemplate, { data: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 更新权益
  distributeRights(params, success, fail) {
    axios
      .post(urls.memberCardMgmt.memberCard.distributeRights, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 发放权益
  distributeAssignedRights(params, success, fail) {
    axios
      .post(urls.memberCardMgmt.memberCard.distributeAssignedRights, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 启用停用
  updateVipCardState(params, success, fail) {
    axios
      .put(urls.memberCardMgmt.memberCard.updateVipCardState, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 创建会员卡
  createVipCard(params, success, fail) {
    axios
      .post(urls.memberCardMgmt.memberCard.createVipCard, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 创建V豆
  createBean(params, success, fail) {
    axios
      .post(urls.memberCardMgmt.memberCard.createBean, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 创建积分
  createPoint(params, success, fail) {
    axios
      .post(urls.memberCardMgmt.memberCard.createPoint, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 储值
  addScore(params, success, fail) {
    axios
      .post(urls.memberCardMgmt.memberCard.addScore, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 扣款
  reduceDeposit(params, success, fail) {
    axios
      .post(urls.memberCardMgmt.memberCard.reduceDeposit, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 升级列表
  getlistUpgrade(params, success, fail) {
    axios
      .get(urls.memberCardMgmt.memberCard.getlistUpgrade, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 余额充值列表
  getlistStore(params, success, fail) {
    axios
      .get(urls.memberCardMgmt.memberCard.getlistStore, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 根据积分获取等级
  updateGrade(params, success, fail) {
    axios
      .get(urls.memberCardMgmt.memberCard.updateGrade, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 会员卡等级信息获取
  getVipCardGradeInfo(params, success, fail) {
    axios
      .get(urls.memberCardMgmt.memberCard.getVipCardGradeInfo, {
        params: params
      })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 会员卡等级信息更新
  editVipCardGrade(params, success, fail) {
    axios
      .put(urls.memberCardMgmt.memberCard.VipCardGrade, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 会员卡等级信息添加
  addVipCardGrade(params, success, fail) {
    axios
      .post(urls.memberCardMgmt.memberCard.VipCardGrade, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 会员卡等级信息删除
  delVipCardGrade(params, success, fail) {
    axios
      .delete(urls.memberCardMgmt.memberCard.VipCardGrade, { data: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  listAuthority(params, success, fail) {
    axios
      .get(urls.memberCardMgmt.memberCard.listAuthority, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 会员权益列表
  vipRightsList(params, success, fail) {
    axios
      .get(urls.memberCardMgmt.vipRights.getList, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 会员权益列表
  queryrightsClass(params, success, fail) {
    axios
      .get(urls.memberCardMgmt.vipRights.get, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 上级权益列表
  getFirstClassifies(params, success, fail) {
    axios
      .get(urls.memberCardMgmt.vipRights.getFirstClassifies, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 权益券列表
  rightsCouponList(params, success, fail) {
    axios
      .get(urls.memberCardMgmt.vipRights.rightsCouponList, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 查询权益券
  queryRightsCoupon(params, success, fail) {
    axios
      .get(urls.memberCardMgmt.vipRights.queryRightsCoupon, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 查询会员卡导航信息
  memberCardBox(params, success, fail) {
    axios
      .get(urls.memberCardMgmt.memberCard.memberCardBox, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 更新权益/权益分类
  editRightsClass(params, success, fail) {
    axios
      .put(urls.memberCardMgmt.vipRights.edit, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 创建权益/权益分类
  createRightsClass(params, success, fail) {
    axios
      .post(urls.memberCardMgmt.vipRights.add, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 更新权益券
  rightsCouponUpdate(params, success, fail) {
    axios
      .put(urls.memberCardMgmt.vipRights.rightsCouponUpdate, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 创建权益券
  rightsCouponCreate(params, success, fail) {
    axios
      .post(urls.memberCardMgmt.vipRights.rightsCouponCreate, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 删除权益券
  deleteRightscoupon(params, success, fail) {
    axios
      .delete(urls.memberCardMgmt.vipRights.deleteRightscoupon, {
        data: params
      })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 删除权益
  deleteRights(params, success, fail) {
    axios
      .delete(urls.memberCardMgmt.vipRights.delete, { data: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  certificate(params, success, fail) {
    axios
      .get(urls.memberCardMgmt.memberCard.certificate, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  }
};
