<template>
  <div class="im-chat-item" :style="itemStyle">
    <div class="from-name" v-show="message.body.type !== 'session_end' && message.body.type !== 'evaluation' && message.body.type !== 'roll-out'">{{name}}</div>
    <div class="container" :style="containerStyle">
      <div class="container-txt" v-if="message.body.type==='txt'" v-html="message.body.msg"></div>
      <div class="image" v-if="message.body.type==='img'">
        <img :src="message.body.url" alt width="100" height="100" @click="dialogVisible=true" />
      </div>

      <div class="loc" v-if="message.body.type==='loc'">
        <biz-location-map :value="message.body"></biz-location-map>
      </div>

      <div class="video" v-if="message.body.type==='video'">
        <video :src="message.body.url" controls></video>
      </div>

      <div class="product" v-if="message.body.type==='product'" @click="onProduct">
        <div class="p-image">
          <img :src="productBasicInfo.image" />
        </div>
        <div class="p-name">{{productBasicInfo.name}}</div>
        <div class="price">￥{{productBasicInfo.marketPrice || '价格面议'}}</div>
      </div>

      <div class="session-end" v-if="message.body.type==='session_end'">{{message.body.msg}}</div>

      <div class="session-end" v-if="message.body.type==='evaluation'">{{message.body.msg}}</div>

      <div class="session-end" v-if="message.body.type==='roll-out'">{{message.body.msg}}</div>
    </div>
    <el-dialog append-to-body :visible.sync="dialogVisible" title width="800px">
      <img :src="message.body.url" width="100%" />
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { BizLocationMap } from '@/components/BizLocationMap';
import DefaultImg from '@/assets/images/commodity/pic_default_none_100.png';
import BaseInfoService from '@/service/commodity/commodity-mgmt/baseInfo';

export default {
  name: 'ImChatItem',
  data() {
    return {
      DefaultImg: DefaultImg,
      dialogVisible: false,
      productBasicInfo: {
        image: '',
        name: '',
        marketPrice: ''
      }
    };
  },
  props: {
    message: Object,
    isOnline: {
      type: Boolean,
      default() {
        return true;
      }
    }
  },
  created() {
    if (this.message.body.type === 'product') {
      this.getProductInfo();
    }
  },
  computed: {
    ...mapGetters('CustomService', ['activatedRoom']),
    itemStyle() {
      if (
        this.message.body.type === 'session_end' ||
        this.message.body.type === 'evaluation' ||
        this.message.body.type === 'roll-out'
      ) {
        return {
          'text-align': 'center',
          color: '#ccc'
        };
      }
      return {
        'text-align': this.message.isMyself ? 'right' : 'left'
      };
    },
    containerStyle() {
      if (
        this.message.body.type === 'session_end' ||
        this.message.body.type === 'evaluation' ||
        this.message.body.type === 'roll-out'
      ) {
        return {
          'background-color': '#eff1f5',
          'font-size': '12px'
        };
      }
      return {
        'background-color': this.message.isMyself ? '#ffebd4' : '#eff1f5'
      };
    },
    name() {
      if (this.message.isMyself) {
        return this.formatDateTime(this.message.timestamp) + ' ' + (this.message.fromName || '小V');
      }
      return this.message.fromName + ' ' + this.formatDateTime(this.message.timestamp);
    }
  },
  components: {
    BizLocationMap
  },
  methods: {
    onProduct() {
      this.$emit('product', this.message.body.id);
    },
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
    },
    getProductInfo() {
      let params = {
        id: this.message.body.id,
        shopId: window.top.SHOP_ID || ''
      };
      BaseInfoService.queryProductBasicInfo(
        params,
        data => {
          this.productBasicInfo = data.productBasicInfoData;
        },
        ErrorData => {
          console.log('获取商品基本信息失败', this.id);
        }
      );
    }
  }
};
</script>

<style lang="scss">
.im-chat-item {
  margin: 5px 10px;
  .from-name {
    color: #ccc;
    font-size: 12px;
    margin: 5px 0px;
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
      width: 100px;
      height: 100px;
      img {
        object-fit: cover;
        width: 100%;
        height: 100%;
      }
    }
    > .product {
      .p-image {
        width: 200px;
        height: 200px;
        margin-bottom: 8px;
        img {
          object-fit: cover;
          width: 100%;
          height: 100%;
        }
      }
      .p-name {
        margin-bottom: 5px;
      }
      .price {
        color: #f02b2b;
        font-size: 16px;
      }
    }
    > .video {
      max-width: 250px;
      img,
      video {
        width: 100%;
      }
    }
  }
}
</style>
