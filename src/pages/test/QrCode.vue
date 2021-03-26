<template>
  <div id="qrcode"></div>
</template>
<script>
import QRCode from 'qrcodejs2';
export default {
  name: 'FederationMgmtVr',
  computed: { QRCode },
  data() {
    return {};
  },
  created() {},
  watch: {},
  mounted() {
    let qrcode = new QRCode(document.getElementById('qrcode'), document.location.protocol + '//' + window.location.host + '/#/qrPay4Order?orderId=58025&shopId=323&userId=343&clientType=2');
    // this.exportCanvasAsPNG('qrcode.png', document.getElementById('qrcode').children[0]);
    console.log(qrcode);
    console.log(222);
  },
  methods: {
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
.upload-vr-asset-h {
  width: 100%;
  margin-top: 20px;
  .hide-file {
    display: none;
  }
  .slot {
    float: right;
    width: 70px;
    margin-top: -2px;
  }
  .iframe {
    width: 100%;
    min-height: 400px;
  }
  .row {
    display: flex;
    flex-direction: column;
    .mu-linear-progress-determinate {
      background-color: #ff8d00;
    }
    .handle-btn {
      margin: 10px;
      width: 100%;
      .title {
        margin-bottom: 5px;
      }
      .btn {
        margin: 0 5px;
        background-color: #ff8d00;
        .mu-raised-button-label {
          color: #fff;
        }
      }
      .del.btn {
        background-color: #da0000;
        opacity: 0.8;
      }
    }
    .title {
      width: 100%;
      font-size: 16px;
      color: #929292;
    }
    #qrcode {
      display: none !important;
    }
  }
}
</style>
