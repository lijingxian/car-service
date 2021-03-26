import responseHandle from '@/common/error/responseHandle';
import axios from 'axios';
import urls from '@/common/urls';

export default {
  query (params, success, fail) {
    axios
      .get(urls.shopRate.RecommendMgmt_recommend, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  add (params, success, fail) {
    axios
      .post(urls.shopRate.RecommendMgmt_recommend, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  update (params, success, fail) {
    axios
      .put(urls.shopRate.RecommendMgmt_recommend, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  }
};
