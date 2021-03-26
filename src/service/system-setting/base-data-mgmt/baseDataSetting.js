import responseHandle from '@/common/error/responseHandle';
import axios from 'axios';
import urls from '@/common/urls';

export default {
  queryBaseData(params, success, fail) {
    axios
      .get(urls.systemSetting.queryBaseData, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  saveBaseData(params, success, fail) {
    axios
      .post(urls.systemSetting.saveBaseData, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  updateBaseData(params, success, fail) {
    axios
      .put(urls.systemSetting.updateBaseData, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  }
};
