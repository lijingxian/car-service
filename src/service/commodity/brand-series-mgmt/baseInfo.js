import responseHandle from '@/common/error/responseHandle';
import axios from 'axios';
import urls from '@/common/urls';

export default {
  createBrand(params, success, fail) {
    axios
      .post(urls.commodity.createBrand, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  updateBrand(params, success, fail) {
    axios
      .put(urls.commodity.updateBrand, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  queryByBrand(params, success, fail) {
    axios
      .get(urls.commodity.queryByBrand, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  createSeries(params, success, fail) {
    axios
      .post(urls.commodity.createSeries, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  updateSeries(params, success, fail) {
    axios
      .put(urls.commodity.updateSeries, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  queryBySeries(params, success, fail) {
    axios
      .get(urls.commodity.queryBySeries, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  queryBrand(params, success, fail) {
    axios
      .get(urls.commodity.queryBrand, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  querySeries(params, success, fail) {
    axios
      .get(urls.commodity.querySeries, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  }
};
