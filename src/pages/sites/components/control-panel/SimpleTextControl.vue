<template>
  <div class="simple-text-control">
    <panel-section title="文字内容">
      <control-group label="文案">
        <el-input type="textarea" :rows="2" placeholder="请输入内容" :value="selectedCom.content" @input="onInput"></el-input>
      </control-group>
    </panel-section>
    <panel-section title="样式">
      <control-group label="文字">
        <el-color-picker :show-alpha="true" :value="selectedCom.color" @change="onColorChange"></el-color-picker>
        <label-input label="字号" :value="selectedCom.fontSize" @input="onFontSizeChange"></label-input>
        <el-checkbox-group size="small" :value="selectedCom.fontStyle" @input="onFontStyleChange">
          <el-checkbox-button label="bold">B</el-checkbox-button>
          <el-checkbox-button label="italic">I</el-checkbox-button>
          <el-checkbox-button label="underline">U</el-checkbox-button>
        </el-checkbox-group>
      </control-group>
      <control-group label="排列">
        <label-input label="字间距" :value="selectedCom.letterSpacing" @input="onLetterSpacingChange" :min="0" :max="10"></label-input>
        <label-input label="行高" :value="selectedCom.lineHeight" @input="onLineHeightChange" :min="1" :max="10"></label-input>
      </control-group>
    </panel-section>
    <panel-section title="布局">
      <control-group label="位置">
        <label-input label="横轴" :value="selectedCom.x" @input="onXChange" :min="0" :max="360"></label-input>
        <label-input label="纵轴" :value="selectedCom.y" @input="onYChange" :min="0" :max="10000"></label-input>
      </control-group>
      <control-group label="尺寸">
        <label-input label="宽度" :value="selectedCom.width" @input="onWidthChange" :min="1" :max="400"></label-input>
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
  props: {},
  data() {
    return {};
  },
  computed: {
    ...mapGetters('Site', ['selectedCom'])
  },
  watch: {},
  created() {},
  methods: {
    ...mapMutations('Site', [
      'updateSimpleTextColor',
      'updateSimpleTextContent',
      'updateSimpleTextFontSize',
      'updateSimpleTextFontStyle',
      'updateSimpleTextLetterSpacing',
      'updateSimpleTextLineHeight',
      'updateComX',
      'updateComY',
      'updateComWidth'
    ]),
    onInput(value) {
      this.updateSimpleTextContent(value);
    },
    onColorChange(color) {
      this.updateSimpleTextColor(color);
    },
    onFontSizeChange(size) {
      this.updateSimpleTextFontSize(size);
    },
    onFontStyleChange(value) {
      this.updateSimpleTextFontStyle(value);
    },
    onLetterSpacingChange(value) {
      this.updateSimpleTextLetterSpacing(value);
    },
    onLineHeightChange(value) {
      this.updateSimpleTextLineHeight(value);
    },
    onXChange(value) {
      this.updateComX(value);
    },
    onYChange(value) {
      this.updateComY(value);
    },
    onWidthChange(value) {
      this.updateComWidth({ width: value });
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
