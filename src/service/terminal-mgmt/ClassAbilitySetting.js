import responseHandle from '@/common/error/responseHandle';
import axios from 'axios';
import urls from '@/common/urls';

export default {
  querySignList (params, success, fail) {
    axios
      .get(urls.terminalMgmt.ClassAbilitySetting_querySignList, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  queryAbilityList (params, success, fail) {
    axios
      .get(urls.terminalMgmt.ClassAbilitySetting_queryAbilityList, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  query (params, success, fail) {
    axios
      .get(urls.terminalMgmt.ClassAbilitySetting_query, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  update (params, success, fail) {
    axios
      .post(urls.terminalMgmt.ClassAbilitySetting_update, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  add (params, success, fail) {
    axios
      .post(urls.terminalMgmt.ClassAbilitySetting_add, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  }
};
