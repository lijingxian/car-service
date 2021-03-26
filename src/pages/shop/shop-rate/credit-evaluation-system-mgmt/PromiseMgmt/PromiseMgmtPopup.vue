<template>
  <biz-popup-tabs
    :open="open"
    v-model="tabSelection"
    @close="close"
    >
    <el-tab-pane label="承诺信息" name="0">
      <promise-base-info
        :itemId="itemId"
        @operationSuccess="operationSuccess"
      ></promise-base-info>
    </el-tab-pane>
  </biz-popup-tabs>
</template>

<script>
import { BizPopupTabs } from '@/components/BizPopup';

import PromiseBaseInfo from './PromiseBaseInfo';
// import PromiseBaseInfo from '../../shop-evaluation/ShopEvaluation';  // 测试用

export default {
  name: 'PromiseMgmtPopup',
  components: {
    BizPopupTabs,
    PromiseBaseInfo
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
      tabSelection: '0'
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
    open (val) {
      if (val) {
        setTimeout(() => {
          this.tabSelection = '0';
        }, 500);
      }
    }
  }
};
</script>

<style lang="scss">

</style>
