<template>
  <biz-popup-tabs
    :open="open"
    v-model="tabSelection"
    @close="close"
  >
    <el-tab-pane label="基本信息" name="0">
      <base-info
        :itemId="itemId"
        @operationSuccess="operationSuccess"
      ></base-info>
    </el-tab-pane>
  </biz-popup-tabs>
</template>

<script>
import { BizPopupTabs } from '@/components/BizPopup';
import BaseInfo from './BaseInfo';

export default {
  name: 'KeyWordPopup',
  components: {
    BizPopupTabs,
    BaseInfo
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
      tabSelection: '0',
      alertId: { id: '' },

      showFailure: true,
      showSign: true
    };
  },
  methods: {
    close (e) {
      this.$emit('close', e);
    },
    operationSuccess (e) {
      this.$emit('operationSuccess', e);
    }
  }
};
</script>

<style lang="scss">

</style>
