<template>
  <div :class="`editor-toolbar-btn toolbar-btn-${toolbar.name}${toolbar.value}`">
    <el-tooltip popper-class="euditor-tip" effect="dark" :content="toolbar.title" placement="top" :enterable="false">
      <div :disabled="disabled" :class="{'checked': this.checked}" @click="onClick" class="toolbar-btn">
        <i class="weui_edui_icon"></i>
      </div>
    </el-tooltip>
  </div>
</template>
<script>
export default {
  name: 'EToolButton',
  props: {
    toolbar: Object,
    imageFloatMask: Boolean
  },
  computed: {
    disabled() {
      return this.toolbar.disabled;
    },
    checked() {
      return this.toolbar.checked;
    }
  },
  methods: {
    onClick() {
      this.$emit('on-toolbutton-click', this.toolbar.name, this.toolbar.value);
    }
  },
  mounted() {}
};
</script>

<style lang="scss">
.editor-toolbar-btn {
  margin: 0 1px;
  .toolbar-btn {
    border: 1px solid transparent;
    &:hover,
    &.checked {
      border-color: #e7e7eb;
    }
    &:active {
      background-color: rgb(231, 231, 231);
    }
    .weui_edui_icon {
      display: inline-block;
      vertical-align: middle;
      background-image: url('~@/assets/images/editor/ueditor_icons.png');
      background-repeat: no-repeat;
      width: 20px;
      height: 20px;
    }
  }
  &.toolbar-btn-blockquote .weui_edui_icon {
    background-position: 0 -318px;
  }
  &.toolbar-btn-horizontal .weui_edui_icon {
    background-position: 0 -679px;
  }
  &.toolbar-btn-bold .weui_edui_icon {
    background-position: 0 -228px;
  }
  &.toolbar-btn-italic .weui_edui_icon {
    background-position: 0 -258px;
  }
  &.toolbar-btn-underline .weui_edui_icon {
    background-position: 0 -288px;
  }
  &.toolbar-btn-indent .weui_edui_icon {
    background-position: 0 -1107px;
  }
  &.toolbar-btn-justifyleft .weui_edui_icon {
    background-position: 0 -408px;
  }
  &.toolbar-btn-justifycenter .weui_edui_icon {
    background-position: 0 -438px;
  }
  &.toolbar-btn-justifyright .weui_edui_icon {
    background-position: 0 -468px;
  }
  &.toolbar-btn-justifyjustify .weui_edui_icon {
    background-position: 0 -499px;
  }
  &.toolbar-btn-lineheight .weui_edui_icon {
    background-position: 0 -589px;
  }
  &.toolbar-btn-uploadimage .weui_edui_icon {
    background-position: 0 -739px;
  }
  &.toolbar-btn-uploadvideo .weui_edui_icon {
    background-position: 0 -769px;
  }
}
</style>
