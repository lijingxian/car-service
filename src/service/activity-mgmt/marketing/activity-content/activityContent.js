import responseHandle from '@/common/error/responseHandle';
import axios from 'axios';
import urls from '@/common/urls';

export default {
  getProducts(params, success, fail) {
    axios
      .get(urls.recommendMgmt.products, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  getProductList(params, success, fail) {
    axios
      .get(urls.activityMgmt.ActivityProduct, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  getActivityContent(params, success, fail) {
    axios
      .get(urls.activityMgmt.ActivityContent, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  updateActivityContent(params, success, fail) {
    axios
      .put(urls.activityMgmt.ActivityContent, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  }
};
