import responseHandle from '@/common/error/responseHandle';
import axios from 'axios';
import urls from '@/common/urls';

export default {
  query (params, success, fail) {
    axios
      .get(urls.terminalMgmt.terminalMgmtClass_query, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  delete (params, success, fail) {
    axios
      .post(urls.terminalMgmt.ClassAbilitySetting_delete, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  upload (params, success, fail) {
    axios
      .get(urls.terminalMgmt.terminalMgmtClass_upload, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  }
};
