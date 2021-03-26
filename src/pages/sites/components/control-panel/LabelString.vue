<template>
  <div class="label-string">
    <div class="label">{{label}}</div>
    <el-input size="small" :value="value" @input="onInput" :placeholder="placeholder" :min="min" :max="max"></el-input>
  </div>
</template>

<script>
export default {
  name: 'LabelString',
  components: {},
  props: {
    label: String,
    value: {
      type: String,
      default() {
        return '';
      }
    },
    placeholder: {
      type: String,
      default() {
        return '';
      }
    },
    min: {
      type: Number,
      default() {
        return 1;
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
.label-string {
  display: flex;
  margin-bottom: 10px;
  .label {
    color: #333;
    font-size: 12px;
    position: relativ;
    width: 80px;
    height: 32px;
    box-shadow: 1px 0 0 0 #d9d9d9;
    vertical-align: middle;
    padding-left: 2px;
    border-top: 1px solid rgb(220, 223, 230);
    border-left: 1px solid rgb(220, 223, 230);
    border-bottom: 1px solid rgb(220, 223, 230);
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
  }
  // .el-input-number {
  //   width: 75px;
  // }
  // .el-input__inner {
  //   border-top-left-radius: 0;
  //   border-bottom-left-radius: 0;
  // }
  // .el-input-number.is-controls-right .el-input__inner {
  //   padding-left: 5px;
  //   padding-right: 30px;
  // }
}
</style>
