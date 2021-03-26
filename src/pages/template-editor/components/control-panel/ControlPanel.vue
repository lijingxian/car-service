<template>
  <div class="control-panel">
    <brick-control v-if="selectedType==='brick'"></brick-control>
    <simple-text-control
      v-if="selectedType==='simple-text' || selectedType==='text-content' || selectedType === 'text'"
      :showContent="selectedType === 'text-content' || selectedType === 'text'"
      :noStyle="selectedType === 'text-content'"
    ></simple-text-control>
    <image-control v-if="selectedType==='image'"></image-control>
    <btn-control v-if="selectedType==='button'"></btn-control>
    <list-control v-if="selectedType === 'list'"></list-control>
  </div>
</template>

<script>
import BrickControl from './BrickControl';
import SimpleTextControl from './SimpleTextControl';
import ImageControl from './ImageControl';
import BtnControl from './BtnControl';
import ListControl from './ListControl';
import { mapGetters, mapMutations } from 'vuex';

export default {
  name: 'ControlPanel',
  components: {
    SimpleTextControl,
    ImageControl,
    BrickControl,
    BtnControl,
    ListControl
  },
  props: {},
  data() {
    return {};
  },
  computed: {
    ...mapGetters('TemplateEditor', ['selectedType', 'bricks'])
  },
  watch: {},
  created() {},
  methods: {
    ...mapMutations('Site', ['deleteCom', 'deleteBrick'])
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
