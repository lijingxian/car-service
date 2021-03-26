<template>
  <div class="login-background">
    <!-- <div class="c-title">
      <img :src="zsjm">
    </div> -->
    <div class="c-wrapper">
      <div class="l-center">
        <img :src="zsjm" class="zsjm" @click="link">
        <div class="jumbotron">
          <!-- <div>
            <img class="pc" :src="PC">
          </div>
          <div data-hover-layer="0">
            <img class="tree" :src="Tree">
            <img class="phone" :src="Phone">
          </div>
          <div data-hover-layer="1">
            <img class="chart" :src="Chart">
            <img class="owl" :src="Owl">
          </div> -->
          <img :src="Login">
        </div>
        <div class="outer" :class="{ rotate: isRotate }">
          <login-form @forget-pwd="forgetPwd" @load="loading" :isLogin="isLogin"></login-form>
          <forget-password @return-login="isRotate = false" v-if="isLogin" ref="fwd"></forget-password>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
// import { Hover } from 'perspective.js';
import Tree from '@/assets/images/login/pic_tree.png';
import PC from '@/assets/images/login/pic_pc.png';
import Chart from '@/assets/images/login/pic_chart.png';
import Phone from '@/assets/images/login/pic_phone.png';
import Owl from '@/assets/images/login/pic_owl.png';
import Text from '@/assets/images/login/pic_text.png';
import zsjm from '@/assets/images/login/zsjm.png';
import Login from '@/assets/images/login/login.png';
import LoginForm from './LoginForm';
import ForgetPassword from './ForgetPassword';

export default {
  name: 'login-background',
  data() {
    return {
      // 是否翻面显示忘记密码页面
      isRotate: false,
      Tree: Tree,
      PC: PC,
      Phone: Phone,
      Owl: Owl,
      Chart: Chart,
      Text: Text,
      Login: Login,
      zsjm: zsjm
    };
  },
  props: {
    isLogin: {
      type: Boolean,
      default: true
    }
  },
  components: { LoginForm, ForgetPassword },
  computed: {},
  mounted() {
    // eslint-disable-next-line
    // new Hover('.jumbotron', {
    //   max: 3,
    //   scale: 1,
    //   perspective: 700,
    //   layers: [
    //     {
    //       multiple: 0.01,
    //       reverseTranslate: true
    //     },
    //     {
    //       multiple: 0.02,
    //       reverseTranslate: true
    //     }
    //   ]
    // });
  },
  watch: {},
  methods: {
    loading(flag) {
      this.$emit('load', flag);
    },
    forgetPwd() {
      this.$refs.fwd.showPwd = false;
      this.isRotate = true;
    },
    link() {
      window.open(document.location.protocol + '//' + window.location.host + '/#/merchants/apply-for');
    }
  }
};
</script>

<style lang="scss">
.login-background {
  display: flex;
  flex-direction: column;
  .c-title {
    position: relative;
    top: 100px;
    display: flex;
    justify-content: flex-end;
    height: 128px;
    img {
      padding-right: 200px;
    }
  }
  .c-wrapper {
    display: flex;
    justify-content: center;
    .l-center {
      width: 1100px;
      display: flex;
      margin-top: 35px;
      position: relative;
      .zsjm {
        position: absolute;
        height: 300px;
        right: -60px;
        top: -120px;
        cursor: pointer;
      }
      .jumbotron {
        width: 700px;
        height: 450px;
        position: relative;
        right: 80px;
        div {
          width: 100%;
          height: 100%;
          background-color: transparent;
          position: absolute;
          top: 0;
          left: 0;
        }
        img {
          position: absolute;
        }
        .tree {
          left: 30px;
          bottom: 10px;
          height: 151px;
        }
        .pc {
          bottom: -50px;
          left: 50px;
        }

        .phone {
          bottom: 10px;
          left: 320px;
        }
        .chart {
          bottom: 50px;
          left: 180px;
        }
        .owl {
          bottom: 20px;
          left: 400px;
        }
      }
      .outer {
        position: relative;
        perspective: 800px;
      }
      .login-form,
      .login-forget-pwd {
        position: absolute;
        left: 0;
        top: 0;
        transition: 1s;
        backface-visibility: hidden;
      }
      .login-forget-pwd {
        transform: rotateY(-180deg);
      }
      .rotate {
        .login-form {
          transform: rotateY(180deg);
        }
        .login-forget-pwd {
          transform: rotateY(0deg);
        }
      }
    }
  }
}
</style>
