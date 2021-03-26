import responseHandle from '@/common/error/responseHandle';
import axios from 'axios';
import urls from '@/common/urls';

export default {
  query (params, success, fail) {
    axios
      .get(urls.vehicleMgmt.VehicleElecFence_query, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  queryRule (params, success, fail) {
    axios
      .get(urls.vehicleMgmt.VehicleElecFence_fence, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  deleteRule (params, success, fail) {
    axios
      .delete(urls.vehicleMgmt.VehicleElecFence_fence, { data: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  updateRule (params, success, fail) {
    axios
      .put(urls.vehicleMgmt.VehicleElecFence_fence, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  addRule (params, success, fail) {
    axios
      .post(urls.vehicleMgmt.VehicleElecFence_fence, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  }
};
