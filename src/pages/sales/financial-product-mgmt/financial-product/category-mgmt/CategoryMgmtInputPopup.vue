<template>
  <biz-popup-tabs :open="open" v-model="clickTabName" @close="close">
    <el-tab-pane label="导入" name="InputCategory">
      <input-category-setting :open="open" @operationSuccess="operationSuccess">
      </input-category-setting>
    </el-tab-pane>
  </biz-popup-tabs>
</template>

<script>
import { BizPopupTabs } from '@/components/BizPopup';
import InputCategorySetting from './InputCategorySetting';

export default {
  name: 'CategoryMgmtPopup',
  components: {
    BizPopupTabs,
    InputCategorySetting
  },
  props: {
    open: {
      type: Boolean
    }
  },
  data() {
    return {
      clickTabName: 'InputCategory'
    };
  },
  computed: {},
  methods: {
    close(e) {
      this.$emit('close', e);
    },
    operationSuccess(e) {
      this.$emit('operationSuccess', e);
    }
  },
  watch: {}
};
</script>

<style lang="scss">

</style>
