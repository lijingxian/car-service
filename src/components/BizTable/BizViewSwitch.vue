<template>
  <div class="biz-view-switch">
    <el-popover :content="view.title" placement="bottom-start" trigger="hover" :key="index" v-for="(view,index) of views">
      <i @click="onSwitch(view)" :class="mixClass(view)" :style="view.style"  slot="reference"></i>
    </el-popover>
  </div>
</template>

<script>
export default {
  name: 'BizViewSwitch',
  data() {
    return {};
  },
  props: {
    views: {
      type: Array,
      default: function() {
        return [];
      }
    }
  },
  computed: {},
  methods: {
    onSwitch(view) {
      if (!view.actived) {
        this.$emit('onSwitch', view.name);
      }
    },
    mixClass(view) {
      let activedC = view.actived ? ' actived' : '';
      let mclass = view.class + activedC;
      return mclass;
    }
  }
};
</script>

<style lang="scss">
.biz-view-switch {
  display: flex;
  align-items: center;
  cursor: pointer;

  i {
    margin-right: 10px;
    color: #989898;

    transition: all 0.3s;

    &.actived {
      color: #ff7300;
    }

    &:last-child {
      outline: none;
      margin-right: 0;
    }
  }
}
</style>
