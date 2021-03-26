<template>
  <div class="biz-popup-tabs">
    <biz-popup :open="open" @close="close" :contentStyle="contentStyle">
      <el-tabs type="border-card" :value="value" @tab-click="tabClick">
        <slot>
        </slot>
      </el-tabs>
    </biz-popup>
  </div>
</template>

<script>
import BizPopup from './BizPopup';

export default {
  name: 'BizPopupTabs',
  data() {
    return {};
  },
  props: {
    open: {
      type: Boolean,
      default: false
    },
    value: {
      type: String,
      required: true
    },
    contentStyle: {
      type: Object,
      default () {
        return {};
      }
    }
  },
  components: {
    BizPopup
  },
  methods: {
    close() {
      // this.$confirm('是否保存当前页面?', '提示', {
      //   confirmButtonText: '确定',
      //   cancelButtonText: '取消',
      //   type: 'warning'
      // })
      //   .then(() => {
      //     this.$emit('close');
      //   });
      this.$emit('close');
    },
    tabClick(tab) {
      this.$emit('input', tab.name);
    }
  }
};
</script>

<style lang="scss">
.biz-popup-tabs {
  .el-tabs--border-card > .el-tabs__header {
    height: 39px;
    background-color: #ebebeb;
    // .el-tabs__item {
    //   color: #696560;
    // }
  }
}
</style>
