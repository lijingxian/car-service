<template>
  <div class="activiti-mgmt-preview-header" :style="'width:'+width">
    <i class="el-icon-arrow-left"></i>
    <div class="header-title">{{headerTitle}}</div>
    <div class="slot-append">
      <slot name="append"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PreviewHeader',
  props: {
    headerTitle: {
      type: String,
      default: '促销详情'
    },
    width: {
      type: String,
      default() {
        return '375px';
      }
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
.activiti-mgmt-preview-header {
  width: 375px;
  height: 30px;
  margin: 0 auto;
  border-bottom: 1px solid #8f8f8f;
  display: flex;
  justify-content: space-between;
  .el-icon-arrow-left {
    font-size: 20px;
    color: #8f8f8f;
    font-weight: bold;
    float: left;
  }
  .header-title {
    // margin: 0 auto;
    width: fit-content;
    text-align: center;
    color: #222222;
    font-weight: bold;
  }
  .slot-append {
    color: #8f8f8f;
    width: 20px;
    font-weight: bold;
    .iconfont {
      font-size: 20px;
    }
  }
}
</style>
