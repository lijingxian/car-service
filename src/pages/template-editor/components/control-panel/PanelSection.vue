<template>
  <div class="panel-section">
    <div class="section-header">
      <i class="icon"></i>
      <span class="title">{{title}}</span>
    </div>
    <div class="section-content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PanelSection',
  components: {},
  props: {
    title: {
      type: String,
      default() {
        return '模块';
      }
    }
  },
  data() {
    return {};
  },
  computed: {},
  watch: {},
  created() {},
  methods: {}
};
</script>

<style lang="scss">
.panel-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  border-bottom: 1px solid #e8e8e8;
  padding: 24px 8px;
  .section-header {
    width: 100%;
    margin-bottom: 4px;
    .icon {
      width: 4px;
      height: 16px;
      border-radius: 2px;
      display: inline-block;
      background-color: #4e90ff;
    }
    .title {
      color: #333;
      font-size: 20px;
      padding-left: 8px;
    }
  }
  .section-content {
    width: 100%;
  }
}
</style>
