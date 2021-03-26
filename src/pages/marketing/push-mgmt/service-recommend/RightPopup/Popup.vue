<template>
  <biz-popup-tabs :open="open" v-model="tabSelection" @close="close">
    <el-tab-pane label="基本信息" name="0">
      <base-info :itemId="itemId" :position="position" @operationSuccess="operationSuccess"></base-info>
    </el-tab-pane>
    <el-tab-pane label="推送效果" name="1" v-if="this.position==='8'||this.position==='9'||this.position==='10'">
      <recommend-view :itemId="itemId" :position="position" @operationSuccess="operationSuccess"></recommend-view>
    </el-tab-pane>
  </biz-popup-tabs>
</template>

<script>
import { BizPopupTabs } from '@/components/BizPopup';

import BaseInfo from './BaseInfo';
import RecommendView from './RecommendView';

export default {
  name: 'ServiceRecommendPopup',
  components: {
    BizPopupTabs,
    BaseInfo,
    RecommendView
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
    },
    position: {
      type: String
    }
  },
  data() {
    return {
      tabSelection: '0',
      alertId: { id: '' },

      showFailure: true,
      showSign: true
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
      if (!val) {
        this.tabSelection = '0';
      }
    }
  }
};
</script>

<style lang="scss">
</style>
