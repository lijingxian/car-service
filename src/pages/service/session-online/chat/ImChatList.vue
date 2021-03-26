<template>
  <div class="im-chat-list">
    <div class="wrapper" ref="wrapper-ref">
      <infinite-loading direction="top" @infinite="infiniteHandler">
        <div slot="no-results"></div>
        <div slot="no-more"></div>
      </infinite-loading>
      <im-chat-item v-for="message of room.messageList" :key="message.id" :isOnline="room.isOnline" :message="message" @product="onProduct"></im-chat-item>
    </div>
  </div>
</template>

<script>
import ImChatItem from './ImChatItem';
import { mapGetters, mapMutations } from 'vuex';
import InfiniteLoading from 'vue-infinite-loading';
import IoService from '@/service/customer-service/session-online/imIo';

export default {
  name: 'ImChatList',
  data() {
    return {
      selfInit: false,
      pageSize: 20
    };
  },
  props: {
    room: {
      required: true,
      type: Object
    }
  },
  created() {},
  mounted() {
    setTimeout(() => {
      this.room.scrollWrapper.scrollTop = this.room.scrollWrapper.scrollHeight - this.room.scrollWrapper.clientHeight;
    }, 500);
  },
  computed: {
    ...mapGetters(['currentUser']),
    chatType() {
      switch (this.room.imType) {
        case 'cs':
          return '0';
        case 'client':
          return '2';
        case 'clientEnd':
          return '2';
        case 'group':
          return '1';
        default:
          return '';
      }
    }
  },
  components: {
    ImChatItem,
    InfiniteLoading
  },
  methods: {
    ...mapMutations('SessionOnline', ['increasePageNumberAndInit']),
    onProduct(id) {
      this.$emit('product', id);
    },
    infiniteHandler($state) {
      this.room.scrollWrapper = this.$refs['wrapper-ref'];
      if (!this.room.scroll) {
        this.room.scroll = $state;
      }
      if (!this.selfInit && this.room.hasInit) {
        this.selfInit = true;
        this.room.scroll = $state;
      }
      this.selfInit = true;
      this.getMessageList();
    },

    getMessageList() {
      let params = {
        chatType: this.chatType,
        shopId: this.currentUser.shop.id,
        toId: this.room.id,
        fromId: this.chatType === '2' ? this.room.id : this.currentUser.id,
        pageNumber: this.room.pageNumber,
        pageSize: this.pageSize
      };
      IoService.getMessageList(params);
      this.increasePageNumberAndInit(this.room);
    }
  }
};
</script>

<style lang="scss">
.im-chat-list {
  .wrapper {
    width: 438px;
    height: 395px;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    padding: 10px 5px;
    &::-webkit-scrollbar {
      //滚动条的宽度
      width: 2px;
      height: 12px;
    }
    &::-webkit-scrollbar-thumb {
      background: #c3c3c3;
      border-radius: 12px;
    }
  }
}
</style>
