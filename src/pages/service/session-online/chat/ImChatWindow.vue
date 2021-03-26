<template>
  <div class="im-chat-window" :style="style">
    <div class="list-wrapper">
      <im-chat-list v-for="room of groupList" :style="chatListStyle(room)" :room="room" :key="'group'+room.id" @product="onProduct"></im-chat-list>
      <im-chat-list v-for="room of csListOnline" :style="chatListStyle(room)" :room="room" :key="'cs'+room.id" @product="onProduct"></im-chat-list>
      <im-chat-list v-for="room of csListNotOnline" :style="chatListStyle(room)" :room="room" :key="'cs'+room.id" @product="onProduct"></im-chat-list>
      <im-chat-list v-for="room of clientListOnline" :style="chatListStyle(room)" :room="room" :key="'client'+room.id" @product="onProduct"></im-chat-list>
      <im-chat-list v-for="room of clientListNotOnline" :style="chatListStyle(room)" :room="room" :key="'client'+room.id" @product="onProduct"></im-chat-list>
      <im-chat-list v-for="room of clientEndListOnline" :style="chatListStyle(room)" :room="room" :key="'client'+room.id" @product="onProduct"></im-chat-list>
      <im-chat-list v-for="room of clientEndListNotOnline" :style="chatListStyle(room)" :room="room" :key="'client'+room.id" @product="onProduct"></im-chat-list>
    </div>
    <im-chat-area></im-chat-area>
  </div>
</template>

<script>
import ImChatList from './ImChatList';
import ImChatArea from './ImChatArea';
import { mapGetters } from 'vuex';

export default {
  name: 'ImChatWindow',
  data() {
    return {};
  },
  created() {},
  components: {
    ImChatArea,
    ImChatList
  },
  computed: {
    ...mapGetters('SessionOnline', [
      'activatedRoom',
      'groupList',
      'csListOnline',
      'csListNotOnline',
      'clientListOnline',
      'clientListNotOnline',
      'clientEndListOnline',
      'clientEndListNotOnline',
      'csData'
    ]),
    style() {
      if (this.activatedRoom.id) {
        return {};
      }
      return {
        visibility: 'hidden'
      };
    }
  },
  methods: {
    onProduct(id) {
      this.$emit('product', id);
    },
    isActivated(room) {
      return this.activatedRoom.imType === room.imType && this.activatedRoom.id === room.id;
    },
    chatListStyle(room) {
      if (this.activatedRoom.imType === room.imType && this.activatedRoom.id === room.id) {
        return {};
      }
      return {
        position: 'absolute',
        top: '6600px'
      };
    }
  }
};
</script>

<style lang="scss">
.im-chat-window {
  width: 438px;
  height: 520px;
  .list-wrapper {
    position: relative;
  }
}
</style>
