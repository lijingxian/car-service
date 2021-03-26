import responseHandle from '@/common/error/responseHandle';
import axios from 'axios';
import urls from '@/common/urls';

export default {
  getSpecificationGroups(params, success, fail) {
    console.log('[---- dachao ----] [API-商品规格-get] getSpecificationGroups() params=', params);
    axios
      .get(urls.commodity.getSpecificationGroups, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  updateSpecificationGroups(params, success, fail) {
    console.log('[---- dachao ----] [API-商品规格-put] updateSpecificationGroups() params=', params);
    axios
      .put(urls.commodity.updateSpecificationGroups, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  }
};
