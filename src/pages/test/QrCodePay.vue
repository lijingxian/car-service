<template>
  <div class="qrCodePay">
    <div class="top">{{ orderInfo.orderItems[0].fullName }}</div>
    <div class="price">￥{{ orderInfo.amountPayable }}</div>
    <div class="bottom">
      <div><span>收款方</span><span>{{ orderInfo.shop.name }}</span></div>
      <div><span>商品</span><span>{{ orderInfo.orderItems[0].fullName }}</span></div>
      <div><span>金额</span><span>￥{{ orderInfo.amountPayable }}</span></div>
      <div><span>订单编号</span><span>{{ orderInfo.sn }}</span></div>
    </div>
  </div>
</template>
<script>
import http from '@/common/http';
import VConsole from 'vconsole';
export default {
  data() {
    return {
      payUrl: '',
      appId: '', // 公众号名称，由商户传入
      timeStamp: '', // 时间戳，自1970年以来的秒数
      nonceStr: '', // 随机串
      package: '',
      signType: '', // 微信签名方式：
      paySign: '', //
      orderInfo: {}
    };
  },
  created() {},
  watch: {},
  mounted() {
    document.title = '卡欧支付中心';
    let vConsole = new VConsole();
    console.log(vConsole);
    this.init();
  },
  methods: {
    getQueryString(name) {
      let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
      let r = window.location.search.substr(1).match(reg);
      if (r != null) return decodeURIComponent(r[2]);
      return null;
    },
    getOrderInfo() {
      let params = {
        orderId: this.$route.query.orderId,
        shopId: this.$route.query.shopId,
        userId: this.$route.query.userId
      };
      http.get('/rest/order/order.jhtml', params)
        .then(data => {
          this.orderInfo = data.order;
        })
        .catch();
    },
    init() {
      console.log(this.getQueryString('code'));
      let params = {
        orderId: this.$route.query.orderId,
        shopId: this.$route.query.shopId,
        userId: this.$route.query.userId,
        code: this.getQueryString('code'),
        state: this.getQueryString('state'),
        clientType: '2'
      };
      http
        .post('/rest/order/createQrPay.jhtml', params)
        .then(data => {
          console.log(data);
          // 微信支付
          if (data.payUrl) {
            location.href = data.payUrl;
            // 支付宝支付
          } else if (data.data.payUrl) {
            const div = document.createElement('div');
            div.innerHTML = data.data.payUrl;
            document.body.appendChild(div);
            document.forms[0].submit();
          } else {
            console.log(data.data.payParams);
            this.appId = data.data.payParams.appId;
            this.timeStamp = data.data.payParams.timeStamp;
            this.nonceStr = data.data.payParams.nonceStr;
            this.package = data.data.payParams.package;
            this.signType = data.data.payParams.signType;
            this.paySign = data.data.payParams.sign;
            this.pay();
          }
        })
        .catch(errData => {
          this.loading = false;
          this.$message.warning(errData.errorMessage);
        });
    },
    pay() {
      let that = this;
      if (typeof window.WeixinJSBridge === 'undefined') {
        if (document.addEventListener) {
          document.addEventListener('WeixinJSBridgeReady', that.onBridgeReady, false);
        } else if (document.attachEvent) {
          document.attachEvent('WeixinJSBridgeReady', that.onBridgeReady);
          document.attachEvent('onWeixinJSBridgeReady', that.onBridgeReady);
        }
      } else {
        that.onBridgeReady();
      }
    },
    onBridgeReady() {
      let that = this;
      window.WeixinJSBridge.invoke(
        'getBrandWCPayRequest',
        {
          appId: that.appId, // 公众号名称，由商户传入
          timeStamp: that.timeStamp, // 时间戳，自1970年以来的秒数
          nonceStr: that.nonceStr, // 随机串
          package: that.package,
          signType: that.signType, // 微信签名方式：
          paySign: that.paySign // 微信签名,paySign 采用统一的微信支付 Sign 签名生成方法，注意这里 appId 也要参与签名，appId 与 config 中传入的 appId 一致，即最后参与签名的参数有appId, timeStamp, nonceStr, package, signType。
        },
        function(res) {
          if (res.err_msg === 'get_brand_wcpay_request:ok') {
            // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。
            alert('支付成功！');
          } else {
            alert('支付失败：' + res.err_msg);
          }
          window.WeixinJSBridge.call('closeWindow');
        }
      );
    },
    exportCanvasAsPNG(fileName, canvas) {
      let MIME_TYPE = 'image/png';
      let dlLink = document.createElement('a');
      dlLink.download = fileName;
      dlLink.href = canvas.toDataURL('image/png');
      dlLink.dataset.downloadurl = [MIME_TYPE, dlLink.href].join(':');
      document.body.appendChild(dlLink);
      dlLink.click();
      document.body.removeChild(dlLink);
    }
  }
};
</script>

<style lang="scss">
.qrCodePay {
  background: #f5f5f9;
  text-align: center;
  .top {
    font-size: 16px;
    font-weight: bold;
    color: #000000;
    padding: 20px 0px;
  }
  .price {
    color: #ff7300;
    font-size: 16px;
    font-weight: bold;
    padding: 0px 0px 50px 0px;
  }
  .bottom {
    background: #ffffff;
    font-size: 14px;
    div {
      display: flex;
      justify-content: space-between;
      padding: 10px;
    }
  }
}
</style>
