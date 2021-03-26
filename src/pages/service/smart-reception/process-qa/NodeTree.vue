<template>
  <div class="process-node-tree">
    <div :class="topStyle"></div>
    <div class="node-warp">
      <node :nodeData="tree.nodeData" :flowId="flowId" :hasChild="nodes.length>0" @refresh="refresh"></node>
    </div>
    <div class="node-tree-zone" v-if="nodes.length>0">
      <node-tree
        ref="node-tree"
        :isLeft="index===0&&nodes.length!==1"
        :isRight="index===(nodes.length-1)&&nodes.length!==1"
        :isOnly="nodes.length===1"
        :tree="nodeTree"
        v-for="(nodeTree, index) in nodes"
        :key="index"
        :flowId="flowId"
        @refresh="refresh"
      ></node-tree>
    </div>
  </div>
</template>

<script>
import Node from './Node';
export default {
  name: 'NodeTree',
  components: {
    Node
  },
  props: {
    flowId: {
      type: String,
      default() {
        return '';
      }
    },
    tree: Object,
    isRoot: {
      type: Boolean,
      default() {
        return false;
      }
    },
    isLeft: {
      type: Boolean,
      default() {
        return false;
      }
    },
    isRight: {
      type: Boolean,
      default() {
        return false;
      }
    },
    isOnly: {
      type: Boolean,
      default() {
        return false;
      }
    }
  },
  data() {
    return {};
  },
  computed: {
    nodes() {
      return this.tree.subNodes || [];
    },
    topStyle() {
      return {
        'top-line': !this.isRoot,
        'top-line-only': this.isOnly,
        'top-line-left': this.isLeft,
        'top-line-center': !this.isLeft && !this.isRight && !this.isOnly,
        'top-line-right': this.isRight
      };
    }
  },
  watch: {
    tree: {
      immediate: true,
      handler() {}
    }
  },
  created() {},
  methods: {
    refresh() {
      this.$emit('refresh');
    }
  }
};
</script>

<style lang="scss">
.process-node-tree {
  vertical-align: top;
  display: inline-block;
  white-space: nowrap;
  position: relative;
  .top-line {
    height: 19px;
    &::before,
    &::after {
      content: '';
      position: absolute;
      height: 19px;
    }
  }
  .top-line-left {
    &::before {
      top: 0;
      right: 0;
      width: 50%;
      border-top: 1px solid #ddd;
      border-left: 1px solid #ddd;
    }
  }
  .top-line-center {
    &:before {
      top: 0;
      left: 0;
      width: 50%;
      border-top: 1px solid #ddd;
      border-right: 1px solid #ddd;
    }
    &:after {
      top: 0;
      right: 0;
      width: 50%;
      border-top: 1px solid #ddd;
    }
  }
  .top-line-only {
    &:before {
      top: 0;
      left: 0;
      width: 50%;
      border-right: 1px solid #ddd;
    }
  }
  .top-line-right {
    &::before {
      top: 0;
      left: 0;
      width: 50%;
      border-top: 1px solid #ddd;
      border-right: 1px solid #ddd;
    }
  }
  .node-warp {
    width: 100%;
    display: flex;
    justify-content: center;
  }
  .node-tree-zone {
    display: inline-block;
  }
}
</style>
