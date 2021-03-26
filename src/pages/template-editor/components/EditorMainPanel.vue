<template>
  <div class="editor-main-panel" :class="mode === 'vertical' ? 'is-vertical' : 'is-horizontal'">
    <component :is="templateType" :type="pageType" :mode="mode" @select-el="handleSelectEl" />
    <el-dialog :visible.sync="dialogVisible" :show-close="false" width="1000px" center :modal-append-to-body="false">
      <el-radio-group v-model="previewMode" size="mini">
        <el-radio-button label="vertical">纵版</el-radio-button>
        <el-radio-button label="horizontal">横版</el-radio-button>
      </el-radio-group>
      <div class="preview-container" :class="previewMode">
        <component :is="templateType" :type="pageType" :mode="previewMode" />
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';

export default {
  props: {
    activityType: {
      type: String,
      default: '0'
    },
    pageType: {
      type: String,
      default: '0'
    },
    mode: {
      type: String,
      default: 'vertical'
    }
  },
  data () {
    return {
      previewMode: 'vertical',
      dialogVisible: false
    };
  },
  components: {
  },
  computed: {
    templateType() {
      if (this.pageType === 'prize') return () => import('../templates/Prize.vue');
      if (this.pageType === 'share') return () => import('../templates/Share.vue');
      if (!this.activityType) return '';
      // '0': 抢红包, '1': 摇一摇, '2': 抽奖, '3': 拼团购, '4': N元抢购, '5': 限时秒杀, '6': 帮砍价, '7': TJYL, '8': FXYL, '9': 招募活动, '11': 潜客活动
      const componentPath = {
        '0': 'RedPacket.vue',
        '1': 'Shake.vue',
        '2': 'Lottery.vue'
      };
      const index = () => import('../templates/' + componentPath[this.activityType]);
      return index;
    }
  },
  watch: {
  },
  mounted() {
  },
  methods: {
    ...mapMutations('TemplateEditor', ['updateSelectedType', 'updateSelectedEl']),
    handleSelectEl(el, type) {
      this.updateSelectedEl(el);
      this.updateSelectedType(type);
    },
    preview() {
      this.previewMode = 'vertical';
      this.dialogVisible = true;
    }
  }
};
</script>

<style lang="scss">
.editor-main-panel {
  background-color: #fff;
  &.is-vertical {
    width: 375px;
    height: 650px;
  }
  &.is-horizontal {
    width: 1080px;
    height: 595px;
  }
  .el-dialog__wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .el-dialog {
    margin: 0 !important;
  }
  .el-dialog__body {
    display: flex;
    flex-direction: column;
    align-items: center;
    .el-radio-group {
      margin-bottom: 20px;
    }
  }
  .preview-container {
    overflow: hidden;
    &.vertical {
      width: 375px;
      height: 650px;
    }
    &.horizontal {
      width: 720px;
      height: 400px;
    }
  }
}
</style>
