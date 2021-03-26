<template>
  <div class="icon-item">
    <div @mouseover="showIcon(true)" @mouseout="showIcon(false)" @click="clickHandle">
      <div class="img-div">
        <img :src="itemData.icon" alt="图标">
      </div>
      <span class="label">{{itemData.name}}</span>
      <i class="el-icon-error close-icon" v-show="showCloseIcon" @click="deleteHandle"></i>
    </div>
  </div>
</template>

<script>
export default {
  name: 'icon-item',
  data() {
    return {
      showCloseIcon: false
    };
  },
  props: {
    itemData: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  components: {},
  computed: {},
  watch: {},
  methods: {
    showIcon(show) {
      this.showCloseIcon = show;
    },
    deleteHandle(e) {
      e.stopPropagation();
      this.$emit('deleteIcon', this.itemData);
    },
    clickHandle() {
      this.$emit('showInfo', this.itemData.id);
    }
  }
};
</script>

<style lang="scss">
.icon-item {
  color: #606266;
  position: relative;
  width: 140px;
  height: 130px;
  padding: 10px;
  font-size: 14px;
  .img-div {
    box-shadow: #bbb 2px 2px 8px;
    border-radius: 5px;
    width: 100%;
    height: 130px;
    overflow: hidden;
    display: flex;
    flex-grow: 0;
    flex-direction: row;
    align-items: center;
    margin: 0 10px 10px 0;
    img {
      display: inline-block;
      width: 100%;
      vertical-align: middle;
    }
  }
  .label {
    display: block;
    width: 100%;
    text-align: center;
  }

  .close-icon {
    font-size: 28px;
    position: absolute;
    top: 5px;
    right: 5px;
    z-index: 10;
  }
}
</style>
