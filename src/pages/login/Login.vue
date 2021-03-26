<template>
  <div class="login">
    <login-header @swich="swich">
    </login-header>
    <login-body :isLogin="isLogin" ref="body">
    </login-body>
    <login-footer></login-footer>
  </div>
</template>

<script>
import LoginHeader from './LoginHeader';
import LoginBody from './LoginBody';
import LoginFooter from './Footer';

export default {
  name: 'login',
  data() {
    return {
      isLogin: true
    };
  },
  props: {},
  components: { LoginHeader, LoginBody, LoginFooter },
  computed: {},
  watch: {},
  methods: {
    swich(flag) {
      this.isLogin = flag;
      this.$refs.body.$refs.bg.isRotate = false;
    }
  }
};
</script>

<style lang="scss">
</style>
