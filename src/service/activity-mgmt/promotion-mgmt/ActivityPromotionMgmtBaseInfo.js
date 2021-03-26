import responseHandle from '@/common/error/responseHandle';
import axios from 'axios';
import urls from '@/common/urls';

export default {
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
  queryProductList(params, success, fail) {
    axios
      .get(urls.activityMgmt.PromotionProductList, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  query(params, success, fail) {
    axios
      .get(urls.activityMgmt.PromotionBaseInfo_operate, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  queryAdmin(params, success, fail) {
    axios
      .get(urls.activityMgmt.PromotionBaseInfo_operate_admin, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  create(params, success, fail) {
    axios
      .post(urls.activityMgmt.PromotionBaseInfo_operate, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  createAdmin(params, success, fail) {
    axios
      .post(urls.activityMgmt.PromotionBaseInfo_operate_admin, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  update(params, success, fail) {
    axios
      .put(urls.activityMgmt.PromotionBaseInfo_operate, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  updateAdmin(params, success, fail) {
    axios
      .put(urls.activityMgmt.PromotionBaseInfo_operate_admin, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  }
};
