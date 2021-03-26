<template>
  <biz-popup-tabs
    :open="open"
    v-model="tabSelection"
    @close="close"
  >
    <el-tab-pane label="基本信息" name="0">
      <supplier-base-info
        :itemId="itemId"
        :isEdit="isEdit"
        @operationSuccess="operationSuccess"
      ></supplier-base-info>
    </el-tab-pane>
    <el-tab-pane label="采购记录" name="1">
      <purchase-info
        :itemId="itemId"
        @operationSuccess="operationSuccess"
      ></purchase-info>
    </el-tab-pane>
  </biz-popup-tabs>
</template>

<script>
import { BizPopupTabs } from '@/components/BizPopup';
import SupplierBaseInfo from './SupplierBaseInfo';
import PurchaseInfo from './PurchaseInfo';

export default {
  name: 'SupplierPopup',
  components: {
    BizPopupTabs,
    SupplierBaseInfo,
    PurchaseInfo
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
    },
    isEdit: {
      type: Boolean,
      default () {
        return true;
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
  },
  watch: {
    open(val) {
      if (!val) {
        this.tabSelection = '0';
      }
    }
  }
};
</script>

<style lang="scss">

</style>
