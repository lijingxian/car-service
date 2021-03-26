import responseHandle from '@/common/error/responseHandle';
import axios from 'axios';
import urls from '@/common/urls';

export default {
  getProductList(params, success, fail) {
    axios
      .get(urls.systemSetting.getProductList, {
        params: params
      })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  deleteBasicData(params, success, fail) {
    axios
      .delete(urls.systemSetting.deleteBasicData, {
        data: params
      })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  queryBasicData(params, success, fail) {
    axios
      .get(urls.systemSetting.queryBasicData, {
        params: params
      })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  createBasicData(params, success, fail) {
    axios
      .post(urls.systemSetting.createBasicData, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  updateBasicData(params, success, fail) {
    axios
      .put(urls.systemSetting.updateBasicData, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  }
};
