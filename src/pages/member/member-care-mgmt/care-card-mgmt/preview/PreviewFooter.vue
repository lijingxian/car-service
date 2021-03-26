<template>
  <div class="activity-mgmt-preview-footer">
    <div class="left-addr">
      <div class="shopName">{{activity.shop.name}}</div>
      <div class="shopAddr">{{activity.shop.address}}</div>
    </div>
    <div class="right-icon">
      <div class="icon-area first-one">
        <i class="iconfont biz-icon-dingwei1"></i>位置
      </div>
      <div class="icon-area">
        <i class="iconfont biz-icon-web-icon-"></i>电询
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PreviewFooter',
  props: {
    activity: {
      type: Object
    }
  },
  data () {
    return {
    };
  },
  components: {
  }
};
</script>

<style lang="scss">
.activity-mgmt-preview-footer {
  position: absolute;
  top: 415px;
  left: 10px;
  width: 264px;
  height: 75px;
  background-color: #bb3933;
  padding: 10px;
  display: flex;
  color: #ffffff;
  .left-addr {
    width: 70%;
  }
  .right-icon {
    display: flex;
    width: 30%;
    font-size: 10px;
    .icon-area {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .iconfont {
        font-size: 30px;
      }
    }
    .icon-area.first-one {
      padding-right: 5px;
      border-right: 1px solid #fff;
      margin-right: 5px;
    }
  }
}
</style>
