import responseHandle from '@/common/error/responseHandle';
import axios from 'axios';
import urls from '@/common/urls';

export default {
  getParameterGroups(params, success, fail) {
    axios
      .get(urls.commodity.getParameterGroups, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  updateParameterGroups(params, success, fail) {
    axios
      .put(urls.commodity.updateParameterGroups, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  }
};
