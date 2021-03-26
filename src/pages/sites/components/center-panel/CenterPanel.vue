<template>
  <div class="s-center-panel">
    <div class="top-blank"></div>
    <edit-area></edit-area>
    <div class="bottom-blank"></div>
  </div>
</template>

<script>
import EditArea from './EditArea';

export default {
  name: 'CentePanel',
  components: {
    EditArea
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
.s-center-panel {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow-y: auto;
  .bottom-blank,
  .top-blank {
    height: 85px;
  }
}
</style>
