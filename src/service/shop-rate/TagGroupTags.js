import responseHandle from '@/common/error/responseHandle';
import axios from 'axios';
import urls from '@/common/urls';

export default {
  query (params, success, fail) {
    axios
      .get(urls.shopRate.TagGroupTags_query, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  add (params, success, fail) {
    axios
      .post(urls.shopRate.TagGroupTags_tag, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  update (params, success, fail) {
    axios
      .put(urls.shopRate.TagGroupTags_tag, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  delete (params, success, fail) {
    axios
      .delete(urls.shopRate.TagGroupTags_tag, { data: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  }
};
