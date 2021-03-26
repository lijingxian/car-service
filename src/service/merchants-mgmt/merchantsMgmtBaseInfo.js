import responseHandle from '@/common/error/responseHandle';
import axios from 'axios';
import urls from '@/common/urls';

export default {
  get(params, success, fail) {
    axios
      .get(urls.merchantsMgmt.select, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  create(params, success, fail) {
    axios
      .get(urls.merchantsMgmt.create, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  save(params, success, fail) {
    axios
      .get(urls.merchantsMgmt.edit, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  passed(params, success, fail) {
    axios
      .post(urls.merchantsMgmt.passed, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  abandoned(params, success, fail) {
    axios
      .get(urls.merchantsMgmt.failed, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  sendEmail(params, success, fail) {
    axios
      .post(urls.merchantsMgmt.sendMail, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  getCompanies(success, fail) {
    axios
      .get(urls.merchantsMgmt.companyList)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  }
};
