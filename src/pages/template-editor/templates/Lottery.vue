<template>
  <div class="lottery-template">
    <div class="turntable-content" :class="mode" :style="bgStyle" @click="selectEl('bg', 'brick')">
      <div class="top">
        <div class="remind-chance">
          <span class="times" :style="txt1" @click.stop="selectEl('txt1', 'simple-text')">还有3次抽奖机会</span>
          <!-- <span v-if="Number(activity.beans) > 0" class="beans">每次抽奖消耗{{activity.beans}}V豆</span> -->
        </div>
        <div class="banner">
          <div class="turnplate">
            <!-- <canvas class="item" id="wheelcanvas" width="422px" height="422px"></canvas> -->
            <img class="pointer" id="pointer" :src="pointerImg" />
          </div>
        </div>
      </div>
      <div class="prizeInfo">
        <span class="winners" :style="txt2" @click.stop="selectEl('txt2', 'simple-text')">恭喜中奖者</span>
        <div class="winners-table-con" :style="winners" @click.stop="selectEl('winners', 'list')">
          <table class="winners-table">
            <tr v-for="(lottery, index) in winner" :key="index">
              <td>{{ lottery.name.length>5?lottery.name.substring("0","5")+"...":lottery.name}}</td>
              <td>{{ lottery.mobile }}</td>
              <td>{{ lottery.lotteryInfo }}</td>
            </tr>
          </table>
        </div>
        <div class="my-prize-con">
          <span class="my-prize" :style="btnStyle" @click.stop="selectEl('btn', 'button')">我的奖品</span>
          <div>
            <!-- <span class="act-rule">活动规则</span> -->
            <!-- <p class="rule-content">{{lottery.lotteryInitInfo.rule}}</p> -->
            <!-- <p class="rule-content" v-html="lottery.lotteryInitInfo.rule.replace(/\r?\n/g, '<br>')"></p> -->
          </div>
        </div>
      </div>
      <!-- <cube-popup type="my-popup" ref="myPopup">
        <div class="popup">
          <h4>
            恭喜您获得
            <i class="iconfont icon-i-sh-car-close close-style" @click="close"></i>
          </h4>
          <h1>{{ prizaContent }}</h1>
          <button @click="go" class="btn_two">点击查看</button>
          <h5 v-if="queryLotteryDate.type !== '4'">已存入您的账户</h5>
        </div>
      </cube-popup> -->
      <!-- <img :src="picVbeans" width="15px" id="vbeans-img" style="display:none;" />
      <img :src="picGoods" width="15px" id="goods-img" style="display:none;" />
      <img :src="picCoupon" width="15px" id="coupon-img" style="display:none;" />
      <img :src="picOnemore" width="15px" id="more-img" style="display:none;" />
      <img :src="picNone" width="15px" id="none-img" style="display:none;" />
      <img :src="picCash" width="15px" id="cash-img" style="display:none;" />
      <img :src="host + img.image" width="50px" :id="'active-img' + index" v-for="(img, index) in lottery.lotteryInitInfo.lotterys" style="display:none;" :key="index" /> -->
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: '',
  props: {
    mode: {
      type: String,
      default: 'vertical'
    }
  },
  data () {
    return {
      pointerImg: require('@/assets/images/activity-template/pointer.png'),
      winner: [
        { name: '123', mobile: '133****7777', lotteryInfo: 'aaa' },
        { name: '123', mobile: '133****7777', lotteryInfo: 'aaa' },
        { name: '123', mobile: '133****7777', lotteryInfo: 'aaa' },
        { name: '123', mobile: '133****7777', lotteryInfo: 'aaa' },
        { name: '123', mobile: '133****7777', lotteryInfo: 'aaa' }
      ]
    };
  },
  components: {
  },
  computed: {
    ...mapGetters('TemplateEditor', ['pageStyle']),
    bgStyle() {
      if (!this.pageStyle['1']) return {};
      if (this.pageStyle['1'].bg.bgType === 'color') {
        console.log('color: ', this.pageStyle['1'].bg.bgColor);
        return { backgroundColor: this.pageStyle['1'].bg.bgColor };
      } else {
        return { backgroundImage: `url(${this.pageStyle['1'].bg.bgImage})` };
      }
    },
    txt1() {
      if (!this.pageStyle['1']) return {};
      return this.pageStyle['1'].txt1;
    },
    txt2() {
      if (!this.pageStyle['1']) return {};
      return this.pageStyle['1'].txt2;
    },
    winners() {
      if (!this.pageStyle['1']) return {};
      return this.pageStyle['1'].winners;
    },
    btnStyle() {
      if (!this.pageStyle['1']) return {};
      return this.pageStyle['1'].btn;
    }
  },
  watch: {
  },
  mounted() {
  },
  methods: {
    selectEl(el, type) {
      this.$emit('select-el', el, type);
    }
  }
};
</script>

