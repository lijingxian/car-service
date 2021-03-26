<template>
  <div class="p-t-g-preview">
    <preview-header :headerTitle="'拼团购'">
      <i class="iconfont biz-icon-zhuanfa" slot="append"></i>
    </preview-header>
    <iframe :src="'resources/admin/ecStatic/index.html?#/recent-activity/ptg/'+activity.id"  frameborder="0" scrolling="no" width="100%" height="450px"></iframe>
  </div>
</template>

<script>
import PreviewHeader from './PreviewHeader.vue';

export default {
  name: 'PTGPreview',
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
.p-t-g-preview {
  color: #000;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  .cover {
    width: 150px;
  }
  .second {
    width: 100%;
    > .name {
      font-size: 16px;
    }
    .detail {
      display: flex;
      justify-content: space-between;
      .price {
        display: flex;
        flex-direction: column;
        .new-price {
          color: #f02b2b;
          font-size: 14px;
        }
        .old-price {
          text-decoration: line-through;
          color: #929292;
          font-size: 13px;
        }
      }
      .sale {
        font-size: 11px;
        display: flex;
        align-items: center;
        .buy-btn {
          font-size: 11px;
          background-color: rgb(249, 135, 0);
          color: #fff;
          border-radius: 3px;
          margin-left: 10px;
          padding: 0 5px;
        }
      }
    }
  }
}
</style>
