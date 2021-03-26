import responseHandle from '@/common/error/responseHandle';
import axios from 'axios';
import urls from '@/common/urls';

export default {
  // 获取客服列表
  queryList(params, success, fail) {
    axios
      .get(urls.customerService.CSList, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 获取群组列表
  queryGroup(params, success, fail) {
    axios
      .get(urls.customerService.CSGroupList, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 获取客服信息
  query(params, success, fail) {
    axios
      .get(urls.customerService.CSQuery, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 更新客服信息
  update(params, success, fail) {
    axios
      .put(urls.customerService.CSQuery, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 创建客服信息
  create(params, success, fail) {
    axios
      .post(urls.customerService.CSQuery, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 删除客服信息
  delete(params, success, fail) {
    axios
      .delete(urls.customerService.CSQuery, { data: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 获取工时管理
  getManhour(params, success, fail) {
    axios
      .get(urls.customerService.manhour, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 更新工时管理
  updateManhour(params, success, fail) {
    axios
      .post(urls.customerService.manhour, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 创建黑名单
  createBlack(params, success, fail) {
    axios
      .post(urls.customerService.CreateBlack, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 通过黑名单
  passBlack(params, success, fail) {
    axios
      .post(urls.customerService.PassBlack, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 黑名单列表
  getBlackList(params, success, fail) {
    axios
      .get(urls.customerService.BlackList, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 恢复黑名单
  recoverBlack(params, success, fail) {
    axios
      .post(urls.customerService.RecoverBlack, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  }
};
