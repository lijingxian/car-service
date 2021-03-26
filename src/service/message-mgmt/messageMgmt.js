import responseHandle from '@/common/error/responseHandle';
import axios from 'axios';
import urls from '@/common/urls';

export default {
  // 短信管理
  listSmsRecord(params, success, fail) {
    axios
      .get(urls.messageMgmt.listSmsRecord, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 续增
  createSmsRecord(params, success, fail) {
    axios
      .post(urls.messageMgmt.createSmsRecord, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 套餐列表
  listSmsPackage(params, success, fail) {
    axios
      .get(urls.messageMgmt.listSmsPackage, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 套餐查询
  querySmsPackage(params, success, fail) {
    axios
      .get(urls.messageMgmt.querySmsPackage, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 套餐创建
  createSmsPackage(params, success, fail) {
    axios
      .post(urls.messageMgmt.createSmsPackage, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 套餐更新
  updateSmsPackage(params, success, fail) {
    axios
      .put(urls.messageMgmt.updateSmsPackage, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 套餐删除
  deleteSmsPackage(params, success, fail) {
    axios
      .delete(urls.messageMgmt.deleteSmsPackage, { data: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 短信订单
  listSmsOrder(params, success, fail) {
    axios
      .get(urls.messageMgmt.listSmsOrder, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 充值
  createSmsOrder(params, success, fail) {
    axios
      .post(urls.messageMgmt.createSmsOrder, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 支付宝支付
  alipayPagePay(params, success, fail) {
    axios
      .get(urls.messageMgmt.alipayPagePay, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 支付宝支付
  alipayQuery(params, success, fail) {
    axios
      .get(urls.messageMgmt.alipayQuery, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 个人银联支付
  unionGatePay(params, success, fail) {
    axios
      .get(urls.messageMgmt.unionGatePay, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 个人查询银联支付
  unionGatePayQuery(params, success, fail) {
    axios
      .get(urls.messageMgmt.unionGatePayQuery, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 企业银联支付
  unionB2BPay(params, success, fail) {
    axios
      .get(urls.messageMgmt.unionB2BPay, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 企业查询银联支付
  unionB2BPayQuery(params, success, fail) {
    axios
      .get(urls.messageMgmt.unionB2BPayQuery, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },

  // 查询店铺
  findEShops(params, success, fail) {
    axios
      .get(urls.messageMgmt.findEShops, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },

  // 付款
  query(params, success, fail) {
    axios
      .get(urls.messageMgmt.query, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },

  // 取消
  cancelOrder(params, success, fail) {
    axios
      .put(urls.messageMgmt.cancelOrder, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },

  init(params, success, fail) {
    axios
      .get(urls.messageMgmt.init, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  }
};
