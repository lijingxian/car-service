<template>
  <div class="app-layout">
    <main-header></main-header>
    <div class="app-container">
      <transition name="fade-transform"
                  mode="out-in">
        <router-view/>
      </transition>
    </div>
  </div>
</template>

<script>
import MainHeader from './MainHeader';

export default {
  name: 'Layout',
  data() {
    return {};
  },
  props: {},
  components: { MainHeader },
  computed: {},
  watch: {},
  methods: {}
};
</script>

<style lang="scss">
.app-layout {
  display: flex;
  flex-direction: column;
  height: 100%;
  .app-container {
    display: flex;
    flex-grow: 1;
    overflow: hidden;
    .side-bar-container {
      min-width: 250px;
    }
  }
}
</style>
