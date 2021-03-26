<template>
  <biz-popup-tabs :open="open" v-model="tabSelection" @close="close">
    <el-tab-pane label="意向设置" name="0">
      <intention-setting :itemId="itemId" @operationSuccess="operationSuccess"></intention-setting>
    </el-tab-pane>
    <el-tab-pane label="回访设置" name="1">
      <callback-setting :itemId="itemId" @operationSuccess="operationSuccess"></callback-setting>
    </el-tab-pane>
    <el-tab-pane label="线索设置" name="2">
      <clue-setting :itemId="itemId" @operationSuccess="operationSuccess"></clue-setting>
    </el-tab-pane>
    <el-tab-pane label="渠道设置" name="3">
      <channel-setting :itemId="itemId" @operationSuccess="operationSuccess"></channel-setting>
    </el-tab-pane>
  </biz-popup-tabs>
</template>

<script>
import { BizPopupTabs } from '@/components/BizPopup';

import CallbackSetting from './CallbackSetting';
import ChannelSetting from './ChannelSetting';
import ClueSetting from './ClueSetting';
import IntentionSetting from './IntentionSetting';
export default {
  name: 'CallbackSettingPopup',
  components: {
    BizPopupTabs,
    CallbackSetting,
    IntentionSetting,
    ClueSetting,
    ChannelSetting
  },
  props: {
    open: {
      type: Boolean
    },
    itemId: {
      type: Object,
      default() {
        return {
          id: ''
        };
      }
    }
  },
  data() {
    return {
      tabSelection: '0'
    };
  },
  methods: {
    close(e) {
      this.$emit('close', e);
    },
    operationSuccess(e) {
      this.$emit('operationSuccess', e);
    }
  },
  watch: {
    open(val) {
      if (val) {
        setTimeout(() => {
          this.tabSelection = '0';
        }, 500);
      }
    }
  }
};
</script>

<style lang="scss">
</style>
