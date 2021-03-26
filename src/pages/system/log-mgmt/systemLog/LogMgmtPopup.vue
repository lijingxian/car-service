<template>
  <biz-popup-tabs :open="open" v-model="activeTabName" @close="close">
    <el-tab-pane label="日志信息" name="logInfo">
      <LogInfo :open="open" :id="id" @refreshNotification="refreshNotification">
      </LogInfo>
    </el-tab-pane>
  </biz-popup-tabs>
</template>

<script>
import { BizPopupTabs } from '@/components/BizPopup';
import LogInfo from './LogInfo';

export default {
  name: 'LogMgmtPopup',
  components: {
    BizPopupTabs,
    LogInfo
  },
  props: {
    open: {
      type: Boolean,
      default: false
    },
    id: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      openPopup: false,
      activeTabName: 'logInfo'
    };
  },
  computed: {},
  methods: {
    close(e) {
      this.$emit('close', e);
    },
    refreshNotification(e) {
      this.$emit('refreshNotification', e);
    }
  },
  watch: {}
};
</script>

<style lang="scss">
</style>
