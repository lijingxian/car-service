<template>
  <el-button class="btn-com" type="primary" :style="styleObject" round @click="onClick">{{comData.label}}</el-button>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'BtnCom',
  components: {},
  props: {
    comData: {}
  },
  data() {
    return {
      data: {}
    };
  },
  computed: {
    ...mapGetters('Site', ['selectedCom']),
    styleObject() {
      let style = {
        color: this.comData.color,
        'font-size': this.comData.fontSize / 37.5 + 'rem',
        backgroundColor: this.comData.backgroundColor,
        'border-radius': this.comData.borderRadius / 37.5 + 'rem'
      };
      return style;
    }
  },
  watch: {},
  created() {},
  methods: {
    onClick() {
      if (this.comData.content) {
        location.href = this.comData.content;
      }
    }
  }
};
</script>

<style lang="scss">
.btn-com {
  width: 100%;
  height: 100%;
  border: none;
  display: block;
}
</style>
