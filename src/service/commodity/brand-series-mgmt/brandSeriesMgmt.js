import responseHandle from '@/common/error/responseHandle';
import axios from 'axios';
import urls from '@/common/urls';

export default {
  getBrandManageList(params, success, fail) {
    axios
      .get(urls.commodity.getBrandManageList, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  deleteBrand(params, success, fail) {
    axios
      .delete(urls.commodity.deleteBrand, { data: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  deleteSeries(params, success, fail) {
    axios
      .delete(urls.commodity.deleteSeries, { data: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  }
};
