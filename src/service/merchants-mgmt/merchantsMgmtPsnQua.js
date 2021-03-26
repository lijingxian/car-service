import responseHandle from '@/common/error/responseHandle';
import axios from 'axios';
import urls from '@/common/urls';

export default {
  get(params, success, fail) {
    axios
      .get(urls.merchantsMgmt.selectPsnQua, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  save(params, success, fail) {
    axios
      .get(urls.merchantsMgmt.updatePsnQua, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  create(params, success, fail) {
    axios
      .get(urls.merchantsMgmt.createPsnQua, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  passed(params, success, fail) {
    axios
      .get(urls.merchantsMgmt.passedPsnQua, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  abandoned(params, success, fail) {
    axios
      .get(urls.merchantsMgmt.abandonedPsnQua, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  }
};
