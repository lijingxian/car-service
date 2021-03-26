<template>
  <biz-popup-tabs
    :open="open"
    v-model="tabSelection"
    @close="close"
  >
    <el-tab-pane label="基本信息" name="0">
      <terminal-class-base-info
        :itemId="itemId"
        @operationSuccess="operationSuccess"
        >
      </terminal-class-base-info>
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
    <el-tab-pane label="终端能力" name="3" v-if="itemId.id">
      <terminal-class-ability
        :itemId="itemId"
        @operationSuccess="operationSuccess"
        >
      </terminal-class-ability>
    </el-tab-pane>
    <el-tab-pane label="终端升级" name="4" v-if="itemId.id">
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
import TerminalClassBaseInfo from './TerminalClassBaseInfo';
import CodingRule from './CodingRule';
import TerminalUpdate from './TerminalUpdate';
import TerminalClassAbility from './TerminalClassAbility';

import messageBox from '@/utils/messagebox';

export default {
  name: 'TerminalClassPopup',
  components: {
    BizPopupTabs,
    AccessSetting,
    TerminalClassBaseInfo,
    CodingRule,
    TerminalUpdate,
    TerminalClassAbility
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
          messageBox.clearMessageBoxes();
          this.$message({
            showClose: true,
            message: '可管理该类型终端的基本信息和能力'
          });
        }, 500);
      }
    },
    tabSelection (nVal) {
      if (this.$refs.dataStreamTab) this.$refs.dataStreamTab.clearInterval();

      messageBox.clearMessageBoxes();

      switch (nVal) {
        case '0':
          this.$message({
            showClose: true,
            message: '可管理该类型终端的基本信息和能力'
          });
          break;
        case '1':
          this.$message({
            showClose: true,
            message: '维护终端的接入配置，务必保证终端接入信息正确哦'
          });
          break;
        case '2':
          this.$message({
            showClose: true,
            message: '维护终端类型的编码规则，记得规则不要过于简单啊'
          });
          break;
        case '3':
          this.$message({
            showClose: true,
            message: '可管理该类型终端的基本信息和能力'
          });
          break;
        case '4':
          this.$message({
            showClose: true,
            message: '终端有升级时，记得及时上传升级文件哦'
          });
          break;
      }
    }
  }
};
</script>

<style lang="scss">

</style>
