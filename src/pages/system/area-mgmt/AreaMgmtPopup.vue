<template>
  <biz-popup-tabs :open="open" v-model="activeTabName" @close="close">
    <el-tab-pane label="地区信息" name="areaInfo">
      <AreaInfo :open="open" :areaId="areaId" :parentAreaId="parentAreaId" @refreshNotification="refreshNotification" @addSuccessNotification="addSuccessNotification">
      </AreaInfo>
    </el-tab-pane>
  </biz-popup-tabs>
</template>

<script>
import { BizPopupTabs } from '@/components/BizPopup';
import AreaInfo from './AreaInfo';

export default {
  name: 'AreaMgmtPopup',
  components: {
    BizPopupTabs,
    AreaInfo
  },
  props: {
    open: {
      type: Boolean,
      default: false
    },
    areaId: {
      type: String,
      default: ''
    },
    parentAreaId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      openPopup: false,
      activeTabName: 'areaInfo'
    };
  },
  computed: {},
  methods: {
    close(e) {
      this.$emit('close', e);
    },
    refreshNotification(e) {
      this.$emit('refreshNotification', e);
    },
    addSuccessNotification(e) {
      this.$emit('addSuccessNotification', e);
    }
  },
  watch: {}
};
</script>

<style lang="scss">
</style>
