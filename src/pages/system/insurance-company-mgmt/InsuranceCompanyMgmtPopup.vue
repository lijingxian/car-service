<template>
  <biz-popup-tabs :open="open" v-model="activeTabName" @close="close">
    <el-tab-pane label="保险公司信息" name="insuranceCompanyInfo">
      <InsuranceCompanyInfo :open="open" :id="id" @refreshNotification="refreshNotification" @addSuccessNotification="addSuccessNotification">
      </InsuranceCompanyInfo>
    </el-tab-pane>
  </biz-popup-tabs>
</template>

<script>
import { BizPopupTabs } from '@/components/BizPopup';
import InsuranceCompanyInfo from './InsuranceCompanyInfo';

export default {
  name: 'InsuranceCompanyMgmtPopup',
  components: {
    BizPopupTabs,
    InsuranceCompanyInfo
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
