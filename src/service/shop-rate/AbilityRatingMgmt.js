import responseHandle from '@/common/error/responseHandle';
import axios from 'axios';
import urls from '@/common/urls';

export default {
  query (params, success, fail) {
    axios
      .get(urls.shopRate.AbilityRatingMgmt_query, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  delete (params, success, fail) {
    axios
      .delete(urls.shopRate.AbilityRatingMgmt_indicator, { data: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  queryColumns (params, success, fail) {
    axios
      .get(urls.shopRate.AbilityRatingMgmt_queryColumns, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  queryLevel (params, success, fail) {
    axios
      .get(urls.shopRate.AbilityRatingMgmt_queryLevel, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  deleteLevel (params, success, fail) {
    axios
      .delete(urls.shopRate.AbilityRatingMgmt_level, { data: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  }
};
