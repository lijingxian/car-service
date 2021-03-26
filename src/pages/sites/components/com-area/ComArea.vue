<template>
  <div class="com-area">
    <com-menu></com-menu>
    <com-list></com-list>
  </div>
</template>

<script>
import ComList from './ComList';
import ComMenu from './ComMenu';

export default {
  name: 'ComArea',
  components: {
    ComList,
    ComMenu
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
.com-area {
  display: flex;
  width: 400px;
  height: 100%;
  background-color: #fafafa;
  box-shadow: 0 12px 12px 0 rgba(0, 0, 0, 0.1);
}
</style>
