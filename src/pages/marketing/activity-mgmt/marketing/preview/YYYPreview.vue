<template>
  <div class="y-y-y-preview" :style="'width:'+width">
    <preview-header :headerTitle="activity.title" :width="width">
      <i class="iconfont biz-icon-zhuanfa" slot="append"></i>
    </preview-header>
    <iframe :src="'resources/admin/ecStatic/index.html?#/recent-activity/shake/'+activity.id"  frameborder="0" scrolling="no" :width="width" :height="height"></iframe>
  </div>
</template>

<script>
import PreviewHeader from '../../promotion/preview/PreviewHeader.vue';

export default {
  name: 'YYYPreview',
  data() {
    return {};
  },
  props: {
    activity: Object,
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
  computed: {
  },
  methods: {}
};
</script>

<style lang="scss">
.y-y-y-preview {
  color: #000;
  // width: 270px;
  height: 100%;
  text-align: center;
  margin: 0 auto;
  .backg {
    // height: 475px;
    // width: 274px;
    width: 100%;
    height: 450px;
    display: flex;
    flex-direction: column;
    align-items: center;
    .title {
      width: 100%;
      color: #fff;
      font-size: 20px;
      text-align: center;
    }
    .today {
      margin-top: 15px;
      color: #fff;
      width: 150px;
      border-radius: 10px;
      line-height: 30px;
      text-align: center;
      height: 30px;
      background-color: rgba(0, 0, 0, 0.4);
    }
    .desc {
      color: #ffe461;
      width: 100%;
      font-size: 14px;
      padding: 20px;
    }
  }
}
</style>
