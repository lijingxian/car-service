import responseHandle from '@/common/error/responseHandle';
import axios from 'axios';
import urls from '@/common/urls';

export default {
  getList(params, success, fail) {
    axios
      .get(urls.systemSetting.getOnlineUserList, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  }
};
