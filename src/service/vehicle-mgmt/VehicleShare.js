import responseHandle from '@/common/error/responseHandle';
import axios from 'axios';
import urls from '@/common/urls';

export default {
  query (params, success, fail) {
    axios
      .get(urls.vehicleMgmt.VehicleShare_query, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  queryRule (params, success, fail) {
    axios
      .get(urls.vehicleMgmt.VehicleShare_queryRule, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  deleteRule (params, success, fail) {
    axios
      .post(urls.vehicleMgmt.VehicleShare_deleteRules, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  addRule (params, success, fail) {
    axios
      .post(urls.vehicleMgmt.VehicleShare_addRule, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  switchStatus (params, success, fail) {
    axios
      .post(urls.vehicleMgmt.VehicleShare_switchStatus, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  }
};
