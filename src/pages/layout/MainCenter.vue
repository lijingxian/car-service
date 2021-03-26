<template>
  <div class="main-center">
    <transition name="fade-transform" mode="out-in">
      <router-view />
    </transition>
  </div>
</template>

<script>
export default {
  name: 'app-main',
  data() {
    return {};
  },
  props: {},
  computed: {},
  watch: {},
  methods: {}
};
</script>

<style lang="scss">
.main-center {
  position: relative;
  flex-grow: 1;
  overflow: hidden;
  background-color: #ffffff;
}

.fade-transform-leave-active,
.fade-transform-enter-active {
  transition: all 0.5s;
}
.fade-transform-enter {
  opacity: 0;
  transform: translateX(-20px);
}
.fade-transform-leave-to {
  opacity: 0;
  transform: translateX(20px);
}
</style>
