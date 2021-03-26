import responseHandle from '@/common/error/responseHandle';
import axios from 'axios';
import urls from '@/common/urls';

export default {
  getKPI(params, success, fail) {
    axios
      .get(urls.activityMgmt.PromotionKPI, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 获取店铺列表
  getShopList(params, success, fail) {
    axios
      .get(urls.activityMgmt.getShopList, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  queryBaseInfo(params, success, fail) {
    axios
      .get(urls.activityMgmt.PromotionBaseInfo_query, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  queryBaseInfoAdmin(params, success, fail) {
    axios
      .get(urls.activityMgmt.PromotionBaseInfo_query_admin, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  getPromotionList(params, success, fail) {
    axios
      .get(urls.activityMgmt.PromotionList, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  getPromotionListAdmin(params, success, fail) {
    axios
      .get(urls.activityMgmt.PromotionListAdmin, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  deletePromotionList(params, success, fail) {
    axios
      .delete(urls.activityMgmt.DeletePromotion, { data: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  deletePromotionListAdmin(params, success, fail) {
    axios
      .delete(urls.activityMgmt.DeletePromotionAdmin, { data: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  getPromotionParticipant(params, success, fail) {
    axios
      .get(urls.activityMgmt.PromotionParticipant, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  getPromotionParticipantAdmin(params, success, fail) {
    axios
      .get(urls.activityMgmt.PromotionParticipantAdmin, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  getPromotionNotice(params, success, fail) {
    axios
      .get(urls.activityMgmt.PromotionNotice, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  getPromotionNoticeAdmin(params, success, fail) {
    axios
      .get(urls.activityMgmt.PromotionNoticeAdmin, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  updatePromotionNotice(params, success, fail) {
    axios
      .put(urls.activityMgmt.UpdataPromotionNotice, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  updatePromotionNoticeAdmin(params, success, fail) {
    axios
      .put(urls.activityMgmt.UpdataPromotionNoticeAdmin, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  publishPromotionNotice(params, success, fail) {
    axios
      .post(urls.activityMgmt.PublishPromotionNotice, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  publishPromotionNoticeAdmin(params, success, fail) {
    axios
      .post(urls.activityMgmt.PublishPromotionNoticeAdmin, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  getStatisticsAnalysis(params, success, fail) {
    axios
      .get(urls.activityMgmt.StatisticsAnalysis, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 发布促销活动
  publishPromotion(params, success, fail) {
    axios
      .get(urls.activityMgmt.PublishPromotion, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 发布促销活动
  publishPromotionAdmin(params, success, fail) {
    axios
      .get(urls.activityMgmt.PublishPromotionAdmin, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 撤回促销活动
  RevocationPromotion(params, success, fail) {
    axios
      .get(urls.activityMgmt.RevocationPromotion, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 撤回促销活动
  RevocationPromotionAdmin(params, success, fail) {
    axios
      .get(urls.activityMgmt.RevocationPromotionAdmin, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  }
};
