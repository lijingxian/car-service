import responseHandle from '@/common/error/responseHandle';
import axios from 'axios';
import urls from '@/common/urls';

export default {
  query (params, success, fail) {
    axios
      .get(urls.terminalMgmt.TerminalMgmt_Nav, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  }
};
