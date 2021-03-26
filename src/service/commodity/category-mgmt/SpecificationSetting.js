import responseHandle from '@/common/error/responseHandle';
import axios from 'axios';
import urls from '@/common/urls';

export default {
  getProductSpecificationList(params, success, fail) {
    console.log('[---- dachao ----] [API-规格编辑-get] getProductSpecificationList() params=', params);
    axios
      .get(urls.commodity.getProductSpecificationList, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  saveProductSpecification(params, success, fail) {
    console.log('[---- dachao ----] [API-规格编辑-post] saveProductSpecification() params=', params);
    axios
      .post(urls.commodity.saveProductSpecification, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  updateProductSpecification(params, success, fail) {
    console.log('[---- dachao ----] [API-规格编辑-put] updateProductSpecification() params=', params);
    axios
      .put(urls.commodity.updateProductSpecification, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  deleteProductSpecification(params, success, fail) {
    console.log('[---- dachao ----] [API-规格编辑-delete] updateProductSpecification() params=', params);
    axios
      .delete(urls.commodity.deleteProductSpecification, { data: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  }
};
