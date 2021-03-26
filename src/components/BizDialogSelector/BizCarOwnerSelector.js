import responseHandle from '@/common/error/responseHandle';
import axios from 'axios';
let urls = '/admin/maintenance/queryMemberPage.jhtml';

export default {
  getList(params, success, fail) {
    axios
      .get(urls, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  }
};
