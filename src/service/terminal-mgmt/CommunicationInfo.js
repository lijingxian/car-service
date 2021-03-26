import responseHandle from '@/common/error/responseHandle';
import axios from 'axios';
import urls from '@/common/urls';

export default {
  query (params, success, fail) {
    axios
      .get(urls.terminalMgmt.CommunicationInfo_query, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  queryRule (params, success, fail) {
    axios
      .get(urls.terminalMgmt.CommunicationInfo_queryRule, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  querySimList (params, success, fail) {
    axios
      .get(urls.terminalMgmt.CommunicationInfo_querySimList, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  queryProp (params, success, fail) {
    axios
      .get(urls.terminalMgmt.CommunicationInfo_queryProp, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  deleteRule (params, success, fail) {
    axios
      .post(urls.terminalMgmt.CommunicationInfo_deleteRules, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  deleteProp (params, success, fail) {
    axios
      .post(urls.terminalMgmt.CommunicationInfo_deleteProps, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  updateRule (params, success, fail) {
    axios
      .post(urls.terminalMgmt.CommunicationInfo_updateRule, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  addRule (params, success, fail) {
    axios
      .post(urls.terminalMgmt.CommunicationInfo_addRule, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  }
};
