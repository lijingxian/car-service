<template>
  <div class="biz-scroller">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'BizScroller'
};
</script>

<style lang="scss">
.biz-scroller {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
}
</style>
