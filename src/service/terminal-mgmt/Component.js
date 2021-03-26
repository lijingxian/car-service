import responseHandle from '@/common/error/responseHandle';
import axios from 'axios';
import urls from '@/common/urls';

export default {
  queryPeople (params, success, fail) {
    axios
      .get(urls.terminalMgmt.Component_queryPeople, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  queryOperators (params, success, fail) {
    axios
      .get(urls.terminalMgmt.Component_queryOperators, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  }
};
