<template>
  <div class="simple-text-control">
    <panel-section title="文字内容" v-if="showContent">
      <control-group label="文案">
        <el-input type="textarea" :rows="2" placeholder="请输入内容" :value="selectedEl.content" @input="onInput"></el-input>
      </control-group>
    </panel-section>
    <panel-section title="样式" v-if="!noStyle">
      <control-group label="文字">
        <el-color-picker :show-alpha="true" :value="selectedEl.color" @change="onColorChange"></el-color-picker>
        <label-input label="字号" :value="fontSize" @input="onFontSizeChange"></label-input>
      </control-group>
    </panel-section>
  </div>
</template>

<script>
import ControlGroup from './ControlGroup';
import PanelSection from './PanelSection';
import LabelInput from './LabelInput';
import { mapGetters, mapMutations } from 'vuex';

export default {
  name: 'SimpleTextControl',
  components: {
    LabelInput,
    ControlGroup,
    PanelSection
  },
  props: {
    showContent: {
      type: Boolean,
      default: false
    },
    noStyle: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {};
  },
  computed: {
    ...mapGetters('TemplateEditor', ['selectedEl']),
    fontSize() {
      if (!this.selectedEl) return 0;
      if (/px/.test(this.selectedEl.fontSize)) {
        return Number(this.selectedEl.fontSize.slice(0, -2));
      }
      return Number(this.selectedEl.fontSize);
    }
  },
  watch: {},
  created() {},
  methods: {
    ...mapMutations('TemplateEditor', ['updateColor', 'updateFontSize', 'updateTxtContent']),
    onInput(value) {
      this.updateTxtContent(value);
    },
    onColorChange(color) {
      this.updateColor(color);
    },
    onFontSizeChange(size) {
      this.updateFontSize(`${size}px`);
    }
  }
};
</script>

<style lang="scss">
.simple-text-control {
  width: 100%;
  .el-color-picker__trigger {
    width: 100px;
    margin-right: 10px;
  }
  .el-checkbox-group {
    margin-top: 10px;
  }
  .el-button {
    width: 100%;
  }
}
</style>
