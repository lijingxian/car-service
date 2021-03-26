<template>
  <div class="n-y-q-g-preview" :style="'width:'+width">
    <preview-header :headerTitle="activity.title" :width="width">
      <i class="iconfont biz-icon-zhuanfa" slot="append"></i>
    </preview-header>
    <iframe :src="'resources/admin/ecStatic/index.html?#/recent-activity/nyqg/'+activity.id"  frameborder="0" scrolling="no" :width="width" :height="height"></iframe>
  </div>
</template>

<script>
import PreviewHeader from '../../promotion/preview/PreviewHeader.vue';
export default {
  name: 'NYQGPreview',
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
  computed: {
  },
  methods: {}
};
</script>

<style lang="scss">
.n-y-q-g-preview {
  color: #000;
  height: 100%;
  text-align: center;
  margin: 0 auto;
  .shop-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    .shop {
      display: flex;
      align-items: center;
      font-size: 12px;
      img {
        margin-right: 5px;
        width: 30px;
        height: 30px;
      }
    }
  }
  .activity-info {
    width: 100%;
    .label {
      margin-top: 10px;
      margin-bottom: 5px;
      padding-left: 5px;
      border-left: 3px solid #ff7300;
    }
    .product {
      display: flex;
      img {
        max-width: 30px;
        max-height: 30px;
      }
    }
  }
  .go {
    width: 90%;
    margin-top: 5px;
  }
}
</style>
