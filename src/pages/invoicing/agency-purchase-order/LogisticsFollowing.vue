<template>
  <div class="logistic-following">
    <div class="product-info">
      <div class="img">
        <img :src="image || defaultProductImg">
      </div>
      <div class="info">
        <div class="i-item">物流状态：
          <span class="l-state">{{logisticState}}</span>
        </div>
        <div class="i-item">物流公司：{{logistics}}</div>
        <div class="i-item">快递单号：{{expressSn}}</div>
      </div>
    </div>
    <div class="logistic-info" v-if="shippingTraces && shippingTraces.length>0">
      <div class="track-list">
        <ul>
          <li v-for="shippingTrace of shippingTraces" :key="shippingTrace.id">
            <i class="node-icon"></i>
            <span class="txt">{{shippingTrace.station}}</span>
            <span class="time">{{shippingTrace.happenTime}}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
// 物流跟踪

import { mapGetters } from 'vuex';
import http from '@/common/http';
import urls from '@/common/urls';
import defaultProductImg from '@/assets/images/commodity/pic_default_none.png';

export default {
  name: 'LogisticsFollowing',
  components: {},
  data() {
    return {
      shippingSn: '',
      defaultProductImg: defaultProductImg,
      shippingTraces: [],
      state: '',
      logistics: '',
      expressSn: '',
      image: ''
    };
  },
  computed: {
    ...mapGetters(['getUser']),
    ...mapGetters('Order', ['curApplySaleItem', 'orderInfo']),
    logisticState() {
      switch (this.state) {
        case '0':
          return '无轨迹';
        case '1':
          return '已揽收';
        case '2':
          return '在途中';
        case '201':
          return '到达派件城市';
        case '3':
          return '签收';
        case '4':
          return '问题件';

        default:
          return '';
      }
    }
  },
  props: {
    sn: {
      type: String,
      default: ''
    }
  },
  watch: {},
  created() {},
  methods: {
    getLogisticsInfo() {
      let param = {
        methodName: 'QueryLogistics',
        clientType: '2',
        shopId: this.getUser.shop.id,
        userId: this.getUser.id,
        shippingSn: this.sn
      };
      http
        .get(urls.hypermarketMgmt.logistics, param)
        .then(data => {
          console.log('物流追踪', data);
          this.state = data.shipping.state;
          this.image = data.shipping.shippingItems.length > 0 ? data.shipping.shippingItems[0].image : '';
          this.logistics = data.shipping.logistics;
          this.expressSn = data.shipping.expressSn;
          this.shippingTraces = data.shipping.shippingTraces;
        })
        .catch(error => {
          this.$message.warning(error.errorMessage);
        });
    }
  }
};
</script>

<style lang="scss">
.logistic-following {
  height: 100%;
  padding-top: 5px;
  font-size: 14px;
  overflow: auto;
  .product-info {
    display: flex;
    background-color: #fefefe;
    border-bottom: 1px solid #eee;
    margin-bottom: 5px;
    padding: 5px;
    width: 100%;
    .img {
      width: 60px;
      height: 60px;
      margin-left: 10px;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .info {
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      .l-state {
        color: red;
      }
    }
  }
  .logistic-info {
    background-color: #fefefe;
    height: calc(100% - 75px);
    ul li {
      list-style: none;
    }
    .track-list {
      margin: 0 10px;
      padding-left: 5px;
      padding-bottom: 10px;
      position: relative;
      ul {
        li:not(:last-child)::after {
          content: '';
          position: absolute;
          z-index: 1;
          pointer-events: none;
          background-color: #d9d9d9;
          width: 1px;
          top: 26px;
          left: -1px;
          bottom: -18px;
        }
        li:not(:first-child)::before {
          content: '';
          position: absolute;
          z-index: 1;
          pointer-events: none;
          background-color: #e7e7e7;
          height: 1px;
          left: 25px;
          right: 0;
        }
        li {
          position: relative;
          padding: 8px 0 0 25px;
          line-height: 18px;
          color: #999;
          .node-icon {
            position: absolute;
            left: -6px;
            top: 15px;
            width: 11px;
            height: 11px;
            border-radius: 50%;
            background: #b7b7b7;
            border: #e0e0e0 solid 3px;
          }
          .time {
            margin-right: 20px;
            position: relative;
            top: 4px;
            display: inline-block;
            vertical-align: middle;
            font-size: 12px;
            color: #999;
          }
          .txt {
            color: #333;
            position: relative;
            top: 4px;
            display: inline-block;
            vertical-align: middle;
          }
        }
        li:first-child {
          .node-icon {
            background: red;
            border: #ffa4a4 solid 3px;
          }
          .txt {
            color: red;
          }
        }
        li:first-child::after {
          background: linear-gradient(0deg, #e8e8ed, #e64b4e);
        }
      }
    }
  }
}
</style>
