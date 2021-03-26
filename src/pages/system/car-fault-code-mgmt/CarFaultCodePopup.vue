<template>
  <biz-popup-tabs :open="open" v-model="tabSelection" @close="close">
    <el-tab-pane label="基本信息" name="0">
      <car-fault-code-info :itemId="itemId" @operationSuccess="operationSuccess"></car-fault-code-info>
    </el-tab-pane>
  </biz-popup-tabs>
</template>

<script>
import { BizPopupTabs } from '@/components/BizPopup';
import CarFaultCodeInfo from './CarFaultCodeInfo';

export default {
  name: 'car-fault-code-popup',
  data() {
    return {
      tabSelection: '0'
    };
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
  components: { BizPopupTabs, CarFaultCodeInfo },
  computed: {},
  watch: {
    open(val) {
      if (val) {
        setTimeout(() => {
          this.tabSelection = '0';
        }, 500);
      }
    }
  },
  methods: {
    close(e) {
      this.$emit('close', e);
    },
    operationSuccess(e) {
      this.$emit('operationSuccess', e);
    }
  }
};
</script>

<style lang="scss">
</style>
