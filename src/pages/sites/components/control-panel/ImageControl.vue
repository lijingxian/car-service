<template>
  <div class="image-control">
    <panel-section title="图片内容">
      <biz-avatar-uploader-new :value="selectedCom.src.url" :show-delete="false" @input="onImageChange"></biz-avatar-uploader-new>
    </panel-section>
    <panel-section title="图片链接">
      <control-group label="点击链接">
        <el-input placeholder="请输入链接" :value="selectedCom.content" @input="onInput"></el-input>
      </control-group>
    </panel-section>
    <panel-section title="布局">
      <control-group label="位置">
        <label-input label="横轴" :value="selectedCom.x" @input="onXChange" :min="0" :max="360"></label-input>
        <label-input label="纵轴" :value="selectedCom.y" @input="onYChange" :min="0" :max="10000"></label-input>
      </control-group>
      <control-group label="尺寸">
        <label-input label="宽度" :value="selectedCom.width" @input="onWidthChange" :min="1" :max="1000"></label-input>
        <label-input label="高度" :value="selectedCom.height" @input="onHeightChange" :min="1" :max="10000"></label-input>
      </control-group>
    </panel-section>
  </div>
</template>

<script>
import ControlGroup from './ControlGroup';
import PanelSection from './PanelSection';
import LabelInput from './LabelInput';
import { BizAvatarUploaderNew } from '@/components/BizForm';
import { mapGetters, mapMutations } from 'vuex';

export default {
  name: 'SimpleTextControl',
  components: {
    LabelInput,
    ControlGroup,
    PanelSection,
    BizAvatarUploaderNew
  },
  props: {},
  data() {
    return {
      src: ''
    };
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
      'updateComWidth',
      'updateComHeight',
      'updateComImageSrc'
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
    },
    onHeightChange(value) {
      this.updateComHeight({ height: value });
    },
    onImageChange(url) {
      // 加载图片宽高
      let img = new Image();
      img.src = url;
      img.onload = () => {
        this.updateComImageSrc({
          url,
          width: img.width,
          height: img.height
        });
      };
    }
  }
};
</script>

<style lang="scss">
.image-control {
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
