import responseHandle from '@/common/error/responseHandle';
import axios from 'axios';
import urls from '@/common/urls';

export default {
  // 查询通讯卡列表
  queryList(params, success, fail) {
    axios
      .get(urls.communiMgmt.Card_queryList, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 查询运营商列表
  queryCompanyList(params, success, fail) {
    axios
      .get(urls.communiMgmt.Card_queryCompanyList, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 查询电信运营商列表
  queryTeleOperator(params, success, fail) {
    axios
      .get(urls.communiMgmt.Card_queryTeleOperatorList, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 查询所有者列表
  queryOwnerList(params, success, fail) {
    axios
      .get(urls.communiMgmt.Card_queryOwnerList, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 查询基本信息
  queryBaseInfo(params, success, fail) {
    axios
      .get(urls.communiMgmt.Card_queryBaseInfo, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 创建基本信息
  createBaseInfo(params, success, fail) {
    axios
      .post(urls.communiMgmt.Card_createBaseInfo, {}, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 更新基本信息
  updateBaseInfo(params, success, fail) {
    axios
      .post(urls.communiMgmt.Card_updateBaseInfo, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 删除基本信息
  deleteBaseInfo(params, success, fail) {
    // /admin/telecomOperator/delete.jhtml?ids=3&ids=5&ids=8
    let url = urls.communiMgmt.Card_deleteBaseInfo + '?ids=';
    url = url + params.ids.join('&ids=');
    axios
      .get(url)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 启用
  enable(params, success, fail) {
    // /admin/telecomOperator/delete.jhtml?ids=3&ids=5&ids=8
    let url = urls.communiMgmt.Card_enable + '?ids=';
    url = url + params.ids.join('&ids=');
    axios
      .get(url)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 停用
  disable(params, success, fail) {
    // /admin/telecomOperator/delete.jhtml?ids=3&ids=5&ids=8
    let url = urls.communiMgmt.Card_disable + '?ids=';
    url = url + params.ids.join('&ids=');
    axios
      .get(url)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 发送短信
  sendMsg(params, success, fail) {
    axios
      .post(urls.communiMgmt.Card_sendMsg, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 查询充值记录列表
  queryRecordsList(params, success, fail) {
    axios
      .get(urls.communiMgmt.Card_queryRecordsList, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 查询消费记录列表
  queryConsumeList(params, success, fail) {
    axios
      .get(urls.communiMgmt.Card_queryConsumeList, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  }
};
