import responseHandle from '@/common/error/responseHandle';
import axios from 'axios';
import urls from '@/common/urls';

export default {
  // 获取导航页信息
  queryNavInfo(params, success, fail) {
    axios
      .get(urls.maintenance.queryNavInfo, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 获取消息条
  getMsg(params, success, fail) {
    axios
      .get(urls.maintenance.getMaintenanceMsg, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 获取维保记录列表
  getRecordsList(params, success, fail) {
    axios
      .get(urls.maintenance.queryMaintenanceRecords, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 删除维保记录
  delete(params, success, fail) {
    axios
      .post(urls.maintenance.deleteRecords, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 查询维保记录
  query(params, success, fail) {
    axios
      .get(urls.maintenance.queryRecords, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 创建维保记录
  create(params, success, fail) {
    axios
      .post(urls.maintenance.createRecords, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 更新维保记录
  update(params, success, fail) {
    axios
      .post(urls.maintenance.updateRecords, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 查找历史故障
  search(params, success, fail) {
    axios
      .get(urls.maintenance.searchPastRecords, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 获取提醒设置
  getSettings(params, success, fail) {
    axios
      .get(urls.maintenance.querySettings, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 保存提醒设置
  saveSettings(params, success, fail) {
    axios
      .post(urls.maintenance.saveSettings, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 查询车主列表
  queryMemberNameList(params, success, fail) {
    axios
      .get(urls.maintenance.queryMemberNameList, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 查询车主名下车牌列表
  queryPlateNameList(params, success, fail) {
    axios
      .get(urls.maintenance.queryPlateNameList, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 查询车主名下车牌列表
  queryKpiReport(params, success, fail) {
    axios
      .get(urls.maintenance.queryKpiReport, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  }
};
