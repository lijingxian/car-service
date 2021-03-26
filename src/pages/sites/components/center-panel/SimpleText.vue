<template>
  <div ref="text" class="simple-text" :style="styleObject">{{comData.content}}</div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';

export default {
  name: 'SimpleText',
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
    content() {
      return this.comData.content;
    },
    styleObject() {
      let style = {
        color: this.comData.color,
        'font-size': this.comData.fontSize / 37.5 + 'rem',
        'letter-spacing': this.comData.letterSpacing / 37.5 + 'rem',
        'line-height': this.comData.lineHeight,
        'text-align': this.comData.textAlign,
        'font-weight': this.comData.fontStyle.some(item => item === 'bold') ? 'bold' : '',
        'font-style': this.comData.fontStyle.some(item => item === 'italic') ? 'italic' : '',
        'text-decoration': this.comData.fontStyle.some(item => item === 'underline') ? 'underline' : ''
      };
      return style;
    }
  },
  watch: {
    content() {
      setTimeout(() => {
        if (this.comData.height !== this.$refs.text.clientHeight) {
          this.updateSimpleTextHeight(this.$refs.text.clientHeight);
        }
      }, 50);
    }
  },
  created() {},
  methods: {
    ...mapMutations('Site', ['updateSimpleTextHeight'])
  }
};
</script>

<style lang="scss">
.simple-text {
  word-break: break-all;
}
</style>
