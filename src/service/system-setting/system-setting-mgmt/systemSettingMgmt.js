import responseHandle from '@/common/error/responseHandle';
import axios from 'axios';
import urls from '@/common/urls';

export default {
  query(params, success, fail) {
    axios
      .get(urls.systemSetting.querySystemSetting, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  update(params, success, fail) {
    axios
      .put(urls.systemSetting.updateSystemSetting, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  emailTest(params, success, fail) {
    axios
      .post(urls.systemSetting.emailTest, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  }
};
