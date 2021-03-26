import responseHandle from '@/common/error/responseHandle';
import axios from 'axios';
import urls from '@/common/urls';

export default {
  queryWechatOpen(params, success, fail) {
    axios
      .get(urls.systemSetting.queryWechatOpen, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  getWechatMenu(params, success, fail) {
    axios
      .get(urls.systemSetting.getWechatMenu, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  menus(params, success, fail) {
    axios
      .get(urls.systemSetting.menus, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  saveWechatOpen(params, success, fail) {
    axios
      .post(urls.systemSetting.saveWechatOpen, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  updateWechatOpen(params, success, fail) {
    axios
      .put(urls.systemSetting.updateWechatOpen, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  unbindWechatOpen(params, success, fail) {
    axios
      .delete(urls.systemSetting.unbindWechatOpen, { data: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  updateWechatOpenName(params, success, fail) {
    axios
      .put(urls.systemSetting.updateWechatOpenName, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  }
};
