<template>
  <div class="c-j-f-preview" :style="'width:'+width">
    <preview-header :headerTitle="activity.title" :width="width">
      <i class="iconfont biz-icon-zhuanfa" slot="append"></i>
    </preview-header>
    <iframe :src="'resources/admin/ecStatic/index.html?#/recent-activity/square/'+activity.id"  frameborder="0" scrolling="no"  :width="width" :height="height"></iframe>
  </div>
</template>

<script>
import PreviewHeader from '../../promotion/preview/PreviewHeader.vue';

export default {
  name: 'CJFPreview',
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
  computed: {},
  methods: {}
};
</script>

<style lang="scss">
.c-j-f-preview {
  color: #000;
  height: 100%;
  text-align: center;
  margin: 0 auto;
  .backg {
    height: 475px;
    width: 274px;
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
      .row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 150px;
        .item {
          height: 45px;
          width: 45px;
          display: flex;
          flex-direction: column;
          align-items: center;
          background-color: #fef3a4;
          border-radius: 5px;
          .image {
            height: 25px;
            width: 25px;
            margin-top: 5px;
            img {
              width: 100%;
            }
          }
          .name {
            font-size: 6px;
            line-height: 10px;
            color: #292811;
          }
        }
        .wycj {
          height: 45px;
          width: 45px;
          background-color: #fb4b24;
          display: flex;
          justify-content: center;
          align-items: center;
          border-radius: 5px;
          .center {
            height: 30px;
            width: 35px;
          }
        }
      }
    }
  }
}
</style>
