<template>
  <el-menu-item class="im-group-item"
                @click="choose"
                :index="index">
    <div class="avatar">
      <img :src="group.head||DefaultAvatar"
           alt="">
    </div>
    <div class="name">
      {{group.name.length>13?(group.name.slice(0,10)+'...'):group.name}}
    </div>
    <div class="message-part"
         v-html="messagePart">
    </div>
    <div class="unread-count"
         v-show="unreadCount>0">
      <div class="count">
        {{unreadCount}}
      </div>
    </div>
  </el-menu-item>
</template>

<script>
import DefaultAvatar from '@/assets/images/default_user.png';
import { mapGetters } from 'vuex';

export default {
  name: 'ImGroupItem',
  data() {
    return {
      DefaultAvatar: DefaultAvatar
    };
  },
  props: {
    group: Object,
    index: String
  },
  created() {},
  mounted() {},
  components: {},
  computed: {
    ...mapGetters('SessionOnline', ['roomList']),
    messagePart() {
      for (const iterator of this.roomList) {
        if (iterator.imType === this.group.imType) {
          if (iterator.id === this.group.id) {
            if (iterator.messageList.length > 0) {
              let mtype = iterator.messageList[iterator.messageList.length - 1].body.type;
              if (mtype === 'txt') {
                return iterator.messageList[iterator.messageList.length - 1].body.msg.slice(0, 10);
              } else if (mtype === 'img') {
                return '图片信息';
              } else if (mtype === 'video') {
                return '视频信息';
              } else if (mtype === 'loc') {
                return '位置信息';
              }
              return '';
            }
            break;
          }
        }
      }
      return '';
    },
    unreadCount() {
      for (const iterator of this.roomList) {
        if (iterator.imType === this.group.imType) {
          if (iterator.id === this.group.id) {
            let unreadCount = 0;
            for (const message of iterator.messageList) {
              if (!message.isReaded) {
                unreadCount++;
              }
            }
            return unreadCount;
          }
        }
      }
      return 0;
    }
  },
  methods: {
    choose() {
      this.$emit('choose', this.group);
    }
  }
};
</script>

<style lang="scss">
.im-group-item {
  padding-left: 60px !important;
  padding-right: 30px !important;
  .avatar {
    position: absolute;
    width: 40px;
    height: 40px;
    left: 10px;
    top: 50%;
    margin-top: -20px;
    border-radius: 20px;
    img {
      position: absolute;
      width: 100%;
      height: 100%;
      border-radius: 20px;
    }
  }
  .name {
    margin-left: 5px;
    padding-top: 10px;
    height: 30px;
    line-height: 20px;
  }
  .message-part {
    margin-left: 5px;
    height: 20px;
    line-height: 20px;
    color: #b3b7b8;
  }
  .unread-count {
    position: absolute;
    left: 182px;
    top: 14px;
    background: #ef4947;
    height: 14px;
    width: 14px;
    line-height: 14px;
    border-radius: 7px;
    transition: all 0.3s ease-out;
    display: flex;
    justify-content: center;
    align-items: center;
    > .count {
      color: #fff;
      font-size: 12px;
      -webkit-transform-origin-x: 0;
      transform: scale(0.9);
      padding-bottom: 2px;
      padding-left: 2px;
    }
  }
}
</style>
