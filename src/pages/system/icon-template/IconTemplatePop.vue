<template>
  <biz-popup-tabs :open="open" v-model="tabSelection" @close="close">
    <el-tab-pane label="分类信息" name="0">
      <icon-temp-info :itemId="itemId" @operationSuccess="operationSuccess"></icon-temp-info>
    </el-tab-pane>
  </biz-popup-tabs>
</template>

<script>
import { BizPopupTabs } from '@/components/BizPopup';
import IconTempInfo from './IconTempInfo';

export default {
  name: 'icon-template-pop',
  data() {
    return {
      tabSelection: '0'
    };
  },
  props: {
    itemId: {
      type: String,
      default() {
        return '';
      }
    },
    open: {
      type: Boolean
    }
  },
  components: { BizPopupTabs, IconTempInfo },
  computed: {},
  watch: {},
  methods: {
    operationSuccess(e) {
      this.$emit('operationSuccess', e);
    },
    close(e) {
      this.$emit('close', e);
    }
  }
};
</script>

<style lang="scss">
.icon-template-pop {
}
</style>
