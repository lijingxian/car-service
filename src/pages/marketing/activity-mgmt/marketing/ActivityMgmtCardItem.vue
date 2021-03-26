<template>
  <div class="activity-mgmt-card-item" @click="select">
    <div class="logo">
      <div class="image">
        <img :src="activity.cover||getDefaultCover" alt v-if="activity.typeStr!=='9'" />
        <img :src="activity.cover||getDefaultCover" alt v-if="activity.typeStr==='9'" />
      </div>
      <div class="backImg"></div>
      <div class="backState">{{getState(activity.stateStr)}}</div>
    </div>
    <div class="title">{{filteredTitle}}</div>
    <div class="a-type">{{getType(activity.typeStr)}}</div>
    <div class="detail">
      <div class="time">
        <div>{{activity.beginDate}}</div>
        <div>{{activity.endDate}}</div>
      </div>
      <div class="sendButton">
        <el-button type="primary" style="padding: 7px 15px;" @click.stop="Submit(activity)" v-if="canSubmited(activity)&&hasAuthCommit">提交</el-button>
        <el-button type="primary" style="padding: 7px 15px;" @click.stop="Revocation(activity)" v-if="canRevocationed(activity)&&hasAuthCommit">撤回</el-button>
        <el-button type="primary" style="padding: 7px 15px;" @click.stop="Pass(activity)" v-if="canPassed(activity)&&hasAuthCommit">通过</el-button>
        <el-button type="primary" style="padding: 7px 15px;" @click.stop="handleSend(activity)" v-if="canPublished(activity)&&hasAuthPublish">发布</el-button>
        <el-button type style="padding: 7px 15px;" @click.stop="handleDelete(activity)" v-if="activity.unionConfig.editable==='1'&&hasAuthDel">删除</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import activityMgmtService from '@/service/activity-mgmt/marketing/activityMgmt';
import QHB from '@/assets/images/activity-default/qhb.png';
import YYY from '@/assets/images/activity-default/yyy.png';
import CJ from '@/assets/images/activity-default/cj.png';
import PTG from '@/assets/images/activity-default/ptg.png';
import NYQG from '@/assets/images/activity-default/nyqg.png';
import XSMS from '@/assets/images/activity-default/xsms.png';
import BKJ from '@/assets/images/activity-default/bkj.png';
import TJYL from '@/assets/images/activity-default/tjyl.png';
import FXYL from '@/assets/images/activity-default/fxyl.png';
import ZM from '@/assets/images/activity-default/zm.png';
import QKHD from '@/assets/images/activity-default/qkhd.jpg';
import http from '@/common/http';

