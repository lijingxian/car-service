<template>
  <biz-popup-tabs :open="open" v-model="activeTabName" @close="close">
    <el-tab-pane label="小程序设置" name="insuranceCompanyInfo">
      <MiniProgramInfo :open="open" :id="id" @refreshNotification="refreshNotification" @addSuccessNotification="addSuccessNotification">
      </MiniProgramInfo>
    </el-tab-pane>
  </biz-popup-tabs>
</template>

<script>
import { BizPopupTabs } from '@/components/BizPopup';
import MiniProgramInfo from './MiniProgramInfo';

export default {
  name: 'MiniProgramMgmtPopup',
  components: {
    BizPopupTabs,
    MiniProgramInfo
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
      activeTabName: 'insuranceCompanyInfo'
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
