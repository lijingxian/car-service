<template>
  <div class="biz-grid">
    <div class="biz-grid__top" v-if="$slots.top">
      <slot name="top"></slot>
    </div>
    <div class="biz-grid__content">
      <biz-scroller>
        <slot></slot>
      </biz-scroller>
    </div>
    <div class="biz-grid__bottom" v-if="$slots.bottom">
      <slot name="bottom"></slot>
    </div>
    <div class="biz-grid__float" v-if="$slots.float">
      <slot name="float"></slot>
    </div>
  </div>
</template>

<script>
import BizScroller from '@/components/BizScroller';

export default {
  name: 'BizGrid',
  components: {
    BizScroller
  }
};
</script>

<style lang="scss">
.biz-grid {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;

  > .biz-grid__top,
  > .biz-grid__bottom {
    flex-grow: 0;
  }
  .biz-grid__float {
    flex-grow: 0;
    // position: absolute; // 浏览器兼容性多余处理
    z-index: 1; // 浏览器兼容性多余处理
  }

  .biz-grid__content {
    flex-grow: 1;
    position: relative;
  }
}
</style>
