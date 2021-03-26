import responseHandle from '@/common/error/responseHandle';
import axios from 'axios';
import urls from '@/common/urls';

export default {
  get(params, success, fail) {
    axios
      .get(urls.merchantsMgmt.selectComQua, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  save(params, success, fail) {
    axios
      .get(urls.merchantsMgmt.updateComQua, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  create(params, success, fail) {
    axios
      .get(urls.merchantsMgmt.createComQua, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  passed(params, success, fail) {
    axios
      .get(urls.merchantsMgmt.passedComQua, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  abandoned(params, success, fail) {
    axios
      .get(urls.merchantsMgmt.abandonedComQua, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  }
};
