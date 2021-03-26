import responseHandle from '@/common/error/responseHandle';
import axios from 'axios';
import urls from '@/common/urls';

export default {
  get(params, success, fail) {
    axios
      .get(urls.activityMgmt.getActivityModel, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  create(params, success, fail) {
    axios
      .post(urls.activityMgmt.createActivityModel, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  update(params, success, fail) {
    axios
      .put(urls.activityMgmt.updateActivityModel, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  delete(params, success, fail) {
    axios
      .post(urls.activityMgmt.deleteActivityModel, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  getList(params, success, fail) {
    axios
      .get(urls.activityMgmt.getActivityModelList, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  }
};
