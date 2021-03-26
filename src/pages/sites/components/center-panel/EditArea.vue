<template>
  <div class="edit-area">
    <site-page></site-page>
  </div>
</template>

<script>
import SitePage from './SitePage';

export default {
  name: 'EditArea',
  components: {
    SitePage
  },
  props: {},
  data() {
    return {};
  },
  computed: {},
  watch: {},
  created() {},
  methods: {}
};
</script>

<style lang="scss">
.edit-area {
  position: relative;
  width: 100%;
}
</style>
