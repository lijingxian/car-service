<template>
  <biz-grid>
    <iframe
      :src="'resources/admin/ecStatic/index.html?#/vshop/goods/'+itemId+'?onlyDetail=true&shopId='+getUser.shop.id"
      frameborder="0"
      scrolling="no"
      width="100%"
      height="99%"
      id="iframe"
    ></iframe>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import { mapGetters } from 'vuex';
export default {
  components: {
    BizGrid
  },
  computed: {
    ...mapGetters(['getUser'])
  },
  props: {
    itemId: {
      type: String,
      default: ''
    },
    open: {
      type: Boolean,
      default() {
        return false;
      }
    }
  },
  watch: {
    open(nVal, oVal) {
      if (nVal) {
        setTimeout(() => {
          console.log(
            'product' + document.getElementById('iframe').contentWindow.document.getElementsByClassName('cube-scroll-wrapper')
          );
          document
            .getElementById('iframe')
            .contentWindow.document.getElementsByClassName('cube-scroll-wrapper')[0].style.background = '#ffffff';
          document
            .getElementById('iframe')
            .contentWindow.document.getElementsByClassName('cube-scroll-wrapper')[0].style.overflow = 'auto';
        }, 1000);
      }
    }
  }
};
</script>
<style lang="scss">
</style>
