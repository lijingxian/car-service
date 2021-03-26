<template>
  <biz-popup-tabs :open="open" v-model="tabSelection" @close="close">
    <el-tab-pane label="设置" name="0">
      <ability-setting
        :itemId="itemId"
        @operationSuccess="operationSuccess"
        ref="ability"
      ></ability-setting>
    </el-tab-pane>
  </biz-popup-tabs>
</template>

<script>
import { BizPopupTabs } from '@/components/BizPopup';

import AbilitySetting from '../../components/AbilitySetting/AbilitySetting';

export default {
  name: 'ShopPublicityPopup',
  components: {
    BizPopupTabs,
    AbilitySetting
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
      tabSelection: '0',
      form: {}
    };
  },
  methods: {
    close(e) {
      this.$emit('close', e);
    },
    operationSuccess(e) {
      this.$emit('operationSuccess', e);
    },
    handleFormChange (obj) {
      this.form = Object.assign({}, obj);
    },
    handleItemChange (item) {
      console.log('item=change', item);
      this.$emit('item-change', item);
    }
  },
  computed: {

  },
  watch: {
    open (val) {
      if (val) {
        this.tabSelection = '0';
        this.$refs.ability.query();
      }
    }
  }
};
</script>

<style lang="scss">
</style>
