<template>
  <div class="about-us">
    <div class="block">
      <div class="title">平台简介</div>
      <div class="content">V服爱车，以提供高效、便捷、安全、环保的车队管理、汽车生活为宗旨。由长春丽明科技开发股份有限公司推出的全方位一站式汽车服务平台</div>
    </div>
    <div class="block">
      <div class="title">为您服务</div>
      <div class="content">为您服务：提供车况检测、故障报警，做您爱车的健康医生；支持驾控分析、信息提醒，做您出行的贴身顾问；监控行车轨迹、电子围栏，做您车队的管理帮手。</div>
    </div>
    <div class="block">
      <div class="title">联系方式</div>
      <div class="content">
        <div class="mobile">热线: 400-6556-119</div>
        <div class="addr">地址: 吉林省长春市光谷大街2388号汽车电子产业园</div>
        <div class="website">网址: {{ website }}</div>
        <div class="edition">版本: {{ edition }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import http from '@/common/http';

export default {
  name: 'AboutUs',
  data () {
    return {
      website: window.location.hostname,
      editionUrl: '/admin/common/aboutus.jhtml',
      edition: ''
    };
  },
  computed: {
    ...mapGetters(['currentUser'])
  },
  components: {
  },
  methods: {
    getEdition() {
      http.get(this.editionUrl, {})
        .then(data => {
          this.edition = data.version;
        })
        .catch(ErrorData => {
          console.log('ERR_GET_EDITION: ', ErrorData.errorMessage);
        });
    }
  },
  mounted() {
    this.getEdition();
  }
};
</script>

<style lang="scss">
.about-us {
  height: 500px;
  width: 100%;
  padding: 50px;
  display: flex;
  flex-direction: column;
  // justify-content: center;
  align-items: center;
  .block {
    width: 900px;
    margin-top: 20px;
    .title {
      margin-bottom: 20px;
      font-size: 18px;
      font-weight: bold;
      color: #ff7300;
    }
  }
}
</style>
