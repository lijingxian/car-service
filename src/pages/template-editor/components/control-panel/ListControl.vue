<template>
  <div class="list-control">
    <panel-section title="列表样式">
      <control-group label="背景颜色">
        <el-color-picker :show-alpha="true" :value="selectedEl.backgroundColor" @change="onBgColorChange"></el-color-picker>
      </control-group>
      <control-group label="文字颜色">
        <el-color-picker :show-alpha="true" :value="selectedEl.color" @change="onColorChange"></el-color-picker>
      </control-group>
    </panel-section>
  </div>
</template>

<script>
import ControlGroup from './ControlGroup';
import PanelSection from './PanelSection';
import { mapGetters, mapMutations } from 'vuex';

export default {
  name: '',
  data () {
    return {
    };
  },
  components: {
    ControlGroup,
    PanelSection
  },
  computed: {
    ...mapGetters('TemplateEditor', ['selectedEl'])
  },
  watch: {
  },
  mounted() {
  },
  methods: {
    ...mapMutations('TemplateEditor', ['updateColor', 'updateBgColor']),
    onColorChange(color) {
      this.updateColor(color);
    },
    onBgColorChange(color) {
      this.updateBgColor(color);
    }
  }
};
</script>

<style lang="scss">
</style>
