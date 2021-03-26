import urls from '@/common/urls';
import http from '@/common/http';

export default {
  query() {
    return http.get(urls.global.currentUser, {});
  }
};
