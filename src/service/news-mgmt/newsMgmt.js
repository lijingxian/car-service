import responseHandle from '@/common/error/responseHandle';
import axios from 'axios';
import urls from '@/common/urls';

export default {
  listMsg(params, success, fail) {
    axios
      .get(urls.newsMgmt.listMsg, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  queryMsg(params, success, fail) {
    axios
      .get(urls.newsMgmt.queryMsg, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  listMsgType(params, success, fail) {
    axios
      .get(urls.newsMgmt.listMsgType, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  deleteMsg(params, success, fail) {
    axios
      .delete(urls.newsMgmt.queryMsg, {
        data: params
      })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  orderConfirm(params, success, fail) {
    axios
      .get(urls.newsMgmt.confirmOrder, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  messagePendingDeal(params, success, fail) {
    axios
      .put(urls.newsMgmt.messagePendingDeal, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  }
};
