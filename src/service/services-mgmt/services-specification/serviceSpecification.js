import responseHandle from '@/common/error/responseHandle';
import axios from 'axios';
import urls from '@/common/urls';

export default {
  querySpecification(params, success, fail) {
    axios
      .get(urls.servicesMgmt.querySpecification, {
        params: params
      })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  updateSpecification(params, success, fail) {
    axios
      .put(urls.servicesMgmt.updateSpecification, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  createSpecification(params, success, fail) {
    axios
      .post(urls.servicesMgmt.createSpecification, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  deleteSpecification(params, success, fail) {
    axios
      .delete(urls.servicesMgmt.deleteSpecification, {
        data: params
      })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  }
};
