import responseHandle from '@/common/error/responseHandle';
import axios from 'axios';
import urls from '@/common/urls';

export default {
  getList(params, success, fail) {
    axios
      .get(urls.systemSetting.getStoragePluginList, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  install(params, success, fail) {
    axios
      .post(urls.systemSetting.installStoragePlugin, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  uninstall(params, success, fail) {
    axios
      .post(urls.systemSetting.uninstallStoragePlugin, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  query(params, success, fail) {
    axios
      .get(urls.systemSetting.queryStoragePlugin, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  update(params, success, fail) {
    axios
      .put(urls.systemSetting.updateStoragePlugin, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  }
};
