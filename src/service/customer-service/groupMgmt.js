import responseHandle from '@/common/error/responseHandle';
import axios from 'axios';
import urls from '@/common/urls';

export default {
  // 获取群列表
  getCustomerServiceGroupList(params, success, fail) {
    axios
      .get(urls.customerService.CSGroupList, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });

    // http.get(success.fail, urls.customerService.CSGroupList, params);
  }
};
