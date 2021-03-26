import responseHandle from '@/common/error/responseHandle';
import axios from 'axios';
import urls from '@/common/urls';

export default {
  query (params, success, fail) {
    axios
      .get(urls.shopRate.TagClassMgmt_query, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  delete (params, success, fail) {
    axios
      .delete(urls.shopRate.TagClassMgmt_tagClass, { data: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  }
};
