import responseHandle from '@/common/error/responseHandle';
import axios from 'axios';
import urls from '@/common/urls';

export default {
  getServicesOrderList(params, success, fail) {
    axios
      .get(urls.servicesMgmt.getServicesOrderList, {
        params: params
      })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  queryFilters(params, success, fail) {
    axios
      .get(urls.servicesMgmt.queryFilters, {
        params: params
      })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  }
};
