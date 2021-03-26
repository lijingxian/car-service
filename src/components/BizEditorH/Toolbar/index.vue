<template>
  <div class="biz-editor-toolbar">
    <div class="toolbar-row" v-for="(toolbarRow, row) in toolbars" :key="row">
      <div v-for="(toolbar, col) in toolbarRow" class="toolitem" :key="col">
        <ToolButton v-if="toolbar.type === 'toolbtn'" :toolbar="toolbar" @on-toolbutton-click="handleButtonClick"></ToolButton>
        <ToolColorPicker ref="picker" v-if="toolbar.type === 'toolcolorpicker'" :toolbar="toolbar" @on-toolpicker-click="handleButtonClick"></ToolColorPicker>
        <ToolSelect ref="picker" v-if="toolbar.type === 'toolselect'" :toolbar="toolbar" @on-toolselect-click="handleButtonClick"></ToolSelect>
        <ToolInput ref="inputPicker" v-if="toolbar.type === 'toolinput'" :toolbar="toolbar" @on-toolinput-click="handleButtonClick"></ToolInput>
        <span class="toolseparator" v-if="toolbar.type === 'separator'" :key="row + '|' + col"></span>
      </div>
    </div>
  </div>
</template>
<script>
import clickoutside from './utils/clickoutside';
import ToolInput from './ToolInput';
import ToolButton from './ToolButton';
import ToolSelect from './ToolSelect';
import ToolColorPicker from './ToolColorPicker';
export default {
  name: 'toolbar-component',
  components: { ToolInput, ToolButton, ToolSelect, ToolColorPicker },
  directives: { clickoutside },
  props: {
    listVisible: Boolean,
    imageFloatMask: Boolean,
    toolbars: {
      type: Array,
      default() {
        return [
          [
            {
              name: 'undo',
              title: '撤销',
              type: 'toolbtn',
              status: 'disabled'
            },
            {
              name: 'redo',
              title: '重做',
              type: 'toolbtn',
              status: 'disabled'
            },
            {
              type: 'separator'
            },
            {
              name: 'fontsize',
              title: '字号',
              type: 'toolinput'
            },
            {
              name: 'blockquote',
              title: '引用',
              type: 'toolbtn',
              status: 'checked'
            },
            {
              name: 'horizontal',
              title: '分割线',
              type: 'toolbtn',
              status: ''
            },
            {
              name: 'removeformat',
              title: '清除格式',
              type: 'toolbtn',
              status: ''
            },
            {
              name: 'formatmatch',
              title: '格式刷',
              type: 'toolbtn',
              status: ''
            },
            {
              name: 'simpleupload',
              title: '图片上传',
              type: 'toolbtn',
              status: ''
            },
            {
              name: 'insertvideo',
              title: '视频',
              type: 'toolbtn',
              status: ''
            }
          ],
          [
            {
              name: 'bold',
              title: '加粗',
              type: 'toolbtn',
              status: 'checked'
            },
            {
              name: 'italic',
              title: '斜体',
              type: 'toolbtn',
              status: 'checked'
            },
            {
              name: 'underline',
              title: '下划线',
              type: 'toolbtn',
              status: ''
            },
            {
              name: 'forecolor',
              title: '字体颜色',
              type: 'toolcolorpicker'
            },
            {
              name: 'backcolor',
              title: '背景色',
              type: 'toolcolorpicker'
            },
            {
              type: 'separator'
            },
            {
              name: 'indent',
              title: '首行缩进',
              type: 'toolbtn',
              status: 'checked'
            },
            {
              type: 'separator'
            },
            {
              name: 'justify',
              title: '居左对齐',
              type: 'toolbtn',
              value: 'left',
              status: 'checked'
            },
            {
              name: 'justify',
              title: '居中对齐',
              type: 'toolbtn',
              value: 'center',
              status: 'checked'
            },
            {
              name: 'justify',
              title: '居右对齐',
              type: 'toolbtn',
              value: 'right',
              status: 'checked'
            },
            {
              name: 'justify',
              title: '两端对齐',
              type: 'toolbtn',
              value: 'justify',
              status: 'checked'
            },
            {
              type: 'separator'
            },
            {
              name: 'rowspacing',
              title: '段前距',
              type: 'toolselect',
              value: 'top'
            },
            {
              name: 'rowspacing',
              title: '段后距',
              type: 'toolselect',
              value: 'bottom'
            },
            {
              name: 'lineheight',
              title: '行间距',
              type: 'toolselect'
            },
            {
              type: 'separator'
            },
            {
              name: 'orderedlist',
              title: '有序列表',
              type: 'toolselect',
              prefix: 'insert'
            },
            {
              name: 'unorderedlist',
              title: '无序列表',
              type: 'toolselect',
              prefix: 'insert'
            },
            {
              type: 'separator'
            },
            {
              name: 'imagefloat',
              title: '默认',
              type: 'toolbtn',
              value: 'none',
              status: 'checked disabled'
            },
            {
              name: 'imagefloat',
              title: '左浮动',
              type: 'toolbtn',
              value: 'left',
              status: 'checked disabled'
            },
            {
              name: 'imagefloat',
              title: '右浮动',
              type: 'toolbtn',
              value: 'right',
              status: 'checked disabled'
            },
            {
              name: 'imagefloat',
              title: '居中',
              type: 'toolbtn',
              value: 'center',
              status: 'checked disabled'
            },
            {
              name: 'insertImage',
              title: '图片',
              type: 'extra-button'
            }
          ]
        ];
      }
    }
  },
  data() {
    return {};
  },
  methods: {
    clearVisible() {
      this.$refs.picker.forEach(picker => {
        picker.onListHide();
      });
      this.$refs.inputPicker.forEach(picker => {
        picker.onListHide();
      });
    },
    handleButtonClick(name, value) {
      this.$emit('on-editor-execCommand', name, value);
    }
  }
};
</script>

<style lang="scss">
.biz-editor-toolbar {
  border-bottom: 1px solid #e7e7eb;
  padding: 5px 15px;
  display: flex;
  flex-direction: column;
  .toolbar-row {
    padding: 5px 0;
    display: flex;
    flex-wrap: wrap;
  }
  .toolseparator {
    width: 1px;
    height: 20px;
    display: inline-block;
    background-color: #e7e7eb;
    margin: 4px 4px;
    vertical-align: middle;
  }
}

.el-tooltip__popper.euditor-tip {
  background: #585e6b;
  .popper__arrow {
    &::after {
      border-top-color: #585e6b;
    }
  }
}
</style>
