import responseHandle from '@/common/error/responseHandle';
import axios from 'axios';
import urls from '@/common/urls';

export default {
  getProductCategory(params, success, fail) {
    axios
      .get(urls.commodity.getProductCategory, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  saveProductCategory(params, success, fail) {
    axios
      .post(urls.commodity.saveProductCategory, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  updateProductCategory(params, success, fail) {
    axios
      .put(urls.commodity.updateProductCategory, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  }
};
