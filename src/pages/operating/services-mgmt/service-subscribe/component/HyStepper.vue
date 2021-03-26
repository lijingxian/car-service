<template>
  <div :class="[{'disabled': disabled},cartStyle?'cart-stepper':'md-stepper']">
    <div class="md-stepper-button md-stepper-button-reduce" :class="{'disabled': isMin}" @click="$_reduce">
    </div>
    <div class="md-stepper-number">
      <input type="tel" :value="value" :readOnly="readOnly" @blur="$_reset" @change="$_onChange" @input="$_input">
    </div>
    <div class="md-stepper-button md-stepper-button-add" :class="{'disabled': isMax}" @click="$_add">
    </div>
  </div>
</template>

<script>
function getDecimalNum(num) {
  try {
    return num.toString().split('.')[1].length;
  } catch (e) {
    return 0;
  }
}

function accAdd(num1, num2) {
  let r1 = getDecimalNum(num1);
  let r2 = getDecimalNum(num2);
  let m = Math.pow(10, Math.max(r1, r2));
  return (num1 * m + num2 * m) / m;
}

function subtr(num1, num2) {
  let r1 = getDecimalNum(num1);
  let r2 = getDecimalNum(num2);
  let m = Math.pow(10, Math.max(r1, r2));
  let n = r1 >= r2 ? r1 : r2;
  return Number(((num1 * m - num2 * m) / m).toFixed(n));
}

export default {
  name: 'md-stepper',

  components: {},

  props: {
    value: {
      type: Number,
      default: 0
    },
    step: {
      type: Number,
      default: 1
    },
    min: {
      type: Number,
      default: 0
    },
    max: {
      type: Number,
      default: Number.MAX_VALUE
    },
    disabled: {
      type: Boolean,
      default: false
    },
    readOnly: {
      type: Boolean,
      default: false
    },
    cartStyle: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      isMin: false,
      isMax: false,
      currentNum: 0
    };
  },

  watch: {
    value (val) {
      this.currentNum = this.$_getCurrentNum();
    },
    min(val) {
      if (this.currentNum < val) {
        this.currentNum = val;
      }
      this.$_checkStatus();
    },
    max(val) {
      if (this.currentNum > val) {
        this.currentNum = val;
      }
      this.$_checkStatus();
    }
  },

  mounted() {
    // verify that the minimum value is less than the maximum value
    this.$_checkMinMax();
    this.currentNum = this.$_getCurrentNum();
    this.$_checkStatus();
  },

  methods: {
    // MARK: 私有方法
    $_reduce() {
      if (this.disabled || this.isMin) {
        return;
      }
      this.currentNum = subtr(this.currentNum, this.step);
      this.$_onChange();
    },
    $_add() {
      if (this.disabled || this.isMax) {
        return;
      }
      this.currentNum = accAdd(this.currentNum, this.step);
      this.$_onChange();
    },
    // 手动输入数值方法
    $_input(e) {
      this.currentNum = Number(e.target.value);
      this.$_onChange();
    },
    $_getCurrentNum() {
      let num = this.value;
      if (num < this.min) {
        return this.min;
      } else if (num > this.max) {
        return this.max;
      } else {
        return this.value;
      }
    },
    $_checkStatus() {
      this.isMin = subtr(this.currentNum, this.step) < this.min;
      this.isMax = accAdd(this.currentNum, this.step) > this.max;
    },
    $_checkMinMax() {
      if (this.min > this.max) {
        // warn('[md-vue-stepper] minNum is larger than maxNum');
      }
      return this.max > this.min;
    },
    $_reset() {
      if (!this.currentNum || isNaN(this.currentNum)) {
        this.currentNum = this.min !== -Number.MAX_VALUE ? this.min : 0;
        this.$_onChange();
      }
    },

    // MARK: 监听事件方法, 如 $_onButtonClick
    $_onChange() {
      let currentNum = this.currentNum ? this.currentNum : this.min;
      if (currentNum < this.min) {
        this.currentNum = this.min;
      } else if (currentNum > this.max) {
        this.currentNum = this.max;
      }
      this.$_checkStatus();
      this.$emit('input', this.currentNum);
    }
  }
};
</script>

<style lang="scss">
$stepper-fill: #f3f4f5;
$stepper-disabled-opacity: 0.4;
$stepper-color: #333;
$stepper-font-size: 13px;
$stepper-input-font-size: 13px;
$stepper-height: 30px;
$stepper-width-button: 24px;
$stepper-width-input: 40px;
$stepper-radius-button: 0;
$stepper-radius-input: 0;

/* 商品详情页stepper 样式*/
.md-stepper {
  width: 90px;
  color: stepper-color;
  -webkit-font-smoothing: antialiased;
  font-size: $stepper-font-size;
  height: $stepper-height;
  display: flex;
  &.disabled {
    opacity: $stepper-disabled-opacity;
  }

  .md-stepper-button {
    position: relative;
    width: $stepper-width-button;
    height: $stepper-height;
    line-height: $stepper-height;
    background-color: $stepper-fill;
    border-radius: 2px;
    &:after {
      content: '';
      position: absolute;
      width: 14px;
      height: 2px;
      top: 50%;
      left: 50%;
      background: #ff7300;
      transform: translate(-50%, -50%);
    }

    &.md-stepper-button-add {
      &:before {
        content: '';
        position: absolute;
        width: 2px;
        height: 14px;
        top: 50%;
        left: 50%;
        background: #ff7300;
        transform: translate(-50%, -50%);
      }
    }

    &.disabled {
      opacity: $stepper-disabled-opacity;
    }
  }

  .md-stepper-number {
    margin: 0 4px;
    min-width: 40px;
    height: $stepper-height;
    text-align: center;
    border-radius: $stepper-radius-button;
    input {
      width: $stepper-width-input;
      height: $stepper-height;
      border: none;
      outline: none;
      font-size: $stepper-input-font-size;
      line-height: $stepper-height;
      box-sizing: border-box;
      background-color: $stepper-fill;
      text-align: center;
      color: $stepper-color;
      border-radius: $stepper-radius-input;
    }
  }
}
/* 购物车stepper 样式*/
.cart-stepper {
  width: 90px;
  color: stepper-color;
  -webkit-font-smoothing: antialiased;
  font-size: $stepper-font-size;
  height: 28px;
  display: flex;
  border-radius: 5px;
  &.disabled {
    opacity: $stepper-disabled-opacity;
  }

  .md-stepper-button {
    position: relative;
    width: $stepper-width-button;
    height: 26px;
    line-height: $stepper-height;
    &:after {
      content: '';
      position: absolute;
      width: 14px;
      height: 1px;
      top: 50%;
      left: 50%;
      background: #999;
      transform: translate(-50%, -50%);
    }

    &.md-stepper-button-add {
      &:before {
        content: '';
        position: absolute;
        width: 1px;
        height: 14px;
        top: 50%;
        left: 50%;
        background: #999;
        transform: translate(-50%, -50%);
      }
    }

    &.disabled {
      opacity: $stepper-disabled-opacity;
    }
  }

  .md-stepper-number {
    min-width: 40px;
    height: 26px;
    text-align: center;
    border-radius: $stepper-radius-button;
    border-left: 1px solid #e5e5e5;
    border-right: 1px solid #e5e5e5;
    input {
      width: 38px;
      height: 26px;
      border: none;
      outline: none;
      font-size: $stepper-input-font-size;
      box-sizing: border-box;
      background-color: #fff;
      text-align: center;
      color: $stepper-color;
      border-radius: $stepper-radius-input;
    }
  }
}
</style>
