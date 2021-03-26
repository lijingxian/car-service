import responseHandle from '@/common/error/responseHandle';
import axios from 'axios';
import urls from '@/common/urls';

export default {
  getList(params, success, fail) {
    axios
      .get(urls.staffMgmt.getRoleList, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  init(params, success, fail) {
    axios
      .get(urls.staffMgmt.roleInit, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  delete(params, success, fail) {
    axios
      .post(urls.staffMgmt.roleDelete, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  get(params, success, fail) {
    axios
      .get(urls.staffMgmt.queryAuth, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  create(params, success, fail) {
    axios
      .post(urls.staffMgmt.roleCreate, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  update(params, success, fail) {
    axios
      .post(urls.staffMgmt.updateAuth, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  getAuthority(params, success, fail) {
    axios
      .get(urls.staffMgmt.roleGetAuth, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  }
};
