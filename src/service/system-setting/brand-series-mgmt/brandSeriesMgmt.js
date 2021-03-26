import responseHandle from '@/common/error/responseHandle';
import axios from 'axios';
import urls from '@/common/urls';

export default {
  getBrandManageList(params, success, fail) {
    axios
      .get(urls.systemSetting.getBrandManageList, {
        params: params
      })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  deleteBrand(params, success, fail) {
    axios
      .delete(urls.systemSetting.deleteBrand, {
        data: params
      })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  deleteSeries(params, success, fail) {
    axios
      .delete(urls.systemSetting.deleteSeries, {
        data: params
      })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  }
};
