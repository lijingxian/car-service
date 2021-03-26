import responseHandle from '@/common/error/responseHandle';
import axios from 'axios';
import urls from '@/common/urls';

export default {
  // 微信发布列表查询
  query(params, success, fail) {
    axios
      .get(urls.contentMgmt.Wechat_queryList, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 查询微信公众号列表
  queryWechatList(params, success, fail) {
    axios
      .get(urls.contentMgmt.WechatPublication_queryWechatList, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 微信文章基本信息查询
  queryBaseInfo(params, success, fail) {
    axios
      .get(urls.contentMgmt.Wechat_queryBaseInfo, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 微信文章基本信息更新
  updateBaseInfo(params, success, fail) {
    axios
      .put(urls.contentMgmt.ArticleMgmt_updateBaseInfo, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 微信文章基本信息创建
  createBaseInfo(params, success, fail) {
    axios
      .post(urls.contentMgmt.ArticleMgmt_createBaseInfo, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 微信文章基本信息删除
  delete(params, success, fail) {
    axios
      .delete(urls.contentMgmt.ArticleMgmt_queryList, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  queryTypeList(params, success, fail) {
    axios
      .get(urls.contentMgmt.ArticleMgmt_queryTypeList, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  }
};
