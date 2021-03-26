import responseHandle from '@/common/error/responseHandle';
import axios from 'axios';
import urls from '@/common/urls';

export default {
  getProductAttributeList(params, success, fail) {
    console.log('[---- dachao ----] [API-属性编辑-get] getProductAttributeList() params=', params);
    axios
      .get(urls.commodity.getProductAttributeList, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  saveProductAttribute(params, success, fail) {
    console.log('[---- dachao ----] [API-属性编辑-post] saveProductAttribute() params=', params);
    axios
      .post(urls.commodity.saveProductAttribute, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  updateProductAttribute(params, success, fail) {
    console.log('[---- dachao ----] [API-属性编辑-put] updateProductAttribute() params=', params);
    axios
      .put(urls.commodity.updateProductAttribute, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  deleteProductAttribute(params, success, fail) {
    console.log('[---- dachao ----] [API-属性编辑-delete] deleteProductAttribute() params=', params);
    axios
      .delete(urls.commodity.deleteProductAttribute, { data: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  }
};
