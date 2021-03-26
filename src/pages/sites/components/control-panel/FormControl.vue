<template>
  <div class="form-control">
    <panel-section title="表单内容">
      <control-group label="字段名称">
        <label-string
          :label="element.keyType"
          :value="element.label"
          v-for="(element, index) in selectedCom.formData.elements"
          :key="index"
          @input="onLabelChange(index,$event)"
        ></label-string>
      </control-group>
      <control-group label="提交按钮">
        <label-string label="按钮文字" :value="selectedCom.formData.submitText" @input="onSubmitTextChange"></label-string>
        <label-string label="成功提示文字" :value="selectedCom.successTip" @input="onSuccessTipChange"></label-string>
      </control-group>
    </panel-section>
    <panel-section title="表单样式">
      <control-group label="背景颜色">
        <el-color-picker :show-alpha="true" :value="selectedCom.backgroundColor" @change="onBColorChange"></el-color-picker>
      </control-group>
    </panel-section>
    <panel-section title="按钮样式">
      <control-group label="文字">
        <el-color-picker :show-alpha="true" :value="selectedCom.buttonForeColor" @change="onButtonForeColorChange"></el-color-picker>
      </control-group>
      <control-group label="背景">
        <el-color-picker :show-alpha="true" :value="selectedCom.buttonBackColor" @change="onButtonBackColorChange"></el-color-picker>
      </control-group>
    </panel-section>
    <panel-section title="布局">
      <control-group label="位置">
        <label-input label="横轴" :value="selectedCom.x" @input="onXChange" :min="0" :max="360"></label-input>
        <label-input label="纵轴" :value="selectedCom.y" @input="onYChange" :min="0" :max="10000"></label-input>
      </control-group>
    </panel-section>
  </div>
</template>

<script>
import ControlGroup from './ControlGroup';
import PanelSection from './PanelSection';
import LabelInput from './LabelInput';
import LabelString from './LabelString';
import { mapGetters, mapMutations } from 'vuex';

export default {
  name: 'SimpleTextControl',
  components: {
    LabelInput,
    LabelString,
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
      'updateComFormLabel',
      'updateComFormSubmitText',
      'updateComFormSuccessTip',
      'updateComBackgroundColor',
      'updateComFormButtonForceColor',
      'updateComFormButtonBackColor',
      'updateComX',
      'updateComY'
    ]),
    onLabelChange(index, value) {
      this.updateComFormLabel({ index, label: value });
    },
    onSubmitTextChange(value) {
      this.updateComFormSubmitText(value);
    },
    onSuccessTipChange(value) {
      this.updateComFormSuccessTip(value);
    },
    onBColorChange(color) {
      this.updateComBackgroundColor(color);
    },
    onButtonForeColorChange(color) {
      this.updateComFormButtonForceColor(color);
    },
    onButtonBackColorChange(color) {
      this.updateComFormButtonBackColor(color);
    },
    onInput(value) {
      this.updateSimpleTextContent(value);
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
.form-control {
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
