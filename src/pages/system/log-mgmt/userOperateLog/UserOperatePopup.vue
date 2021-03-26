<template>
  <biz-popup-tabs :open="open" v-model="activeTabName" @close="close">
    <el-tab-pane label="日志信息" name="0">
      <user-operate-info :open="open" :id="id" @refreshNotification="refreshNotification"></user-operate-info>
    </el-tab-pane>
  </biz-popup-tabs>
</template>

<script>
import { BizPopupTabs } from '@/components/BizPopup';
import UserOperateInfo from './UserOperateInfo';

export default {
  name: 'user-operate-popup',
  data() {
    return {
      activeTabName: '0'
    };
  },
  props: {
    open: {
      type: Boolean
    },
    id: {
      type: String,
      default() {
        return '';
      }
    }
  },
  components: { BizPopupTabs, UserOperateInfo },
  computed: {},
  watch: {},
  methods: {
    close(e) {
      this.$emit('close', e);
    },
    refreshNotification(e) {
      this.$emit('refreshNotification', e);
    }
  }
};
</script>

<style lang="scss">
.user-operate-popup {
}
</style>
