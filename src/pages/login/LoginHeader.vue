<template>
  <div class="login-header">
    <div class="icon">
      <img :src="icon">
    </div>
    <h2 class="msg" @click="login">登录</h2>
    <h2 class="msg" @click="register">注册</h2>
  </div>
</template>

<script>
import icon from '@/assets/images/login/pic_logo.png';

export default {
  name: 'login-header',
  data() {
    return {
      icon: icon
    };
  },
  props: {},
  components: {},
  computed: {},
  watch: {},
  methods: {
    login() {
      this.$emit('swich', true);
    },
    register() {
      this.$emit('swich', false);
    }
  }
};
</script>

<style lang="scss">
.login-header {
  display: flex;
  margin-bottom: 20px;
  .icon {
    margin-left: 200px;
    img {
      border-radius: 5px;
    }
  }
  .msg {
    margin-left: 40px;
    cursor: pointer;
    color: #ff7300;
  }
}
</style>
