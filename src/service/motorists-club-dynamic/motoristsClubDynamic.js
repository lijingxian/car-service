import responseHandle from '@/common/error/responseHandle';
import axios from 'axios';
import urls from '@/common/urls';

export default {
  getMotoristsClub(params, success, fail) {
    axios
      .get(urls.motoristsClubDynamic.motoristsClub, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  getMotoristsClubMember(params, success, fail) {
    axios
      .get(urls.motoristsClubDynamic.motoristsClubMember, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  getDynamicList(params, success, fail) {
    axios
      .get(urls.motoristsClubDynamic.dynamicList, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  getTopicList(params, success, fail) {
    axios
      .get(urls.motoristsClubDynamic.topicList, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  thumbsUp(params, success, fail) {
    axios
      .post(urls.motoristsClubDynamic.thumbsUp, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  top(params, success, fail) {
    axios
      .post(urls.motoristsClubDynamic.top, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  recommend(params, success, fail) {
    axios
      .post(urls.motoristsClubDynamic.recommend, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  delete(params, success, fail) {
    axios
      .post(urls.motoristsClubDynamic.delete, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  deleteTopic(params, success, fail) {
    axios
      .post(urls.motoristsClubDynamic.topicDelete, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  topTopic(params, success, fail) {
    axios
      .post(urls.motoristsClubDynamic.topicTop, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  topicRecommend(params, success, fail) {
    axios
      .post(urls.motoristsClubDynamic.topicRecommend, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  selectTopic(params, success, fail) {
    axios
      .get(urls.motoristsClubDynamic.seleteTopic, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  updateTopic(params, success, fail) {
    axios
      .post(urls.motoristsClubDynamic.updateTopic, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  getKPI(params, success, fail) {
    axios
      .get(urls.motoristsClubDynamic.kpi, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  }
};
