<template>
  <div class="coupon-preview" :style="'width:'+width">
    <preview-header :headerTitle="preview.title" :width="width">
      <i class="iconfont biz-icon-zhuanfa" slot="append"></i>
    </preview-header>
    <!-- <div class="price">
      ￥{{preview.amount}}
      <el-tag>优惠券</el-tag>
    </div>
    <p class="name">名称:  {{preview.name}}</p>
    <p class="shop">适用店铺:  {{preview.shopName}}</p>
    <p class="endDate">有效期:  {{preview.beginDate ? preview.beginDate + '-' : '至'}}{{preview.endDate}}</p>
    <div class="code" :style="styleObject">
    </div> -->
    <iframe :src="'resources/admin/ecStatic/index.html?#/my-card/1/coupon-detail/' + preview.couponId +'/103614'" id="iframe" frameborder="0"
      scrolling="no" :width="width" :height="height"></iframe>
  </div>
</template>

<script>
import PreviewHeader from './PreviewHeader.vue';
import QRCode from '@/assets/images/promotion-preview/QRCode.png';

export default {
  name: 'CouponPreview',
  data() {
    return {};
  },
  props: {
    preview: Object,
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
    styleObject() {
      return {
        background: 'url(' + QRCode + ') no-repeat no-repeat',
        'background-size': '270px'
      };
    }
  },
  methods: {}
};
</script>

<style lang="scss">
.coupon-preview {
  color: #000;
  background-color: #F8F8F8;
  height: 100%;
  text-align: center;
  margin: 0 auto;
  .price {
    color: #ff7300;
    font-weight: bold;
  }
  .code {
    width: 250px;
    height: 250px;
  }
}
</style>
