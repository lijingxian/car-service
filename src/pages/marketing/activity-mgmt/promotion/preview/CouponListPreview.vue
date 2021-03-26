<template>
  <div class="coupon-preview">
    <div class="coupon">
      <div class="left-part">
        <div class="price">￥{{preview.amount}}</div>
      </div>
      <div class="right-part">
        <div class="upper">
          <div class="title">{{preview.name}}</div>
          <el-button type="primary" size="mini">领取</el-button>
        </div>
        <div class="end-date">有效期至: {{preview.endDate}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import YYYBG from '@/assets/images/activity-preview/shakeIndex.png';

export default {
  name: 'CouponPreview',
  data() {
    return {};
  },
  props: {
    preview: Object
  },
  components: {},
  watch: {},
  computed: {
    styleObject() {
      return {
        background: 'url(' + YYYBG + ') no-repeat no-repeat',
        'background-size': '270px'
      };
    }
  },
  methods: {}
};
</script>

<style lang="scss">
.coupon-preview {
  // div {
  //   // background-color: rgba(0, 0, 0, 0.05);
  // }
  color: #000;
  width: 264px;
  height: 100%;
  .coupon {
    display: flex;
    width: 240px;
    height: 60px;
    margin: 13px 0;
    border-radius: 0 5px 5px 5px;
    box-shadow: 1px 2px 2px 1px #e1e1e1;
    .left-part {
      width: 35%;
      padding: 15px;
      padding-left: 7px;
      font-size: 16px;
      border-bottom-left-radius: 5px;
      background-color: #ff7300;
      color: #ffffff;
    }
    .left-part:after {
      z-index: 0;
      content: " ";
      display: block;
      position: relative;
      top: -19px;
      left: 38px;
      width: 60px;
      height: 20px;
      background: -webkit-linear-gradient(#ff7300 0%, transparent 0%),
              -webkit-linear-gradient(135deg, #fff 33.33%, transparent 33.33%) 0 0%,
              transparent -webkit-linear-gradient(45deg, #fff 33.33%, #ff7300 33.33%) 0 0%;
      background-repeat: repeat-x;
      background-size: 0px 100%, 9px 27px, 9px 27px;
      transform:rotate(-90deg);
    }
    .right-part {
      width: 65%;
      .upper {
        display: flex;
        justify-content: space-between;
        padding: 5px;
        padding-bottom: 0;
      }
      .end-date {
        padding: 3px;
        padding-top: 5px;
        color: #909399;
        font-size: 14px;
      }
    }
  }
}
</style>
