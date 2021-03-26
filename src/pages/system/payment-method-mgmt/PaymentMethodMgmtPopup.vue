<template>
  <biz-popup-tabs :open="open" v-model="activeTabName" @close="close">
    <el-tab-pane label="支付方式配置" name="paymentMethodInfo">
      <PaymentMethodInfo :open="open" :id="id" @refreshNotification="refreshNotification">
      </PaymentMethodInfo>
    </el-tab-pane>
  </biz-popup-tabs>
</template>

<script>
import { BizPopupTabs } from '@/components/BizPopup';
import PaymentMethodInfo from './PaymentMethodInfo';

export default {
  name: 'PaymentMethodMgmtPopup',
  components: {
    BizPopupTabs,
    PaymentMethodInfo
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
      activeTabName: 'paymentMethodInfo'
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
