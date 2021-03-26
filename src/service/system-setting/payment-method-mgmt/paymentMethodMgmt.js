import responseHandle from '@/common/error/responseHandle';
import axios from 'axios';
import urls from '@/common/urls';

export default {
  getList(params, success, fail) {
    axios
      .get(urls.systemSetting.getPaymentMethodList, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  query(params, success, fail) {
    axios
      .get(urls.systemSetting.queryPaymentMethod, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  update(params, success, fail) {
    axios
      .put(urls.systemSetting.updatePaymentMethod, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  }
};
