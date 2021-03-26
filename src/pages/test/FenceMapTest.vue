<template>
<div style="height:100%">
  <div class="biz-fence-map">
    <div id="fencemap" class="fencemap"></div>
  </div>
  <div id="r-result" style="position:absolute;top:0px;z-index:1000">
    经度: <el-input v-model="longitude" type="text" style="width:100px; margin-right:10px;" size="mini"/>
    纬度: <el-input  v-model="latitude" type="text" style="width:100px; margin-right:10px;" size="mini"/>
    <el-button type="primary" @click="theLocation" size="mini">查询</el-button>
  </div>
</div>
</template>
<script>
export default {
  name: 'BizFenceMap',
  components: {},
  props: {
    value: {
      type: Array,
      default() {
        return [];
      }
    },
    type: {
      type: String,
      default() {
        return '0';
      }
    },
    carState: {
      type: Object,
      default() {
        return {};
      }
    },
    icon: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      longitude: '',
      latitude: '',
      params: {
        points:
          '121.08142,38.073342;121.07669,38.006312;121.000644,37.922591;120.974045,37.908216;120.948063,37.900611;120.881511,37.892519;120.631455,37.883479;120.601223,37.888698;120.576019,37.928386;120.567815,37.975632;120.578492,38.056557;120.590772,38.105267;120.619948,38.151518;120.665135,38.179893;120.727807,38.240244;120.790449,38.328649;120.832663,38.378334;120.885363,38.44834;120.940498,38.451924;120.985354,38.450088;121.007769,38.441141;121.020147,38.411553;121.069183,38.16819;121.08142,38.073342',
        rectLng1: '',
        rectLat1: '',
        rectLng2: '',
        rectLat2: '',
        rectLng3: '',
        rectLat3: '',
        rectLng4: '',
        rectLat4: '',
        circleLng: '',
        circleLat: '',
        radius: '',
        polygon: '',
        area: ''
      },
      fenceType: '',
      overlaysCache: [],
      styleOptions: {
        strokeColor: 'red', // 边线颜色。
        fillColor: 'red', // 填充颜色。当参数为空时，圆形将没有填充效果。
        strokeWeight: 3, // 边线的宽度，以像素为单位。
        strokeOpacity: 0.8, // 边线透明度，取值范围0 - 1。
        fillOpacity: 0.6, // 填充的透明度，取值范围0 - 1。
        strokeStyle: 'solid' // 边线的样式，solid或dashed。
      }
    };
  },
  watch: {},
  methods: {
    theLocation() {
      if (this.longitude && this.latitude) {
        let newPoint = new this.$BMap.Point(this.longitude, this.latitude);
        let marker = new this.$BMap.Marker(newPoint); // 创建标注
        this.map.addOverlay(marker); // 将标注添加到地图中
      }
    },
    // 编辑围栏
    initEditFenceMap() {
      let arrPolygon = [];
      arrPolygon = this.params.points.split(';');
      let newOverlay = [];
      for (let i = 0; i < arrPolygon.length; i++) {
        let splitTemp = [];
        splitTemp = arrPolygon[i].split(',');
        newOverlay.push(new this.$BMap.Point(splitTemp[0], splitTemp[1]));
      }

      let myOverlay = newOverlay;
      let myPolygon = new this.$BMap.Polygon(myOverlay, this.styleOptions);
      this.map.addOverlay(myPolygon); // 增加多边形
      if (newOverlay.length > 0) {
        this.map.centerAndZoom(newOverlay[0], 13);
      }
    }
  },
  created() {
    this.fenceType = this.type;
  },
  mounted() {
    this.$BMap = window.BMap;
    this.map = new this.$BMap.Map('fencemap');
    this.map.enableScrollWheelZoom(true);
    this.initEditFenceMap();
  }
};
</script>

<style lang="scss">
.biz-fence-map {
  height: 100%;
  overflow: hidden;
  border-radius: 4px;
  .fencemap {
    height: 100%;
  }
}
</style>
