<template>
  <div class="add-motorcycle-type" @click="open=true">
    <biz-popup-tabs :open="open" v-model="tabName" @close="open = false;">
      <el-tab-pane label="添加" name="first">
        <motorcycle-type>
        </motorcycle-type>
      </el-tab-pane>
    </biz-popup-tabs>
  </div>
</template>

<script>
import { BizPopupTabs } from '@/components/BizPopup';
import MotorcycleType from './MotorcycleType';

export default {
  name: 'AddMotorcycleType',
  data() {
    return {
      tabName: 'first',
      open: true
    };
  },
  components: {
    BizPopupTabs,
    MotorcycleType
  },
  created() {
  },
  computed: {},
  methods: {
  }
};
</script>

<style lang="scss">
.add-motorcycle-type {
  width: 100%;
  height: 100%;
}
</style>
