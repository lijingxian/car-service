import responseHandle from '@/common/error/responseHandle';
import axios from 'axios';
import urls from '@/common/urls';

export default {
  getCommentList(params, success, fail) {
    axios
      .get(urls.motoristsClubDynamic.commentList, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  thumbsUp(params, success, fail) {
    axios
      .get(urls.motoristsClubDynamic.thumbsUp, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  reply(params, success, fail) {
    axios
      .post(urls.motoristsClubDynamic.comment, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  supportComment(params, success, fail) {
    axios
      .post(urls.motoristsClubDynamic.supportComment, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  deleteCommnet(params, success, fail) {
    axios
      .post(urls.motoristsClubDynamic.deleteCommnet, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  }
};
