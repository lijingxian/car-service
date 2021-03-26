<template>
  <div class="control-panel">
    <brick-control v-if="selectedType==='brick'"></brick-control>
    <simple-text-control v-if="selectedType==='simple-text'"></simple-text-control>
    <image-control v-if="selectedType==='image'"></image-control>
    <form-control v-if="selectedType==='form'"></form-control>
    <tel-control v-if="selectedType==='tel'"></tel-control>
    <btn-control v-if="selectedType==='btn'"></btn-control>
    <el-button v-show="isCom||isBrick" @click="onDelete" :disabled="isDisabled" round icon="el-icon-delete">{{btnString}}</el-button>
  </div>
</template>

<script>
import BrickControl from './BrickControl';
import SimpleTextControl from './SimpleTextControl';
import FormControl from './FormControl';
import ImageControl from './ImageControl';
import TelControl from './TelControl';
import BtnControl from './BtnControl';
import { mapGetters, mapMutations } from 'vuex';

export default {
  name: 'ControlPanel',
  components: {
    TelControl,
    FormControl,
    BrickControl,
    BtnControl,
    SimpleTextControl,
    ImageControl
  },
  props: {},
  data() {
    return {};
  },
  computed: {
    ...mapGetters('Site', ['selectedType', 'bricks']),
    isDisabled() {
      return this.selectedType === 'brick' && this.bricks.length === 1;
    },
    isCom() {
      return (
        this.selectedType === 'image' ||
        this.selectedType === 'simple-text' ||
        this.selectedType === 'form' ||
        this.selectedType === 'tel' ||
        this.selectedType === 'btn'
      );
    },
    isBrick() {
      return this.selectedType === 'brick';
    },
    btnString() {
      return this.isBrick ? '删除当前模块' : '删除当前组件';
    }
  },
  watch: {},
  created() {},
  methods: {
    ...mapMutations('Site', ['deleteCom', 'deleteBrick']),
    onDelete() {
      if (this.isCom) {
        this.deleteCom();
      } else {
        this.deleteBrick();
      }
    }
  }
};
</script>

<style lang="scss">
.control-panel {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding: 0 10px;
  background-color: #fff;
  > .el-button {
    margin-top: 40px;
  }
}
</style>
