<template>
  <div class="not-found" :style="styleObject">
  </div>
</template>

<script>
import NotFound from '@/assets/images/404Grey.png';

export default {
  name: 'NotFound',
  data() {
    return {
      styleObject: {
        background: 'url(' + NotFound + ') 50% 50% / auto 200px no-repeat'
      }
    };
  },
  components: {},
  methods: {}
};
</script>
<style type='scss'>
.not-found {
    font-size: 300px;
    width: 100%;
}
</style>
