<template>
  <div class="red-packet-template">
    <div class="red-packet-content">
      <div class="red-packet-bg" v-if="type === '1'" :style="type1BgStyle" @click="selectEl('bg', 'brick')">
        <div class="red-packet-body">
          <img :src="type1ImgUrl" class="type1-img" @click.stop="selectEl('img', 'image')"/>
          <!-- 2020年7月20日 抢红包文字去掉 by 赵丹青 -->
          <!-- <h1>开门抢红包！</h1>
          <h4>你还有&nbsp;{{ 3 }}&nbsp;次机会</h4> -->
          <div class="btn-group" @click.stop="selectEl('btn', 'button')">
            <span class="btn-go-on" :style="type1BtnStyle">继续抢</span>
            <span class="btn-my-prize" :style="type1BtnStyle">我的奖品</span>
          </div>
        </div>
      </div>
      <div class="red-packet-bg" v-if="type === '2'" :style="type2BgStyle" @click="selectEl('bg', 'brick')">
        <div class="red-packet-body">
          <img :src="type2ImgUrl" class="type1-img"  @click.stop="selectEl('img', 'image')" />
          <!-- <h1>恭喜您！</h1>
          <h4>红包已经放进了你的账户</h4> -->
          <span class="amount_css" v-if="prizeType !== '3'">现金券</span>
          <span v-if="prizeType === '3'" class="one-more-time">再来一次</span>
          <button v-if="prizeType === '2' || prizeType === '8'" class="btn-use-now">立即使用</button>
          <div class="btn-group" @click.stop="selectEl('btn', 'button')">
            <span class="btn-go-on" :style="type2BtnStyle">继续抢</span>
            <span class="btn-my-prize" :style="type2BtnStyle">我的奖品</span>
          </div>
        </div>
      </div>
      <div class="red-packet-bg" v-if="type === '3'" :style="type3BgStyle" @click="selectEl('bg', 'brick')">
        <div class="red-packet-body">
          <img :src="type3ImgUrl" class="type3-img" @click.stop="selectEl('img', 'image')">
          <!-- <h1>很遗憾</h1>
          <h4>红包与你擦肩而过</h4> -->
          <div class="btn-group" @click.stop="selectEl('btn', 'button')">
            <span class="btn-go-on" :style="type3BtnStyle">继续抢</span>
            <span class="btn-my-prize" :style="type3BtnStyle">我的奖品</span>
          </div>
        </div>
      </div>
      <div class="act-rule">
        <h3>活动说明</h3>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';

