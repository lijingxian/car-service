<template>
  <div id="qrcode-print">
    <img class="logo" :src="logo" alt="logo">
    <img :src="img" alt="qrCode">
    <h6>{{shopName}}</h6>
    <img class="scan-note" :src="qr" alt="qrscan note">
    <!-- <el-button type="primary" size="mini" @click="print" v-show="show">打印</el-button> -->
  </div>
</template>

<script>
import qr from '@/assets/images/qrcode/qr-scan-note.jpg';
import logo from '@/assets/images/qrcode/logo.png';
import { setTimeout } from 'timers';
export default {
  data() {
    return {
      img: '',
      shopName: '',
      qr: qr,
      logo: logo,
      show: true
    };
  },
  created() {
    this.img = this.$route.query.img;
    this.shopName = this.$route.query.shopName;
  },
  mounted() {
    let that = this;
    setTimeout(() => {
      that.print();
    }, 100);
  },
  methods: {
    print() {
      window.print();
    }
  }
};
</script>

<style lang="scss">
#qrcode-print {
  position: fixed;
  width: 300px;
  height: 350px !important;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
  padding: 1rem;
  text-align: center;
  .mu-raised-button {
    position: fixed;
    right: 2rem;
    top: 2rem;
  }
  img {
    display: block;
    margin: 0 auto;
    width: 150px;
    height: auto;
    margin-bottom: 1rem;
    &.logo {
      width: 120px;
      margin-bottom: 2rem;
    }
    &.scan-note {
      width: 90%;
      margin: 1rem auto !important;
    }
  }
  h6 {
    font-size: 2rem;
  }

  @media print {
    .mu-raised-button {
      display: none;
    }
  }
}
</style>
