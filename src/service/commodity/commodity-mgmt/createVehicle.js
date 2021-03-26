import responseHandle from '@/common/error/responseHandle';
import axios from 'axios';
import urls from '@/common/urls';

export default {
  getVehicleBrands(params, success, fail) {
    axios
      .get(urls.commodity.getVehicleBrands, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  getVehicleSeries(params, success, fail) {
    axios
      .get(urls.commodity.getSeries, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  getVehicleNames(params, success, fail) {
    axios
      .get(urls.commodity.getVehicleNames, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  createVehicle(params, success, fail) {
    axios
      .post(urls.commodity.createVehicle, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  }
};
