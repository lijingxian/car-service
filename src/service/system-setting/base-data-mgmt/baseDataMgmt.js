import responseHandle from '@/common/error/responseHandle';
import axios from 'axios';
import urls from '@/common/urls';

export default {
  getBaseDataList(params, success, fail) {
    axios
      .get(urls.systemSetting.getBaseDataList, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  deleteBaseData(params, success, fail) {
    axios
      .delete(urls.systemSetting.deleteBaseData, { data: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  }
};
