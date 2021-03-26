<template>
  <biz-popup-tabs :open="open" v-model="tabSelection" @close="close">
    <el-tab-pane label="分类信息" name="0">
      <class-info ref="info" :itemId="itemId" @operationSuccess="operationSuccess"></class-info>
    </el-tab-pane>
  </biz-popup-tabs>
</template>

<script>
import { BizPopupTabs } from '@/components/BizPopup';
import ClassInfo from './ClassInfo';

export default {
  name: 'class-mgmt-pop',
  components: {
    BizPopupTabs,
    ClassInfo
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
  data() {
    return {
      tabSelection: '0'
    };
  },
  methods: {
    close(e) {
      this.$emit('close', e);
    },
    operationSuccess(e) {
      this.$emit('operationSuccess', e);
    }
  },
  watch: {
    open(val) {
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
