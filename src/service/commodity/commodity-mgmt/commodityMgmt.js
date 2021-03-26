// import responseHandle from '@/common/error/responseHandle';
// import axios from 'axios';
// import urls from '@/common/urls';

import responseHandle from '@/common/error/responseHandle';
import axios from 'axios';
import urls from '@/common/urls';

export default {
  getCommodityList(params, success, fail) {
    axios
      .get(urls.commodity.getCommodityList, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  delete(params, success, fail) {
    axios
      .delete(urls.commodity.delete, { data: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  query(params, success, fail) {
    axios
      .get(urls.commodity.query, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  soldoutAndPutaway(params, success, fail) {
    axios
      .post(urls.commodity.soldoutAndPutaway, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  cloneProduct(params, success, fail) {
    axios
      .post(urls.commodity.cloneProduct, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  queryPlatformCategoryTree(params, success, fail) {
    axios
      .get(urls.commodity.queryPlatformCategoryTree, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  queryPlatformImportInfo(params, success, fail) {
    axios
      .get(urls.commodity.queryPlatformImportInfo, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  importPlatformProduct(params, success, fail) {
    axios
      .post(urls.commodity.importPlatformProduct, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  audit(params, success, fail) {
    axios
      .post(urls.commodity.audit, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  auditTarget(params, success, fail) {
    axios
      .post(urls.commodity.auditTarget, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  recallProduct(params, success, fail) {
    axios
      .get(urls.commodity.recallProduct, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  queryFilters(params, success, fail) {
    axios
      .get(urls.commodity.queryFilters, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  }
};
