import responseHandle from '@/common/error/responseHandle';
import axios from 'axios';
import urls from '@/common/urls';

export default {
  // 文章分类列表查询
  query(params, success, fail) {
    axios
      .get(urls.contentMgmt.CategoryMgmt_query, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 文章分类列表删除
  delete(params, success, fail) {
    axios
      .delete(urls.contentMgmt.CategoryMgmt_delete, { data: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 文章分类基本信息查询
  queryBaseInfo(params, success, fail) {
    axios
      .get(urls.contentMgmt.CategoryMgmt_queryBaseInfo, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 文章分类基本信息更新
  updateBaseInfo(params, success, fail) {
    axios
      .put(urls.contentMgmt.CategoryMgmt_updateBaseInfo, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 文章分类基本信息创建
  createBaseInfo(params, success, fail) {
    axios
      .post(urls.contentMgmt.CategoryMgmt_createBaseInfo, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 基本信息查询上级分类
  queryTypeList(params, success, fail) {
    axios
      .get(urls.contentMgmt.CategoryMgmt_queryList, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  }
};
