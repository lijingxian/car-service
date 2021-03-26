<template>
  <div class="image-control">
    <panel-section title="图片内容">
      <biz-avatar-uploader-new :value="selectedEl.url" :show-delete="false" @input="onImageChange"></biz-avatar-uploader-new>
    </panel-section>
  </div>
</template>

<script>
import PanelSection from './PanelSection';
import { BizAvatarUploaderNew } from '@/components/BizForm';
import { mapGetters, mapMutations } from 'vuex';

export default {
  name: 'ImageControl',
  components: {
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
    ...mapGetters('TemplateEditor', ['selectedEl'])
  },
  watch: {},
  created() {},
  methods: {
    ...mapMutations('TemplateEditor', ['updateImg']),
    onImageChange(url) {
      // 加载图片宽高
      let img = new Image();
      img.src = url;
      img.onload = () => {
        this.updateImg(url);
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
