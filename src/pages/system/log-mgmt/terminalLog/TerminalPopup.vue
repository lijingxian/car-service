<template>
  <biz-popup-tabs :open="open" v-model="activeTabName" @close="close">
    <el-tab-pane label="日志信息" name="0">
      <terminal-info :open="open" :id="id" @refreshNotification="refreshNotification"></terminal-info>
    </el-tab-pane>
  </biz-popup-tabs>
</template>

<script>
import { BizPopupTabs } from '@/components/BizPopup';
import TerminalInfo from './TerminalInfo';

export default {
  name: 'terminal-popup',
  data() {
    return {
      activeTabName: '0'
    };
  },
  props: {
    open: {
      type: Boolean
    },
    id: {
      type: String,
      default() {
        return '';
      }
    }
  },
  components: { BizPopupTabs, TerminalInfo },
  computed: {},
  watch: {},
  methods: {
    close(e) {
      this.$emit('close', e);
    },
    refreshNotification(e) {
      this.$emit('refreshNotification', e);
    }
  }
};
</script>

<style lang="scss">
.terminal-popup {
}
</style>
