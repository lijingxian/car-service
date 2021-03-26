import responseHandle from '@/common/error/responseHandle';
import axios from 'axios';
import urls from '@/common/urls';

export default {
  queryCard(params, success, fail) {
    axios
      .get(urls.orderMgmt.statisticsAnalysis.orders, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  }
};
