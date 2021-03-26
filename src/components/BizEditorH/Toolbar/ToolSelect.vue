<template>
  <div :class="`editor-toolbar-select toolbar-select-${toolbar.name}`" v-clickoutside="onListHide">
    <el-tooltip popper-class="euditor-tip" effect="dark" :content="toolbar.title" placement="top" :enterable="false">
      <div @click="onListShow" class="btn-c">
        <div class="edui-button">
          <i class="edui-toolbar-icon"></i>
        </div>
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
  name: 'EToolSelect',
  props: {
    toolbar: Object
  },
  directives: { clickoutside },
  components: {},
  data() {
    return {
      visible: false
    };
  },
  computed: {
    options() {
      // 行间距
      if (this.toolbar.name === 'lineheight') {
        return [
          { label: '1', value: 1 },
          { label: '1.5', value: 1.5 },
          { label: '1.75', value: 1.75 },
          { label: '2', value: 2 },
          { label: '3', value: 3 },
          { label: '4', value: 4 },
          { label: '5', value: 5 }
        ];
      } else if (this.toolbar.name === 'indentboth') {
        return [
          { label: '无', value: '0px' },
          { label: '8', value: '8px' },
          { label: '16', value: '16px' },
          { label: '32', value: '32px' },
          { label: '48', value: '48px' }
        ];
      }
      return [];
    }
  },
  methods: {
    onListShow() {
      this.visible = !this.visible;
    },
    onListHide() {
      this.visible = false;
    },
    onSelect(value) {
      this.onListHide();
      this.$emit('on-toolselect-click', this.toolbar.name, value);
    }
  }
};
</script>

<style lang="scss">
.editor-toolbar-select {
  height: 100%;
  position: relative;
  border: 1px solid transparent;
  &:hover {
    border-color: #e7e7eb;
  }
  &.toolbar-select-lineheight .edui-toolbar-icon {
    background-position: 20% -477px;
  }
  &.toolbar-select-indentboth .edui-toolbar-icon {
    background-position: 20% -837px;
  }
  .btn-c {
    display: flex;
    align-items: center;
    .edui-button {
      border: none;
      padding: 0;
      background-color: #fff;
      position: relative;
      &:focus {
        outline: none;
      }
      &:disabled {
        opacity: 0.3;
      }
      .edui-toolbar-icon {
        display: inline-block;
        vertical-align: middle;
        background-image: url('~@/assets/images/editor/ueditor_icon.png');
        background-repeat: no-repeat;
        width: 20px;
        height: 20px;
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
