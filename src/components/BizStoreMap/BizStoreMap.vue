<template>
  <div class="map">
    <div id="allmap" class="allmap"></div>
  </div>
</template>
<script>
import operator from '@/assets/images/head.png';
import storeIcon from '@/assets/images/store.png';
export default {
  name: 'BizMap',
  components: {},
  props: {
    value: {
      type: Array,
      default() {
        return [];
      }
    },
    showMode: {
      type: String,
      default() {
        return '1';
      }
    }
  },
  data() {
    return {
      markers: []
    };
  },
  watch: {
    value: {
      handler(newValue, oldValue) {
        // 遍历获取车辆的信息
        this.markers = [];
        this.init();
        for (let i = 0; i < this.value.length; i++) {
          if (this.value[i].longitude && this.value[i].latitude) {
            let point = new this.$BMap.Point(this.value[i].longitude, this.value[i].latitude);
            this.addMarker(point, this.value[i]);
            if (this.value[i].childUsers && this.value[i].childUsers.length > 0) {
              for (let j = 0; j < this.value[i].childUsers.length; j++) {
                if (this.value[i].childUsers[j].longitude && this.value[i].childUsers[j].latitude) {
                  let point = new this.$BMap.Point(this.value[i].childUsers[j].longitude, this.value[i].childUsers[j].latitude);
                  this.addMarker(point, this.value[i].childUsers[j]);
                }
              }
            }
          }
        }
        // 点聚合
        /* eslint-disable no-new */
        new window.BMapLib.MarkerClusterer(this.map, {
          markers: this.markers
        });
      },
      deep: true
    },
    showMode(newValue, oldValue) {
      this.markers = [];
      this.init();
      for (let i = 0; i < this.value.length; i++) {
        if (this.value[i].longitude && this.value[i].latitude) {
          let point = new this.$BMap.Point(this.value[i].longitude, this.value[i].latitude);
          this.addMarker(point, this.value[i]);
          if (this.value[i].childUsers && this.value[i].childUsers.length > 0) {
            for (let j = 0; j < this.value[i].childUsers.length; j++) {
              if (this.value[i].childUsers[j].longitude && this.value[i].childUsers[j].latitude) {
                let point = new this.$BMap.Point(this.value[i].childUsers[j].longitude, this.value[i].childUsers[j].latitude);
                this.addMarker(point, this.value[i].childUsers[j]);
              }
            }
          }
        }
      }
      // 点聚合
      /* eslint-disable no-new */
      new window.BMapLib.MarkerClusterer(this.map, {
        markers: this.markers
      });
    }
  },
  methods: {
    init() {
      this.$BMap = window.BMap;
      this.map = new this.$BMap.Map('allmap');
      this.point = new this.$BMap.Point(116.404, 39.915);
      this.map.centerAndZoom(this.point, 11);
      // 设置为可拖拽
      this.map.enableScrollWheelZoom(true);
      // 城市列表
      this.map.addControl(
        new this.$BMap.CityListControl({
          anchor: this.BMAP_ANCHOR_TOP_LEFT,
          offset: this.$BMap.Size(10, 20)
        })
      );
      // 全景
      this.map.addControl(
        new this.$BMap.PanoramaControl({
          anchor: this.BMAP_ANCHOR_TOP_RIGHT,
          offset: this.$BMap.Size(10, 20)
        })
      );
    },
    // 增加车的点
    addMarker(point, value) {
      let myIcon = '';
      if (value.userType === 'store') {
        myIcon = new this.$BMap.Icon(storeIcon, new this.$BMap.Size(32, 32));
      } else {
        myIcon = new this.$BMap.Icon(operator, new this.$BMap.Size(32, 32));
      }
      myIcon.setImageSize(new this.$BMap.Size(32, 32));
      let marker = new this.$BMap.Marker(point, { icon: myIcon });
      this.markers.push(marker);
      let that = this;
      marker.addEventListener('click', e => {
        that.$emit('addClickHandler', value);
      });
      this.map.addOverlay(marker);
      this.map.centerAndZoom(point, 11);
    },
    // 地图上全部车辆
    initCarList() {
      this.markers = [];
      for (let i = 0; i < this.value.length; i++) {
        if (this.value[i].longitude && this.value[i].latitude) {
          let point = new this.$BMap.Point(this.value[i].longitude, this.value[i].latitude);
          this.addMarker(point, this.value[i]);
        }
      }
      this.map.clearOverlays();
      // 点聚合
      /* eslint-disable no-new */
      new window.BMapLib.MarkerClusterer(this.map, {
        markers: this.markers
      });
    }
  },
  mounted() {
    this.init();
  }
};
</script>

<style lang="scss">
.map {
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: 4px;
  .swich {
    position: absolute;
    top: 170px;
    right: 15px;
    z-index: 10;
  }
  .allmap {
    height: 100%;
  }
}
</style>
