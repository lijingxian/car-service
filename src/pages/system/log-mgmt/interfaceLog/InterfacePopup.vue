<template>
  <biz-popup-tabs :open="open" v-model="activeTabName" @close="close">
    <el-tab-pane label="日志信息" name="0">
      <interface-info :open="open" :id="id" @refreshNotification="refreshNotification"></interface-info>
    </el-tab-pane>
  </biz-popup-tabs>
</template>

<script>
import { BizPopupTabs } from '@/components/BizPopup';
import InterfaceInfo from './InterfaceInfo';

export default {
  name: 'interface-popup',
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
  components: { BizPopupTabs, InterfaceInfo },
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
.interface-popup {
}
</style>
