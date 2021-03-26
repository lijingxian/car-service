<template>
  <div class="shake-content">
    <div class="shake-body" :class="mode" :style="bgStyle" @click="selectEl('bg', 'brick')">
      <!-- <cube-checkbox label="声音" class="demo-checkbox" shape="square" v-model="isAudioOpen" @input="videoOpen" :option="option" /> -->
      <div class="top">
        <img :src="shakeImg" class="shake-img" @click.stop="selectEl('img', 'image')">
        <p class="body-title" :style="txt1" @click.stop="selectEl('txt1', 'text')">{{ txt1.content }}</p>
        <span class="body-content" :style="txt2" @click.stop="selectEl('txt2', 'simple-text')">今天你还可以摇3次</span>
      </div>
      <div class="bottom">
        <span class="bottom-title" :style="txt3" @click.stop="selectEl('txt3', 'simple-text')">恭喜中奖者</span>
        <div class="bottom-body" :style="winners"  @click.stop="selectEl('winners', 'list')">
          <table>
            <tr v-for="(item, index) in winner" :key="index">
              <td>{{ item.name }}</td>
              <td>{{ item.mobile || '' }}</td>
              <td>{{ item.lotteryInfo }}</td>
            </tr>
          </table>
        </div>
        <audio width="320" height="240" ref="audio" controls hidden>
          <source src="http://fjdx.sc.chinaz.com/files/download/sound1/201410/5018.mp3">
        </audio>
        <div class="myGift">
          <span class="bot-btn" :style="btnStyle"  @click.stop="selectEl('btn', 'button')">我的奖品</span>
        </div>
        <!-- <div class="bottom-foot" v-if="lottery.lotteryInitInfo.rule">
          <h5 class="bottom-foot-title">活动规则</h5>
          <p class="bottom-content" v-html="lottery.lotteryInitInfo.rule.replace(/\r?\n/g, '<br>')"></p>
        </div> -->
      </div>
      <!-- <div class="bottom-bg">
        <img :src="picShakeBottom" width="100%" alt="">
      </div> -->
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
    shakeImg() {
      if (!this.pageStyle['1']) return '';
      return this.pageStyle['1'].img.url;
    },
    txt1() {
      if (!this.pageStyle['1']) return {};
      return this.pageStyle['1'].txt1;
    },
    txt2() {
      if (!this.pageStyle['1']) return {};
      return this.pageStyle['1'].txt2;
    },
    txt3() {
      if (!this.pageStyle['1']) return {};
      return this.pageStyle['1'].txt3;
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
.shake-content {
  height: 100%;
  .horizontal {
    display: flex;
    justify-content: space-around;
    align-items: center;
  }
  .shake-body {
    width: 100%;
    height: 100%;
    background-size: 100%;
    background-position: center top;
    // background-repeat: no-repeat;
    text-align: center;
    border-top: 1px solid transparent;
  }
  // .shakeIndex {
  //   @include contentStyle;
  //   background: url('~@/assets/img/activity/shakeIndex.png') center top no-repeat,
  //     url('~@/assets/img/activity/bg_shake.png') bottom repeat;
  //   background-size: 100%;
  //   text-align: center;
  // }

  // .shakeV {
  //   @include contentStyle;
  //   background: url('~@/assets/img/activity/shakeV.png') center top no-repeat,
  //     url('~@/assets/img/activity/bg_shake.png') bottom repeat;
  //   background-size: 100%;
  //   text-align: center;
  // }

  // .shakeMoney {
  //   @include contentStyle;
  //   background: url('~@/assets/img/activity/shakeMoney.png') center top no-repeat,
  //     url('~@/assets/img/activity/bg_shake.png') bottom repeat;
  //   background-size: 100%;
  //   text-align: center;
  // }

  // .shakeCoupon {
  //   @include contentStyle;
  //   background: url('~@/assets/img/activity/shakeCoupon.png') center top no-repeat,
  //     url('~@/assets/img/activity/bg_shake.png') bottom repeat;
  //   background-size: 100%;
  //   text-align: center;
  // }

  // .shakeMaterial {
  //   @include contentStyle;
  //   background: url('~@/assets/img/activity/shakeMaterial.png') center top no-repeat,
  //     url('~@/assets/img/activity/bg_shake.png') bottom repeat;
  //   background-size: 100%;
  //   text-align: center;
  // }

  // .noShake {
  //   @include contentStyle;
  //   background: url('~@/assets/img/activity/noShake.png') center top no-repeat,
  //     url('~@/assets/img/activity/bg_shake.png') bottom repeat;
  //   background-size: 100%;
  //   text-align: center;
  // }

  // .shakeTimes {
  //   @include contentStyle;
  //   background: url('~@/assets/img/activity/shakeTimes.png') center top no-repeat,
  //     url('~@/assets/img/activity/bg_shake.png') bottom repeat;
  //   background-size: 100%;
  //   text-align: center;
  // }

  .demo-checkbox {
    float: right;
    margin-right: 0.2667rem;
    margin-top: 0.2667rem;
  }
  .shake-img {
    margin-top: 0.5333rem;
    width: 8rem;
  }

  .body-title {
    color: #fff;
    font-weight: 800;
    text-align: center;
    margin-top: 0.2667rem;
    font-size: 0.72rem;
  }

  .body-content {
    color: #fff;
    font-size: 0.29333rem;
    font-weight: 800;
    padding: 0.21333rem 0.32rem;
    background: rgba(0, 0, 0, 0.3);
    display: inline-block;
    margin-top: 0.2667rem;
    border-radius: 0.2667rem;
  }

  .bottom {
    margin-top: 0.42667rem;

    .bottom-title {
      color: #fde25f;
      font-size: 0.42667rem;
    }

    .bottom-body {
      width: 88%;
      height: 3.12rem;
      margin: auto;
      margin-top: 0.4rem;
      background-color: #bc3833;
      color: #fff;
      font-size: 0.32rem;
      line-height: 0.32rem;
      padding: 0.2667rem;
      overflow-y: scroll;

      td {
        text-align: left;
        width: 2.667rem;
        font-size: 0.37333rem;
        padding-bottom: 0.1333rem;

        &:nth-child(2) {
          text-align: center;
        }

        &:nth-child(3) {
          text-align: right;
        }
      }
    }

    .myGift {
      width: 88%;
      margin: 0.5333rem auto 0.2667rem;

      .bot-btn {
        padding: 0.2667rem 0.32rem;
        color: #cb2c17;
        background-color: #fff965;
        border-radius: 3px;
        width: 100%;
        display: inline-block;
        font-size: 0.37333rem;
        border-radius: 0.2667rem;
      }
    }

    .bottom-foot {
      margin-top: 0.48rem;
      width: 100%;
      padding: 0px 0.5333rem;
      font-size: 0.32rem;
      color: #fff;
      text-align: left;
      margin-bottom: 0.8rem;

      p {
        padding-bottom: 0.2667rem;
      }

      .bottom-foot-title {
        color: #ffe461;
        font-size: 0.4rem;
        font-weight: 700;
        margin-bottom: 0.1333rem;
      }

      .bottom-content {
        overflow: hidden;
        padding-top: 0.2667rem;
        text-align: left;
      }
    }
  }

  .bottom-bg {
    position: relative;
  }
}
</style>
