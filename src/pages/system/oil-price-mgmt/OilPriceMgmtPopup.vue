<template>
  <biz-popup-tabs :open="open" v-model="activeTabName" @close="close">
    <el-tab-pane label="油价表" name="oilPriceInfo">
      <OilPriceInfo :open="open" :id="id" @refreshNotification="refreshNotification" @addSuccessNotification="addSuccessNotification">
      </OilPriceInfo>
    </el-tab-pane>
  </biz-popup-tabs>
</template>

<script>
import { BizPopupTabs } from '@/components/BizPopup';
import OilPriceInfo from './OilPriceInfo';

export default {
  name: 'OilPriceMgmtPopup',
  components: {
    BizPopupTabs,
    OilPriceInfo
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
      activeTabName: 'oilPriceInfo'
    };
  },
  computed: {},
  methods: {
    close(e) {
      this.$emit('close', e);
    },
    refreshNotification(e) {
      this.$emit('refreshNotification', e);
    },
    addSuccessNotification(e) {
      this.$emit('addSuccessNotification', e);
    }
  },
  watch: {}
};
</script>

<style lang="scss">
</style>
