<template>
  <biz-popup-tabs
    :open="open"
    v-model="tabSelection"
    @close="close"
  >
    <el-tab-pane label="终端能力设置" name="0">
      <class-ability-setting
        :itemId="itemId"
        @operationSuccess="operationSuccess"
        >
      </class-ability-setting>
    </el-tab-pane>
    <el-tab-pane label="接入配置" name="1" v-if="itemId.id">
      <access-setting
        :itemId="itemId"
        @operationSuccess="operationSuccess"
        >
      </access-setting>
    </el-tab-pane>
    <el-tab-pane label="编码规则" name="2" v-if="itemId.id">
      <coding-rule
        :itemId="itemId"
        @operationSuccess="operationSuccess"
        >
      </coding-rule>
    </el-tab-pane>
    <el-tab-pane label="终端升级" name="3" v-if="itemId.id">
      <terminal-update
        :itemId="itemId"
        @operationSuccess="operationSuccess"
        >
      </terminal-update>
    </el-tab-pane>
  </biz-popup-tabs>
</template>

<script>
import { BizPopupTabs } from '@/components/BizPopup';

import AccessSetting from './AccessSetting';
import ClassAbilitySetting from './ClassAbilitySetting';
import CodingRule from './CodingRule';
import TerminalUpdate from './TerminalUpdate';

export default {
  name: 'TerminalClassPopup',
  components: {
    BizPopupTabs,
    AccessSetting,
    ClassAbilitySetting,
    CodingRule,
    TerminalUpdate
  },
  props: {
    open: {
      type: Boolean
    },
    itemId: {
      type: Object,
      default () {
        return { id: '' };
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
