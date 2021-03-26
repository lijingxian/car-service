<template>
  <div class="image-panel">
    <div class="left" v-if="$slots.left">
      <slot name="left"></slot>
    </div>
    <div class="image">
      <img :src="imgSrc ? (host + imgSrc) : defaultImage" @error="handleError" />
      <div class="vr-label" v-if="isHaveVr">
        VR
      </div>
    </div>
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

import defaultImage from '@/assets/images/commodity/pic_default_none.png';
import errImage from '@/assets/images/commodity/pic_default_fail_100.png';

export default {
  name: 'HyImagePanel',
  props: {
    imgSrc: String,
    isHaveVr: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      defaultImage
    };
  },
  computed: {
    ...mapGetters(['host'])
  },
  methods: {
    handleError (event) {
      let img = event.srcElement;
      img.src = errImage;
      img.onerror = null;
    }
  }
};
</script>

<style lang="scss">
.image-panel {
  display: flex;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #bdbdbd;

  &:last-child {
    border-bottom: none;
  }

  .image {
    position: relative;
    flex-grow: 0;
    width: 80px;
    height: 80px;
    overflow: hidden;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;

    img {
      display: inline-block;
      height: 100%;
      vertical-align: middle;
    }
    .vr-label {
      position: absolute;
      top: -2px;
      right: -12px;
      display: flex;
      justify-content: center;
      align-items: flex-end;
      width: 60%;
      height: 30%;
      background-color: #ff7300;
      font-size: 10px;
      font-weight: bold;
      color: #fff;
      transform: rotate(45deg);
    }
  }

  .content {
    position: relative;
    flex-grow: 1;
    min-height: 80px;
    margin-left: 10px;
  }
}
</style>
