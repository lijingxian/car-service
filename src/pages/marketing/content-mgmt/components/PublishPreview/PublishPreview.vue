<template>
  <el-dialog append-to-body class="publish-preview" title="预览" :visible="previewDialog" @close="close" width="450px">
    <div class="bg" :style="{ background: background}">
      <div class="cpreview">
        <div class="pcontent">
          <!-- app启动A -->
          <div class="app" v-if="type === 'app-0' || type === 'app-1'">
            <div class="skip">跳过(2s)</div>
            <img :style="appImgStyle" :src="form.titleImage" alt="">
            <div class="content" v-if="type === 'app-1'">
              <div class="title">{{ form.title }}</div>
              <div class="detail">{{ form.seoDescription.length > 20 ? form.seoDescription.slice(0, 20) + '...' : form.seoDescription }}</div>
            </div>
          </div>
          <!-- 弹出框A -->
          <div class="popup" v-if="type === 'pop-0' || type === 'pop-1'">
            <img :style="popImgStyle" :src="form.titleImage" alt="">
            <div class="content" :style="popContentStyle">
              <div class="title">{{ form.title }}</div>
            </div>
            <div class="close-icon">
              <i class="el-icon-error"></i>
            </div>
          </div>
          <!-- 条目A -->
          <div class="list" v-if="type === 'list-0'">
            <div class="menu">
              <div class="btn">关注</div>
              <div class="btn selected">动态</div>
              <div class="btn">消息</div>
              <div class="btn">活动</div>
            </div>
            <div class="content">
              <div class="left">
                <div class="title">{{ form.title }}</div>
                <div class="detail">{{ form.seoDescription.length > 20 ? form.seoDescription.slice(0, 20) + '...' : form.seoDescription }}</div>
                <img v-if="type === 'list-0'" :src="form.titleImage" alt="">
                <div class="info">
                  <div>
                    <i class="iconfont biz-icon-man"></i>
                    {{ form.author }}
                    {{ form.createDate }}
                  </div>
                  <span>111人</span>
                </div>
              </div>
              <div class="right" v-if="type === 'list-1'">
                <img :src="form.titleImage" alt="">
              </div>
            </div>
          </div>
          <!-- 条目B -->
          <div class="list-b" v-if="type === 'list-1'"></div>
          <!-- 条目C -->
          <div class="list-c" v-if="type === 'list-2'"></div>
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
    // type: {
    //   type: String,
    //   default: ''
    // },
    previewDialog: {
      type: Boolean,
      default: false
    },
    form: {
      type: Object,
      default() {
        return {
          seoDescription: ''
        };
      }
    }
  },
  data () {
    return {
      type: 'list-0',
      // Dialog Start
      background: 'url(' + phoneB + ') no-repeat no-repeat',
      dateNow: date.nowDate()
      // Dialog End
    };
  },
  computed: {
    appImgStyle() {
      return {
        width: '100%',
        height: this.type === 'app-0' ? '476px' : '376px'
      };
    },
    popImgStyle() {
      return {
        position: 'absolute',
        left: '50px',
        top: this.type === 'pop-0' ? '50px' : '100px',
        width: '164px',
        height: this.type === 'pop-0' ? '264px' : '164px'
      };
    },
    popContentStyle() {
      return {
        'background-color': this.type === 'pop-0' ? 'rgba(255, 255, 255, .5)' : '#ffffff'
      };
    }
  },
  watch: {},
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
.publish-preview {
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
        width: 100%;
        height: 100%;
        word-wrap: break-word;
        position: relative;
        .title {
          overflow:hidden;
          text-overflow:ellipsis;
          white-space:nowrap;
          font-weight: bold;
        }
        .app {
          width: 100%;
          height: 100%;
          .skip {
            position: absolute;
            top: 20px;
            right: 0;
            width: 70px;
            height: 30px;
            padding: 5px;
            background-color: rgba(255, 255, 255, .5);
          }
          .content {
            // position: absolute;
            // bottom: 0;
            // left: 0;
            height: 100px;
            width: 100%;
            .detail {
              // font-size: 12px;
            }
          }
        }
        .popup {
          position: relative;
          height: 476px;
          width: 264px;
          background-color: rgba(0, 0, 0, .5);
          .content {
            position: absolute;
            left: 50px;
            top: 264px;
            height: 50px;
            width: 164px;
          }
          .close-icon {
            display: flex;
            position: absolute;
            top: 350px;
            width: 100%;
            color: #ffffff;
            font-size: 16px;
            i {
              margin: 0 auto;
            }
          }
        }
        .list {
          .menu {
            display: flex;
            width: 100%;
            height: 30px;
            border-bottom: 1px solid #000;
            .btn {
              position: relative;
              padding: 3px;
              flex-grow: 1;
              text-align: center;
              &.selected:after {
                content: '';
                position: absolute;
                top: 30px;
                left: 10px;
                width: 70%;
                height: 2px;
                background-color: #ff7300;
              }
            }
          }
          .content {
            display: flex;
            margin-top: 10px;
            padding: 5px;
            width: 264px;
            min-height: 100px;
            border: 1px solid #000;
            img {
              width: 87px;
              height: 87px;
            }
            .left {
              // width: 165px;
              flex-grow: 1;
              .info {
                display: flex;
                justify-content: space-between;
              }
            }
            .right {
              flex-grow: 1;
              width: 87px;
              height: 87px;
            }
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
