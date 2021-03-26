import responseHandle from '@/common/error/responseHandle';
import axios from 'axios';
import urls from '@/common/urls';

export default {
  queryTypeList (params, success, fail) {
    axios
      .get(urls.terminalMgmt.BaseInfo_queryTypeList, { params: params })
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
  },
  // queryPositionList (params, success, fail) {
  //   axios
  //     .get(urls.terminalMgmt.BaseInfo_queryPositionList, { params: params })
  //     .then(responseHandle(success, fail))
  //     .catch(error => {
  //       console.error(error);
  //     });
  // },
  query (params, success, fail) {
    axios
      .get(urls.terminalMgmt.BaseInfo_query, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  update (params, success, fail) {
    axios
      .post(urls.terminalMgmt.BaseInfo_update, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  add (params, success, fail) {
    axios
      .post(urls.terminalMgmt.BaseInfo_add, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },

  query_new (params, success, fail) {
    axios
      .get(urls.terminalMgmt.BaseInfo_query_new, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  update_new (params, success, fail) {
    axios
      .put(urls.terminalMgmt.BaseInfo_update_new, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  add_new (params, success, fail) {
    axios
      .post(urls.terminalMgmt.BaseInfo_add_new, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  }
};
