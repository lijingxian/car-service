import responseHandle from '@/common/error/responseHandle';
import axios from 'axios';
import urls from '@/common/urls';

export default {
  create(params, success, fail) {
    axios
      .post(urls.recommendMgmt.create, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  update(params, success, fail) {
    axios
      .post(urls.recommendMgmt.update, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  get(params, success, fail) {
    axios
      .get(urls.recommendMgmt.get, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  getProducts(params, success, fail) {
    axios
      .get(urls.recommendMgmt.products, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  getADs(params, success, fail) {
    axios
      .get(urls.recommendMgmt.ADs, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  getArticles(params, success, fail) {
    axios
      .get(urls.recommendMgmt.articles, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  getVRs(params, success, fail) {
    axios
      .get(urls.recommendMgmt.VRs, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  getActivitiess(params, success, fail) {
    axios
      .get(urls.recommendMgmt.activities, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  getPromotions(params, success, fail) {
    axios
      .get(urls.recommendMgmt.promotions, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  }
};
