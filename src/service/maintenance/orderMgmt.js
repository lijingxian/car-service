import responseHandle from '@/common/error/responseHandle';
import axios from 'axios';
import urls from '@/common/urls';

export default {
  // 获取预约记录消息条
  getMsg(params, success, fail) {
    axios
      .get(urls.maintenance.getOrderMsg, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 获取预约记录列表
  getOrderList(params, success, fail) {
    axios
      .get(urls.maintenance.queryOrderList, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 删除预约记录
  delete(params, success, fail) {
    axios
      .post(urls.maintenance.deleteOrders, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 查询预约记录
  query(params, success, fail) {
    axios
      .get(urls.maintenance.queryOrder, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 创建预约记录
  create(params, success, fail) {
    axios
      .post(urls.maintenance.createOrders, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 更新预约记录
  update(params, success, fail) {
    axios
      .post(urls.maintenance.updateOrders, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 获取预约设置
  getSettings(params, success, fail) {
    axios
      .get(urls.maintenance.getOrderSettings, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 创建预约设置
  createSettings(params, success, fail) {
    axios
      .post(urls.maintenance.createOrderSettings, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 更新预约设置
  updateSettings(params, success, fail) {
    axios
      .post(urls.maintenance.updateOrderSettings, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  }
};
