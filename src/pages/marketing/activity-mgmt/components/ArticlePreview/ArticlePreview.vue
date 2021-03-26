<template>
  <el-dialog append-to-body class="article-preview" title="预览" :visible="previewDialog" @close="close" width="450px">
    <div class="bg" :style="{ background: background}">
      <div class="cpreview">
        <div class="pcontent">
          <div class="title">
            <div>{{form.title}}</div>
            <div class="date">{{dateNow}}</div>
          </div>
          <div v-html="form.content">
          </div>
          <!-- <div class="content-footer">
            <span class="color-blue">阅读原文</span>
            <span>阅读: 10000+</span>
          </div> -->
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import phoneB from '@/assets/images/iphone-b.png';
import date from '@/utils/date';

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
  data () {
    return {
      // Dialog Start
      background: 'url(' + phoneB + ') no-repeat no-repeat',
      dateNow: date.nowDate()
      // Dialog End
    };
  },
  methods: {
    close() {
      this.$emit('update:previewDialog', false);
    }
  },
  components: {
  }
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
      width: 374px;
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
        img {
          width:auto;
          height:auto;
          max-width:100%;
          max-height:100%;
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
