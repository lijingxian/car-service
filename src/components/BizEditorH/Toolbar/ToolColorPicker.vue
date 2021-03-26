<template>
  <div :class="`editor-toolbar-color-picker toolbar-color-picker-${toolbar.name}`" v-clickoutside="onListHide">
    <el-tooltip popper-class="euditor-tip" effect="dark" :content="toolbar.title" placement="top" :enterable="false">
      <div @click="onListShow" class="btn-c">
        <div class="edui-button">
          <i class="edui-toolbar-icon"></i>
          <i class="colorbar" :style="{backgroundColor: this.toolbar.value}"></i>
        </div>
        <div class="edui-button edui-select">
          <i class="triangle"></i>
        </div>
      </div>
    </el-tooltip>
    <div class="edui-toolpicker-panel" v-show="visible">
      <div class="recent_color color_box">
        <p class="title">最近使用颜色</p>
        <div class></div>
        <div class="clear" title="清除颜色" @click="removeColor"></div>
        <div class="item-wrapper">
          <div class="b-item" v-for="(item,index) in recentColorList" :key="index" :style="{backgroundColor: item}" :title="item" @click="onSelect(item)"></div>
        </div>
      </div>
      <div class="basic_color color_box">
        <p class="title">基本色</p>
        <div class="item-wrapper">
          <div class="b-item" v-for="(item,index) in baseColorList" :key="index" :style="{backgroundColor: item}" :title="item" @click="onSelect(item)"></div>
        </div>
      </div>
      <div class="input_color">
        <div class="preview" :style="{backgroundColor: toolbar.value}" @click="onSelect('#'+toolbar.value)"></div>
        <div class="input_wrap">
          <input type="text" v-model="toolbar.value">
        </div>
        <div class="js_ok" @click="onSelect(toolbar.value)">确认</div>
      </div>
    </div>
  </div>
</template>
<script>
import clickoutside from './utils/clickoutside';
export default {
  name: 'EToolColorPicker',
  props: {
    toolbar: Object
  },
  directives: { clickoutside },
  components: {},
  data() {
    return {
      visible: false,
      baseColorList: [
        '#ffffff',
        '#ffd7d5',
        '#ffdaa9',
        '#fffed5',
        '#d4fa00',
        '#73fcd6',
        '#a5c8ff',
        '#ffacd5',
        '#ff7faa',
        '#d6d6d6',
        '#ffacaa',
        '#ffb995',
        '#fffb00',
        '#73fa79',
        '#00fcff',
        '#78acfe',
        '#d84fa9',
        '#ff4f79',
        '#b2b2b2',
        '#d7aba9',
        '#ff6827',
        '#ffda51',
        '#00d100',
        '#00d5ff',
        '#0080ff',
        '#ac39ff',
        '#ff2941',
        '#888888',
        '#7a4442',
        '#ff4c00',
        '#ffa900',
        '#3da742',
        '#3daad6',
        '#0052ff',
        '#7a4fd6',
        '#d92142',
        '#000000',
        '#7b0c00',
        '#ff4c41',
        '#d6a841',
        '#407600',
        '#007aaa',
        '#021eaa',
        '#797baa',
        '#ab1942'
      ]
    };
  },
  computed: {
    recentColorList() {
      let list = window.localStorage.recentColorList;
      if (list) {
        list = JSON.parse(list);
      } else {
        list = [];
      }
      return list;
    }
  },
  methods: {
    onListShow() {
      this.visible = true;
    },
    onListHide() {
      this.visible = false;
    },
    removeColor() {
      const type = this.toolbar.name === 'backcolor' ? 'background-color' : 'color';
      this.$emit('on-toolpicker-click', 'removeformat', '', type);
      this.toolbar.value = '#FFFFFF';
      this.onListHide();
    },
    onSelect(value) {
      this.$emit('on-toolpicker-click', this.toolbar.name, value);
      this.onListHide();
      this.storeRecentColor(value);
    },
    storeRecentColor(item) {
      let list = this.recentColorList;
      let len = list.unshift(item);
      for (let i = 1; i < len; i++) {
        if (list[i] === item) {
          list.splice(i, 1);
          len--;
          break;
        }
      }
      if (len > 8) {
        list.length = 9;
      }
      window.localStorage.recentColorList = JSON.stringify(list);
    }
  }
};
</script>

<style lang="scss">
.editor-toolbar-color-picker {
  position: relative;
  border: 1px solid transparent;
  &:hover {
    border-color: #e7e7eb;
  }
  &.toolbar-color-picker-forecolor .edui-toolbar-icon {
    background-position: 0 -348px;
  }
  &.toolbar-color-picker-backcolor .edui-toolbar-icon {
    background-position: 0 -378px;
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
        background-image: url('~@/assets/images/editor/ueditor_icons.png');
        background-repeat: no-repeat;
        width: 20px;
        height: 20px;
      }

      .colorbar {
        position: absolute;
        left: 3px;
        bottom: 1px;
        width: 13px;
        height: 3px;
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
  .edui-toolpicker-panel {
    width: 258px;
    height: 280px;
    padding: 5px 10px;
    box-sizing: border-box;
    position: absolute;
    left: 0;
    border: 1px solid #e7e7eb;
    background-color: #fff;
    z-index: 10000;
    .color_box {
      .title {
        color: #8d8d8d;
        font-size: 13px;
        margin: 5px 0;
      }
      .item-wrapper {
        display: flex;
        flex-wrap: wrap;
      }
      .b-item {
        width: 20px;
        height: 20px;
        margin: 0 4px 4px 0;
        border: 1px solid #e7e7eb;
        cursor: pointer;
      }
      .clear {
        background: url('~@/assets/images/editor/ueditor_icons.png') 0 -1070px no-repeat;
        background-color: transparent;
        border: none;
      }
    }
    .input_color {
      margin: 10px 0;
      padding-top: 10px;
      border-top: 1px solid #e7e7eb;
      display: flex;
      align-items: center;
      .input_wrap {
        display: inline-block;
        vertical-align: middle;
        position: relative;
        .icon {
          position: absolute;
          left: 4px;
          height: 24px;
          line-height: 24px;
        }
      }
      input {
        height: 24px;
        box-sizing: border-box;
        vertical-align: middle;
        margin-right: 5px;
        border: 1px solid #e7e7eb;
        outline: none;
      }
      .preview {
        height: 20px;
        width: 20px;
        margin: 0 5px;
      }
      input {
        color: #8d8d8d;
        position: relative;
        width: 100px;
        font-size: 15px;
      }
      .js_ok {
        color: #8d8d8d;
        border: 1px solid #e7e7eb;
        padding: 0 10px;
        border-radius: 4px;
        background-color: #fff;
        cursor: pointer;
        &:hover {
          border-color: #dadbe0;
        }
      }
    }
  }
}
</style>
