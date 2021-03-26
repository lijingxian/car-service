<template>
  <div class="login-body" v-loading="loading">
    <back-ground @load="load" :isLogin="isLogin" ref="bg">
    </back-ground>
  </div>
</template>

<script>
import BackGround from './BackGround';

export default {
  name: 'login-body',
  data() {
    return {
      loading: false
    };
  },
  props: {
    isLogin: {
      type: Boolean,
      default: true
    }
  },
  components: { BackGround },
  computed: {},
  watch: {},
  methods: {
    load(flag) {
      this.loading = flag;
    }
  }
};
</script>

<style lang="scss">
.login-body {
  height: 500px;
  background: linear-gradient(to right, #f9ad4d, #ff7300);
}
</style>
