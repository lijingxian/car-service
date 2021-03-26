<template>
  <div class="sc-chat-item"
       :style="itemStyle">
    <div class="from-name">{{message.fromMember.nickname||'robot' +' '+ formatDateTime(message.timestamp)}}
    </div>
    <div class="container"
         :style="containerStyle">

      <div class="container-txt"
           v-if="message.body.type==='txt'"
           v-html="message.body.msg">
      </div>

      <div class="image"
           v-if="message.body.type==='img'">
        <img :src="message.body.url"
             alt="">
      </div>

      <div class="loc"
           v-if="message.body.type==='loc'">
        <biz-location-map :value="message.body">
        </biz-location-map>
      </div>

      <div class="video"
           v-if="message.body.type==='video'">
        <video :src="message.body.url"
               controls></video>
      </div>

    </div>
  </div>
</template>

<script>
import { BizLocationMap } from '@/components/BizLocationMap';

export default {
  name: 'CSChatItem',
  data() {
    return {};
  },
  props: {
    message: Object
  },
  created() {},
  computed: {
    itemStyle() {
      if (this.message.fromMember.isService === '0') {
        return { 'text-align': 'left' };
      } else {
        return { 'text-align': 'right' };
      }
    },
    containerStyle() {
      if (this.message.fromMember.isService === '0') {
        return { 'background-color': '#eff1f5' };
      } else {
        return { 'background-color': '#ffebd4' };
      }
    }
  },
  components: {
    BizLocationMap
  },
  methods: {
    formatDateTime(inputTime) {
      let date = new Date(Number(inputTime));
      let y = date.getFullYear();
      let m = date.getMonth() + 1;
      m = m < 10 ? '0' + m : m;
      let d = date.getDate();
      d = d < 10 ? '0' + d : d;
      let h = date.getHours();
      h = h < 10 ? '0' + h : h;
      let minute = date.getMinutes();
      let second = date.getSeconds();
      minute = minute < 10 ? '0' + minute : minute;
      second = second < 10 ? '0' + second : second;
      return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
    }
  }
};
</script>

<style lang="scss">
.sc-chat-item {
  margin: 5px 10px;
  .from-name {
    color: #ccc;
    font-size: 12px;
  }
  > .container {
    font-size: 13px;
    padding: 5px;
    display: inline-block;
    width: auto;
    height: auto;
    background-color: #ffebd4;
    border-radius: 5px;
    .container-txt {
      img {
        width: 16px;
        height: 16px;
      }
    }
    > .image {
      max-width: 550px;
      img {
        max-width: 100%;
      }
    }
    > .video{
      max-width: 550px;
      video {
        max-width: 100%;
      }
    }
  }
}
</style>
