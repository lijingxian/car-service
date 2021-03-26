<template>
  <el-dialog append-to-body class="article-preview" title="预览" :visible="previewDialog" @close="close" width="500px">
    <!-- 头条大图 -->
    <div class="bg-pic" :style="{ background: backgroundF}" v-if="formlist.type ==='8'&&formlist.showType==='0'">
      <div class="cpreview" style="height:270px;top: 245px;">
        <div class="pcontent">
          <div class="list" v-if="type === 'list3-0'">
            <div class="upper">
              <div class="title" :title="formlist.title">{{ formlist.title }}</div>
              <div
                style="margin-top: 10px;height: 195px;margin-bottom:10px"
                v-if="formlist.imagePaths && formlist.imagePaths.length === 1 && formlist.imagePaths[0]"
              >
                <img :src="formlist.imagePaths[0]" alt />
              </div>
            </div>
            <div class="footer" slot="bottom">
              <div class="footer-left" style="font-size: 12px;">
                <span class="shop-name" style="margin-right:20px">卡欧科技</span>
                <span class="publish-date">{{ formlist.beginDate.slice(5, 10) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 头条小图 -->
    <div class="bg-pic" :style="{ background: backgroundH}" v-if="formlist.type ==='8'&&formlist.showType==='2'">
      <div class="cpreview" style="padding:0px;top:353px;">
        <div class="pcontent">
          <div class="list" v-if="type === 'list3-2'">
            <div class="recommend-item-little">
              <div class="upper">
                <div class="left-part">
                  <div class="title">{{ formlist.title }}</div>
                </div>
                <div class="right-part" v-if="formlist.imagePaths">
                  <img :src="formlist.imagePaths[0]" alt style="max-height:70px" />
                </div>
              </div>
              <div class="footer">
                <div class="footer-left">
                  <span class="shop-name">卡欧科技</span>
                  <span class="publish-date">{{ formlist.beginDate.slice(5, 10) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 头条组图 -->
    <div class="bg-pic" :style="{ background: backgroundG}" v-if="formlist.type ==='8'&&formlist.showType==='1'">
      <div class="cpreview" style="height:165px;top: 280px;padding:0px">
        <div class="pcontent">
          <div class="list" v-if="type === 'list3-1'">
            <div class="recommend-item-group">
              <div class="upper">
                <div class="left-part">
                  <div class="title">{{ formlist.title }}</div>
                  <div v-if="formlist.imagePaths" class="img-group">
                    <img :src="formlist.imagePaths[0]" alt style="max-height:60px" />
                    <img :src="formlist.imagePaths[1]" alt style="max-height:60px" />
                    <img :src="formlist.imagePaths[2]" alt style="max-height:60px" />
                  </div>
                </div>
              </div>
              <div class="footer">
                <div class="footer-left">
                  <span class="shop-name">卡欧科技</span>
                  <span class="publish-date">{{ formlist.beginDate.slice(5, 10) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 百度大图 -->
    <div class="bg-pic" :style="{ background: backgroundA}" v-if="formlist.type ==='9'&&formlist.showType==='0'">
      <div class="cpreview" style="top: 215px;">
        <div class="pcontent">
          <div class="list" v-if="type === 'list3-0'">
            <div class="upper">
              <div class="title" :title="formlist.title">{{ formlist.title }}</div>
              <div style="margin-top: 10px;height: 195px;margin-bottom:10px" v-if="formlist.imagePaths && formlist.imagePaths.length === 1 && formlist.imagePaths[0]">
                <img :src="formlist.imagePaths[0]" alt/>
              </div>
            </div>
            <div class="footer" slot="bottom">
              <div class="footer-left" style="font-size: 12px;">
                <span class="shop-name" style="margin-right:20px">卡欧科技</span>
                <span class="publish-date">{{ formlist.beginDate.slice(5, 10) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 百度小图 -->
    <div class="bg-pic" :style="{ background: backgroundC}" v-if="formlist.type ==='9'&&formlist.showType==='2'">
      <div class="cpreview" style="top:310px;padding:0">
        <div class="pcontent">
          <div class="list" v-if="type === 'list3-2'">
            <div class="recommend-item-little">
              <div class="upper">
                <div class="left-part">
                  <div class="title" :title="formlist.title">{{ formlist.title }}</div>
                </div>
                <div class="right-part" v-if="formlist.imagePaths">
                  <img :src="formlist.imagePaths[0]" alt style="max-height:70px" />
                </div>
              </div>
              <div class="footer">
                <div class="footer-left">
                  <span class="shop-name">卡欧科技</span>
                  <span class="publish-date">{{ formlist.beginDate.slice(5, 10) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 百度组图 -->
    <div class="bg-pic" :style="{ background: backgroundB}" v-if="formlist.type ==='9'&&formlist.showType==='1'">
      <div class="cpreview" style="top:317px;padding:0px;height:171px">
        <div class="pcontent">
          <div class="list" v-if="type === 'list3-1'">
            <div class="recommend-item-group">
              <div class="upper" style="margin-bottom:10px">
                <div class="left-part">
                  <div class="title" :title="formlist.title">{{ formlist.title }}</div>
                  <div v-if="formlist.imagePaths" class="img-group">
                    <img :src="formlist.imagePaths[0]" alt style="max-height:60px" />
                    <img :src="formlist.imagePaths[1]" alt style="max-height:60px" />
                    <img :src="formlist.imagePaths[2]" alt style="max-height:60px" />
                  </div>
                </div>
              </div>
              <div class="footer">
                <div class="footer-left">
                  <span class="shop-name">卡欧科技</span>
                  <span class="publish-date">{{ formlist.beginDate.slice(5, 10) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 百度搜索有图 -->
    <!-- <div class="bg-pic" :style="{ background: backgroundD}" v-if="formlist.type ==='10'&&formlist.showType==='0'">
      <div class="cpreview" style="top: 250px;padding:0px">
        <div class="pcontent">
          <div class="list" v-if="type === 'search-0'">
            <div class="recommend-item-bd">
              <div class="upper">
                <div class="title" style="margin-bottom:10px">{{ formlist.title }}</div>
                <div style="display:flex">
                  <div class="left-part" v-if="formlist.imagePaths && formlist.imagePaths.length >0 && formlist.imagePaths[0]">
                    <img :src="formlist.imagePaths[0]" alt style="max-height:60px;"/>
                  </div>
                  <div class="right-part" style="font-size:12px;margin-left:10px;line-height: 21px;">
                    <div>{{formlist.content}}</div>
                  </div>
                </div>
              </div>
              <div class="footer">
                <div class="footer-left">
                  <span class="shop-name">卡欧科技</span>
                  <span class="publish-date">{{ formlist.beginDate.slice(5, 10) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>-->
    <!-- 百度搜索无图 -->
    <div class="bg-pic" :style="{ background: backgroundE}" v-if="formlist.type ==='10'">
      <div class="cpreview" style="padding:0px;top:276px;height:125px">
        <div class="pcontent">
          <div class="list">
            <div class="recommend-item-bd">
              <div class="upper">
                <div class="title" :title="formlist.title" style="margin-bottom:10px">{{ formlist.title }}</div>
                <div class="right-part" style="font-size:12px;line-height: 21px;">
                  <div>{{formlist.content}}</div>
                </div>
              </div>
              <div class="footer" style="margin-top:10px">
                <div class="footer-left">
                  <span class="shop-name">卡欧科技</span>
                  <span class="publish-date">{{ formlist.beginDate.slice(5, 10) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import BDLineA from '@/assets/images/activity-default/baidu-bigpic.png';
import BDLineB from '@/assets/images/activity-default/baidu-trdpic.png';
import BDLineC from '@/assets/images/activity-default/baidu-littlepic.png';
import BDSearchA from '@/assets/images/activity-default/baidu-onepic.png';
import BDSearchB from '@/assets/images/activity-default/baidu-nopic.png';
import HLineA from '@/assets/images/activity-default/headline-bigpic.png';
import HLineB from '@/assets/images/activity-default/headline-trdpic.png';
import HLineC from '@/assets/images/activity-default/headline-littlepic.png';

import date from '@/utils/date';
import { mapGetters } from 'vuex';

export default {
  name: 'PublishPreviewThird',
  props: {
    itemId: {
      type: Object,
      default() {
        return { id: '' };
      }
    },
    type: {
      type: String,
      default: ''
    },
    previewDialog: {
      type: Boolean,
      default: false
    },
    formlist: {
      type: Object,
      default() {
        return {
          title: '',
          imagePaths: []
        };
      }
    }
  },
  components: {},
  data() {
    return {
      // Dialog Start
      backgroundA: 'url(' + BDLineA + ') no-repeat no-repeat',
      backgroundB: 'url(' + BDLineB + ') no-repeat no-repeat',
      backgroundC: 'url(' + BDLineC + ') no-repeat no-repeat',
      backgroundD: 'url(' + BDSearchA + ') no-repeat no-repeat',
      backgroundE: 'url(' + BDSearchB + ') no-repeat no-repeat',
      backgroundF: 'url(' + HLineA + ') no-repeat no-repeat',
      backgroundG: 'url(' + HLineB + ') no-repeat no-repeat',
      backgroundH: 'url(' + HLineC + ') no-repeat no-repeat',
      dateNow: date.nowDate()
      // Dialog End
    };
  },
  computed: {
    ...mapGetters(['getUser']),

    iframeSrc() {
      return `resources/admin/ecStatic/index.html?#/v-shop?promotionId=${this.itemId.id}&shopId=${this.getUser.shop.id}`;
      // return `http://www.carowl.cn/resources/admin/ecStatic_test/index.html?#/v-shop?promotionId=${this.itemId.id}&shopId=${this.getUser.shop.id}`;
    },
    appImgStyle() {
      return {
        width: '100%',
        height: '376px'
      };
    },
    popImgStyle() {
      return {
        position: 'absolute',
        left: '50px',
        top: '100px',
        width: '164px',
        height: '164px'
      };
    },
    popContentStyle() {
      return {
        'background-color': '#ffffff'
      };
    },
    previewImage() {
      return this.formlist.imagePaths.length > 0 ? this.formlist.imagePaths[0] : '';
    },
    deleteHtmlTag() {
      return this.formlist.content.replace(/<[^>]+>|&[^>]+;/g, '').trim(); // 去掉所有的html标签和&nbsp;之类的特殊符合
    },
    // defaultCover() {
    //   switch (this.form.promotionType) {
    //     case 'coupon':
    //       return YHQ;
    //     case 'Package':
    //       return TC;
    //     case 'Discount':
    //       return XSZK;
    //     case 'FullGift':
    //       return MS;
    //     case 'FullCut':
    //       return MJ;
    //     case 'FreeShipping':
    //       return BY;
    //     default:
    //       return '';
    //   }
    // },
    activitiStatus() {
      switch (this.formlist.state) {
        case '3':
          return '已创建';
        case '0':
          return '已发布';
        case '1':
          return '进行中';
        case '2':
          return '已结束';
        case '4':
          return '已提交';
        case '5':
          return '已取消';
        default:
          return '';
      }
    }
  },
  watch: {},
  methods: {
    close() {
      this.$emit('update:previewDialog', false);
    },
    cutstr(str, len) {
      return str.substr(0, 43) + '...';
    }
  }
};
</script>

<style lang="scss">
.article-preview {
  .color-blue {
    color: #607fa6;
  }
  .bg-pic {
    margin: 0 auto;
    position: relative;
    width: 433px;
    height: 861px;
    .cpreview {
      position: absolute;
      padding: 10px;
      width: 373px;
      left: 30px;
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
          text-overflow: ellipsis;
          white-space: nowrap;
          font-weight: bold;
          overflow: hidden;
          font-size: 15px;
        }
        img {
          // width: auto;
          // height: auto;
          max-width: 100%;
          max-height: 100%;
        }
        .content-footer {
          font-size: 12px;
          font-weight: bold;
        }
        .recommend-item-little {
          display: flex;
          flex-direction: column;
          padding: 10px 15px;
          min-height: 110px;
          background-color: #fff;
          border: none;
          .upper {
            flex-grow: 1;
            display: flex;
            align-items: flex-start;
            .left-part {
              flex-grow: 1;
              height: 100%;
              .title {
                overflow: hidden;
                white-space: unset;
                font-size: 15px;
                line-height: 21px;
                color: #101010;
              }
            }
            .right-part {
              flex-shrink: 0;
              // height: calc(2 * (100% - 20px) / 9);
              width: calc((100% - 20px) / 3);
              margin-left: 10px;
              display: flex;
              justify-content: center;
              align-items: center;
              img {
                object-fit: cover;
                height: 100%;
                width: 100%;
              }
            }
          }
          .footer {
            display: flex;
            justify-content: space-between;
            .footer-left {
              width: 50%;
              display: flex;
              align-items: center;
              font-size: 12px;
              line-height: 18px;
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
            .footer-right {
              display: flex;
              align-items: center;
              font-size: 16px;
              color: #999;
              div {
                margin-left: 5px;
                vertical-align: bottom;
              }
            }
          }
        }
        .recommend-item-group {
          display: flex;
          flex-direction: column;
          padding: 10px 15px;
          min-height: 110px;
          background-color: #fff;
          border: none;
          .upper {
            flex-grow: 1;
            display: flex;
            align-items: flex-start;
            .left-part {
              flex-grow: 1;
              height: 100%;
              .title {
                white-space: unset;
                font-size: 15px;
                line-height: 21px;
                color: #101010;
                margin-bottom: 13px;
                overflow: hidden;
              }
              .img-group {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-top: 10px;
                img {
                  object-fit: cover;
                  // height: 100%;
                  // width: 32%;
                  height: calc(2 * (100% - 20px) / 9);
                  width: calc((100% - 20px) / 3);
                }
              }
            }
          }
          .footer {
            display: flex;
            justify-content: space-between;
            margin-top: 10px;
            .footer-left {
              width: 50%;
              display: flex;
              align-items: center;
              font-size: 12px;
              line-height: 18px;
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
            .footer-right {
              display: flex;
              align-items: center;
              font-size: 16px;
              color: #999;
              div {
                margin-left: 5px;
                vertical-align: bottom;
              }
            }
          }
        }
        .recommend-item-bd {
          display: flex;
          flex-direction: column;
          padding: 10px 15px;
          min-height: 110px;
          background-color: #fff;
          border: none;
          .title {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .footer {
            display: flex;
            justify-content: space-between;
            .footer-left {
              width: 50%;
              display: flex;
              align-items: center;
              font-size: 12px;
              line-height: 18px;
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
            .footer-right {
              display: flex;
              align-items: center;
              font-size: 16px;
              color: #999;
              div {
                margin-left: 5px;
                vertical-align: bottom;
              }
            }
          }
        }
      }
    }
  }
}
</style>
