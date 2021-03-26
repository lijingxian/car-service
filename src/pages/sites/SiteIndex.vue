<template>
  <el-container class="site-index">
    <el-header>
      <site-header></site-header>
    </el-header>
    <el-container>
      <el-aside width="400px">
        <com-area></com-area>
      </el-aside>
      <el-main>
        <center-panel></center-panel>
      </el-main>
      <el-aside width="361px">
        <control-panel></control-panel>
      </el-aside>
    </el-container>
  </el-container>
</template>

<script>
import ComArea from './components/com-area/ComArea';
import SiteHeader from './components/header/SiteHeader';
import CenterPanel from './components/center-panel/CenterPanel';
import ControlPanel from './components/control-panel/ControlPanel';
import { mapMutations, mapActions } from 'vuex';

export default {
  name: 'SiteIndex',
  components: {
    ComArea,
    SiteHeader,
    CenterPanel,
    ControlPanel
  },
  props: {},
  data() {
    return {};
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    window.document.documentElement.style.fontSize = '37.5px';
    this.updateActivityId(this.$route.query.activityId || '');
    this.getActivityContent();
  },
  beforeDestroy() {
    window.document.documentElement.style = null;
  },
  methods: {
    ...mapMutations('Site', ['updateActivityId']),
    ...mapActions('Site', ['getActivityContent'])
  }
};
</script>

<style lang="scss">
.site-index {
  height: 100%;
  line-height: 1.15;
  font-size: 14px;
  .el-header {
    background-color: #fff;
    padding: 0 32px;
    box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.08);
    z-index: 5;
  }
  .el-main {
    background-color: #f4f7f9;
    padding: 0;
  }
}
</style>
