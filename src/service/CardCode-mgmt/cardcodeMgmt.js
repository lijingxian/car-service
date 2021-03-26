import responseHandle from '@/common/error/responseHandle';
import axios from 'axios';
import urls from '@/common/urls';

export default {
  getList(params, success, fail) {
    axios
      .get(urls.communiMgmt.getListCardCode, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  createCardCode(params, success, fail) {
    axios
      .get(urls.communiMgmt.createCardCode, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  delete() {
    console.log('delete');
  },
  get(params, success, fail) {
    axios
      .get(urls.communiMgmt.select, { params: params })// 目前还不知道接口，知道后需要修改
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  }
};
