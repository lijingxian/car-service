import responseHandle from '@/common/error/responseHandle';
import axios from 'axios';
import urls from '@/common/urls';

export default {
  getKPI(params, success, fail) {
    axios
      .get(urls.activityMgmt.ActivityKPI, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  getShopList(params, success, fail) {
    axios
      .get(urls.activityMgmt.getShopList, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  getActivityList(params, success, fail) {
    axios
      .get(urls.activityMgmt.ActivityList, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  getInitInfo: async function(params, success, fail) {
    axios
      .get(urls.activityMgmt.getInitInfo, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  getActivity(params, success, fail) {
    axios
      .get(urls.activityMgmt.Activity, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  createActivity(params, success, fail) {
    axios
      .post(urls.activityMgmt.Activity, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  updateActivity(params, success, fail) {
    axios
      .put(urls.activityMgmt.Activity, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  deleteActivity(params, success, fail) {
    axios
      .delete(urls.activityMgmt.Activity, { data: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  getMatchActivityList(params, success, fail) {
    axios
      .get(urls.activityMgmt.matchActivityList, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  getAwardList(params, success, fail) {
    axios
      .get(urls.activityMgmt.AwardList, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  createAward(params, success, fail) {
    axios
      .post(urls.activityMgmt.Award, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  getAward(params, success, fail) {
    axios
      .get(urls.activityMgmt.Award, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  updateAward(params, success, fail) {
    axios
      .put(urls.activityMgmt.Award, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  deleteAward(params, success, fail) {
    axios
      .delete(urls.activityMgmt.Award, { data: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  getActivityNotice(params, success, fail) {
    axios
      .get(urls.activityMgmt.ActivityNotice, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  getLocalActivityNotice(params, success, fail) {
    axios
      .get(urls.activityMgmt.LocalActivityNotice, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  updateActivityNotice(params, success, fail) {
    axios
      .put(urls.activityMgmt.ActivityNotice, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  updateLocalActivityNotice(params, success, fail) {
    axios
      .put(urls.activityMgmt.LocalActivityNotice, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  publishActivityNotice(params, success, fail) {
    axios
      .post(urls.activityMgmt.PublishActivityNotice, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  publishLocalActivityNotice(params, success, fail) {
    axios
      .post(urls.activityMgmt.PublishLocalActivityNotice, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  getActivityParticipant(params, success, fail) {
    axios
      .get(urls.activityMgmt.ActivityParticipant, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 获取帮砍价参与记录
  getBKRecordList(params, success, fail) {
    axios
      .get(urls.activityMgmt.BKRecord, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 核销
  verification(params, success, fail) {
    axios
      .post(urls.activityMgmt.Verification, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  getStatisticsAnalysis(params, success, fail) {
    axios
      .get(urls.activityMgmt.StatisticsAnalysis, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 提交审核
  submit(params, success, fail) {
    axios
      .post(urls.activityMgmt.Verified, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 通过/取消审核
  PassOrNot(params, success, fail) {
    axios
      .post(urls.activityMgmt.Pass, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 发布活动
  publishActivity(params, success, fail) {
    axios
      .get(urls.activityMgmt.Publish, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 撤回活动
  Revocation(params, success, fail) {
    axios
      .get(urls.activityMgmt.Revocation, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 导出活动列表
  exportAttend(params, success, fail) {
    axios
      .get(urls.activityMgmt.exportAttend, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  }
};
