import responseHandle from '@/common/error/responseHandle';
import axios from 'axios';
import urls from '@/common/urls';

export default {
  query (params, success, fail) {
    axios
      .get(urls.motoristsClubActivity.ActivityInfo_query, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  update (params, success, fail) {
    axios
      .post(urls.motoristsClubActivity.ActivityInfo_update, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  publish (params, success, fail) {
    axios
      .post(urls.motoristsClubActivity.ActivityInfo_publish, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  add (params, success, fail) {
    axios
      .post(urls.motoristsClubActivity.ActivityInfo_add, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },

  queryClubList (params, success, fail) {
    axios
      .get(urls.motoristsClubActivity.ActivityInfo_queryClubList, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  }
};
