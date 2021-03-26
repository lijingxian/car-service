<template>
  <biz-popup-tabs
    :open="open"
    v-model="tabSelection"
    @close="close"
  >
    <el-tab-pane label="基本信息" name="0">
      <agent-base-info
        :itemId="itemId"
        @operationSuccess="operationSuccess"
      ></agent-base-info>
    </el-tab-pane>
    <el-tab-pane label="代理商品" name="1">
      <agent-product-info
        :itemId="itemId"
        @operationSuccess="operationSuccess"
      ></agent-product-info>
    </el-tab-pane>
    <el-tab-pane label="销售记录" name="2">
      <sales-info
        :itemId="itemId"
        @operationSuccess="operationSuccess"
      ></sales-info>
    </el-tab-pane>
  </biz-popup-tabs>
</template>

<script>
import { BizPopupTabs } from '@/components/BizPopup';
import AgentBaseInfo from './AgentBaseInfo';
import AgentProductInfo from './AgentProductInfo';
import SalesInfo from './SalesInfo';

export default {
  name: 'SupplierPopup',
  components: {
    BizPopupTabs,
    AgentBaseInfo,
    AgentProductInfo,
    SalesInfo
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
