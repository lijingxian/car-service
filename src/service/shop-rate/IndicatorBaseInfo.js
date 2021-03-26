import responseHandle from '@/common/error/responseHandle';
import axios from 'axios';
import urls from '@/common/urls';

export default {
  query (params, success, fail) {
    axios
      .get(urls.shopRate.AbilityRatingMgmt_indicator, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  queryClassList (params, success, fail) {
    axios
      .get(urls.shopRate.IndicatorBaseInfo_classList, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  queryGroupList (params, success, fail) {
    axios
      .get(urls.shopRate.IndicatorBaseInfo_groupList, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  queryTagList (params, success, fail) {
    axios
      .get(urls.shopRate.IndicatorBaseInfo_queryTagList, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  add (params, success, fail) {
    axios
      .post(urls.shopRate.AbilityRatingMgmt_indicator, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  update (params, success, fail) {
    axios
      .put(urls.shopRate.AbilityRatingMgmt_indicator, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  }
};
