import responseHandle from '@/common/error/responseHandle';
import axios from 'axios';
import urls from '@/common/urls';

export default {
  queryBusinessOrder(params, success, fail) {
    axios
      .get(urls.servicesMgmt.queryBusinessOrder, {
        params: params
      })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  listBusinessOrderItem(params, success, fail) {
    axios
      .get(urls.servicesMgmt.listBusinessOrderItem, {
        params: params
      })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  }
};
