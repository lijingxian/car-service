import responseHandle from '@/common/error/responseHandle';
import axios from 'axios';
import urls from '@/common/urls';

export default {
  queryBusinessProduct(params, success, fail) {
    axios
      .get(urls.servicesMgmt.queryBusinessProduct, {
        params: params
      })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  updateBusinessProduct(params, success, fail) {
    axios
      .put(urls.servicesMgmt.updateBusinessProduct, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  updateBusinessSpecification(params, success, fail) {
    axios
      .put(urls.servicesMgmt.updateBusinessSpecification, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  createBusinessProduct(params, success, fail) {
    axios
      .post(urls.servicesMgmt.createBusinessProduct, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  queryInit(params, success, fail) {
    axios
      .get(urls.servicesMgmt.queryInit, {
        params: params
      })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  }
};
