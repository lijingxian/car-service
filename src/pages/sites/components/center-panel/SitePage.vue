<template>
  <div class="site-page">
    <brick-wrapper v-for="brick of bricks" :brick-data="brick" :key="brick.id"></brick-wrapper>
    <div class="first-screen">
      <span>首屏</span>
      <el-tooltip class="item" effect="dark" content="以上内容首屏可见" placement="top-end">
        <el-button type="text" icon="el-icon-question"></el-button>
      </el-tooltip>
    </div>
  </div>
</template>

<script>
import BrickWrapper from './BrickWrapper';
import { mapGetters } from 'vuex';

export default {
  name: 'SitePage',
  components: {
    BrickWrapper
  },
  props: {},
  data() {
    return {};
  },
  computed: {
    ...mapGetters('Site', ['bricks'])
  },
  watch: {},
  created() {},
  methods: {}
};
</script>

<style lang="scss">
.site-page {
  background: #fff;
  width: 375px;
  min-height: 585px;
  position: absolute;
  margin-bottom: 85px;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  .first-screen {
    position: absolute;
    top: 585px;
    left: -48px;
    width: 40px;
    padding-top: 4px;
    border-top: 1px dashed #505f79;
    color: #505f79;
    opacity: 0.25;
    font-size: 12px;
    display: flex;
    align-content: center;
    justify-content: space-around;
    button {
      padding: 2px 0;
    }
  }
}
</style>
