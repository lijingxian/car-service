<template>
  <div class="b-k-j-preview">
    <preview-header :headerTitle="activity.title">
      <i class="iconfont biz-icon-zhuanfa" slot="append"></i>
    </preview-header>
    <iframe :src="'resources/admin/ecStatic/index.html?#/recent-activity/bkj/'+activity.id"  frameborder="0" scrolling="no" width="100%" height="450px"></iframe>
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
  computed: {},
  methods: {}
};
</script>

<style lang="scss">
.b-k-j-preview {
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
  }
}
</style>
