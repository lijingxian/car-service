import responseHandle from '@/common/error/responseHandle';
import axios from 'axios';
import urls from '@/common/urls';

export default {
  createBrand(params, success, fail) {
    axios
      .post(urls.systemSetting.createBrand, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  updateBrand(params, success, fail) {
    axios
      .put(urls.systemSetting.updateBrand, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  queryByBrand(params, success, fail) {
    axios
      .get(urls.systemSetting.query, {
        params: params
      })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  createSeries(params, success, fail) {
    axios
      .post(urls.systemSetting.createSeries, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  updateSeries(params, success, fail) {
    axios
      .put(urls.systemSetting.updateSeries, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  queryBySeries(params, success, fail) {
    axios
      .get(urls.systemSetting.querySeries, {
        params: params
      })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  queryBrand(params, success, fail) {
    axios
      .get(urls.systemSetting.queryBrand, {
        params: params
      })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  }
  // querySeries(params, success, fail) {
  //   axios
  //     .get(urls.commodity.querySeries, { params: params })
  //     .then(responseHandle(success, fail))
  //     .catch(error => {
  //       console.error(error);
  //     });
  // }
};
