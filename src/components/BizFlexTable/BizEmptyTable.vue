<!-- 空白表格填充图片 -->
<template>
  <div class="biz-empty-table" :style="emptyStyle">
  </div>
</template>

<script>
import EmptyImg from '@/assets/images/emptyGray.png';

export default {
  name: '',
  data () {
    return {
      EmptyImg: EmptyImg
    };
  },
  components: {
  },
  computed: {
    emptyStyle() {
      return {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        margin: 'auto',
        background: 'url(' + EmptyImg + ') 50% 50% / auto 200px no-repeat'
      };
    }
  },
  methods: {
  },
  mounted() {
  }
};
</script>

<style lang="scss">
</style>
