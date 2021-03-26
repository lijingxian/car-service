import responseHandle from '@/common/error/responseHandle';
import axios from 'axios';
import urls from '@/common/urls';

export default {
  getRecommendList(params, success, fail) {
    axios
      .get(urls.recommendMgmt.getRecommendList, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  delete(params, success, fail) {
    axios
      .post(urls.recommendMgmt.delete, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  updatePublishStatus(params, success, fail) {
    axios
      .post(urls.recommendMgmt.updatePublishStatus, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  updateTopStatus(params, success, fail) {
    axios
      .post(urls.recommendMgmt.updateTopStatus, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  publishDynamic(params, success, fail) {
    axios
      .post('/admin/recommend/create.jhtml', params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  getMember(params, success, fail) {
    axios
      .get(urls.global.currentUser, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  }
};
