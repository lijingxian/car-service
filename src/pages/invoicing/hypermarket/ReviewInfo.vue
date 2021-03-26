<template>
  <biz-grid>
    <iframe :src="'resources/admin/ecStatic/index.html?#/vshop/goods/'+itemId+'?onlyComment=true&shopId='+getUser.shop.id"
      frameborder="0" scrolling="no" width="100%" height="100%" id="reviewIframe"></iframe>
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
  mounted() {
    console.log('1111');
  },
  watch: {
    open(nVal, oVal) {
      if (nVal) {
        setTimeout(() => {
          console.log(document.getElementById('reviewIframe').contentWindow.document.getElementsByClassName('cube-scroll-wrapper'));
          document.getElementById('reviewIframe').contentWindow.document.getElementsByClassName('cube-scroll-content')[0].style.height =
            '100%';
          document
            .getElementById('reviewIframe')
            .contentWindow.document.getElementsByClassName('cube-scroll-wrapper')[0].style.background = '#ffffff';
          document
            .getElementById('reviewIframe')
            .contentWindow.document.getElementsByClassName('cube-scroll-content')[0].children[0].style.height = '100%';
          document
            .getElementById('reviewIframe')
            .contentWindow.document.getElementsByClassName('cube-scroll-content')[0].children[0].style.overflow = 'auto';
        }, 1000);
      }
    }
  }
};
</script>
<style lang="scss">
</style>
