import responseHandle from '@/common/error/responseHandle';
import axios from 'axios';
import urls from '@/common/urls';

export default {
  query (params, success, fail) {
    axios
      .get(urls.shopRate.TagGroupMgmt_query, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  queryClassList (params, success, fail) {
    axios
      .get(urls.shopRate.TagGroupMgmt_queryClassFormPlatform, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  queryGroupList (params, success, fail) {
    axios
      .get(urls.shopRate.TagGroupMgmt_queryGroupFormPlatform, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  delete (params, success, fail) {
    axios
      .delete(urls.shopRate.TagGroupMgmt_tagGroup, { data: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  import (params, success, fail) {
    axios
      .post(urls.shopRate.TagGroupMgmt_import, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  }
};
