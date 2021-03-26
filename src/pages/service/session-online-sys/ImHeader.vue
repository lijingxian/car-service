<template>
  <div class="im-header">
    <div class="title">
      {{ activatedRoom.name||'' }}
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'ImHeader',
  data() {
    return {};
  },
  created() {},
  components: {},
  computed: {
    ...mapGetters('CustomService', ['activatedRoom'])
  },
  methods: {}
};
</script>

<style lang="scss">
.im-header {
  width: 777px;
  height: 50px;
  border-bottom: 1px solid #e2e2e2;
  display: flex;
  align-items: center;
  background-color: #f8f8f8;
  color: #787878;
  > .title {
    margin-left: 20px;
  }
}
</style>
