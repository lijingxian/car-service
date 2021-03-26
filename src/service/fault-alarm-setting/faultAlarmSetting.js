import responseHandle from '@/common/error/responseHandle';
import axios from 'axios';
import urls from '@/common/urls';

export default {
  // 基本设置
  getAlarmSetting(params, success, fail) {
    axios
      .get(urls.faultAlarmSetting.alarmSetting, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  updateAlarmSetting(params, success, fail) {
    axios
      .put(urls.faultAlarmSetting.alarmSetting, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },

  // 高级设置
  getShopFaultSetting(params, success, fail) {
    axios
      .get(urls.faultAlarmSetting.shopFaultSetting, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  deleteShopFaultSetting(params, success, fail) {
    axios
      .delete(urls.faultAlarmSetting.shopFaultSetting, { data: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  addShopFaultSetting(params, success, fail) {
    axios
      .post(urls.faultAlarmSetting.shopFaultSetting, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  getShopFaultTypeList(params, success, fail) {
    axios
      .get(urls.faultAlarmSetting.shopFaultTypeList, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  getShopDiagFaultList(params, success, fail) {
    axios
      .get(urls.faultAlarmSetting.shopDiagFaultList, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  }
};
