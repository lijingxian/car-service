import responseHandle from '@/common/error/responseHandle';
import axios from 'axios';
import urls from '@/common/urls';

export default {
  getList(params, success, fail) {
    axios
      .get(urls.systemSetting.getShippingMethodList, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  query(params, success, fail) {
    axios
      .get(urls.systemSetting.queryShippingMethod, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  add(params, success, fail) {
    axios
      .post(urls.systemSetting.addShippingMethod, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  update(params, success, fail) {
    axios
      .put(urls.systemSetting.updateShippingMethod, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  delete(params, success, fail) {
    axios
      .delete(urls.systemSetting.deleteShippingMethod, { data: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  getDeliveryCorpsList(params, success, fail) {
    axios
      .get(urls.systemSetting.getDeliveryCorpsList, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  }
};
