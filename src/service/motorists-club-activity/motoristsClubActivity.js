import responseHandle from '@/common/error/responseHandle';
import axios from 'axios';
import urls from '@/common/urls';

export default {
  getClubList (params, success, fail) {
    axios
      .get(urls.motoristsClubActivity.clubList, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  getActivityList (params, success, fail) {
    axios
      .get(urls.motoristsClubActivity.clubActibityList, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  getActivityInfo (params, success, fail) {
    axios
      .get(urls.motoristsClubActivity.clubActivityInfo, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  delete (params, success, fail) {
    axios
      .post(urls.motoristsClubActivity.clubActibity_delete, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  swtichTop (params, success, fail) {
    axios
      .post(urls.motoristsClubActivity.clubActibity_switchTop, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  }
};
