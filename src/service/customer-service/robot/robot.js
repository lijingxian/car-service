import responseHandle from '@/common/error/responseHandle';
import axios from 'axios';
import urls from '@/common/urls';

export default {
  getReplySetting(params, success, fail) {
    axios
      .get(urls.customerService.replySetting, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  saveReplySetting(params, success, fail) {
    axios
      .post(urls.customerService.replySetting, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  getKFatherType(params, success, fail) {
    axios
      .get(urls.customerService.knowledgeType, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  getKSonType(params) {
    return axios.get(urls.customerService.knowledgeType, { params: params });
  },
  getKList(params, success, fail) {
    axios
      .get(urls.customerService.knowledgeList, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  createK(params, success, fail) {
    axios
      .post(urls.customerService.knowledge, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  getK(params, success, fail) {
    axios
      .get(urls.customerService.knowledge, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  updateK(params, success, fail) {
    axios
      .put(urls.customerService.knowledge, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  deleteK(params, success, fail) {
    axios
      .delete(urls.customerService.knowledge, { data: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 导入数据
  import(params, success, fail) {
    axios
      .post(urls.customerService.ImportKnowledge, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 导出数据
  export(params) {
    window.open(
      urls.customerService.ExportKnowledge + '?shopId=' + params.shopId
    );
  }
};
