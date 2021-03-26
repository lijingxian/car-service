import responseHandle from '@/common/error/responseHandle';
import axios from 'axios';
import urls from '@/common/urls';

export default {
  queryCard(params, success, fail) {
    axios
      .get(urls.communiMgmt.statisticsAnalysis_card, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  queryPackage(params, success, fail) {
    axios
      .get(urls.communiMgmt.statisticsAnalysis_package, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  queryCompany(params, success, fail) {
    axios
      .get(urls.communiMgmt.statisticsAnalysis_queryCompany, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  queryPackageList(params, success, fail) {
    axios
      .get(urls.communiMgmt.statisticsAnalysis_queryPackageList, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  }
};
