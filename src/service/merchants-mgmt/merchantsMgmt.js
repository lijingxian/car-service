import responseHandle from '@/common/error/responseHandle';
import axios from 'axios';
import urls from '@/common/urls';

export default {
  getList(params, success, fail) {
    axios
      .get(urls.merchantsMgmt.list, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  delete() {
    console.log('delete');
  },
  getStatistics(params, success, fail) {
    axios
      .get(urls.merchantsMgmt.statistics, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  }
};
