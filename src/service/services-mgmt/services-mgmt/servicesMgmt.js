import responseHandle from '@/common/error/responseHandle';
import axios from 'axios';
import urls from '@/common/urls';

export default {
  listBusinessProduct(params, success, fail) {
    axios
      .get(urls.servicesMgmt.listBusinessProduct, {
        params: params
      })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  updateBusinessProductState(params, success, fail) {
    axios
      .put(urls.servicesMgmt.updateBusinessProductState, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  delete(params, success, fail) {
    axios
      .delete(urls.servicesMgmt.deleteBusinessProduct, {
        data: params
      })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  importBusinessProduct(params, success, fail) {
    axios
      .post(urls.servicesMgmt.importBusinessProduct, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  }
};
