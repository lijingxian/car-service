import responseHandle from '@/common/error/responseHandle';
import axios from 'axios';
import urls from '@/common/urls';

export default {
  getFleetList(params, success, fail) {
    // axios
    //   .get(urls.motoristsClubDynamic.fleetList, { params: params })
    //   .then(responseHandle(success, fail))
    //   .catch(error => {
    //     console.error(error);
    //   });
  },
  selectDynamic(params, success, fail) {
    axios
      .get(urls.motoristsClubDynamic.selectDynamic, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  publishDynamic(params, success, fail) {
    axios
      .post(urls.motoristsClubDynamic.publistDynamic, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  updateDynamic(params, success, fail) {
    axios
      .post(urls.motoristsClubDynamic.updateDynamic, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  publishTopic(params, success, fail) {
    axios
      .post(urls.motoristsClubDynamic.createTopic, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  getArticleTypeList(params, success, fail) {
    axios
      .get(urls.motoristsClubDynamic.articleTypeList, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  getArticleList(params, success, fail) {
    axios
      .get(urls.motoristsClubDynamic.articleList, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  }
};
