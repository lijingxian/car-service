<template>
  <el-dialog append-to-body class="article-preview" title="预览" :visible="previewDialog" @close="close" width="450px">
    <div class="bg" :style="{ background: background}">
      <div class="cpreview">
        <div class="pcontent">
          <div class="title">
            <div>{{form.title}}</div>
            <div class="footer-left">
              <img v-if="getUser.shop && getUser.shop.logo" :src="getUser.shop.logo" alt="" class="shop-logo">
              <span class="shop-name">{{ getUser.shop ? getUser.shop.name : '' }}</span>
              <span class="publish-date">{{dateNow}}</span>
            </div>
          </div>
          <div v-html="form.content" class="contents"></div>
          <div v-for="(productList,index) in form.productList" :key="index"><img :src="productList.image"></div>
          <iframe :src="form.contentUrlPreview||form.contentUrl" frameborder="0 " class="iframe" width="100%" height="450px" v-if="form.articleType==='2'"></iframe>
          <Xgplayer v-if="form.articleType==='3'" :config="config" />
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import phoneB from '@/assets/images/iphone-b.png';
import date from '@/utils/date';
import Xgplayer from 'xgplayer-vue';
import { mapGetters } from 'vuex';
export default {
  name: 'ArticlePreview',
  props: {
    previewDialog: {
      type: Boolean,
      default: false
    },
    form: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      // Dialog Start
      background: 'url(' + phoneB + ') no-repeat no-repeat',
      dateNow: date.nowDate()
      // Dialog End
    };
  },
  created() {
    console.log(this.form);
  },
  computed: {
    ...mapGetters(['getUser']),
    config() {
      return {
        width: 4,
        height: 3,
        id: 'shop-publicity-video-preview',
        videoInit: true,
        fluid: true,
        url: this.form.contentUrl
      };
    }
  },
  methods: {
    close() {
      this.$emit('update:previewDialog', false);
    }
  },
  components: { Xgplayer }
};
</script>

<style lang="scss">
.article-preview {
  .color-blue {
    color: #607fa6;
  }
  .bg {
    margin: 0 auto;
    position: relative;
    width: 390px;
    height: 653px;
    .cpreview {
      overflow: auto;
      position: absolute;
      padding: 10px;
      width: 354px;
      height: 500px;
      top: 76px;
      left: 18px;
      outline: none;
      background-color: #fff;
      &::-webkit-scrollbar {
        width: 8px;
      }
      &::-webkit-scrollbar-track {
        // background-color: red;
        -webkit-border-radius: 2em;
        -moz-border-radius: 2em;
        border-radius: 2em;
      }
      &::-webkit-scrollbar-thumb {
        background-color: #c2c2c2;
        -webkit-border-radius: 2em;
        -moz-border-radius: 2em;
        border-radius: 2em;
      }
      .pcontent {
        word-wrap: break-word;
        .title {
          color: #000;
          font-size: 22px;
          font-weight: 400;
          .date {
            font-size: 16px;
            color: #8c8c8c;
          }
        }
        .footer-left {
          width: 100%;
          height: 38px;
          display: flex;
          align-items: center;
          font-size: 13px;
          line-height: 38px;
          color: #999;
          .shop-name {
            flex-grow: 1;
            // 文本溢出显示省略号
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 1;
            -webkit-box-orient: vertical;
          }
          .publish-date {
            margin-left: 10px;
            flex-shrink: 0;
          }
          img {
            flex-shrink: 0;
            object-fit: cover;
            border-radius: 50%;
            height: 20px !important;
            width: 20px !important;
            margin-right: 5px;
          }
        }
        .contents {
          max-width: 334px;
          .img_model {
            max-width: 256px;
          }
          .text_legend {
            max-width: 256px;
          }
          img {
            max-width: 256px;
            max-height: 300px;
          }
        }
        .content-footer {
          font-size: 12px;
          font-weight: bold;
        }
      }
    }
  }
}
</style>
