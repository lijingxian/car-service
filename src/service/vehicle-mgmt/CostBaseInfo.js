import responseHandle from '@/common/error/responseHandle';
import axios from 'axios';
import urls from '@/common/urls';

export default {
  query (params, success, fail) {
    axios
      .get(urls.vehicleMgmt.CostBaseInfo_query, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  add (params, success, fail) {
    axios
      .post(urls.vehicleMgmt.CostBaseInfo_save, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  update (params, success, fail) {
    axios
      .post(urls.vehicleMgmt.CostBaseInfo_save, params)
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
  }
};
