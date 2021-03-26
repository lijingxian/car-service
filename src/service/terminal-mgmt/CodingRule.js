import responseHandle from '@/common/error/responseHandle';
import axios from 'axios';
import urls from '@/common/urls';

export default {
  query (params, success, fail) {
    axios
      .get(urls.terminalMgmt.CodingRule_query, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  queryRule (params, success, fail) {
    axios
      .get(urls.terminalMgmt.CodingRule_queryRule, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  deleteRule (params, success, fail) {
    axios
      .post(urls.terminalMgmt.CodingRule_deleteRules, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  updateRule (params, success, fail) {
    axios
      .post(urls.terminalMgmt.CodingRule_updateRule, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  addRule (params, success, fail) {
    axios
      .post(urls.terminalMgmt.CodingRule_addRule, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  }
};