<style lang="scss">
html {
  font-size: 37.5px;
  body {
    font-size: 0.373333rem;
  }
}
.lottery-template {
  height: 100%;
  overflow-y: scroll;
  overflow-x: hidden;
  .horizontal {
    display: flex;
    justify-content: space-around;
    align-items: center;
  }
  .top {
    width: 100%;
    max-width: 10rem;
  }
  .turntable-content {
    width: 100%;
    min-height: 100%;
    // background: url('~@/assets/images/activity-template/luckDrawBg_two.png') no-repeat center top;
    background-repeat: no-repeat;
    background-position: center top;
    background-size: 100%;
    padding-top: 4rem;

    .remind-chance {
      text-align: center;

      .times {
        padding: 0.21333rem;
        width: 4.53333rem;
        border-radius: 0.896rem;
        margin: auto;
        text-align: center;
        background-color: #fef2b8;
        background: rgba(254, 242, 185, 0.5);
        font-size: 0.21333rem;
      }

      .beans {
        display: block;
        color: red;
        font-size: 0.21333rem;
        text-align: center;
        padding-top: 0.4rem;
      }
    }

    .banner {
      .turnplate {
        width: 7.466667rem;
        height: 7.466667rem;
        margin: auto;
        margin-top: 0.26667rem;
        background: url('~@/assets/images/activity-template/luck_disk.png') no-repeat center top;
        background-size: 90%;
        text-align: center;
        position: relative;
      }

      .item {
        width: 64vw;
        margin-top: 9px;
      }

      .pointer {
        position: absolute;
        left: 50%;
        top: 45%;
        z-index: 6;
        transform: translate(-50%, -50%);
        width: 3.133rem;
        height: 3.133rem;
      }
    }

    .my-prize-con {
      padding: 0.2667rem;
      padding-top: 0;

      .my-prize {
        padding: 0.21333rem 0.85333rem;
        background-color: #ff7300;
        display: block;
        margin: 0.85333rem;
        text-align: center;
        color: #fff;
        font-size: 0.37333rem;
        border-radius: 0.896rem;;
      }

      .act-rule {
        color: #ffe461;
        font-size: 0.4rem;
        font-weight: 700;
      }

      .rule-content {
        overflow: hidden;
        padding: 0.2667rem;
        text-align: left;
        color: #ffffff;
      }
    }

    .demo-popup {
      width: 100%;
      height: 100%;
      text-align: center;
      background: rgba(0, 0, 0, 0.6);
    }

    .cube-popup-content {
      width: 65%;

      .popup {
        margin: auto;
        opacity: 1;
        background: #fff;
        border-radius: 10px;
        box-shadow: 0 0 3px 3px #8a8a8a;
        background-image: none;
        text-align: center;

        .close {
          display: block;
          width: 20px;
          height: 20px;
          float: right;
          margin-right: 9px;
          margin-top: 8px;
          border-radius: 50%;
          border: 1px solid #929292;
          font-size: 16px;
        }

        h4 {
          color: #000;
          font-size: 14px;
          padding-top: 15px;
        }

        h5 {
          color: #929292;
          font-size: 12px;
          padding-bottom: 1.25rem;
        }

        h1 {
          color: #ef2b2c;
          font-size: 20px;
          margin-top: 20px;
        }

        .btn_two {
          border-radius: 30px;
          padding: 4px 8px;
          color: #ff7300;
          border: 1px solid #ff7300;
          background-color: #fff;
          margin: 20px;
          outline-style: none;
        }

        .close-style {
          position: absolute;
          top: 5px;
          right: 5px;
          font-size: 20px;
        }
      }
    }

    .prizeInfo {
      width: 100%;
      max-width: 10rem;
      margin-top: 0.2667rem;
      text-align: center;
      color: #ffe461;

      .winners {
        font-size: 0.42667rem;
      }

      .winners-table-con {
        width: 88%;
        height: 2.667rem;
        margin: auto;
        margin-top: 0.4rem;
        background-color: #bc3833;
        color: #fff;
        font-size: 0.34667rem;
        padding: 0.2667rem;
        overflow-y: scroll;

        table tr td {
          text-align: left;
          width: 26%;
          font-size: 14px;
          padding-bottom: 0.10667rem;
          word-break: keep-all;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          color: #fff;

          &:nth-child(2) {
            text-align: center;
          }

          &:nth-child(3) {
            text-align: right;
            white-space: nowrap;
          }
        }
      }
    }
  }
}
</style>
