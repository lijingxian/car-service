import responseHandle from '@/common/error/responseHandle';
import axios from 'axios';
import urls from '@/common/urls';

export default {
  // 查询列表
  queryList(params, success, fail) {
    axios
      .get(urls.communiMgmt.Operator_queryList, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 查询基本信息
  queryBaseInfo(params, success, fail) {
    axios
      .get(urls.communiMgmt.Operator_queryBaseInfo, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 创建基本信息
  createBaseInfo(params, success, fail) {
    axios
      .post(urls.communiMgmt.Operator_createBaseInfo, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 更新基本信息
  updateBaseInfo(params, success, fail) {
    axios
      .put(urls.communiMgmt.Operator_updateBaseInfo, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 删除基本信息
  deleteBaseInfo(params, success, fail) {
    axios
      .delete(urls.communiMgmt.Operator_deleteBaseInfo, { data: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 查询话费包列表
  queryRechargeList(params, success, fail) {
    axios
      .get(urls.communiMgmt.Operator_queryRechargeList, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 创建话费包
  createRechargePackage(params, success, fail) {
    axios
      .post(urls.communiMgmt.Operator_createRechargePackage, {}, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 修改话费包
  updateRechargePackage(params, success, fail) {
    axios
      .post(urls.communiMgmt.Operator_updateRechargePackage, {}, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 删除话费包
  deleteRechargePackage(params, success, fail) {
    // /admin/telecomOperator/delete.jhtml?ids=3&ids=5&ids=8
    let url = urls.communiMgmt.Operator_deleteRechargePackage + '?ids=';
    url = url + params.ids.join('&ids=');
    axios
      .get(url)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },

  // 查询充值卡列表
  queryCardList(params, success, fail) {
    axios
      .get(urls.communiMgmt.Operator_queryCardList, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 创建基本信息
  createCardBaseInfo(params, success, fail) {
    axios
      .get(urls.communiMgmt.Operator_crateCardBaseInfo, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 删除基本信息
  deleteCardBaseInfo(params, success, fail) {
    // /admin/telecomOperator/delete.jhtml?ids=3&ids=5&ids=8
    let url = urls.communiMgmt.Operator_deleteCardBaseInfo + '?ids=';
    url = url + params.ids.join('&ids=');
    axios
      .get(url)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  }
};
