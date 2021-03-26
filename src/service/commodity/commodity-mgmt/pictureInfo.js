import responseHandle from '@/common/error/responseHandle';
import axios from 'axios';
import urls from '@/common/urls';

export default {
  getImageGroups(params, success, fail) {
    axios
      .get(urls.commodity.getImageGroups, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  updateImageGroups(params, success, fail) {
    axios
      .put(urls.commodity.updateImageGroups, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  updateProductVrMediaBath(params, success, fail) {
    axios
      .put(urls.commodity.updateProductVrMediaBath, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  getImageGroups_pm(params, success, fail) {
    axios
      .get(urls.commodity.getImageGroups_pm, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  updateImageGroups_pm(params, success, fail) {
    axios
      .put(urls.commodity.updateImageGroups_pm, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  updateProductVrMediaBath_pm(params, success, fail) {
    axios
      .put(urls.commodity.updateProductVrMediaBath_pm, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  }
};
