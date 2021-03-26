<template>
  <div class="com-item" :style="styleObject">
    <simple-text v-if="comData.type==='simple-text'" :com-data="comData"></simple-text>
    <image-com v-if="comData.type==='image'" :com-data="comData"></image-com>
    <form-com v-if="comData.type==='form'" :com-data="comData"></form-com>
    <tel-com v-if="comData.type==='tel'" :com-data="comData"></tel-com>
    <btn-com v-if="comData.type==='btn'" :com-data="comData"></btn-com>
    <div class="line-wrapper" v-if="isEdit" @mousedown.stop="onPositionChange" @click.stop="onChoose">
      <div class="line" :class="classObject"></div>
      <div class="operator" v-show="isActivited">
        <!-- Simple-Text -->
        <div class="knob left" v-show="isSimpleText" @mousedown.stop="onSimpleTextMousedown('left',$event)"></div>
        <div class="knob right" v-show="isSimpleText" @mousedown.stop="onSimpleTextMousedown('right',$event)"></div>
        <!-- Image -->
        <div class="knob top" v-show="isImage||isTel||isBtn" @mousedown.stop="onImageMousedown"></div>
        <div class="knob right-top" v-show="isImage||isTel||isBtn" @mousedown.stop="onImageMousedown"></div>
        <div class="knob right" v-show="isImage||isTel||isBtn" @mousedown.stop="onImageMousedown"></div>
        <div class="knob right-bottom" v-show="isImage||isTel||isBtn" @mousedown.stop="onImageMousedown"></div>
        <div class="knob bottom" v-show="isImage||isTel||isBtn" @mousedown.stop="onImageMousedown"></div>
        <div class="knob bottom-left" v-show="isImage||isTel||isBtn" @mousedown.stop="onImageMousedown"></div>
        <div class="knob left" v-show="isImage||isTel||isBtn" @mousedown.stop="onImageMousedown"></div>
        <div class="knob left-top" v-show="isImage||isTel||isBtn" @mousedown.stop="onImageMousedown"></div>
      </div>
    </div>
  </div>
</template>

<script>
import SimpleText from './SimpleText';
import ImageCom from './ImageCom';
import FormCom from './FormCom';
import TelCom from './TelCom';
import BtnCom from './BtnCom';
import { mapGetters, mapMutations } from 'vuex';

