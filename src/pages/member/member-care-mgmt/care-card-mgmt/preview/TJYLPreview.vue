<template>
  <div class="t-j-y-l-preview">
    <preview-header :headerTitle="activity.title">
      <div style="color: #ff7300; width: 60px; float: right" slot="append">我的邀请</div>
    </preview-header>
    <iframe :src="'resources/admin/ecStatic/index.html?#/recent-activity/recommend/'+activity.id"  frameborder="0" scrolling="no" width="100%" height="450px"></iframe>
  </div>
</template>

<script>
import PreviewHeader from './PreviewHeader.vue';
export default {
  name: 'NYQGPreview',
  data() {
    return {};
  },
  props: {
    activity: Object,
    isCreated: Boolean
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
.t-j-y-l-preview {
  color: #000;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  .cover {
    // width: 150px;
    img {
      width: 100%;
    }
  }
  .second {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    > .desc {
      width: 240px;
    }
    .yq-btn {
      color: #fff;
      width: 240px;
      height: 40px;
      line-height: 40px;
      text-align: center;
      background-color: #f88600;
      border-radius: 5px;
      margin-top: 10px;
      cursor: pointer;
    }
  }
}
</style>
