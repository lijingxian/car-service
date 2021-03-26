import responseHandle from '@/common/error/responseHandle';
import axios from 'axios';
import urls from '@/common/urls';

export default {
  query (params, success, fail) {
    axios
      .get(urls.vehicleMgmt.VehicleMgmtCost_query, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  queryPlateNumbers (params, success, fail) {
    axios
      .get(urls.vehicleMgmt.VehicleMgmtCost_queryPlateNumbers, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  queryPersonList (params, success, fail) {
    axios
      .get(urls.vehicleMgmt.VehicleMgmtCost_queryPersonList, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  queryStateList (params, success, fail) {
    axios
      .get(urls.vehicleMgmt.VehicleMgmtCost_queryStateList, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  queryTypeList (params, success, fail) {
    axios
      .get(urls.vehicleMgmt.VehicleMgmtCost_queryTypeList, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  export (params) {
    console.log(params);
    window.open(
      urls.vehicleMgmt.VehicleMgmtCost_export +
      '?fleetId=' + params.fleetId +
      (params.ids ? '&ids=' + params.ids : '') +
      (params.carId ? '&carId=' + params.carId : '') +
      (params.carCostType ? '&carCostType=' + params.carCostType : '') +
      (params.memberId ? '&memberId=' + params.memberId : '') +
      (params.state ? '&state=' + params.state : '') +
      (params.beginDate ? '&beginDate=' + params.beginDate : '') +
      (params.endDate ? '&endDate=' + params.endDate : '')
    );
  }
};
