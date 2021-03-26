import responseHandle from '@/common/error/responseHandle';
import axios from 'axios';
import urls from '@/common/urls';

export default {
  listBusinessService(params, success, fail) {
    axios
      .get(urls.servicesMgmt.listBusinessService, {
        params: params
      })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  queryPaymentPattern(params, success, fail) {
    axios
      .get(urls.servicesMgmt.queryPaymentPattern, {
        params: params
      })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  calculate(params, success, fail) {
    axios
      .post(urls.servicesMgmt.calculate, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  queryBusinessService(params, success, fail) {
    axios
      .get(urls.servicesMgmt.queryBusinessService, {
        params: params
      })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  createBusinessOrder(params, success, fail) {
    axios
      .post(urls.servicesMgmt.createBusinessOrder, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  authorityService(params, success, fail) {
    axios
      .post(urls.servicesMgmt.authorityService, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 支付宝支付
  alipayPagePay(params, success, fail) {
    axios
      .get(urls.servicesMgmt.alipayPagePay, {
        params: params
      })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 支付宝支付
  alipayQuery(params, success, fail) {
    axios
      .get(urls.servicesMgmt.alipayQuery, {
        params: params
      })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 个人银联支付
  unionGatePay(params, success, fail) {
    axios
      .get(urls.servicesMgmt.unionGatePay, {
        params: params
      })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 个人查询银联支付
  unionGatePayQuery(params, success, fail) {
    axios
      .get(urls.servicesMgmt.unionGatePayQuery, {
        params: params
      })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 企业银联支付
  unionB2BPay(params, success, fail) {
    axios
      .get(urls.servicesMgmt.unionB2BPay, {
        params: params
      })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 企业查询银联支付
  unionB2BPayQuery(params, success, fail) {
    axios
      .get(urls.servicesMgmt.unionB2BPayQuery, {
        params: params
      })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  }
};
