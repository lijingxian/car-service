<template>
  <div class="label-input">
    <div class="label">{{label}}</div>
    <el-input-number size="small" :value="value" @input="onInput" controls-position="right" :min="min" :max="max"></el-input-number>
  </div>
</template>

<script>
export default {
  name: 'LabelInput',
  components: {},
  props: {
    label: String,
    value: {
      type: Number,
      default() {
        return 0;
      }
    },
    min: {
      type: Number,
      default() {
        return 12;
      }
    },
    max: {
      type: Number,
      default() {
        return 100;
      }
    }
  },
  data() {
    return {};
  },
  computed: {},
  watch: {},
  created() {},
  methods: {
    onInput(value) {
      this.$emit('input', value);
    }
  }
};
</script>

<style lang="scss">
.label-input {
  display: flex;
  .label {
    color: #333;
    font-size: 12px;
    position: relativ;
    width: 52px;
    height: 32px;
    box-shadow: 1px 0 0 0 #d9d9d9;
    vertical-align: middle;
    padding-left: 8px;
    border-top: 1px solid rgb(220, 223, 230);
    border-left: 1px solid rgb(220, 223, 230);
    border-bottom: 1px solid rgb(220, 223, 230);
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
  }
  .el-input-number {
    width: 75px;
  }
  .el-input__inner {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }
  .el-input-number.is-controls-right .el-input__inner {
    padding-left: 5px;
    padding-right: 30px;
  }
}
</style>
