<template>
  <div class="control-group">
    <div class="label" v-show="label">{{label}}</div>
    <div class="group-body">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ControlGroup',
  components: {},
  props: {
    label: {
      type: String,
      default() {
        return '';
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
.control-group {
  display: flex;
  margin-top: 20px;
  .label {
    line-height: 24px;
    padding: 4px 0;
    color: #333;
    font-size: 14px;
    width: 60px;
    flex-shrink: 0;
  }
  .group-body {
    flex-grow: 2;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
  }
}
</style>
