import responseHandle from '@/common/error/responseHandle';
import axios from 'axios';
import urls from '@/common/urls';

export default {
  // 获取优惠券统计信息
  getCouponKpi(params, success, fail) {
    axios
      .get(urls.marketingStatistics.queryCouponKpiReport, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 获取活动营销统计信息
  getActivityKpi(params, success, fail) {
    axios
      .get(urls.marketingStatistics.queryActivityKpiReport, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 获取内容营销统计数据
  getContentKpi(params, success, fail) {
    axios
      .get(urls.marketingStatistics.queryContentKpiReport, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  }
};
