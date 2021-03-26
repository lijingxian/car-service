<template>
  <div class="promotion-mgmt-card-item" @click="select">
    <div class="logo">
      <img :src="promotion.cover||getDefaultCover" alt />
      <div class="backImg"></div>
      <div class="backState">{{getState(promotion.stateStr)}}</div>
    </div>
    <div class="title">{{parseTitle(promotion.title)}}</div>
    <!-- <div class="a-type">{{getType(promotion.typeStr)}}</div> -->
    <div class="detail">
      <div class="time">
        <div>{{promotion.beginDate}}</div>
        <div>{{promotion.endDate}}</div>
      </div>
      <div class="sendButton">
        <el-button type="primary" style="padding: 7px 15px;" @click.stop="handleSend(promotion)" v-if="canPublished(promotion)&&hasAuthUnPublish">发布</el-button>
        <el-button type style="padding: 7px 15px;" @click.stop="handleDelete(promotion)"  v-if="canEdited(promotion)&&hasAuthDel">删除</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import PromotionMgmtService from '@/service/activity-mgmt/promotion-mgmt/promotionMgmt';
// import YHQ from '@/assets/images/activity-default/yhq.png';
// import TC from '@/assets/images/activity-default/tc.png';
// import XSZK from '@/assets/images/activity-default/xszk.png';
// import MS from '@/assets/images/activity-default/ms.png';
// import MJ from '@/assets/images/activity-default/mj.png';
// import BY from '@/assets/images/activity-default/by.png';
import CX from '@/assets/images/activity-default/promotion.png';
import http from '@/common/http';
import { mapGetters } from 'vuex';
export default {
  name: 'PromotionMgmtCardItem',
  data() {
    return {};
  },
  props: {
    promotion: Object
  },
  created() {},
  computed: {
    ...mapGetters('Authority', ['currentAuth']),
    hasAuthDel() {
      // return true;
      return this.currentAuth.includes('admin:promotion.delete');
    },
    hasAuthPublish() {
      // return true;
      return this.currentAuth.includes('admin:promotion.publish');
    },
    hasAuthUnPublish() {
      // return true;
      return this.currentAuth.includes('admin:promotion.unpublish');
    },
    hasAuthCommit() {
      // return true;
      return this.currentAuth.includes('admin:promotion.commit');
    },
    getDefaultCover() {
      // switch (this.promotion.promotionType) {
      //   case 'coupon':
      //     return YHQ;
      //   case 'Package':
      //     return TC;
      //   case 'Discount':
      //     return XSZK;
      //   case 'FullGift':
      //     return MS;
      //   case 'FullCut':
      //     return MJ;
      //   case 'FreeShipping':
      //     return BY;
      //   default:
      //     return '';
      // }
      return CX;
    }
  },
  methods: {
    // 为什么不直接写在{{}}中: https://github.com/vuejs/eslint-plugin-vue/issues/474
    parseTitle(title) {
      return title.length < 24 ? title : title.slice(0, 22) + '...';
    },
    // 可以发布活动
    canPublished(row) {
      return row.unionConfig ? (row.unionConfig.auditConfig ? row.unionConfig.auditConfig.publishable === '1' : false) : false;
    },
    // 可以删除、更新
    canEdited(row) {
      return row.unionConfig ? row.unionConfig.editable === '1' : false;
    },
    handleSend(row) {
      let params = {
        id: row.id
      };
      this.loading = true;
      http
        .post('/admin/promotion/publish.jhtml', params)
        .then(data => {
          this.$message({
            type: 'success',
            message: '发布成功!'
          });
          this.loading = false;
          this.$emit('deleted');
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
      if (row.isSubmit === '1') {
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
            PromotionMgmtService.deletePromotionList(
              params,
              data => {
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                });
                this.$emit('deleted');
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
      this.$emit('select', this.promotion);
    },
    getState(type) {
      switch (type) {
        case '0':
          return '未开始';
        case '1':
          return '进行中';
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
          return '包邮';
        case '1':
          return '优惠券';
        case '2':
          return '促销';
        case '3':
          return '满减';
        case '4':
          return '折扣';
        case '5':
          return '满送';
        case '6':
          return '套餐';
        case '7':
          return '会员价';
        default:
          return '';
      }
    }
  }
};
</script>

<style lang="scss">
.promotion-mgmt-card-item {
  width: 220px;
  box-shadow: 1px 1px 11px #d6d6d6;
  border-radius: 10px;
  margin: 25px;
  transition: all 0.3s;
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
    img {
      border-radius: 10px 10px 0 0;
      width: 100%;
      height: 100%;
    }
    // i {
    //   font-size: 14px;
    //   color: #ffffff;
    //   background: #ff7300;
    //   padding: 3px 8px 3px 3px;
    //   position: absolute;
    //   top: 5px;
    //   right: 15px;
    //   transition: all 0.3s;
    //   font-style: normal;
    // }
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
