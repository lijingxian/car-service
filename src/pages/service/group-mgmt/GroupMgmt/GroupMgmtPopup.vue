<template>
  <biz-popup-tabs
    :open="open"
    v-model="tabSelection"
    @close="close"
    >
    <el-tab-pane label="基本信息" name="0" v-if="!isService">
      <tag-class-base-info
        :itemId="itemId"
        @operationSuccess="operationSuccess"
      ></tag-class-base-info>
    </el-tab-pane>
    <el-tab-pane label="客服基本信息" name="0" v-if="isService">
      <service-base-info
        :itemId="itemId"
        @created="operationSuccess"
      ></service-base-info>
    </el-tab-pane>
  </biz-popup-tabs>
</template>

<script>
import { BizPopupTabs } from '@/components/BizPopup';

import TagClassBaseInfo from './GroupBaseInfo';
import ServiceBaseInfo from './CustomerServiceBaseInfo';

export default {
  name: 'TagClassPopup',
  components: {
    BizPopupTabs,
    TagClassBaseInfo,
    ServiceBaseInfo
  },
  props: {
    isService: {
      type: Boolean,
      default() {
        return false;
      }
    },
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
    },
    itemId(newVal, oldVal) {
      console.log('itemId: ', newVal);
    }
  }
};
</script>

<style lang="scss">

</style>
