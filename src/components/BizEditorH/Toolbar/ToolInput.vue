<template>
  <div :class="`editor-toolbar-input toolbar-input-${toolbar.name}`" v-clickoutside="onListHide">
    <el-tooltip popper-class="euditor-tip" effect="dark" :content="toolbar.title" placement="top" :enterable="false">
      <div @click="onListShow" class="btn-c">
        <input type="text" ref="input" class="edui-input" :value="toolbar.value" @blur="checkInput" @keyup.enter="blur">
        <div class="edui-button edui-select">
          <i class="triangle"></i>
        </div>
      </div>
    </el-tooltip>
    <div class="edui-toolbar-selectlist" v-show="visible">
      <ul>
        <li v-for="(option,index) in options" :key="index" @click="onSelect(option.value)">
          <i class="el-icon-check" v-if="option.value == toolbar.value"></i>
          <span>{{option.label}}</span>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import clickoutside from './utils/clickoutside';
export default {
  name: 'EToolInput',
  props: {
    toolbar: Object
  },
  directives: { clickoutside },
  components: {},
  data() {
    return {
      visible: false,
      options: [
        { label: '10px', value: '10px' },
        { label: '11px', value: '11px' },
        { label: '12px', value: '12px' },
        { label: '14px', value: '14px' },
        { label: '16px', value: '16px' },
        { label: '18px', value: '18px' },
        { label: '20px', value: '20px' },
        { label: '24px', value: '24px' },
        { label: '36px', value: '36px' }
      ]
    };
  },
  methods: {
    onListShow() {
      this.visible = !this.visible;
    },
    onListHide() {
      this.visible = false;
    },
    onSelect(value) {
      this.$emit('on-toolinput-click', this.toolbar.name, value);
      this.onListHide();
    },
    checkInput(event) {
      let value = event.target.value;
      this.$emit('on-toolinput-click', this.toolbar.name, value);
      this.onListHide();
    },
    blur() {
      this.$refs.input.blur();
    }
  }
};
</script>

<style lang="scss">
.editor-toolbar-input {
  position: relative;
  border: 1px solid transparent;
  height: 100%;
  &:hover {
    border-color: #e7e7eb;
  }
  .edui-input {
    width: 32px;
    height: 20px;
    border: none;
    outline: none;
    background-color: transparent;
  }
  .btn-c {
    display: flex;
    align-items: center;
  }
  .edui-button {
    border: none;
    padding: 0;
    background-color: #fff;
    position: relative;
    &:focus {
      outline: none;
    }
    &.edui-select {
      padding: 0;
      padding-right: 5px;
    }
    .triangle {
      display: block;
      width: 0;
      height: 0;
      border-right: 3px solid transparent;
      border-left: 3px solid transparent;
      border-top: 4px solid #888;
      &:hover {
        border-top-color: #666;
      }
    }
  }
  .edui-toolbar-selectlist {
    border: 1px solid #e7e7eb;
    background-color: #fff;
    z-index: 40;
    position: absolute;
    ul {
      padding: 0 2px;
      margin: 5px 0;
      li {
        width: 150px;
        position: relative;
        padding: 4px;
        padding-left: 30px;
        font-size: 12px;
        box-sizing: border-box;
        border: 1px solid transparent;
        list-style: none;
        &:hover {
          background-color: #f4f5f9;
          border-color: #e7e7eb;
          cursor: default;
        }
        i {
          position: absolute;
          font-size: 16px;
          left: 10px;
        }
      }
    }
  }
}
</style>
