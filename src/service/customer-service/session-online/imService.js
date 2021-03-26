import responseHandle from '@/common/error/responseHandle';
import axios from 'axios';
import urls from '@/common/urls';

export default {
  // 获取客服列表
  getCustomerServiceList(params, success, fail) {
    axios
      .get(urls.customerService.CSList, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 获取当前用户所在群列表
  getMyGroupList(params, success, fail) {
    axios
      .get(urls.customerService.MyCSGroup, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 获取已结束的客户列表
  getEndClientList(params, success, fail) {
    axios
      .get(urls.customerService.EndClientList, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 获取客户基本信息
  getClient(params, success, fail) {
    axios
      .get(urls.customerService.Client, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 通过admin获取客服信息
  getCsInfoByAdmin(params, success, fail) {
    axios
      .get(urls.customerService.csInfoByAdmin, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  }
};
