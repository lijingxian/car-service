<template>
  <div class="x-s-m-s-preview" :style="'width:'+width">
    <preview-header :headerTitle="activity.title" :width="width">
      <i class="iconfont biz-icon-zhuanfa" slot="append"></i>
    </preview-header>
    <iframe :src="'resources/admin/ecStatic/index.html?#/recent-activity/xsms/'+activity.id"  frameborder="0" scrolling="no" :width="width" :height="height"></iframe>
  </div>
</template>

<script>
import PreviewHeader from '../../promotion/preview/PreviewHeader.vue';

export default {
  name: 'XSMSPreview',
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
  methods: {}
};
</script>

<style lang="scss">
.x-s-m-s-preview {
  color: #000;
  height: 100%;
  text-align: center;
  margin: 0 auto;
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
  .third {
    width: 100%;
    height: 25px;
    padding: 0 5px;
    background-color: #ebebeb;
    color: #929292;
    display: flex;
    justify-content: space-between;
    align-items: center;
    span {
      display: flex;
      align-items: center;
      .color-black {
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 0 1px;
        background-color: #000000;
        color: #ffffff;
        font-size: 13px;
        height: 18px;
        width: 18px;
      }
    }
  }
}
</style>
