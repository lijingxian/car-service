<template>
  <el-button class="tel-com" type="primary" :style="styleObject" round @click="onClick">{{comData.label}}</el-button>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'TelCom',
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
      let link = document.createElement('a');
      link.setAttribute('href', 'tel:' + this.comData.content);
      let evt = document.createEvent('MouseEvents');
      evt.initMouseEvent('click', true, true);
      link.dispatchEvent(evt);
    }
  }
};
</script>

<style lang="scss">
.tel-com {
  width: 100%;
  height: 100%;
  border: none;
  display: block;
}
</style>
