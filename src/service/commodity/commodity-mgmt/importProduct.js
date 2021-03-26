import responseHandle from '@/common/error/responseHandle';
import axios from 'axios';
import urls from '@/common/urls';

export default {
  uploadProductFile(params, success, fail) {
    console.log('[---- dachao ----] [API-商品管理-post] uploadProductFile() params=', params);
    axios
      .post(urls.commodity.uploadProductFile, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  }
};
