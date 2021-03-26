import responseHandle from '@/common/error/responseHandle';
import axios from 'axios';
import urls from '@/common/urls';

export default {
  query (params, success, fail) {
    axios
      .get(urls.vehicleMgmt.VehicleDataStream_query, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  saveDefault (params, success, fail) {
    axios
      .get(urls.vehicleMgmt.VehicleDataStream_saveDeafult, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  dataControl (params, success, fail) {
    axios
      .get(urls.vehicleMgmt.VehicleDataStream_control, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  queryChartStream (params, success, fail) {
    axios
      .get(urls.vehicleMgmt.VehicleDataStream_queryChartStream, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  }
};
