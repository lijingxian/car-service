<template>
  <div class="biz-column-operation">
    <slot></slot>
    <el-popover placement="bottom" width="150" trigger="hover" ref="p-slot" v-show="showMore">
      <slot></slot>
      <el-button slot="reference" type="text" size="mini" @click.stop="onMore">
        更多
        <i class="el-icon-arrow-down"></i>
      </el-button>
    </el-popover>
  </div>
</template>

<script>
export default {
  name: 'biz-column-operation',
  components: {},
  props: {
    row: Object
  },
  data() {
    return {
      showMore: false
    };
  },
  computed: {},
  watch: {
    row() {
      this.getShowMore();
    }
  },
  created() {},
  mounted() {
    this.getShowMore();
  },
  methods: {
    onMore() {},
    getShowMore() {
      setTimeout(() => {
        if (!this.$slots.default) {
          return;
        }
        let limit = 0;
        for (const iterator of this.$slots.default) {
          if (iterator.componentInstance) {
            limit++;
          }
        }
        if (limit > 2) {
          this.showMore = true;
        } else {
          this.showMore = false;
        }
        this.operateSlot();
      }, 50);
    },
    operateSlot() {
      if (this.showMore) {
        // 隐藏slot的多余按钮
        let slotCount = 1;
        for (const iterator of this.$slots.default) {
          if (iterator.componentInstance) {
            if (slotCount <= 0) {
              iterator.elm.style.display = 'none';
            }
            slotCount--;
          }
        }

        // 隐藏popover上的第一个按钮
        setTimeout(() => {
          let popoverCount = 1;
          for (const iterator of this.$refs['p-slot'].$refs.popper.children) {
            if (popoverCount === 1) {
              iterator.style.display = 'none';
              popoverCount--;
            }
          }
        }, 0);
      } else {
        for (const iterator of this.$slots.default) {
          if (iterator.componentInstance) {
            iterator.elm.style.display = '';
          }
        }
        for (const iterator of this.$refs['p-slot'].$refs.popper.children) {
          iterator.style.display = '';
        }
      }
    }
  }
};
</script>

<style lang="scss">
.biz-column-operation {
}
</style>
