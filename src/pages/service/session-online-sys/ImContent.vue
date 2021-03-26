<template>
  <div class="im-content">
    <im-header></im-header>
    <div class="c-bottom">
      <im-chat-window @product="onProduct"></im-chat-window>
      <im-right-sidebar ref="rightSidebar"></im-right-sidebar>
    </div>
  </div>
</template>

<script>
import ImHeader from './ImHeader';
import ImChatWindow from './chat/ImChatWindow';
import ImRightSidebar from './right-sidebar/ImRightSidebar';

export default {
  name: 'ImContent',
  data() {
    return {};
  },
  created() {},
  components: {
    ImHeader,
    ImChatWindow,
    ImRightSidebar
  },
  methods: {
    onProduct(id) {
      this.$emit('product', id);
    }
  }
};
</script>

<style lang="scss">
.im-content {
  width: 777px;
  display: flex;
  flex-direction: column;
  border-left: 1px solid #e2e2e2;
  > .c-bottom {
    display: flex;
    height: 520px;
    width: 777px;
  }
}
</style>