export default {
  name: 'ComItem',
  components: {
    TelCom,
    BtnCom,
    FormCom,
    ImageCom,
    SimpleText
  },
  props: {
    comData: {},
    isEdit: {
      type: Boolean,
      default() {
        return true;
      }
    }
  },
  data() {
    return {};
  },
  computed: {
    ...mapGetters('Site', ['selectedType', 'selectedComId']),
    isActivited() {
      return this.comData.id === this.selectedComId && this.selectedType === this.comData.type;
    },
    isSimpleText() {
      return this.comData.type === 'simple-text';
    },
    isImage() {
      return this.comData.type === 'image';
    },
    isTel() {
      return this.comData.type === 'tel';
    },
    isBtn() {
      return this.comData.type === 'btn';
    },
    styleObject() {
      let style = {
        width: this.comData.width / 37.5 + 'rem',
        height: this.comData.height / 37.5 + 'rem',
        left: this.comData.x / 37.5 + 'rem',
        top: this.comData.y / 37.5 + 'rem',
        backgroundColor: this.comData.backgroundColor || '',
        'border-radius': this.comData.borderRadius / 37.5 + 'rem'
      };
      return style;
    },
    classObject() {
      return {
        active: this.comData.id === this.selectedComId && this.selectedType === this.comData.type
      };
    }
  },
  watch: {},
  created() {},
  methods: {
    ...mapMutations('Site', [
      'updateSelectedType',
      'updateselectedComId',
      'updateComWidth',
      'updateComHeight',
      'updateComX',
      'updateComY'
    ]),
    onChoose() {
      this.updateselectedComId({
        brickId: this.comData.parentId,
        comId: this.comData.id
      });
      this.updateSelectedType(this.comData.type);
    },
    onSimpleTextMousedown(direction, e) {
      let startX = e.clientX;
      let width = this.comData.width;
      let firstTime = '';
      let lastTime = '';
      firstTime = new Date().getTime();
      let move = moveEvent => {
        // 移动的时候，不需要向后代元素传递事件，只需要单纯的移动就OK
        moveEvent.stopPropagation();
        moveEvent.preventDefault();
        let currX = moveEvent.clientX;
        let currWidth = direction === 'right' ? width + currX - startX : width + startX - currX;
        this.updateComWidth({ width: currWidth, direction });
      };
      let up = () => {
        lastTime = new Date().getTime();
        if (lastTime - firstTime > 200) {
          this.$emit('resize');
        }
        document.removeEventListener('mousemove', move, true);
        document.removeEventListener('mouseup', up, true);
      };
      document.addEventListener('mousemove', move, true);
      document.addEventListener('mouseup', up, true);
      return true;
    },
    onImageMousedown(e) {
      let startX = e.clientX;
      let startY = e.clientY;
      let width = this.comData.width;
      let height = this.comData.height;
      let firstTime = '';
      let lastTime = '';
      firstTime = new Date().getTime();
      let move = moveEvent => {
        // 移动的时候，不需要向后代元素传递事件，只需要单纯的移动就OK
        moveEvent.stopPropagation();
        moveEvent.preventDefault();
        let currX = moveEvent.clientX;
        let currY = moveEvent.clientY;
        let currWidth = width + currX - startX;
        let currHeight = height + currY - startY;
        this.updateComWidth({ width: currWidth });
        this.updateComHeight({ height: currHeight });
      };
      let up = () => {
        lastTime = new Date().getTime();
        if (lastTime - firstTime > 200) {
          this.$emit('resize');
        }
        document.removeEventListener('mousemove', move, true);
        document.removeEventListener('mouseup', up, true);
      };
      document.addEventListener('mousemove', move, true);
      document.addEventListener('mouseup', up, true);
      return true;
    },
    onPositionChange(e) {
      if (!this.isActivited) {
        this.onChoose();
      }
      let startX = e.clientX;
      let startY = e.clientY;
      let x = this.comData.x;
      let y = this.comData.y;
      let firstTime = '';
      let lastTime = '';
      firstTime = new Date().getTime();
      let move = moveEvent => {
        // 移动的时候，不需要向后代元素传递事件，只需要单纯的移动就OK
        moveEvent.stopPropagation();
        moveEvent.preventDefault();
        let currX = x + moveEvent.clientX - startX;
        let currY = y + moveEvent.clientY - startY;
        this.updateComX(currX);
        this.updateComY(currY);
      };
      let up = () => {
        lastTime = new Date().getTime();
        if (lastTime - firstTime > 200) {
          this.$emit('resize');
        }
        document.removeEventListener('mousemove', move, true);
        document.removeEventListener('mouseup', up, true);
      };
      document.addEventListener('mousemove', move, true);
      document.addEventListener('mouseup', up, true);
      return true;
    }
  }
};
</script>

<style lang="scss">
.com-item {
  position: absolute;
  .line-wrapper {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    .line {
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      &.active::before {
        border: 1px solid rgba(0, 0, 0, 0.15);
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
      }
      &.active:after {
        border: 1px dashed #fff;
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
      }
      &:hover::before {
        border: 1px solid rgba(0, 0, 0, 0.15);
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
      }
      &:hover::after {
        border: 1px dashed #fff;
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
      }
    }
    .operator {
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      position: absolute;
      .knob {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        cursor: w-resize;
        pointer-events: auto;
        width: 7px;
        height: 7px;
        box-sizing: border-box;
        border: 1px solid #fff;
        background: #666;
        box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.25);
      }
      .left-top {
        left: -2.5px;
        top: 0.5px;
        cursor: nw-resize;
      }
      .top {
        left: 50%;
        transform: translateX(-50%);
        top: -3.5px;
        cursor: n-resize;
      }
      .right-top {
        right: -3.5px;
        top: 0.5px;
        cursor: ne-resize;
      }
      .right {
        right: -3.5px;
        cursor: e-resize;
      }
      .right-bottom {
        right: -3.5px;
        top: 100%;
        cursor: se-resize;
      }
      .bottom {
        top: 100%;
        left: 50%;
        transform: translateX(-50%);
        cursor: s-resize;
      }
      .bottom-left {
        left: -2.5px;
        top: 100%;
        cursor: sw-resize;
      }
      .left {
        left: -2.5px;
        cursor: w-resize;
      }
    }
  }
}
</style>
