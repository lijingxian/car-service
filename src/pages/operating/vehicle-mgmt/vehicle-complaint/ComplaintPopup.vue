<template>
  <biz-popup-tabs :open="open" v-model="tabSelection" @close="close">
    <el-tab-pane label="基本信息" name="0">
      <accused-info :itemId="itemId" @operationSuccess="operationSuccess"></accused-info>
    </el-tab-pane>
    <el-tab-pane label="被诉人信息" name="1">
      <complaint-base-info :itemId="itemId"></complaint-base-info>
    </el-tab-pane>
  </biz-popup-tabs>
</template>

<script>
import { BizPopupTabs } from '@/components/BizPopup';
import AccusedInfo from './AccusedInfo';
import ComplaintBaseInfo from './ComplaintBaseInfo';

export default {
  name: 'complaint-popup',
  components: {
    BizPopupTabs,
    AccusedInfo,
    ComplaintBaseInfo
  },
  props: {
    open: {
      type: Boolean
    },
    itemId: {
      type: String,
      default() {
        return '';
      }
    }
  },
  data() {
    return {
      tabSelection: '0'
    };
  },
  methods: {
    operationSuccess(e) {
      this.$emit('operationSuccess', e);
    },
    close(e) {
      this.$emit('close', e);
    }
  },
  watch: {
    open(val) {},
    tabSelection(nVal) {}
  }
};
</script>

<style lang="scss">
</style>
