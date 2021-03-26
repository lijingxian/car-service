import responseHandle from '@/common/error/responseHandle';
import axios from 'axios';
import urls from '@/common/urls';

export default {
  getProductCategoryList(params, success, fail) {
    axios
      .get(urls.commodity.getProductCategoryList, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  deleteProductCategory(params, success, fail) {
    axios
      .delete(urls.commodity.deleteProductCategory, { data: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  getInputProductCategoryList(params, success, fail) {
    console.log('[---- dachao ----] [API-从平台导入-get] getInputProductCategoryList() params=', params);
    axios
      .get(urls.commodity.getInputProductCategoryList, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  saveInputProductCategoryList(params, success, fail) {
    console.log('[---- dachao ----] [API-从平台导入-post] saveInputProductCategoryList() params=', params);
    axios
      .post(urls.commodity.saveInputProductCategoryList, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  }
};
