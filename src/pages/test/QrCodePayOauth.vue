<template>
  <div style="color:#ffffff">
    1
  </div>
</template>
<script>
import http from '@/common/http';
export default {
  data() {
    return {};
  },
  created() {
    this.init();
  },
  watch: {},
  mounted() {},
  methods: {
    init() {
      let params = {
        orderId: this.$route.query.orderId,
        shopId: this.$route.query.shopId,
        userId: this.$route.query.userId,
        clientType: '2'
      };
      http
        .post('/rest/order/createQrPay.jhtml', params)
        .then(data => {
          console.log(data);
          location.href = data.payUrl;
        })
        .catch(errData => {
          this.loading = false;
          this.$message.warning(errData.errorMessage);
        });
    }
  }
};
</script>

<style lang="scss">
.qrCodePay {
  .head {
    font-size: 14px;
    text-align: center;
    height: 50px;
    line-height: 50px;
  }
  .el-form {
    width: 50%;
    margin: 0 auto;
  }
}
</style>
