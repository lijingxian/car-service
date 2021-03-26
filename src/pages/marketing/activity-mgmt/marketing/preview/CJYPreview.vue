<template>
  <!-- 圆形抽奖 -->
  <div class="c-j-y-preview" :style="'width:'+width">
    <preview-header :headerTitle="activity.title" :width="width">
      <i class="iconfont biz-icon-zhuanfa"
         slot="append"></i>
    </preview-header>
    <iframe :src="'resources/admin/ecStatic/index.html?#/recent-activity/turntable/'+activity.id"  frameborder="0" scrolling="no" :width="width" :height="height"></iframe>
  </div>
</template>

<script>
import PreviewHeader from '../../promotion/preview/PreviewHeader.vue';

export default {
  name: 'CJYPreview',
  data() {
    return {};
  },
  props: {
    activity: Object,
    isCreated: Boolean,
    height: {
      type: String,
      default() {
        return '667px';
      }
    },
    width: {
      type: String,
      default() {
        return '375px';
      }
    }
  },
  components: {
    PreviewHeader
  },
  watch: {},
  computed: {},
  mounted() {},
  methods: {}
};
</script>

<style lang="scss">
.c-j-y-preview {
  color: #000;
  height: 100%;
  text-align: center;
  margin: 0 auto;
  .backg {
    height: 475px;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    .cjbg {
      height: 190px;
      width: 190px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      padding: 20px 0;
      position: relative;
    }
  }
  .turnplate {
    width: 220px;
    height: 220px;
    position: absolute;
    left: 50%;
    top: 280px;
    transform: translate(-50%, -50%);
    .canvas {
      z-index: 99;
    }
    .image {
      position: absolute;
      width: 50px;
      height: 50px;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      img {
        width: 100%;
      }
    }
  }
}
</style>
