<template>
  <div class="topic-item">
    <div class="item-body">
      <div class="left">
        <div class="avatar">
          <img :src="topic.authorData.head||DefaultAvatar" alt="">
        </div>
        <div class="right-detail">
          <div class="title" @click="select">#{{topic.title}}#</div>
          <div class="introduction">{{topic.introduction}}</div>
          <div class="from">
            <div class="name">{{topic.author}}</div>
            <div class="detail">{{topic.createDatetime}}</div>
          </div>
        </div>
      </div>
      <div class="handle">
        <i @click="top" class="iconfont biz-icon-zhiding" :class="{active:topic.isTop==='1'}" title="置顶"></i>
        <i class="iconfont biz-icon-vertical_line"></i>
        <i @click="deleteTopic" class="el-icon-delete" title="删除" v-if="hasAuthDel"></i>
      </div>
    </div>
  </div>
</template>

<script>
import DynamicService from '@/service/motorists-club-dynamic/motoristsClubDynamic';
import DefaultAvatar from '@/assets/images/default_user.png';
import { mapGetters } from 'vuex';
export default {
  name: 'TopicItem',
  data() {
    return {
      DefaultAvatar: DefaultAvatar
    };
  },
  props: {
    topic: Object
  },
  computed: {
    ...mapGetters('Authority', ['currentAuth']),
    hasAuthDel() {
      // return true;
      return this.currentAuth.includes('admin:space.topic.delete');
    }
  },
  methods: {
    reply() {
      this.$emit('reply');
    },
    select() {
      this.$emit('selectTopic', this.topic.id);
    },
    // 置顶
    top() {
      let params = {
        topicId: this.topic.id,
        shopId: window.top.SHOP_ID || ''
      };
      DynamicService.topTopic(
        params,
        data => {
          let topic = this.topic;
          if (data.isTop === '1') {
            topic.isTop = '1';
          } else {
            topic.isTop = '0';
          }
          this.$emit('updated');
        },
        ErrorData => {
          console.log(ErrorData);
        }
      );
    },
    deleteTopic() {
      this.$emit('deleteTopic', this.topic.id);
    }
  }
};
</script>

<style lang="scss">
.topic-item {
  margin: 10px 0;
  padding: 10px;
  .item-body {
    display: flex;
    justify-content: space-between;
    .left {
      width: 88%;
      display: flex;
      .avatar {
        margin-right: 20px;
        img {
          width: 50px;
          height: 50px;
        }
      }
      .right-detail {
        .title {
          font-size: 16px;
          color: #ff7300;
          cursor: pointer;
          margin-bottom: 3px;
        }
        .introduction {
          font-size: 13px;
          color: #868686;
          margin-bottom: 3px;
        }
        .from {
          display: flex;
          align-items: center;
          .name {
            font-size: 14px;
            margin-right: 10px;
          }
          .detail {
            color: #808080;
            font-size: 12px;
          }
        }

        .content {
          font-size: 14px;
          font-weight: 400px;
          color: #333;
        }
      }
    }

    .handle {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      i {
        font-size: 20px;
      }
      .biz-icon-zhiding {
        &:hover {
          color: #ff7300;
          cursor: pointer;
        }
      }
      .biz-icon-tuijian {
        &:hover {
          color: #ff7300;
          cursor: pointer;
        }
      }
      .el-icon-delete {
        &:hover {
          color: #f56c6c;
          cursor: pointer;
        }
      }
      .biz-icon-zhiding.active {
        color: #ff7300;
      }
      .biz-icon-tuijian.active {
        color: #ff7300;
      }
    }
  }
  // .el-dialog {
  //   .el-carousel {
  //     height: 600px;
  //     .el-carousel__item {
  //       display: flex;
  //       justify-content: center;
  //     }
  //   }
  //   img {
  //     width: auto;
  //     height: auto;
  //     max-width: 100%;
  //     max-height: 100%;
  //   }
  // }
}
</style>
