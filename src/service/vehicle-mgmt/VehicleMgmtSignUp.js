import responseHandle from '@/common/error/responseHandle';
import axios from 'axios';
import urls from '@/common/urls';

export default {
  query (params, success, fail) {
    axios
      .get(urls.vehicleMgmt.VehicleMgmtSignUp_query, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  signUpExport (params, success, fail) {
    // window.open(urls.vehicleMgmt.VehicleMgmtSignUp_export + '?Id=' + params.id);
    console.log(params);
    let urlParam = [urls.vehicleMgmt.VehicleMgmtSignUp_export, '?'];
    urlParam.push('fleetId=');
    urlParam.push(params.fleetId);
    urlParam.push('&beginDateStr=');
    urlParam.push(params.beginDateStr);
    urlParam.push('&endDateStr=');
    urlParam.push(params.endDateStr);
    if (params.ids) {
      params.ids.forEach(id => {
        urlParam.push('&ids=');
        urlParam.push(id);
      });
    }

    window.open(urlParam.join(''));
  }
};
