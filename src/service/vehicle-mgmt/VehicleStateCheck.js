import responseHandle from '@/common/error/responseHandle';
import axios from 'axios';
import urls from '@/common/urls';

export default {
  query (params, success, fail) {
    axios
      .get(urls.vehicleMgmt.VehicleStateCheck_query, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  queryState (params, success, fail) {
    axios
      .post(urls.vehicleMgmt.VehicleStateCheck_queryState, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  check (params, success, fail) {
    axios
      .get(urls.vehicleMgmt.VehicleStateCheck_check, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  checkDetail (params, success, fail) {
    axios
      .get(urls.vehicleMgmt.VehicleStateCheck_checkDetail, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  checkExpire (params, success, fail) {
    axios
      .put(urls.vehicleMgmt.VehicleStateCheck_checkExpire, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  }
};
