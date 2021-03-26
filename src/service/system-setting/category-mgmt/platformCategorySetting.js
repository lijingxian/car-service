import responseHandle from '@/common/error/responseHandle';
import axios from 'axios';
import urls from '@/common/urls';

export default {
  getPlatformCategory(params, success, fail) {
    axios
      .get(urls.systemSetting.getPlatformCategory, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  savePlatformCategory(params, success, fail) {
    axios
      .post(urls.systemSetting.savePlatformCategory, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  updatePlatformCategory(params, success, fail) {
    axios
      .put(urls.systemSetting.updatePlatformCategory, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  }
};
