<template>
  <div class="main-container">
    <side-bar class="side-bar-container">
    </side-bar>
    <main-center>
    </main-center>
  </div>
</template>

<script>
import SideBar from './SideBar/index';
import MainCenter from './MainCenter';

export default {
  name: 'MainContainer',
  data() {
    return {};
  },
  props: {},
  components: { SideBar, MainCenter },
  computed: {},
  watch: {},
  methods: {}
};
</script>

<style lang="scss">
.main-container {
  display: flex;
  flex-grow: 1;
  overflow: hidden;
  .side-bar-container {
    width: 250px;
    z-index: 1500;
    box-shadow: 3px 0 3px #dedede;
  }
}
</style>
