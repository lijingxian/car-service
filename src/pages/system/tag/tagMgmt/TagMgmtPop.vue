<template>
  <biz-popup-tabs :open="open" v-model="tabSelection" @close="close">
    <el-tab-pane label="平台标签" name="0">
      <plat-tag-info :itemId="itemId" typeStr="platform" @operationSuccess="operationSuccess" ref="platform"></plat-tag-info>
    </el-tab-pane>
    <el-tab-pane label="店铺标签" name="1">
      <plat-tag-info :itemId="itemId" typeStr="shop" @operationSuccess="operationSuccess" ref="shop"></plat-tag-info>
    </el-tab-pane>
    <!-- <el-tab-pane label="会员标签" name="2">
     <plat-tag-info :itemId="itemId" typeStr="member" @operationSuccess="operationSuccess" ref="member"></plat-tag-info>
    </el-tab-pane> -->
  </biz-popup-tabs>
</template>

<script>
import { BizPopupTabs } from '@/components/BizPopup';
import PlatTagInfo from './PlatTagInfo';

export default {
  name: 'class-mgmt-pop',
  components: {
    BizPopupTabs,
    PlatTagInfo
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
    },
    tabSelection(newValue) {
      if (newValue) {
        switch (newValue) {
          case '0':
            this.$refs.platform.clearForm();
            break;
          case '1':
            this.$refs.shop.clearForm();
            break;
          case '2':
            this.$refs.member.clearForm();
            break;
          default:
            break;
        }
      }
    }
  }
};
</script>

<style lang="scss">
</style>
