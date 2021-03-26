<template>
  <div class="site-image">
    <img :src="comData.src.url " @click="onClick"/>
  </div>
</template>

<script>
export default {
  name: 'ImageCom',
  components: {},
  props: { comData: {} },
  data() {
    return {};
  },
  computed: {},
  watch: {},
  created() {},
  methods: {
    onClick() {
      if (this.comData.content) {
        location.href = this.comData.content;
        // window.open(this.comData.content);
      }
    }
  }
};
</script>

<style lang="scss">
.site-image {
  width: 100%;
  height: 100%;
  img {
    width: 100%;
    height: 100%;
  }
}
</style>
