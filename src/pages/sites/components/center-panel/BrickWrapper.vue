<template>
  <div class="brick-wrapper" @drop="onDrop" @dragover.prevent @click="onChoose">
    <brick :brick-data="brickData"></brick>
    <div class="operator-bar" v-show="isActivited">
      <div class="o-top">
        <el-tooltip class="item" effect="dark" content="上插空白模块" placement="right">
          <el-button icon="el-icon-plus" circle @click="onAdd(true)"></el-button>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" v-show="!selectedBrickIsFirst" content="上移" placement="right">
          <el-button icon="el-icon-upload2" circle @click="moveBrickUp"></el-button>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" v-show="!selectedBrickIsLast" content="下移" placement="right">
          <el-button icon="el-icon-download" circle @click="moveBrickDown"></el-button>
        </el-tooltip>
      </div>
      <div class="o-bottom">
        <el-tooltip class="item" effect="dark" content="下插空白模块" placement="right">
          <el-button icon="el-icon-plus" circle @click="onAdd(false)"></el-button>
        </el-tooltip>
      </div>
    </div>
    <div class="operator-height" v-show="isActivited" :class="classObject">
      <el-tooltip effect="dark" content="滑动把手，改变高度" placement="top">
        <div class="o-top" @mousedown="onMousedown"></div>
      </el-tooltip>
      <el-tooltip effect="dark" content="滑动把手，改变高度" placement="bottom">
        <div class="o-bottom" @mousedown="onMousedown"></div>
      </el-tooltip>
    </div>
  </div>
</template>

<script>
import Brick from './Brick';
import { mapGetters, mapMutations } from 'vuex';
import { BrickF, SimpleText, ImageF, FormF, TelF, BtnF } from '../../model';
import uuid from '@/utils/uuid';

export default {
  name: 'BrickWrapper',
  components: {
    Brick
  },
  props: {
    brickData: {}
  },
  data() {
    return {};
  },
  computed: {
    ...mapGetters('Site', ['selectedBrickId', 'selectedBrickIsFirst', 'selectedBrickIsLast']),
    isActivited() {
      return this.brickData.id === this.selectedBrickId;
    },
    classObject() {
      return {
        active: this.brickData.id === this.selectedBrickId
      };
    }
  },
  watch: {},
  created() {},
  methods: {
    ...mapMutations('Site', [
      'updateSelectedType',
      'updateselectedBrickId',
      'updateBrickHight',
      'addBrickChild',
      'addBrick',
      'moveBrick'
    ]),
    moveBrickUp() {
      this.moveBrick(true);
    },
    moveBrickDown() {
      this.moveBrick(false);
    },
    onAdd(isFront) {
      let brick = BrickF();
      brick.id = uuid.getUuid('xxxxxxxxxxxxxxxx');
      this.addBrick({ isFront, brick });
    },
    onDrop(e) {
      if (!this.isActivited) {
        this.onChoose();
      }
      let comType = e.dataTransfer.getData('com-type');
      if (comType === 'simple-text') {
        let simpleText = SimpleText();
        simpleText.id = uuid.getUuid('xxxxxxxxxxxxxxxx');
        simpleText.parentId = this.brickData.id;
        this.addBrickChild(simpleText);
      }
      if (comType === 'image') {
        let imageF = ImageF();
        imageF.id = uuid.getUuid('xxxxxxxxxxxxxxxx');
        imageF.parentId = this.brickData.id;
        this.addBrickChild(imageF);
      }
      if (comType === 'form') {
        let formF = FormF();
        formF.id = uuid.getUuid('xxxxxxxxxxxxxxxx');
        formF.parentId = this.brickData.id;
        this.addBrickChild(formF);
      }
      if (comType === 'tel') {
        let telF = TelF();
        telF.id = uuid.getUuid('xxxxxxxxxxxxxxxx');
        telF.parentId = this.brickData.id;
        this.addBrickChild(telF);
      }
      if (comType === 'btn') {
        let Btn = BtnF();
        Btn.id = uuid.getUuid('xxxxxxxxxxxxxxxx');
        Btn.parentId = this.brickData.id;
        this.addBrickChild(Btn);
      }
    },
    onChoose() {
      this.updateselectedBrickId(this.brickData.id);
      this.updateSelectedType('brick');
    },
    onMousedown(e) {
      let startY = e.clientY;
      let height = this.brickData.height;
      console.log(startY);
      let firstTime = '';
      let lastTime = '';
      firstTime = new Date().getTime();
      let move = moveEvent => {
        // 移动的时候，不需要向后代元素传递事件，只需要单纯的移动就OK
        moveEvent.stopPropagation();
        moveEvent.preventDefault();
        let currY = moveEvent.clientY;
        this.updateBrickHight(height + currY - startY);
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
.brick-wrapper {
  position: relative;
  .operator-bar {
    height: 100%;
    width: 40px;
    top: 0;
    right: -56px;
    margin-top: 0px;
    min-height: 280px;
    position: absolute;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    .el-button {
      margin: 0;
    }
    .o-top {
      display: flex;
      flex-direction: column;
      align-items: center;
      position: absolute;
      top: -20px;
      left: 0;
      .el-button {
        margin-bottom: 16px;
      }
    }
    .o-bottom {
      display: flex;
      flex-direction: column;
      align-items: center;
      position: absolute;
      bottom: -20px;
      left: 0;
    }
  }
  .operator-height {
    position: absolute;
    z-index: 1;
    top: 0;
    height: 100%;
    width: 100%;
    pointer-events: none;
    &.active::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      border: 2px solid #81b0ff;
    }
    .o-top,
    .o-bottom {
      width: 64px;
      height: 16px;
      cursor: ns-resize;
      position: absolute;
      left: 161px;
      background: #fff;
      pointer-events: all;
      display: flex;
      align-items: center;
      justify-content: center;
      &:after {
        content: '';
        display: block;
        width: 26px;
        height: 3px;
        border-top: 1px solid rgba(0, 0, 0, 0.25);
        border-bottom: 1px solid rgba(0, 0, 0, 0.25);
      }
    }
    .o-top {
      top: -16px;
      border-radius: 64px 64px 0 0;
      box-shadow: 0 -2px 10px 0 rgba(0, 0, 0, 0.1);
    }
    .o-bottom {
      bottom: -16px;
      border-radius: 0 0 64px 64px;
      box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.1);
    }
  }
}
</style>
