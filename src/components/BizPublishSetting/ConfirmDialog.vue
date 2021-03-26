<template>
  <div class="confirm-dialog-t">
    <div class="bg" :style="{ background: backgroundF1}" v-if="formlist.type === '5'">
      <div class="cpreview" style="top:130px;height:170px;">
        <div class="pcontent">
          <!-- V商导航 -->
          <div class="app">
            <div class="cover"></div>
            <img
              v-if="formlist.setting.imagePaths && formlist.setting.imagePaths.length === 1 && formlist.setting.imagePaths[0]"
              :src="formlist.setting.imagePaths[0]"
              alt
              style="width: 280px;height: 150px;"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="bg" :style="{ background: backgroundC1}" v-if="formlist.type === '2'">
      <div class="cpreview" style="top:60px;height:525px">
        <div class="pcontent">
          <!-- app启动A -->
          <div class="app" v-if="formlist.setting.showType === '0' || formlist.setting.showType === '1'">
            <div class="skip">跳过(2s)</div>
            <img
              v-if="formlist.setting.imagePaths && formlist.setting.imagePaths.length === 1 && formlist.setting.imagePaths[0]"
              :style="appImgStyle"
              :src="formlist.setting.imagePaths[0]"
              alt
            />
            <div class="content" v-if="formlist.setting.showType === '1'">
              <div class="title">{{ formlist.setting.title }}</div>
              <div class="detail" v-if="formlist.setting.content">
                {{ formlist.setting.content.length > 20 ? formlist.setting.content.slice(0,
                20) + '...' : formlist.setting.content }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="bg" :style="{ background: backgroundD1}" v-if="formlist.type === '3'">
      <div class="cpreview" style="top:300px;height:180px;">
        <div class="pcontent">
          <!-- 弹出框A -->
          <div class="popup" style="height: 0px;" v-if="formlist.setting.showType === '0' || formlist.setting.showType === '1'">
            <img
              v-if="formlist.setting.imagePaths && formlist.setting.imagePaths.length === 1 && formlist.setting.imagePaths[0]"
              :src="formlist.setting.imagePaths[0]"
              alt
              style="height:130px;width:280px"
            />
            <div class="title" style="padding: 0px 0px 0px 10px;font-size:13px">{{ formlist.setting.title }}</div>
            <div class="foot" style="padding: 0px 0px 0px 10px;">
              <span>
                {{ formlist.setting.beginDate.split(' ')[0] }} 至
                {{ formlist.setting.endDate.split(' ')[0] }}
              </span>
              <span>{{activitiStatus}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="bg" :style="{ background: backgroundE1}" v-if="formlist.type === '4'">
      <div class="cpreview" style="top:110px;height:160px;">
        <div class="pcontent">
          <!-- 弹出框A -->
          <div class="popup" style="height: 0px;" v-if="formlist.setting.showType === '0' || formlist.setting.showType === '1'">
            <img
              v-if="formlist.setting.imagePaths && formlist.setting.imagePaths.length === 1 && formlist.setting.imagePaths[0]"
              :src="formlist.setting.imagePaths[0]"
              alt
              style="height:110px;width:280px"
            />
            <div class="title" style="padding: 0px 0px 0px 10px;font-size:12px">{{ formlist.setting.title }}</div>
            <div class="foot" style="padding: 0px 0px 0px 10px;">
              <span>
                {{ formlist.setting.beginDate.split(' ')[0] }} 至
                {{ formlist.setting.endDate.split(' ')[0] }}
              </span>
              <span>{{activitiStatus}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="bg" :style="{ background: backgroundG1}" v-if="formlist.type === '6'">
      <div class="cpreview">
        <div class="pcontent">
          <div class="popup" v-if="formlist.setting.showType === '0'" style="position:relative;background:#999999">
            <!--领取优惠券预览-->
            <div style="position: absolute;top: 90px;background: #ffffff;margin: 10px;border-radius: 5px">
              <img
                v-if="formlist.setting.imagePaths && formlist.setting.imagePaths.length === 1 && formlist.setting.imagePaths[0]"
                :src="formlist.setting.imagePaths[0]"
                alt
                style="border-radius:5px"
              />
              <div class="title" style="margin-left:5px">{{ formlist.setting.title }}</div>
              <div class="foot" style="margin-left:5px">{{ formlist.setting.beginDate }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="bg" :style="{ background: backgroundB1}" v-if="formlist.type === '1'">
      <div class="cpreview">
        <div class="pcontent">
          <!-- 爱车频道 -->
          <div class="list" v-if="form.showType === '0'">
            <iframe
              :src="'resources/admin/ecStatic/index.html?#/icar-channel/'+form.id"
              frameborder="0"
              scrolling="no"
              width="100%"
              height="450px"
              v-if="form.articleType==='0'"
            ></iframe>
            <iframe
              :src="'resources/admin/ecStatic/index.html?#/icar-channel/vr?url='+form.contentUrl+'&id='+form.id"
              frameborder="0"
              scrolling="no"
              width="100%"
              height="450px"
              v-if="form.articleType==='2'"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
    <div class="bg" :style="{ background: backgroundA1}" v-if="formlist.type === '0'">
      <div class="cpreview" style="top:136px;height:90px">
        <div class="pcontent">
          <!-- 条目B -->
          <div class="list" style="height:90px">
            <div class="recommend-item" style="line-height:21px">
              <div class="upper">
                <div class="left-part">
                  <div class="title" style="font-size:12px">{{ form.title }}</div>
                  <div class="desc" style="font-size:8px;">{{form.seoDescription}}</div>
                  <div v-if="form.images && form.images.length >= 3" class="img-group">
                    <img :src="form.images[0]" alt />
                    <img :src="form.images[1]" alt />
                    <img :src="form.images[2]" alt />
                  </div>
                </div>
                <div class="right-part" v-if="form.images && form.images.length < 3 && form.images[0]">
                  <img :src="form.images[0]" alt />
                </div>
              </div>
              <div class="footer" style="margin-top:0px;">
                <div class="footer-left" style="font-size:8px;">
                  <img v-if="getUser.shop && getUser.shop.logo" :src="getUser.shop.logo" alt class="shop-logo" />
                  <span class="shop-name">{{ getUser.shop ? getUser.shop.name : '' }}</span>
                  <span class="publish-date">{{ form.createDate.slice(5, 10) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 头条大图 -->
    <div class="bg-pic" :style="{ background: backgroundF}" v-if="formlist.type ==='8'&&formlist.setting.showType==='0'">
      <div class="cpreview" style="height:270px;top: 245px;">
        <div class="pcontent">
          <div class="list">
            <div class="upper">
              <div class="title" :title="formlist.setting.title">{{ formlist.setting.title }}</div>
              <div
                style="margin-top: 10px;height: 185px;margin-bottom:10px"
                v-if="formlist.setting.imagePaths && formlist.setting.imagePaths.length === 1 && formlist.setting.imagePaths[0]"
              >
                <img :src="formlist.setting.imagePaths[0]" alt />
              </div>
            </div>
            <div class="footer" slot="bottom">
              <div class="footer-left" style="font-size: 12px;">
                <span class="shop-name" style="margin-right:20px">卡欧科技</span>
                <span class="publish-date">{{ formlist.setting.beginDate.slice(5, 10) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 头条小图 -->
    <div class="bg-pic" :style="{ background: backgroundH}" v-if="formlist.type ==='8'&&formlist.setting.showType==='2'">
      <div class="cpreview" style="padding:0px;top:353px;">
        <div class="pcontent">
          <div class="list">
            <div class="recommend-item-little">
              <div class="upper">
                <div class="left-part">
                  <div class="title">{{ formlist.setting.title }}</div>
                </div>
                <div class="right-part" v-if="formlist.setting.imagePaths">
                  <img :src="formlist.setting.imagePaths[0]" alt style="max-height:70px" />
                </div>
              </div>
              <div class="footer">
                <div class="footer-left">
                  <span class="shop-name">卡欧科技</span>
                  <span class="publish-date">{{ formlist.setting.beginDate.slice(5, 10) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 头条组图 -->
    <div class="bg-pic" :style="{ background: backgroundG}" v-if="formlist.type ==='8'&&formlist.setting.showType==='1'">
      <div class="cpreview" style="height:165px;top: 280px;padding:0px">
        <div class="pcontent">
          <div class="list">
            <div class="recommend-item-group">
              <div class="upper">
                <div class="left-part">
                  <div class="title">{{ formlist.setting.title }}</div>
                  <div v-if="formlist.setting.imagePaths" class="img-group">
                    <img :src="formlist.setting.imagePaths[0]" alt style="max-height:60px" />
                    <img :src="formlist.setting.imagePaths[1]" alt style="max-height:60px" />
                    <img :src="formlist.setting.imagePaths[2]" alt style="max-height:60px" />
                  </div>
                </div>
              </div>
              <div class="footer">
                <div class="footer-left">
                  <span class="shop-name">卡欧科技</span>
                  <span class="publish-date">{{ formlist.setting.beginDate.slice(5, 10) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 百度大图 -->
    <div class="bg-pic" :style="{ background: backgroundA}" v-if="formlist.type ==='9'&&formlist.setting.showType==='0'">
      <div class="cpreview" style="top: 212px;height:281px">
        <div class="pcontent">
          <div class="list">
            <div class="upper" style="margin-bottom:20px">
              <div class="title" :title="formlist.setting.title">{{ formlist.setting.title }}</div>
              <div
                style="margin-top: 10px;height: 195px;"
                v-if="formlist.setting.imagePaths && formlist.setting.imagePaths.length === 1 && formlist.setting.imagePaths[0]"
              >
                <img :src="formlist.setting.imagePaths[0]" alt style="max-height:200px" />
              </div>
            </div>
            <div class="footer" slot="bottom">
              <div class="footer-left" style="font-size: 12px;">
                <span class="shop-name" style="margin-right:20px">卡欧科技</span>
                <span class="publish-date">{{ formlist.setting.beginDate.slice(5, 10) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 百度小图 -->
    <div class="bg-pic" :style="{ background: backgroundC}" v-if="formlist.type ==='9'&&formlist.setting.showType==='2'">
      <div class="cpreview" style="top:310px;padding:0;">
        <div class="pcontent">
          <div class="list">
            <div class="recommend-item-little">
              <div class="upper" style="margin-bottom:10px">
                <div class="left-part">
                  <div class="title">{{ formlist.setting.title }}</div>
                </div>
                <div class="right-part" v-if="formlist.setting.imagePaths">
                  <img :src="formlist.setting.imagePaths[0]" alt style="max-height:70px" />
                </div>
              </div>
              <div class="footer">
                <div class="footer-left">
                  <span class="shop-name">卡欧科技</span>
                  <span class="publish-date">{{ formlist.setting.beginDate.slice(5, 10) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 百度组图 -->
    <div class="bg-pic" :style="{ background: backgroundB}" v-if="formlist.type ==='9'&&formlist.setting.showType==='1'">
      <div class="cpreview" style="top:317px;padding:0px;height:171px">
        <div class="pcontent">
          <div class="list">
            <div class="recommend-item-group">
              <div class="upper" style="margin-bottom:10px">
                <div class="left-part">
                  <div class="title" :title="formlist.setting.title">{{ formlist.setting.title }}</div>
                  <div v-if="formlist.setting.imagePaths" class="img-group">
                    <img :src="formlist.setting.imagePaths[0]" alt style="max-height:60px" />
                    <img :src="formlist.setting.imagePaths[1]" alt style="max-height:60px" />
                    <img :src="formlist.setting.imagePaths[2]" alt style="max-height:60px" />
                  </div>
                </div>
              </div>
              <div class="footer">
                <div class="footer-left">
                  <span class="shop-name">卡欧科技</span>
                  <span class="publish-date">{{ formlist.setting.beginDate.slice(5, 10) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 百度搜索有图 -->
    <!-- <div class="bg-pic" :style="{ background: backgroundD}" v-if="formlist.type ==='10'">
      <div class="cpreview" style="top: 250px;padding:0px">
        <div class="pcontent">
          <div class="list">
            <div class="recommend-item-bd">
              <div class="upper">
                <div class="title" style="margin-bottom:10px">{{ formlist.setting.title }}</div>
                <div style="display:flex">
                  <div class="left-part" v-if="formlist.setting.imagePaths && formlist.setting.imagePaths.length >0 && formlist.setting.imagePaths[0]">
                    <img :src="formlist.setting.imagePaths[0]" alt style="max-height:60px;" />
                  </div>
                  <div class="right-part" style="font-size:12px;margin-left:10px;line-height: 21px;">
                    <div>{{formlist.setting.content}}</div>
                  </div>
                </div>
              </div>
              <div class="footer">
                <div class="footer-left">
                  <span class="shop-name">卡欧科技</span>
                  <span class="publish-date">{{ formlist.setting.beginDate.slice(5, 10) }}</span>
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
              <div class="upper" style="margin-bottom:15px">
                <div class="title" :title="formlist.title" style="margin-bottom:10px">{{ formlist.setting.title }}</div>
                <div class="right-part" style="font-size:12px;line-height: 21px;">
                  <div>{{formlist.setting.content}}</div>
                </div>
              </div>
              <div class="footer" style="position: relative;top: 20px;">
                <div class="footer-left">
                  <span class="shop-name">卡欧科技</span>
                  <span class="publish-date">{{ formlist.setting.beginDate.slice(5, 10) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
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
import phoneC from '@/assets/images/activity-default/appStart.jpg';
import phoneB from '@/assets/images/activity-default/car-channel.jpg';
import phoneG from '@/assets/images/activity-default/coupon.jpg';
import phoneE from '@/assets/images/activity-default/latest-sales-promotion.jpg';
import phoneD from '@/assets/images/activity-default/recent-activities.jpg';
import phoneA from '@/assets/images/activity-default/service-recommend.jpg';
import phoneF from '@/assets/images/activity-default/V-business.jpg';
import YHQ from '@/assets/images/activity-default/yhq.png';
import TC from '@/assets/images/activity-default/tc.png';
import XSZK from '@/assets/images/activity-default/xszk.png';
import MS from '@/assets/images/activity-default/ms.png';
import MJ from '@/assets/images/activity-default/mj.png';
import BY from '@/assets/images/activity-default/by.png';

import date from '@/utils/date';
import { mapGetters } from 'vuex';

export default {
  name: 'confirmDialog',
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
    },
    form: {
      type: Object,
      default() {
        return {
          title: '',
          images: []
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
      backgroundA1: 'url(' + phoneA + ') no-repeat no-repeat',
      backgroundB1: 'url(' + phoneB + ') no-repeat no-repeat',
      backgroundC1: 'url(' + phoneC + ') no-repeat no-repeat',
      backgroundD1: 'url(' + phoneD + ') no-repeat no-repeat',
      backgroundE1: 'url(' + phoneE + ') no-repeat no-repeat',
      backgroundF1: 'url(' + phoneF + ') no-repeat no-repeat',
      backgroundG1: 'url(' + phoneG + ') no-repeat no-repeat',
      dateNow: date.nowDate()
      // Dialog End
    };
  },
  computed: {
    ...mapGetters(['getUser']),
    defaultCover() {
      switch (this.form.promotionType) {
        case 'coupon':
          return YHQ;
        case 'Package':
          return TC;
        case 'Discount':
          return XSZK;
        case 'FullGift':
          return MS;
        case 'FullCut':
          return MJ;
        case 'FreeShipping':
          return BY;
        default:
          return '';
      }
    },
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
.confirm-dialog-t {
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
                font-size: 15px;
                line-height: 21px;
                color: #101010;
                overflow: hidden;
                white-space: unset;
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
  .bg {
    margin: 0 auto;
    position: relative;
    width: 390px;
    height: 653px;
    .cpreview {
      overflow: auto;
      position: absolute;
      padding: 10px;
      width: 300px;
      left: 42px;
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
          overflow: hidden;
          font-weight: bold;
        }
        .app {
          width: 100%;
          height: 100%;
          position: relative;
          .cover {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 1000;
          }
          .page-header {
            position: relative;
            height: 45px;
            background-color: #f2f2f2;
            font-size: 20px;
            display: flex;
            justify-content: center;
            align-items: center;
            border-bottom: 1px solid #b3b3b3;
            .header-left {
              position: absolute;
              top: 0;
              left: 0;
              height: 44px;
              font-size: 16px;
            }
          }
          .skip {
            position: absolute;
            top: 20px;
            right: 0;
            width: 70px;
            height: 30px;
            padding: 5px;
            background-color: rgba(255, 255, 255, 0.5);
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
          width: 100%;
          background-color: #ffffff;
          .title {
            padding: 10px 0px;
            width: 100%;
            font-size: 14px;
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
          .foot {
            display: flex;
            justify-content: space-between;
            color: #666666;
            font-size: 12px;
          }
        }
        .list {
          .menu {
            display: flex;
            width: 100%;
            height: 30px;
            border-bottom: 1px solid #e6e6e6;
            .btn {
              position: relative;
              padding: 3px;
              flex-grow: 1;
              text-align: center;
              &.selected {
                color: #ff7300;
                &:after {
                  content: '';
                  position: absolute;
                  bottom: 0;
                  left: 0;
                  width: 100%;
                  height: 2px;
                  background-color: #ff7300;
                }
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
        .content-footer {
          font-size: 12px;
          font-weight: bold;
        }
        .recommend-item {
          display: flex;
          flex-direction: column;
          border: none;
          padding: 10px 15px;
          min-height: 110px;
          background-color: #fff;
          .upper {
            flex-grow: 1;
            display: flex;
            align-items: center;
            .left-part {
              flex-grow: 1;
              height: 100%;
              .title {
                font-size: 12px;
                line-height: 21px;
                color: #101010;
                // 文本溢出显示省略号
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 1;
                -webkit-box-orient: vertical;
              }
              .desc {
                color: #999;
                font-size: 8px;
                word-break: break-all;
                // 文本溢出显示省略号
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
              }
              video {
                width: 100%;
                height: calc((100% - 30px) * 9 / 16);
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
              height: 20px;
              display: flex;
              align-items: center;
              font-size: 8px;
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
              font-size: 10px;
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
