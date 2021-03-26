<template>
  <el-dialog class="dynamic-preview"
             title="查看"
             :visible="open"
             @close="close"
             width="450px"
             :append-to-body="true">
    <div class="bg"
         :style="{ background: background}">
      <div class="cpreview">
        <div class="pcontent">
          <div class="title">{{denamic.title}}</div>
          <div class="detail">
            <div class="avater">
              <img :src="head"
                   alt="">
            </div>
            <div class="vt">
              <div class="name">{{author}}</div>
              <div class="time">{{denamic.publishDate}}</div>
            </div>
          </div>
          <div v-html="denamic.content"
               v-loading="loading">
          </div>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import phoneB from '@/assets/images/iphone-b.png';
import axios from 'axios';
import urls from '@/common/urls';
import responseHandle from '@/common/error/responseHandle';
import DefaultAvatar from '@/assets/images/default_user.png';
import emoji from '@/utils/emoji';

export default {
  name: 'DynamicPreview',
  data() {
    return {
      DefaultAvatar: DefaultAvatar,
      loading: false,
      phoneB: phoneB,
      background: 'url(' + phoneB + ') no-repeat no-repeat',
      denamic: {
        title: '',
        member: {
          head: '',
          id: '',
          nickname: ''
        }
      }
    };
  },
  props: {
    open: {
      type: Boolean,
      default: false
    },
    author: {
      type: String,
      default: ''
    },
    dynamicId: String
  },
  components: {},
  watch: {
    dynamicId(newValue) {
      if (this.isOpen) {
        this.refresh();
      }
    },
    open(isOpen) {
      if (isOpen && this.dynamicId) {
        this.refresh();
      }
    }
  },
  computed: {
    head() {
      if (this.denamic.authorData && this.denamic.authorData.head) {
        return this.denamic.authorData.head;
      } else {
        return this.DefaultAvatar;
      }
    }
  },
  methods: {
    close() {
      this.$emit('update:open', false);
    },
    refresh() {
      this.loading = true;
      let params = {
        spaceId: this.dynamicId
      };
      axios
        .get(urls.motoristsClubDynamic.selectDynamic, { params: params })
        .then(
          responseHandle(
            data => {
              this.denamic = data.data;
              this.denamic.content = emoji.transform(this.denamic.content);
              this.loading = false;
            },
            fail => {
              console.log(fail);
              this.loading = false;
            }
          )
        )
        .catch(error => {
          this.loading = false;
          console.error(error);
        });
    }
  }
};
</script>

<style lang="scss">
.dynamic-preview {
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
          font-size: 18px;
          font-weight: 700;
        }
        .detail {
          display: flex;
          align-items: center;
          .avater {
            margin: 5px;
            width: 50px;
            height: 50px;
          }
          img {
            width: 50px;
            height: 50px;
            border-radius: 25px;
          }
        }
        .ql-video,
        img {
          max-width: 100%;
        }
      }
    }
  }
}
</style>
