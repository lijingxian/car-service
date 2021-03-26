import responseHandle from '@/common/error/responseHandle';
import axios from 'axios';
import urls from '@/common/urls';

export default {
  query(params, success, fail) {
    axios
      .get(urls.motoristsClubActivity.ActivityNotification_query, {
        params: params
      })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  update(params, success, fail) {
    axios
      .post(urls.motoristsClubActivity.ActivityNotification_update, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  publish(params, success, fail) {
    axios
      .post(urls.motoristsClubActivity.ActivityNotification_publish, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },

  queryVIPList(params, success, fail) {
    axios
      .get(urls.motoristsClubActivity.ActivityNotification_queryVIPList, {
        params: params
      })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },

  queryPeople(params, success, fail) {
    axios
      .get(urls.motoristsClubActivity.ActivityNotification_queryPeople, {
        params: params
      })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  }
};
