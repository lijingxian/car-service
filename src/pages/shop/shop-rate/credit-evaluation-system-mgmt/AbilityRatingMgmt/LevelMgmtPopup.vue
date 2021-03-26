<template>
  <biz-popup-tabs
    :open="open"
    v-model="tabSelection"
    @close="close"
    >
    <el-tab-pane label="等级信息" name="0">
      <level-base-info
        :itemId="itemId"
        @operationSuccess="operationSuccess"
      ></level-base-info>
    </el-tab-pane>
  </biz-popup-tabs>
</template>

<script>
import { BizPopupTabs } from '@/components/BizPopup';

import LevelBaseInfo from './LevelBaseInfo';

export default {
  name: 'IndicatorMgmtPopup',
  components: {
    BizPopupTabs,
    LevelBaseInfo
  },
  props: {
    open: {
      type: Boolean
    },
    itemId: {
      type: Object,
      default () {
        return {
          id: ''
        };
      }
    }
  },
  data () {
    return {
      tabSelection: '0'
    };
  },
  methods: {
    close (e) {
      this.$emit('close', e);
    },
    operationSuccess (e) {
      this.$emit('operationSuccess', e);
    }
  },
  watch: {
    open (val) {
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