export default {
  name: 'ActivityMgmtCardItem',
  data() {
    return {};
  },
  props: {
    activity: Object
  },
  created() {},
  computed: {
    ...mapGetters('Authority', ['currentAuth']),
    hasAuthDel() {
      // return true;
      return this.currentAuth.includes('admin:activity.delete');
    },
    hasAuthPublish() {
      // return true;
      return this.currentAuth.includes('admin:activity.publish');
    },
    hasAuthUnPublish() {
      // return true;
      return this.currentAuth.includes('admin:activity.unpublish');
    },
    hasAuthCommit() {
      // return true;
      return this.currentAuth.includes('admin:activity.commit');
    },
    getDefaultCover() {
      switch (this.activity.type) {
        case '0':
          return QHB;
        case '1':
          return YYY;
        case '2':
          return CJ;
        case '3':
          return PTG;
        case '4':
          return NYQG;
        case '5':
          return XSMS;
        case '6':
          return BKJ;
        case '7':
          return TJYL;
        case '8':
          return FXYL;
        case '9':
          return ZM;
        case '11':
          return QKHD;
        case '12':
          return QKHD;
        default:
          return '';
      }
    },
    filteredTitle() {
      if (this.activity.title.length > 15) {
        return this.activity.title.slice(0, 15) + '...';
      } else {
        return this.activity.title;
      }
    }
  },
  methods: {
    // 可以发布活动
    canPublished(row) {
      return row.unionConfig ? (row.unionConfig.auditConfig ? row.unionConfig.auditConfig.publishable === '1' : false) : false;
    },
    // 可以提交审核操作
    canSubmited(row) {
      return row.unionConfig ? (row.unionConfig.auditConfig ? row.unionConfig.auditConfig.deliverable === '1' : false) : false;
    },
    // 可以通过审核
    canPassed(row) {
      return row.unionConfig ? (row.unionConfig.auditConfig ? row.unionConfig.auditConfig.passable === '1' : false) : false;
    },
    // 可以取消审核
    canCancel(row) {
      return row.unionConfig ? (row.unionConfig.auditConfig ? row.unionConfig.auditConfig.cancelable === '1' : false) : false;
    },
    // 可以撤回
    canRevocationed(row) {
      return row.unionConfig ? (row.unionConfig.auditConfig ? row.unionConfig.auditConfig.revocable === '1' : false) : false;
    },
    // 可以删除、更新
    canEdited(row) {
      return row.unionConfig ? row.unionConfig.editable === '1' : false;
    },
    // 提交审核
    Submit(row) {
      this.$confirm('是否确认提交审核?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.loading = true;
          let params = {
            eventId: row.id,
            unionStore: row.unionStore,
            mainStore: row.mainStore,
            type: '3'
          };
          activityMgmtService.submit(
            params,
            data => {
              this.$message.success('提交审核成功!');
              this.loading = false;
              this.$emit('created');
            },
            ErrorData => {
              this.loading = false;
              this.$message.warning(ErrorData.errorMessage);
            }
          );
        })
        .catch(() => {});
    },
    // 通过审核
    Pass(row) {
      this.$confirm('是否确认通过审核?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.loading = true;
          let params = {
            eventId: row.id,
            unionStore: row.unionStore,
            mainStore: row.mainStore,
            type: '3',
            state: '1'
          };
          activityMgmtService.PassOrNot(
            params,
            data => {
              this.$message.success('通过审核成功!');
              this.$emit('created');
              this.loading = false;
            },
            ErrorData => {
              this.$message.warning(ErrorData.errorMessage);
              this.loading = false;
            }
          );
        })
        .catch(() => {});
    },
    // 取消审核
    Cancel(row) {
      this.$confirm('是否确认取消审核?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.loading = true;
          let params = {
            eventId: row.id,
            unionStore: row.unionStore,
            mainStore: row.mainStore,
            type: '3',
            state: '0'
          };
          activityMgmtService.PassOrNot(
            params,
            data => {
              this.$message.success('取消审核成功!');
              this.$emit('created');
              this.loading = false;
            },
            ErrorData => {
              this.$message.warning(ErrorData.errorMessage);
              this.loading = false;
            }
          );
        })
        .catch(() => {});
    },
    // 撤回
    Revocation(row) {
      this.$confirm('是否确认撤回?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.loading = true;
          let params = {
            id: row.id
          };
          activityMgmtService.Revocation(
            params,
            data => {
              this.$message.success('撤回成功!');
              this.$emit('created');
              this.loading = false;
            },
            ErrorData => {
              this.$message.warning(ErrorData.errorMessage);
              this.loading = true;
            }
          );
        })
        .catch(() => {});
    },
    handleSend(row) {
      let params = {
        id: row.id
      };
      this.loading = true;
      http
        .post('/admin/marketing/publish.jhtml', params)
        .then(data => {
          this.$message({
            type: 'success',
            message: '发布成功!'
          });
          this.loading = false;
          this.$emit('created');
        })
        .catch(ErrorData => {
          this.loading = false;
          this.$message({
            type: 'warning',
            message: ErrorData.errorMessage
          });
        });
    },
    handleDelete(row) {
      if (row.unionConfig.editable === '1') {
        this.$confirm('是否确认删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            let ids = [];
            ids.push(row.id);
            let params = {
              ids: ids
            };
            activityMgmtService.deleteActivity(
              params,
              data => {
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                });
                this.$emit('created');
              },
              ErrorData => {
                this.$message({
                  type: 'warning',
                  message: ErrorData.errorMessage
                });
              }
            );
          })
          .catch(() => {});
      }
    },
    select() {
      this.$emit('select', this.activity);
    },
    getState(type) {
      switch (type) {
        case '0':
          return '未开始';
        case '1':
          if (this.activity.typeStr === '9' && this.activity.attendCount < this.activity.maxPersonCount) {
            return '进行中';
          } else if (this.activity.typeStr === '9' && this.activity.attendCount === this.activity.maxPersonCount) {
            return '已结束';
          } else {
            return '进行中';
          }
        case '2':
          return '已结束';
        case '3':
          return '已创建';
        case '4':
          return '已提交';
        case '5':
          return '已取消';
        default:
          return '';
      }
    },
    getType(type) {
      switch (type) {
        case '0':
          return '抢红包';
        case '1':
          return '摇一摇';
        case '2':
          return '抽奖';
        case '3':
          return '拼团购';
        case '4':
          return 'N元抢购';
        case '5':
          return '限时秒杀';
        case '6':
          return '帮砍价';
        case '7':
          return '推荐有礼';
        case '8':
          return '分享有礼';
        case '9':
          return '活动招募';
        case '11':
          return '潜客活动';
        case '12':
          return '推广活动';
        default:
          return '';
      }
    }
  }
};
</script>

<style lang="scss">
.activity-mgmt-card-item {
  width: 220px;
  box-shadow: 1px 1px 11px #d6d6d6;
  border-radius: 10px;
  margin: 25px;
  transition: all 0.3s;
  height: 300px;
  &:hover {
    opacity: 0.9;
    > .logo {
      i {
        opacity: 1;
        cursor: pointer;
      }
    }
  }
  .logo {
    width: 220px;
    height: 110px;
    position: relative;
    .image {
      width: 220px;
      height: 110px;
      text-align: center;
      img {
        border-radius: 10px 10px 0 0;
        width: 100%;
        height: auto;
        max-width: 100%;
        max-height: 100%;
      }
    }
    .backImg {
      position: absolute;
      top: 5px;
      right: 15px;
      transition: all 0.3s;
      font-style: normal;
      width: 0;
      height: 0;
      border-style: solid;
      border-width: 25px 30px 10px 30px;
      border-color: #ff7300 #ff7300 transparent #ff7300;
    }
    .backState {
      position: absolute;
      top: 5px;
      right: 15px;
      font-size: 14px;
      color: #ffffff;
      padding: 3px 8px 3px 3px;
    }
  }
  .title {
    height: 42px;
    font-weight: 700;
    font-size: 16px;
    margin: 8px;
  }
  .a-type {
    margin-left: 10px;
    margin-bottom: 5px;
    color: #ff7300;
    font-size: 14px;
  }
  .detail {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    font-size: 13px;
    .time {
      color: #666;
      margin-left: 10px;
      font-weight: 500;
      margin-bottom: 5px;
    }
    .sendButton {
      text-align: center;
      height: 40px;
      line-height: 40px;
      border-radius: 0 0 10px 10px;
    }
  }
}
</style>
