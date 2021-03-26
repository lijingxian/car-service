<template>
  <div class="login-footer">
    <div class="link">
      <a target="_blank" href="http://www.kaoutech.com/">
        <span>关于我们</span>
      </a>
      <div>|</div>
      <el-popover placement="bottom" trigger="hover" width="170">
        <span slot="reference">
          手机下载
        </span>
        <img src="/resources/admin/help/app.png" alt="" style="width: 146px">
      </el-popover>
    </div>
    <p>©2017-2019 {{ location }} 版权所有 杭州卡欧科技有限公司
      ICP证：{{location.indexOf('vfu365.com')!==-1?'浙ICP备16040238号-1':'吉ICP备14002774号-3'}}
    </p>
    <p>中华人民共和国网络文化经营许可证 经营许可证编号：浙网文(2020)2629-120号</p>
    <p>中华人民共和国电信业务经营许可证 经营许可证编号：浙B2-20180141</p>
    <a target="_blank" href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=33010802007885"
      style="display:inline-block;text-decoration:none;height:20px;line-height:20px;">
      <img style="float: left; width: 20px;" :src="beian">
      <span style="float:left;height:20px;line-height:20px;margin: 0px 0px 0px 5px; color:#939393;">浙公网安备 33010002000099号</span>
    </a>
  </div>
</template>

<script>
import beian from '@/assets/images/login/beian.png';

export default {
  name: 'login-footer',
  data() {
    return {
      beian: beian,
      location: window.location.hostname
    };
  },
  props: {},
  components: {},
  computed: {},
  watch: {},
  methods: {},
  mounted() {}
};
</script>

<style lang="scss">
.login-footer {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 14px;
  a {
    text-decoration: none;
  }
  > .link {
    display: flex;
    margin: 20px 0;
    a {
      margin: 0 10px;
      color: #000;
    }
    > span {
      cursor: pointer;
      margin: 0 10px;
    }
  }
  p {
    margin: 0;
  }
}
</style>
