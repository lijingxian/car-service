<template>
  <biz-popup-tabs :open="open" v-model="activeTabName" @close="close">
    <el-tab-pane label="配送方式" name="shippingMethodInfo">
      <ShippingMethodInfo :obj="obj" @refresh="refresh" @add-success="addSuccess"></ShippingMethodInfo>
    </el-tab-pane>
  </biz-popup-tabs>
</template>

<script>
import { BizPopupTabs } from '@/components/BizPopup';
import ShippingMethodInfo from './ShippingMethodInfo';

export default {
  name: 'ShippingMethodMgmtPopup',
  components: {
    BizPopupTabs,
    ShippingMethodInfo
  },
  props: {
    open: {
      type: Boolean,
      default: false
    },
    obj: Object
  },
  data() {
    return {
      openPopup: false,
      activeTabName: 'shippingMethodInfo'
    };
  },
  computed: {},
  methods: {
    close(e) {
      this.$emit('close', e);
    },
    refresh(e) {
      this.$emit('refresh', e);
    },
    addSuccess(id) {
      this.$emit('add-success', id);
    }
  },
  watch: {}
};
</script>

<style lang="scss">
</style>
