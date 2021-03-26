<template>
  <div class="brick-control">
    <panel-section title="模块背景">
      <control-group label="选择">
        <el-radio-group :value="bgType" @input="onBgTypeChange">
          <el-radio-button label="使用颜色"></el-radio-button>
          <el-radio-button label="使用图片"></el-radio-button>
        </el-radio-group>
        <div class="color-image">
          <el-color-picker :show-alpha="true" v-show="selectedEl.bgType==='color'" :value="selectedEl.bgColor" @change="onColorChange"></el-color-picker>
          <biz-avatar-uploader-new v-show="selectedEl.bgType==='image'" :value="selectedEl.bgImage" @input="onImageChange"></biz-avatar-uploader-new>
        </div>
      </control-group>
    </panel-section>
  </div>
</template>

<script>
import ControlGroup from './ControlGroup';
import PanelSection from './PanelSection';
import { BizAvatarUploaderNew } from '@/components/BizForm';
import { mapGetters, mapMutations } from 'vuex';

export default {
  name: 'BrickControl',
  components: {
    BizAvatarUploaderNew,
    ControlGroup,
    PanelSection
  },
  props: {},
  data() {
    return {
      color: 'rgba(92, 34, 34, 1)',
      image: '',
      num: '1'
    };
  },
  computed: {
    ...mapGetters('TemplateEditor', ['selectedEl']),
    bgType() {
      if (this.selectedEl.bgType === 'color') {
        return '使用颜色';
      } else if (this.selectedEl.bgType === 'image') {
        return '使用图片';
      }
      return '';
    }
  },
  watch: {},
  created() {},
  methods: {
    ...mapMutations('TemplateEditor', ['updateBrickBgType', 'updateBrickBgColor', 'updateBrickBgImage']),
    onBgTypeChange(value) {
      // console.log(value);
      if (value === '使用图片') {
        this.updateBrickBgType('image');
      } else if (value === '使用颜色') {
        this.updateBrickBgType('color');
      }
    },
    onColorChange(color) {
      this.updateBrickBgColor(color);
    },
    onImageChange(imgUrl) {
      this.updateBrickBgImage(imgUrl);
    }
  }
};
</script>

<style lang="scss">
.brick-control {
  width: 100%;
  .el-radio-button__inner {
    padding: 10px 6px;
    width: 96px;
  }
  .color-image {
    margin-top: 16px;
    .el-color-picker__trigger {
      width: 100px;
    }
  }
}
</style>
