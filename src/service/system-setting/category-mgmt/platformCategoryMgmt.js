import responseHandle from '@/common/error/responseHandle';
import axios from 'axios';
import urls from '@/common/urls';

export default {
  getPlatformCategoryList(params, success, fail) {
    axios
      .get(urls.systemSetting.getPlatformCategoryList, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  deletePlatformCategory(params, success, fail) {
    axios
      .delete(urls.systemSetting.deletePlatformCategory, { data: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  }
};
