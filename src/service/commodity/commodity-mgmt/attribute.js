import responseHandle from '@/common/error/responseHandle';
import axios from 'axios';
import urls from '@/common/urls';

export default {
  getAttributeGroups(params, success, fail) {
    axios
      .get(urls.commodity.getAttributeGroups, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  updateAttributeGroups(params, success, fail) {
    axios
      .put(urls.commodity.updateAttributeGroups, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  }
};
