<template>
  <biz-popup-tabs
    :open="open"
    v-model="tabSelection"
    @close="close"
  >
    <el-tab-pane label="基本信息" name="0">
      <settlement-account-base-info
        :itemId="itemId"
        @operationSuccess="operationSuccess"
      ></settlement-account-base-info>
    </el-tab-pane>
  </biz-popup-tabs>
</template>

<script>
import { BizPopupTabs } from '@/components/BizPopup';
import SettlementAccountBaseInfo from './SettlementAccountBaseInfo';

export default {
  name: 'SettlementAccountPopup',
  components: {
    BizPopupTabs,
    SettlementAccountBaseInfo
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
