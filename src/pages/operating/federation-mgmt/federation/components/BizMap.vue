<template>
  <div class="map">
    <div class="swich">
      <a href="javascript:;" @click="swich()">
        <div v-show="showPerson" class="icon_map_person"></div>
        <div v-show="showCar" class="icon_map_car"></div>
      </a>
    </div>
    <div id="allmap" class="allmap"></div>
  </div>
</template>
<script>
import head from '@/assets/images/head.png';
export default {
  name: 'BizMap',
  components: {},
  props: {
    value: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      markers: [],
      personMarkers: [],
      showPerson: true,
      showCar: false
    };
  },
  watch: {
    value: {
      handler(newValue, oldValue) {
        // 遍历获取店铺的信息
        this.markers = [];
        this.personMarkers = [];
        this.init();
        for (let i = 0; i < this.value.length; i++) {
          if (
            this.value[i].carState &&
            this.value[i].carState.longitude &&
            this.value[i].carState.latitude
          ) {
            let point = new this.$BMap.Point(
              this.value[i].carState.longitude,
              this.value[i].carState.latitude
            );
            this.addMarker(
              point,
              this.value[i].drivingState,
              this.value[i].bodyStateData,
              this.value[i].icon.path
            );
          }
        }
        // 点聚合
        /* eslint-disable no-new */
        new window.BMapLib.MarkerClusterer(this.map, {
          markers: this.markers
        });
      },
      deep: true
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
    // 增加运营商的点
    addPersonMarker(point) {
      let myIcon = new this.$BMap.Icon(head, new this.$BMap.Size(35, 35));
      let marker = new this.$BMap.Marker(point, { icon: myIcon });
      this.personMarkers.push(marker);
      this.map.addOverlay(marker);
      this.map.centerAndZoom(point, 12);
    },
    // 增加店铺的点
    addMarker(point, drivingState, bodyStateData, carIcon) {
      let myIcon = '';
      if (
        drivingState === '0' ||
        drivingState === '1' ||
        drivingState === '3'
      ) {
        if (bodyStateData) {
          if (
            bodyStateData.value === '2:0;7:0' ||
            bodyStateData.value === '2:0'
          ) {
            myIcon = new this.$BMap.Icon(
              carIcon + '/alarm_green.png',
              new this.$BMap.Size(40, 62)
            );
          } else if (
            bodyStateData.value === '2:1;7:1' ||
            bodyStateData.value === '7:1'
          ) {
            myIcon = new this.$BMap.Icon(
              carIcon + '/sos_green.png',
              new this.$BMap.Size(40, 62)
            );
          } else if (bodyStateData.value === '2:0;7:1') {
            myIcon = new this.$BMap.Icon(
              carIcon + '/warningsos_green.png',
              new this.$BMap.Size(40, 82)
            );
          } else {
            myIcon = new this.$BMap.Icon(
              carIcon + '/map_green.png',
              new this.$BMap.Size(40, 82)
            );
          }
        } else {
          myIcon = new this.$BMap.Icon(
            carIcon + '/map_green.png',
            new this.$BMap.Size(40, 40)
          );
        }
      } else if (drivingState === '2') {
        if (bodyStateData) {
          if (
            bodyStateData.value === '2:0;7:0' ||
            bodyStateData.value === '2:0'
          ) {
            myIcon = new this.$BMap.Icon(
              carIcon + '/alarm_orange.png',
              new this.$BMap.Size(40, 62)
            );
          } else if (
            bodyStateData.value === '2:1;7:1' ||
            bodyStateData.value === '7:1'
          ) {
            myIcon = new this.$BMap.Icon(
              carIcon + '/sos_orange.png',
              new this.$BMap.Size(40, 62)
            );
          } else if (bodyStateData.value === '2:0;7:1') {
            myIcon = new this.$BMap.Icon(
              carIcon + '/warningsos_orange.png',
              new this.$BMap.Size(40, 82)
            );
          } else {
            myIcon = new this.$BMap.Icon(
              carIcon + '/map_orange.png',
              new this.$BMap.Size(40, 82)
            );
          }
        } else {
          myIcon = new this.$BMap.Icon(
            carIcon + '/map_orange.png',
            new this.$BMap.Size(40, 40)
          );
        }
      } else {
        myIcon = new this.$BMap.Icon(
          carIcon + '/map_grey.png',
          new this.$BMap.Size(40, 40)
        );
      }
      let marker = new this.$BMap.Marker(point, { icon: myIcon });
      this.markers.push(marker);
      this.map.addOverlay(marker);
      this.map.centerAndZoom(point, 12);
    },
    // 人车切换
    swich() {
      if (this.showPerson) {
        this.showPerson = false;
        this.showCar = true;
        this.initPersonList();
      } else {
        this.showPerson = true;
        this.showCar = false;
        this.initCarList();
      }
    },
    // 地图上全部车辆
    initCarList() {
      this.markers = [];
      this.personMarkers = [];
      for (let i = 0; i < this.value.length; i++) {
        if (
          this.value[i].carState &&
          this.value[i].carState.longitude &&
          this.value[i].carState.latitude
        ) {
          let point = new this.$BMap.Point(
            this.value[i].carState.longitude,
            this.value[i].carState.latitude
          );
          this.addMarker(
            point,
            this.value[i].drivingState,
            this.value[i].bodyStateData,
            this.value[i].icon.path
          );
        }
      }
      this.map.clearOverlays();
      // 点聚合
      /* eslint-disable no-new */
      new window.BMapLib.MarkerClusterer(this.map, {
        markers: this.markers
      });
    },
    // 地图上全部人
    initPersonList() {
      this.personMarkers = [];
      this.markers = [];
      for (let i = 0; i < this.value.length; i++) {
        if (this.value[i].member.longitude && this.value[i].member.latitude) {
          let personPoint = new this.$BMap.Point(
            this.value[i].member.longitude,
            this.value[i].member.latitude
          );
          this.addPersonMarker(personPoint);
        }
      }
      this.map.clearOverlays();
      // 点聚合
      /* eslint-disable no-new */
      new window.BMapLib.MarkerClusterer(this.map, {
        markers: this.personMarkers
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
  .icon_map_person {
    height: 40px;
    width: 40px;
    background: url('~@/assets/images/icon_map_person.png');
    line-height: 45px;
    text-align: center;
  }
  .icon_map_car {
    height: 40px;
    width: 40px;
    background: url('~@/assets/images/icon_map_car.png');
    line-height: 45px;
    text-align: center;
  }
}
</style>
