import responseHandle from '@/common/error/responseHandle';
import axios from 'axios';
import urls from '@/common/urls';

export default {
  query(params, success, fail) {
    axios
      .get(urls.vehicleMgmt.VehicleMgmtVehicle_query, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  queryAlertInfo(params, success, fail) {
    axios
      .get(urls.vehicleMgmt.VehicleMgmtVehicle_queryAlertInfo, {
        params: params
      })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  queryMotorcadeVehicles(params, success, fail) {
    axios
      .get(urls.vehicleMgmt.VehicleMgmtVehicle_queryMotorcadeVehicles, {
        params: params
      })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  queryCompanyList(params, success, fail) {
    axios
      .get(urls.vehicleMgmt.VehicleMgmtVehicle_queryCompanyList, {
        params: params
      })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  delete(params, success, fail) {
    axios
      .post(urls.vehicleMgmt.VehicleMgmtVehicle_delete, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  deleteMember(params, success, fail) {
    axios
      .delete(urls.vehicleMgmt.VehicleMgmtVehicle_deleteMember, {
        data: params
      })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  upload(params, success, fail) {
    axios
      .post(urls.vehicleMgmt.VehicleMgmtVehicle_upload, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  addMember(params, success, fail) {
    axios
      .post(urls.vehicleMgmt.VehicleMgmtVehicle_addMember, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  queryMemberIds(params, success, fail) {
    axios
      .get(urls.vehicleMgmt.VehicleMgmtVehicle_queryMemberIds, {
        params: params
      })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  showAllFences(params, success, fail) {
    axios
      .get(urls.vehicleMgmt.VehicleElecFence_showAllFences + '?fleetId=' + params.fleetId + '&memberIds=' + params.memberIds)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  listCarMap(params, success, fail) {
    axios
      .get(urls.vehicleMgmt.VehicleMgmtVehicle_mapList + '?ids=' + params.ids)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  }
};
