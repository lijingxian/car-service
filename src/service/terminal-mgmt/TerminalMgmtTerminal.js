import responseHandle from '@/common/error/responseHandle';
import axios from 'axios';
import urls from '@/common/urls';

export default {
  query (params, success, fail) {
    axios
      .get(urls.terminalMgmt.terminalMgmtTerminal_query, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  delete (params, success, fail) {
    axios
      .delete(urls.terminalMgmt.terminalMgmtTerminal_delete, { data: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  switchState (params, success, fail) {
    axios
      .put(urls.terminalMgmt.terminalMgmtTerminal_switchState, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  upload (params, success, fail) {
    axios
      .get(urls.terminalMgmt.terminalMgmtTerminal_upload, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  allocate (params, success, fail) {
    axios
      .post(urls.terminalMgmt.terminalMgmtTerminal_allocate, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },

  queryShopList (params, success, fail) {
    axios
      .get(urls.terminalMgmt.BaseInfo_queryShopList, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  }
};
