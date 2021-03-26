import responseHandle from '@/common/error/responseHandle';
import axios from 'axios';
import urls from '@/common/urls';

export default {
  query(params, success, fail) {
    axios
      .get(urls.activityMgmt.PromotionContent_query, {
        params: params
      })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  update(params, success, fail) {
    axios
      .put(urls.activityMgmt.PromotionContent_query, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  queryGiftList(params, success, fail) {
    axios
      .get(urls.activityMgmt.PromotionContent_queryGift, {
        params: params
      })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  queryProductList(params, success, fail) {
    axios
      .get(urls.activityMgmt.PromotionContent_queryProduct, {
        params: params
      })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 查询各项基本信息
  queryBaseInfo(params, success, fail) {
    axios
      .get(urls.activityMgmt.PromotionBaseInfo_query, {
        params: params
      })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  }
};
