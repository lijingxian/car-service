import responseHandle from '@/common/error/responseHandle';
import axios from 'axios';
import urls from '@/common/urls';

export default {
  getList(params, success, fail) {
    axios
      .get(urls.systemSetting.getOilPriceList, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  query(params, success, fail) {
    axios
      .get(urls.systemSetting.queryOilPrice, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  add(params, success, fail) {
    axios
      .post(urls.systemSetting.addOilPrice, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  update(params, success, fail) {
    axios
      .put(urls.systemSetting.updateOilPrice, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  delete(params, success, fail) {
    axios
      .delete(urls.systemSetting.deleteOilPrice, { data: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  oneKeyUpdate(params, success, fail) {
    axios
      .get(urls.systemSetting.oneKeyUpdateOilPrice, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  }
};
