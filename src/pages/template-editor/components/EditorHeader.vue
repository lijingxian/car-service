<template>
  <div class="template-editor-header">
    <div class="header-left">
      <el-button size="mini" type="primary" @click="onSave">保存</el-button>
      <el-button v-if="pageType !== 'prize' && pageType !== 'share'" size="mini" @click="onPreview">预览</el-button>
    </div>
    <div class="header-right">
      <el-radio-group :value="value" size="mini" @input="modeChange">
        <el-radio-button label="vertical">纵版</el-radio-button>
        <el-radio-button label="horizontal">横版</el-radio-button>
      </el-radio-group>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'TemplateEditorHeader',
  props: {
    value: {
      type: String,
      default: 'vertical'
    }
  },
  data () {
    return {};
  },
  components: {
  },
  computed: {
    ...mapGetters('TemplateEditor', ['pageType'])
  },
  watch: {
  },
  mounted() {
  },
  methods: {
    onPreview() {
      this.$emit('preview');
    },
    onSave() {
      this.$emit('save');
    },
    modeChange(val) {
      this.$emit('input', val);
    }
  }
};
</script>

<style lang="scss">
.template-editor-header {
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #fff;
}
</style>
