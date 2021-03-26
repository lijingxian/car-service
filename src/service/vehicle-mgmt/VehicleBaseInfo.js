import responseHandle from '@/common/error/responseHandle';
import axios from 'axios';
import urls from '@/common/urls';

export default {
  query (params, success, fail) {
    axios
      .get(urls.vehicleMgmt.VehicleBaseInfo_query, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  queryShopList (params, success, fail) {
    axios
      .get(urls.vehicleMgmt.Component_queryShops, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  queryBrandList (params, success, fail) {
    axios
      .get(urls.vehicleMgmt.Component_queryBrands, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  querySeriesList (params, success, fail) {
    axios
      .get(urls.vehicleMgmt.Component_querySeries, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  queryTypeList (params, success, fail) {
    axios
      .get(urls.vehicleMgmt.Component_queryTypes, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  queryDimList (params, success, fail) {
    axios
      .get(urls.vehicleMgmt.VehicleBaseInfo_queryDimList, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  queryInsuranceList (params, success, fail) {
    axios
      .get(urls.vehicleMgmt.VehicleBaseInfo_queryInsuranceList, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  queryTerminalList (params, success, fail) {
    axios
      .get(urls.vehicleMgmt.VehicleBaseInfo_queryTerminalList, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  queryTerminalInfo (params, success, fail) {
    axios
      .get(urls.vehicleMgmt.VehicleBaseInfo_queryTerminalInfo, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  update (params, success, fail) {
    axios
      .post(urls.vehicleMgmt.VehicleBaseInfo_update, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  add (params, success, fail) {
    axios
      .post(urls.vehicleMgmt.VehicleBaseInfo_add, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  }
};
