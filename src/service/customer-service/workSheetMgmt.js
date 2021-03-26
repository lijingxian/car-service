import responseHandle from '@/common/error/responseHandle';
import axios from 'axios';
import urls from '@/common/urls';

export default {
  // 获取工单列表
  getNavInfo(params, success, fail) {
    axios
      .get(urls.customerService.queryNavInfo, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 获取工单列表
  queryList(params, success, fail) {
    axios
      .get(urls.customerService.WorkSheetList, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 查询工单
  queryBaseInfo(params, success, fail) {
    axios
      .get(urls.customerService.WorkSheetBaseInfo, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 修改工单
  updateBaseInfo(params, success, fail) {
    axios
      .put(urls.customerService.WorkSheetBaseInfo, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 创建工单
  createBaseInfo(params, success, fail) {
    axios
      .post(urls.customerService.WorkSheetBaseInfo, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 删除工单
  deleteBaseInfo(params, success, fail) {
    axios
      .delete(urls.customerService.WorkSheetBaseInfo, { data: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 查询受理人
  querySponsorList(params, success, fail) {
    axios
      .get(urls.customerService.WorkSheetSponsorList, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 查询受理组
  querySponsorGroupList(params, success, fail) {
    axios
      .get(urls.customerService.WorkSheetSponsorGroupList, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 查询会员列表
  queryMemberList(params, success, fail) {
    axios
      .get(urls.customerService.WorkSheetMemberList, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 统计分析
  queryKpi(params, success, fail) {
    axios
      .get(urls.customerService.WorkSheetKpi, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  }
};
