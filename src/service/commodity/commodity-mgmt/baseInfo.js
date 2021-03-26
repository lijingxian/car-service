import responseHandle from '@/common/error/responseHandle';
import axios from 'axios';
import urls from '@/common/urls';

export default {
  queryProductBasicInfo(params, success, fail) {
    axios
      .get(urls.commodity.queryProductBasicInfo, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  updateProductBasicInfo(params, success, fail) {
    axios
      .put(urls.commodity.updateProductBasicInfo, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  creatProductBasicInfo(params, success, fail) {
    axios
      .post(urls.commodity.creatProductBasicInfo, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  creatBenefitsBasicInfo(params, success, fail) {
    axios
      .post('/admin/shopProduct/benefitsProduct/basicInfo.jhtml', params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  queryProductDetail(params, success, fail) {
    axios
      .get(urls.commodity.queryProductDetail, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  updateProductDetail(params, success, fail) {
    axios
      .put(urls.commodity.queryProductDetail, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  queryProductDetail_pm(params, success, fail) {
    axios
      .get(urls.commodity.queryProductDetail_pm, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  updateProductDetail_pm(params, success, fail) {
    axios
      .put(urls.commodity.updateProductDetail_pm, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  }
};
