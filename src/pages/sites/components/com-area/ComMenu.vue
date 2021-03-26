<template>
  <div class="com-menu">
    <el-tree
      :highlight-current="true"
      node-key="id"
      :current-node-key="comMenuId"
      :check-on-click-node="true"
      :data="comTypes"
      accordion
      @node-click="handleNodeClick"
    ></el-tree>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';

export default {
  name: 'ComMenu',
  components: {},
  props: {},
  data() {
    return {
      comTypes: [
        { id: '10', parentId: 0, label: '图片', description: '' },
        { id: '20', parentId: 0, label: '文本', description: '' },
        {
          id: '30',
          parentId: 0,
          label: '营销组件',
          description: '',
          children: [{ id: '31', label: '表单', description: '' }, { id: '32', label: '电话', description: '' }, { id: '33', label: '按钮', description: '' }]
        }
        // {
        //   id: 69,
        //   parentId: 0,
        //   label: '元素',
        //   description: '',
        //   typeOrder: 100,
        //   children: [
        //     { id: 70, label: '图形', description: '', typeOrder: 101 },
        //     { id: 61, label: '倒计时', description: '', typeOrder: 102 },
        //     { id: 76, label: '互动记录', description: '', typeOrder: 103 }
        //   ]
        // }
      ]
    };
  },
  computed: {
    ...mapGetters('Site', ['comMenuId'])
  },
  watch: {},
  created() {},
  methods: {
    ...mapMutations('Site', ['updateComMenuId']),
    handleNodeClick(value) {
      this.updateComMenuId(value.id);
    }
  }
};
</script>

<style lang="scss">
.com-menu {
  width: 120px;
  height: 100%;
  flex-shrink: 0;
  background-color: #fff;
  box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.08);
  .el-tree-node__content {
    height: 38px;
    &:hover {
      background-color: #fff;
    }
  }
  .el-tree-node__label {
    padding: 2px 8px;
    border-radius: 16px;
    &:hover {
      background-color: #edf1f5;
    }
  }
  .el-tree-node.is-current > .el-tree-node__content {
    background-color: #fff;
  }
  .el-tree-node.is-current > .el-tree-node__content > .el-tree-node__label {
    color: #fff;
    background-color: #ff7300;
  }
}
</style>
