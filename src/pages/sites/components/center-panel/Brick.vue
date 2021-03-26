<template>
  <section class="brick" :style="styleObject">
    <com-item v-for="item of brickData.children" :com-data="item" :key="item.id" :isEdit="isEdit"></com-item>
  </section>
</template>

<script>
import ComItem from './ComItem';

export default {
  name: 'Brick',
  components: {
    ComItem
  },
  props: {
    brickData: {},
    isEdit: {
      type: Boolean,
      default() {
        return true;
      }
    }
  },
  data() {
    return {};
  },
  computed: {
    styleObject() {
      let style = {
        height: this.brickData.height / 37.5 + 'rem'
      };
      if (this.brickData.bgType === 'color') {
        style['background-color'] = this.brickData.bgColor;
      } else if (this.brickData.bgType === 'image') {
        style['background-image'] = `url(${this.brickData.bgImage.src})`;
      }
      return style;
    }
  },
  watch: {},
  created() {},
  methods: {}
};
</script>

<style lang="scss">
.brick {
  position: relative;
  background-size: cover;
  background-position: 50%;
  background-repeat: no-repeat;
  overflow-x: hidden;
}
</style>
