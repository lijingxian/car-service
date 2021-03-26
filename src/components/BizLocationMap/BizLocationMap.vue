<template>
  <div class="loc-map">
    <div ref="allmap" class="allmap"></div>
  </div>
</template>
<script>
export default {
  name: 'BizMap',
  components: {},
  props: {
    value: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      markers: []
    };
  },
  methods: {
    init() {
      this.$BMap = window.BMap;
      this.map = new this.$BMap.Map(this.$refs.allmap);
      this.point = new this.$BMap.Point(this.value.lng, this.value.lat);
      let marker = new this.$BMap.Marker(this.point);
      this.map.addOverlay(marker);
      marker.addEventListener('click', e => {
        this.$emit('addClickHandler', this.value);
        console.log(this.value);
      });
      let label = new this.$BMap.Label(this.value.addr || this.value.address, {
        offset: new this.$BMap.Size(20, -10)
      });
      marker.setLabel(label);
      this.map.centerAndZoom(this.point, 5);
      // 设置为可拖拽
      this.map.enableScrollWheelZoom(true);
    },
    clearOverlays() {
      this.map.clearOverlays();
    }
  },
  mounted() {
    this.init();
  }
};
</script>

<style lang="scss">
.loc-map {
  width: 450px;
  height: 300px;
  overflow: hidden;
  border-radius: 4px;
  .allmap {
    height: 100%;
  }
}
</style>
