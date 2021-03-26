import responseHandle from '@/common/error/responseHandle';
import axios from 'axios';
import urls from '@/common/urls';

export default {
  // 获取会话质检列表
  getSessionCheckList(params, success, fail) {
    axios
      .get(urls.customerService.SessionCheckList, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 根据会话查看聊天
  getChatList(params, success, fail) {
    axios
      .get(urls.customerService.ChatList, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 根据会话查打分
  getSessionCount(params, success, fail) {
    axios
      .get(urls.customerService.sessionCount, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 主管根据会话打分
  score(params, success, fail) {
    axios
      .post(urls.customerService.SessionScore, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  }
};
