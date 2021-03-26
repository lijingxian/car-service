<template>
  <div class="template-editor-side-bar">
    <div class="side-bar-item" v-for="(item, index) in list" :key="index">
      <el-button type="text" :style="{ color: curIndex === index ? '#ff7300' : '#606266' }" @click="btnClick(index)">{{ item.name }}</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TemplateEditorSideBar',
  props: {
    list: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data () {
    return {
      curIndex: 0
    };
  },
  components: {
  },
  computed: {
  },
  watch: {
  },
  mounted() {
  },
  methods: {
    btnClick(index) {
      this.curIndex = index;
      this.$emit('btn-click', this.list[index].type || '');
    }
  }
};
</script>

<style lang="scss">
.template-editor-side-bar {
  width: 100%;
  height: 100%;
  padding: 100px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #fff;
  .side-bar-item {
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 14px;
    & + .side-bar-item {
      border-top: 1px solid #cdcdcd;
    }
  }
}
</style>
