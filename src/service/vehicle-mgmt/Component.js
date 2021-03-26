import responseHandle from '@/common/error/responseHandle';
import axios from 'axios';
import urls from '@/common/urls';

export default {
  queryPeople (params, success, fail) {
    axios
      .get(urls.vehicleMgmt.Component_queryPeople, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  queryVehicles (url, params, success, fail) {
    axios
      .get(url, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  }
};
