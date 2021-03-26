import responseHandle from '@/common/error/responseHandle';
import axios from 'axios';
let urls = '/admin/company/json/list.jhtml';
let parentCompany = '/admin/company/queryParentCompanyTree.jhtml';

export default {
  queryList(params, success, fail) {
    axios
      .get(urls, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  queryParent(params, success, fail) {
    axios
      .get(parentCompany, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  }
};