export default {
  props: {
    type: {
      type: String,
      default: '1'
    }
  },
  data () {
    return {
      picRobIndex: require('@/assets/images/activity-template/抽奖.jpg'),
      redPacketImg: require('@/assets/images/activity-preview/robMaterial.png'),
      picNoRob: require('@/assets/images/activity-preview/noRob.png'),
      prizeType: '2'
    };
  },
  components: {
  },
  computed: {
    ...mapGetters('TemplateEditor', ['pageStyle']),
    type1BgStyle() {
      if (!this.pageStyle['1']) return {};
      if (this.pageStyle['1'].bg.bgType === 'color') {
        console.log('color: ', this.pageStyle['1'].bg.bgColor);
        return { backgroundColor: this.pageStyle['1'].bg.bgColor };
      } else {
        return { backgroundImage: `url(${this.pageStyle['1'].bg.bgImage})` };
      }
    },
    type1ImgUrl() {
      if (!this.pageStyle['1']) return '';
      return this.pageStyle['1'].img.url;
    },
    type1BtnStyle() {
      if (!this.pageStyle['1']) return {};
      return this.pageStyle['1'].btn;
    },
    type2BgStyle() {
      if (!this.pageStyle['2']) return {};
      if (this.pageStyle['2'].bg.bgType === 'color') {
        console.log('color: ', this.pageStyle['2'].bg.bgColor);
        return { backgroundColor: this.pageStyle['2'].bg.bgColor };
      } else {
        return { backgroundImage: `url(${this.pageStyle['2'].bg.bgImage})` };
      }
    },
    type2ImgUrl() {
      if (!this.pageStyle['2']) return '';
      return this.pageStyle['2'].img.url;
    },
    type2BtnStyle() {
      if (!this.pageStyle['2']) return {};
      return this.pageStyle['2'].btn;
    },
    type3BgStyle() {
      if (!this.pageStyle['3']) return {};
      if (this.pageStyle['3'].bg.bgType === 'color') {
        console.log('color: ', this.pageStyle['3'].bg.bgColor);
        return { backgroundColor: this.pageStyle['3'].bg.bgColor };
      } else {
        return { backgroundImage: `url(${this.pageStyle['3'].bg.bgImage})` };
      }
    },
    type3ImgUrl() {
      if (!this.pageStyle['3']) return '';
      return this.pageStyle['3'].img.url;
    },
    type3BtnStyle() {
      if (!this.pageStyle['3']) return {};
      return this.pageStyle['3'].btn;
    }
  },
  watch: {
  },
  mounted() {},
  methods: {
    ...mapMutations('TemplateEditor', ['updatePageStyle']),
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
.red-packet-template {
  height: 100%;
  overflow: hidden;
  .red-packet-body {
    position: relative;
    height: 100%;
    width: 100%;
    max-width: 10rem;
  }
  .red-packet-content {
    position: relative;
    min-height: 100%;
    width: 100%;
    background-color: #f9f1cd;
    .red-packet-bg {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      display: flex;
      justify-content: center;
      // width: 375px;
      // height: calc(375px / 720 * 734);
      text-align: center;
      color: #624326;
      background-position: center 0;
      background-size: cover;
      .type1-img {
        position: absolute;
        bottom: calc(100% - 10.667rem);
        right: calc(50% - 2.5333rem);
        width: 5.0667rem;
      }
      .type3-img {
        position: absolute;
        top: 30%;
        right: calc(50% - 3.2rem);
        width: 6.4rem;
      }

      .amount_css {
        width: 3.2rem;
        position: absolute;
        color: #fac30e;
        font-size: 0.58667rem;
        left: 50%;
        transform: translate(-50%, -50%);
        top: 40%;
      }

      h1 {
        position: absolute;
        top: 7%;
        font-size: 0.69333rem;
        font-weight: 800;
        left: 51%;
        transform: translate(-50%, -50%);
      }

      h4 {
        position: absolute;
        top: 17%;
        font-size: 0.42667rem;
        left: 50%;
        transform: translate(-50%, -50%);
        white-space: nowrap;
      }

      .rob {
        position: absolute;
        bottom: 13.4%;
        margin: 0 auto;
        color: #df0055;
        font-size: 0.37333rem;
        left: calc(50% - 2.5em);
      }

      .btn-use-now {
        position: absolute;
        background-color: #fff965;
        font-size: 0.37333rem;
        color: #ca2a1c;
        padding: 0.21333rem 0.32rem;
        left: 50%;
        transform: translate(-50%, 50%);
        bottom: 45%;
        border-radius: 0.2667rem;
        outline-style: none;
        border-style: none;
      }

      .one-more-time {
        position: absolute;
        font-size: 0.45333rem;
        color: #fff965;
        padding: 0.21333rem 0.32rem;
        left: 50%;
        transform: translate(-50%, 50%);
        bottom: 16%;
        border-radius: 0.2667rem;
        outline-style: none;
        border-style: none;
      }
    }

    .btn-group {
      position: absolute;
      top: 10.18667rem;
      left: 0;
      right: 0;
      display: flex;
      align-items: center;
      justify-content: space-around;
      margin: 0.85333rem;
      font-size: 0.37333rem;

      .btn-go-on {
        padding: 0.21333rem 0.85333rem;
        background-color: #fdb71b;
        border-radius: 0.2667rem;
      }

      .btn-my-prize {
        padding: 0.21333rem 0.85333rem;
        background-color: #fdb71b;
        border-radius: 0.2667rem;
      }
    }

    .act-rule {
      position: absolute;
      top: 0.2667rem;
      right: 0.2667rem;
      color: #5f3400;
      font-size: 15px;
      line-height: 24px;
      h3 {
        margin: 0;
      }

      .rule-content {
        overflow: hidden;
        padding: 0.2667rem;
        text-align: left;
        font-size: 13px;
      }
    }
  }
}
</style>
