import responseHandle from '@/common/error/responseHandle';
import axios from 'axios';
import urls from '@/common/urls';

export default {
  getCategoryParameter(params, success, fail) {
    axios
      .get(urls.commodity.getCategoryParameter, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  deleteCategoryParameter(params, success, fail) {
    axios
      .delete(urls.commodity.deleteCategoryParameter, { data: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  saveCategoryParameter(params, success, fail) {
    axios
      .post(urls.commodity.saveCategoryParameter, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  updateCategoryParameter(params, success, fail) {
    axios
      .put(urls.commodity.updateCategoryParameter, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  }
};
